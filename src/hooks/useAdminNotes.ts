import {
  useCallback,
  useEffect,
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

export const useAdminNotes = () => {
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [editingNote, setEditingNote] =
    useState<DatabaseNote | null>(null);

  const [uploadedNotes, setUploadedNotes] = useState<DatabaseNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(
    null,
  );

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
        .sort((firstNote, secondNote) =>
          firstNote.title.localeCompare(secondNote.title, "nb"),
        );

      setUploadedNotes(allUploadedNotes);
    } catch (error) {
      console.error("Kunne ikke hente notater:", error);
      setErrorMessage("Kunne ikke hente notatene.");
    } finally {
      setIsLoadingNotes(false);
    }
  }, []);

  useEffect(() => {
    loadUploadedNotes();
  }, [loadUploadedNotes]);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedContent = content.trim();

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingNote) {
        await updateNote(
          editingNote.id,
          trimmedTitle,
          trimmedDescription,
          trimmedContent,
        );

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

      await createNote(
        subjectId,
        slug,
        trimmedTitle,
        trimmedDescription,
        trimmedContent,
      );

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
        currentNotes.filter(
          (currentNote) => currentNote.id !== note.id,
        ),
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
    setSubjectId,

    title,
    setTitle,

    description,
    setDescription,

    content,
    setContent,

    editingNote,

    uploadedNotes,
    isLoadingNotes,
    isSaving,
    deletingNoteId,

    errorMessage,
    successMessage,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  };
};