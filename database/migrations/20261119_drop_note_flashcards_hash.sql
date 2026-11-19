-- Manual deployment only: apply in the Supabase SQL editor after the frontend that
-- no longer reads this column is deployed.
-- Removes the content hash that tracked AI-generated flashcards per note. Nothing reads it
-- after the generator was removed. Flashcards, flashcards.note_id and notes are not changed.
BEGIN;

ALTER TABLE public.notes
  DROP COLUMN IF EXISTS flashcards_content_hash;

COMMIT;
