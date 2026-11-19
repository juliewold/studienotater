-- Manual deployment only: apply in the Supabase SQL editor before the frontend that shows explanations.
-- Adds an optional worked explanation to flashcards. Existing cards are not changed.
BEGIN;

ALTER TABLE public.flashcards
  ADD COLUMN IF NOT EXISTS explanation text
    CHECK (explanation IS NULL OR char_length(explanation) <= 4000);

COMMIT;
