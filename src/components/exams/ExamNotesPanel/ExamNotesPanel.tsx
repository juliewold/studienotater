import "./ExamNotesPanel.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Link2, Plus, Search, Unlink } from "lucide-react";
import { EditableNote } from "../../notes/EditableNote/EditableNote";
import {
  getNoteById,
  getNoteMetadataBySubject,
  type DatabaseNote,
  type NoteMetadata,
} from "../../../services/notes/notesService";
import {
  getNoteFoldersBySubject,
  type NoteFolder,
} from "../../../services/notes/noteFoldersService";
import {
  createLinkedExamTaskNote,
  linkExamTaskNote,
  unlinkExamTaskNote,
} from "../../../services/exams/examTaskNotesService";
import type { DatabaseExam } from "../../../services/exams/examsService";

type Props = {
  subjectId: string;
  subjectCode: string;
  exam: DatabaseExam;
  taskLabel: string | null;
  linkedNoteId: string | null;
  // Notater som allerede er koblet til en annen deloppgave. De kan ikke velges på nytt.
  noteIdsLinkedElsewhere: Set<string>;
  linksError: string;
  isAdmin: boolean;
  onLinksChanged: () => Promise<void>;
};

// Viser den skrevne løsningen for valgt deloppgave. Notatet er det samme som i Notater,
// så redigering skjer i det originale notatet.
export const ExamNotesPanel = ({
  subjectId,
  subjectCode,
  exam,
  taskLabel,
  linkedNoteId,
  noteIdsLinkedElsewhere,
  linksError,
  isAdmin,
  onLinksChanged,
}: Props) => {
  const [loadedNote, setLoadedNote] = useState<DatabaseNote | null>(null);
  const [noteError, setNoteError] = useState("");

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerNotes, setPickerNotes] = useState<NoteMetadata[]>([]);
  const [pickerFolders, setPickerFolders] = useState<NoteFolder[]>([]);
  const [pickerSearch, setPickerSearch] = useState("");
  const [isLoadingPicker, setIsLoadingPicker] = useState(false);

  const [isWorking, setIsWorking] = useState(false);
  const [actionError, setActionError] = useState("");

  // Notatet hentes på nytt når koblingen endres. Gammelt innhold vises ikke.
  useEffect(() => {
    if (!linkedNoteId) return;

    let cancelled = false;

    const loadNote = async () => {
      setNoteError("");

      try {
        const note = await getNoteById(linkedNoteId);

        if (cancelled) return;

        if (!note) {
          setNoteError("Fant ikke det koblede notatet. Det kan være slettet.");
          return;
        }

        setLoadedNote(note);
      } catch (error) {
        if (cancelled) return;
        console.error("Kunne ikke hente skrevet løsning:", error);
        setNoteError("Kunne ikke hente den skrevne løsningen.");
      }
    };

    loadNote();

    return () => {
      cancelled = true;
    };
  }, [linkedNoteId]);

  const folderNames = useMemo(
    () => new Map(pickerFolders.map((folder) => [folder.id, folder.name])),
    [pickerFolders],
  );

  const filteredPickerNotes = useMemo(() => {
    const query = pickerSearch.trim().toLowerCase();

    return pickerNotes
      .filter((note) => note.id !== linkedNoteId)
      .filter((note) => !query || note.title.toLowerCase().includes(query));
  }, [pickerNotes, pickerSearch, linkedNoteId]);

  if (!taskLabel) {
    return (
      <div className="exam-notes-empty">
        <FileText size={28} aria-hidden="true" />
        <p>Velg en deloppgave i listen til venstre for å åpne den skrevne løsningen.</p>
      </div>
    );
  }

  const currentNote = linkedNoteId && loadedNote?.id === linkedNoteId ? loadedNote : null;
  const resourceId = currentNote ? `note-${subjectId}-database-${currentNote.slug}` : undefined;

  const openPicker = async () => {
    setIsPickerOpen(true);
    setPickerSearch("");
    setActionError("");
    setIsLoadingPicker(true);

    try {
      const [notes, folders] = await Promise.all([
        getNoteMetadataBySubject(subjectId),
        getNoteFoldersBySubject(subjectId),
      ]);

      setPickerNotes(notes);
      setPickerFolders(folders);
    } catch (error) {
      console.error("Kunne ikke hente notatene:", error);
      setActionError("Kunne ikke hente notatene for faget.");
    } finally {
      setIsLoadingPicker(false);
    }
  };

  const chooseNote = async (noteId: string) => {
    if (linkedNoteId && linkedNoteId !== noteId) {
      const shouldReplace = window.confirm(
        "Oppgaven har allerede et notat. Det gamle notatet beholdes i Notater, men kobles fra denne oppgaven. Fortsette?",
      );

      if (!shouldReplace) return;
    }

    setIsWorking(true);
    setActionError("");

    try {
      await linkExamTaskNote(exam.id, taskLabel, noteId);
      setIsPickerOpen(false);
      await onLinksChanged();
    } catch (error) {
      console.error("Kunne ikke koble notat:", error);
      setActionError(error instanceof Error ? error.message : "Kunne ikke koble notatet.");
    } finally {
      setIsWorking(false);
    }
  };

  const createNewNote = async () => {
    setIsWorking(true);
    setActionError("");

    try {
      await createLinkedExamTaskNote({
        examId: exam.id,
        subjectId,
        examTitle: exam.title,
        taskLabel,
      });
      await onLinksChanged();
    } catch (error) {
      console.error("Kunne ikke opprette notat:", error);
      setActionError(error instanceof Error ? error.message : "Kunne ikke opprette notatet.");
    } finally {
      setIsWorking(false);
    }
  };

  const removeLink = async () => {
    const shouldRemove = window.confirm(
      "Fjerne koblingen til denne oppgaven? Notatet slettes ikke og finnes fortsatt i Notater.",
    );

    if (!shouldRemove) return;

    setIsWorking(true);
    setActionError("");

    try {
      await unlinkExamTaskNote(exam.id, taskLabel);
      await onLinksChanged();
    } catch (error) {
      console.error("Kunne ikke fjerne kobling:", error);
      setActionError("Kunne ikke fjerne koblingen.");
    } finally {
      setIsWorking(false);
    }
  };

  const errorText = actionError || linksError;

  return (
    <section className="exam-notes-panel" aria-label={`Skrevet løsning for oppgave ${taskLabel}`}>
      <div className="exam-notes-toolbar">
        <h2 className="exam-notes-title">Oppgave {taskLabel}</h2>

        <div className="exam-notes-actions">
          {currentNote && (
            <Link className="exam-notes-action" to={`/fag/${subjectId}/notater/${currentNote.slug}`}>
              Åpne i Notater
            </Link>
          )}

          {isAdmin && linkedNoteId && (
            <>
              <button type="button" className="exam-notes-action" onClick={openPicker} disabled={isWorking}>
                <Link2 size={15} aria-hidden="true" /> Bytt notat
              </button>
              <button type="button" className="exam-notes-action" onClick={removeLink} disabled={isWorking}>
                <Unlink size={15} aria-hidden="true" /> Fjern kobling
              </button>
            </>
          )}
        </div>
      </div>

      {errorText && (
        <p className="exam-notes-message exam-notes-error" role="alert">
          {errorText}
        </p>
      )}

      {linkedNoteId && !currentNote && !noteError && <p role="status">Laster skrevet løsning…</p>}

      {linkedNoteId && noteError && <p className="exam-notes-message exam-notes-error">{noteError}</p>}

      {currentNote && (
        <EditableNote
          key={currentNote.id}
          note={currentNote}
          subjectCode={subjectCode}
          isAdmin={isAdmin}
          onNoteUpdated={setLoadedNote}
          showClassification={false}
          resourceId={resourceId}
        />
      )}

      {!linkedNoteId && !isPickerOpen && (
        <div className="exam-notes-missing">
          <h3>Ingen skrevet løsning er koblet til denne oppgaven ennå.</h3>

          {isAdmin ? (
            <div className="exam-notes-actions">
              <button type="button" className="exam-notes-primary" onClick={openPicker} disabled={isWorking}>
                <Link2 size={16} aria-hidden="true" /> Koble til eksisterende notat
              </button>
              <button type="button" className="exam-notes-action" onClick={createNewNote} disabled={isWorking}>
                <Plus size={16} aria-hidden="true" /> Opprett nytt notat
              </button>
            </div>
          ) : (
            <p>Den skrevne løsningen legges til av administrator.</p>
          )}
        </div>
      )}

      {isPickerOpen && isAdmin && (
        <div className="exam-notes-picker">
          <div className="exam-notes-picker-header">
            <h3>Velg notat for oppgave {taskLabel}</h3>
            <button type="button" className="exam-notes-action" onClick={() => setIsPickerOpen(false)}>
              Avbryt
            </button>
          </div>

          <label className="exam-notes-search">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={pickerSearch}
              onChange={(event) => setPickerSearch(event.target.value)}
              placeholder="Søk i notatene til faget"
            />
          </label>

          {isLoadingPicker && <p role="status">Laster notater…</p>}

          {!isLoadingPicker && (
            <ul className="exam-notes-picker-list">
              {filteredPickerNotes.map((note) => {
                const isLinkedElsewhere = noteIdsLinkedElsewhere.has(note.id);
                const folderName = note.folderId ? folderNames.get(note.folderId) : null;

                return (
                  <li key={note.id}>
                    <button
                      type="button"
                      className="exam-notes-picker-item"
                      onClick={() => chooseNote(note.id)}
                      disabled={isWorking || isLinkedElsewhere}
                    >
                      <span className="exam-notes-picker-title">{note.title}</span>
                      <span className="exam-notes-picker-meta">
                        {isLinkedElsewhere
                          ? "Allerede koblet til en annen oppgave"
                          : folderName ?? "Uten mappe"}
                      </span>
                    </button>
                  </li>
                );
              })}
              {filteredPickerNotes.length === 0 && <li className="exam-notes-picker-empty">Ingen notater passer til søket.</li>}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};
