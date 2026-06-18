import "./AllPdfsPage.css";
import { Link } from "react-router-dom";
import { pdfs } from "../../data/pdfs";
import { subjects } from "../../data/subjects";

export const AllPdfsPage = () => {
  const pdfSubjects = Object.entries(pdfs).map(([subjectId, subjectPdfs]) => {
    const subject = subjects.find((subject) => subject.id === subjectId);

    return {
      id: subjectId,
      code: subject?.code ?? subjectId.toUpperCase(),
      name: subject?.name ?? "",
      count: subjectPdfs.length,
    };
  });

  return (
    <main className="page-container">
      <p className="page-label">PDF-er</p>

      <h1>PDF-er</h1>

      <p>Velg et fag for å se forelesningsnotater, presentasjoner og eksamener.</p>

      <div className="all-pdfs-grid">
        {pdfSubjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/fag/${subject.id}/pdfs`}
            className="pdf-subject-card"
          >
            <p className="subject-code">{subject.code}</p>

            <h3>{subject.name}</h3>

            <p>{subject.count} PDF-er</p>
          </Link>
        ))}
      </div>
    </main>
  );
};