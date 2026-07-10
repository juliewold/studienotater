import "./PdfsPage.css";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Heart } from "lucide-react";
import { pdfs } from "../../data/pdfs";
import {
  getFavorites,
  toggleFavorite,
  type FavoriteItem,
} from "../../utils/favorites";

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

  const subjectPdfs = pdfs[subjectId as keyof typeof pdfs] || [];

  const [favorites, setFavorites] = useState(getFavorites);

  const handleFavoriteClick = (item: FavoriteItem) => {
    toggleFavorite(item);
    setFavorites(getFavorites());
  };

  const pdfIsFavorite = (pdfId: string) => {
    return favorites.some(
      (favorite) => favorite.id === pdfId && favorite.type === "pdf",
    );
  };

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">PDF-er</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {categories.map((category) => {
        const categoryPdfs = subjectPdfs.filter(
          (pdf) => pdf.category === category.id,
        );

        if (categoryPdfs.length === 0) {
          return null;
        }

        return (
          <section key={category.id} className="pdf-category-section">
            <h2>{category.title}</h2>

            <div className="pdf-grid">
              {categoryPdfs.map((pdf) => {
                const rating =
                  Number(
                    localStorage.getItem(
                      `resource-progress-pdf-${subjectId}-${pdf.id}-rating`,
                    ),
                  ) || 0;

                const completed =
                  localStorage.getItem(
                    `resource-progress-pdf-${subjectId}-${pdf.id}-completed`,
                  ) === "true";

                const favorite = pdfIsFavorite(pdf.id);

                return (
                  <article className="pdf-card-wrapper" key={pdf.id}>
                    <Link
                      to={`/fag/${subjectId}/pdfs/${pdf.id}`}
                      className="pdf-card"
                    >
                      <span className="pdf-icon">📄</span>

                      <div className="pdf-card-content">
                        <h3>{pdf.title}</h3>

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
                      onClick={() =>
                        handleFavoriteClick({
                          id: pdf.id,
                          title: pdf.title,
                          type: "pdf",
                          url: `/fag/${subjectId}/pdfs/${pdf.id}`,
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
