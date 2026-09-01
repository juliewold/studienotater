import "./EditableNote.css";
import { useEffect, useRef, useState } from "react";
import { Check, Edit3, LoaderCircle } from "lucide-react";

import { NoteEditor } from "../NoteEditor/NoteEditor";

import {
  updateNote,
  type DatabaseNote,
} from "../../../services/notes/notesService";

import {
  getTopicsBySubject,
  getSubtopicsByTopic,
  type DatabaseTopic,
  type DatabaseSubtopic,
} from "../../../services/subjects/subjectStructureService";

import { ReadOnlyNote } from "../ReadOnlyNote/ReadOnlyNote";

type EditableNoteProps = {
  note: DatabaseNote;
  subjectCode: string;
  isAdmin: boolean;
  onNoteUpdated: (updatedNote: DatabaseNote) => void;
  showClassification?: boolean;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

type NoteDraft = {
  title: string;
  description: string;
  content: string;
  topicId: string;
  subtopicId: string;
};

export const EditableNote = ({
  note,
  subjectCode,
  isAdmin,
  onNoteUpdated,
  showClassification = true,
}: EditableNoteProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [content, setContent] = useState(note.content);

  const [topics, setTopics] = useState<DatabaseTopic[]>([]);
  const [subtopics, setSubtopics] = useState<DatabaseSubtopic[]>([]);

  const [currentTopic, setCurrentTopic] = useState<DatabaseTopic | null>(null);

  const [currentSubtopic, setCurrentSubtopic] =
    useState<DatabaseSubtopic | null>(null);

  const [selectedTopicId, setSelectedTopicId] = useState(note.topicId ?? "");

  const [selectedSubtopicId, setSelectedSubtopicId] = useState(
    note.subtopicId ?? "",
  );

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const lastSavedDraft = useRef<NoteDraft>({
    title: note.title,
    description: note.description,
    content: note.content,
    topicId: note.topicId ?? "",
    subtopicId: note.subtopicId ?? "",
  });

  useEffect(() => {
    if (isEditing) {
      return;
    }

    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);
    setSelectedTopicId(note.topicId ?? "");
    setSelectedSubtopicId(note.subtopicId ?? "");

    lastSavedDraft.current = {
      title: note.title,
      description: note.description,
      content: note.content,
      topicId: note.topicId ?? "",
      subtopicId: note.subtopicId ?? "",
    };
  }, [isEditing, note]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const loadedTopics = await getTopicsBySubject(note.subjectId);

        setTopics(loadedTopics);
      } catch (error) {
        console.error("Kunne ikke hente temaer:", error);
      }
    };

    loadTopics();
  }, [note.subjectId]);

  useEffect(() => {
    const loadSubtopics = async () => {
      if (!selectedTopicId) {
        setSubtopics([]);
        return;
      }

      try {
        const loadedSubtopics = await getSubtopicsByTopic(selectedTopicId);

        setSubtopics(loadedSubtopics);
      } catch (error) {
        console.error("Kunne ikke hente undertemaer:", error);

        setSubtopics([]);
      }
    };

    loadSubtopics();
  }, [selectedTopicId]);

  useEffect(() => {
    const topic = topics.find((topic) => topic.id === note.topicId) ?? null;

    setCurrentTopic(topic);

    if (!topic || !note.subtopicId) {
      setCurrentSubtopic(null);
      return;
    }

    const loadCurrentSubtopic = async () => {
      try {
        const loadedSubtopics = await getSubtopicsByTopic(topic.id);

        const subtopic =
          loadedSubtopics.find((subtopic) => subtopic.id === note.subtopicId) ??
          null;

        setCurrentSubtopic(subtopic);
      } catch {
        setCurrentSubtopic(null);
      }
    };

    void loadCurrentSubtopic();
  }, [topics, note.topicId, note.subtopicId]);

  const getCurrentDraft = (): NoteDraft => ({
    title: title.trim(),
    description: description.trim(),
    content,
    topicId: selectedTopicId,
    subtopicId: selectedSubtopicId,
  });

  const hasUnsavedChanges = (draft: NoteDraft) => {
    const savedDraft = lastSavedDraft.current;

    return (
      draft.title !== savedDraft.title ||
      draft.description !== savedDraft.description ||
      draft.content !== savedDraft.content ||
      draft.topicId !== savedDraft.topicId ||
      draft.subtopicId !== savedDraft.subtopicId
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
        subtopicId: draft.subtopicId || null,
      });

      lastSavedDraft.current = {
        title: updatedNote.title,
        description: updatedNote.description,
        content: updatedNote.content,
        topicId: updatedNote.topicId ?? "",
        subtopicId: updatedNote.subtopicId ?? "",
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
  }, [
    title,
    description,
    content,
    selectedTopicId,
    selectedSubtopicId,
    isEditing,
  ]);

  const handleStartEditing = () => {
    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);
    setSelectedTopicId(note.topicId ?? "");
    setSelectedSubtopicId(note.subtopicId ?? "");

    lastSavedDraft.current = {
      title: note.title,
      description: note.description,
      content: note.content,
      topicId: note.topicId ?? "",
      subtopicId: note.subtopicId ?? "",
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

          {showClassification && (
            <div className="editable-note-classification">
              <label htmlFor="editable-note-topic">Tema</label>

              <select
                id="editable-note-topic"
                value={selectedTopicId}
                onChange={(event) => {
                  setSelectedTopicId(event.target.value);
                  setSelectedSubtopicId("");
                  setErrorMessage("");
                }}
              >
                <option value="">Ingen tema</option>

                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>

              <label htmlFor="editable-note-subtopic">Undertema</label>

              <select
                id="editable-note-subtopic"
                value={selectedSubtopicId}
                onChange={(event) => {
                  setSelectedSubtopicId(event.target.value);
                  setErrorMessage("");
                }}
                disabled={!selectedTopicId}
              >
                <option value="">Ingen undertema</option>

                {subtopics.map((subtopic) => (
                  <option key={subtopic.id} value={subtopic.id}>
                    {subtopic.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
            <Edit3 size={17} />
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

        {showClassification && (note.topicName || note.subtopicName) && (
          <div className="editable-note-classification-display">
            {currentTopic && (
              <span>
                Tema {currentTopic.sortOrder}: {currentTopic.name}
              </span>
            )}

            {currentTopic && currentSubtopic && (
              <span>
                Undertema {currentTopic.sortOrder}.{currentSubtopic.sortOrder}:{" "}
                {currentSubtopic.name}
              </span>
            )}
          </div>
        )}

        {note.description && (
          <p className="editable-note-description">{note.description}</p>
        )}
      </div>

      <ReadOnlyNote content={note.content} />
    </article>
  );
};
