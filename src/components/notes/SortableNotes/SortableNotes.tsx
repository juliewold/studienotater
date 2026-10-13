import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { useContext, useRef, useState, type ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { getNotesByFolder, getNotesWithoutFolder, reorderNotes, type DatabaseNote } from "../../../services/notes/notesService";
import { moveNoteInOrder } from "../../../services/notes/noteOrder";
import "./SortableNotes.css";

type Props = {
  subjectId: string;
  folderId: string | null;
  className: string;
  notes: DatabaseNote[];
  enabled: boolean;
  onReordered: (notes: DatabaseNote[]) => void;
  children: (note: DatabaseNote) => ReactNode;
};

export const SortableNotes = ({ subjectId, folderId, className, notes, enabled, onReordered, children }: Props) => {
  const { isAdmin } = useContext(AuthContext);
  const drag = useRef<{ source: string; target: string } | null>(null);
  const pending = useRef(false);
  const [target, setTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const cancel = () => { drag.current = null; setTarget(null); };
  const save = async (source: string, destination: string) => {
    if (!isAdmin || !enabled || pending.current || source === destination) return;
    pending.current = true;
    setSaving(true);
    setMessage("");
    try {
      const ordered = moveNoteInOrder(notes, source, destination);
      await reorderNotes(subjectId, folderId, ordered.map(note => note.id));
      onReordered(ordered);
      setMessage("Notatrekkefølgen er lagret.");
    } catch {
      // An interrupted response may have committed. Re-read instead of claiming rollback.
      try { onReordered(await (folderId === null ? getNotesWithoutFolder(subjectId) : getNotesByFolder(subjectId, folderId))); } catch { /* Keep last confirmed view. */ }
      setMessage("Kunne ikke bekrefte lagring. Last inn siden på nytt før du prøver igjen.");
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };
  return <>
    <div className={className} aria-busy={saving}>
      {notes.map((note, index) => <div key={note.id} data-note-id={note.id}
        className={`sortable-note${target === note.id ? " is-drop-target" : ""}`}>
        {children(note)}
        {isAdmin && enabled && notes.length > 1 && <button type="button" className="note-drag-handle"
          aria-label={`Flytt ${note.title}`} title="Dra for å flytte. Bruk piltaster med tastatur."
          disabled={saving}
          onPointerDown={event => {
            if (event.button !== 0 || pending.current) return;
            event.currentTarget.focus();
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { source: note.id, target: note.id };
          }}
          onPointerMove={event => {
            if (!drag.current) return;
            const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-note-id]");
            const id = hit?.dataset.noteId;
            drag.current.target = id && notes.some(item => item.id === id) ? id : drag.current.source;
            setTarget(id ?? null);
          }}
          onPointerUp={() => { const move = drag.current; cancel(); if (move) void save(move.source, move.target); }}
          onPointerCancel={cancel} onLostPointerCapture={cancel}
          onKeyDown={event => {
            if (event.key === "Escape") { cancel(); return; }
            const delta = ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : 0;
            if (!delta) return;
            event.preventDefault();
            const next = notes[index + delta];
            if (next) void save(note.id, next.id);
          }}><GripVertical size={17} /></button>}
      </div>)}
    </div>
    <p role="status" className="note-order-status">{saving ? "Lagrer rekkefølge…" : message}</p>
  </>;
};
