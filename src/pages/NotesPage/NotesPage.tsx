import "./NotesPage.css";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { subjects } from "../../data/subjects";
import { notes } from "../../data/notes";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../services/favoritesService";
import type { FavoriteItem } from "../../utils/favorites";

export const NotesPage = () => {
  const { subjectId } = useParams();
  const { user } = useContext(AuthContext);

  const subject = subjects.find((subject) => subject.id === subjectId);
  const subjectNotes = notes[subjectId as keyof typeof notes] || [];

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setIsLoadingFavorites(false);
        return;
      }

      try {
        const loadedFavorites = await getFavorites(user.id);
        setFavorites(loadedFavorites);
      } catch (error) {
        console.error("Kunne ikke hente favoritter:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, [user]);

  if (!subject) {
    return (
      <main className="notes-page">
        <h1>Fant ikke faget</h1>
      </main>
    );
  }

  const handleFavoriteClick = async (item: FavoriteItem) => {
    if (!user) {
      return;
    }

    const favoriteAlreadyExists = favorites.some(
      (favorite) => favorite.id === item.id && favorite.type === item.type,
    );

    try {
      if (favoriteAlreadyExists) {
        await removeFavorite(user.id, item.id, item.type);

        setFavorites((currentFavorites) =>
          currentFavorites.filter(
            (favorite) =>
              !(favorite.id === item.id && favorite.type === item.type),
          ),
        );

        return;
      }

      await addFavorite(user.id, item);

      setFavorites((currentFavorites) => [item, ...currentFavorites]);
    } catch (error) {
      console.error("Kunne ikke oppdatere favoritt:", error);
    }
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
          const favoriteId = `${subject.id}-${note.id}`;
          const favorite = noteIsFavorite(favoriteId);

          const completed =
            localStorage.getItem(
              `resource-progress-note-${subject.id}-${note.id}-completed`,
            ) === "true";

          const rating =
            Number(
              localStorage.getItem(
                `resource-progress-note-${subject.id}-${note.id}-rating`,
              ),
            ) || 0;

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
                className={`favorite-button ${favorite ? "is-favorite" : ""}`}
                aria-label={
                  favorite ? "Fjern fra favoritter" : "Legg til i favoritter"
                }
                disabled={isLoadingFavorites}
                onClick={() =>
                  handleFavoriteClick({
                    id: `${subject.id}-${note.id}`,
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
