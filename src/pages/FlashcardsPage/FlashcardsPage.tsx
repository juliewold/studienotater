import "./FlashcardsPage.css"
import { Link, useParams } from "react-router-dom";
import { flashcards } from "../../data/flashcards";
import { useState } from "react";

export const FlashcardsPage = () => {
  const { subjectId } = useParams();

  const subjectFlashcards =
    flashcards[subjectId as keyof typeof flashcards] || [];

  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>
      <p className="page-label">Flashcards</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      <div className="flashcards-grid">
        {subjectFlashcards.map((card) => (
          <button
            key={card.id}
            className="flashcard"
            onClick={() =>
              setFlippedCardId(flippedCardId === card.id ? null : card.id)
            }
          >
            <p className="flashcard-label">
              {flippedCardId === card.id ? "Svar" : "Spørsmål"}
            </p>

            <h3>{flippedCardId === card.id ? card.answer : card.question}</h3>
          </button>
        ))}
      </div>
    </main>
  );
};
