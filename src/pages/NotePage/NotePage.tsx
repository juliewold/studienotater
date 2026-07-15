import "./NotePage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { subjects } from "../../data/subjects";
import {
  getNoteBySlug,
  type DatabaseNote,
} from "../../services/notesService";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

export const NotePage = () => {
  const { subjectId, noteId } = useParams();

  const [note, setNote] = useState<DatabaseNote | null>(null);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  useEffect(() => {
    const loadNote = async () => {
      if (!subjectId || !noteId) {
        setNote(null);
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

        setNote(loadedNote);
      } catch (error) {
        console.error("Kunne ikke hente notat:", error);
        setErrorMessage("Kunne ikke hente notatet.");
      } finally {
        setIsLoadingNote(false);
      }
    };

    loadNote();
  }, [noteId, subjectId]);

  if (isLoadingNote) {
    return (
      <main className="note-page">
        <p>Laster notat...</p>
      </main>
    );
  }

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
    `note-${subject.id}-database-${note.slug}`;

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
        <pre>{note.content}</pre>
      </section>
    </main>
  );
};