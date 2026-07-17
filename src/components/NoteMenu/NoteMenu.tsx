import "./NoteMenu.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { MoreVertical, X } from "lucide-react";
import {
  getNoteFoldersBySubject,
  type NoteFolder,
} from "../../services/noteFoldersService";
import { moveNoteToFolder } from "../../services/notesService";

type NoteMenuProps = {
  noteId: string;
  subjectId: string;
  currentFolderId: string | null;
};

export const NoteMenu = ({
  noteId,
  subjectId,
  currentFolderId,
}: NoteMenuProps) => {
  void noteId;

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [folders, setFolders] = useState<NoteFolder[]>([]);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    currentFolderId,
  );

  const [isLoadingFolders, setIsLoadingFolders] = useState(false);

  const [isMoving, setIsMoving] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const loadFolders = useCallback(async () => {
    setIsLoadingFolders(true);

    try {
      const data = await getNoteFoldersBySubject(subjectId);

      setFolders(data);
      setSelectedFolderId(currentFolderId);
    } finally {
      setIsLoadingFolders(false);
    }
  }, [subjectId, currentFolderId]);

  const openMoveModal = async () => {
    setIsOpen(false);
    setIsModalOpen(true);

    await loadFolders();
  };

  const closeMoveModal = () => {
    setIsModalOpen(false);
    setSelectedFolderId(currentFolderId);
  };

  const handleMove = async () => {
    setIsMoving(true);

    try {
      await moveNoteToFolder(noteId, selectedFolderId);

      window.location.reload();
    } catch (error) {
      console.error("Kunne ikke flytte notatet:", error);

      alert(
        error instanceof Error ? error.message : "Kunne ikke flytte notatet.",
      );
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <>
      <div className="note-menu" ref={menuRef}>
        <button
          type="button"
          className="note-menu-button"
          aria-label="Åpne meny for notatet"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            setIsOpen((current) => !current);
          }}
        >
          <MoreVertical size={18} />
        </button>

        {isOpen && (
          <div className="note-menu-dropdown">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                void openMoveModal();
              }}
            >
              Flytt til mappe
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="note-move-overlay" onClick={closeMoveModal}>
          <div
            className="note-move-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-move-title"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="note-move-header">
              <h2 id="note-move-title">Flytt notat</h2>

              <button
                type="button"
                className="note-move-close-button"
                aria-label="Lukk"
                onClick={closeMoveModal}
              >
                <X size={20} />
              </button>
            </div>

            {isLoadingFolders ? (
              <p className="note-move-message">Henter mapper...</p>
            ) : (
              <div className="note-move-options">
                <label className="note-move-option">
                  <input
                    type="radio"
                    name={`folder-${noteId}`}
                    checked={selectedFolderId === null}
                    onChange={() => setSelectedFolderId(null)}
                  />

                  <span>Ingen mappe</span>
                </label>

                {folders.map((folder) => (
                  <label key={folder.id} className="note-move-option">
                    <input
                      type="radio"
                      name={`folder-${noteId}`}
                      checked={selectedFolderId === folder.id}
                      onChange={() => setSelectedFolderId(folder.id)}
                    />

                    <span>{folder.name}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="note-move-actions">
              <button
                type="button"
                className="note-move-cancel-button"
                onClick={closeMoveModal}
              >
                Avbryt
              </button>

              <button
                type="button"
                className="note-move-submit-button"
                disabled={isLoadingFolders || isMoving}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  void handleMove();
                }}
              >
                {isMoving ? "Flytter..." : "Flytt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
