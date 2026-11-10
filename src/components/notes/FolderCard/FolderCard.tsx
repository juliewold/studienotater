import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { folderToneClass } from "../../../services/notes/noteFolderOrder";
import "./folderColors.css";
import "./FolderCard.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Folder, FolderInput, FolderPlus, MoreVertical, Pencil, Trash2, X } from "lucide-react";

import {
  createNoteFolder,
  deleteNoteFolder,
  updateNoteFolder,
  updateNoteFolderParent,
  type NoteFolder,
} from "../../../services/notes/noteFoldersService";
import { getChildFolders } from "../../../services/notes/folderTree";
import { FolderNameModal } from "./FolderNameModal";
import { FolderMoveModal } from "./FolderMoveModal";

type FolderCardProps = {
  folder: NoteFolder;
  subjectId: string;
  noteCount: number;
  // All folders of the subject, used for the move picker and the delete summary.
  allFolders: NoteFolder[];
  onFolderCreated: (createdFolder: NoteFolder) => void;
  onFolderUpdated: (updatedFolder: NoteFolder) => void;
  onFolderDeleted: (deletedFolderId: string) => void;
};

type FolderModal = "create" | "rename" | "move" | "delete";

export const FolderCard = ({
  folder,
  subjectId,
  noteCount,
  allFolders,
  onFolderCreated,
  onFolderUpdated,
  onFolderDeleted,
}: FolderCardProps) => {
  const { isAdmin } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [activeModal, setActiveModal] = useState<FolderModal | null>(null);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  const menuRef = useRef<HTMLDivElement | null>(null);

  const childFolders = getChildFolders(allFolders, folder.id);

  const parentFolder = allFolders.find(
    (currentFolder) => currentFolder.id === folder.parentId,
  );

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (activeModal !== "delete") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleteLoading) {
        setActiveModal(null);
        setDeleteErrorMessage("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal, isDeleteLoading]);

  const openModal = (modal: FolderModal) => {
    setDeleteErrorMessage("");
    setIsMenuOpen(false);
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setDeleteErrorMessage("");
  };

  const handleCreateSubfolder = async (name: string) => {
    if (!isAdmin) return;

    const createdFolder = await createNoteFolder(subjectId, name, null, folder.id);

    onFolderCreated(createdFolder);
    setActiveModal(null);
  };

  const handleRename = async (name: string) => {
    if (!isAdmin) return;

    await updateNoteFolder(folder.id, name);

    onFolderUpdated({
      ...folder,
      name,
    });
    setActiveModal(null);
  };

  const handleMove = async (parentId: string | null) => {
    if (!isAdmin) return;

    await updateNoteFolderParent(folder.id, parentId);

    onFolderUpdated({
      ...folder,
      parentId,
    });
    setActiveModal(null);
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    try {
      setIsDeleteLoading(true);
      setDeleteErrorMessage("");

      await deleteNoteFolder(folder.id);

      onFolderDeleted(folder.id);
      setActiveModal(null);
    } catch (error) {
      console.error("Kunne ikke slette mappen:", error);

      setDeleteErrorMessage("Kunne ikke slette mappen. Prøv igjen.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const contentSummary = [
    noteCount > 0 ? (noteCount === 1 ? "1 notat" : `${noteCount} notater`) : null,
    childFolders.length > 0
      ? childFolders.length === 1
        ? "1 undermappe"
        : `${childFolders.length} undermapper`
      : null,
  ].filter(Boolean);

  const destinationName = parentFolder ? `«${parentFolder.name}»` : "notatsiden";

  return (
    <>
      <div className={`folder-card-wrapper ${folderToneClass(folder)}`}>
        <Link
          to={`/fag/${subjectId}/notater/mappe/${folder.id}`}
          className="folder-card"
        >
          <span className="folder-card-icon" aria-hidden="true">
            <Folder size={24} />
          </span>

          <span className="folder-card-content">
            <span className="folder-card-name">{folder.name}</span>

            <span className="folder-card-count">
              {noteCount === 1 ? "1 notat" : `${noteCount} notater`}
            </span>
          </span>
        </Link>

        {isAdmin && <div className="folder-card-menu" ref={menuRef}>
          <button
            type="button"
            className="folder-card-menu-button"
            aria-label={`Åpne meny for ${folder.name}`}
            aria-expanded={isMenuOpen}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              setIsMenuOpen((current) => !current);
            }}
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && (
            <div className="folder-card-dropdown">
              <button type="button" onClick={() => openModal("create")}>
                <FolderPlus size={16} />
                Ny undermappe
              </button>

              <button type="button" onClick={() => openModal("move")}>
                <FolderInput size={16} />
                Flytt til mappe
              </button>

              <button type="button" onClick={() => openModal("rename")}>
                <Pencil size={16} />
                Gi nytt navn
              </button>

              <button type="button" onClick={() => openModal("delete")}>
                <Trash2 size={16} />
                Slett mappe
              </button>
            </div>
          )}
        </div>}
      </div>

      {isAdmin && activeModal === "create" && (
        <FolderNameModal
          idPrefix={`create-subfolder-${folder.id}`}
          label="Ny undermappe"
          title={`Opprett i ${folder.name}`}
          fieldLabel="Mappenavn"
          initialName=""
          submitLabel="Opprett undermappe"
          savingLabel="Oppretter..."
          errorMessage="Kunne ikke opprette undermappen. Prøv igjen."
          onSave={handleCreateSubfolder}
          onClose={closeModal}
        />
      )}

      {isAdmin && activeModal === "rename" && (
        <FolderNameModal
          idPrefix={`rename-folder-${folder.id}`}
          label="Mappe"
          title="Gi nytt navn"
          fieldLabel="Mappenavn"
          initialName={folder.name}
          submitLabel="Lagre navn"
          savingLabel="Lagrer..."
          errorMessage="Kunne ikke endre navnet. Prøv igjen."
          onSave={handleRename}
          onClose={closeModal}
        />
      )}

      {isAdmin && activeModal === "move" && (
        <FolderMoveModal
          folder={folder}
          allFolders={allFolders}
          onSave={handleMove}
          onClose={closeModal}
        />
      )}

      {isAdmin && activeModal === "delete" && (
        <div
          className="folder-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              if (!isDeleteLoading) closeModal();
            }
          }}
        >
          <div
            className="folder-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-folder-${folder.id}`}
          >
            <div className="folder-modal-header">
              <div>
                <p className="folder-modal-label">Slett mappe</p>

                <h2 id={`delete-folder-${folder.id}`}>Er du sikker?</h2>
              </div>

              <button
                type="button"
                className="folder-modal-close"
                aria-label="Lukk"
                disabled={isDeleteLoading}
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <p className="folder-delete-text">
              Mappen <strong>{folder.name}</strong> blir slettet.
            </p>

            {contentSummary.length > 0 ? (
              <p className="folder-delete-info">
                Innholdet slettes ikke: {contentSummary.join(" og ")} flyttes til{" "}
                {destinationName}.
              </p>
            ) : (
              <p className="folder-delete-info">Mappen er tom.</p>
            )}

            {deleteErrorMessage && (
              <p className="folder-modal-error">{deleteErrorMessage}</p>
            )}

            <div className="folder-modal-actions">
              <button
                type="button"
                className="folder-modal-cancel"
                disabled={isDeleteLoading}
                onClick={closeModal}
              >
                Avbryt
              </button>

              <button
                type="button"
                className="folder-modal-delete"
                disabled={isDeleteLoading}
                onClick={handleDelete}
              >
                {isDeleteLoading ? "Sletter..." : "Slett mappe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
