import "./AllNotesPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { subjects } from "../../data/subjects";
import {
  getNotesBySubject,
  type DatabaseNote,
} from "../../services/notesService";
import { useProgress } from "../../hooks/useProgress";

type AllNoteItem = DatabaseNote & {
  subjectCode: string;
};

export const AllNotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState<AllNoteItem[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const { getProgress, isLoadingProgress } = useProgress();

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoadingNotes(true);
      setErrorMessage("");

      try {
        const notesBySubject = await Promise.all(
          subjects.map(async (subject) => {
            const subjectNotes = await getNotesBySubject(subject.id);

            return subjectNotes.map((note) => ({
              ...note,
              subjectCode: subject.code,
            }));
          }),
        );

        const loadedNotes = notesBySubject
          .flat()
          .sort((firstNote, secondNote) =>
            firstNote.title.localeCompare(
              secondNote.title,
              "nb",
            ),
          );

        setNotes(loadedNotes);
      } catch (error) {
        console.error("Kunne ikke hente notater:", error);
        setErrorMessage("Kunne ikke hente notatene.");
      } finally {
        setIsLoadingNotes(false);
      }
    };

    loadNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const normalizedSearchTerm = searchTerm
      .trim()
      .toLowerCase();

    if (!normalizedSearchTerm) {
      return notes;
    }

    return notes.filter((note) =>
      `${note.title} ${note.description} ${note.subjectCode}`
        .toLowerCase()
        .includes(normalizedSearchTerm),
    );
  }, [notes, searchTerm]);

  return (
    <main className="page-container">
      <p className="page-label">Notater</p>

      <h1>Notater</h1>

      <input
        className="notes-search"
        type="search"
        placeholder="Søk i notater..."
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
      />

      {(isLoadingProgress || isLoadingNotes) && (
        <p>Laster notater...</p>
      )}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingNotes &&
        !errorMessage &&
        filteredNotes.length === 0 && (
          <p>Fant ingen notater.</p>
        )}

      {!isLoadingNotes && !errorMessage && (
        <div className="all-notes-grid">
          {filteredNotes.map((note) => {
            const resourceId =
              `note-${note.subjectId}-database-${note.slug}`;

            const { completed, rating } = getProgress(
              resourceId,
              "resource",
            );

            return (
              <Link
                key={note.id}
                to={`/fag/${note.subjectId}/notater/${note.slug}`}
                className="note-card"
              >
                <p className="subject-code">
                  {note.subjectCode}
                </p>

                <h3>{note.title}</h3>

                <p>{note.description}</p>

                <div className="note-progress-preview">
                  <span>
                    {completed ? "✓ Lest" : "Ikke lest"}
                  </span>

                  <span>{"★".repeat(rating)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
};