import "./FlashcardStatusFilter.css";

import {
  filterFlashcardsByStatus,
  flashcardStatusFilterLabels,
  flashcardStatusFilterOrder,
  type FlashcardStatusFilter as StatusFilter,
} from "../../../services/study/flashcardProgressStats";
import type { FlashcardProgress } from "../../../services/study/flashcardProgressService";
import type { DatabaseFlashcard } from "../../../services/study/flashcardsService";

type FlashcardStatusFilterProps = {
  flashcards: DatabaseFlashcard[];
  progress: Map<string, FlashcardProgress>;
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
};

/** Chips that choose which cards to practise. Each chip shows how many cards it would give. */
export const FlashcardStatusFilter = ({ flashcards, progress, value, onChange }: FlashcardStatusFilterProps) => (
  <div className="flashcard-status-filter" role="group" aria-label="Velg hvilke kort du vil øve på">
    {flashcardStatusFilterOrder.map((option) => {
      const count = filterFlashcardsByStatus(flashcards, progress, option).length;

      return (
        <button
          key={option}
          type="button"
          className={`flashcard-status-chip ${value === option ? "flashcard-status-chip-active" : ""}`}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {flashcardStatusFilterLabels[option]} <span className="flashcard-status-count">{count}</span>
        </button>
      );
    })}
  </div>
);
