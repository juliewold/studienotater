import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import { subjects } from "../data/subjects";
import { supabase } from "../lib/supabase";
import {
  createExam,
  deleteExam,
  getExamsBySubject,
  updateExam,
  type DatabaseExam,
} from "../services/exams/examsService";

export const useAdminExams = () => {
  const examFileInputRef = useRef<HTMLInputElement>(null);
  const solutionFileInputRef = useRef<HTMLInputElement>(null);
  const mySolutionFileInputRef = useRef<HTMLInputElement>(null);

  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [relevantTasks, setRelevantTasks] = useState("");

  const [examFile, setExamFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [mySolutionFile, setMySolutionFile] = useState<File | null>(null);

  const [editingExam, setEditingExam] = useState<DatabaseExam | null>(null);

  const [uploadedExams, setUploadedExams] = useState<DatabaseExam[]>([]);

  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingExamId, setDeletingExamId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetFileInputs = () => {
    if (examFileInputRef.current) {
      examFileInputRef.current.value = "";
    }

    if (solutionFileInputRef.current) {
      solutionFileInputRef.current.value = "";
    }

    if (mySolutionFileInputRef.current) {
      mySolutionFileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setSubjectId("");
    setTitle("");
    setSemester("");
    setYear("");
    setRelevantTasks("");
    setExamFile(null);
    setSolutionFile(null);
    setMySolutionFile(null);
    setEditingExam(null);
    resetFileInputs();
  };

  const loadUploadedExams = useCallback(async () => {
    setIsLoadingExams(true);
    setErrorMessage("");

    try {
      const examsBySubject = await Promise.all(
        subjects.map((subject) => getExamsBySubject(subject.id)),
      );

      const allUploadedExams = examsBySubject
        .flat()
        .sort((firstExam, secondExam) => {
          if (firstExam.year !== secondExam.year) {
            return secondExam.year - firstExam.year;
          }

          return firstExam.title.localeCompare(secondExam.title, "nb");
        });

      setUploadedExams(allUploadedExams);
    } catch (error) {
      console.error("Kunne ikke hente eksamener:", error);
      setErrorMessage("Kunne ikke hente eksamenene.");
    } finally {
      setIsLoadingExams(false);
    }
  }, []);

  useEffect(() => {
    loadUploadedExams();
  }, [loadUploadedExams]);

  const createSafeFileName = (fileName: string) => {
    return fileName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.-]/g, "");
  };

  const uploadExamFile = async (
    file: File,
    fileType: "oppgavesett" | "losningsforslag" | "min-besvarelse",
  ) => {
    const safeFileName = createSafeFileName(file.name);
    const safeSemester = createSafeFileName(semester);

    const filePath =
      `${subjectId}/eksamener/${year}-${safeSemester}` +
      `/${fileType}-${Date.now()}-${safeFileName}`;

    const { error } = await supabase.storage
      .from("pdfs")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    return filePath;
  };

  const removeFiles = async (filePaths: string[]) => {
    if (filePaths.length === 0) {
      return;
    }

    const { error } = await supabase.storage.from("pdfs").remove(filePaths);

    if (error) {
      throw error;
    }
  };

  const parseRelevantTasks = (value: string): string[] => {
    return value
      .split(",")
      .map((task) => task.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedYear = Number(year);
    const parsedRelevantTasks = parseRelevantTasks(relevantTasks);

    if (!Number.isInteger(parsedYear) || parsedYear < 1900) {
      setErrorMessage("Skriv inn et gyldig årstall.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const newlyUploadedPaths: string[] = [];

    try {
      let examFilePath = editingExam?.examFilePath ?? null;
      let solutionFilePath = editingExam?.solutionFilePath ?? null;
      let mySolutionFilePath = editingExam?.mySolutionFilePath ?? null;

      if (examFile) {
        const uploadedExamPath = await uploadExamFile(examFile, "oppgavesett");

        newlyUploadedPaths.push(uploadedExamPath);
        examFilePath = uploadedExamPath;
      }

      if (solutionFile) {
        const uploadedSolutionPath = await uploadExamFile(
          solutionFile,
          "losningsforslag",
        );

        newlyUploadedPaths.push(uploadedSolutionPath);
        solutionFilePath = uploadedSolutionPath;
      }

      if (mySolutionFile) {
        const uploadedMySolutionPath = await uploadExamFile(
          mySolutionFile,
          "min-besvarelse",
        );

        newlyUploadedPaths.push(uploadedMySolutionPath);
        mySolutionFilePath = uploadedMySolutionPath;
      }

      if (editingExam) {
        await updateExam(
          editingExam.id,
          title.trim(),
          semester,
          parsedYear,
          parsedRelevantTasks,
          examFilePath,
          solutionFilePath,
          mySolutionFilePath,
        );

        const replacedPaths: string[] = [];

        if (
          examFile &&
          editingExam.examFilePath &&
          editingExam.examFilePath !== examFilePath
        ) {
          replacedPaths.push(editingExam.examFilePath);
        }

        if (
          solutionFile &&
          editingExam.solutionFilePath &&
          editingExam.solutionFilePath !== solutionFilePath
        ) {
          replacedPaths.push(editingExam.solutionFilePath);
        }

        if (
          mySolutionFile &&
          editingExam.mySolutionFilePath &&
          editingExam.mySolutionFilePath !== mySolutionFilePath
        ) {
          replacedPaths.push(editingExam.mySolutionFilePath);
        }

        await removeFiles(replacedPaths);

        resetForm();
        await loadUploadedExams();
        setSuccessMessage("Eksamenen ble oppdatert.");
        return;
      }

      await createExam(
        subjectId,
        title.trim(),
        semester,
        parsedYear,
        parsedRelevantTasks,
        examFilePath,
        solutionFilePath,
        mySolutionFilePath,
      );

      resetForm();
      await loadUploadedExams();
      setSuccessMessage("Eksamenen ble opprettet.");
    } catch (error) {
      if (newlyUploadedPaths.length > 0) {
        await supabase.storage.from("pdfs").remove(newlyUploadedPaths);
      }

      console.error(
        editingExam
          ? "Kunne ikke oppdatere eksamen:"
          : "Kunne ikke opprette eksamen:",
        error,
      );

      setErrorMessage(
        editingExam
          ? "Kunne ikke oppdatere eksamenen."
          : "Kunne ikke opprette eksamenen.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (exam: DatabaseExam) => {
    setEditingExam(exam);
    setSubjectId(exam.subjectId);
    setTitle(exam.title);
    setSemester(exam.semester);
    setYear(String(exam.year));
    setRelevantTasks(exam.relevantTasks.join(", "));
    setExamFile(null);
    setSolutionFile(null);
    setMySolutionFile(null);
    resetFileInputs();

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

  const handleDelete = async (exam: DatabaseExam) => {
    const shouldDelete = window.confirm(
      `Er du sikker på at du vil slette «${exam.title}»?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingExamId(exam.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const filePaths = [
        exam.examFilePath,
        exam.solutionFilePath,
        exam.mySolutionFilePath,
      ].filter((filePath): filePath is string => Boolean(filePath));

      await deleteExam(exam.id);
      await removeFiles(filePaths);

      setUploadedExams((currentExams) =>
        currentExams.filter((currentExam) => currentExam.id !== exam.id),
      );

      if (editingExam?.id === exam.id) {
        resetForm();
      }

      setSuccessMessage("Eksamenen ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette eksamen:", error);
      setErrorMessage("Kunne ikke slette eksamenen.");
    } finally {
      setDeletingExamId(null);
    }
  };

  const getFileUrl = (filePath: string | null) => {
    if (!filePath) {
      return null;
    }

    const { data } = supabase.storage.from("pdfs").getPublicUrl(filePath);

    return data.publicUrl;
  };

  return {
    examFileInputRef,
    solutionFileInputRef,
    mySolutionFileInputRef,

    subjectId,
    setSubjectId,

    title,
    setTitle,

    semester,
    setSemester,

    year,
    setYear,

    relevantTasks,
    setRelevantTasks,

    setExamFile,
    setSolutionFile,
    setMySolutionFile,

    editingExam,

    uploadedExams,
    isLoadingExams,
    isSaving,
    deletingExamId,

    errorMessage,
    successMessage,

    getFileUrl,
    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  };
};
