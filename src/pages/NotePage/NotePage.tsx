import "./NotePage.css";
import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { subjects } from "../../data/subjects";
import { notes } from "../../data/notes";
import {
  getNoteBySlug,
  type DatabaseNote,
} from "../../services/notesService";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

type LocalNote = {
  id: string;
  title: string;
  description: string;
  content?: string;
};

export const NotePage = () => {
  const { subjectId, noteId } = useParams();
  const [searchParams] = useSearchParams();

  const source = searchParams.get("source") ?? "local";

  const [databaseNote, setDatabaseNote] =
    useState<DatabaseNote | null>(null);
  const [isLoadingNote, setIsLoadingNote] = useState(
    source === "database",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  const subjectNotes: LocalNote[] =
    notes[subjectId as keyof typeof notes] || [];

  const localNote = subjectNotes.find(
    (currentNote) => currentNote.id === noteId,
  );

  useEffect(() => {
    const loadDatabaseNote = async () => {
      if (
        source !== "database" ||
        !subjectId ||
        !noteId
      ) {
        setDatabaseNote(null);
        setIsLoadingNote(false);
        return;
      }

      setIsLoadingNote(true);
      setErrorMessage("");

      try {
        const loadedNote = await getNoteBySlug(
          subjectId,
          noteId,
        );

        if (!loadedNote) {
          setErrorMessage("Fant ikke notatet.");
          return;
        }

        setDatabaseNote(loadedNote);
      } catch (error) {
        console.error("Kunne ikke hente notat:", error);
        setErrorMessage("Kunne ikke hente notatet.");
      } finally {
        setIsLoadingNote(false);
      }
    };

    loadDatabaseNote();
  }, [noteId, source, subjectId]);

  if (isLoadingNote) {
    return (
      <main className="note-page">
        <p>Laster notat...</p>
      </main>
    );
  }

  const note =
    source === "database" ? databaseNote : localNote;

  if (!subject || !note || errorMessage) {
    return (
      <main className="note-page">
        <Link
          to={`/fag/${subjectId}/notater`}
          className="back-link"
        >
          ← Tilbake til notater
        </Link>

        <h1>Fant ikke notatet</h1>

        {errorMessage && <p>{errorMessage}</p>}
      </main>
    );
  }

  const resourceId =
    `note-${subject.id}-${source}-${noteId}`;

  return (
    <main className="note-page">
      <Link
        to={`/fag/${subject.id}/notater`}
        className="back-link"
      >
        ← Tilbake til notater
      </Link>

      <p className="note-label">{subject.code}</p>

      <h1>{note.title}</h1>

      <p>{note.description}</p>

      <ResourceProgress resourceId={resourceId} />

      <section className="note-content">
        <pre>{note.content ?? ""}</pre>
      </section>
    </main>
  );
};