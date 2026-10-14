-- Run manually after 20261013_note_folder_admin.sql (protected admin roles).
-- Separate editorial storage leaves existing topics and their write policies intact.
BEGIN;
CREATE TABLE public.topic_introductions (
  topic_id uuid PRIMARY KEY REFERENCES public.topics(id) ON DELETE CASCADE,
  introduction text NOT NULL DEFAULT '' CHECK (char_length(introduction) <= 3000)
);
ALTER TABLE public.topic_introductions ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.topic_introductions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.topic_introductions TO authenticated;
CREATE POLICY topic_introductions_read ON public.topic_introductions FOR SELECT
  TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.topics WHERE topics.id = topic_id));
CREATE POLICY topic_introductions_admin ON public.topic_introductions FOR ALL
  TO authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
-- Also guard writes if a permissive policy is added later.
CREATE POLICY topic_introductions_insert_guard ON public.topic_introductions AS RESTRICTIVE
  FOR INSERT TO anon, authenticated WITH CHECK (public.can_manage_note_folders());
CREATE POLICY topic_introductions_update_guard ON public.topic_introductions AS RESTRICTIVE
  FOR UPDATE TO anon, authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
CREATE POLICY topic_introductions_delete_guard ON public.topic_introductions AS RESTRICTIVE
  FOR DELETE TO anon, authenticated USING (public.can_manage_note_folders());
COMMIT;
