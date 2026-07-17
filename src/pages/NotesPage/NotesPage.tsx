import "./NotesPage.css";
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import {
  Heart,
  Plus,
  X,
} from "lucide-react";

import { subjects } from "../../data/subjects";

import {
  getNotesWithoutFolder,
  type DatabaseNote,
} from "../../services/notesService";

import {
  createNoteFolder,
  getNoteFoldersBySubject,
  type NoteFolder,
} from "../../services/noteFoldersService";

import { useFavorites } from "../../hooks/useFavorites";
import { useProgress } from "../../hooks/useProgress";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { FolderCard } from "../../components/FolderCard/FolderCard";

export const NotesPage = () => {
  const { subjectId } = useParams();

  const { isAdmin } =
    useContext(AuthContext);

  const [notes, setNotes] = useState<
    DatabaseNote[]
  >([]);

  const [
    isLoadingNotes,
    setIsLoadingNotes,
  ] = useState(true);

  const [notesError, setNotesError] =
    useState("");

  const [folders, setFolders] = useState<
    NoteFolder[]
  >([]);

  const [
    isLoadingFolders,
    setIsLoadingFolders,
  ] = useState(true);

  const [foldersError, setFoldersError] =
    useState("");

  const [
    isFolderModalOpen,
    setIsFolderModalOpen,
  ] = useState(false);

  const [folderName, setFolderName] =
    useState("");

  const [
    folderModalError,
    setFolderModalError,
  ] = useState("");

  const [
    isCreatingFolder,
    setIsCreatingFolder,
  ] = useState(false);

  const folderNameInputRef =
    useRef<HTMLInputElement | null>(null);

  const subject = subjects.find(
    (currentSubject) =>
      currentSubject.id === subjectId,
  );

  const {
    isFavorite,
    toggleFavorite,
    isLoadingFavorites,
  } = useFavorites();

  const {
    getProgress,
    isLoadingProgress,
  } = useProgress();

  useEffect(() => {
    const loadNotes = async () => {
      if (!subjectId) {
        setNotes([]);
        setIsLoadingNotes(false);
        return;
      }

      setIsLoadingNotes(true);
      setNotesError("");

      try {
        const loadedNotes =
          await getNotesWithoutFolder(
            subjectId,
          );

        setNotes(loadedNotes);
      } catch (error) {
        console.error(
          "Kunne ikke hente notater:",
          error,
        );

        setNotesError(
          "Kunne ikke hente notatene.",
        );
      } finally {
        setIsLoadingNotes(false);
      }
    };

    loadNotes();
  }, [subjectId]);

  useEffect(() => {
    const loadFolders = async () => {
      if (!subjectId) {
        setFolders([]);
        setIsLoadingFolders(false);
        return;
      }

      setIsLoadingFolders(true);
      setFoldersError("");

      try {
        const loadedFolders =
          await getNoteFoldersBySubject(
            subjectId,
          );

        setFolders(loadedFolders);
      } catch (error) {
        console.error(
          "Kunne ikke hente mapper:",
          error,
        );

        setFoldersError(
          "Kunne ikke hente mappene.",
        );
      } finally {
        setIsLoadingFolders(false);
      }
    };

    loadFolders();
  }, [subjectId]);

  useEffect(() => {
    if (!isFolderModalOpen) {
      return;
    }

    folderNameInputRef.current?.focus();

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsFolderModalOpen(false);
        setFolderName("");
        setFolderModalError("");
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
  }, [isFolderModalOpen]);

  const openFolderModal = () => {
    setFolderName("");
    setFolderModalError("");
    setIsFolderModalOpen(true);
  };

  const closeFolderModal = () => {
    if (isCreatingFolder) {
      return;
    }

    setIsFolderModalOpen(false);
    setFolderName("");
    setFolderModalError("");
  };

  const handleCreateFolder = async () => {
    if (!subjectId) {
      return;
    }

    const trimmedFolderName =
      folderName.trim();

    if (!trimmedFolderName) {
      setFolderModalError(
        "Du må skrive inn et navn på mappen.",
      );
      return;
    }

    setIsCreatingFolder(true);
    setFolderModalError("");
    setFoldersError("");

    try {
      const newFolder =
        await createNoteFolder(
          subjectId,
          trimmedFolderName,
        );

      setFolders((currentFolders) => [
        ...currentFolders,
        newFolder,
      ]);

      setIsFolderModalOpen(false);
      setFolderName("");
    } catch (error) {
      console.error(
        "Kunne ikke opprette mappe:",
        error,
      );

      setFolderModalError(
        "Kunne ikke opprette mappen.",
      );
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFolderFormSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    handleCreateFolder();
  };

  if (!subject) {
    return (
      <main className="notes-page">
        <h1>Fant ikke faget</h1>
      </main>
    );
  }

  return (
    <main className="notes-page">
      <Link
        to={`/fag/${subject.id}`}
        className="back-link"
      >
        ← Tilbake til faget
      </Link>

      <div className="notes-header">
        <div>
          <p className="notes-label">
            Notater
          </p>

          <h1>{subject.code}</h1>

          <p>{subject.name}</p>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="new-folder-button"
            onClick={openFolderModal}
          >
            <Plus size={20} />
            Ny mappe
          </button>
        )}
      </div>

      {foldersError && (
        <p className="notes-error-message">
          {foldersError}
        </p>
      )}

      {isLoadingFolders && (
        <p>Laster mapper...</p>
      )}

      {!isLoadingFolders &&
        folders.length > 0 && (
          <div className="notes-folders">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                subjectId={subject.id}
                onFolderUpdated={(
                  updatedFolder,
                ) => {
                  setFolders(
                    (currentFolders) =>
                      currentFolders.map(
                        (currentFolder) =>
                          currentFolder.id ===
                          updatedFolder.id
                            ? updatedFolder
                            : currentFolder,
                      ),
                  );
                }}
                onFolderDeleted={(
                  deletedFolderId,
                ) => {
                  setFolders(
                    (currentFolders) =>
                      currentFolders.filter(
                        (currentFolder) =>
                          currentFolder.id !==
                          deletedFolderId,
                      ),
                  );
                }}
              />
            ))}
          </div>
        )}

      {(isLoadingProgress ||
        isLoadingNotes) && (
        <p>Laster notater...</p>
      )}

      {notesError && (
        <p className="notes-error-message">
          {notesError}
        </p>
      )}

      {!isLoadingNotes &&
        notes.length === 0 && (
          <p>
            Ingen notater er lagt til ennå.
          </p>
        )}

      {!isLoadingNotes &&
        notes.length > 0 && (
          <div className="notes-list">
            {notes.map((note) => {
              const favoriteId =
                `${subject.id}-database-${note.slug}`;

              const resourceId =
                `note-${subject.id}-database-${note.slug}`;

              const noteUrl =
                `/fag/${subject.id}/notater/${note.slug}`;

              const favorite = isFavorite(
                favoriteId,
                "note",
              );

              const {
                completed,
                rating,
              } = getProgress(
                resourceId,
                "resource",
              );

              return (
                <article
                  className="note-card-wrapper"
                  key={note.id}
                >
                  <Link
                    to={noteUrl}
                    className="note-card"
                  >
                    <h3>{note.title}</h3>

                    <p>
                      {note.description}
                    </p>

                    <div className="note-progress-preview">
                      <span>
                        {completed
                          ? "✓ Lest"
                          : "Ikke lest"}
                      </span>

                      <span
                        className={`rating-${rating}`}
                      >
                        {"★".repeat(rating)}
                      </span>
                    </div>
                  </Link>

                  <button
                    type="button"
                    className={`favorite-button ${
                      favorite
                        ? "is-favorite"
                        : ""
                    }`}
                    aria-label={
                      favorite
                        ? "Fjern fra favoritter"
                        : "Legg til i favoritter"
                    }
                    disabled={
                      isLoadingFavorites
                    }
                    onClick={() =>
                      toggleFavorite({
                        id: favoriteId,
                        title: note.title,
                        subject:
                          subject.name,
                        type: "note",
                        url: noteUrl,
                      })
                    }
                  >
                    <Heart
                      size={22}
                      fill={
                        favorite
                          ? "currentColor"
                          : "transparent"
                      }
                      strokeWidth={2}
                    />
                  </button>
                </article>
              );
            })}
          </div>
        )}

      {isFolderModalOpen && (
        <div
          className="folder-modal-backdrop"
          onMouseDown={closeFolderModal}
        >
          <section
            className="folder-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="folder-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="folder-modal-header">
              <div>
                <p className="folder-modal-label">
                  Ny mappe
                </p>

                <h2 id="folder-modal-title">
                  Opprett mappe
                </h2>
              </div>

              <button
                type="button"
                className="folder-modal-close-button"
                aria-label="Lukk"
                onClick={closeFolderModal}
                disabled={
                  isCreatingFolder
                }
              >
                <X size={21} />
              </button>
            </div>

            <form
              className="folder-modal-form"
              onSubmit={
                handleFolderFormSubmit
              }
            >
              <label htmlFor="folder-name">
                Mappenavn
              </label>

              <input
                ref={folderNameInputRef}
                id="folder-name"
                type="text"
                value={folderName}
                onChange={(event) => {
                  setFolderName(
                    event.target.value,
                  );

                  if (folderModalError) {
                    setFolderModalError(
                      "",
                    );
                  }
                }}
                placeholder="For eksempel Forelesninger"
                disabled={
                  isCreatingFolder
                }
              />

              {folderModalError && (
                <p className="folder-modal-error">
                  {folderModalError}
                </p>
              )}

              <div className="folder-modal-actions">
                <button
                  type="button"
                  className="folder-modal-cancel-button"
                  onClick={
                    closeFolderModal
                  }
                  disabled={
                    isCreatingFolder
                  }
                >
                  Avbryt
                </button>

                <button
                  type="submit"
                  className="folder-modal-submit-button"
                  disabled={
                    isCreatingFolder
                  }
                >
                  <Plus size={18} />

                  {isCreatingFolder
                    ? "Oppretter..."
                    : "Opprett mappe"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};