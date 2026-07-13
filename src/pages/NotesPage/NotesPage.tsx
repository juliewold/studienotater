import "./NotesPage.css";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { subjects } from "../../data/subjects";
import { notes } from "../../data/notes";
import { useFavorites } from "../../hooks/useFavorites";
import { useProgress } from "../../hooks/useProgress";

export const NotesPage = () => {
  const { subjectId } = useParams();

  const subject = subjects.find((subject) => subject.id === subjectId);
  const subjectNotes = notes[subjectId as keyof typeof notes] || [];

  const {
    isFavorite,
    toggleFavorite,
    isLoadingFavorites,
  } = useFavorites();

  const {
    getProgress,
    isLoadingProgress,
  } = useProgress();

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

      {isLoadingProgress && <p>Laster fremdrift...</p>}

      <div className="notes-list">
        {subjectNotes.map((note) => {
          const favoriteId = `${subject.id}-${note.id}`;
          const resourceId = `note-${subject.id}-${note.id}`;

          const favorite = isFavorite(favoriteId, "note");

          const { completed, rating } = getProgress(
            resourceId,
            "resource",
          );

          return (
            <article className="note-card-wrapper" key={note.id}>
              <Link
                to={`/fag/${subject.id}/notater/${note.id}`}
                className="note-card"
              >
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
                    url: `/fag/${subject.id}/notater/${note.id}`,
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
    </main>
  );
};