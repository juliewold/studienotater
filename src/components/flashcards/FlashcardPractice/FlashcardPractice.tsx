import "./FlashcardPractice.css";

import { useState } from "react";

import { usePrivateStorageUrl } from "../../../hooks/usePrivateStorageUrl";
import {
  setFlashcardLevel,
  undoFlashcardLevel,
  type FlashcardLevel,
  type FlashcardProgress,
} from "../../../services/study/flashcardProgressService";
import type { DatabaseFlashcard } from "../../../services/study/flashcardsService";
import { MathText } from "../../common/MathText/MathText";

const levelLabels: Record<FlashcardLevel, string> = {
  red: "Rød: kan dårlig",
  yellow: "Gul: usikker",
  green: "Grønn: kan godt",
};

const levelOrder: FlashcardLevel[] = ["red", "yellow", "green"];

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

/** Figure on one side of a card. Loaded through the private storage hook, so only signed-in users see it. */
const FlashcardFigure = ({ path }: { path: string }) => {
  const image = usePrivateStorageUrl("note-images", path);

  if (image.url) {
    return <img className="flashcard-figure" src={image.url} alt="" />;
  }

  if (image.error) {
    return <span className="flashcard-hint">Kunne ikke vise figuren.</span>;
  }

  return <span className="flashcard-hint">Laster figur …</span>;
};

type PracticeCardProps = {
  flashcard: DatabaseFlashcard;
  progress: FlashcardProgress | undefined;
  isSaving: boolean;
  onRate: (level: FlashcardLevel) => void;
  onUndo: () => void;
};

/** One card. Its state (revealed, chosen option) resets when the parent gives a new card key. */
const PracticeCard = ({ flashcard, progress, isSaving, onRate, onUndo }: PracticeCardProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [options] = useState(() =>
    flashcard.multipleChoice ? shuffle([flashcard.answer, ...flashcard.distractors]) : [],
  );

  const correctIndex = options.indexOf(flashcard.answer);
  const wasCorrect = selectedIndex !== null && selectedIndex === correctIndex;

  const chooseOption = (index: number) => {
    setSelectedIndex(index);
    setIsRevealed(true);
  };

  return (
    <section className="flashcard-practice-card">
      <p className="flashcard-label">Spørsmål</p>

      <h2>
        <MathText>{flashcard.question}</MathText>
      </h2>

      {flashcard.questionImagePath && <FlashcardFigure path={flashcard.questionImagePath} />}

      {flashcard.multipleChoice ? (
        <div className="flashcard-choices" role="group" aria-label="Svaralternativer">
          {options.map((option, index) => {
            const stateClass = !isRevealed
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
                disabled={isRevealed}
                onClick={() => chooseOption(index)}
              >
                <MathText>{option}</MathText>
              </button>
            );
          })}
        </div>
      ) : (
        !isRevealed && (
          <button type="button" className="flashcard-primary-button" onClick={() => setIsRevealed(true)}>
            Vis svaret
          </button>
        )
      )}

      {isRevealed && (
        <div className="flashcard-answer-panel">
          {flashcard.multipleChoice && selectedIndex !== null && (
            <p className={wasCorrect ? "flashcard-result-correct" : "flashcard-result-wrong"}>
              {wasCorrect ? "Riktig!" : "Feil. Riktig svar er markert."}
            </p>
          )}

          <p className="flashcard-label">Svar</p>

          <div className="flashcard-answer-text">
            <MathText>{flashcard.answer}</MathText>
          </div>

          {flashcard.answerImagePath && <FlashcardFigure path={flashcard.answerImagePath} />}

          <p className="flashcard-hint">
            {progress ? `Din vurdering nå: ${levelLabels[progress.level]}` : "Ikke vurdert ennå"}
          </p>

          <div className="flashcard-rating" role="group" aria-label="Hvor godt kan du dette?">
            {levelOrder.map((level) => (
              <button
                key={level}
                type="button"
                className={`flashcard-rating-button flashcard-rating-${level} ${
                  progress?.level === level ? "flashcard-rating-current" : ""
                }`}
                disabled={isSaving}
                onClick={() => onRate(level)}
              >
                {levelLabels[level]}
              </button>
            ))}
          </div>

          {progress?.previousLevel && (
            <button type="button" className="flashcard-undo-button" disabled={isSaving} onClick={onUndo}>
              Angre siste vurdering
            </button>
          )}
        </div>
      )}
    </section>
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
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentFlashcard = flashcards[currentIndex];
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === flashcards.length - 1;

  const counts = flashcards.reduce(
    (result, flashcard) => {
      const level = progress.get(flashcard.id)?.level;
      if (level) result[level] += 1;
      else result.unrated += 1;
      return result;
    },
    { red: 0, yellow: 0, green: 0, unrated: 0 },
  );

  const rate = async (level: FlashcardLevel) => {
    if (!currentFlashcard) return;

    const currentLevel = progress.get(currentFlashcard.id)?.level ?? null;

    setIsSaving(true);
    setErrorMessage("");

    try {
      await setFlashcardLevel(currentFlashcard.id, level, currentLevel);
      onProgressChange(currentFlashcard.id, {
        level,
        previousLevel: currentLevel ?? "none",
      });
    } catch (error) {
      console.error("Kunne ikke lagre vurderingen:", error);
      setErrorMessage("Kunne ikke lagre vurderingen. Prøv igjen.");
    } finally {
      setIsSaving(false);
    }
  };

  const undo = async () => {
    if (!currentFlashcard) return;

    const entry = progress.get(currentFlashcard.id);
    if (!entry?.previousLevel) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      await undoFlashcardLevel(currentFlashcard.id, entry.previousLevel);
      onProgressChange(
        currentFlashcard.id,
        entry.previousLevel === "none" ? null : { level: entry.previousLevel, previousLevel: null },
      );
    } catch (error) {
      console.error("Kunne ikke angre vurderingen:", error);
      setErrorMessage("Kunne ikke angre vurderingen. Prøv igjen.");
    } finally {
      setIsSaving(false);
    }
  };

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

      <p className="flashcard-level-summary">
        <span className="flashcard-count-red">{counts.red} røde</span> ·{" "}
        <span className="flashcard-count-yellow">{counts.yellow} gule</span> ·{" "}
        <span className="flashcard-count-green">{counts.green} grønne</span> · {counts.unrated} ikke vurdert
      </p>

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
        onRate={rate}
        onUndo={undo}
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
