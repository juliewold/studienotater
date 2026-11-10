-- Only in an empty disposable local database (never Supabase). Deliberately permissive legacy policies.
-- Run: psql -v ON_ERROR_STOP=1 -d <empty-test-db> -f tests/note-subfolders.sql
\set ON_ERROR_STOP on
-- Supabase provides these roles; a plain local cluster needs them created.
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
END $$;
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
CREATE TABLE profiles(id uuid PRIMARY KEY, role text, username text);
INSERT INTO profiles VALUES
 ('00000000-0000-0000-0000-000000000001','admin','Admin'),
 ('00000000-0000-0000-0000-000000000002','user','Reader');
CREATE TABLE note_folders(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subject_id text NOT NULL, name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO note_folders(id, subject_id, name, created_at) VALUES
 ('00000000-0000-0000-0000-000000000011','subject','A','2026-01-01'),
 ('00000000-0000-0000-0000-000000000012','subject','B','2026-01-02'),
 ('00000000-0000-0000-0000-000000000015','other','X','2026-01-03');
-- Pre-existing top-level folders keep their notes after the migration.
CREATE TABLE notes(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subject_id text NOT NULL, folder_id uuid REFERENCES note_folders(id), title text NOT NULL);
INSERT INTO notes(id, subject_id, folder_id, title) VALUES
 ('00000000-0000-0000-0000-000000000022','subject','00000000-0000-0000-0000-000000000011','In A'),
 ('00000000-0000-0000-0000-000000000023','subject',NULL,'Loose');
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles, note_folders, notes TO anon, authenticated;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY legacy_profiles ON profiles TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY legacy_folders ON note_folders TO anon, authenticated USING (true) WITH CHECK (true);

\ir ../database/migrations/20261013_note_folder_order.sql
\ir ../database/migrations/20261013_note_folder_admin.sql
\ir ../database/migrations/20261110_note_subfolders.sql
-- Re-running the migration must be harmless.
\ir ../database/migrations/20261110_note_subfolders.sql

-- Admin: nest A > A1 > A1a and B > B1 through normal table writes.
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
INSERT INTO note_folders(id, subject_id, name, parent_id) VALUES
 ('00000000-0000-0000-0000-000000000013','subject','A1','00000000-0000-0000-0000-000000000011'),
 ('00000000-0000-0000-0000-000000000014','subject','A1a','00000000-0000-0000-0000-000000000013'),
 ('00000000-0000-0000-0000-000000000016','subject','B1','00000000-0000-0000-0000-000000000012');

DO $$ BEGIN
 IF (SELECT count(*) FROM note_folders WHERE parent_id IS NULL AND subject_id = 'subject') <> 2 THEN
   RAISE EXCEPTION 'Existing top-level folders changed';
 END IF;
 -- Self-parenting must fail.
 BEGIN
  UPDATE note_folders SET parent_id = id WHERE id = '00000000-0000-0000-0000-000000000011';
  RAISE EXCEPTION 'Folder accepted itself as parent';
 EXCEPTION WHEN check_violation THEN NULL; END;
 -- Moving a folder into its own grandchild (a cycle) must fail.
 BEGIN
  UPDATE note_folders SET parent_id = '00000000-0000-0000-0000-000000000014' WHERE id = '00000000-0000-0000-0000-000000000011';
  RAISE EXCEPTION 'Cycle accepted';
 EXCEPTION WHEN check_violation THEN NULL; END;
 -- Cross-subject parent must fail.
 BEGIN
  UPDATE note_folders SET parent_id = '00000000-0000-0000-0000-000000000015' WHERE id = '00000000-0000-0000-0000-000000000012';
  RAISE EXCEPTION 'Cross-subject parent accepted';
 EXCEPTION WHEN check_violation THEN NULL; END;
 -- Unknown parent must fail.
 BEGIN
  UPDATE note_folders SET parent_id = gen_random_uuid() WHERE id = '00000000-0000-0000-0000-000000000012';
  RAISE EXCEPTION 'Unknown parent accepted';
 EXCEPTION WHEN foreign_key_violation THEN NULL; END;
END $$;

-- Legal move: B1 into A (top-level A gets a subfolder, A1a stays in place).
UPDATE note_folders SET parent_id = '00000000-0000-0000-0000-000000000011' WHERE id = '00000000-0000-0000-0000-000000000016';
-- Move back to top level.
UPDATE note_folders SET parent_id = NULL WHERE id = '00000000-0000-0000-0000-000000000016';

-- The note that lives in A1 is moved into A1 so that deleting A1 has content to move.
UPDATE notes SET folder_id = '00000000-0000-0000-0000-000000000013' WHERE id = '00000000-0000-0000-0000-000000000022';

-- Reorder covers top-level folders only (A, B and B1 are top level now). Subfolders must be rejected.
SELECT public.reorder_note_folders('subject', ARRAY['00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000016']::uuid[]);
DO $$ BEGIN
 BEGIN
  PERFORM public.reorder_note_folders('subject', ARRAY['00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000013']::uuid[]);
  RAISE EXCEPTION 'Subfolder accepted in root reorder';
 EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT LIKE 'Folder list changed%' THEN RAISE; END IF;
 END;
END $$;

-- Reader: no writes, no delete, no reorder, but can read every folder.
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
DO $$ BEGIN
 IF (SELECT count(*) FROM note_folders WHERE subject_id = 'subject') <> 5 THEN RAISE EXCEPTION 'Reader read access lost'; END IF;
 BEGIN
  INSERT INTO note_folders(id,subject_id,name,parent_id) VALUES ('00000000-0000-0000-0000-000000000099','subject','Forbidden','00000000-0000-0000-0000-000000000011');
  RAISE EXCEPTION 'Reader inserted subfolder';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE note_folders SET parent_id = '00000000-0000-0000-0000-000000000011' WHERE id = '00000000-0000-0000-0000-000000000012';
  IF FOUND THEN RAISE EXCEPTION 'Reader moved folder'; END IF;
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM public.delete_note_folder('00000000-0000-0000-0000-000000000013');
  RAISE EXCEPTION 'Reader deleted folder';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM public.reorder_note_folders('subject', ARRAY['00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000012']::uuid[]);
  RAISE EXCEPTION 'Reader reordered folders';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;

-- Admin: deleting A1 moves A1a up to A and its note up to A. Nothing is lost.
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
SELECT public.delete_note_folder('00000000-0000-0000-0000-000000000013');
-- Deleting top-level B moves its subfolder B1 to the top level, and deleting a missing folder is a no-op.
INSERT INTO note_folders(id, subject_id, name, parent_id) VALUES ('00000000-0000-0000-0000-000000000017','subject','B1b','00000000-0000-0000-0000-000000000012');
SELECT public.delete_note_folder('00000000-0000-0000-0000-000000000012');
SELECT public.delete_note_folder('00000000-0000-0000-0000-000000000012');

DO $$ DECLARE a1a_parent uuid; b1b_parent uuid; note_folder uuid; loose uuid; total integer; BEGIN
 SELECT parent_id INTO a1a_parent FROM note_folders WHERE id = '00000000-0000-0000-0000-000000000014';
 IF a1a_parent IS DISTINCT FROM '00000000-0000-0000-0000-000000000011' THEN RAISE EXCEPTION 'A1a was not moved up to A'; END IF;
 SELECT folder_id INTO note_folder FROM notes WHERE id = '00000000-0000-0000-0000-000000000022';
 IF note_folder IS DISTINCT FROM '00000000-0000-0000-0000-000000000011' THEN RAISE EXCEPTION 'Note in deleted A1 was not moved to A'; END IF;
 SELECT parent_id INTO b1b_parent FROM note_folders WHERE id = '00000000-0000-0000-0000-000000000017';
 IF b1b_parent IS NOT NULL THEN RAISE EXCEPTION 'Subfolder of deleted top-level B was not moved to top level'; END IF;
 SELECT folder_id INTO loose FROM notes WHERE id = '00000000-0000-0000-0000-000000000023';
 IF loose IS NOT NULL THEN RAISE EXCEPTION 'Loose note changed'; END IF;
 SELECT count(*) INTO total FROM notes;
 IF total <> 2 THEN RAISE EXCEPTION 'Notes were lost'; END IF;
END $$;

RESET ROLE;
SELECT 'note subfolder tests passed' AS result;
