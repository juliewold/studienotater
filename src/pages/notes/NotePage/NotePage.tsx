import "./NotePage.css";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { subjects } from "../../../data/subjects";

import { getNoteBySlug, type DatabaseNote } from "../../../services/notesService";

import { getOrderedNotes } from "../../../services/noteNavigationService";

import { AuthContext } from "../../../context/AuthContext/AuthContext";

import { EditableNote } from "../../../components/notes/EditableNote/EditableNote";
import { ResourceProgress } from "../../../components/progress/ResourceProgress/ResourceProgress";

export const NotePage = () => {
  const { subjectId, noteId } = useParams();

  const { isAdmin } = useContext(AuthContext);

  const [note, setNote] = useState<DatabaseNote | null>(null);

  const [previousNote, setPreviousNote] = useState<DatabaseNote | null>(null);

  const [nextNote, setNextNote] = useState<DatabaseNote | null>(null);

  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  useEffect(() => {
    const loadNote = async () => {
      if (!subjectId || !noteId) {
        setNote(null);
        setPreviousNote(null);
        setNextNote(null);
        setIsLoadingNote(false);
        return;
      }

      setIsLoadingNote(true);
      setErrorMessage("");
      setPreviousNote(null);
      setNextNote(null);

      try {
        const [loadedNote, orderedNotes] = await Promise.all([
          getNoteBySlug(subjectId, noteId),
          getOrderedNotes(subjectId),
        ]);

        if (!loadedNote) {
          setNote(null);
          setErrorMessage("Fant ikke notatet.");
          return;
        }

        setNote(loadedNote);

        const currentIndex = orderedNotes.findIndex(
          (currentNote) => currentNote.id === loadedNote.id,
        );

        setPreviousNote(
          currentIndex > 0 ? orderedNotes[currentIndex - 1] : null,
        );

        setNextNote(
          currentIndex < orderedNotes.length - 1
            ? orderedNotes[currentIndex + 1]
            : null,
        );
      } catch (error) {
        console.error("Kunne ikke hente notat:", error);

        setNote(null);
        setPreviousNote(null);
        setNextNote(null);

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

  if (!subject || !note) {
    return (
      <main className="note-page">
        <Link to={`/fag/${subjectId}/notater`} className="back-link">
          ← Tilbake til notater
        </Link>

        <h1>Fant ikke notatet</h1>

        {errorMessage && <p>{errorMessage}</p>}
      </main>
    );
  }

  const backUrl = note.folderId
    ? `/fag/${subject.id}/notater/mappe/${note.folderId}`
    : `/fag/${subject.id}/notater`;

  const resourceId = `note-${subject.id}-database-${note.slug}`;

  return (
    <main className="note-page">
      <div className="note-page-topbar">
        <Link to={backUrl} className="back-link">
          ← Tilbake
        </Link>

        <nav className="note-navigation" aria-label="Navigasjon mellom notater">
          {previousNote && (
            <Link
              to={`/fag/${subject.id}/notater/${previousNote.slug}`}
              className="note-navigation-button"
              title={previousNote.title}
            >
              ← Forrige
            </Link>
          )}

          {nextNote && (
            <Link
              to={`/fag/${subject.id}/notater/${nextNote.slug}`}
              className="note-navigation-button"
              title={nextNote.title}
            >
              Neste →
            </Link>
          )}
        </nav>
      </div>
      <EditableNote
        note={note}
        subjectCode={subject.code}
        isAdmin={isAdmin}
        onNoteUpdated={setNote}
      />{" "}
      <hr className="note-page-divider" />
      <ResourceProgress resourceId={resourceId} />
    </main>
  );
};
