import "./ExamsPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getExamsBySubject,
  type DatabaseExam,
} from "../../services/examsService";
import { ExamProgressOverview } from "../../components/ExamProgressOverview/ExamProgressOverview";

export const ExamsPage = () => {
  const { subjectId } = useParams();

  const [exams, setExams] = useState<DatabaseExam[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadExams = async () => {
      if (!subjectId) {
        setExams([]);
        setIsLoadingExams(false);
        return;
      }

      setIsLoadingExams(true);
      setErrorMessage("");

      try {
        const loadedExams = await getExamsBySubject(subjectId);
        setExams(loadedExams);
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

      {!isLoadingExams && !errorMessage && exams.length === 0 && (
        <p>Ingen eksamener er lagt til ennå.</p>
      )}

      {!isLoadingExams && !errorMessage && exams.length > 0 && (
        <>
          <ExamProgressOverview exams={exams} />

          <div className="exam-list">
            {exams.map((exam) => (
              <section key={exam.id} className="exam-section">
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

                {exam.mySolutionFilePath && (
                  <Link
                    to={`/fag/${subjectId}/eksamen/database/${exam.id}/my-solution`}
                    className="exam-row"
                  >
                    <span>Min besvarelse</span>
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
        </>
      )}
    </main>
  );
};
