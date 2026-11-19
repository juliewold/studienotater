-- Manual deployment only: apply in the Supabase SQL editor before the frontend that undoes ratings.
-- previous_level 'none' means the card had no rating before the last change, so undo deletes the row.
BEGIN;

ALTER TABLE public.flashcard_progress
  DROP CONSTRAINT IF EXISTS flashcard_progress_previous_level_check;

ALTER TABLE public.flashcard_progress
  ADD CONSTRAINT flashcard_progress_previous_level_check
  CHECK (previous_level IS NULL OR previous_level IN ('red', 'yellow', 'green', 'none'));

COMMIT;
