import "./FavoritesPage.css";
import { Link } from "react-router-dom";
import { getFavorites } from "../../utils/favorites";

export const FavoritesPage = () => {
  const favorites = getFavorites();

  const noteFavorites = favorites.filter((item) => item.type === "note");
  const flashcardFavorites = favorites.filter(
    (item) => item.type === "flashcard",
  );
  const videoFavorites = favorites.filter((item) => item.type === "video");
  const pdfFavorites = favorites.filter((item) => item.type === "pdf");

  const renderSection = (title: string, items: typeof favorites) => (
    <section className="favorites-section">
      <h2>{title}</h2>

      <div className="favorites-grid">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            to={item.url}
            className="favorite-card"
          >
            <h3>{item.title}</h3>

            {item.subject && <p>{item.subject}</p>}
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <main className="favorites-page">
      <p className="favorites-label">Mine studier</p>
      <h1>Favoritter</h1>

      <p className="favorites-description">
        Her finner du alt innholdet du har lagret som favoritt.
      </p>

      {favorites.length === 0 && (
        <div className="favorites-empty-state">
          <h2>Ingen favoritter ennå</h2>

          <p>
            Trykk på hjertet på et notat, en video, et flashcard eller en PDF
            for å legge det til her.
          </p>
        </div>
      )}

      {noteFavorites.length > 0 && renderSection("Notater", noteFavorites)}

      {flashcardFavorites.length > 0 &&
        renderSection("Flashcards", flashcardFavorites)}

      {videoFavorites.length > 0 && renderSection("Videoer", videoFavorites)}

      {pdfFavorites.length > 0 && renderSection("PDF-er", pdfFavorites)}
    </main>
  );
};
