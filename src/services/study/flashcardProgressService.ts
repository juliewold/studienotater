import { supabase } from "../../lib/supabase";

export type FlashcardLevel = "red" | "yellow" | "green";

/** 'none' means the card had no rating before the last change. */
export type PreviousFlashcardLevel = FlashcardLevel | "none";

export type FlashcardProgress = {
  level: FlashcardLevel;
  /** Set after a change, so the last rating can be undone. Null when there is nothing to undo. */
  previousLevel: PreviousFlashcardLevel | null;
};

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Logg inn for å lagre fremdriften din.");
  }

  return data.user.id;
}

/** Progress for the signed-in user, keyed by flashcard id. */
export async function getFlashcardProgress(): Promise<Map<string, FlashcardProgress>> {
  const { data, error } = await supabase
    .from("flashcard_progress")
    .select("flashcard_id, level, previous_level");

  if (error) {
    throw error;
  }

  return new Map(
    (data ?? []).map((row) => [
      row.flashcard_id as string,
      {
        level: row.level as FlashcardLevel,
        previousLevel: (row.previous_level ?? null) as PreviousFlashcardLevel | null,
      },
    ]),
  );
}

/** Rates a card. The current level is stored as previous_level so the rating can be undone. */
export async function setFlashcardLevel(
  flashcardId: string,
  level: FlashcardLevel,
  currentLevel: FlashcardLevel | null,
): Promise<void> {
  const userId = await requireUserId();

  const { error } = await supabase.from("flashcard_progress").upsert(
    {
      user_id: userId,
      flashcard_id: flashcardId,
      level,
      previous_level: currentLevel ?? "none",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,flashcard_id" },
  );

  if (error) {
    throw error;
  }
}

/** Undoes the last rating. A card that had no rating before is removed from progress. */
/** Removes the choice, so the card is back to not rated. */
export async function clearFlashcardLevel(flashcardId: string): Promise<void> {
  await requireUserId();

  const { error } = await supabase
    .from("flashcard_progress")
    .delete()
    .eq("flashcard_id", flashcardId);

  if (error) {
    throw error;
  }
}
