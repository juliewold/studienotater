-- Only in an empty disposable local database. Deliberately permissive old policies.
\set ON_ERROR_STOP on
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
CREATE TABLE profiles(id uuid PRIMARY KEY, role text, username text);
INSERT INTO profiles VALUES
 ('00000000-0000-0000-0000-000000000001','admin','Admin'),
 ('00000000-0000-0000-0000-000000000002','user','Reader');
CREATE TABLE note_folders(id uuid PRIMARY KEY, subject_id text, name text, created_at timestamptz);
INSERT INTO note_folders VALUES
 ('00000000-0000-0000-0000-000000000011','subject','First','2026-01-01'),
 ('00000000-0000-0000-0000-000000000012','subject','Second','2026-01-02');
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles, note_folders TO anon, authenticated;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY legacy_profiles ON profiles TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY legacy_folders ON note_folders TO anon, authenticated USING (true) WITH CHECK (true);
\ir ../database/migrations/20261013_note_folder_order.sql
\ir ../database/migrations/20261013_note_folder_admin.sql
\ir ../database/migrations/20261013_note_folder_admin.sql
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
DO $$ DECLARE affected integer; BEGIN
 IF (SELECT count(*) FROM note_folders) <> 2 THEN RAISE EXCEPTION 'Read access lost'; END IF;
 BEGIN
  INSERT INTO note_folders(id,subject_id,name) VALUES ('00000000-0000-0000-0000-000000000013','subject','Forbidden');
  RAISE EXCEPTION 'Reader inserted folder';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE note_folders SET name='Forbidden',sort_order=8,color_index=4,subject_id='other';
 GET DIAGNOSTICS affected = ROW_COUNT;
 IF affected <> 0 THEN RAISE EXCEPTION 'Reader updated folders'; END IF;
 DELETE FROM note_folders;
 GET DIAGNOSTICS affected = ROW_COUNT;
 IF affected <> 0 THEN RAISE EXCEPTION 'Reader deleted folders'; END IF;
 BEGIN
  PERFORM reorder_note_folders('subject',ARRAY['00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000011']::uuid[]);
  RAISE EXCEPTION 'Reader reordered folders';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE profiles SET role='admin' WHERE id=auth.uid();
  RAISE EXCEPTION 'Reader promoted self';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  INSERT INTO profiles VALUES ('00000000-0000-0000-0000-000000000003','admin','Spoof');
  RAISE EXCEPTION 'Reader inserted admin';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE profiles SET id='00000000-0000-0000-0000-000000000004' WHERE role='admin';
  RAISE EXCEPTION 'Reader reassigned admin identity';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE profiles SET username='Updated reader' WHERE id=auth.uid();
END $$;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
DO $$ BEGIN
 INSERT INTO note_folders(id,subject_id,name) VALUES ('00000000-0000-0000-0000-000000000013','subject','Admin created');
 UPDATE note_folders SET name='Renamed' WHERE id='00000000-0000-0000-0000-000000000013';
 IF NOT EXISTS(SELECT 1 FROM note_folders WHERE name='Renamed') THEN RAISE EXCEPTION 'Admin rename failed'; END IF;
 DELETE FROM note_folders WHERE id='00000000-0000-0000-0000-000000000013';
 PERFORM reorder_note_folders('subject',ARRAY['00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000011']::uuid[]);
 IF NOT EXISTS(SELECT 1 FROM note_folders WHERE name='Second' AND sort_order=0 AND color_index=1) THEN RAISE EXCEPTION 'Admin ordering/color failed'; END IF;
END $$;
RESET ROLE;
SET ROLE anon;
SELECT set_config('request.jwt.claim.sub','',false);
DO $$ DECLARE affected integer; BEGIN
 IF (SELECT count(*) FROM note_folders) <> 2 THEN RAISE EXCEPTION 'Existing anonymous reads lost'; END IF;
 UPDATE note_folders SET name='Anonymous'; GET DIAGNOSTICS affected = ROW_COUNT;
 IF affected <> 0 THEN RAISE EXCEPTION 'Anonymous update allowed'; END IF;
 DELETE FROM note_folders; GET DIAGNOSTICS affected = ROW_COUNT;
 IF affected <> 0 THEN RAISE EXCEPTION 'Anonymous delete allowed'; END IF;
 BEGIN
  INSERT INTO note_folders(id,name) VALUES ('00000000-0000-0000-0000-000000000013','Anonymous');
  RAISE EXCEPTION 'Anonymous insert allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  PERFORM reorder_note_folders('subject','{}'::uuid[]);
  RAISE EXCEPTION 'Anonymous RPC allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SELECT 'PASS: reader/anonymous writes denied, admin CRUD/order allowed, reads and colors preserved, role escalation blocked';
