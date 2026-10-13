import { NOTES_CHANGED } from "../../../services/notes/notesNavigationEvents";
import "./NotePage.css";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { subjects } from "../../../data/subjects";

import {
  getNoteBySlug,
  type DatabaseNote,
} from "../../../services/notes/notesService";

import { getOrderedNotes } from "../../../services/notes/noteNavigationService";

import { AuthContext } from "../../../context/AuthContext/AuthContext";

import { EditableNote } from "../../../components/notes/EditableNote/EditableNote";


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
    let cancelled = false;
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

        if (cancelled) return;
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
          currentIndex >= 0 && currentIndex < orderedNotes.length - 1
            ? orderedNotes[currentIndex + 1]
            : null,
        );
      } catch (error) {
        if (cancelled) return;
        console.error("Kunne ikke hente notat:", error);

        setNote(null);
        setPreviousNote(null);
        setNextNote(null);

        setErrorMessage("Kunne ikke hente notatet.");
      } finally {
        if (!cancelled) setIsLoadingNote(false);
      }
    };

    loadNote();
    return () => { cancelled = true; };
  }, [noteId, subjectId]);

  // Refresh links when the shared outline changes, without resetting an editor draft.
  useEffect(() => {
    if (!subjectId || !note?.id) return;
    let cancelled = false;
    let request = 0;
    const refresh = async () => {
      const current = ++request;
      try {
        const ordered = await getOrderedNotes(subjectId);
        if (cancelled || current !== request) return;
        const index = ordered.findIndex(item => item.id === note.id);
        setPreviousNote(index > 0 ? ordered[index - 1] : null);
        setNextNote(index >= 0 && index + 1 < ordered.length ? ordered[index + 1] : null);
      } catch {
        if (!cancelled && current === request) {
          setPreviousNote(null);
          setNextNote(null);
        }
      }
    };
    window.addEventListener(NOTES_CHANGED, refresh);
    return () => { cancelled = true; window.removeEventListener(NOTES_CHANGED, refresh); };
  }, [subjectId, note?.id]);

  if (isLoadingNote) {
    return (
      <main className="note-page site-container">
        <p>Laster notat...</p>
      </main>
    );
  }

  if (!subject || !note) {
    return (
      <main className="note-page site-container">
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
    <main className="note-page site-container">
      <div className="note-page-topbar">
        <Link to={backUrl} className="back-link">
          ← Tilbake
        </Link>
      </div>
      <nav
        className="note-navigation note-navigation-sticky"
        aria-label="Navigasjon mellom notater"
      >
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
      <EditableNote
        key={note.id}
        note={note}
        subjectCode={subject.code}
        isAdmin={isAdmin}
        onNoteUpdated={setNote}
        resourceId={resourceId}
      />
    </main>
  );
};
