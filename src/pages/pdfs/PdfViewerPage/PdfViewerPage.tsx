import "./PdfViewerPage.css";
import { useContext, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  getPdfById,
  updatePdfSummaryNote,
  type DatabasePdf,
} from "../../../services/media/pdfsService";

import {
  createNote,
  getNoteById,
  type DatabaseNote,
} from "../../../services/notes/notesService";

import { subjects } from "../../../data/subjects";

import { AuthContext } from "../../../context/AuthContext/AuthContext";

import { ResourceProgress } from "../../../components/progress/ResourceProgress/ResourceProgress";
import { EditableNote } from "../../../components/notes/EditableNote/EditableNote";
import { PdfSummaryModal } from "../../../components/media/PdfSummaryModal/PdfSummaryModal";

export const PdfViewerPage = () => {
  const { subjectId, pdfId } = useParams();

  const { isAdmin } = useContext(AuthContext);

  const [pdf, setPdf] = useState<DatabasePdf | null>(null);
  const [summaryNote, setSummaryNote] = useState<DatabaseNote | null>(null);

  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isCreatingSummary, setIsCreatingSummary] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfId) {
        setPdf(null);
        setSummaryNote(null);
        setIsLoadingPdf(false);
        return;
      }

      setIsLoadingPdf(true);
      setErrorMessage("");
      setSummaryNote(null);

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

        if (loadedPdf.summaryNoteId) {
          const loadedSummary = await getNoteById(loadedPdf.summaryNoteId);

          setSummaryNote(loadedSummary);
        }
      } catch (error) {
        console.error("Kunne ikke hente PDF:", error);
        setErrorMessage("Kunne ikke hente PDF-en.");
      } finally {
        setIsLoadingPdf(false);
      }
    };

    loadPdf();
  }, [pdfId, subjectId]);

  const handleCreateSummary = async () => {
    if (!pdf || !subjectId) {
      return;
    }

    setIsCreatingSummary(true);

    try {
      const newSummary = await createNote({
        subjectId,
        folderId: null,
        subtopicId: pdf.subtopicId,
        slug: `pdf-summary-${pdf.id}`,
        title: "Oppsummering",
        description: "",
        content: "",
        contentJson: null,
      });

      await updatePdfSummaryNote(pdf.id, newSummary.id);

      setSummaryNote(newSummary);

      setPdf({
        ...pdf,
        summaryNoteId: newSummary.id,
      });

      setIsSummaryOpen(true);
    } catch (error) {
      console.error("Kunne ikke opprette oppsummering:", error);
    } finally {
      setIsCreatingSummary(false);
    }
  };

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
        <Link to={`/fag/${subjectId}/pdfs`} className="back-link">
          ← Tilbake til PDF-er
        </Link>

        <h1>Fant ikke PDF-en</h1>

        {errorMessage && <p>{errorMessage}</p>}
      </main>
    );
  }

  const resourceId = `pdf-${subjectId}-database-${pdf.id}`;

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}/pdfs`} className="back-link">
        ← Tilbake til PDF-er
      </Link>

      <p className="page-label">PDF</p>

      <h1>{pdf.title}</h1>

      <div className="pdf-learning-panel">
        <ResourceProgress resourceId={resourceId} />

        <div className="pdf-summary-action">
          {summaryNote ? (
            <button
              type="button"
              className="pdf-summary-button"
              onClick={() => setIsSummaryOpen(true)}
            >
              <FileText size={18} />
              Se oppsummering
            </button>
          ) : (
            isAdmin && (
              <button
                type="button"
                className="pdf-summary-button"
                onClick={handleCreateSummary}
                disabled={isCreatingSummary}
              >
                <FileText size={18} />

                {isCreatingSummary
                  ? "Oppretter oppsummering..."
                  : "Legg til oppsummering"}
              </button>
            )
          )}
        </div>
      </div>

      <object
        className="pdf-viewer"
        data={pdf.fileUrl}
        type="application/pdf"
        aria-label={pdf.title}
      >
        <div className="pdf-viewer-fallback">
          <p>PDF-en kan ikke vises direkte i nettleseren.</p>

          <a
            href={pdf.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="pdf-open-button"
          >
            Åpne PDF
          </a>
        </div>
      </object>

      {summaryNote && subject && (
        <PdfSummaryModal
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
        >
          <EditableNote
            note={summaryNote}
            subjectCode={subject.code}
            isAdmin={isAdmin}
            onNoteUpdated={setSummaryNote}
            showClassification={false}
          />
        </PdfSummaryModal>
      )}
    </main>
  );
};
