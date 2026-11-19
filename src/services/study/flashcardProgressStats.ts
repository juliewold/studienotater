import type { FlashcardProgress } from "./flashcardProgressService";
import type { DatabaseFlashcard } from "./flashcardsService";

export type FlashcardLevelCounts = {
  total: number;
  red: number;
  yellow: number;
  green: number;
  unrated: number;
};

/** How many cards are rated red, yellow or green, and how many have no rating yet. */
export function countFlashcardLevels(
  flashcards: DatabaseFlashcard[],
  progress: Map<string, FlashcardProgress>,
): FlashcardLevelCounts {
  const counts: FlashcardLevelCounts = { total: flashcards.length, red: 0, yellow: 0, green: 0, unrated: 0 };

  flashcards.forEach((flashcard) => {
    const level = progress.get(flashcard.id)?.level;

    if (level) {
      counts[level] += 1;
    } else {
      counts.unrated += 1;
    }
  });

  return counts;
}
