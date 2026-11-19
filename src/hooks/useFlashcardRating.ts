import { useState } from "react";

import {
  clearFlashcardLevel,
  setFlashcardLevel,
  type FlashcardLevel,
  type FlashcardProgress,
} from "../services/study/flashcardProgressService";

/**
 * Saves a rating for one card. Pressing the chosen rating again removes the choice,
 * so the card is not rated. The caller keeps the progress map up to date.
 */
export const useFlashcardRating = (
  progress: Map<string, FlashcardProgress>,
  onProgressChange: (flashcardId: string, next: FlashcardProgress | null) => void,
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const rate = async (flashcardId: string, level: FlashcardLevel) => {
    const currentLevel = progress.get(flashcardId)?.level ?? null;

    setIsSaving(true);
    setErrorMessage("");

    try {
      if (currentLevel === level) {
        await clearFlashcardLevel(flashcardId);

        onProgressChange(flashcardId, null);
      } else {
        await setFlashcardLevel(flashcardId, level, currentLevel);

        onProgressChange(flashcardId, {
          level,
          previousLevel: currentLevel ?? "none",
        });
      }
    } catch (error) {
      console.error("Kunne ikke lagre vurderingen:", error);
      setErrorMessage("Kunne ikke lagre. Prøv igjen.");
    } finally {
      setIsSaving(false);
    }
  };

  return { rate, isSaving, errorMessage };
};
