import "./ExamOverviewPage.css";
import { useEffect, useMemo, useState } from "react";
import { subjects } from "../../../data/subjects";
import {
  getUpcomingExams,
  type UpcomingExam,
} from "../../../services/upcomingExamsService";

export const ExamOverviewPage = () => {
  const [databaseExams, setDatabaseExams] = useState<UpcomingExam[]>(
    [],
  );
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadExams = async () => {
      setIsLoadingExams(true);
      setErrorMessage("");

      try {
        const loadedExams = await getUpcomingExams();
        setDatabaseExams(loadedExams);
      } catch (error) {
        console.error("Kunne ikke hente eksamensdatoer:", error);
        setErrorMessage("Kunne ikke hente eksamensdatoene.");
      } finally {
        setIsLoadingExams(false);
      }
    };

    loadExams();
  }, []);

  const exams = useMemo(() => {
    return databaseExams
      .map((exam) => {
        const subject = subjects.find(
          (currentSubject) =>
            currentSubject.id === exam.subjectId,
        );

        const examDate = new Date(
          `${exam.examDate}T${exam.startTime ?? "00:00:00"}`,
        );

        const today = new Date();

        const daysLeft = Math.ceil(
          (examDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        return {
          ...exam,
          subject,
          daysLeft,
        };
      })
      .sort((firstExam, secondExam) => {
        return firstExam.daysLeft - secondExam.daysLeft;
      });
  }, [databaseExams]);

  const upcomingExams = exams.filter(
    (exam) => exam.daysLeft >= 0,
  );

  const pastExams = exams.filter(
    (exam) => exam.daysLeft < 0,
  );

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "no-NO",
    );
  };

  const formatTime = (time: string | null) => {
    return time ? time.slice(0, 5) : null;
  };

  return (
    <main className="page-container">
      <p className="page-label">Eksamen</p>

      <h1>Eksamensoversikt</h1>

      <p>Se kommende og tidligere eksamener for fagene dine.</p>

      {isLoadingExams && <p>Laster eksamensdatoer...</p>}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingExams && !errorMessage && (
        <>
          <section className="exam-page-section">
            <h2>Kommende eksamener</h2>

            {upcomingExams.length === 0 ? (
              <p>Ingen kommende eksamener er registrert.</p>
            ) : (
              <div className="exam-page-grid">
                {upcomingExams.map((exam) => (
                  <article
                    key={exam.id}
                    className="exam-page-card"
                  >
                    <p className="exam-page-code">
                      {exam.subject?.code ??
                        exam.subjectId.toUpperCase()}
                    </p>

                    <h3>
                      {exam.subject?.name ?? "Ukjent fag"}
                    </h3>

                    <p>{formatDate(exam.examDate)}</p>

                    {exam.startTime && (
                      <p>Kl. {formatTime(exam.startTime)}</p>
                    )}

                    {exam.note && <p>{exam.note}</p>}

                    <span>
                      {exam.daysLeft === 0
                        ? "I dag"
                        : `${exam.daysLeft} dager igjen`}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </section>

          {pastExams.length > 0 && (
            <section className="exam-page-section">
              <h2>Tidligere eksamener</h2>

              <div className="exam-page-grid">
                {pastExams.map((exam) => (
                  <article
                    key={exam.id}
                    className="exam-page-card"
                  >
                    <p className="exam-page-code">
                      {exam.subject?.code ??
                        exam.subjectId.toUpperCase()}
                    </p>

                    <h3>
                      {exam.subject?.name ?? "Ukjent fag"}
                    </h3>

                    <p>{formatDate(exam.examDate)}</p>

                    {exam.startTime && (
                      <p>Kl. {formatTime(exam.startTime)}</p>
                    )}

                    <span>Gjennomført</span>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
};