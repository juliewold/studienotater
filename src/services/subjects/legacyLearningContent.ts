import { normalizeConceptName } from "../concepts/conceptService";
import type { ConceptContentSource, ConceptContent } from "../concepts/conceptContentService";
import type { DatabaseNote } from "../notes/notesService";
import type { NoteSubtopicLink } from "../notes/noteSubtopicsService";

const blocks = '[data-type="callout"], [data-type="block-math"]';
const ownership = '[data-type="callout"][data-concept-id], [data-type="block-math"][data-formula-concept-id]';
const supported = new Set(["definition", "theorem", "formula", "method", "example"]);

/** A single existing placement can establish note content's subtopic without a
 * complete concept graph. Multiple placements are ambiguous even within one topic.
 * This is a read-only projection, never a new concept or stored relationship.
 */
export function getLegacyLearningContent(
  notes: DatabaseNote[], resolvedNotes: DatabaseNote[], links: NoteSubtopicLink[],
  subtopics: { id: string; name: string }[], scopedConceptIds: string[],
): ConceptContentSource[] {
  const scope = new Map(subtopics.map(subtopic => [subtopic.id, subtopic.name]));
  const concepts = new Set(scopedConceptIds);
  return notes.flatMap(note => {
    const placements = new Set([
      ...(note.subtopicId ? [note.subtopicId] : []),
      ...links.filter(link => link.noteId === note.id).map(link => link.subtopicId),
    ]);
    const subtopicName = scope.get([...placements][0]);
    // A dedicated note has both one stored placement and the subtopic's title.
    // One primary placement alone is not enough for a broad lecture summary.
    if (placements.size !== 1 || !subtopicName || normalizeConceptName(note.title) !== normalizeConceptName(subtopicName)) return [];
    const doc = new DOMParser().parseFromString(note.content, "text/html");
    const resolved = new DOMParser().parseFromString(resolvedNotes.find(item => item.id === note.id)?.content ?? note.content, "text/html");
    const resolvedBlocks = [...resolved.querySelectorAll<HTMLElement>(blocks)];
    return [...doc.querySelectorAll<HTMLElement>(blocks)].flatMap((node, index) => {
      const type = node.dataset.type === "block-math" ? "formula" : node.dataset.calloutType;
      if (!type || !supported.has(type)) return [];
      // Do not separate nested formulas from their containing source box.
      if (node.parentElement?.closest(blocks)) return [];
      // Explicit block ownership is handled by the concept graph, never overridden.
      if (node.matches(ownership) || node.querySelector(ownership)) return [];
      const inferred = resolvedBlocks[index];
      const owners = inferred ? [inferred, ...inferred.querySelectorAll<HTMLElement>(ownership)] : [];
      if (owners.some(owner => concepts.has(owner.dataset.conceptId ?? owner.dataset.formulaConceptId ?? ""))) return [];
      const context: string[] = [];
      if (node.dataset.type === "block-math") {
        let sibling = node.previousElementSibling;
        while (sibling?.matches("p,ul,ol") && !sibling.querySelector(blocks)) {
          context.unshift(sibling.outerHTML);
          sibling = sibling.previousElementSibling;
        }
      }
      return [{ type: type as ConceptContent["type"], documentHtml: node.outerHTML,
        html: node.querySelector(".note-callout-body")?.innerHTML ?? node.innerHTML,
        contextHtml: context.join(""), latex: node.dataset.type === "block-math" ? node.dataset.latex : undefined,
        noteId: note.id, noteTitle: note.title, noteSlug: note.slug, subjectId: note.subjectId }];
    });
  });
}
