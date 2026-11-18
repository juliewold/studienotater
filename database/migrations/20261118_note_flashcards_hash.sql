-- Remember which note text the flashcards were last generated and saved from.
-- A note with a NULL hash, or a hash that differs from its current content, needs new flashcards.
BEGIN;
ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS flashcards_content_hash text;
COMMIT;
