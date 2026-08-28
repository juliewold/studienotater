import "./ExamViewerPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getExamsBySubject,
  type DatabaseExam,
} from "../../../services/examsService";
import { supabase } from "../../../lib/supabase";
import { ExamTaskTracker } from "../../../components/exams/ExamTaskTracker/ExamTaskTracker";

export const ExamViewerPage = () => {
  const { subjectId, examId, fileId } = useParams();

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
        const loadedExams = await getExamsBySubject(subjectId);

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

  const filePath =
    fileId === "solution"
      ? exam?.solutionFilePath
      : fileId === "my-solution"
        ? exam?.mySolutionFilePath
        : exam?.examFilePath;

  const fileTitle =
    fileId === "solution"
      ? "Løsningsforslag"
      : fileId === "my-solution"
        ? "Min besvarelse"
        : "Oppgavesett";

  let fileUrl = "";

  if (filePath) {
    const { data } = supabase.storage.from("pdfs").getPublicUrl(filePath);

    fileUrl = data.publicUrl;
  }

  const examTitle = exam ? `${exam.title} – ${exam.semester} ${exam.year}` : "";

  if (errorMessage || !exam || !filePath || !fileUrl) {
    return (
      <main className="page-container">
        <Link to={`/fag/${subjectId}/eksamen`} className="back-link">
          ← Tilbake til eksamener
        </Link>

        <h1>Fant ikke eksamensfilen</h1>

        {errorMessage && <p>{errorMessage}</p>}
      </main>
    );
  }

  return (
    <main className="page-container exam-viewer-page">
      <header className="exam-compact-header">
        <Link to={`/fag/${subjectId}/eksamen`} className="exam-compact-back">
          ← Tilbake
        </Link>

        <div className="exam-compact-title">
          <span>{examTitle}</span>
          <span className="exam-compact-separator">·</span>
          <strong>{fileTitle}</strong>
        </div>
      </header>

      <div className="exam-workspace">
        <aside className="exam-workspace-sidebar">
          <ExamTaskTracker examId={exam.id} tasks={exam.relevantTasks} />
        </aside>

        <div className="exam-workspace-pdf">
          <iframe
            className="exam-viewer"
            src={`${fileUrl}#view=FitH`}
            title={`${examTitle} – ${fileTitle}`}
          />

          <a
            className="exam-mobile-pdf-link"
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
          >
            Åpne PDF i fullskjerm
          </a>
        </div>
      </div>
    </main>
  );
};
