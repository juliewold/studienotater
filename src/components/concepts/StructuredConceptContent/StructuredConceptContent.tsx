import { Link } from "react-router-dom";
import { ReadOnlyNote } from "../../notes/ReadOnlyNote/ReadOnlyNote";
import type { ConceptContentSource } from "../../../services/concepts/conceptContentService";
import "../../notes/NoteEditor/NoteEditor.css";

// Preserve complete blocks, their math, tables and images; one source link per note.
export function StructuredConceptContent({ content, sources = true }: { content: ConceptContentSource[]; sources?: boolean }) {
  const groups = new Map<string, ConceptContentSource[]>();
  for (const block of content) groups.set(block.noteId, [...(groups.get(block.noteId) ?? []), block]);
  return <>{Array.from(groups, ([id, blocks]) => <div className="structured-source" key={id}>
    <ReadOnlyNote content={blocks.map(block => (block.contextHtml ?? "") + block.documentHtml).join("")} />
    {sources && <Link className="structured-source-link" to={`/fag/${blocks[0].subjectId}/notater/${blocks[0].noteSlug}`}>Fra {blocks[0].noteTitle} →</Link>}
  </div>)}</>;
}
