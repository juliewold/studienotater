-- Run only in an empty disposable local database; roles anon/authenticated must exist.
\set ON_ERROR_STOP on
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
CREATE TABLE profiles(id uuid PRIMARY KEY, role text);
INSERT INTO profiles VALUES ('00000000-0000-0000-0000-000000000001','admin'), ('00000000-0000-0000-0000-000000000002','user');
CREATE TABLE note_folders(id uuid PRIMARY KEY, subject_id text, name text, created_at timestamptz);
CREATE TABLE topics(id uuid PRIMARY KEY);
INSERT INTO topics VALUES ('00000000-0000-0000-0000-000000000011');
GRANT SELECT ON topics TO anon, authenticated;
\ir ../database/migrations/20261013_note_folder_order.sql
\ir ../database/migrations/20261013_note_folder_admin.sql
\ir ../database/migrations/20261014_topic_introductions.sql
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
INSERT INTO topic_introductions VALUES ('00000000-0000-0000-0000-000000000011','Admin introduction');
UPDATE topic_introductions SET introduction='Updated';
DO $$ BEGIN
 IF (SELECT introduction FROM topic_introductions) <> 'Updated' THEN RAISE EXCEPTION 'Admin update failed'; END IF;
 BEGIN
  UPDATE topic_introductions SET introduction=repeat('x',3001);
  RAISE EXCEPTION 'Length constraint failed';
 EXCEPTION WHEN check_violation THEN NULL; END;
END $$;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
DO $$ DECLARE affected integer; BEGIN
 IF (SELECT introduction FROM topic_introductions) <> 'Updated' THEN RAISE EXCEPTION 'Reader cannot read'; END IF;
 UPDATE topic_introductions SET introduction='Forbidden';
 GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected <> 0 THEN RAISE EXCEPTION 'Reader updated introduction'; END IF;
 DELETE FROM topic_introductions;
 GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected <> 0 THEN RAISE EXCEPTION 'Reader deleted introduction'; END IF;
 BEGIN
  INSERT INTO topic_introductions VALUES ('00000000-0000-0000-0000-000000000011','Forbidden') ON CONFLICT (topic_id) DO UPDATE SET introduction=EXCLUDED.introduction;
  RAISE EXCEPTION 'Reader upsert succeeded';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SET ROLE anon;
DO $$ BEGIN
 IF (SELECT count(*) FROM topic_introductions) <> 1 THEN RAISE EXCEPTION 'Anonymous read failed'; END IF;
 BEGIN
  UPDATE topic_introductions SET introduction='Forbidden';
  RAISE EXCEPTION 'Anonymous update succeeded';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
