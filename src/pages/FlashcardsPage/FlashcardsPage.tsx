import "./FlashcardsPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { flashcards } from "../../data/flashcards";
import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../services/flashcardsService";

type LocalFlashcard = {
  id: string;
  question: string;
  answer: string;
};

type FlashcardListItem = {
  id: string;
  question: string;
  answer: string;
  source: "local" | "database";
};

export const FlashcardsPage = () => {
  const { subjectId } = useParams();

  const [databaseFlashcards, setDatabaseFlashcards] = useState<
    DatabaseFlashcard[]
  >([]);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [flippedCardId, setFlippedCardId] = useState<string | null>(
    null,
  );

  const localFlashcards: LocalFlashcard[] =
    flashcards[subjectId as keyof typeof flashcards] || [];

  useEffect(() => {
    const loadFlashcards = async () => {
      if (!subjectId) {
        setDatabaseFlashcards([]);
        setIsLoadingFlashcards(false);
        return;
      }

      setIsLoadingFlashcards(true);
      setErrorMessage("");

      try {
        const loadedFlashcards =
          await getFlashcardsBySubject(subjectId);

        setDatabaseFlashcards(loadedFlashcards);
      } catch (error) {
        console.error("Kunne ikke hente flashcards:", error);
        setErrorMessage("Kunne ikke hente nye flashcards.");
      } finally {
        setIsLoadingFlashcards(false);
      }
    };

    loadFlashcards();
  }, [subjectId]);

  const allFlashcards: FlashcardListItem[] = [
    ...localFlashcards.map((card) => ({
      id: card.id,
      question: card.question,
      answer: card.answer,
      source: "local" as const,
    })),
    ...databaseFlashcards.map((card) => ({
      id: card.slug,
      question: card.question,
      answer: card.answer,
      source: "database" as const,
    })),
  ];

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Flashcards</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {isLoadingFlashcards && <p>Laster flashcards...</p>}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingFlashcards && (
        <div className="flashcards-grid">
          {allFlashcards.map((card) => {
            const cardKey = `${card.source}-${card.id}`;
            const isFlipped = flippedCardId === cardKey;

            return (
              <button
                key={cardKey}
                type="button"
                className="flashcard"
                onClick={() =>
                  setFlippedCardId(
                    isFlipped ? null : cardKey,
                  )
                }
              >
                <p className="flashcard-label">
                  {isFlipped ? "Svar" : "Spørsmål"}
                </p>

                <h3>
                  {isFlipped ? card.answer : card.question}
                </h3>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
};