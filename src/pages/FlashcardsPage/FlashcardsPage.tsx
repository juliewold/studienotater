import "./FlashcardsPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../services/flashcardsService";

export const FlashcardsPage = () => {
  const { subjectId } = useParams();

  const [flashcards, setFlashcards] = useState<
    DatabaseFlashcard[]
  >([]);
  const [isLoadingFlashcards, setIsLoadingFlashcards] =
    useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [flippedCardId, setFlippedCardId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadFlashcards = async () => {
      if (!subjectId) {
        setFlashcards([]);
        setIsLoadingFlashcards(false);
        return;
      }

      setIsLoadingFlashcards(true);
      setErrorMessage("");

      try {
        const loadedFlashcards =
          await getFlashcardsBySubject(subjectId);

        setFlashcards(loadedFlashcards);
      } catch (error) {
        console.error("Kunne ikke hente flashcards:", error);
        setErrorMessage("Kunne ikke hente flashcards.");
      } finally {
        setIsLoadingFlashcards(false);
      }
    };

    loadFlashcards();
  }, [subjectId]);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Flashcards</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {isLoadingFlashcards && <p>Laster flashcards...</p>}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingFlashcards &&
        !errorMessage &&
        flashcards.length === 0 && (
          <p>Ingen flashcards er lagt til ennå.</p>
        )}

      {!isLoadingFlashcards && !errorMessage && (
        <div className="flashcards-grid">
          {flashcards.map((card) => {
            const isFlipped = flippedCardId === card.id;

            return (
              <button
                key={card.id}
                type="button"
                className="flashcard"
                onClick={() =>
                  setFlippedCardId(
                    isFlipped ? null : card.id,
                  )
                }
              >
                <p className="flashcard-label">
                  {isFlipped ? "Svar" : "Spørsmål"}
                </p>

                <h3>
                  {isFlipped
                    ? card.answer
                    : card.question}
                </h3>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
};