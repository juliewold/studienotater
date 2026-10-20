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
  contextError?: boolean;
  sources: ConceptContentSource[];
  status: "review" | "consistent" | "missing";
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

export async function loadConceptReviews() {
  const [concepts, notes] = await Promise.all([readReviewPages(getConceptsFromDatabase), readReviewPages(getAllNotes)]);
  const reviews = buildConceptReviews(concepts, notes);
  const missing = reviews.filter(review => review.sources.length === 0);
  // Bound parallel reads; one failed lookup must not hide the remaining review.
  for (let start = 0; start < missing.length; start += 5) {
    await Promise.all(missing.slice(start, start + 5).map(async review => {
      try { review.contexts = await getConceptContexts(review.concept.id); }
      catch { review.contextError = true; }
    }));
  }
  return reviews;
}
