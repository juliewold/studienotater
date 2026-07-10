import "./NotesPage.css";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { subjects } from "../../data/subjects";
import { notes } from "../../data/notes";
import {
  getFavorites,
  toggleFavorite,
  type FavoriteItem,
} from "../../utils/favorites";
import { Heart } from "lucide-react";

export const NotesPage = () => {
  const { subjectId } = useParams();

  const subject = subjects.find((subject) => subject.id === subjectId);
  const subjectNotes = notes[subjectId as keyof typeof notes] || [];

  const [favorites, setFavorites] = useState(getFavorites);

  if (!subject) {
    return (
      <main className="notes-page">
        <h1>Fant ikke faget</h1>
      </main>
    );
  }

  const handleFavoriteClick = (item: FavoriteItem) => {
    toggleFavorite(item);
    setFavorites(getFavorites());
  };

  const noteIsFavorite = (noteId: string) => {
    return favorites.some(
      (favorite) => favorite.id === noteId && favorite.type === "note",
    );
  };

  return (
    <main className="notes-page">
      <Link to={`/fag/${subject.id}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="notes-label">Notater</p>
      <h1>{subject.code}</h1>
      <p>{subject.name}</p>

      <div className="notes-list">
        {subjectNotes.map((note) => {
          const favorite = noteIsFavorite(note.id);

          return (
            <article className="note-card-wrapper" key={note.id}>
              <Link
                to={`/fag/${subject.id}/notater/${note.id}`}
                className="note-card"
              >
                <h3>{note.title}</h3>

                <p>{note.description}</p>

                <div className="note-progress-preview">
                  <span>
                    {localStorage.getItem(
                      `resource-progress-note-${subject.id}-${note.id}-completed`,
                    ) === "true"
                      ? "✓ Lest"
                      : "Ikke lest"}
                  </span>

                  <span
                    className={`rating-${
                      Number(
                        localStorage.getItem(
                          `resource-progress-note-${subject.id}-${note.id}-rating`,
                        ),
                      ) || 0
                    }`}
                  >
                    {"★".repeat(
                      Number(
                        localStorage.getItem(
                          `resource-progress-note-${subject.id}-${note.id}-rating`,
                        ),
                      ) || 0,
                    )}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                className={`favorite-button ${favorite ? "is-favorite" : ""}`}
                aria-label={
                  favorite ? "Fjern fra favoritter" : "Legg til i favoritter"
                }
                onClick={() =>
                  handleFavoriteClick({
                    id: note.id,
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
