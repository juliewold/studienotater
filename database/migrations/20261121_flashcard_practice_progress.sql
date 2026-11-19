-- Manual deployment only: apply in the Supabase SQL editor before the frontend that uses it.
-- Adds multiple-choice fields to flashcards and a per-user progress table with one-step undo.
-- Existing cards and data are not changed or deleted.
-- Registers flashcard_progress in account_deletion_targets(), so account deletion covers it.
BEGIN;

ALTER TABLE public.flashcards
  ADD COLUMN IF NOT EXISTS multiple_choice boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS distractors text[];

ALTER TABLE public.flashcards
  DROP CONSTRAINT IF EXISTS flashcards_multiple_choice_distractors;
ALTER TABLE public.flashcards
  ADD CONSTRAINT flashcards_multiple_choice_distractors
  CHECK (multiple_choice = false OR (distractors IS NOT NULL AND cardinality(distractors) = 3));

CREATE TABLE IF NOT EXISTS public.flashcard_progress (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id uuid NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  level text NOT NULL CHECK (level IN ('red', 'yellow', 'green')),
  -- The level before the last change. Null when there is nothing to undo.
  previous_level text CHECK (previous_level IS NULL OR previous_level IN ('red', 'yellow', 'green')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, flashcard_id)
);

ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.flashcard_progress FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.flashcard_progress TO authenticated;

DROP POLICY IF EXISTS flashcard_progress_owner ON public.flashcard_progress;
CREATE POLICY flashcard_progress_owner ON public.flashcard_progress
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Manifest: same rows as 20261118_practice_history.sql plus flashcard_progress.
CREATE OR REPLACE FUNCTION public.account_deletion_targets()
RETURNS TABLE(table_name text, owner_column text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 VALUES ('favorites','user_id'), ('progress','user_id'),
        ('book_progress','user_id'), ('book_task_progress','user_id'),
        ('exam_task_progress','user_id'), ('semester_subjects','user_id'),
        ('practice_sessions','user_id'), ('practice_active_sessions','user_id'),
        ('flashcard_progress','user_id'),
        ('profiles','id')
 UNION ALL
 SELECT 'calendar_events','user_id' WHERE EXISTS (
   SELECT 1 FROM pg_catalog.pg_attribute
   WHERE attrelid = pg_catalog.to_regclass('public.calendar_events')
     AND attname = 'user_id' AND NOT attisdropped
 );
$$;
REVOKE ALL ON FUNCTION public.account_deletion_targets() FROM PUBLIC, anon, authenticated;

COMMIT;
