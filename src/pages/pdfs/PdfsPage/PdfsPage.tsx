import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import "./PdfsPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { getPdfsBySubject, type DatabasePdf } from "../../../services/media/pdfsService";
import { lectureNumberLabel, lectureSequence, type CurriculumUnit } from "../../../services/subjects/curriculumContent";
import { loadCurriculumWorkspace } from "../../../services/subjects/curriculumWorkspaceService";
import { useFavorites } from "../../../hooks/useFavorites";
import { useProgress } from "../../../hooks/useProgress";

const categories = [
  {
    id: "forelesninger",
    title: "Forelesningsnotater",
  },
  {
    id: "presentasjoner",
    title: "Presentasjonsnotater",
  },
  {
    id: "pensum",
    title: "Pensum",
  },
  {
    id: "formler",
    title: "Formelark",
  },
];

export const PdfsPage = () => {
  const { subjectId } = useParams();

  const [pdfs, setPdfs] = useState<DatabasePdf[]>([]);
  const [isLoadingPdfs, setIsLoadingPdfs] = useState(true);
  const [pdfError, setPdfError] = useState("");
  // Lecture PDFs by id, with their pensum unit and place in the lecture order.
  const [lectures, setLectures] = useState<Map<string, { index: number; unit: CurriculumUnit }>>(new Map());

  const { isFavorite, toggleFavorite, isLoadingFavorites } = useFavorites();

  const { getProgress, isLoadingProgress } = useProgress();

  useEffect(() => {
    const loadPdfs = async () => {
      if (!subjectId) {
        setPdfs([]);
        setIsLoadingPdfs(false);
        return;
      }

      setIsLoadingPdfs(true);
      setPdfError("");

      try {
        const loadedPdfs = await getPdfsBySubject(subjectId);
        setPdfs(loadedPdfs);
      } catch (error) {
        console.error("Kunne ikke hente PDF-er:", error);
        setPdfError("Kunne ikke hente PDF-ene.");
      } finally {
        setIsLoadingPdfs(false);
      }
    };

    loadPdfs();
  }, [subjectId]);

  useEffect(() => {
    if (!subjectId) return;

    let cancelled = false;

    // Titles and order come from the pensum; without it the cards keep their PDF titles.
    loadCurriculumWorkspace(subjectId)
      .then((workspace) => {
        if (cancelled) return;

        setLectures(
          new Map(
            lectureSequence(workspace.units, workspace.pdfs).map(({ pdf, unit }, index) => [pdf.id, { index, unit }]),
          ),
        );
      })
      .catch((error) => {
        console.error("Kunne ikke hente forelesningene:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">PDF-er</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {(isLoadingProgress || isLoadingPdfs) && <LoadingPlaceholder label="Laster PDF-er..." />}

      {pdfError && <p>{pdfError}</p>}

      {!isLoadingPdfs && !pdfError && pdfs.length === 0 && (
        <p>Ingen PDF-er er lagt til ennå.</p>
      )}

      {!isLoadingPdfs &&
        !pdfError &&
        categories.map((category) => {
          // Lectures follow the pensum; PDFs outside it keep their upload order after them.
          const position = (pdf: DatabasePdf) => lectures.get(pdf.id)?.index ?? Number.MAX_SAFE_INTEGER;
          const categoryPdfs = pdfs
            .filter((pdf) => pdf.category === category.id)
            .sort((a, b) => position(a) - position(b));

          if (categoryPdfs.length === 0) {
            return null;
          }

          return (
            <section key={category.id} className="pdf-category-section">
              <h2>{category.title}</h2>

              <div className="pdf-grid">
                {categoryPdfs.map((pdf) => {
                  const resourceId = `pdf-${subjectId}-database-${pdf.id}`;

                  const favoriteId = `${subjectId}-database-${pdf.id}`;

                  const pdfUrl = `/fag/${subjectId}/pdfs/${pdf.id}`;

                  const { completed, rating } = getProgress(
                    resourceId,
                    "resource",
                  );

                  const favorite = isFavorite(favoriteId, "pdf");

                  const lecture = lectures.get(pdf.id);

                  return (
                    <article className="pdf-card-wrapper" key={pdf.id}>
                      <Link to={pdfUrl} className="pdf-card">
                        <span className="pdf-icon">📄</span>

                        <div className="pdf-card-content">
                          {lecture ? (
                            <>
                              <span className="pdf-lecture-number">
                                {lectureNumberLabel(lecture.unit)}
                              </span>

                              <h3>{lecture.unit.title}</h3>

                              <span className="pdf-card-file">{pdf.title}</span>
                            </>
                          ) : (
                            <h3>{pdf.title}</h3>
                          )}

                          <div className="pdf-progress-preview">
                            <span>{completed ? "✓ Lest" : "Ikke lest"}</span>

                            <span className={`pdf-rating rating-${rating}`}>
                              {"★".repeat(rating)}
                            </span>
                          </div>
                        </div>
                      </Link>

                      <button
                        type="button"
                        className={`favorite-button ${
                          favorite ? "is-favorite" : ""
                        }`}
                        aria-label={
                          favorite
                            ? "Fjern fra favoritter"
                            : "Legg til i favoritter"
                        }
                        disabled={isLoadingFavorites}
                        onClick={() =>
                          toggleFavorite({
                            id: favoriteId,
                            title: pdf.title,
                            subject: subjectId?.toUpperCase(),
                            type: "pdf",
                            url: pdfUrl,
                          })
                        }
                      >
                        <Heart
                          size={22}
                          fill={favorite ? "currentColor" : "transparent"}
                          strokeWidth={2}
                        />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
    </main>
  );
};
