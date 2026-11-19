import "./FlashcardProgressBar.css";

import type { FlashcardLevelCounts } from "../../../services/study/flashcardProgressStats";

/** Stacked bar in the same pastel colours as the rating buttons. Unrated cards are grey. */
export const FlashcardProgressBar = ({ counts }: { counts: FlashcardLevelCounts }) => {
  if (counts.total === 0) return null;

  const percent = (value: number) => `${(value / counts.total) * 100}%`;

  return (
    <div className="flashcard-progress-bar-stack" aria-hidden="true">
      <span className="flashcard-progress-segment-green" style={{ width: percent(counts.green) }} />
      <span className="flashcard-progress-segment-yellow" style={{ width: percent(counts.yellow) }} />
      <span className="flashcard-progress-segment-red" style={{ width: percent(counts.red) }} />
    </div>
  );
};
