import "./FolderCard.css";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  updateNoteFolder,
  type NoteFolder,
} from "../../services/noteFoldersService";

type FolderCardProps = {
  folder: NoteFolder;
  subjectId: string;
  onFolderUpdated: (
    updatedFolder: NoteFolder,
  ) => void;
};

export const FolderCard = ({
  folder,
  subjectId,
  onFolderUpdated,
}: FolderCardProps) => {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [isRenaming, setIsRenaming] =
    useState(false);

  const [folderName, setFolderName] =
    useState(folder.name);

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isRenaming) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsRenaming(false);
        setErrorMessage("");
        setFolderName(folder.name);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isRenaming, folder.name]);

  const openRenameModal = () => {
    setFolderName(folder.name);
    setErrorMessage("");
    setIsMenuOpen(false);
    setIsRenaming(true);
  };

  const closeRenameModal = () => {
    if (isSaving) {
      return;
    }

    setIsRenaming(false);
    setErrorMessage("");
    setFolderName(folder.name);
  };

  const handleRename = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName = folderName.trim();

    if (!trimmedName) {
      setErrorMessage(
        "Du må skrive inn et mappenavn.",
      );
      return;
    }

    if (trimmedName === folder.name) {
      setIsRenaming(false);
      setErrorMessage("");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      await updateNoteFolder(
        folder.id,
        trimmedName,
      );

      onFolderUpdated({
        ...folder,
        name: trimmedName,
      });

      setIsRenaming(false);
    } catch (error) {
      console.error(
        "Kunne ikke oppdatere mappen:",
        error,
      );

      setErrorMessage(
        "Kunne ikke endre navnet. Prøv igjen.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="folder-card-wrapper">
        <Link
          to={`/fag/${subjectId}/notater/mappe/${folder.id}`}
          className="folder-card"
        >
          <span
            className="folder-card-icon"
            aria-hidden="true"
          >
            📁
          </span>

          <span className="folder-card-name">
            {folder.name}
          </span>
        </Link>

        <div
          className="folder-card-menu"
          ref={menuRef}
        >
          <button
            type="button"
            className="folder-card-menu-button"
            aria-label={`Åpne meny for ${folder.name}`}
            aria-expanded={isMenuOpen}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              setIsMenuOpen(
                (current) => !current,
              );
            }}
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && (
            <div className="folder-card-dropdown">
              <button
                type="button"
                onClick={openRenameModal}
              >
                <Pencil size={16} />
                Gi nytt navn
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsMenuOpen(false)
                }
              >
                <Trash2 size={16} />
                Slett mappe
              </button>
            </div>
          )}
        </div>
      </div>

      {isRenaming && (
        <div
          className="folder-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeRenameModal();
            }
          }}
        >
          <div
            className="folder-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`rename-folder-${folder.id}`}
          >
            <div className="folder-modal-header">
              <div>
                <p className="folder-modal-label">
                  Mappe
                </p>

                <h2
                  id={`rename-folder-${folder.id}`}
                >
                  Gi nytt navn
                </h2>
              </div>

              <button
                type="button"
                className="folder-modal-close"
                aria-label="Lukk"
                disabled={isSaving}
                onClick={closeRenameModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRename}>
              <label
                className="folder-modal-field"
                htmlFor={`folder-name-${folder.id}`}
              >
                Mappenavn

                <input
                  id={`folder-name-${folder.id}`}
                  type="text"
                  value={folderName}
                  autoFocus
                  disabled={isSaving}
                  onChange={(event) => {
                    setFolderName(
                      event.target.value,
                    );

                    if (errorMessage) {
                      setErrorMessage("");
                    }
                  }}
                />
              </label>

              {errorMessage && (
                <p className="folder-modal-error">
                  {errorMessage}
                </p>
              )}

              <div className="folder-modal-actions">
                <button
                  type="button"
                  className="folder-modal-cancel"
                  disabled={isSaving}
                  onClick={closeRenameModal}
                >
                  Avbryt
                </button>

                <button
                  type="submit"
                  className="folder-modal-submit"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Lagrer..."
                    : "Lagre navn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};