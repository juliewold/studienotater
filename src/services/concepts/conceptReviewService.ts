import { supabase } from "../../lib/supabase";
import { getSubtopicsByTopic } from "../subjects/subjectStructureService";
import { getSubtopicLinksForNotes, type NoteSubtopicLink } from "../notes/noteSubtopicsService";
import { getConceptContexts, type ConceptContext } from "./conceptContextService";
import type { Concept } from "../../data/concepts/types";
import type { DatabaseNote } from "../notes/notesService";
import { getAllNotes } from "../notes/notesService";
import { getConceptsFromDatabase } from "./conceptService";
import { getConceptContentFromNote, type ConceptContentSource } from "./conceptContentService";
import { resolveSourceConcepts } from "./sourceConceptResolver";

export type ConceptReview = {
  concept: Concept;
  contexts?: ConceptContext[];
  textMatches?: { noteId: string; noteTitle: string; noteSlug: string; subjectId: string; excerpt: string }[];
  textSearchError?: boolean;
  contextError?: boolean;
  sources: ConceptContentSource[];
  status: "review" | "consistent" | "missing" | "text" | "subject-text";
  reasons: string[];
  proposedName?: string;
  proposedText?: string;
};
const normalize = (text: string) => text.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("nb");

// Read-only comparison. Differences are review candidates, never proof of AI origin or error.
export function reviewConcept(concept: Concept, sources: ConceptContentSource[]): ConceptReview {
  const names = new Map<string, string>();
  const definitions = new Map<string, string>();
  let sourceUsesStoredName = false;
  for (const source of sources) {
    const doc = new DOMParser().parseFromString(source.documentHtml, "text/html");
    const node = doc.body.firstElementChild;
    const escapedName = normalize(concept.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?<![\\p{L}\\p{N}_])${escapedName}(?![\\p{L}\\p{N}_])`, "u").test(normalize(doc.body.textContent ?? ""))) sourceUsesStoredName = true;
    const name = node?.getAttribute("data-concept-name")?.trim();
    if (name) names.set(normalize(name), name);
    if (source.type === "definition") {
      const body = doc.querySelector(".note-callout-body");
      // Preserve math as LaTeX in the proposed literal excerpt.
      body?.querySelectorAll("[data-latex]").forEach(math => {
        math.replaceWith(doc.createTextNode(`\\(${math.getAttribute("data-latex")}\\)`));
      });
      const text = body?.textContent?.replace(/\s+/g, " ").trim();
      if (text) definitions.set(normalize(text), text);
    }
  }
  const reasons: string[] = [];
  let proposedName: string | undefined;
  let proposedText: string | undefined;
  if (names.size && !sourceUsesStoredName && !names.has(normalize(concept.name))) {
    reasons.push(names.size === 1 ? "Lagret navn avviker fra det eksplisitte navnet i kildeboksen. Kontroller om de er samme begrep." : "Kildene bruker flere ulike navn. Ingen automatisk navneanbefaling.");
    if (names.size === 1) proposedName = [...names.values()][0];
  }
  if (definitions.size && [...definitions.keys()].some(text => text !== normalize(concept.shortDefinition ?? "") || text !== normalize(concept.explanation ?? ""))) {
    reasons.push("Lagret definisjon/forklaring avviker fra kildeteksten. Dette kan være en korrekt omskriving; språk og faglig samsvar må vurderes manuelt.");
    if (definitions.size === 1) proposedText = [...definitions.values()][0];
    else reasons.push("Flere definisjoner finnes. Velg kilde manuelt; tekstene er ikke slått sammen.");
  }
  return { concept, sources, proposedName, proposedText,
    status: !sources.length ? "missing" : reasons.length ? "review" : "consistent",
    reasons: !sources.length ? ["Ingen entydige kildebokser funnet. Ingen endring foreslås."] : reasons.length ? reasons : ["Ingen avvik funnet i sammenlignbare felter. Dette er ikke en faglig godkjenning."] };
}

export function buildConceptReviews(concepts: Concept[], notes: DatabaseNote[]): ConceptReview[] {
  const byConcept = new Map<string, ConceptContentSource[]>();
  const knownIds = new Set(concepts.map(concept => concept.id));
  for (const note of notes) {
    const content = resolveSourceConcepts(note.content, concepts);
    const doc = new DOMParser().parseFromString(content, "text/html");
    const ids = new Set(Array.from(doc.querySelectorAll("[data-concept-id], [data-formula-concept-id]"),
      node => node.getAttribute("data-concept-id") ?? node.getAttribute("data-formula-concept-id")));
    for (const id of ids) {
      if (!id || !knownIds.has(id)) continue;
      const sources = getConceptContentFromNote(content, id).map(block => ({ ...block,
        noteId: note.id, noteTitle: note.title, noteSlug: note.slug, subjectId: note.subjectId,
      }));
      byConcept.set(id, [...(byConcept.get(id) ?? []), ...sources]);
    }
  }
  return concepts.map(concept => reviewConcept(concept, byConcept.get(concept.id) ?? []));
}

export async function readReviewPages<T>(read: (range: { from: number; to: number }) => Promise<T[]>) {
  const rows: T[] = [];
  for (;;) {
    const page = await read({ from: rows.length, to: rows.length + 199 });
    if (!page.length) return rows;
    rows.push(...page);
  }
}

export function findConceptTextMatches(name: string, notes: DatabaseNote[], links: NoteSubtopicLink[], scope: { subjectId: string; subtopicId?: string }[]) {
  const term = name.normalize("NFKC").trim().replace(/\s+/g, " ");
  if (!term) return [];
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, "iu");
  const seen = new Set<string>();
  return notes.flatMap(note => {
    if (seen.has(note.id) || !scope.some(item => item.subjectId === note.subjectId &&
      (!item.subtopicId || item.subtopicId === note.subtopicId || links.some(link => link.noteId === note.id && link.subtopicId === item.subtopicId)))) return [];
    seen.add(note.id);
    const doc = new DOMParser().parseFromString(note.content, "text/html");
    doc.querySelectorAll("script,style").forEach(node => node.remove());
    // Preserve block boundaries while matching inline formatting as normal text.
    doc.querySelectorAll("p,li,h1,h2,h3,h4,h5,h6,div,br").forEach(node => node.append(doc.createTextNode(" ")));
    const text = (doc.body.textContent ?? "").normalize("NFKC").replace(/\s+/g, " ").trim();
    const match = pattern.exec(text);
    if (!match) return [];
    const start = Math.max(0, match.index - 100);
    const end = Math.min(text.length, match.index + match[0].length + 160);
    return [{ noteId: note.id, noteTitle: note.title, noteSlug: note.slug, subjectId: note.subjectId,
      excerpt: `${start ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}` }];
  });
}

export function findConceptTextWithFallback(name: string, notes: DatabaseNote[], links: NoteSubtopicLink[], scope: { subjectId: string; subtopicId: string }[], subjectIds: string[]) {
  const linked = findConceptTextMatches(name, notes, links, scope);
  if (linked.length) return { textMatches: linked, status: "text" as const };
  const subjectMatches = findConceptTextMatches(name, notes, [], [...new Set(subjectIds)].map(subjectId => ({ subjectId })));
  return { textMatches: subjectMatches, status: subjectMatches.length ? "subject-text" as const : "missing" as const };
}

export type ConceptReviewIndex = { concept: Concept; contexts: ConceptContext[] };

export async function loadConceptReviewIndex(): Promise<ConceptReviewIndex[]> {
  const [concepts, links, subtopics, topics] = await Promise.all([
    readReviewPages(getConceptsFromDatabase),
    readReviewPages(async ({ from, to }) => {
      const { data, error } = await supabase.from("concept_subtopics").select("concept_id,subtopic_id").order("concept_id").order("subtopic_id").range(from, to);
      if (error) throw error; return data ?? [];
    }),
    readReviewPages(async ({ from, to }) => {
      const { data, error } = await supabase.from("subtopics").select("id,topic_id,name").order("id").range(from, to);
      if (error) throw error; return data ?? [];
    }),
    readReviewPages(async ({ from, to }) => {
      const { data, error } = await supabase.from("topics").select("id,subject_id,name").order("id").range(from, to);
      if (error) throw error; return data ?? [];
    }),
  ]);
  const subtopicMap = new Map(subtopics.map(item => [item.id, item]));
  const topicMap = new Map(topics.map(item => [item.id, item]));
  return concepts.map(concept => ({ concept, contexts: links.filter(link => link.concept_id === concept.id).flatMap(link => {
    const subtopic = subtopicMap.get(link.subtopic_id);
    const topic = subtopic && topicMap.get(subtopic.topic_id);
    return subtopic && topic ? [{ subjectId: topic.subject_id, topicId: topic.id, topicName: topic.name,
      subtopicId: subtopic.id, subtopicName: subtopic.name }] : [];
  }) }));
}

// A page-owned session: promises deduplicate concurrent opens; failed reads can retry.
export function createConceptReviewSession(concepts: Concept[]) {
  let notesPromise: Promise<DatabaseNote[]> | undefined;
  const resolved = new Map<string, string>();
  const details = new Map<string, Promise<ConceptReview>>();
  function notes() {
    if (!notesPromise) notesPromise = readReviewPages(getAllNotes).catch(error => { notesPromise = undefined; throw error; });
    return notesPromise;
  }
  return {
    load(concept: Concept): Promise<ConceptReview> {
      const cached = details.get(concept.id);
      if (cached) return cached;
      const pending = (async () => {
        const sourceNotes = await notes();
        const sources = sourceNotes.flatMap(note => {
          let content = resolved.get(note.id);
          if (content === undefined) { content = resolveSourceConcepts(note.content, concepts); resolved.set(note.id, content); }
          if (!content.includes(concept.id)) return [];
          // Only extract and compare the requested concept, not all concepts.
          return getConceptContentFromNote(content, concept.id).map(block => ({ ...block, noteId: note.id,
            noteTitle: note.title, noteSlug: note.slug, subjectId: note.subjectId }));
        });
        const review = reviewConcept(concept, sources);
        if (sources.length) return review;
        review.contexts = await getConceptContexts(concept.id);
        const links = await getSubtopicLinksForNotes(sourceNotes.map(note => note.id));
        const scope: { subjectId: string; subtopicId: string }[] = [];
        const seen = new Set<string>();
        for (const context of review.contexts) {
          if (seen.has(context.topicId)) continue;
          seen.add(context.topicId);
          scope.push(...(await getSubtopicsByTopic(context.topicId)).map(subtopic => ({ subjectId: context.subjectId, subtopicId: subtopic.id })));
        }
        Object.assign(review, findConceptTextWithFallback(concept.name, sourceNotes, links, scope, review.contexts.map(context => context.subjectId)));
        return review;
      })().catch(error => { details.delete(concept.id); throw error; });
      details.set(concept.id, pending);
      return pending;
    },
  };
}

// Explicit batch helper for regression tests/tools, never used by the list page.
export async function loadConceptReviews() {
  const index = await loadConceptReviewIndex();
  const session = createConceptReviewSession(index.map(item => item.concept));
  return Promise.all(index.map(async ({ concept }) => {
    try { return await session.load(concept); }
    catch { return { ...reviewConcept(concept, []), contextError: true }; }
  }));
}
