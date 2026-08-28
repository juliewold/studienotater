import "./PdfViewerPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getPdfById,
  type DatabasePdf,
} from "../../../services/pdfsService";
import { ResourceProgress } from "../../../components/progress/ResourceProgress/ResourceProgress";

export const PdfViewerPage = () => {
  const { subjectId, pdfId } = useParams();

  const [pdf, setPdf] = useState<DatabasePdf | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfId) {
        setPdf(null);
        setIsLoadingPdf(false);
        return;
      }

      setIsLoadingPdf(true);
      setErrorMessage("");

      try {
        const loadedPdf = await getPdfById(pdfId);

        if (!loadedPdf) {
          setErrorMessage("Fant ikke PDF-en.");
          return;
        }

        if (loadedPdf.subjectId !== subjectId) {
          setErrorMessage("PDF-en tilhører ikke dette faget.");
          return;
        }

        setPdf(loadedPdf);
      } catch (error) {
        console.error("Kunne ikke hente PDF:", error);
        setErrorMessage("Kunne ikke hente PDF-en.");
      } finally {
        setIsLoadingPdf(false);
      }
    };

    loadPdf();
  }, [pdfId, subjectId]);

  if (isLoadingPdf) {
    return (
      <main className="page-container">
        <p>Laster PDF...</p>
      </main>
    );
  }

  if (!pdf || errorMessage) {
    return (
      <main className="page-container">
        <Link
          to={`/fag/${subjectId}/pdfs`}
          className="back-link"
        >
          ← Tilbake til PDF-er
        </Link>

        <h1>Fant ikke PDF-en</h1>

        {errorMessage && <p>{errorMessage}</p>}
      </main>
    );
  }

  const resourceId =
    `pdf-${subjectId}-database-${pdf.id}`;

  return (
    <main className="page-container">
      <Link
        to={`/fag/${subjectId}/pdfs`}
        className="back-link"
      >
        ← Tilbake til PDF-er
      </Link>

      <p className="page-label">PDF</p>

      <h1>{pdf.title}</h1>

      <ResourceProgress resourceId={resourceId} />

      <iframe
        className="pdf-viewer"
        src={pdf.fileUrl}
        title={pdf.title}
      />
    </main>
  );
};