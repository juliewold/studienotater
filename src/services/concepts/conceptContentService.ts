import { getConceptsFromDatabase } from "./conceptService";
import { resolveSourceConcepts } from "./sourceConceptResolver";
import { getAllNotes } from "../notes/notesService";

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

export async function getConceptContent(
  conceptId: string,
): Promise<ConceptContentSource[]> {
  const [notes, concepts] = await Promise.all([getAllNotes(), getConceptsFromDatabase()]);

  return notes.flatMap((note) => {
    const content = getConceptContentFromNote(resolveSourceConcepts(note.content, concepts), conceptId);

    return content.map((item) => ({
      ...item,
      noteId: note.id,
      noteTitle: note.title,
      subjectId: note.subjectId,
      noteSlug: note.slug,
    }));
  });
}
