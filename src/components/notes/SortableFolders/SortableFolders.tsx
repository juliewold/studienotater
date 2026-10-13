import { useRef, useState, type ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { getNoteFoldersBySubject, reorderNoteFolders, type NoteFolder } from "../../../services/notes/noteFoldersService";
import { moveNoteFolder } from "../../../services/notes/noteFolderOrder";
import "./SortableFolders.css";

type Props = {
  subjectId: string;
  folders: NoteFolder[];
  enabled: boolean;
  onReordered: (folders: NoteFolder[]) => void;
  children: (folder: NoteFolder) => ReactNode;
};

export const SortableFolders = ({ subjectId, folders, enabled, onReordered, children }: Props) => {
  const drag = useRef<{ source: string; target: string } | null>(null);
  const pending = useRef(false);
  const [target, setTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const cancel = () => { drag.current = null; setTarget(null); };
  const save = async (source: string, destination: string) => {
    if (pending.current || source === destination) return;
    pending.current = true;
    setSaving(true);
    setMessage("");
    try {
      const ordered = moveNoteFolder(folders, source, destination);
      await reorderNoteFolders(subjectId, ordered.map(folder => folder.id));
      onReordered(ordered);
      setMessage("Mapperekkefølgen er lagret.");
    } catch {
      // An interrupted response may have committed. Re-read instead of claiming rollback.
      try { onReordered(await getNoteFoldersBySubject(subjectId)); } catch { /* Keep last confirmed view. */ }
      setMessage("Kunne ikke bekrefte lagring. Last inn siden på nytt før du prøver igjen.");
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };
  return <>
    <div className="notes-folders" aria-busy={saving}>
      {folders.map((folder, index) => <div key={folder.id} data-folder-id={folder.id}
        className={`sortable-folder${target === folder.id ? " is-drop-target" : ""}`}>
        {children(folder)}
        {enabled && folders.length > 1 && <button type="button" className="folder-drag-handle"
          aria-label={`Flytt ${folder.name}`} title="Dra for å flytte. Bruk piltaster med tastatur."
          disabled={saving}
          onPointerDown={event => {
            if (event.button !== 0 || pending.current) return;
            event.currentTarget.focus();
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { source: folder.id, target: folder.id };
          }}
          onPointerMove={event => {
            if (!drag.current) return;
            const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-folder-id]");
            const id = hit?.dataset.folderId;
            drag.current.target = id && folders.some(item => item.id === id) ? id : drag.current.source;
            setTarget(id ?? null);
          }}
          onPointerUp={() => { const move = drag.current; cancel(); if (move) void save(move.source, move.target); }}
          onPointerCancel={cancel} onLostPointerCapture={cancel}
          onKeyDown={event => {
            if (event.key === "Escape") { cancel(); return; }
            const delta = ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : 0;
            if (!delta) return;
            event.preventDefault();
            const next = folders[index + delta];
            if (next) void save(folder.id, next.id);
          }}><GripVertical size={17} /></button>}
      </div>)}
    </div>
    <p role="status" className="folder-order-status">{saving ? "Lagrer rekkefølge…" : message}</p>
  </>;
};
