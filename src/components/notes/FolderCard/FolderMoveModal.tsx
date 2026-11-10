import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { NoteFolder } from "../../../services/notes/noteFoldersService";
import { getFolderMoveTargets } from "../../../services/notes/folderTree";
import "./FolderCard.css";

type FolderMoveModalProps = {
  folder: NoteFolder;
  allFolders: NoteFolder[];
  onSave: (parentId: string | null) => Promise<void>;
  onClose: () => void;
};

// Only offers targets that keep the tree valid: never the folder itself or one of its subfolders.
export const FolderMoveModal = ({ folder, allFolders, onSave, onClose }: FolderMoveModalProps) => {
  const [selectedParentId, setSelectedParentId] = useState<string | null>(folder.parentId);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const targets = useMemo(
    () => getFolderMoveTargets(allFolders, folder.id),
    [allFolders, folder.id],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSaving, onClose]);

  const handleSave = async () => {
    if (selectedParentId === folder.parentId) {
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await onSave(selectedParentId);
    } catch (saveError) {
      console.error("Kunne ikke flytte mappen:", saveError);

      setError("Kunne ikke flytte mappen. Prøv igjen.");
    } finally {
      setIsSaving(false);
    }
  };

  const groupName = `folder-move-${folder.id}`;

  return (
    <div
      className="folder-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div
        className="folder-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${groupName}-title`}
      >
        <div className="folder-modal-header">
          <div>
            <p className="folder-modal-label">Flytt mappe</p>

            <h2 id={`${groupName}-title`}>{folder.name}</h2>
          </div>

          <button
            type="button"
            className="folder-modal-close"
            aria-label="Lukk"
            disabled={isSaving}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <p className="folder-move-hint">
          Velg hvor mappen skal ligge. Undermapper og notater følger med.
        </p>

        <div className="folder-move-options" role="radiogroup" aria-label="Ny plassering">
          <label className="folder-move-option">
            <input
              type="radio"
              name={groupName}
              checked={selectedParentId === null}
              disabled={isSaving}
              onChange={() => setSelectedParentId(null)}
            />

            <span>Øverste nivå</span>
          </label>

          {targets.map(({ folder: target, depth }) => (
            <label
              key={target.id}
              className="folder-move-option"
              style={{ marginLeft: depth * 18 }}
            >
              <input
                type="radio"
                name={groupName}
                checked={selectedParentId === target.id}
                disabled={isSaving}
                onChange={() => setSelectedParentId(target.id)}
              />

              <span>{target.name}</span>
            </label>
          ))}
        </div>

        {error && <p className="folder-modal-error">{error}</p>}

        <div className="folder-modal-actions">
          <button
            type="button"
            className="folder-modal-cancel"
            disabled={isSaving}
            onClick={onClose}
          >
            Avbryt
          </button>

          <button
            type="button"
            className="folder-modal-submit"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Flytter..." : "Flytt mappe"}
          </button>
        </div>
      </div>
    </div>
  );
};
