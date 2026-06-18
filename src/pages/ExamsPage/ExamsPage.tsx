import "./ExamsPage.css"
import { Link, useParams } from "react-router-dom";
import { exams } from "../../data/exams";

export const ExamsPage = () => {
  const { subjectId } = useParams();

  const subjectExams = exams[subjectId as keyof typeof exams] || [];

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Eksamen</p>
      <h1>{subjectId?.toUpperCase()}</h1>

      <div className="exam-grid">
        {subjectExams.map((exam) => (
          <article key={exam.id} className="exam-card">
            <h3>{exam.title}</h3>
          </article>
        ))}
      </div>
    </main>
  );
};
