import "./AllPdfsPage.css";
import { Link } from "react-router-dom";
import { subjects } from "../../data/subjects";

export const AllPdfsPage = () => {
  return (
    <main className="page-container">
      <p className="page-label">PDF-er</p>

      <h1>PDF-er</h1>

      <p>
        Velg et fag for å se forelesningsnotater,
        presentasjoner og annet materiale.
      </p>

      <div className="all-pdfs-grid">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/fag/${subject.id}/pdfs`}
            className="pdf-subject-card"
          >
            <p className="subject-code">
              {subject.code}
            </p>

            <h3>{subject.name}</h3>

            <p>Åpne PDF-er →</p>
          </Link>
        ))}
      </div>
    </main>
  );
};