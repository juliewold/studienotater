import { supabase } from "../../lib/supabase";
import { getNotesBySubject, type DatabaseNote } from "../notes/notesService";
import { getSubtopicLinksForNotes, type NoteSubtopicLink } from "../notes/noteSubtopicsService";
import { getSubtopicsByTopic, getTopicsBySubject } from "./subjectStructureService";
import type { Concept } from "../../data/concepts/types";

export type TopicBlock = { html: string; latex?: string; note: DatabaseNote; kind: "rule" | "example" };

// Both the primary placement and additional links count; a note appears only once.
export function selectTopicNotes(notes: DatabaseNote[], links: NoteSubtopicLink[], subtopicIds: string[]) {
  const ids = new Set(subtopicIds);
  const linked = new Set(links.filter(link => ids.has(link.subtopicId)).map(link => link.noteId));
  return notes.filter(note => (note.subtopicId && ids.has(note.subtopicId)) || linked.has(note.id));
}

export function extractTopicBlocks(notes: DatabaseNote[]): TopicBlock[] {
  return notes.flatMap(note => {
    const doc = new DOMParser().parseFromString(note.content, "text/html");
    return Array.from(doc.querySelectorAll<HTMLElement>(
      '[data-type="callout"][data-callout-type="example"], [data-type="callout"][data-callout-type="theorem"], [data-type="block-math"]',
    )).filter(element => !element.parentElement?.closest('[data-type="callout"][data-callout-type="example"], [data-type="callout"][data-callout-type="theorem"]'))
      .map(element => ({ html: element.outerHTML, latex: element.dataset.type === "block-math" ? element.dataset.latex : undefined, note,
        kind: element.dataset.calloutType === "example" ? "example" as const : "rule" as const }));
  });
}

export async function loadTopicLearning(subjectId: string, topicId: string) {
  const topics = await getTopicsBySubject(subjectId);
  const topic = topics.find(item => item.id === topicId);
  if (!topic) throw new Error("Fant ikke temaet i dette faget.");
  const [subtopics, notes, introductionResult] = await Promise.all([
    getSubtopicsByTopic(topicId), getNotesBySubject(subjectId),
    supabase.from("topic_introductions").select("introduction").eq("topic_id", topicId).maybeSingle(),
  ]);
  const links = await getSubtopicLinksForNotes(notes.map(note => note.id));
  const topicNotes = selectTopicNotes(notes, links, subtopics.map(subtopic => subtopic.id));
  const concepts: Concept[] = [];
  if (subtopics.length) {
    const { data: links, error: linkError } = await supabase.from("concept_subtopics")
      .select("concept_id")
      .in("subtopic_id", subtopics.map(subtopic => subtopic.id));
    if (linkError) throw linkError;
    const ids = [...new Set((links ?? []).map(link => link.concept_id as string))];
    // The existing database has no PostgREST relationship for this join.
    for (let start = 0; start < ids.length; start += 100) {
      const { data, error } = await supabase.from("concepts")
        .select("id, name, slug, type, short_definition, explanation")
        .in("id", ids.slice(start, start + 100));
      if (error) throw error;
      for (const row of data ?? []) {
        concepts.push({ id: row.id, name: row.name, slug: row.slug, type: row.type as Concept["type"],
          shortDefinition: row.short_definition, explanation: row.explanation ?? undefined,
          subjectIds: [subjectId], relatedConceptIds: [] });
      }
    }
  }
  concepts.sort((a, b) => a.name.localeCompare(b.name, "nb"));
  return { topic, subtopics, notes: topicNotes, concepts, blocks: extractTopicBlocks(topicNotes),
    introduction: introductionResult.data?.introduction ?? "",
    introductionError: introductionResult.error ? "Introduksjonen kunne ikke hentes. Kontroller at temasidemigreringen er kjørt." : "" };
}

export async function saveTopicIntroduction(topicId: string, introduction: string) {
  const { data, error } = await supabase.from("topic_introductions")
    .upsert({ topic_id: topicId, introduction: introduction.trim() }, { onConflict: "topic_id" })
    .select("introduction").single();
  if (error) throw error;
  return data.introduction as string;
}
