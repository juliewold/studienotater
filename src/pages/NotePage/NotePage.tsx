import "./NotePage.css";
import {
  useContext,
  useEffect,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import { Edit3, Save, X } from "lucide-react";

import { subjects } from "../../data/subjects";
import {
  getNoteBySlug,
  updateNote,
  type DatabaseNote,
} from "../../services/notesService";

import { AuthContext } from "../../context/AuthContext/AuthContext";
import { NoteEditor } from "../../components/NoteEditor/NoteEditor";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

export const NotePage = () => {
  const { subjectId, noteId } = useParams();

  const { isAdmin } = useContext(AuthContext);

  const [note, setNote] = useState<DatabaseNote | null>(
    null,
  );

  const [isLoadingNote, setIsLoadingNote] =
    useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const subject = subjects.find(
    (currentSubject) =>
      currentSubject.id === subjectId,
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
      setSuccessMessage("");

      try {
        const loadedNote = await getNoteBySlug(
          subjectId,
          noteId,
        );

        if (!loadedNote) {
          setErrorMessage("Fant ikke notatet.");
          setNote(null);
          return;
        }

        setNote(loadedNote);
        setTitle(loadedNote.title);
        setDescription(loadedNote.description);
        setContent(loadedNote.content);
      } catch (error) {
        console.error(
          "Kunne ikke hente notat:",
          error,
        );

        setErrorMessage(
          "Kunne ikke hente notatet.",
        );
      } finally {
        setIsLoadingNote(false);
      }
    };

    loadNote();
  }, [noteId, subjectId]);

  const handleStartEditing = () => {
    if (!note) {
      return;
    }

    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);

    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (!note) {
      return;
    }

    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);

    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!note) {
      return;
    }

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

      setNote(updatedNote);
      setTitle(updatedNote.title);
      setDescription(updatedNote.description);
      setContent(updatedNote.content);

      setIsEditing(false);
      setSuccessMessage("Notatet ble lagret.");
    } catch (error) {
      console.error(
        "Kunne ikke lagre notatet:",
        error,
      );

      setErrorMessage(
        "Kunne ikke lagre notatet.",
      );
    } finally {
      setIsSaving(false);
    }
  };

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

  const backUrl = note.folderId
    ? `/fag/${subject.id}/notater/mappe/${note.folderId}`
    : `/fag/${subject.id}/notater`;

  const resourceId =
    `note-${subject.id}-database-${note.slug}`;

  return (
    <main className="note-page">
      <div className="note-top-bar">
        <Link to={backUrl} className="back-link">
          ← Tilbake
        </Link>

        {isAdmin && !isEditing && (
          <button
            type="button"
            className="note-edit-button"
            onClick={handleStartEditing}
          >
            <Edit3 size={18} />
            Rediger
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="note-error-message">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="note-success-message">
          {successMessage}
        </p>
      )}

      {isEditing ? (
        <section className="note-editor-view">
          <p className="note-label">{subject.code}</p>

          <input
            type="text"
            className="note-title-input"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Tittel"
          />

          <input
            type="text"
            className="note-description-input"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Kort beskrivelse"
          />

          <NoteEditor
            value={content}
            onChange={setContent}
          />

          <div className="note-editor-actions">
            <button
              type="button"
              className="note-cancel-button"
              onClick={handleCancelEditing}
              disabled={isSaving}
            >
              <X size={18} />
              Avbryt
            </button>

            <button
              type="button"
              className="note-save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={18} />

              {isSaving ? "Lagrer..." : "Lagre"}
            </button>
          </div>
        </section>
      ) : (
        <>
          <p className="note-label">{subject.code}</p>

          <h1>{note.title}</h1>

          {note.description && (
            <p className="note-description">
              {note.description}
            </p>
          )}

          <ResourceProgress
            resourceId={resourceId}
          />

          <section
            className="note-content"
            dangerouslySetInnerHTML={{
              __html: note.content,
            }}
          />
        </>
      )}
    </main>
  );
};