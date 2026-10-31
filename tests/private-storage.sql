-- ONLY a disposable local database, never production. Synthetic Storage schema.
\set ON_ERROR_STOP on
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE SCHEMA auth;
CREATE SCHEMA storage;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
 SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
 SELECT coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb
$$;
CREATE FUNCTION public.can_manage_note_folders() RETURNS boolean LANGUAGE sql STABLE AS $$
 SELECT auth.uid()='00000000-0000-0000-0000-000000000001'::uuid
$$;
GRANT USAGE ON SCHEMA auth,storage TO anon,authenticated;
CREATE TABLE storage.buckets(id text PRIMARY KEY, public boolean);
CREATE TABLE storage.objects(id integer PRIMARY KEY,bucket_id text REFERENCES storage.buckets(id),name text,owner_id text);
INSERT INTO storage.buckets VALUES ('pdfs',true),('note-images',true),('unrelated',true);
INSERT INTO storage.objects VALUES (1,'pdfs','shared.pdf','admin'),(2,'note-images','admin/shared.png','admin'),(3,'unrelated','unchanged','other');
GRANT SELECT,INSERT,UPDATE,DELETE ON storage.objects TO anon,authenticated;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY permissive_legacy_all ON storage.objects TO anon,authenticated USING(true) WITH CHECK(true);
\ir ../database/migrations/20261031_private_study_storage_policies.sql
\ir ../database/migrations/20261031_private_study_storage_policies.sql
DO $$ BEGIN
 IF (SELECT count(*) FROM storage.buckets WHERE public)<>3 OR (SELECT count(*) FROM storage.objects)<>3 THEN RAISE EXCEPTION 'Migration changed buckets or files'; END IF;
END $$;
SET ROLE anon;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id IN ('pdfs','note-images')) THEN RAISE EXCEPTION 'Anonymous listing allowed'; END IF;
 IF NOT EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id='unrelated') THEN RAISE EXCEPTION 'Other bucket affected'; END IF;
 BEGIN
  INSERT INTO storage.objects VALUES(4,'pdfs','forbidden','anon');
  RAISE EXCEPTION 'Anonymous upload allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE storage.objects SET name='forbidden' WHERE bucket_id IN ('pdfs','note-images');
 DELETE FROM storage.objects WHERE bucket_id IN ('pdfs','note-images');
END $$;
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
DO $$ BEGIN
 IF (SELECT count(*) FROM storage.objects WHERE bucket_id IN ('pdfs','note-images'))<>2 THEN RAISE EXCEPTION 'Registered reader lost shared files'; END IF;
 BEGIN
  INSERT INTO storage.objects VALUES(4,'note-images','spoofed/shared.png','admin');
  RAISE EXCEPTION 'Reader upload allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE storage.objects SET bucket_id='pdfs' WHERE bucket_id='unrelated';
  RAISE EXCEPTION 'Reader moved object into protected bucket';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE storage.objects SET name='forbidden' WHERE bucket_id IN ('pdfs','note-images');
 DELETE FROM storage.objects WHERE bucket_id IN ('pdfs','note-images');
END $$;
SELECT set_config('request.jwt.claims','{"is_anonymous":true}',false);
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id IN ('pdfs','note-images')) THEN RAISE EXCEPTION 'Supabase anonymous account can read files'; END IF;
END $$;
SELECT set_config('request.jwt.claims','{}',false);
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM storage.objects WHERE name='shared.pdf') THEN RAISE EXCEPTION 'Non-admin changed/deleted PDF'; END IF;
 IF NOT EXISTS(SELECT 1 FROM storage.objects WHERE name='admin/shared.png') THEN RAISE EXCEPTION 'Non-admin changed/deleted image'; END IF;
 INSERT INTO storage.objects VALUES(4,'pdfs','new.pdf','admin');
 UPDATE storage.objects SET name='updated.pdf' WHERE id=4;
 IF NOT EXISTS(SELECT 1 FROM storage.objects WHERE name='updated.pdf') THEN RAISE EXCEPTION 'Admin update denied'; END IF;
 DELETE FROM storage.objects WHERE id=4;
 IF EXISTS(SELECT 1 FROM storage.objects WHERE id=4) THEN RAISE EXCEPTION 'Admin delete denied'; END IF;
END $$;
RESET ROLE;
SELECT 'PASS: anonymous/reader/admin access, legacy-policy guards, other-bucket isolation and unchanged buckets/files' AS result;
