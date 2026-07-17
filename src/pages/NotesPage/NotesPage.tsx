import "./NotesPage.css";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { subjects } from "../../data/subjects";
import {
  getNotesBySubject,
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

export const NotesPage = () => {
  const { subjectId } = useParams();

  const { isAdmin } = useContext(AuthContext);

  const [notes, setNotes] = useState<DatabaseNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [notesError, setNotesError] = useState("");

  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [foldersError, setFoldersError] = useState("");

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  const { isFavorite, toggleFavorite, isLoadingFavorites } = useFavorites();

  const { getProgress, isLoadingProgress } = useProgress();

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
        const loadedNotes = await getNotesBySubject(subjectId);

        setNotes(loadedNotes);
      } catch (error) {
        console.error("Kunne ikke hente notater:", error);
        setNotesError("Kunne ikke hente notatene.");
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
        const loadedFolders = await getNoteFoldersBySubject(subjectId);

        setFolders(loadedFolders);
      } catch (error) {
        console.error("Kunne ikke hente mapper:", error);
        setFoldersError("Kunne ikke hente mappene.");
      } finally {
        setIsLoadingFolders(false);
      }
    };

    loadFolders();
  }, [subjectId]);

  const handleCreateFolder = async () => {
    if (!subjectId) {
      return;
    }

    const folderName = window.prompt("Hva skal mappen hete?");

    if (!folderName?.trim()) {
      return;
    }

    setFoldersError("");

    try {
      const newFolder = await createNoteFolder(subjectId, folderName.trim());

      setFolders((currentFolders) => [...currentFolders, newFolder]);
    } catch (error) {
      console.error("Kunne ikke opprette mappe:", error);
      setFoldersError("Kunne ikke opprette mappen.");
    }
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
      <Link to={`/fag/${subject.id}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <div className="notes-header">
        <div>
          <p className="notes-label">Notater</p>

          <h1>{subject.code}</h1>

          <p>{subject.name}</p>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="new-folder-button"
            onClick={handleCreateFolder}
          >
            <Plus size={20} />
            Ny mappe
          </button>
        )}
      </div>

      {foldersError && <p>{foldersError}</p>}

      {isLoadingFolders && <p>Laster mapper...</p>}

      {!isLoadingFolders && folders.length > 0 && (
        <div className="notes-folders">
          {folders.map((folder) => (
            <Link
              key={folder.id}
              to={`/fag/${subject.id}/notater/mappe/${folder.id}`}
              className="notes-folder-card"
            >
              📁 {folder.name}
            </Link>
          ))}
        </div>
      )}

      {(isLoadingProgress || isLoadingNotes) && <p>Laster notater...</p>}

      {notesError && <p>{notesError}</p>}

      {!isLoadingNotes && notes.length === 0 && (
        <p>Ingen notater er lagt til ennå.</p>
      )}

      {!isLoadingNotes && notes.length > 0 && (
        <div className="notes-list">
          {notes.map((note) => {
            const favoriteId = `${subject.id}-database-${note.slug}`;

            const resourceId = `note-${subject.id}-database-${note.slug}`;

            const noteUrl = `/fag/${subject.id}/notater/${note.slug}`;

            const favorite = isFavorite(favoriteId, "note");

            const { completed, rating } = getProgress(resourceId, "resource");

            return (
              <article className="note-card-wrapper" key={note.id}>
                <Link to={noteUrl} className="note-card">
                  <h3>{note.title}</h3>

                  <p>{note.description}</p>

                  <div className="note-progress-preview">
                    <span>{completed ? "✓ Lest" : "Ikke lest"}</span>

                    <span className={`rating-${rating}`}>
                      {"★".repeat(rating)}
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  className={`favorite-button ${favorite ? "is-favorite" : ""}`}
                  aria-label={
                    favorite ? "Fjern fra favoritter" : "Legg til i favoritter"
                  }
                  disabled={isLoadingFavorites}
                  onClick={() =>
                    toggleFavorite({
                      id: favoriteId,
                      title: note.title,
                      subject: subject.name,
                      type: "note",
                      url: noteUrl,
                    })
                  }
                >
                  <Heart
                    size={22}
                    fill={favorite ? "currentColor" : "transparent"}
                    strokeWidth={2}
                  />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};
