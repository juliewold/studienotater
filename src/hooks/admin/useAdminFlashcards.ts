import { useCallback, useEffect, useState, type SyntheticEvent } from "react";

import { subjects } from "../../data/subjects";

import { storeNoteImage } from "../../components/notes/NoteEditor/noteImport";
import {
  createFlashcard,
  deleteFlashcard,
  getFlashcardsBySubject,
  updateFlashcard,
  type DatabaseFlashcard,
} from "../../services/study/flashcardsService";

import {
  getSubtopicsByTopic,
  getTopicsBySubject,
} from "../../services/subjects/subjectStructureService";

type TopicOption = Awaited<ReturnType<typeof getTopicsBySubject>>[number];

type SubtopicOption = Awaited<
  ReturnType<typeof getSubtopicsByTopic>
>[number];

export const useAdminFlashcards = () => {
  const [subjectId, setSubjectId] = useState("");

  const [topicId, setTopicId] = useState("");
  const [subtopicId, setSubtopicId] = useState("");

  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [subtopics, setSubtopics] = useState<SubtopicOption[]>([]);

  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [examTask, setExamTask] = useState("");

  // Existing image path on the card, plus a newly chosen file that is uploaded on save.
  const [questionImagePath, setQuestionImagePath] = useState<string | null>(null);
  const [answerImagePath, setAnswerImagePath] = useState<string | null>(null);
  const [questionImageFile, setQuestionImageFile] = useState<File | null>(null);
  const [answerImageFile, setAnswerImageFile] = useState<File | null>(null);

  const [editingFlashcard, setEditingFlashcard] =
    useState<DatabaseFlashcard | null>(null);

  const [uploadedFlashcards, setUploadedFlashcards] = useState<
    DatabaseFlashcard[]
  >([]);

  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [deletingFlashcardId, setDeletingFlashcardId] = useState<string | null>(
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
    setTopicId("");
    setSubtopicId("");

    setTopics([]);
    setSubtopics([]);

    setQuestion("");
    setAnswer("");

    setExamTask("");
    setQuestionImagePath(null);
    setAnswerImagePath(null);
    setQuestionImageFile(null);
    setAnswerImageFile(null);

    setEditingFlashcard(null);
  };

  useEffect(() => {
    const loadTopics = async () => {
      if (!subjectId) {
        setTopics([]);
        setTopicId("");
        return;
      }

      setIsLoadingTopics(true);

      try {
        const loadedTopics = await getTopicsBySubject(subjectId);

        setTopics(loadedTopics);

        setTopicId((currentTopicId) =>
          loadedTopics.some((topic) => topic.id === currentTopicId)
            ? currentTopicId
            : "",
        );
      } catch (error) {
        console.error("Kunne ikke hente temaer:", error);

        setTopics([]);
        setTopicId("");

        setErrorMessage("Kunne ikke hente temaene.");
      } finally {
        setIsLoadingTopics(false);
      }
    };

    loadTopics();
  }, [subjectId]);

  useEffect(() => {
    const loadSubtopics = async () => {
      if (!topicId) {
        setSubtopics([]);
        setSubtopicId("");
        return;
      }

      setIsLoadingSubtopics(true);

      try {
        const loadedSubtopics = await getSubtopicsByTopic(topicId);

        setSubtopics(loadedSubtopics);

        setSubtopicId((currentSubtopicId) =>
          loadedSubtopics.some((subtopic) => subtopic.id === currentSubtopicId)
            ? currentSubtopicId
            : "",
        );
      } catch (error) {
        console.error("Kunne ikke hente undertemaer:", error);

        setSubtopics([]);
        setSubtopicId("");

        setErrorMessage("Kunne ikke hente undertemaene.");
      } finally {
        setIsLoadingSubtopics(false);
      }
    };

    loadSubtopics();
  }, [topicId]);

  // State is only set inside promise callbacks, so the mount effect can call this safely.
  const loadUploadedFlashcards = useCallback((isCurrent: () => boolean = () => true) =>
    Promise.all(subjects.map((subject) => getFlashcardsBySubject(subject.id)))
      .then((flashcardsBySubject) => {
        const allUploadedFlashcards = flashcardsBySubject
          .flat()
          .sort((firstFlashcard, secondFlashcard) =>
            firstFlashcard.question.localeCompare(secondFlashcard.question, "nb"),
          );

        if (isCurrent()) setUploadedFlashcards(allUploadedFlashcards);
      })
      .catch((error: unknown) => {
        console.error("Kunne ikke hente flashcards:", error);

        if (isCurrent()) setErrorMessage("Kunne ikke hente flashcards.");
      })
      .finally(() => {
        if (isCurrent()) setIsLoadingFlashcards(false);
      }), []);

  const refreshUploadedFlashcards = useCallback(() => {
    setIsLoadingFlashcards(true);
    setErrorMessage("");
    return loadUploadedFlashcards();
  }, [loadUploadedFlashcards]);

  useEffect(() => {
    let isCurrent = true;
    void loadUploadedFlashcards(() => isCurrent);
    return () => {
      isCurrent = false;
    };
  }, [loadUploadedFlashcards]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    setErrorMessage("");
    setSuccessMessage("");

    if (!subjectId) {
      setErrorMessage("Du må velge et fag.");
      return;
    }

    if (!topicId) {
      setErrorMessage("Du må velge et tema.");
      return;
    }

    if (!subtopicId) {
      setErrorMessage("Du må velge et undertema.");
      return;
    }

    if (!trimmedQuestion) {
      setErrorMessage("Du må skrive inn et spørsmål.");
      return;
    }

    if (!trimmedAnswer) {
      setErrorMessage("Du må skrive inn et svar.");
      return;
    }

    setIsSaving(true);

    try {
      // Images are uploaded only when a new file was chosen; otherwise the existing path is kept.
      const fields = {
        subtopicId,
        question: trimmedQuestion,
        answer: trimmedAnswer,
        examTask: examTask.trim() || null,
        questionImagePath: questionImageFile
          ? (await storeNoteImage(questionImageFile)).path
          : questionImagePath,
        answerImagePath: answerImageFile
          ? (await storeNoteImage(answerImageFile)).path
          : answerImagePath,
      };

      if (editingFlashcard) {
        await updateFlashcard(editingFlashcard.id, fields);

        resetForm();
        await refreshUploadedFlashcards();

        setSuccessMessage("Flashcardet ble oppdatert.");

        return;
      }

      const slug = createSlug(trimmedQuestion);

      if (!slug) {
        setErrorMessage("Flashcardet må ha et gyldig spørsmål.");

        return;
      }

      await createFlashcard({ subjectId, slug, ...fields });

      resetForm();
      await refreshUploadedFlashcards();

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
    setTopicId(flashcard.topicId);
    setSubtopicId(flashcard.subtopicId);

    setQuestion(flashcard.question);
    setAnswer(flashcard.answer);

    setExamTask(flashcard.examTask ?? "");
    setQuestionImagePath(flashcard.questionImagePath);
    setAnswerImagePath(flashcard.answerImagePath);
    setQuestionImageFile(null);
    setAnswerImageFile(null);

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
          (currentFlashcard) => currentFlashcard.id !== flashcard.id,
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

  // Existing labels, so the same exam task is spelled the same way on every card.
  const examTaskOptions = Array.from(
    new Set(
      uploadedFlashcards
        .map((flashcard) => flashcard.examTask)
        .filter((label): label is string => Boolean(label)),
    ),
  ).sort((first, second) => first.localeCompare(second, "nb"));

  return {
    subjectId,
    setSubjectId,

    topicId,
    setTopicId,

    subtopicId,
    setSubtopicId,

    topics,
    subtopics,

    isLoadingTopics,
    isLoadingSubtopics,

    question,
    setQuestion,

    answer,
    setAnswer,

    examTask,
    setExamTask,
    examTaskOptions,

    questionImagePath,
    answerImagePath,
    setQuestionImagePath,
    setAnswerImagePath,
    questionImageFile,
    setQuestionImageFile,
    answerImageFile,
    setAnswerImageFile,

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
