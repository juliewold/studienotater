import "./ExamsPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { exams } from "../../data/exams";
import {
  getExamsBySubject,
  type DatabaseExam,
} from "../../services/examsService";

export const ExamsPage = () => {
  const { subjectId } = useParams();

  const [databaseExams, setDatabaseExams] = useState<DatabaseExam[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const localExams =
    exams[subjectId as keyof typeof exams] || [];

  useEffect(() => {
    const loadExams = async () => {
      if (!subjectId) {
        setDatabaseExams([]);
        setIsLoadingExams(false);
        return;
      }

      setIsLoadingExams(true);
      setErrorMessage("");

      try {
        const loadedExams = await getExamsBySubject(subjectId);
        setDatabaseExams(loadedExams);
      } catch (error) {
        console.error("Kunne ikke hente eksamener:", error);
        setErrorMessage("Kunne ikke hente eksamener.");
      } finally {
        setIsLoadingExams(false);
      }
    };

    loadExams();
  }, [subjectId]);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Eksamen</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {isLoadingExams && <p>Laster eksamener...</p>}

      {errorMessage && <p>{errorMessage}</p>}

      <div className="exam-list">
        {/* Lokale eksamener */}
        {localExams.map((exam) => (
          <section key={`local-${exam.id}`} className="exam-section">
            <h2>{exam.title}</h2>

            {exam.files.map((file) => (
              <Link
                key={file.id}
                to={`/fag/${subjectId}/eksamen/${exam.id}/${file.id}`}
                className="exam-row"
              >
                <span>{file.title}</span>
                <span className="exam-arrow">→</span>
              </Link>
            ))}
          </section>
        ))}

        {/* Databaseeksamener */}
        {!isLoadingExams &&
          databaseExams.map((exam) => (
            <section
              key={`database-${exam.id}`}
              className="exam-section"
            >
              <h2>{exam.title}</h2>

              <p className="exam-meta">
                {exam.semester} {exam.year}
              </p>

              {exam.examFilePath && (
                <Link
                  to={`/fag/${subjectId}/eksamen/database/${exam.id}/exam`}
                  className="exam-row"
                >
                  <span>Oppgavesett</span>
                  <span className="exam-arrow">→</span>
                </Link>
              )}

              {exam.solutionFilePath && (
                <Link
                  to={`/fag/${subjectId}/eksamen/database/${exam.id}/solution`}
                  className="exam-row"
                >
                  <span>Løsningsforslag</span>
                  <span className="exam-arrow">→</span>
                </Link>
              )}
            </section>
          ))}
      </div>
    </main>
  );
};