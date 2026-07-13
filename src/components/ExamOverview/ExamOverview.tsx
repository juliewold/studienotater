import "./ExamOverview.css";
import { subjects } from "../../data/subjects";
import { examDates } from "../../data/examDates";
import { useSemesterSubjects } from "../../hooks/useSemesterSubjects";

export const ExamOverview = () => {
  const {
    semesterSubjects,
    isLoadingSemesterSubjects,
  } = useSemesterSubjects();

  const selectedSubjectIds = semesterSubjects.map(
    (subject) => subject.subjectId,
  );

  const upcomingExams = examDates
    .filter((exam) =>
      selectedSubjectIds.includes(exam.subjectId),
    )
    .map((exam) => {
      const subject = subjects.find(
        (subject) => subject.id === exam.subjectId,
      );

      const examDate = new Date(exam.date);
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
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (isLoadingSemesterSubjects) {
    return (
      <section className="exam-overview">
        <p>Laster eksamensoversikt...</p>
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
          <div
            key={exam.subjectId}
            className="exam-card"
          >
            <p className="exam-code">
              {exam.subject?.code}
            </p>

            <h3>{exam.subject?.name}</h3>

            <p>
              {new Date(exam.date).toLocaleDateString(
                "no-NO",
              )}
            </p>

            <span>{exam.daysLeft} dager igjen</span>
          </div>
        ))}
      </div>
    </section>
  );
};