import {
  useCallback,
  useEffect,
  useState,
  type SyntheticEvent,
} from "react";
import {
  createUpcomingExam,
  deleteUpcomingExam,
  getUpcomingExams,
  updateUpcomingExam,
  type UpcomingExam,
} from "../services/upcomingExamsService";

export const useAdminUpcomingExams = () => {
  const [subjectId, setSubjectId] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  const [editingExam, setEditingExam] =
    useState<UpcomingExam | null>(null);

  const [upcomingExams, setUpcomingExams] = useState<
    UpcomingExam[]
  >([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingExamId, setDeletingExamId] = useState<
    string | null
  >(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setSubjectId("");
    setExamDate("");
    setStartTime("");
    setLocation("");
    setNote("");
    setEditingExam(null);
  };

  const loadUpcomingExams = useCallback(async () => {
    setIsLoadingExams(true);
    setErrorMessage("");

    try {
      const loadedExams = await getUpcomingExams();
      setUpcomingExams(loadedExams);
    } catch (error) {
      console.error(
        "Kunne ikke hente kommende eksamener:",
        error,
      );
      setErrorMessage("Kunne ikke hente kommende eksamener.");
    } finally {
      setIsLoadingExams(false);
    }
  }, []);

  useEffect(() => {
    loadUpcomingExams();
  }, [loadUpcomingExams]);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const normalizedStartTime = startTime || null;
    const normalizedLocation = location.trim() || null;
    const normalizedNote = note.trim() || null;

    try {
      if (editingExam) {
        await updateUpcomingExam(
          editingExam.id,
          examDate,
          normalizedStartTime,
          normalizedLocation,
          normalizedNote,
        );

        resetForm();
        await loadUpcomingExams();
        setSuccessMessage("Eksamensdatoen ble oppdatert.");
        return;
      }

      await createUpcomingExam(
        subjectId,
        examDate,
        normalizedStartTime,
        normalizedLocation,
        normalizedNote,
      );

      resetForm();
      await loadUpcomingExams();
      setSuccessMessage("Eksamensdatoen ble opprettet.");
    } catch (error) {
      console.error(
        editingExam
          ? "Kunne ikke oppdatere eksamensdato:"
          : "Kunne ikke opprette eksamensdato:",
        error,
      );

      setErrorMessage(
        editingExam
          ? "Kunne ikke oppdatere eksamensdatoen."
          : "Kunne ikke opprette eksamensdatoen.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (exam: UpcomingExam) => {
    setEditingExam(exam);
    setSubjectId(exam.subjectId);
    setExamDate(exam.examDate);
    setStartTime(exam.startTime?.slice(0, 5) ?? "");
    setLocation(exam.location ?? "");
    setNote(exam.note ?? "");

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

  const handleDelete = async (exam: UpcomingExam) => {
    const shouldDelete = window.confirm(
      "Er du sikker på at du vil slette denne eksamensdatoen?",
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingExamId(exam.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteUpcomingExam(exam.id);

      setUpcomingExams((currentExams) =>
        currentExams.filter(
          (currentExam) => currentExam.id !== exam.id,
        ),
      );

      if (editingExam?.id === exam.id) {
        resetForm();
      }

      setSuccessMessage("Eksamensdatoen ble slettet.");
    } catch (error) {
      console.error(
        "Kunne ikke slette eksamensdato:",
        error,
      );
      setErrorMessage("Kunne ikke slette eksamensdatoen.");
    } finally {
      setDeletingExamId(null);
    }
  };

  return {
    subjectId,
    setSubjectId,

    examDate,
    setExamDate,

    startTime,
    setStartTime,

    location,
    setLocation,

    note,
    setNote,

    editingExam,

    upcomingExams,
    isLoadingExams,
    isSaving,
    deletingExamId,

    errorMessage,
    successMessage,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  };
};