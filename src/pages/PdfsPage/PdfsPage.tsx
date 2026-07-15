import "./PdfsPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { pdfs } from "../../data/pdfs";
import {
  getPdfsBySubject,
  type DatabasePdf,
} from "../../services/pdfsService";
import { useFavorites } from "../../hooks/useFavorites";
import { useProgress } from "../../hooks/useProgress";

type LocalPdf = {
  id: string;
  title: string;
  file: string;
  category: string;
};

type PdfListItem = {
  id: string;
  title: string;
  category: string;
  source: "local" | "database";
};

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
  {
    id: "eksamener",
    title: "Eksamener",
  },
];

export const PdfsPage = () => {
  const { subjectId } = useParams();

  const [databasePdfs, setDatabasePdfs] = useState<DatabasePdf[]>([]);
  const [isLoadingPdfs, setIsLoadingPdfs] = useState(true);
  const [pdfError, setPdfError] = useState("");

  const localPdfs: LocalPdf[] =
    pdfs[subjectId as keyof typeof pdfs] || [];

  const {
    isFavorite,
    toggleFavorite,
    isLoadingFavorites,
  } = useFavorites();

  const {
    getProgress,
    isLoadingProgress,
  } = useProgress();

  useEffect(() => {
    const loadPdfs = async () => {
      if (!subjectId) {
        setDatabasePdfs([]);
        setIsLoadingPdfs(false);
        return;
      }

      setIsLoadingPdfs(true);
      setPdfError("");

      try {
        const loadedPdfs = await getPdfsBySubject(subjectId);
        setDatabasePdfs(loadedPdfs);
      } catch (error) {
        console.error("Kunne ikke hente PDF-er:", error);
        setPdfError("Kunne ikke hente nye PDF-er.");
      } finally {
        setIsLoadingPdfs(false);
      }
    };

    loadPdfs();
  }, [subjectId]);

  const allPdfs: PdfListItem[] = [
    ...localPdfs.map((pdf) => ({
      id: pdf.id,
      title: pdf.title,
      category: pdf.category,
      source: "local" as const,
    })),
    ...databasePdfs.map((pdf) => ({
      id: pdf.id,
      title: pdf.title,
      category: pdf.category,
      source: "database" as const,
    })),
  ];

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">PDF-er</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {(isLoadingProgress || isLoadingPdfs) && (
        <p>Laster PDF-er...</p>
      )}

      {pdfError && <p>{pdfError}</p>}

      {!isLoadingPdfs &&
        categories.map((category) => {
          const categoryPdfs = allPdfs.filter(
            (pdf) => pdf.category === category.id,
          );

          if (categoryPdfs.length === 0) {
            return null;
          }

          return (
            <section
              key={category.id}
              className="pdf-category-section"
            >
              <h2>{category.title}</h2>

              <div className="pdf-grid">
                {categoryPdfs.map((pdf) => {
                  const sourcePrefix =
                    pdf.source === "database" ? "database" : "local";

                  const resourceId =
                    `pdf-${subjectId}-${sourcePrefix}-${pdf.id}`;

                  const favoriteId =
                    `${subjectId}-${sourcePrefix}-${pdf.id}`;

                  const pdfUrl =
                    `/fag/${subjectId}/pdfs/${pdf.id}` +
                    `?source=${pdf.source}`;

                  const { completed, rating } = getProgress(
                    resourceId,
                    "resource",
                  );

                  const favorite = isFavorite(
                    favoriteId,
                    "pdf",
                  );

                  return (
                    <article
                      className="pdf-card-wrapper"
                      key={`${pdf.source}-${pdf.id}`}
                    >
                      <Link
                        to={pdfUrl}
                        className="pdf-card"
                      >
                        <span className="pdf-icon">📄</span>

                        <div className="pdf-card-content">
                          <h3>{pdf.title}</h3>

                          <div className="pdf-progress-preview">
                            <span>
                              {completed ? "✓ Lest" : "Ikke lest"}
                            </span>

                            <span
                              className={`pdf-rating rating-${rating}`}
                            >
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
                          fill={
                            favorite
                              ? "currentColor"
                              : "transparent"
                          }
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