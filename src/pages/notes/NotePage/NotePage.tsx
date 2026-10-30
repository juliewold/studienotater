import "./NotePage.css";
import { useContext, useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

import { subjects } from "../../../data/subjects";

import type { DatabaseNote } from "../../../services/notes/notesService";

import type { NotesNavigationContext } from "../../../services/notes/notesNavigationStore";

import { AuthContext } from "../../../context/AuthContext/AuthContext";

import { EditableNote } from "../../../components/notes/EditableNote/EditableNote";


export const NotePage = () => {
  const { subjectId, noteId } = useParams();

  const { isAdmin } = useContext(AuthContext);

  const [note, setNote] = useState<DatabaseNote | null>(null);

  const navigation = useOutletContext<NotesNavigationContext>();
  const { loadNote: readNote } = navigation;
  const currentIndex = navigation.notes.findIndex(item => item.slug === noteId);
  const previousNote = !navigation.error && currentIndex > 0 ? navigation.notes[currentIndex - 1] : null;
  const nextNote = !navigation.error && currentIndex >= 0 ? navigation.notes[currentIndex + 1] ?? null : null;

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
        setIsLoadingNote(false);
        return;
      }

      setIsLoadingNote(true);
      setErrorMessage("");

      try {
        const loadedNote = await readNote(noteId);

        if (cancelled) return;
        if (!loadedNote) {
          setNote(null);
          setErrorMessage("Fant ikke notatet.");
          return;
        }

        setNote(loadedNote);
      } catch (error) {
        if (cancelled) return;
        console.error("Kunne ikke hente notat:", error);

        setNote(null);

        setErrorMessage("Kunne ikke hente notatet.");
      } finally {
        if (!cancelled) setIsLoadingNote(false);
      }
    };

    loadNote();
    return () => { cancelled = true; };
  }, [noteId, subjectId, readNote]);

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
