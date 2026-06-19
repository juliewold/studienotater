import "./ExamOverviewPage.css";
import { subjects } from "../../data/subjects";
import { examDates } from "../../data/examDates";

export const ExamOverviewPage = () => {
  const exams = examDates
    .map((exam) => {
      const subject = subjects.find((subject) => subject.id === exam.subjectId);

      const examDate = new Date(exam.date);
      const today = new Date();

      const daysLeft = Math.ceil(
        (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        ...exam,
        subject,
        daysLeft,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const upcomingExams = exams.filter((exam) => exam.daysLeft >= 0);
  const pastExams = exams.filter((exam) => exam.daysLeft < 0);

  return (
    <main className="page-container">
      <p className="page-label">Eksamen</p>

      <h1>Eksamensoversikt</h1>

      <p>Se kommende og tidligere eksamener for fagene dine.</p>

      <section className="exam-page-section">
        <h2>Kommende eksamener</h2>

        <div className="exam-page-grid">
          {upcomingExams.map((exam) => (
            <article key={exam.subjectId} className="exam-page-card">
              <p className="exam-page-code">{exam.subject?.code}</p>

              <h3>{exam.subject?.name}</h3>

              <p>{new Date(exam.date).toLocaleDateString("no-NO")}</p>

              <span>{exam.daysLeft} dager igjen</span>
            </article>
          ))}
        </div>
      </section>

      {pastExams.length > 0 && (
        <section className="exam-page-section">
          <h2>Tidligere eksamener</h2>

          <div className="exam-page-grid">
            {pastExams.map((exam) => (
              <article key={exam.subjectId} className="exam-page-card">
                <p className="exam-page-code">{exam.subject?.code}</p>
                <h3>{exam.subject?.name}</h3>
                <p>{new Date(exam.date).toLocaleDateString("no-NO")}</p>
                <span>Gjennomført</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
