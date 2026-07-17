import "./EditableNote.css";
import { useEffect, useState } from "react";
import { Edit3, Save, X } from "lucide-react";

import { NoteEditor } from "../NoteEditor/NoteEditor";

import {
  updateNote,
  type DatabaseNote,
} from "../../services/notesService";

type EditableNoteProps = {
  note: DatabaseNote;
  subjectCode: string;
  isAdmin: boolean;
  onNoteUpdated: (updatedNote: DatabaseNote) => void;
};

export const EditableNote = ({
  note,
  subjectCode,
  isAdmin,
  onNoteUpdated,
}: EditableNoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(
    note.description,
  );
  const [content, setContent] = useState(note.content);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);
  }, [note]);

  const handleStartEditing = () => {
    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);

    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);

    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setErrorMessage("Notatet må ha en tittel.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedNote = await updateNote(note.id, {
        title: trimmedTitle,
        description: trimmedDescription,
        content,
        contentJson: note.contentJson,
      });

      onNoteUpdated(updatedNote);

      setTitle(updatedNote.title);
      setDescription(updatedNote.description);
      setContent(updatedNote.content);

      setIsEditing(false);
      setSuccessMessage("Notatet ble lagret.");
    } catch (error) {
      console.error("Kunne ikke lagre notatet:", error);
      setErrorMessage("Kunne ikke lagre notatet.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <section className="editable-note editable-note-editing">
        <div className="editable-note-toolbar">
          <span className="editable-note-subject">
            {subjectCode}
          </span>

          <div className="editable-note-actions">
            <button
              type="button"
              className="editable-note-cancel-button"
              onClick={handleCancelEditing}
              disabled={isSaving}
            >
              <X size={18} />
              Avbryt
            </button>

            <button
              type="button"
              className="editable-note-save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={18} />

              {isSaving ? "Lagrer..." : "Lagre"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="editable-note-message editable-note-error">
            {errorMessage}
          </p>
        )}

        <input
          type="text"
          className="editable-note-title-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Tittel"
        />

        <input
          type="text"
          className="editable-note-description-input"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Kort beskrivelse"
        />

        <div className="editable-note-editor">
          <NoteEditor
            value={content}
            onChange={setContent}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="editable-note">
      <div className="editable-note-toolbar">
        <span className="editable-note-subject">
          {subjectCode}
        </span>

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
      </div>

      {successMessage && (
        <p className="editable-note-message editable-note-success">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="editable-note-message editable-note-error">
          {errorMessage}
        </p>
      )}

      <h1 className="editable-note-title">{note.title}</h1>

      {note.description && (
        <p className="editable-note-description">
          {note.description}
        </p>
      )}

      <div
        className="editable-note-content"
        dangerouslySetInnerHTML={{
          __html: note.content,
        }}
      />
    </section>
  );
};