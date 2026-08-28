import "./AllFlashcardsPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { subjects } from "../../../data/subjects";
import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../../services/study/flashcardsService";

type FlashcardSubject = {
  id: string;
  code: string;
  name: string;
  count: number;
};

export const AllFlashcardsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [flashcards, setFlashcards] = useState<DatabaseFlashcard[]>([]);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadFlashcards = async () => {
      setIsLoadingFlashcards(true);
      setErrorMessage("");

      try {
        const flashcardsBySubject = await Promise.all(
          subjects.map((subject) =>
            getFlashcardsBySubject(subject.id),
          ),
        );

        setFlashcards(flashcardsBySubject.flat());
      } catch (error) {
        console.error("Kunne ikke hente flashcards:", error);
        setErrorMessage("Kunne ikke hente flashcards.");
      } finally {
        setIsLoadingFlashcards(false);
      }
    };

    loadFlashcards();
  }, []);

  const flashcardSubjects = useMemo<FlashcardSubject[]>(() => {
    const normalizedSearchTerm = searchTerm
      .trim()
      .toLowerCase();

    return subjects
      .map((subject) => ({
        id: subject.id,
        code: subject.code,
        name: subject.name,
        count: flashcards.filter(
          (flashcard) => flashcard.subjectId === subject.id,
        ).length,
      }))
      .filter((subject) => subject.count > 0)
      .filter((subject) =>
        `${subject.code} ${subject.name}`
          .toLowerCase()
          .includes(normalizedSearchTerm),
      );
  }, [flashcards, searchTerm]);

  return (
    <main className="page-container">
      <p className="page-label">Flashcards</p>

      <h1>Flashcards</h1>

      <p>Velg et fag for å starte repetisjon.</p>

      <input
        className="notes-search"
        type="search"
        placeholder="Søk etter fag..."
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
      />

      {isLoadingFlashcards && <p>Laster flashcards...</p>}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingFlashcards &&
        !errorMessage &&
        flashcardSubjects.length === 0 && (
          <p>Fant ingen fag med flashcards.</p>
        )}

      {!isLoadingFlashcards && !errorMessage && (
        <div className="all-flashcards-grid">
          {flashcardSubjects.map((subject) => (
            <div
              key={subject.id}
              className="flashcard-deck-card"
            >
              <p className="subject-code">
                {subject.code}
              </p>

              <h3>{subject.name}</h3>

              <p>{subject.count} flashcards</p>

              <Link
                to={`/fag/${subject.id}/flashcards`}
                className="deck-button"
              >
                Start
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};