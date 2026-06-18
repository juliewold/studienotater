import "./PdfsPage.css"
import { Link, useParams } from "react-router-dom";
import { pdfs } from "../../data/pdfs";

export const PdfsPage = () => {
  const { subjectId } = useParams();

  const subjectPdfs =
    pdfs[subjectId as keyof typeof pdfs] || [];

  return (
    <main className="page-container">
      <Link
        to={`/fag/${subjectId}`}
        className="back-link"
      >
        ← Tilbake til faget
      </Link>

      <p className="page-label">PDF-er</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      <div className="pdf-grid">
        {subjectPdfs.map((pdf) => (
          <Link
            key={pdf.id}
            to={`/fag/${subjectId}/pdfs/${pdf.id}`}
            className="pdf-card"
          >
            <h3>{pdf.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
};