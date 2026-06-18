import { Link } from "react-router-dom";
import "./ContinueLearning.css";
import { pdfs } from "../../data/pdfs";
import { subjects } from "../../data/subjects";

export const ContinueLearning = () => {
  const recentPdfs = Object.entries(pdfs)
    .flatMap(([subjectId, subjectPdfs]) => {
      const subject = subjects.find((subject) => subject.id === subjectId);

      return subjectPdfs.map((pdf) => ({
        ...pdf,
        subjectId,
        subjectCode: subject?.code ?? subjectId.toUpperCase(),
      }));
    })
    .slice(-4)
    .reverse();

  return (
    <section className="continue-learning">
      <h2>Nylig lagt til</h2>

      <div className="recent-grid">
        {recentPdfs.map((pdf) => (
          <Link
            key={`${pdf.subjectId}-${pdf.id}`}
            to={`/fag/${pdf.subjectId}/pdfs/${pdf.id}`}
            className="recent-card"
          >
            <p className="recent-type">📄 PDF</p>
            <h3>
              {pdf.subjectCode} – {pdf.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};