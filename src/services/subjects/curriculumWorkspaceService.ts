import { supabase } from "../../lib/supabase";
import { getCurriculumConfig } from "../../data/curriculum";
import type { CurriculumConfig } from "../../data/curriculum/types";
import type { Concept } from "../../data/concepts/types";
import { getTopicsBySubject } from "./subjectStructureService";
import { getNoteMetadataBySubject, type NoteMetadata } from "../notes/notesService";
import { getSubtopicLinksForNotes, type NoteSubtopicLink } from "../notes/noteSubtopicsService";
import { getPdfsBySubject, type DatabasePdf } from "../media/pdfsService";
import { NOTES_CHANGED } from "../notes/notesNavigationEvents";
import { CONCEPTS_CHANGED } from "../concepts/conceptContentEvents";
import { buildCurriculumUnits, type CurriculumTopic, type CurriculumUnit, type NoteSource, type WorkspaceConcept } from "./curriculumContent";

export type CurriculumWorkspace = {
  subjectId: string;
  config?: CurriculumConfig;
  topics: CurriculumTopic[];
  units: CurriculumUnit[];
  notes: NoteMetadata[];
  noteLinks: NoteSubtopicLink[];
  concepts: WorkspaceConcept[];
  pdfs: DatabasePdf[];
  introductions: Record<string, string>;
};

// Egress: the workspace holds metadata only. Note HTML is fetched per note,
// without editor JSON, the first time a page needs it, and reused afterwards.
const workspaces = new Map<string, Promise<CurriculumWorkspace>>();
const noteContents = new Map<string, Promise<string>>();
export function invalidateCurriculumWorkspace() { workspaces.clear(); }
if (typeof window !== "undefined") {
  window.addEventListener(NOTES_CHANGED, () => { workspaces.clear(); noteContents.clear(); });
  window.addEventListener(CONCEPTS_CHANGED, invalidateCurriculumWorkspace);
}

const chunks = <T,>(items: T[], size = 100) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));

async function loadStructure(subjectId: string): Promise<CurriculumTopic[]> {
  const topics = await getTopicsBySubject(subjectId);
  if (!topics.length) return [];
  // One request for all subtopics instead of one per topic.
  const { data, error } = await supabase.from("subtopics").select("id, topic_id, name, sort_order")
    .in("topic_id", topics.map(topic => topic.id))
    .order("sort_order", { ascending: true }).order("name", { ascending: true });
  if (error) throw error;
  const subtopics = (data ?? []).map(row => ({ id: row.id, topicId: row.topic_id, name: row.name, sortOrder: row.sort_order }));
  return topics.map(topic => ({ ...topic, subtopics: subtopics.filter(subtopic => subtopic.topicId === topic.id) }));
}

async function loadConcepts(subjectId: string, subtopicIds: string[]): Promise<WorkspaceConcept[]> {
  const memberships = new Map<string, Set<string>>();
  for (const ids of chunks(subtopicIds)) {
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabase.from("concept_subtopics").select("concept_id, subtopic_id")
        .in("subtopic_id", ids).order("concept_id").order("subtopic_id").range(offset, offset + 999);
      if (error) throw error;
      for (const row of data ?? []) {
        const set = memberships.get(row.concept_id) ?? new Set<string>();
        set.add(row.subtopic_id);
        memberships.set(row.concept_id, set);
      }
      if (!data || data.length < 1000) break;
    }
  }
  const concepts: WorkspaceConcept[] = [];
  // The explanation column is only needed on the concept page itself.
  for (const ids of chunks([...memberships.keys()])) {
    const { data, error } = await supabase.from("concepts").select("id, name, slug, type, short_definition").in("id", ids);
    if (error) throw error;
    for (const row of data ?? []) concepts.push({
      id: row.id, name: row.name, slug: row.slug, type: row.type as Concept["type"], shortDefinition: row.short_definition ?? "",
      subjectIds: [subjectId], relatedConceptIds: [], subtopicIds: [...(memberships.get(row.id) ?? [])],
    });
  }
  return concepts.sort((a, b) => a.name.localeCompare(b.name, "nb"));
}

async function loadIntroductions(topicIds: string[]) {
  if (!topicIds.length) return {};
  const { data, error } = await supabase.from("topic_introductions").select("topic_id, introduction").in("topic_id", topicIds);
  // Introductions are optional; a missing migration must not hide the curriculum.
  if (error) return {};
  return Object.fromEntries((data ?? []).filter(row => row.introduction?.trim()).map(row => [row.topic_id as string, row.introduction as string]));
}

async function fetchWorkspace(subjectId: string): Promise<CurriculumWorkspace> {
  const config = getCurriculumConfig(subjectId);
  const [topics, notes, pdfs] = await Promise.all([
    loadStructure(subjectId), getNoteMetadataBySubject(subjectId), getPdfsBySubject(subjectId),
  ]);
  const subtopicIds = topics.flatMap(topic => topic.subtopics.map(subtopic => subtopic.id));
  const [noteLinks, concepts, introductions] = await Promise.all([
    getSubtopicLinksForNotes(notes.map(note => note.id)),
    loadConcepts(subjectId, subtopicIds),
    loadIntroductions(topics.map(topic => topic.id)),
  ]);
  return { subjectId, config, topics, units: buildCurriculumUnits(config, topics), notes, noteLinks, concepts, pdfs, introductions };
}

export function loadCurriculumWorkspace(subjectId: string) {
  let workspace = workspaces.get(subjectId);
  if (!workspace) {
    workspace = fetchWorkspace(subjectId);
    workspace.catch(() => workspaces.delete(subjectId));
    workspaces.set(subjectId, workspace);
  }
  return workspace;
}

export async function loadNoteSources(notes: NoteMetadata[]): Promise<NoteSource[]> {
  const missing = notes.filter(note => !noteContents.has(note.id)).map(note => note.id);
  for (const ids of chunks(missing, 50)) {
    const request = (async () => {
      const { data, error } = await supabase.from("notes").select("id, content").in("id", ids);
      if (error) throw error;
      return new Map((data ?? []).map(row => [row.id as string, (row.content as string | null) ?? ""]));
    })();
    for (const id of ids) {
      const content = request.then(rows => rows.get(id) ?? "");
      content.catch(() => noteContents.delete(id));
      noteContents.set(id, content);
    }
  }
  const contents = await Promise.all(notes.map(note => noteContents.get(note.id)!));
  return notes.map((note, index) => ({ id: note.id, title: note.title, slug: note.slug, subjectId: note.subjectId, content: contents[index] }));
}
