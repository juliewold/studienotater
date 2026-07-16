import "./ExamViewerPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getExamsBySubject,
  type DatabaseExam,
} from "../../services/examsService";
import { supabase } from "../../lib/supabase";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

export const ExamViewerPage = () => {
  const {
    subjectId,
    examId,
    fileId,
  } = useParams();

  const [exam, setExam] = useState<DatabaseExam | null>(null);
  const [isLoadingExam, setIsLoadingExam] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadExam = async () => {
      if (!subjectId || !examId) {
        setExam(null);
        setIsLoadingExam(false);
        return;
      }

      setIsLoadingExam(true);
      setErrorMessage("");

      try {
        const loadedExams =
          await getExamsBySubject(subjectId);

        const selectedExam = loadedExams.find(
          (currentExam) => currentExam.id === examId,
        );

        if (!selectedExam) {
          setErrorMessage("Fant ikke eksamenen.");
          return;
        }

        setExam(selectedExam);
      } catch (error) {
        console.error("Kunne ikke hente eksamen:", error);
        setErrorMessage("Kunne ikke hente eksamenen.");
      } finally {
        setIsLoadingExam(false);
      }
    };

    loadExam();
  }, [examId, subjectId]);

  if (isLoadingExam) {
    return (
      <main className="page-container">
        <p>Laster eksamensfil...</p>
      </main>
    );
  }

  const isSolution = fileId === "solution";

  const filePath = isSolution
    ? exam?.solutionFilePath
    : exam?.examFilePath;

  const fileTitle = isSolution
    ? "Løsningsforslag"
    : "Oppgavesett";

  let fileUrl = "";

  if (filePath) {
    const { data } = supabase.storage
      .from("pdfs")
      .getPublicUrl(filePath);

    fileUrl = data.publicUrl;
  }

  const examTitle = exam
    ? `${exam.title} – ${exam.semester} ${exam.year}`
    : "";

  const resourceId = exam
    ? `exam-${subjectId}-database-${exam.id}-${fileId}`
    : "";

  if (
    errorMessage ||
    !exam ||
    !filePath ||
    !fileUrl
  ) {
    return (
      <main className="page-container">
        <Link
          to={`/fag/${subjectId}/eksamen`}
          className="back-link"
        >
          ← Tilbake til eksamener
        </Link>

        <h1>Fant ikke eksamensfilen</h1>

        {errorMessage && <p>{errorMessage}</p>}
      </main>
    );
  }

  return (
    <main className="page-container">
      <Link
        to={`/fag/${subjectId}/eksamen`}
        className="back-link"
      >
        ← Tilbake til eksamener
      </Link>

      <p className="page-label">{examTitle}</p>

      <h1>{fileTitle}</h1>

      <ResourceProgress resourceId={resourceId} />

      <iframe
        className="exam-viewer"
        src={fileUrl}
        title={`${examTitle} – ${fileTitle}`}
      />
    </main>
  );
};