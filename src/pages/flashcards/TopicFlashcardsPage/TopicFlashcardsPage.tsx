import "../FlashcardsPage/FlashcardsPage.css";
import "../FlashcardsPage/FlashcardFigure.css";
import "./TopicFlashcardsPage.css";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { FlashcardFigure } from "../../../components/flashcards/FlashcardPractice/FlashcardPractice";
import { FlashcardProgressBar } from "../../../components/flashcards/FlashcardProgressBar/FlashcardProgressBar";
import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import { MathText } from "../../../components/common/MathText/MathText";
import {
  getFlashcardProgress,
  type FlashcardProgress,
} from "../../../services/study/flashcardProgressService";
import { countFlashcardLevels } from "../../../services/study/flashcardProgressStats";
import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../../services/study/flashcardsService";
import { getTopicsBySubject } from "../../../services/subjects/subjectStructureService";

/** A flashcard that turns over when you tap it, like in practice. */
const FlashcardTile = ({ flashcard }: { flashcard: DatabaseFlashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = () => setIsFlipped((current) => !current);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip();
    }
  };

  const shownFigure = isFlipped ? flashcard.answerImagePath : flashcard.questionImagePath;

  return (
    <div
      className="flashcard-tile"
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      onClick={flip}
      onKeyDown={handleKeyDown}
    >
      <p className="flashcard-label">{isFlipped ? "Svar" : "Spørsmål"}</p>

      <h2>
        <MathText>{isFlipped ? flashcard.answer : flashcard.question}</MathText>
      </h2>

      {shownFigure && <FlashcardFigure key={shownFigure} path={shownFigure} />}
    </div>
  );
};

export const TopicFlashcardsPage = () => {
  const { subjectId, topicId } = useParams();

  const [topicName, setTopicName] = useState("");
  const [flashcards, setFlashcards] = useState<DatabaseFlashcard[]>([]);
  const [progress, setProgress] = useState<Map<string, FlashcardProgress>>(() => new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const load = async () => {
      if (!subjectId || !topicId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const [topics, subjectCards] = await Promise.all([
          getTopicsBySubject(subjectId),
          getFlashcardsBySubject(subjectId),
        ]);

        if (!isCurrent) return;

        setTopicName(topics.find((topic) => topic.id === topicId)?.name ?? "");
        setFlashcards(subjectCards.filter((flashcard) => flashcard.topicId === topicId));
      } catch (error) {
        console.error("Kunne ikke hente flashcards:", error);

        if (isCurrent) setErrorMessage("Kunne ikke hente flashcards.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    load();

    return () => {
      isCurrent = false;
    };
  }, [subjectId, topicId]);

  useEffect(() => {
    let isCurrent = true;

    getFlashcardProgress()
      .then((loadedProgress) => {
        if (isCurrent) setProgress(loadedProgress);
      })
      .catch((error: unknown) => {
        console.error("Kunne ikke hente fremdriften:", error);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  // Subtopics inside this tema, in alphabetical order.
  const subtopics = useMemo(() => {
    const groups = new Map<string, { id: string; name: string; flashcards: DatabaseFlashcard[] }>();

    flashcards.forEach((flashcard) => {
      const id = flashcard.subtopicId || "without-subtopic";
      const group = groups.get(id) ?? {
        id,
        name: flashcard.subtopicName || "Uten undertema",
        flashcards: [],
      };

      group.flashcards.push(flashcard);
      groups.set(id, group);
    });

    return Array.from(groups.values()).sort((first, second) => first.name.localeCompare(second.name, "nb"));
  }, [flashcards]);

  const counts = countFlashcardLevels(flashcards, progress);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}/flashcards`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Tema</p>

      <h1>{topicName || "Tema"}</h1>

      {isLoading && <LoadingPlaceholder label="Laster flashcards..." />}

      {errorMessage && <p className="flashcards-error">{errorMessage}</p>}

      {!isLoading && !errorMessage && flashcards.length === 0 && <p>Flashcards kommer.</p>}

      {!isLoading && !errorMessage && flashcards.length > 0 && (
        <>
          <section className="flashcard-subject-progress" aria-label="Fremdrift">
            <FlashcardProgressBar counts={counts} />

            <p>
              {counts.green} av {counts.total} kan godt
            </p>
          </section>

          <div className="flashcard-tema-cards">
            {subtopics.map((subtopic) => (
              <section key={subtopic.id} className="flashcard-tema-group">
                <h3>{subtopic.name}</h3>

                <div className="flashcard-tile-grid">
                  {subtopic.flashcards.map((flashcard) => (
                    <FlashcardTile key={flashcard.id} flashcard={flashcard} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
};
