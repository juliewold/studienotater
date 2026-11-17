-- Requires 20261013_note_folder_admin.sql (can_manage_note_folders()).
-- Stable link between an exam sub-task (for example "1a") and its written solution note.
-- Adds one table only. Existing exams, notes, folders, note content and task progress
-- are not changed, moved or deleted. Deleting an exam or a note removes only its link row.
-- Assumes exams.id and notes.id are uuid. Check the deployed schema first; the transaction
-- rolls back if the types differ.
BEGIN;

CREATE TABLE IF NOT EXISTS public.exam_task_notes (
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  task_label text NOT NULL CHECK (char_length(btrim(task_label)) BETWEEN 1 AND 20),
  -- One note answers one sub-task. UNIQUE keeps a note from being linked twice.
  note_id uuid NOT NULL UNIQUE REFERENCES public.notes(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (exam_id, task_label)
);

-- The note must belong to the same subject as the exam. Enforced for every writer.
CREATE OR REPLACE FUNCTION public.validate_exam_task_note()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE exam_subject text; note_subject text;
BEGIN
  SELECT e.subject_id::text INTO exam_subject FROM public.exams e WHERE e.id = NEW.exam_id;
  SELECT n.subject_id::text INTO note_subject FROM public.notes n WHERE n.id = NEW.note_id;
  IF exam_subject IS NULL THEN
    RAISE EXCEPTION 'Exam does not exist' USING ERRCODE = '23503';
  END IF;
  IF note_subject IS NULL THEN
    RAISE EXCEPTION 'Note does not exist' USING ERRCODE = '23503';
  END IF;
  IF exam_subject <> note_subject THEN
    RAISE EXCEPTION 'Note belongs to another subject than the exam' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.validate_exam_task_note() FROM PUBLIC;
DROP TRIGGER IF EXISTS validate_exam_task_note ON public.exam_task_notes;
CREATE TRIGGER validate_exam_task_note BEFORE INSERT OR UPDATE OF exam_id, note_id ON public.exam_task_notes
FOR EACH ROW EXECUTE FUNCTION public.validate_exam_task_note();

ALTER TABLE public.exam_task_notes ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.exam_task_notes TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.exam_task_notes TO authenticated;

-- Every signed-in user can read the links (shared academic structure).
DROP POLICY IF EXISTS exam_task_notes_read ON public.exam_task_notes;
CREATE POLICY exam_task_notes_read ON public.exam_task_notes
  FOR SELECT TO authenticated USING (true);

-- Only admins write links, the same rule as notes and note folders.
DROP POLICY IF EXISTS exam_task_notes_admin_insert_guard ON public.exam_task_notes;
CREATE POLICY exam_task_notes_admin_insert_guard ON public.exam_task_notes AS RESTRICTIVE
  FOR INSERT TO anon, authenticated WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS exam_task_notes_admin_update_guard ON public.exam_task_notes;
CREATE POLICY exam_task_notes_admin_update_guard ON public.exam_task_notes AS RESTRICTIVE
  FOR UPDATE TO anon, authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS exam_task_notes_admin_delete_guard ON public.exam_task_notes;
CREATE POLICY exam_task_notes_admin_delete_guard ON public.exam_task_notes AS RESTRICTIVE
  FOR DELETE TO anon, authenticated USING (public.can_manage_note_folders());

DROP POLICY IF EXISTS exam_task_notes_admin_insert ON public.exam_task_notes;
CREATE POLICY exam_task_notes_admin_insert ON public.exam_task_notes
  FOR INSERT TO authenticated WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS exam_task_notes_admin_update ON public.exam_task_notes;
CREATE POLICY exam_task_notes_admin_update ON public.exam_task_notes
  FOR UPDATE TO authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS exam_task_notes_admin_delete ON public.exam_task_notes;
CREATE POLICY exam_task_notes_admin_delete ON public.exam_task_notes
  FOR DELETE TO authenticated USING (public.can_manage_note_folders());

COMMIT;
