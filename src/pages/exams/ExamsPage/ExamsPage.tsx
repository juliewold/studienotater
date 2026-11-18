import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import "./ExamsPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getExamsBySubject,
  type DatabaseExam,
} from "../../../services/exams/examsService";
import { getProgressForExams } from "../../../services/exams/examTaskProgressService";
import { ExamProgressOverview } from "../../../components/exams/ExamProgressOverview/ExamProgressOverview";
import { summarizeExamProgress } from "../../../components/exams/examProgress";

export const ExamsPage = () => {
  const { subjectId } = useParams();

  const [exams, setExams] = useState<DatabaseExam[]>([]);
  const [completedByExam, setCompletedByExam] = useState<Record<string, Set<string>>>({});
  const [progressError, setProgressError] = useState(false);
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

  // Fremdriften vises på hvert kort. Den hentes med samme avkrysningsdata som eksamensvisningen.
  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      if (exams.length === 0) return;

      try {
        const progress = await getProgressForExams(exams.map((exam) => exam.id));

        if (cancelled) return;

        const result: Record<string, Set<string>> = {};

        for (const exam of exams) {
          result[exam.id] = new Set(
            (progress[exam.id] ?? []).filter((task) => task.completed).map((task) => task.taskLabel),
          );
        }

        setCompletedByExam(result);
        setProgressError(false);
      } catch (error) {
        if (cancelled) return;
        console.error("Kunne ikke hente eksamensfremdrift:", error);
        setProgressError(true);
      }
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [exams]);

  const examsWithProgress = useMemo(
    () =>
      exams.map((exam) => ({
        exam,
        progress: summarizeExamProgress(exam.relevantTasks, completedByExam[exam.id] ?? new Set<string>()),
      })),
    [exams, completedByExam],
  );

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Eksamen</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {isLoadingExams && <LoadingPlaceholder label="Laster eksamener..." />}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingExams && !errorMessage && exams.length === 0 && (
        <p>Ingen eksamener er lagt til ennå.</p>
      )}

      {!isLoadingExams && !errorMessage && exams.length > 0 && (
        <>
          <ExamProgressOverview exams={exams} />

          <div className="exam-list">
            {examsWithProgress.map(({ exam, progress }) => (
              <section key={exam.id} className="exam-section exam-overview-card">
                <h2>{exam.title}</h2>

                <p className="exam-meta">
                  {exam.semester} {exam.year}
                </p>

                <div className="exam-card-progress">
                  {progressError ? (
                    <p className="exam-card-progress-error">Fremdriften kunne ikke hentes.</p>
                  ) : (
                    <>
                      <div className="exam-card-progress-text">
                        <span>Oppgaver fullført</span>
                        <strong>
                          {progress.completed} / {progress.total} ({progress.percent} %)
                        </strong>
                      </div>

                      <div className="exam-card-progress-bar" aria-hidden="true">
                        <div
                          className="exam-card-progress-fill"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>

                <Link
                  to={`/fag/${subjectId}/eksamen/database/${exam.id}`}
                  className="exam-card-open"
                >
                  Åpne eksamen
                  <span aria-hidden="true">→</span>
                </Link>
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
};
