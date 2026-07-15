import {
  useCallback,
  useEffect,
  useState,
  type SyntheticEvent,
} from "react";
import { subjects } from "../data/subjects";
import {
  createFlashcard,
  deleteFlashcard,
  getFlashcardsBySubject,
  updateFlashcard,
  type DatabaseFlashcard,
} from "../services/flashcardsService";

export const useAdminFlashcards = () => {
  const [subjectId, setSubjectId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [editingFlashcard, setEditingFlashcard] =
    useState<DatabaseFlashcard | null>(null);

  const [uploadedFlashcards, setUploadedFlashcards] = useState<
    DatabaseFlashcard[]
  >([]);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingFlashcardId, setDeletingFlashcardId] = useState<
    string | null
  >(null);

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
    setQuestion("");
    setAnswer("");
    setEditingFlashcard(null);
  };

  const loadUploadedFlashcards = useCallback(async () => {
    setIsLoadingFlashcards(true);
    setErrorMessage("");

    try {
      const flashcardsBySubject = await Promise.all(
        subjects.map((subject) =>
          getFlashcardsBySubject(subject.id),
        ),
      );

      const allUploadedFlashcards = flashcardsBySubject
        .flat()
        .sort((firstFlashcard, secondFlashcard) =>
          firstFlashcard.question.localeCompare(
            secondFlashcard.question,
            "nb",
          ),
        );

      setUploadedFlashcards(allUploadedFlashcards);
    } catch (error) {
      console.error("Kunne ikke hente flashcards:", error);
      setErrorMessage("Kunne ikke hente flashcards.");
    } finally {
      setIsLoadingFlashcards(false);
    }
  }, []);

  useEffect(() => {
    loadUploadedFlashcards();
  }, [loadUploadedFlashcards]);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingFlashcard) {
        await updateFlashcard(
          editingFlashcard.id,
          trimmedQuestion,
          trimmedAnswer,
        );

        resetForm();
        await loadUploadedFlashcards();
        setSuccessMessage("Flashcardet ble oppdatert.");
        return;
      }

      const slug = createSlug(trimmedQuestion);

      if (!slug) {
        setErrorMessage("Flashcardet må ha et gyldig spørsmål.");
        return;
      }

      await createFlashcard(
        subjectId,
        slug,
        trimmedQuestion,
        trimmedAnswer,
      );

      resetForm();
      await loadUploadedFlashcards();
      setSuccessMessage("Flashcardet ble opprettet.");
    } catch (error) {
      console.error(
        editingFlashcard
          ? "Kunne ikke oppdatere flashcard:"
          : "Kunne ikke opprette flashcard:",
        error,
      );

      setErrorMessage(
        editingFlashcard
          ? "Kunne ikke oppdatere flashcardet."
          : "Kunne ikke opprette flashcardet. Det kan allerede finnes et flashcard med samme adresse.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (flashcard: DatabaseFlashcard) => {
    setEditingFlashcard(flashcard);
    setSubjectId(flashcard.subjectId);
    setQuestion(flashcard.question);
    setAnswer(flashcard.answer);

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

  const handleDelete = async (flashcard: DatabaseFlashcard) => {
    const shouldDelete = window.confirm(
      `Er du sikker på at du vil slette «${flashcard.question}»?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingFlashcardId(flashcard.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteFlashcard(flashcard.id);

      setUploadedFlashcards((currentFlashcards) =>
        currentFlashcards.filter(
          (currentFlashcard) =>
            currentFlashcard.id !== flashcard.id,
        ),
      );

      if (editingFlashcard?.id === flashcard.id) {
        resetForm();
      }

      setSuccessMessage("Flashcardet ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette flashcard:", error);
      setErrorMessage("Kunne ikke slette flashcardet.");
    } finally {
      setDeletingFlashcardId(null);
    }
  };

  return {
    subjectId,
    setSubjectId,

    question,
    setQuestion,

    answer,
    setAnswer,

    editingFlashcard,

    uploadedFlashcards,
    isLoadingFlashcards,
    isSaving,
    deletingFlashcardId,

    errorMessage,
    successMessage,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  };
};