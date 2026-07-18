import "./EditableNote.css";
import { useEffect, useRef, useState } from "react";
import { Check, Edit3, LoaderCircle } from "lucide-react";

import { NoteEditor } from "../NoteEditor/NoteEditor";

import { updateNote, type DatabaseNote } from "../../services/notesService";
import { ReadOnlyNote } from "../ReadOnlyNote/ReadOnlyNote";

type EditableNoteProps = {
  note: DatabaseNote;
  subjectCode: string;
  isAdmin: boolean;
  onNoteUpdated: (updatedNote: DatabaseNote) => void;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

type NoteDraft = {
  title: string;
  description: string;
  content: string;
};

export const EditableNote = ({
  note,
  subjectCode,
  isAdmin,
  onNoteUpdated,
}: EditableNoteProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [content, setContent] = useState(note.content);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const lastSavedDraft = useRef<NoteDraft>({
    title: note.title,
    description: note.description,
    content: note.content,
  });

  useEffect(() => {
    if (isEditing) {
      return;
    }

    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);

    lastSavedDraft.current = {
      title: note.title,
      description: note.description,
      content: note.content,
    };
  }, [isEditing, note]);

  const getCurrentDraft = (): NoteDraft => ({
    title: title.trim(),
    description: description.trim(),
    content,
  });

  const hasUnsavedChanges = (draft: NoteDraft) => {
    const savedDraft = lastSavedDraft.current;

    return (
      draft.title !== savedDraft.title ||
      draft.description !== savedDraft.description ||
      draft.content !== savedDraft.content
    );
  };

  const saveDraft = async (draft: NoteDraft): Promise<boolean> => {
    if (!draft.title) {
      setErrorMessage("Notatet må ha en tittel.");
      setSaveStatus("error");
      return false;
    }

    if (!hasUnsavedChanges(draft)) {
      setSaveStatus("saved");
      return true;
    }

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      const updatedNote = await updateNote(note.id, {
        title: draft.title,
        description: draft.description,
        content: draft.content,
        contentJson: note.contentJson,
      });

      lastSavedDraft.current = {
        title: updatedNote.title,
        description: updatedNote.description,
        content: updatedNote.content,
      };

      onNoteUpdated(updatedNote);
      setSaveStatus("saved");

      return true;
    } catch (error) {
      console.error("Kunne ikke lagre notatet:", error);

      setErrorMessage("Kunne ikke lagre notatet.");
      setSaveStatus("error");

      return false;
    }
  };

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const draft = getCurrentDraft();

    if (!hasUnsavedChanges(draft)) {
      return;
    }

    setSaveStatus("idle");

    const autosaveTimer = window.setTimeout(() => {
      void saveDraft(draft);
    }, 1000);

    return () => {
      window.clearTimeout(autosaveTimer);
    };
  }, [title, description, content, isEditing]);

  const handleStartEditing = () => {
    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);

    lastSavedDraft.current = {
      title: note.title,
      description: note.description,
      content: note.content,
    };

    setErrorMessage("");
    setSaveStatus("saved");
    setIsEditing(true);
  };

  const handleFinishEditing = async () => {
    const draft = getCurrentDraft();
    const wasSaved = await saveDraft(draft);

    if (wasSaved) {
      setIsEditing(false);
    }
  };

  const renderSaveStatus = () => {
    if (saveStatus === "saving") {
      return (
        <span className="editable-note-save-status">
          <LoaderCircle size={15} className="editable-note-save-spinner" />
          Lagrer...
        </span>
      );
    }

    if (saveStatus === "saved") {
      return (
        <span className="editable-note-save-status">
          <Check size={15} />
          Lagret
        </span>
      );
    }

    if (saveStatus === "error") {
      return (
        <span className="editable-note-save-status editable-note-save-status-error">
          Ikke lagret
        </span>
      );
    }

    return (
      <span className="editable-note-save-status">Ulagrede endringer</span>
    );
  };

  if (isEditing) {
    return (
      <article className="editable-note editable-note-editing">
        <header className="editable-note-topbar">
          <span className="editable-note-subject">{subjectCode}</span>

          <div className="editable-note-actions">
            {renderSaveStatus()}

            <button
              type="button"
              className="editable-note-save-button"
              onClick={handleFinishEditing}
              disabled={saveStatus === "saving"}
            >
              <Check size={18} />
              Ferdig
            </button>
          </div>
        </header>

        {errorMessage && (
          <p className="editable-note-message editable-note-error">
            {errorMessage}
          </p>
        )}

        <div className="editable-note-document-header">
          <input
            type="text"
            className="editable-note-title-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Uten tittel"
            autoFocus
          />

          <textarea
            className="editable-note-description-input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Legg til en kort beskrivelse..."
            rows={1}
          />
        </div>

        <div className="editable-note-editor">
          <NoteEditor value={content} onChange={setContent} />
        </div>
      </article>
    );
  }

  return (
    <article className="editable-note">
      <header className="editable-note-topbar">
        <span className="editable-note-subject">{subjectCode}</span>

        {isAdmin && (
          <button
            type="button"
            className="editable-note-edit-button"
            onClick={handleStartEditing}
          >
            <Edit3 size={18} />
            Rediger
          </button>
        )}
      </header>

      {errorMessage && (
        <p className="editable-note-message editable-note-error">
          {errorMessage}
        </p>
      )}

      <div className="editable-note-document-header">
        <h1 className="editable-note-title">{note.title}</h1>

        {note.description && (
          <p className="editable-note-description">{note.description}</p>
        )}
      </div>

      <ReadOnlyNote content={note.content} />
    </article>
  );
};
