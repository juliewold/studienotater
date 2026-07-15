import "./NotesPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { subjects } from "../../data/subjects";
import {
  getNotesBySubject,
  type DatabaseNote,
} from "../../services/notesService";
import { useFavorites } from "../../hooks/useFavorites";
import { useProgress } from "../../hooks/useProgress";

export const NotesPage = () => {
  const { subjectId } = useParams();

  const [notes, setNotes] = useState<DatabaseNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [notesError, setNotesError] = useState("");

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
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

      <p className="notes-label">Notater</p>

      <h1>{subject.code}</h1>

      <p>{subject.name}</p>

      {(isLoadingProgress || isLoadingNotes) && (
        <p>Laster notater...</p>
      )}

      {notesError && <p>{notesError}</p>}

      {!isLoadingNotes && notes.length === 0 && (
        <p>Ingen notater er lagt til ennå.</p>
      )}

      {!isLoadingNotes && (
        <div className="notes-list">
          {notes.map((note) => {
            const favoriteId =
              `${subject.id}-database-${note.slug}`;

            const resourceId =
              `note-${subject.id}-database-${note.slug}`;

            const noteUrl =
              `/fag/${subject.id}/notater/${note.slug}`;

            const favorite = isFavorite(favoriteId, "note");

            const { completed, rating } = getProgress(
              resourceId,
              "resource",
            );

            return (
              <article
                className="note-card-wrapper"
                key={note.id}
              >
                <Link to={noteUrl} className="note-card">
                  <h3>{note.title}</h3>

                  <p>{note.description}</p>

                  <div className="note-progress-preview">
                    <span>
                      {completed ? "✓ Lest" : "Ikke lest"}
                    </span>

                    <span className={`rating-${rating}`}>
                      {"★".repeat(rating)}
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  className={`favorite-button ${
                    favorite ? "is-favorite" : ""
                  }`}
                  aria-label={
                    favorite
                      ? "Fjern fra favoritter"
                      : "Legg til i favoritter"
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
                    fill={
                      favorite ? "currentColor" : "transparent"
                    }
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