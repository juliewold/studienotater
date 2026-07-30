import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";

import { subjects } from "../data/subjects";

import {
  createNote,
  deleteNote,
  getNotesBySubject,
  updateNote,
  type DatabaseNote,
} from "../services/notesService";

import {
  getTopicsBySubject,
  getSubtopicsByTopic,
  type DatabaseTopic,
  type DatabaseSubtopic,
} from "../services/subjectStructureService";

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

  const loadUploadedNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    setErrorMessage("");

    try {
      const notesBySubject = await Promise.all(
        subjects.map((subject) => getNotesBySubject(subject.id)),
      );

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

      setUploadedNotes(allUploadedNotes);
    } catch (error) {
      console.error("Kunne ikke hente notater:", error);

      setErrorMessage("Kunne ikke hente notatene.");
    } finally {
      setIsLoadingNotes(false);
    }
  }, []);

  const loadTopicStructure = useCallback(async () => {
    setIsLoadingStructure(true);
    setErrorMessage("");

    try {
      const topicsBySubject = await Promise.all(
        subjects.map((subject) => getTopicsBySubject(subject.id)),
      );

      const loadedTopics = topicsBySubject.flat();

      const subtopicsByTopic = await Promise.all(
        loadedTopics.map((topic) => getSubtopicsByTopic(topic.id)),
      );

      setTopics(loadedTopics);
      setSubtopics(subtopicsByTopic.flat());
    } catch (error) {
      console.error("Kunne ikke hente temaer og undertemaer:", error);

      setTopics([]);
      setSubtopics([]);

      setErrorMessage("Kunne ikke hente temaer og undertemaer.");
    } finally {
      setIsLoadingStructure(false);
    }
  }, []);

  useEffect(() => {
    loadUploadedNotes();
    loadTopicStructure();
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
        await loadUploadedNotes();

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
      await loadUploadedNotes();

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
