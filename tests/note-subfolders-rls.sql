-- ONLY in an empty disposable local database (never Supabase). Covers the RLS paths of
-- delete_note_folder and the subject-immutability rule with the repo's real migrations.
-- Run: psql -v ON_ERROR_STOP=1 -d <empty-test-db> -f tests/note-subfolders-rls.sql
\set ON_ERROR_STOP on
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
 ('00000000-0000-0000-0000-000000000012','subject','B','2026-01-02');
-- Production FK behaviour is unknown here; SET NULL is the risky case (silent orphaning).
CREATE TABLE notes(id uuid PRIMARY KEY, subject_id text NOT NULL, folder_id uuid REFERENCES note_folders(id) ON DELETE SET NULL, title text NOT NULL, created_by uuid REFERENCES profiles(id) ON DELETE SET NULL, content text DEFAULT '');
CREATE TABLE note_subtopics(note_id uuid REFERENCES notes(id), subtopic_id uuid, PRIMARY KEY(note_id,subtopic_id));
-- Notes are shared: the Reader created this note, the admin must still be able to move it.
INSERT INTO notes(id, subject_id, folder_id, title, created_by) VALUES
 ('00000000-0000-0000-0000-000000000021','subject','00000000-0000-0000-0000-000000000011','Reader note','00000000-0000-0000-0000-000000000002');
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles, note_folders, notes, note_subtopics TO anon, authenticated;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY legacy_profiles ON profiles TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY legacy_folders ON note_folders TO anon, authenticated USING (true) WITH CHECK (true);
-- Pre-admin style: everyone reads notes, and only the creator may write them.
CREATE POLICY legacy_notes_read ON notes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY legacy_notes_owner_write ON notes FOR ALL TO anon, authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

\ir ../database/migrations/20261013_note_folder_order.sql
\ir ../database/migrations/20261013_note_folder_admin.sql
\ir ../database/migrations/20261013_shared_note_admin.sql
\ir ../database/migrations/20261110_note_subfolders.sql

-- Admin builds B > B1 > B1a (B1a holds a note created by the Reader).
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
INSERT INTO note_folders(id, subject_id, name, parent_id) VALUES
 ('00000000-0000-0000-0000-000000000013','subject','B1','00000000-0000-0000-0000-000000000012'),
 ('00000000-0000-0000-0000-000000000014','subject','B1a','00000000-0000-0000-0000-000000000013');
RESET ROLE;
UPDATE notes SET folder_id = '00000000-0000-0000-0000-000000000014' WHERE id = '00000000-0000-0000-0000-000000000021';

-- 1. Subject is immutable for admins, with or without children (hierarchy invariant).
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
DO $$ BEGIN
 BEGIN
  UPDATE note_folders SET subject_id = 'other' WHERE id = '00000000-0000-0000-0000-000000000012';
  RAISE EXCEPTION 'Folder with subfolders changed subject';
 EXCEPTION WHEN check_violation THEN NULL; END;
 BEGIN
  UPDATE note_folders SET subject_id = 'other' WHERE id = '00000000-0000-0000-0000-000000000014';
  RAISE EXCEPTION 'Leaf folder changed subject';
 EXCEPTION WHEN check_violation THEN NULL; END;
 IF (SELECT subject_id FROM note_folders WHERE id = '00000000-0000-0000-0000-000000000012') <> 'subject' THEN
   RAISE EXCEPTION 'Subject was changed';
 END IF;
END $$;

-- 2. Reader: cannot delete through the RPC, cannot change subject, cannot move notes.
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
DO $$ BEGIN
 BEGIN
  PERFORM public.delete_note_folder('00000000-0000-0000-0000-000000000013');
  RAISE EXCEPTION 'Reader deleted folder';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE note_folders SET subject_id = 'other' WHERE id = '00000000-0000-0000-0000-000000000013';
 IF FOUND THEN RAISE EXCEPTION 'Reader changed folder subject'; END IF;
 UPDATE notes SET folder_id = NULL WHERE id = '00000000-0000-0000-0000-000000000021';
 IF (SELECT folder_id FROM notes WHERE id = '00000000-0000-0000-0000-000000000021') IS NULL THEN
   RAISE EXCEPTION 'Reader moved shared note';
 END IF;
END $$;

-- 3. Admin deletes B1 (with B1a below and the Reader's note two levels down):
--    B1a and the note move up to B; nothing is lost, even though the Reader created the note.
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
SELECT public.delete_note_folder('00000000-0000-0000-0000-000000000013');
DO $$ BEGIN
 IF (SELECT parent_id FROM note_folders WHERE id = '00000000-0000-0000-0000-000000000014') IS DISTINCT FROM '00000000-0000-0000-0000-000000000012' THEN
   RAISE EXCEPTION 'Subfolder B1a was not moved up to B';
 END IF;
 -- The note lives in B1a, which was not deleted, so it stays where it is.
 IF (SELECT folder_id FROM notes WHERE id = '00000000-0000-0000-0000-000000000021') IS DISTINCT FROM '00000000-0000-0000-0000-000000000014' THEN
   RAISE EXCEPTION 'Note was moved although its folder was not deleted';
 END IF;
END $$;

-- 4. Admin deletes B1a, which holds the Reader's note: it moves to B, not to the top level.
SELECT public.delete_note_folder('00000000-0000-0000-0000-000000000014');
DO $$ BEGIN
 IF (SELECT folder_id FROM notes WHERE id = '00000000-0000-0000-0000-000000000021') IS DISTINCT FROM '00000000-0000-0000-0000-000000000012' THEN
   RAISE EXCEPTION 'Reader note did not move to the parent folder';
 END IF;
END $$;

-- 5. Simulate a production database where the admin UPDATE policy on notes is missing
--    (the case that used to orphan notes silently). The RPC must refuse, and roll back,
--    instead of deleting the folder and moving the note to the top level.
RESET ROLE;
INSERT INTO note_folders(id, subject_id, name, parent_id) VALUES ('00000000-0000-0000-0000-000000000015','subject','C','00000000-0000-0000-0000-000000000012');
INSERT INTO notes(id, subject_id, folder_id, title, created_by) VALUES
 ('00000000-0000-0000-0000-000000000022','subject','00000000-0000-0000-0000-000000000015','Second reader note','00000000-0000-0000-0000-000000000002');
DROP POLICY notes_admin_update ON notes;
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
DO $$ BEGIN
 BEGIN
  PERFORM public.delete_note_folder('00000000-0000-0000-0000-000000000015');
  RAISE EXCEPTION 'Delete succeeded with blocked note moves';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 IF NOT EXISTS (SELECT 1 FROM note_folders WHERE id = '00000000-0000-0000-0000-000000000015') THEN
   RAISE EXCEPTION 'Folder deleted despite blocked note move';
 END IF;
 IF (SELECT folder_id FROM notes WHERE id = '00000000-0000-0000-0000-000000000022') IS DISTINCT FROM '00000000-0000-0000-0000-000000000015' THEN
   RAISE EXCEPTION 'Note moved despite failed delete';
 END IF;
END $$;
RESET ROLE;
-- Restore the shared-note policy so the remaining checks run against the real migration.
CREATE POLICY notes_admin_update ON notes
 FOR UPDATE TO authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());

-- 6. Unknown folder fails loudly.
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
DO $$ BEGIN
 BEGIN
  PERFORM public.delete_note_folder('00000000-0000-0000-0000-000000000099');
  RAISE EXCEPTION 'Unknown folder delete reported success';
 EXCEPTION WHEN no_data_found THEN NULL; END;
END $$;
RESET ROLE;
SELECT 'note subfolder RLS tests passed' AS result;
