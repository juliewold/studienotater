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
import {
  getAllProgress,
  type ProgressItem,
} from "../../services/progressService";
import type { FavoriteItem } from "../../utils/favorites";

export const NotesPage = () => {
  const { subjectId } = useParams();
  const { user } = useContext(AuthContext);

  const subject = subjects.find((subject) => subject.id === subjectId);
  const subjectNotes = notes[subjectId as keyof typeof notes] || [];

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);

  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

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

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setProgressItems([]);
        setIsLoadingProgress(false);
        return;
      }

      try {
        const loadedProgress = await getAllProgress(user.id);
        setProgressItems(loadedProgress);
      } catch (error) {
        console.error("Kunne ikke hente fremdrift:", error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
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
      (favorite) =>
        favorite.id === item.id && favorite.type === item.type,
    );

    try {
      if (favoriteAlreadyExists) {
        await removeFavorite(user.id, item.id, item.type);

        setFavorites((currentFavorites) =>
          currentFavorites.filter(
            (favorite) =>
              !(
                favorite.id === item.id &&
                favorite.type === item.type
              ),
          ),
        );

        return;
      }

      await addFavorite(user.id, item);

      setFavorites((currentFavorites) => [
        item,
        ...currentFavorites,
      ]);
    } catch (error) {
      console.error("Kunne ikke oppdatere favoritt:", error);
    }
  };

  const noteIsFavorite = (favoriteId: string) => {
    return favorites.some(
      (favorite) =>
        favorite.id === favoriteId && favorite.type === "note",
    );
  };

  const getNoteProgress = (noteId: string) => {
    const resourceId = `note-${subject.id}-${noteId}`;

    return (
      progressItems.find(
        (progress) =>
          progress.itemId === resourceId &&
          progress.itemType === "resource",
      ) ?? {
        completed: false,
        rating: 0,
      }
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

      {isLoadingProgress && <p>Laster fremdrift...</p>}

      <div className="notes-list">
        {subjectNotes.map((note) => {
          const favoriteId = `${subject.id}-${note.id}`;
          const favorite = noteIsFavorite(favoriteId);

          const { completed, rating } = getNoteProgress(note.id);

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
                  handleFavoriteClick({
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