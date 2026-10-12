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

export async function generateAndSaveSubjectStructure(
  subjectId: string,
  subjectName: string,
): Promise<GenerateSubjectStructureResult> {
  const [notes, topics, subtopics] = await Promise.all([
    getNotesBySubject(subjectId), getTopicsBySubject(subjectId), getAllSubtopicsBySubject(subjectId),
  ]);
  const withContent = notes.filter(note => new DOMParser().parseFromString(note.content, "text/html").body.textContent?.trim());
  if (!withContent.length) return { ...emptyStructureResult(), structureStatus: "no-content", notesSkipped: notes.length };

  const links = await getSubtopicLinksForNotes(notes.map(note => note.id));
  const protectedNotes = new Set(links.map(link => link.noteId));
  const eligible = new Set(withContent.filter(note => !note.subtopicId && !protectedNotes.has(note.id)).map(note => note.id));
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) throw new Error("VITE_API_URL is not configured.");

  const response = await fetch(`${apiUrl}/api/concepts/generate-structure/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subjectName,
      notes: withContent.map(note => ({ id: note.id, title: note.title, content: note.content, organize: eligible.has(note.id) })),
      existingTopics: topics.map(topic => ({ id: topic.id, name: topic.name,
        subtopics: subtopics.filter(subtopic => subtopic.topicId === topic.id).map(({ id, name }) => ({ id, name })),
      })),
    }),
  });
  if (!response.ok) {
    const failure = await response.json().catch(() => null);
    throw new Error(typeof failure?.error === "string" ? failure.error : "Kunne ikke generere fagstruktur. Ingen struktur er lagret.");
  }
  const plan = await response.json();
  // One transaction rechecks ownership, reuse and manual placements at save time.
  // Never fall back to separate REST writes: those cannot preserve both links atomically.
  const { data, error } = await supabase.rpc("complete_subject_structure", {
    p_subject_id: subjectId,
    p_plan: plan,
    p_note_ids: [...eligible],
  });
  if (error) {
    throw new Error("Kunne ikke bekrefte lagring av fagstrukturen. Ved databasefeil rulles hele struktursteget tilbake; ved nettverksbrudd kan det ha blitt fullført. Kontroller strukturen før du prøver igjen. " + error.message);
  }
  notifyNotesChanged();
  return { ...data, notesSkipped: notes.length - eligible.size + data.notesSkipped, structureStatus: "completed" };
}
