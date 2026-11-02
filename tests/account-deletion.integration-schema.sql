-- ONLY the fresh local Supabase stack created by the integration runner.
-- This is a minimal synthetic application schema, not a production schema dump.
DO $$ BEGIN
 IF current_setting('app.account_deletion.integration', true) IS DISTINCT FROM 'synthetic-only'
 THEN RAISE EXCEPTION 'Isolated integration runner required'; END IF;
END $$;
CREATE TABLE public.account_deletion_integration_marker (name text PRIMARY KEY);
INSERT INTO public.account_deletion_integration_marker VALUES ('synthetic-only');
CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 role text NOT NULL DEFAULT 'user', username text, full_name text
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY integration_profile_read ON public.profiles FOR SELECT TO authenticated USING (id=auth.uid());
GRANT SELECT ON public.profiles TO authenticated;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['favorites','progress','book_progress','book_task_progress','exam_task_progress','semester_subjects'] LOOP
  EXECUTE format('CREATE TABLE public.%I(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,value text NOT NULL)',t);
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
 END LOOP;
END $$;
CREATE TABLE public.calendar_events(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,title text NOT NULL);
CREATE TABLE public.notes(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),content text NOT NULL,created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
-- A synthetic private bucket allows one real owner-upload test. Never relax
-- production Storage policies for this fixture.
CREATE POLICY account_integration_upload ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id='account-integration-files' AND (storage.foldername(name))[1]=auth.uid()::text);
NOTIFY pgrst, 'reload schema';
