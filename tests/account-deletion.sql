-- Synthetic local cluster only. Never run against Supabase or existing data.
\set ON_ERROR_STOP on
DO $$ BEGIN
 IF current_database() <> 'account_deletion_test' THEN RAISE EXCEPTION 'Disposable test database required'; END IF;
END $$;
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE ROLE service_role;
CREATE SCHEMA auth;
CREATE SCHEMA storage;
CREATE TABLE auth.users(id uuid PRIMARY KEY);
CREATE TABLE public.profiles(id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE, role text);
CREATE TABLE storage.objects(id int PRIMARY KEY, owner_id text, owner uuid, name text);
CREATE TABLE storage.buckets(id text PRIMARY KEY, owner uuid, public boolean);
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['favorites','progress','book_progress','book_task_progress','exam_task_progress','semester_subjects'] LOOP
 EXECUTE format('CREATE TABLE public.%I(id int PRIMARY KEY, user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE, value text)',t);
 END LOOP;
END $$;
CREATE TABLE public.notes(id int PRIMARY KEY, content text, created_by uuid REFERENCES public.profiles ON DELETE SET NULL);
CREATE TABLE public.calendar_events(id int PRIMARY KEY, title text);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');
INSERT INTO profiles SELECT id,'user' FROM auth.users;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['favorites','progress','book_progress','book_task_progress','exam_task_progress','semester_subjects'] LOOP
 EXECUTE format('INSERT INTO public.%I SELECT row_number() OVER ()::int,id,''private'' FROM auth.users ORDER BY id',t);
 END LOOP;
END $$;
INSERT INTO notes VALUES (1,'shared material','00000000-0000-0000-0000-000000000001');
INSERT INTO calendar_events VALUES (1,'shared calendar');
INSERT INTO storage.objects VALUES (1,'00000000-0000-0000-0000-000000000002',NULL,'shared.pdf');
INSERT INTO storage.buckets VALUES ('pdfs',NULL,false),('note-images',NULL,false);
-- Reproduce the reported production gap before installing the separate fix.
ALTER TABLE book_task_progress DROP CONSTRAINT book_task_progress_user_id_fkey;
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
\ir ../database/migrations/20261101_account_deletion.sql
\ir ../database/migrations/20261101_account_deletion.sql

SET ROLE authenticated;
DO $$ BEGIN
 BEGIN PERFORM public.account_deletion_preflight('00000000-0000-0000-0000-000000000002'); RAISE EXCEPTION 'Reader RPC access'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN DELETE FROM auth.users; RAISE EXCEPTION 'Reader Auth deletion'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM 1 FROM account_deletion_internal.pending_checks; RAISE EXCEPTION 'Reader guard-table access'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;

UPDATE storage.buckets SET owner='00000000-0000-0000-0000-000000000001' WHERE id='pdfs';
DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Bucket owner deleted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_STORAGE_OWNERSHIP' THEN RAISE; END IF; END;
END $$;
UPDATE storage.buckets SET owner=NULL WHERE id='pdfs';
SET ROLE anon;
DO $$ BEGIN
 BEGIN PERFORM public.account_deletion_preflight('00000000-0000-0000-0000-000000000002'); RAISE EXCEPTION 'Anonymous RPC access'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;

DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000002'; RAISE EXCEPTION 'Storage owner deleted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_STORAGE_OWNERSHIP' THEN RAISE; END IF; END;
 IF (SELECT count(*) FROM profiles)<>2 OR (SELECT count(*) FROM favorites)<>2 THEN RAISE EXCEPTION 'Partial deletion'; END IF;
END $$;

CREATE TABLE public.unreviewed(id int, user_id uuid REFERENCES auth.users ON DELETE CASCADE);
DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Unknown ownership allowed';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_SCHEMA_REVIEW' THEN RAISE; END IF; END;
END $$;
DROP TABLE public.unreviewed;
ALTER TABLE notes DROP CONSTRAINT notes_created_by_fkey;
ALTER TABLE notes ADD FOREIGN KEY(created_by) REFERENCES profiles ON DELETE CASCADE;
DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Shared cascade allowed';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_SCHEMA_REVIEW' THEN RAISE; END IF; END;
 IF (SELECT content FROM notes WHERE id=1) <> 'shared material' THEN RAISE EXCEPTION 'Shared content changed'; END IF;
END $$;
ALTER TABLE notes DROP CONSTRAINT notes_created_by_fkey;
ALTER TABLE notes ADD FOREIGN KEY(created_by) REFERENCES profiles ON DELETE SET NULL;

CREATE FUNCTION public.fail_test_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'injected failure'; END $$;
CREATE TRIGGER fail_delete BEFORE DELETE ON progress FOR EACH ROW EXECUTE FUNCTION public.fail_test_delete();
DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Injected failure ignored';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'injected failure' THEN RAISE; END IF; END;
 IF (SELECT count(*) FROM auth.users)<>2 OR (SELECT count(*) FROM favorites)<>2 OR (SELECT count(*) FROM profiles)<>2 THEN RAISE EXCEPTION 'Rollback incomplete'; END IF;
END $$;
DROP TRIGGER fail_delete ON progress;

-- These assertions run after each failed deletion: no partial cleanup or
-- accidental changes to the second user, shared content, files or guard state.
CREATE FUNCTION public.assert_account_fixture_intact() RETURNS void LANGUAGE plpgsql AS $$
DECLARE t text; row_count bigint; owner_count bigint; values_intact boolean;
BEGIN
 IF (SELECT count(*) FROM auth.users)<>2 OR (SELECT count(*) FROM profiles)<>2 THEN RAISE EXCEPTION 'Account rollback incomplete'; END IF;
 FOREACH t IN ARRAY ARRAY['favorites','progress','book_progress','book_task_progress','exam_task_progress','semester_subjects'] LOOP
  IF (SELECT count(*) FROM auth.users u WHERE EXISTS (
   SELECT 1 FROM public.profiles p WHERE p.id=u.id))<>2 THEN RAISE EXCEPTION 'Profile lost'; END IF;
  EXECUTE format('SELECT count(*), count(DISTINCT user_id), bool_and(value=''private'') FROM public.%I',t)
    INTO row_count, owner_count, values_intact;
  IF row_count<>2 OR owner_count<>2 OR values_intact IS DISTINCT FROM true THEN RAISE EXCEPTION 'Personal/other-user rows changed'; END IF;
 END LOOP;
 IF NOT EXISTS(SELECT 1 FROM notes WHERE id=1 AND content='shared material' AND created_by='00000000-0000-0000-0000-000000000001') THEN RAISE EXCEPTION 'Shared content changed'; END IF;
 IF (SELECT count(*) FROM storage.objects)<>1 OR NOT EXISTS(SELECT 1 FROM storage.objects WHERE name='shared.pdf') OR EXISTS(SELECT 1 FROM storage.buckets WHERE public) THEN RAISE EXCEPTION 'Storage changed'; END IF;
 IF EXISTS(SELECT 1 FROM account_deletion_internal.pending_checks) THEN RAISE EXCEPTION 'Guard row retained after rollback'; END IF;
END $$;

-- Regression: SET NULL is not evidence that an unclassified table is shared.
CREATE TABLE public.extra_personal_data(id int, user_id uuid REFERENCES auth.users ON DELETE SET NULL, private_text text);
INSERT INTO extra_personal_data VALUES (1,'00000000-0000-0000-0000-000000000001','synthetic private text');
DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Unclassified SET NULL accepted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_SCHEMA_REVIEW' THEN RAISE; END IF; END;
 PERFORM public.assert_account_fixture_intact();
 IF NOT EXISTS(SELECT 1 FROM extra_personal_data WHERE user_id IS NOT NULL AND private_text='synthetic private text') THEN RAISE EXCEPTION 'Unclassified personal data changed'; END IF;
END $$;
DROP TABLE extra_personal_data;
-- A classified table does not automatically classify every new column in it.
ALTER TABLE notes ADD COLUMN owner_id uuid REFERENCES auth.users ON DELETE SET NULL;
DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Unclassified shared column accepted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_SCHEMA_REVIEW' THEN RAISE; END IF; END;
 PERFORM public.assert_account_fixture_intact();
END $$;
ALTER TABLE notes DROP COLUMN owner_id;

CREATE FUNCTION public.skip_test_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NULL; END $$;
-- Regression: silent child DELETE cancellation must abort before FK SET NULL
-- can detach and retain the undeleted personal row.
ALTER TABLE favorites ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE favorites DROP CONSTRAINT favorites_user_id_fkey;
ALTER TABLE favorites ADD FOREIGN KEY(user_id) REFERENCES auth.users ON DELETE SET NULL;
CREATE TRIGGER skip_child_delete BEFORE DELETE ON favorites FOR EACH ROW EXECUTE FUNCTION public.skip_test_delete();
DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Silent child cancellation accepted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_DELETION_INCOMPLETE' THEN RAISE; END IF; END;
 PERFORM public.assert_account_fixture_intact();
END $$;
DROP TRIGGER skip_child_delete ON favorites;
ALTER TABLE favorites DROP CONSTRAINT favorites_user_id_fkey;
ALTER TABLE favorites ADD FOREIGN KEY(user_id) REFERENCES auth.users ON DELETE CASCADE;
ALTER TABLE favorites ALTER COLUMN user_id SET NOT NULL;

CREATE TRIGGER skip_profile_delete BEFORE DELETE ON profiles FOR EACH ROW EXECUTE FUNCTION public.skip_test_delete();
DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Silent profile cancellation accepted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_DELETION_INCOMPLETE' THEN RAISE; END IF; END;
 PERFORM public.assert_account_fixture_intact();
END $$;
DROP TRIGGER skip_profile_delete ON profiles;

-- Regression: a later Auth trigger cancels after our cleanup has already run.
-- Force the deferred check inside the exception block to verify rollback; in
-- the actual Auth transaction it also runs automatically before COMMIT.
CREATE TRIGGER zz_skip_auth_delete BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.skip_test_delete();
-- Exercise real COMMIT failure, not just SET CONSTRAINTS inside a subtransaction.
BEGIN;
DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001';
\set ON_ERROR_STOP off
COMMIT;
\set guard_commit_error :ERROR
\set guard_commit_state :SQLSTATE
\set ON_ERROR_STOP on
SELECT :'guard_commit_error'::boolean AND :'guard_commit_state' = 'P0001' AS guard_commit_failed \gset
\if :guard_commit_failed
\else
 \echo 'FAIL: expected deferred deletion guard to reject COMMIT'
 \quit 1
\endif
SELECT public.assert_account_fixture_intact();
DO $$ BEGIN
 BEGIN
  DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001';
  SET CONSTRAINTS account_deletion_internal.assert_account_deletion_complete IMMEDIATE;
  RAISE EXCEPTION 'Silent parent cancellation accepted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_DELETION_INCOMPLETE' THEN RAISE; END IF; END;
 PERFORM public.assert_account_fixture_intact();
END $$;
DROP TRIGGER zz_skip_auth_delete ON auth.users;

-- Guard must also work for an Auth account with no profile/personal rows.
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000003');
CREATE TRIGGER zz_skip_auth_delete BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.skip_test_delete();
DO $$ BEGIN
 BEGIN
  DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000003';
  SET CONSTRAINTS account_deletion_internal.assert_account_deletion_complete IMMEDIATE;
  RAISE EXCEPTION 'Empty account cancellation accepted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_DELETION_INCOMPLETE' THEN RAISE; END IF; END;
 IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id='00000000-0000-0000-0000-000000000003') OR EXISTS(SELECT 1 FROM account_deletion_internal.pending_checks) THEN RAISE EXCEPTION 'Empty account rollback incomplete'; END IF;
END $$;
DROP TRIGGER zz_skip_auth_delete ON auth.users;
DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000003';
SELECT public.assert_account_fixture_intact();

-- If cancellation happens before our trigger, no cleanup is allowed. The Edge
-- handler independently verifies absence rather than trusting a DELETE 2xx.
CREATE TRIGGER aa_skip_auth_delete BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.skip_test_delete();
DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001';
SELECT public.assert_account_fixture_intact();
DROP TRIGGER aa_skip_auth_delete ON auth.users;

ALTER TABLE account_deletion_internal.pending_checks DISABLE TRIGGER assert_account_deletion_complete;
DO $$ BEGIN
 BEGIN DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Disabled guard accepted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'ACCOUNT_SCHEMA_REVIEW' THEN RAISE; END IF; END;
 PERFORM public.assert_account_fixture_intact();
END $$;
ALTER TABLE account_deletion_internal.pending_checks ENABLE TRIGGER assert_account_deletion_complete;

-- Optional calendar ownership is included only with an explicit, valid owner FK.
ALTER TABLE calendar_events ADD COLUMN user_id uuid REFERENCES auth.users ON DELETE CASCADE;
INSERT INTO calendar_events VALUES (2,'private calendar','00000000-0000-0000-0000-000000000001'),(3,'other calendar','00000000-0000-0000-0000-000000000002');
SET ROLE service_role;
SELECT public.account_deletion_preflight('00000000-0000-0000-0000-000000000001');
RESET ROLE;
DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001';
DO $$ BEGIN
 BEGIN INSERT INTO favorites VALUES(99,'00000000-0000-0000-0000-000000000001','stale JWT'); RAISE EXCEPTION 'Stale caller recreated data'; EXCEPTION WHEN foreign_key_violation THEN NULL; END;
END $$;
DO $$ DECLARE t text; n int; BEGIN
 IF (SELECT count(*) FROM auth.users)<>1 OR (SELECT count(*) FROM profiles)<>1 THEN RAISE EXCEPTION 'Auth/profile cleanup failed'; END IF;
 FOREACH t IN ARRAY ARRAY['favorites','progress','book_progress','book_task_progress','exam_task_progress','semester_subjects'] LOOP
 EXECUTE format('SELECT count(*) FROM public.%I WHERE user_id=$1',t) INTO n USING '00000000-0000-0000-0000-000000000001'::uuid;
 IF n<>0 THEN RAISE EXCEPTION 'Personal row retained'; END IF;
 EXECUTE format('SELECT count(*) FROM public.%I WHERE user_id=$1',t) INTO n USING '00000000-0000-0000-0000-000000000002'::uuid;
 IF n<>1 THEN RAISE EXCEPTION 'Other user changed'; END IF;
 END LOOP;
 IF NOT EXISTS(SELECT 1 FROM notes WHERE content='shared material' AND created_by IS NULL) OR (SELECT count(*) FROM storage.objects)<>1 OR EXISTS(SELECT 1 FROM storage.buckets WHERE public) THEN RAISE EXCEPTION 'Shared files/content changed'; END IF;
 IF (SELECT count(*) FROM calendar_events)<>2 OR EXISTS(SELECT 1 FROM calendar_events WHERE id=2) THEN RAISE EXCEPTION 'Calendar ownership failed'; END IF;
 IF EXISTS(SELECT 1 FROM account_deletion_internal.pending_checks) THEN RAISE EXCEPTION 'Guard row retained after success'; END IF;
END $$;
SELECT 'PASS: explicit SET NULL classification, silent child/profile/Auth cancellation, COMMIT rollback, absence guards, permission boundaries, ownership blocks, schema drift, shared/other-user preservation, calendar and idempotency' AS result;
