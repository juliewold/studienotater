-- Requires 20261013_note_folder_admin.sql (trusted profile role + role protection).
-- All notes in this application are shared subject notes, not personal notebooks.
BEGIN;

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS notes_admin_insert_guard ON public.notes;
CREATE POLICY notes_admin_insert_guard ON public.notes AS RESTRICTIVE
 FOR INSERT TO anon, authenticated WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS notes_admin_insert ON public.notes;
CREATE POLICY notes_admin_insert ON public.notes
 FOR INSERT TO authenticated WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS notes_admin_update_guard ON public.notes;
CREATE POLICY notes_admin_update_guard ON public.notes AS RESTRICTIVE
 FOR UPDATE TO anon, authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS notes_admin_update ON public.notes;
CREATE POLICY notes_admin_update ON public.notes
 FOR UPDATE TO authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS notes_admin_delete_guard ON public.notes;
CREATE POLICY notes_admin_delete_guard ON public.notes AS RESTRICTIVE
 FOR DELETE TO anon, authenticated USING (public.can_manage_note_folders());
DROP POLICY IF EXISTS notes_admin_delete ON public.notes;
CREATE POLICY notes_admin_delete ON public.notes
 FOR DELETE TO authenticated USING (public.can_manage_note_folders());

ALTER TABLE public.note_subtopics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS note_subtopics_admin_insert_guard ON public.note_subtopics;
CREATE POLICY note_subtopics_admin_insert_guard ON public.note_subtopics AS RESTRICTIVE
 FOR INSERT TO anon, authenticated WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS note_subtopics_admin_insert ON public.note_subtopics;
CREATE POLICY note_subtopics_admin_insert ON public.note_subtopics
 FOR INSERT TO authenticated WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS note_subtopics_admin_update_guard ON public.note_subtopics;
CREATE POLICY note_subtopics_admin_update_guard ON public.note_subtopics AS RESTRICTIVE
 FOR UPDATE TO anon, authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS note_subtopics_admin_update ON public.note_subtopics;
CREATE POLICY note_subtopics_admin_update ON public.note_subtopics
 FOR UPDATE TO authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS note_subtopics_admin_delete_guard ON public.note_subtopics;
CREATE POLICY note_subtopics_admin_delete_guard ON public.note_subtopics AS RESTRICTIVE
 FOR DELETE TO anon, authenticated USING (public.can_manage_note_folders());
DROP POLICY IF EXISTS note_subtopics_admin_delete ON public.note_subtopics;
CREATE POLICY note_subtopics_admin_delete ON public.note_subtopics
 FOR DELETE TO authenticated USING (public.can_manage_note_folders());

-- SELECT policies, personal favorites/progress and existing data are unchanged.
COMMIT;
