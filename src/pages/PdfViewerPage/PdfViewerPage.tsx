import "./PdfViewerPage.css";
import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { pdfs } from "../../data/pdfs";
import {
  getPdfById,
  type DatabasePdf,
} from "../../services/pdfsService";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

type LocalPdf = {
  id: string;
  title: string;
  file: string;
  category: string;
};

export const PdfViewerPage = () => {
  const { subjectId, pdfId } = useParams();
  const [searchParams] = useSearchParams();

  const source = searchParams.get("source") ?? "local";

  const [databasePdf, setDatabasePdf] =
    useState<DatabasePdf | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(
    source === "database",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const subjectPdfs: LocalPdf[] =
    pdfs[subjectId as keyof typeof pdfs] || [];

  const localPdf = subjectPdfs.find(
    (pdf) => pdf.id === pdfId,
  );

  useEffect(() => {
    const loadDatabasePdf = async () => {
      if (source !== "database" || !pdfId) {
        setDatabasePdf(null);
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

        setDatabasePdf(loadedPdf);
      } catch (error) {
        console.error("Kunne ikke hente PDF:", error);
        setErrorMessage("Kunne ikke hente PDF-en.");
      } finally {
        setIsLoadingPdf(false);
      }
    };

    loadDatabasePdf();
  }, [pdfId, source, subjectId]);

  if (isLoadingPdf) {
    return (
      <main className="page-container">
        <p>Laster PDF...</p>
      </main>
    );
  }

  const pdf =
    source === "database" ? databasePdf : localPdf;

  if (!pdf || errorMessage) {
    return (
      <main className="page-container">
        <Link to={`/fag/${subjectId}/pdfs`} className="back-link">
          ← Tilbake til PDF-er
        </Link>

        <h1>Fant ikke PDF-en</h1>

        {errorMessage && <p>{errorMessage}</p>}
      </main>
    );
  }

  const pdfUrl =
    source === "database"
      ? databasePdf?.fileUrl
      : `${import.meta.env.BASE_URL}${localPdf?.file}`;

  const resourceId =
    `pdf-${subjectId}-${source}-${pdf.id}`;

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}/pdfs`} className="back-link">
        ← Tilbake til PDF-er
      </Link>

      <p className="page-label">PDF</p>

      <h1>{pdf.title}</h1>

      <ResourceProgress resourceId={resourceId} />

      <iframe
        className="pdf-viewer"
        src={pdfUrl}
        title={pdf.title}
      />
    </main>
  );
};