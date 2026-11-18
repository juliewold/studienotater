import { getAIAuthHeaders } from "../../lib/aiAuth";
import { supabase } from "../../lib/supabase";
import { getNotesBySubject } from "../notes/notesService";
import { getSubtopicLinksForNotes } from "../notes/noteSubtopicsService";
import { notifyNotesChanged } from "../notes/notesNavigationEvents";
import { getAllSubtopicsBySubject, getTopicsBySubject } from "../subjects/subjectStructureService";

export type GenerateSubjectStructureResult = {
  topicsCreated: number;
  subtopicsCreated: number;
  topicsReused: number;
  subtopicsReused: number;
  notesOrganized: number;
  notesSkipped: number;
  structureStatus: "completed" | "no-content" | "not-requested";
};

export const emptyStructureResult = (): GenerateSubjectStructureResult => ({
  topicsCreated: 0, subtopicsCreated: 0, topicsReused: 0, subtopicsReused: 0,
  notesOrganized: 0, notesSkipped: 0, structureStatus: "not-requested",
});

// The AI service fails on large requests, so notes are sent in small batches: at most this many
// characters of text and this many notes per request.
const BATCH_TEXT_LIMIT = 15_000;
const BATCH_NOTE_LIMIT = 8;

const plainText = (html: string) => new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ?? "";

/** Groups notes into batches within the limits above. A single long note is its own batch. */
function batchNotes<T extends { content: string }>(notes: T[]): T[][] {
  const batches: T[][] = [];
  let current: T[] = [];
  let size = 0;

  for (const note of notes) {
    const length = plainText(note.content).length;

    if (current.length > 0 && (size + length > BATCH_TEXT_LIMIT || current.length >= BATCH_NOTE_LIMIT)) {
      batches.push(current);
      current = [];
      size = 0;
    }

    current.push(note);
    size += length;
  }

  if (current.length > 0) batches.push(current);
  return batches;
}

export async function generateAndSaveSubjectStructure(
  subjectId: string,
  subjectName: string,
): Promise<GenerateSubjectStructureResult> {
  const notes = await getNotesBySubject(subjectId);
  const withContent = notes.filter(note => plainText(note.content));
  if (!withContent.length) return { ...emptyStructureResult(), structureStatus: "no-content", notesSkipped: notes.length };

  const links = await getSubtopicLinksForNotes(notes.map(note => note.id));
  const protectedNotes = new Set(links.map(link => link.noteId));
  const eligible = new Set(withContent.filter(note => !note.subtopicId && !protectedNotes.has(note.id)).map(note => note.id));
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) throw new Error("VITE_API_URL is not configured.");

  // Batches run one after another. Each batch reads the topics saved by the batches before it,
  // so later batches reuse them instead of creating duplicates.
  const batches = batchNotes(withContent.filter(note => eligible.has(note.id)));
  const totals = { topicsCreated: 0, subtopicsCreated: 0, topicsReused: 0, subtopicsReused: 0, notesOrganized: 0, notesSkipped: 0 };

  for (const [index, batch] of batches.entries()) {
    const [topics, subtopics] = await Promise.all([getTopicsBySubject(subjectId), getAllSubtopicsBySubject(subjectId)]);

    const response = await fetch(`${apiUrl}/api/concepts/generate-structure/`, {
      method: "POST",
      headers: await getAIAuthHeaders(),
      body: JSON.stringify({
        subjectName,
        notes: batch.map(note => ({ id: note.id, title: note.title, content: note.content, organize: true })),
        existingTopics: topics.map(topic => ({ id: topic.id, name: topic.name,
          subtopics: subtopics.filter(subtopic => subtopic.topicId === topic.id).map(({ id, name }) => ({ id, name })),
        })),
      }),
    });
    if (!response.ok) {
      const failure = await response.json().catch(() => null);
      const detail = typeof failure?.error === "string" ? failure.error : "Kunne ikke generere fagstruktur.";
      throw new Error(`${detail} Gruppe ${index + 1} av ${batches.length} feilet. Grupper før den er lagret.`);
    }
    const plan = await response.json();
    // Notes the AI could not place are not in the plan, so only placed notes are passed on.
    const placedIds = new Set<string>(
      (plan.topics ?? []).flatMap((topic: { subtopics: { noteIds: string[] }[] }) =>
        topic.subtopics.flatMap(subtopic => subtopic.noteIds)),
    );
    // One transaction rechecks ownership, reuse and manual placements at save time.
    // Never fall back to separate REST writes: those cannot preserve both links atomically.
    const { data, error } = await supabase.rpc("complete_subject_structure", {
      p_subject_id: subjectId,
      p_plan: plan,
      p_note_ids: batch.filter(note => placedIds.has(note.id)).map(note => note.id),
    });
    if (error) {
      throw new Error(`Kunne ikke bekrefte lagring av gruppe ${index + 1} av ${batches.length}. Ved databasefeil rulles den gruppen tilbake. Kontroller strukturen før du prøver igjen. ` + error.message);
    }
    totals.topicsCreated += data.topicsCreated;
    totals.subtopicsCreated += data.subtopicsCreated;
    totals.topicsReused += data.topicsReused;
    totals.subtopicsReused += data.subtopicsReused;
    totals.notesOrganized += data.notesOrganized;
    totals.notesSkipped += data.notesSkipped;
  }

  notifyNotesChanged();
  return {
    ...totals,
    notesSkipped: notes.length - totals.notesOrganized,
    structureStatus: "completed",
  };
}
