import "./FlashcardPractice.css";

import { useState, type KeyboardEvent, type MouseEvent } from "react";

import { useFlashcardRating } from "../../../hooks/useFlashcardRating";
import { usePrivateStorageUrl } from "../../../hooks/usePrivateStorageUrl";
import type { FlashcardLevel, FlashcardProgress } from "../../../services/study/flashcardProgressService";
import type { DatabaseFlashcard } from "../../../services/study/flashcardsService";
import { MathText } from "../../common/MathText/MathText";

const levelOrder: FlashcardLevel[] = ["red", "yellow", "green"];

// What each rating means for the learner. Shown inside the buttons.
const levelButtonLabels: Record<FlashcardLevel, string> = {
  red: "Kan dårlig",
  yellow: "Usikker",
  green: "Kan godt",
};

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

/** Figure on one side of a card. Loaded through the private storage hook, so only signed-in users see it. */
export const FlashcardFigure = ({ path }: { path: string }) => {
  const image = usePrivateStorageUrl("note-images", path);

  if (image.url) {
    return <img className="flashcard-figure" src={image.url} alt="" />;
  }

  return null;
};

type PracticeCardProps = {
  flashcard: DatabaseFlashcard;
  progress: FlashcardProgress | undefined;
  isSaving: boolean;
  onRate: (level: FlashcardLevel) => void;
};

/** One card. Its state (side, chosen option) resets because the parent gives each card its own key. */
export const PracticeCard = ({ flashcard, progress, isSaving, onRate }: PracticeCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [options] = useState(() =>
    flashcard.multipleChoice ? shuffle([flashcard.answer, ...flashcard.distractors]) : [],
  );

  const correctIndex = options.indexOf(flashcard.answer);

  const flip = () => setIsFlipped((current) => !current);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip();
    }
  };

  const chooseOption = (event: MouseEvent, index: number) => {
    // Choosing an answer must not also flip the card.
    event.stopPropagation();

    if (selectedIndex === null) {
      setSelectedIndex(index);
    }
  };

  const shownFigure = isFlipped ? flashcard.answerImagePath : flashcard.questionImagePath;

  return (
    <>
      <div
        className={`flashcard-practice-card ${progress ? `flashcard-card-${progress.level}` : ""}`}
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

        {isFlipped && flashcard.explanation && (
          <div className="flashcard-explanation">
            <MathText>{flashcard.explanation}</MathText>
          </div>
        )}

        {!isFlipped && flashcard.multipleChoice && (
          <div className="flashcard-choices" role="group" aria-label="Svaralternativer">
            {options.map((option, index) => {
              const stateClass =
                selectedIndex === null
                  ? ""
                  : index === correctIndex
                    ? "flashcard-choice-correct"
                    : index === selectedIndex
                      ? "flashcard-choice-wrong"
                      : "";

              return (
                <button
                  key={option}
                  type="button"
                  className={`flashcard-choice ${stateClass}`}
                  disabled={selectedIndex !== null}
                  onClick={(event) => chooseOption(event, index)}
                >
                  <MathText>{option}</MathText>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flashcard-rating" role="group" aria-label="Hvor godt kan du dette?">
        {levelOrder.map((level) => (
          <button
            key={level}
            type="button"
            aria-pressed={progress?.level === level}
            className={`flashcard-rating-button flashcard-rating-${level} ${
              progress?.level === level ? "flashcard-rating-current" : ""
            }`}
            disabled={isSaving}
            onClick={() => onRate(level)}
          >
            {levelButtonLabels[level]}
          </button>
        ))}
      </div>
    </>
  );
};

type FlashcardPracticeProps = {
  title: string;
  /** Already in practice order. */
  flashcards: DatabaseFlashcard[];
  progress: Map<string, FlashcardProgress>;
  onProgressChange: (flashcardId: string, next: FlashcardProgress | null) => void;
  onExit: () => void;
};

export const FlashcardPractice = ({
  title,
  flashcards,
  progress,
  onProgressChange,
  onExit,
}: FlashcardPracticeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { rate, isSaving, errorMessage } = useFlashcardRating(progress, onProgressChange);

  const currentFlashcard = flashcards[currentIndex];
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === flashcards.length - 1;

  if (!currentFlashcard) {
    return null;
  }

  return (
    <main className="page-container">
      <button type="button" className="flashcard-end-practice" onClick={onExit}>
        ← Avslutt øving
      </button>

      <div className="flashcard-practice-header">
        <div>
          <p className="page-label">Flashcards</p>

          <h1>{title}</h1>
        </div>

        <span className="flashcard-practice-progress">
          {currentIndex + 1} av {flashcards.length}
        </span>
      </div>

      <div className="flashcard-progress-track">
        <div
          className="flashcard-progress-bar"
          style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
        />
      </div>

      {errorMessage && <p className="flashcards-error">{errorMessage}</p>}

      <PracticeCard
        key={currentFlashcard.id}
        flashcard={currentFlashcard}
        progress={progress.get(currentFlashcard.id)}
        isSaving={isSaving}
        onRate={(level) => rate(currentFlashcard.id, level)}
      />

      <div className="flashcard-practice-navigation">
        <button
          type="button"
          className="flashcard-secondary-button"
          onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
          disabled={isFirstCard}
        >
          ← Forrige
        </button>

        {isLastCard ? (
          <button type="button" className="flashcard-primary-button" onClick={onExit}>
            Fullfør øving
          </button>
        ) : (
          <button
            type="button"
            className="flashcard-primary-button"
            onClick={() => setCurrentIndex((index) => Math.min(index + 1, flashcards.length - 1))}
          >
            Neste →
          </button>
        )}
      </div>
    </main>
  );
};
