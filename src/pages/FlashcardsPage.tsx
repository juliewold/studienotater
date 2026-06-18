import { Link, useParams } from "react-router-dom";
import { flashcards } from "../data/flashcards";

export const FlashcardsPage = () => {
  const { subjectId } = useParams();

  const subjectFlashcards =
    flashcards[subjectId as keyof typeof flashcards] || [];

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>
      <p className="page-label">Flashcards</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      <div className="flashcards-grid">
        {subjectFlashcards.map((card) => (
          <div key={card.id} className="flashcard">
            <h3>{card.question}</h3>
            <p>{card.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
};
