-- Manual phase 1 only. Does NOT make buckets private or change objects/files.
-- Requires the existing protected profiles.role + can_manage_note_folders().
-- Current app model: shared study files for registered users; admin-only writes.
BEGIN;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='storage' AND c.relname='objects' AND c.relrowsecurity) THEN
    RAISE EXCEPTION 'storage.objects RLS must already be enabled';
  END IF;
  IF (SELECT count(*) FROM storage.buckets WHERE id IN ('pdfs','note-images')) <> 2 THEN
    RAISE EXCEPTION 'Both study buckets must exist; no buckets are created by this migration';
  END IF;
END $$;

-- Restrictive guards AND with existing permissive/ALL policies. Other buckets
-- retain their existing access rules; no grants are widened.
DROP POLICY IF EXISTS study_files_read_guard ON storage.objects;
CREATE POLICY study_files_read_guard ON storage.objects AS RESTRICTIVE
FOR SELECT TO anon, authenticated USING (
  bucket_id NOT IN ('pdfs','note-images') OR
  (auth.uid() IS NOT NULL AND NOT coalesce((auth.jwt()->>'is_anonymous')::boolean,false))
);
DROP POLICY IF EXISTS study_files_insert_guard ON storage.objects;
CREATE POLICY study_files_insert_guard ON storage.objects AS RESTRICTIVE
FOR INSERT TO anon, authenticated WITH CHECK (
  bucket_id NOT IN ('pdfs','note-images') OR
  (auth.uid() IS NOT NULL AND NOT coalesce((auth.jwt()->>'is_anonymous')::boolean,false)
    AND public.can_manage_note_folders())
);
DROP POLICY IF EXISTS study_files_update_guard ON storage.objects;
CREATE POLICY study_files_update_guard ON storage.objects AS RESTRICTIVE
FOR UPDATE TO anon, authenticated USING (
  bucket_id NOT IN ('pdfs','note-images') OR
  (auth.uid() IS NOT NULL AND NOT coalesce((auth.jwt()->>'is_anonymous')::boolean,false)
    AND public.can_manage_note_folders())
) WITH CHECK (
  bucket_id NOT IN ('pdfs','note-images') OR
  (auth.uid() IS NOT NULL AND NOT coalesce((auth.jwt()->>'is_anonymous')::boolean,false)
    AND public.can_manage_note_folders())
);
DROP POLICY IF EXISTS study_files_delete_guard ON storage.objects;
CREATE POLICY study_files_delete_guard ON storage.objects AS RESTRICTIVE
FOR DELETE TO anon, authenticated USING (
  bucket_id NOT IN ('pdfs','note-images') OR
  (auth.uid() IS NOT NULL AND NOT coalesce((auth.jwt()->>'is_anonymous')::boolean,false)
    AND public.can_manage_note_folders())
);

DROP POLICY IF EXISTS study_files_registered_read ON storage.objects;
CREATE POLICY study_files_registered_read ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id IN ('pdfs','note-images') AND auth.uid() IS NOT NULL
  AND NOT coalesce((auth.jwt()->>'is_anonymous')::boolean,false)
);
DROP POLICY IF EXISTS study_files_admin_insert ON storage.objects;
CREATE POLICY study_files_admin_insert ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id IN ('pdfs','note-images') AND public.can_manage_note_folders()
);
DROP POLICY IF EXISTS study_files_admin_update ON storage.objects;
CREATE POLICY study_files_admin_update ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id IN ('pdfs','note-images') AND public.can_manage_note_folders()
) WITH CHECK (
  bucket_id IN ('pdfs','note-images') AND public.can_manage_note_folders()
);
DROP POLICY IF EXISTS study_files_admin_delete ON storage.objects;
CREATE POLICY study_files_admin_delete ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id IN ('pdfs','note-images') AND public.can_manage_note_folders()
);
COMMIT;
