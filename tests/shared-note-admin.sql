-- ONLY in a disposable local database. Includes the folder/role protection tests.
\set ON_ERROR_STOP on
\ir folder-admin.sql
CREATE TABLE notes(id uuid PRIMARY KEY, subject_id text, folder_id uuid REFERENCES note_folders(id), title text, content text, subtopic_id uuid);
CREATE TABLE note_subtopics(note_id uuid REFERENCES notes(id), subtopic_id uuid, PRIMARY KEY(note_id,subtopic_id));
CREATE TABLE favorites(user_id uuid, item_id text);
CREATE TABLE progress(user_id uuid, item_id text, completed boolean);
INSERT INTO notes VALUES ('00000000-0000-0000-0000-000000000021','subject','00000000-0000-0000-0000-000000000011','Shared','Original',NULL);
INSERT INTO note_subtopics VALUES ('00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000031');
GRANT SELECT,INSERT,UPDATE,DELETE ON notes,note_subtopics,favorites,progress TO anon,authenticated;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY legacy_notes ON notes TO anon,authenticated USING(true) WITH CHECK(true);
CREATE POLICY legacy_links ON note_subtopics TO anon,authenticated USING(true) WITH CHECK(true);
CREATE POLICY own_favorites ON favorites TO authenticated USING(user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
CREATE POLICY own_progress ON progress TO authenticated USING(user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
\ir ../database/migrations/20261013_shared_note_admin.sql
\ir ../database/migrations/20261013_shared_note_admin.sql
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
DO $$ DECLARE affected integer; BEGIN
 IF (SELECT count(*) FROM notes) <> 1 OR (SELECT count(*) FROM note_subtopics) <> 1 THEN RAISE EXCEPTION 'Reader lost note access'; END IF;
 BEGIN
  INSERT INTO notes(id,subject_id,title) VALUES ('00000000-0000-0000-0000-000000000022','subject','Forbidden');
  RAISE EXCEPTION 'Reader created note';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE notes SET content='Forbidden',title='Forbidden',folder_id=NULL,subject_id='other',subtopic_id='00000000-0000-0000-0000-000000000032';
 GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>0 THEN RAISE EXCEPTION 'Reader edited/moved note'; END IF;
 DELETE FROM notes; GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>0 THEN RAISE EXCEPTION 'Reader deleted note'; END IF;
 BEGIN
  INSERT INTO note_subtopics VALUES ('00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000032');
  RAISE EXCEPTION 'Reader linked note';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE note_subtopics SET subtopic_id='00000000-0000-0000-0000-000000000032'; GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>0 THEN RAISE EXCEPTION 'Reader changed placement'; END IF;
 DELETE FROM note_subtopics; GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>0 THEN RAISE EXCEPTION 'Reader removed placement'; END IF;
 INSERT INTO favorites VALUES(auth.uid(),'note');
 INSERT INTO progress VALUES(auth.uid(),'note',false);
 UPDATE progress SET completed=true WHERE user_id=auth.uid();
 IF NOT EXISTS(SELECT 1 FROM progress WHERE completed) OR NOT EXISTS(SELECT 1 FROM favorites) THEN RAISE EXCEPTION 'Personal actions blocked'; END IF;
 DELETE FROM favorites WHERE user_id=auth.uid();
 UPDATE progress SET completed=false WHERE user_id=auth.uid();
END $$;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
DO $$ BEGIN
 INSERT INTO notes(id,subject_id,title) VALUES ('00000000-0000-0000-0000-000000000022','subject','New');
 UPDATE notes SET content='Admin edit',folder_id='00000000-0000-0000-0000-000000000012' WHERE id='00000000-0000-0000-0000-000000000021';
 INSERT INTO note_subtopics VALUES ('00000000-0000-0000-0000-000000000022','00000000-0000-0000-0000-000000000031');
 UPDATE note_subtopics SET subtopic_id='00000000-0000-0000-0000-000000000032' WHERE note_id='00000000-0000-0000-0000-000000000022';
 DELETE FROM note_subtopics WHERE note_id='00000000-0000-0000-0000-000000000022';
 DELETE FROM notes WHERE id='00000000-0000-0000-0000-000000000022';
 IF NOT EXISTS(SELECT 1 FROM notes WHERE content='Admin edit' AND folder_id='00000000-0000-0000-0000-000000000012') THEN RAISE EXCEPTION 'Admin edit/move failed'; END IF;
END $$;
RESET ROLE;
SET ROLE anon;
SELECT set_config('request.jwt.claim.sub','',false);
DO $$ DECLARE affected integer; BEGIN
 IF (SELECT count(*) FROM notes)<>1 THEN RAISE EXCEPTION 'Existing anonymous reading lost'; END IF;
 UPDATE notes SET content='Anonymous'; GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>0 THEN RAISE EXCEPTION 'Anonymous edited'; END IF;
 DELETE FROM notes; GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>0 THEN RAISE EXCEPTION 'Anonymous deleted'; END IF;
 BEGIN
  INSERT INTO notes(id) VALUES('00000000-0000-0000-0000-000000000023');
  RAISE EXCEPTION 'Anonymous created';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SELECT 'PASS: admin-only note/placement writes, reads and personal favorites/progress preserved';
