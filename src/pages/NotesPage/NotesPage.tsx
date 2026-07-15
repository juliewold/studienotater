import "./NotesPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { subjects } from "../../data/subjects";
import { notes } from "../../data/notes";
import {
  getNotesBySubject,
  type DatabaseNote,
} from "../../services/notesService";
import { useFavorites } from "../../hooks/useFavorites";
import { useProgress } from "../../hooks/useProgress";

type LocalNote = {
  id: string;
  title: string;
  description: string;
  content?: string;
};

type NoteListItem = {
  id: string;
  title: string;
  description: string;
  source: "local" | "database";
};

export const NotesPage = () => {
  const { subjectId } = useParams();

  const [databaseNotes, setDatabaseNotes] = useState<DatabaseNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [notesError, setNotesError] = useState("");

  const subject = subjects.find((subject) => subject.id === subjectId);

  const localNotes: LocalNote[] =
    notes[subjectId as keyof typeof notes] || [];

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
        setDatabaseNotes([]);
        setIsLoadingNotes(false);
        return;
      }

      setIsLoadingNotes(true);
      setNotesError("");

      try {
        const loadedNotes = await getNotesBySubject(subjectId);
        setDatabaseNotes(loadedNotes);
      } catch (error) {
        console.error("Kunne ikke hente notater:", error);
        setNotesError("Kunne ikke hente nye notater.");
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

  const allNotes: NoteListItem[] = [
    ...localNotes.map((note) => ({
      id: note.id,
      title: note.title,
      description: note.description,
      source: "local" as const,
    })),
    ...databaseNotes.map((note) => ({
      id: note.slug,
      title: note.title,
      description: note.description,
      source: "database" as const,
    })),
  ];

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

      {!isLoadingNotes && (
        <div className="notes-list">
          {allNotes.map((note) => {
            const sourcePrefix =
              note.source === "database" ? "database" : "local";

            const favoriteId =
              `${subject.id}-${sourcePrefix}-${note.id}`;

            const resourceId =
              `note-${subject.id}-${sourcePrefix}-${note.id}`;

            const noteUrl =
              `/fag/${subject.id}/notater/${note.id}` +
              `?source=${note.source}`;

            const favorite = isFavorite(favoriteId, "note");

            const { completed, rating } = getProgress(
              resourceId,
              "resource",
            );

            return (
              <article
                className="note-card-wrapper"
                key={`${note.source}-${note.id}`}
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