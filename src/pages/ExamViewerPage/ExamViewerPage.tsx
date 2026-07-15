import "./ExamViewerPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { exams } from "../../data/exams";
import {
  getExamsBySubject,
  type DatabaseExam,
} from "../../services/examsService";
import { supabase } from "../../lib/supabase";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

export const ExamViewerPage = () => {
  const {
    subjectId,
    source,
    examId,
    fileId,
  } = useParams();

  const isDatabaseExam = source === "database";

  const [databaseExam, setDatabaseExam] =
    useState<DatabaseExam | null>(null);
  const [isLoadingExam, setIsLoadingExam] = useState(
    isDatabaseExam,
  );
  const [errorMessage, setErrorMessage] = useState("");

  const subjectExams =
    exams[subjectId as keyof typeof exams] || [];

  const localExam = subjectExams.find(
    (exam) => exam.id === examId,
  );

  const localExamFile = localExam?.files.find(
    (file) => file.id === fileId,
  );

  useEffect(() => {
    const loadDatabaseExam = async () => {
      if (
        !isDatabaseExam ||
        !subjectId ||
        !examId
      ) {
        setDatabaseExam(null);
        setIsLoadingExam(false);
        return;
      }

      setIsLoadingExam(true);
      setErrorMessage("");

      try {
        const loadedExams =
          await getExamsBySubject(subjectId);

        const selectedExam = loadedExams.find(
          (exam) => exam.id === examId,
        );

        if (!selectedExam) {
          setErrorMessage("Fant ikke eksamenen.");
          return;
        }

        setDatabaseExam(selectedExam);
      } catch (error) {
        console.error("Kunne ikke hente eksamen:", error);
        setErrorMessage("Kunne ikke hente eksamenen.");
      } finally {
        setIsLoadingExam(false);
      }
    };

    loadDatabaseExam();
  }, [examId, isDatabaseExam, subjectId]);

  if (isLoadingExam) {
    return (
      <main className="page-container">
        <p>Laster eksamensfil...</p>
      </main>
    );
  }

  let examTitle = "";
  let fileTitle = "";
  let fileUrl = "";
  let resourceId = "";

  if (isDatabaseExam && databaseExam) {
    const filePath =
      fileId === "solution"
        ? databaseExam.solutionFilePath
        : databaseExam.examFilePath;

    if (filePath) {
      const { data } = supabase.storage
        .from("pdfs")
        .getPublicUrl(filePath);

      fileUrl = data.publicUrl;
    }

    examTitle =
      `${databaseExam.title} – ` +
      `${databaseExam.semester} ${databaseExam.year}`;

    fileTitle =
      fileId === "solution"
        ? "Løsningsforslag"
        : "Oppgavesett";

    resourceId =
      `exam-${subjectId}-database-${databaseExam.id}-${fileId}`;
  } else if (localExam && localExamFile) {
    examTitle = localExam.title;
    fileTitle = localExamFile.title;

    fileUrl =
      `${import.meta.env.BASE_URL}${localExamFile.file}`;

    resourceId =
      `exam-${subjectId}-${localExam.id}-${localExamFile.id}`;
  }

  if (
    errorMessage ||
    !examTitle ||
    !fileTitle ||
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