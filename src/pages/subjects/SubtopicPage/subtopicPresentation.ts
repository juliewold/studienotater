import type { ConceptContentSource } from "../../../services/concepts/conceptContentService";

type SourceBlock = ConceptContentSource & { conceptId?: string };
const sections = [
  { id: "definitions", title: "Begreper og definisjoner", types: ["definition"] },
  { id: "formulas", title: "Formler og regler", types: ["formula"] },
  { id: "methods", title: "Metoder og teoremer", types: ["method", "theorem"] },
  { id: "examples", title: "Eksempler", types: ["example"] },
];

/** Presentation only: keep complete source nodes and their context intact.
 * Deduplicate exact repeated blocks from the same note, never different sources
 * or equal formulas with different explanations/assumptions.
 */
export function groupSubtopicContent(content: SourceBlock[], sourceContent: SourceBlock[]) {
  const unique = new Map<string, SourceBlock>();
  for (const block of [...content, ...sourceContent]) {
    const key = JSON.stringify([block.noteId, block.type, block.documentHtml, block.contextHtml ?? ""]);
    if (!unique.has(key)) unique.set(key, block);
  }
  return sections.map(section => ({ ...section,
    content: [...unique.values()].filter(block => section.types.includes(block.type)),
  })).filter(section => section.content.length > 0);
}
