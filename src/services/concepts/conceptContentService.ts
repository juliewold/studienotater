import { getConceptBySlugFromDatabase } from "./conceptService";
import type { Concept } from "../../data/concepts/types";
import { getConceptContexts, getConceptSubtopicIds } from "./conceptContextService";
import { getConceptSourceNotes, getSourceConceptIndex, type SourceConcept } from "./conceptSourceNotesService";
import { resolveSourceConcepts } from "./sourceConceptResolver";


export type ConceptContent = {
  type: "definition" | "theorem" | "formula" | "method" | "example";
  // Full source node for the same renderer as the note; html retained for legacy consumers.
  documentHtml: string;
  html: string;
  contextHtml?: string;
  latex?: string;
};

export function getConceptContentFromNote(noteContent: string, conceptId: string): ConceptContent[] {
  const doc = new DOMParser().parseFromString(noteContent, "text/html");
  const supported = new Set(["definition", "theorem", "formula", "method", "example"]);
  const nodes = Array.from(doc.querySelectorAll<HTMLElement>("[data-type='callout'][data-concept-id], [data-type='block-math'][data-formula-concept-id]"));
  const idOf = (node: Element) => node.getAttribute("data-concept-id") ?? node.getAttribute("data-formula-concept-id");
  const selected = nodes.filter(node => idOf(node) === conceptId &&
    (node.dataset.type === "block-math" || supported.has(node.dataset.calloutType ?? "")));
  return selected.filter(node => !selected.some(parent => parent !== node && parent.contains(node))).map(node => {
    const copy = node.cloneNode(true) as HTMLElement;
    // A source box may contain a separately linked box for another concept.
    copy.querySelectorAll("[data-type='callout'][data-concept-id], [data-type='block-math'][data-formula-concept-id]").forEach(child => {
      if (idOf(child) && idOf(child) !== conceptId) child.remove();
    });
    const type = (copy.dataset.type === "block-math" ? "formula" : copy.dataset.calloutType) as ConceptContent["type"];
    // Keep the source's immediate explanation with an inferred standalone formula.
    // Stop at another formula, box or heading so neighbouring sections cannot leak in.
    const context: string[] = [];
    if (node.dataset.sourceContext === "heading") {
      let sibling = node.previousElementSibling;
      while (sibling?.matches("p,ul,ol") && !sibling.querySelector("[data-type='callout'],[data-type='block-math']")) {
        context.unshift(sibling.outerHTML);
        sibling = sibling.previousElementSibling;
      }
    }
    return { type, documentHtml: copy.outerHTML, contextHtml: context.join(""),
      html: copy.querySelector(".note-callout-body")?.innerHTML ?? copy.innerHTML,
      latex: copy.dataset.type === "block-math" ? copy.dataset.latex : undefined };
  });
}

export type ConceptContentSource = ConceptContent & {
  noteId: string;
  noteTitle: string;
  subjectId: string;
  noteSlug: string;
};

/** A session shares the name index, contexts and source results across page/popover. */
export function createConceptContentSession() {
  let index: Promise<SourceConcept[]> | undefined;
  const memberships = new Map<string, Promise<string[]>>();
  const conceptsBySlug = new Map<string, Promise<Concept | undefined>>();
  const contexts = new Map<string, ReturnType<typeof getConceptContexts>>();
  const contents = new Map<string, Promise<ConceptContentSource[]>>();
  const getMembership = (id: string) => {
    let pending = memberships.get(id);
    if (!pending) {
      pending = getConceptSubtopicIds(id).catch(error => { memberships.delete(id); throw error; });
      memberships.set(id, pending);
    }
    return pending;
  };
  const getContexts = (id: string) => {
    let pending = contexts.get(id);
    if (!pending) {
      pending = getMembership(id).then(ids => getConceptContexts(id, ids)).catch(error => { contexts.delete(id); throw error; });
      contexts.set(id, pending);
    }
    return pending;
  };
  return {
    getContexts,
    getConcept(slug: string) {
      let pending = conceptsBySlug.get(slug);
      if (!pending) {
        pending = getConceptBySlugFromDatabase(slug).catch(error => { conceptsBySlug.delete(slug); throw error; });
        conceptsBySlug.set(slug, pending);
      }
      return pending;
    },
    getContent(id: string): Promise<ConceptContentSource[]> {
      const cached = contents.get(id);
      if (cached) return cached;
      if (!index) index = getSourceConceptIndex().catch(error => { index = undefined; throw error; });
      const pending = (async () => {
        const [concepts, subtopicIds] = await Promise.all([index!, getMembership(id).catch(() => [])]);
        const notes = await getConceptSourceNotes(id, concepts, subtopicIds);
        return notes.flatMap(note => getConceptContentFromNote(resolveSourceConcepts(note.content ?? "", concepts), id)
          .map(item => ({ ...item, noteId: note.id, noteTitle: note.title, subjectId: note.subject_id, noteSlug: note.slug })));
      })().catch(error => { contents.delete(id); throw error; });
      contents.set(id, pending);
      return pending;
    },
  };
}

/** Standalone callers retain the existing API without a process-wide data cache. */
export function getConceptContent(conceptId: string): Promise<ConceptContentSource[]> {
  return createConceptContentSession().getContent(conceptId);
}
