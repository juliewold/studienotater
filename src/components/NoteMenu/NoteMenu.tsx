import "./NoteMenu.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FolderInput, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import {
  getNoteFoldersBySubject,
  type NoteFolder,
} from "../../services/noteFoldersService";
import {
  deleteNote,
  moveNoteToFolder,
  updateNoteTitle,
} from "../../services/notesService";

type NoteMenuProps = {
  noteId: string;
  noteTitle: string;
  subjectId: string;
  currentFolderId: string | null;
  onNoteChanged: (
    change:
      | { type: "moved" }
      | { type: "renamed"; title: string }
      | { type: "deleted" },
  ) => void;
};

export const NoteMenu = ({
  noteId,
  noteTitle,
  subjectId,
  currentFolderId,
  onNoteChanged,
}: NoteMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [folders, setFolders] = useState<NoteFolder[]>([]);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    currentFolderId,
  );

  const [newTitle, setNewTitle] = useState(noteTitle);

  const [isLoadingFolders, setIsLoadingFolders] = useState(false);

  const [isMoving, setIsMoving] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    } catch (error) {
      console.error("Kunne ikke hente mapper:", error);
      alert("Kunne ikke hente mappene.");
    } finally {
      setIsLoadingFolders(false);
    }
  }, [subjectId, currentFolderId]);

  const openMoveModal = async () => {
    setIsOpen(false);
    setIsMoveModalOpen(true);

    await loadFolders();
  };

  const closeMoveModal = () => {
    if (isMoving) {
      return;
    }

    setIsMoveModalOpen(false);
    setSelectedFolderId(currentFolderId);
  };

  const openRenameModal = () => {
    setIsOpen(false);
    setNewTitle(noteTitle);
    setIsRenameModalOpen(true);
  };

  const closeRenameModal = () => {
    if (isRenaming) {
      return;
    }

    setIsRenameModalOpen(false);
    setNewTitle(noteTitle);
  };

  const openDeleteModal = () => {
    setIsOpen(false);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
  };

  const handleMove = async () => {
    setIsMoving(true);

    try {
      await moveNoteToFolder(noteId, selectedFolderId);

      setIsMoveModalOpen(false);

      onNoteChanged({
        type: "moved",
      });
    } catch (error) {
      console.error("Kunne ikke flytte notatet:", error);

      alert(
        error instanceof Error ? error.message : "Kunne ikke flytte notatet.",
      );
    } finally {
      setIsMoving(false);
    }
  };

  const handleRename = async () => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    setIsRenaming(true);

    try {
      await updateNoteTitle(noteId, trimmedTitle);

      setIsRenameModalOpen(false);

      onNoteChanged({
        type: "renamed",
        title: trimmedTitle,
      });
    } catch (error) {
      console.error("Kunne ikke gi notatet nytt navn:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Kunne ikke gi notatet nytt navn.",
      );
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteNote(noteId);

      setIsDeleteModalOpen(false);

      onNoteChanged({
        type: "deleted",
      });
    } catch (error) {
      console.error("Kunne ikke slette notatet:", error);

      alert(
        error instanceof Error ? error.message : "Kunne ikke slette notatet.",
      );
    } finally {
      setIsDeleting(false);
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
              <FolderInput size={17} />
              Flytt til mappe
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                openRenameModal();
              }}
            >
              <Pencil size={17} />
              Gi nytt navn
            </button>

            <button
              type="button"
              className="note-menu-delete-option"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                openDeleteModal();
              }}
            >
              <Trash2 size={17} />
              Slett notat
            </button>
          </div>
        )}
      </div>

      {createPortal(
        <>
          {isMoveModalOpen && (
            <div className="note-modal-overlay" onClick={closeMoveModal}>
              <div
                className="note-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="note-move-title"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <div className="note-modal-header">
                  <h2 id="note-move-title">Flytt notat</h2>

                  <button
                    type="button"
                    className="note-modal-close-button"
                    aria-label="Lukk"
                    onClick={closeMoveModal}
                  >
                    <X size={20} />
                  </button>
                </div>

                {isLoadingFolders ? (
                  <p className="note-modal-message">Henter mapper...</p>
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

                <div className="note-modal-actions">
                  <button
                    type="button"
                    className="note-modal-cancel-button"
                    onClick={closeMoveModal}
                  >
                    Avbryt
                  </button>

                  <button
                    type="button"
                    className="note-modal-submit-button"
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

          {isRenameModalOpen && (
            <div className="note-modal-overlay" onClick={closeRenameModal}>
              <form
                className="note-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="note-rename-title"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onSubmit={(event) => {
                  event.preventDefault();

                  void handleRename();
                }}
              >
                <div className="note-modal-header">
                  <h2 id="note-rename-title">Gi notatet nytt navn</h2>

                  <button
                    type="button"
                    className="note-modal-close-button"
                    aria-label="Lukk"
                    onClick={closeRenameModal}
                  >
                    <X size={20} />
                  </button>
                </div>

                <label className="note-rename-label">
                  Navn på notatet
                  <input
                    type="text"
                    value={newTitle}
                    autoFocus
                    maxLength={100}
                    onChange={(event) => setNewTitle(event.target.value)}
                  />
                </label>

                <div className="note-modal-actions">
                  <button
                    type="button"
                    className="note-modal-cancel-button"
                    onClick={closeRenameModal}
                  >
                    Avbryt
                  </button>

                  <button
                    type="submit"
                    className="note-modal-submit-button"
                    disabled={
                      isRenaming ||
                      !newTitle.trim() ||
                      newTitle.trim() === noteTitle
                    }
                  >
                    {isRenaming ? "Lagrer..." : "Lagre"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {isDeleteModalOpen && (
            <div className="note-modal-overlay" onClick={closeDeleteModal}>
              <div
                className="note-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="note-delete-title"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <div className="note-modal-header">
                  <h2 id="note-delete-title">Slett notat</h2>

                  <button
                    type="button"
                    className="note-modal-close-button"
                    aria-label="Lukk"
                    onClick={closeDeleteModal}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="note-modal-message">
                  Er du sikker på at du vil slette
                  <strong> «{noteTitle}»</strong>?
                </p>

                <p className="note-delete-warning">
                  Denne handlingen kan ikke angres.
                </p>

                <div className="note-modal-actions">
                  <button
                    type="button"
                    className="note-modal-cancel-button"
                    onClick={closeDeleteModal}
                  >
                    Avbryt
                  </button>

                  <button
                    type="button"
                    className="note-modal-delete-button"
                    disabled={isDeleting}
                    onClick={() => {
                      void handleDelete();
                    }}
                  >
                    {isDeleting ? "Sletter..." : "Slett"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>,
        document.body,
      )}
    </>
  );
};
