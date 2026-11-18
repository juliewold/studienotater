import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";

import { subjects } from "../../data/subjects";

import {
  createNote,
  deleteNote,
  getNotesBySubject,
  updateNote,
  type DatabaseNote,
} from "../../services/notes/notesService";

import {
  getTopicsBySubject,
  getSubtopicsByTopic,
  type DatabaseTopic,
  type DatabaseSubtopic,
} from "../../services/subjects/subjectStructureService";

export const useAdminNotes = () => {
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [subtopicId, setSubtopicId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [topics, setTopics] = useState<DatabaseTopic[]>([]);

  const [subtopics, setSubtopics] = useState<DatabaseSubtopic[]>([]);

  const [editingNote, setEditingNote] = useState<DatabaseNote | null>(null);

  const [uploadedNotes, setUploadedNotes] = useState<DatabaseNote[]>([]);

  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  const [isLoadingStructure, setIsLoadingStructure] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createSlug = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const resetForm = () => {
    setSubjectId("");
    setTopicId("");
    setSubtopicId("");

    setTitle("");
    setDescription("");
    setContent("");

    setEditingNote(null);
  };

  // State is only set inside promise callbacks, so the mount effect can call
  // these loaders safely. Handlers that reload use the refresh variants.
  const loadUploadedNotes = useCallback((isCurrent: () => boolean = () => true) =>
    Promise.all(subjects.map((subject) => getNotesBySubject(subject.id)))
      .then((notesBySubject) => {
        const allUploadedNotes = notesBySubject
          .flat()
          .sort((firstNote, secondNote) => {
            const subjectComparison = firstNote.subjectId.localeCompare(
              secondNote.subjectId,
              "nb",
            );

            if (subjectComparison !== 0) {
              return subjectComparison;
            }

            return firstNote.title.localeCompare(secondNote.title, "nb");
          });

        if (isCurrent()) setUploadedNotes(allUploadedNotes);
      })
      .catch((error: unknown) => {
        console.error("Kunne ikke hente notater:", error);

        if (isCurrent()) setErrorMessage("Kunne ikke hente notatene.");
      })
      .finally(() => {
        if (isCurrent()) setIsLoadingNotes(false);
      }), []);

  const refreshUploadedNotes = useCallback(() => {
    setIsLoadingNotes(true);
    setErrorMessage("");
    return loadUploadedNotes();
  }, [loadUploadedNotes]);

  const loadTopicStructure = useCallback((isCurrent: () => boolean = () => true) =>
    Promise.all(subjects.map((subject) => getTopicsBySubject(subject.id)))
      .then((topicsBySubject) => {
        const loadedTopics = topicsBySubject.flat();

        return Promise.all(loadedTopics.map((topic) => getSubtopicsByTopic(topic.id)))
          .then((subtopicsByTopic) => {
            if (isCurrent()) {
              setTopics(loadedTopics);
              setSubtopics(subtopicsByTopic.flat());
            }
          });
      })
      .catch((error: unknown) => {
        console.error("Kunne ikke hente temaer og undertemaer:", error);

        if (isCurrent()) {
          setTopics([]);
          setSubtopics([]);
          setErrorMessage("Kunne ikke hente temaer og undertemaer.");
        }
      })
      .finally(() => {
        if (isCurrent()) setIsLoadingStructure(false);
      }), []);

  useEffect(() => {
    let isCurrent = true;
    void loadUploadedNotes(() => isCurrent);
    void loadTopicStructure(() => isCurrent);
    return () => {
      isCurrent = false;
    };
  }, [loadTopicStructure, loadUploadedNotes]);

  const availableTopics = useMemo(() => {
    return topics.filter((topic) => topic.subjectId === subjectId);
  }, [subjectId, topics]);

  const availableSubtopics = useMemo(() => {
    return subtopics.filter((subtopic) => subtopic.topicId === topicId);
  }, [subtopics, topicId]);

  const handleSubjectChange = (nextSubjectId: string) => {
    setSubjectId(nextSubjectId);
    setTopicId("");
    setSubtopicId("");
  };

  const handleTopicChange = (nextTopicId: string) => {
    setTopicId(nextTopicId);
    setSubtopicId("");
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedContent = content.trim();

    if (
      !subjectId ||
      !topicId ||
      !subtopicId ||
      !trimmedTitle ||
      !trimmedDescription
    ) {
      setErrorMessage("Fyll ut fag, tema, undertema, tittel og beskrivelse.");

      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingNote) {
        await updateNote(editingNote.id, {
          title: trimmedTitle,
          description: trimmedDescription,
          content: trimmedContent,
          subtopicId,
        });

        resetForm();
        await refreshUploadedNotes();

        setSuccessMessage("Notatet ble oppdatert.");

        return;
      }

      const slug = createSlug(trimmedTitle);

      if (!slug) {
        setErrorMessage("Notatet må ha en gyldig tittel.");

        return;
      }

      await createNote({
        subjectId,
        subtopicId,
        slug,
        title: trimmedTitle,
        description: trimmedDescription,
        content: trimmedContent,
      });

      resetForm();
      await refreshUploadedNotes();

      setSuccessMessage("Notatet ble opprettet.");
    } catch (error) {
      console.error(
        editingNote
          ? "Kunne ikke oppdatere notat:"
          : "Kunne ikke opprette notat:",
        error,
      );

      setErrorMessage(
        editingNote
          ? "Kunne ikke oppdatere notatet."
          : "Kunne ikke opprette notatet. Det kan allerede finnes et notat med samme adresse.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (note: DatabaseNote) => {
    setEditingNote(note);

    setSubjectId(note.subjectId);
    setTopicId(note.topicId ?? "");
    setSubtopicId(note.subtopicId ?? "");

    setTitle(note.title);
    setDescription(note.description);
    setContent(note.content);

    setErrorMessage("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    resetForm();
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleDelete = async (note: DatabaseNote) => {
    const shouldDelete = window.confirm(
      `Er du sikker på at du vil slette «${note.title}»?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingNoteId(note.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteNote(note.id);

      setUploadedNotes((currentNotes) =>
        currentNotes.filter((currentNote) => currentNote.id !== note.id),
      );

      if (editingNote?.id === note.id) {
        resetForm();
      }

      setSuccessMessage("Notatet ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette notat:", error);

      setErrorMessage("Kunne ikke slette notatet.");
    } finally {
      setDeletingNoteId(null);
    }
  };

  return {
    subjectId,
    topicId,
    subtopicId,

    title,
    setTitle,

    description,
    setDescription,

    content,
    setContent,

    topics,
    subtopics,
    availableTopics,
    availableSubtopics,

    editingNote,

    uploadedNotes,

    isLoadingNotes,
    isLoadingStructure,
    isSaving,

    deletingNoteId,

    errorMessage,
    successMessage,

    handleSubjectChange,
    handleTopicChange,
    setSubtopicId,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  };
};
