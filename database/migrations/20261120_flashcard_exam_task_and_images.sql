-- Manual deployment only: apply in the Supabase SQL editor before the frontend that reads these columns.
-- Adds three nullable columns to flashcards. Existing cards are not changed or deleted.
--   exam_task: the exam sub-task a card helps with, for example "Eksamen aug 2026 · 5a".
--   question_image_path / answer_image_path: path in the note-images bucket (uploaded by admin).
BEGIN;

ALTER TABLE public.flashcards
  ADD COLUMN IF NOT EXISTS exam_task text
    CHECK (exam_task IS NULL OR char_length(btrim(exam_task)) BETWEEN 1 AND 80),
  ADD COLUMN IF NOT EXISTS question_image_path text,
  ADD COLUMN IF NOT EXISTS answer_image_path text;

COMMIT;
