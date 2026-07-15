import "./ExamOverview.css";
import { useEffect, useMemo, useState } from "react";
import { subjects } from "../../data/subjects";
import { useSemesterSubjects } from "../../hooks/useSemesterSubjects";
import {
  getUpcomingExams,
  type UpcomingExam,
} from "../../services/upcomingExamsService";

export const ExamOverview = () => {
  const {
    semesterSubjects,
    isLoadingSemesterSubjects,
  } = useSemesterSubjects();

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
        console.error(
          "Kunne ikke hente kommende eksamener:",
          error,
        );
        setErrorMessage("Kunne ikke hente eksamensoversikten.");
      } finally {
        setIsLoadingExams(false);
      }
    };

    loadExams();
  }, []);

  const upcomingExams = useMemo(() => {
    const selectedSubjectIds = semesterSubjects.map(
      (subject) => subject.subjectId,
    );

    return databaseExams
      .filter((exam) =>
        selectedSubjectIds.includes(exam.subjectId),
      )
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
      .filter((exam) => exam.daysLeft >= 0)
      .sort(
        (firstExam, secondExam) =>
          firstExam.daysLeft - secondExam.daysLeft,
      );
  }, [databaseExams, semesterSubjects]);

  if (isLoadingSemesterSubjects || isLoadingExams) {
    return (
      <section className="exam-overview">
        <p>Laster eksamensoversikt...</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="exam-overview">
        <p>{errorMessage}</p>
      </section>
    );
  }

  if (upcomingExams.length === 0) {
    return null;
  }

  return (
    <section className="exam-overview">
      <p className="exam-label">Eksamensoversikt</p>

      <h2>Kommende eksamener</h2>

      <div className="exam-grid">
        {upcomingExams.map((exam) => (
          <div key={exam.id} className="exam-card">
            <p className="exam-code">
              {exam.subject?.code ??
                exam.subjectId.toUpperCase()}
            </p>

            <h3>{exam.subject?.name ?? "Ukjent fag"}</h3>

            <p>
              {new Date(
                `${exam.examDate}T00:00:00`,
              ).toLocaleDateString("no-NO")}
            </p>

            {exam.startTime && (
              <p>Kl. {exam.startTime.slice(0, 5)}</p>
            )}

            <span>
              {exam.daysLeft === 0
                ? "I dag"
                : `${exam.daysLeft} dager igjen`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};