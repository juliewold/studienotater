-- ONLY in an empty disposable local PostgreSQL database.
\set ON_ERROR_STOP on
\ir shared-note-admin.sql
INSERT INTO notes(id,subject_id,folder_id,title) VALUES
 ('00000000-0000-0000-0000-000000000022','subject','00000000-0000-0000-0000-000000000012','A'),
 ('00000000-0000-0000-0000-000000000023','subject',NULL,'Z'),
 ('00000000-0000-0000-0000-000000000024','subject',NULL,'A'),
 ('00000000-0000-0000-0000-000000000025','subject','00000000-0000-0000-0000-000000000011','Other folder');
\ir ../database/migrations/20261013_note_order.sql
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
SELECT reorder_notes('subject','00000000-0000-0000-0000-000000000012',ARRAY['00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000022']::uuid[]);
SELECT reorder_notes('subject',NULL,ARRAY['00000000-0000-0000-0000-000000000023','00000000-0000-0000-0000-000000000024']::uuid[]);
DO $$ BEGIN
 IF (SELECT sort_order FROM notes WHERE id='00000000-0000-0000-0000-000000000021')<>0 OR
 (SELECT sort_order FROM notes WHERE id='00000000-0000-0000-0000-000000000023')<>0 THEN RAISE EXCEPTION 'Order not saved'; END IF;
 BEGIN
  PERFORM reorder_notes('subject',NULL,ARRAY['00000000-0000-0000-0000-000000000023']::uuid[]);
  RAISE EXCEPTION 'Accepted incomplete list';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Accepted incomplete list' THEN RAISE; END IF; END;
 BEGIN
  PERFORM reorder_notes('subject',NULL,ARRAY['00000000-0000-0000-0000-000000000023','00000000-0000-0000-0000-000000000023']::uuid[]);
  RAISE EXCEPTION 'Accepted duplicate list';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Accepted duplicate list' THEN RAISE; END IF; END;
 BEGIN
  PERFORM reorder_notes('subject',NULL,ARRAY['00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000023']::uuid[]);
  RAISE EXCEPTION 'Accepted wrong group';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Accepted wrong group' THEN RAISE; END IF; END;
 BEGIN
  PERFORM reorder_notes('other','00000000-0000-0000-0000-000000000012',ARRAY['00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000022']::uuid[]);
  RAISE EXCEPTION 'Accepted wrong subject';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Accepted wrong subject' THEN RAISE; END IF; END;
END $$;
RESET ROLE;
CREATE POLICY deny_one_note ON notes AS RESTRICTIVE FOR UPDATE TO authenticated USING(id<>'00000000-0000-0000-0000-000000000022');
SET ROLE authenticated;
DO $$ BEGIN
 BEGIN
  PERFORM reorder_notes('subject','00000000-0000-0000-0000-000000000012',ARRAY['00000000-0000-0000-0000-000000000022','00000000-0000-0000-0000-000000000021']::uuid[]);
  RAISE EXCEPTION 'Accepted partial update';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Accepted partial update' THEN RAISE; END IF; END;
 IF (SELECT sort_order FROM notes WHERE id='00000000-0000-0000-0000-000000000021')<>0 THEN RAISE EXCEPTION 'Partial reorder persisted'; END IF;
END $$;
RESET ROLE;
DROP POLICY deny_one_note ON notes;
\ir ../database/migrations/20261013_note_order.sql
SET ROLE authenticated;
DO $$ BEGIN
 IF (SELECT sort_order FROM notes WHERE id='00000000-0000-0000-0000-000000000021')<>0 THEN RAISE EXCEPTION 'Migration reset order'; END IF;
 UPDATE notes SET folder_id='00000000-0000-0000-0000-000000000012' WHERE id='00000000-0000-0000-0000-000000000023';
 IF (SELECT sort_order FROM notes WHERE id='00000000-0000-0000-0000-000000000023')<>2 THEN RAISE EXCEPTION 'Moved note did not append'; END IF;
 INSERT INTO notes(id,subject_id,folder_id,title) VALUES('00000000-0000-0000-0000-000000000026','subject','00000000-0000-0000-0000-000000000012','New');
 IF (SELECT sort_order FROM notes WHERE id='00000000-0000-0000-0000-000000000026')<>3 THEN RAISE EXCEPTION 'New note did not append'; END IF;
END $$;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
DO $$ DECLARE affected integer; BEGIN
 BEGIN
  PERFORM reorder_notes('subject',NULL,ARRAY['00000000-0000-0000-0000-000000000024']::uuid[]);
  RAISE EXCEPTION 'Reader reordered via RPC';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE notes SET sort_order=99; GET DIAGNOSTICS affected=ROW_COUNT;
 IF affected<>0 THEN RAISE EXCEPTION 'Reader directly reordered'; END IF;
 IF (SELECT count(*) FROM notes)<>6 THEN RAISE EXCEPTION 'Reader lost access'; END IF;
END $$;
RESET ROLE;
SELECT 'PASS: folder/unfiled persistence, scope, RLS/admin, atomic failure, rerun and append on create/move';
