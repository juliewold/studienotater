import "./PdfsPage.css";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { pdfs } from "../../data/pdfs";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../services/favoritesService";
import {
  getAllProgress,
  type ProgressItem,
} from "../../services/progressService";
import type { FavoriteItem } from "../../utils/favorites";

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
  const { user } = useContext(AuthContext);

  const subjectPdfs = pdfs[subjectId as keyof typeof pdfs] || [];

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);

  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setIsLoadingFavorites(false);
        return;
      }

      try {
        const loadedFavorites = await getFavorites(user.id);
        setFavorites(loadedFavorites);
      } catch (error) {
        console.error("Kunne ikke hente favoritter:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, [user]);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setProgressItems([]);
        setIsLoadingProgress(false);
        return;
      }

      try {
        const loadedProgress = await getAllProgress(user.id);
        setProgressItems(loadedProgress);
      } catch (error) {
        console.error("Kunne ikke hente fremdrift:", error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user]);

  const handleFavoriteClick = async (item: FavoriteItem) => {
    if (!user) {
      return;
    }

    const favoriteAlreadyExists = favorites.some(
      (favorite) =>
        favorite.id === item.id && favorite.type === item.type,
    );

    try {
      if (favoriteAlreadyExists) {
        await removeFavorite(user.id, item.id, item.type);

        setFavorites((currentFavorites) =>
          currentFavorites.filter(
            (favorite) =>
              !(
                favorite.id === item.id &&
                favorite.type === item.type
              ),
          ),
        );

        return;
      }

      await addFavorite(user.id, item);

      setFavorites((currentFavorites) => [
        item,
        ...currentFavorites,
      ]);
    } catch (error) {
      console.error("Kunne ikke oppdatere favoritt:", error);
    }
  };

  const pdfIsFavorite = (favoriteId: string) => {
    return favorites.some(
      (favorite) =>
        favorite.id === favoriteId && favorite.type === "pdf",
    );
  };

  const getPdfProgress = (pdfId: string) => {
    const resourceId = `pdf-${subjectId}-${pdfId}`;

    return (
      progressItems.find(
        (progress) =>
          progress.itemId === resourceId &&
          progress.itemType === "resource",
      ) ?? {
        completed: false,
        rating: 0,
      }
    );
  };

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">PDF-er</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {isLoadingProgress && <p>Laster fremdrift...</p>}

      {categories.map((category) => {
        const categoryPdfs = subjectPdfs.filter(
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
                const { completed, rating } = getPdfProgress(pdf.id);

                const favoriteId = `${subjectId}-${pdf.id}`;
                const favorite = pdfIsFavorite(favoriteId);

                return (
                  <article
                    className="pdf-card-wrapper"
                    key={pdf.id}
                  >
                    <Link
                      to={`/fag/${subjectId}/pdfs/${pdf.id}`}
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
                        handleFavoriteClick({
                          id: favoriteId,
                          title: pdf.title,
                          subject: subjectId?.toUpperCase(),
                          type: "pdf",
                          url: `/fag/${subjectId}/pdfs/${pdf.id}`,
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