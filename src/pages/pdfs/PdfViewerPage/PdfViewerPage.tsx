import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import { usePrivateStorageUrl } from "../../../hooks/usePrivateStorageUrl";
import "./PdfViewerPage.css";
import { useContext, useEffect, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  getPdfById,
  updatePdfSummaryNote,
  type DatabasePdf,
} from "../../../services/media/pdfsService";

import { lectureNumberLabel, pdfTitleAddsToTopic } from "../../../services/subjects/curriculumContent";
import { loadLectureSequence, type LectureItem } from "../../../services/subjects/lectureSequenceService";

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

type LectureLink = { id: string; title: string };

/** Where a forelesningsnotat sits in the subject's pensum order. */
type LectureSlot = {
  pdfId: string;
  number: string;
  title?: string;
  previous: LectureLink | null;
  next: LectureLink | null;
};

const lectureLink = (item: LectureItem): LectureLink => ({
  id: item.pdf.id,
  title: item.title ? `${lectureNumberLabel(item.number)}: ${item.title}` : lectureNumberLabel(item.number),
});

const isAppleMobileDevice = () => {
  const userAgent = navigator.userAgent;

  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

export const PdfViewerPage = () => {
  const { subjectId, pdfId } = useParams();

  const { isAdmin } = useContext(AuthContext);

  const [pdf, setPdf] = useState<DatabasePdf | null>(null);
  const fileAccess = usePrivateStorageUrl("pdfs", pdf?.filePath);
  const [summaryNote, setSummaryNote] = useState<DatabaseNote | null>(null);

  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isCreatingSummary, setIsCreatingSummary] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [lectureSlot, setLectureSlot] = useState<LectureSlot | null>(null);

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  const useSeparatePdfView = isAppleMobileDevice();

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

  useEffect(() => {
    if (!subjectId || !pdf || pdf.category !== "forelesninger") return;

    const currentId = pdf.id;
    let cancelled = false;

    // Lecture order comes from the pensum; without it the page still works, just without the lecture heading and navigation.
    loadLectureSequence(subjectId)
      .then((sequence) => {
        if (cancelled) return;

        const index = sequence.findIndex((item) => item.pdf.id === currentId);

        setLectureSlot(
          index < 0
            ? null
            : {
                pdfId: currentId,
                number: sequence[index].number,
                title: sequence[index].title,
                previous: index > 0 ? lectureLink(sequence[index - 1]) : null,
                next: index < sequence.length - 1 ? lectureLink(sequence[index + 1]) : null,
              },
        );
      })
      .catch((error) => {
        console.error("Kunne ikke hente forelesningene:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [subjectId, pdf]);

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
        <LoadingPlaceholder label="Laster PDF..." />
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

  // A slot loaded for another PDF must never show here.
  const lecture = lectureSlot?.pdfId === pdf.id ? lectureSlot : null;

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}/pdfs`} className="back-link">
        ← Tilbake til PDF-er
      </Link>

      {lecture && (lecture.previous || lecture.next) && (
        <nav className="pdf-lecture-navigation" aria-label="Navigasjon mellom forelesninger">
          {lecture.previous && (
            <Link
              to={`/fag/${subjectId}/pdfs/${lecture.previous.id}`}
              className="pdf-lecture-navigation-button"
              title={lecture.previous.title}
            >
              ← Forrige
            </Link>
          )}

          {lecture.next && (
            <Link
              to={`/fag/${subjectId}/pdfs/${lecture.next.id}`}
              className="pdf-lecture-navigation-button pdf-lecture-navigation-next"
              title={lecture.next.title}
            >
              Neste →
            </Link>
          )}
        </nav>
      )}

      {lecture ? (
        <>
          <p className="page-label">{lectureNumberLabel(lecture.number)}</p>

          <h1>{lecture.title ?? pdf.title}</h1>

          {lecture.title && pdfTitleAddsToTopic(pdf.title, lecture.title) && <p className="pdf-lecture-file">{pdf.title}</p>}
        </>
      ) : (
        <>
          <p className="page-label">PDF</p>

          <h1>{pdf.title}</h1>
        </>
      )}

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

      {!fileAccess.url ? (fileAccess.loading ? <LoadingPlaceholder label="Laster filtilgang…" height={480} /> : <p role="status">{fileAccess.error}</p>) : useSeparatePdfView ? (
        <div className="pdf-mobile-viewer">
          <a
            href={fileAccess.url ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="pdf-open-button"
          >
            <ExternalLink size={18} />
            Åpne PDF
          </a>
        </div>
      ) : (
        <object
          className="pdf-viewer"
          data={fileAccess.url!}
          type="application/pdf"
          aria-label={pdf.title}
        >
          <div className="pdf-viewer-fallback">
            <p>PDF-en kan ikke vises direkte i nettleseren.</p>

            <a
              href={fileAccess.url ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="pdf-open-button"
            >
              Åpne PDF
            </a>
          </div>
        </object>
      )}

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
