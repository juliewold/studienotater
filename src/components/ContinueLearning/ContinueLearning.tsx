import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ContinueLearning.css";
import { subjects } from "../../data/subjects";
import {
  getAllPdfs,
  type DatabasePdf,
} from "../../services/pdfsService";

export const ContinueLearning = () => {
  const [recentPdfs, setRecentPdfs] = useState<
    DatabasePdf[]
  >([]);

  useEffect(() => {
    const loadRecentPdfs = async () => {
      try {
        const pdfs = await getAllPdfs();

        setRecentPdfs(pdfs.slice(0, 4));
      } catch (error) {
        console.error(
          "Kunne ikke hente nylige PDF-er:",
          error,
        );
      }
    };

    loadRecentPdfs();
  }, []);

  if (recentPdfs.length === 0) {
    return null;
  }

  return (
    <section className="continue-learning">
      <h2>Nylig lagt til</h2>

      <div className="recent-grid">
        {recentPdfs.map((pdf) => {
          const subject = subjects.find(
            (subject) => subject.id === pdf.subjectId,
          );

          return (
            <Link
              key={pdf.id}
              to={`/fag/${pdf.subjectId}/pdfs/${pdf.id}`}
              className="recent-card"
            >
              <p className="recent-type">📄 PDF</p>

              <h3>
                {subject?.code} – {pdf.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
};