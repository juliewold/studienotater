import type { DatabaseFlashcard } from "./flashcardsService";
import type { FlashcardProgress } from "./flashcardProgressService";

const levelWeight = (level: FlashcardProgress["level"] | undefined) => {
  if (level === "red") return 4;
  if (level === "green") return 1;
  return 2; // yellow and cards not rated yet
};

/**
 * Random order where weaker cards tend to come first. A red card is more likely to
 * come early, but a green card can still come before it, so practice does not feel fixed.
 */
export function orderFlashcardsForPractice(
  flashcards: DatabaseFlashcard[],
  progress: Map<string, FlashcardProgress>,
): DatabaseFlashcard[] {
  return flashcards
    .map((flashcard) => ({
      flashcard,
      key: Math.random() ** (1 / levelWeight(progress.get(flashcard.id)?.level)),
    }))
    .sort((first, second) => second.key - first.key)
    .map(({ flashcard }) => flashcard);
}
