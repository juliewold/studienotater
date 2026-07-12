import "./ExamsPage.css";
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

      <div className="exam-list">
        {subjectExams.map((exam) => (
          <section key={exam.id} className="exam-section">
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
      </div>
    </main>
  );
};