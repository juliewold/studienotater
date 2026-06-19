import "./PdfViewerPage.css";
import { Link, useParams } from "react-router-dom";
import { pdfs } from "../../data/pdfs";

export const PdfViewerPage = () => {
  const { subjectId, pdfId } = useParams();

  const subjectPdfs = pdfs[subjectId as keyof typeof pdfs] || [];

  const pdf = subjectPdfs.find((pdf) => pdf.id === pdfId);

  if (!pdf) {
    return (
      <main className="page-container">
        <h1>Fant ikke PDF-en</h1>
      </main>
    );
  }

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}/pdfs`} className="back-link">
        ← Tilbake til PDF-er
      </Link>

      <p className="page-label">PDF</p>
      <h1>{pdf.title}</h1>

      <iframe
        className="pdf-viewer"
        src={`${import.meta.env.BASE_URL}${pdf.file}`}
        title={pdf.title}
      />
    </main>
  );
};
