-- Practice history per account (replaces browser-only localStorage for these rows).
-- Manual deployment only: review, then apply in the Supabase SQL editor.
-- Adds two personal tables and registers them in account_deletion_targets() so
-- account deletion and the data export cover them. Without the manifest update,
-- the deletion preflight would reject every account that owns a row here.
BEGIN;

CREATE TABLE IF NOT EXISTS public.practice_sessions (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id text NOT NULL,
  subject_id text NOT NULL,
  started_at timestamptz NOT NULL,
  completed_at timestamptz NOT NULL,
  total_questions integer NOT NULL CHECK (total_questions >= 0),
  correct_answers integer NOT NULL CHECK (correct_answers >= 0),
  answers jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(answers) = 'array'),
  PRIMARY KEY (user_id, id)
);

CREATE TABLE IF NOT EXISTS public.practice_active_sessions (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id text NOT NULL,
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, subject_id)
);

ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_active_sessions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.practice_sessions FROM anon;
REVOKE ALL ON public.practice_active_sessions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_active_sessions TO authenticated;

CREATE POLICY practice_sessions_owner ON public.practice_sessions
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY practice_active_sessions_owner ON public.practice_active_sessions
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Manifest: same rows as 20261101_account_deletion.sql plus the two practice tables.
CREATE OR REPLACE FUNCTION public.account_deletion_targets()
RETURNS TABLE(table_name text, owner_column text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 VALUES ('favorites','user_id'), ('progress','user_id'),
        ('book_progress','user_id'), ('book_task_progress','user_id'),
        ('exam_task_progress','user_id'), ('semester_subjects','user_id'),
        ('practice_sessions','user_id'), ('practice_active_sessions','user_id'),
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
