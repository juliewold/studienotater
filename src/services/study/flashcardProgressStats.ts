import type { FlashcardProgress } from "./flashcardProgressService";
import type { DatabaseFlashcard } from "./flashcardsService";

export type FlashcardLevelCounts = {
  total: number;
  red: number;
  yellow: number;
  green: number;
  unrated: number;
};

/**
 * What the learner wants to practise. «needs practice» is every card that is not rated green:
 * not rated yet, rated red («kan dårlig») or rated yellow («usikker»).
 */
export type FlashcardStatusFilter = "all" | "needsPractice" | "unrated" | "red" | "yellow" | "green";

export const flashcardStatusFilterLabels: Record<FlashcardStatusFilter, string> = {
  all: "Alle",
  needsPractice: "Trenger øving",
  unrated: "Ikke vurdert",
  red: "Kan dårlig",
  yellow: "Usikker",
  green: "Kan godt",
};

export const flashcardStatusFilterOrder: FlashcardStatusFilter[] = [
  "all",
  "needsPractice",
  "unrated",
  "red",
  "yellow",
  "green",
];

export function filterFlashcardsByStatus(
  flashcards: DatabaseFlashcard[],
  progress: Map<string, FlashcardProgress>,
  filter: FlashcardStatusFilter,
): DatabaseFlashcard[] {
  if (filter === "all") return flashcards;

  return flashcards.filter((flashcard) => {
    const level = progress.get(flashcard.id)?.level;

    if (filter === "unrated") return !level;
    if (filter === "needsPractice") return level !== "green";

    return level === filter;
  });
}

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
