-- Only an empty, disposable local PostgreSQL database; never production.
\set ON_ERROR_STOP on
DO $$ BEGIN
 IF current_database() <> 'book_task_progress_fk_test' THEN RAISE EXCEPTION 'Disposable test database required'; END IF;
END $$;
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE SCHEMA auth;
CREATE TABLE auth.users(id uuid PRIMARY KEY);
CREATE TABLE public.book_chapter_tasks(id uuid PRIMARY KEY, title text NOT NULL);
CREATE TABLE public.book_task_progress(
 user_id uuid NOT NULL, task_id uuid NOT NULL REFERENCES public.book_chapter_tasks(id),
 completed boolean NOT NULL, updated_at timestamptz NOT NULL,
 PRIMARY KEY(user_id,task_id)
);
ALTER TABLE book_task_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_progress ON book_task_progress TO authenticated
 USING (user_id = nullif(current_setting('request.jwt.claim.sub',true),'')::uuid)
 WITH CHECK (user_id = nullif(current_setting('request.jwt.claim.sub',true),'')::uuid);
GRANT SELECT,INSERT,UPDATE,DELETE ON book_task_progress TO authenticated;
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');
INSERT INTO book_chapter_tasks VALUES ('00000000-0000-0000-0000-000000000010','shared task');
INSERT INTO book_task_progress VALUES
 ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010',true,'2026-11-01 00:00:00+00'),
 ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000010',false,'2026-11-01 00:00:00+00');
CREATE TEMP TABLE before_rows AS SELECT * FROM book_task_progress;
CREATE TEMP TABLE before_rls AS SELECT relrowsecurity,relacl FROM pg_class WHERE oid='book_task_progress'::regclass;
CREATE TEMP TABLE before_policies AS SELECT * FROM pg_policies WHERE tablename='book_task_progress';
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
DO $$ BEGIN
 IF EXISTS ((SELECT * FROM book_task_progress EXCEPT SELECT * FROM before_rows) UNION ALL (SELECT * FROM before_rows EXCEPT SELECT * FROM book_task_progress)) THEN RAISE EXCEPTION 'Migration changed rows'; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND confrelid='auth.users'::regclass AND contype='f' AND confdeltype='c' AND convalidated) THEN RAISE EXCEPTION 'Validated Auth cascade missing'; END IF;
 IF (SELECT count(*) FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND contype='f')<>2 THEN RAISE EXCEPTION 'Duplicate/lost FK'; END IF;
 IF EXISTS ((SELECT relrowsecurity,relacl FROM pg_class WHERE oid='book_task_progress'::regclass EXCEPT SELECT * FROM before_rls) UNION ALL (SELECT * FROM before_rls EXCEPT SELECT relrowsecurity,relacl FROM pg_class WHERE oid='book_task_progress'::regclass)) THEN RAISE EXCEPTION 'RLS/grants changed'; END IF;
 IF EXISTS ((SELECT * FROM pg_policies WHERE tablename='book_task_progress' EXCEPT SELECT * FROM before_policies) UNION ALL (SELECT * FROM before_policies EXCEPT SELECT * FROM pg_policies WHERE tablename='book_task_progress')) THEN RAISE EXCEPTION 'Policies changed'; END IF;
 BEGIN INSERT INTO book_task_progress VALUES ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000010',true,now()); RAISE EXCEPTION 'Orphan insert allowed'; EXCEPTION WHEN foreign_key_violation THEN NULL; END;
 BEGIN UPDATE book_task_progress SET user_id='00000000-0000-0000-0000-000000000003' WHERE user_id='00000000-0000-0000-0000-000000000001'; RAISE EXCEPTION 'Orphan update allowed'; EXCEPTION WHEN foreign_key_violation THEN NULL; END;
END $$;
-- Actual FK cascade, independent of account-deletion trigger implementation.
DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001';
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM book_task_progress WHERE user_id='00000000-0000-0000-0000-000000000001') THEN RAISE EXCEPTION 'Own progress retained'; END IF;
 IF NOT EXISTS(SELECT 1 FROM book_task_progress WHERE user_id='00000000-0000-0000-0000-000000000002' AND NOT completed AND updated_at='2026-11-01 00:00:00+00') THEN RAISE EXCEPTION 'Other user changed'; END IF;
 IF (SELECT count(*) FROM auth.users)<>1 OR NOT EXISTS(SELECT 1 FROM book_chapter_tasks WHERE title='shared task') THEN RAISE EXCEPTION 'Other user/shared task deleted'; END IF;
END $$;
-- Existing correct FK with a different name and NOT VALID is reused/validated.
ALTER TABLE book_task_progress DROP CONSTRAINT book_task_progress_user_id_auth_users_fkey;
ALTER TABLE book_task_progress ADD CONSTRAINT existing_owner_fk FOREIGN KEY(user_id) REFERENCES auth.users ON DELETE CASCADE NOT VALID;
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND conname='existing_owner_fk' AND convalidated) THEN RAISE EXCEPTION 'Existing FK not reused'; END IF;
END $$;
SELECT 'PASS: preserved rows/RLS/grants/policies, idempotency, FK validation/reuse, orphan writes denied, user-isolated cascade and shared tasks preserved' AS result;

-- Negative cases use the actual transaction-wrapped migration. Each expected
-- error rolls back its DDL; assertions below verify no silent repair/data loss.
ALTER TABLE book_task_progress DROP CONSTRAINT existing_owner_fk;
INSERT INTO book_task_progress VALUES ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000010',true,now());
\set ON_ERROR_STOP off
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
\set ON_ERROR_STOP on
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND confrelid='auth.users'::regclass) OR (SELECT count(*) FROM book_task_progress)<>2 THEN RAISE EXCEPTION 'Orphan was repaired or FK installed'; END IF;
END $$;
DELETE FROM book_task_progress WHERE user_id='00000000-0000-0000-0000-000000000003';

ALTER TABLE book_task_progress ADD CONSTRAINT incompatible_fk FOREIGN KEY(user_id) REFERENCES auth.users ON DELETE SET NULL;
\set ON_ERROR_STOP off
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
\set ON_ERROR_STOP on
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND conname='incompatible_fk' AND confdeltype='n') OR (SELECT count(*) FROM book_task_progress)<>1 THEN RAISE EXCEPTION 'Conflicting FK/data changed'; END IF;
END $$;
ALTER TABLE book_task_progress DROP CONSTRAINT incompatible_fk;

ALTER TABLE book_task_progress ADD CONSTRAINT book_task_progress_user_id_auth_users_fkey CHECK (completed IN (true,false));
\set ON_ERROR_STOP off
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
\set ON_ERROR_STOP on
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND conname='book_task_progress_user_id_auth_users_fkey' AND contype='c') THEN RAISE EXCEPTION 'Name collision overwritten'; END IF;
 IF EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND confrelid='auth.users'::regclass) THEN RAISE EXCEPTION 'Name collision ignored'; END IF;
END $$;
ALTER TABLE book_task_progress DROP CONSTRAINT book_task_progress_user_id_auth_users_fkey;

CREATE TABLE shared_dependency(user_id uuid,task_id uuid,FOREIGN KEY(user_id,task_id) REFERENCES book_task_progress ON DELETE CASCADE);
\set ON_ERROR_STOP off
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
\set ON_ERROR_STOP on
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND confrelid='auth.users'::regclass) THEN RAISE EXCEPTION 'Unknown incoming dependency allowed'; END IF;
END $$;
DROP TABLE shared_dependency;

CREATE FUNCTION unreviewed_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN OLD; END $$;
CREATE TRIGGER unreviewed_delete BEFORE DELETE ON book_task_progress FOR EACH ROW EXECUTE FUNCTION unreviewed_delete();
\set ON_ERROR_STOP off
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
\set ON_ERROR_STOP on
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND confrelid='auth.users'::regclass) THEN RAISE EXCEPTION 'Unknown DELETE trigger allowed'; END IF;
END $$;
DROP TRIGGER unreviewed_delete ON book_task_progress;

DROP POLICY own_progress ON book_task_progress;
ALTER TABLE book_task_progress ALTER COLUMN user_id TYPE text USING user_id::text;
\set ON_ERROR_STOP off
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
\set ON_ERROR_STOP on
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND confrelid='auth.users'::regclass) OR (SELECT count(*) FROM book_task_progress)<>1 THEN RAISE EXCEPTION 'Incompatible type/data changed'; END IF;
END $$;
ALTER TABLE book_task_progress ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
-- Free-standing NULL ownership requires review, without changing nullability.
ALTER TABLE book_task_progress DROP CONSTRAINT book_task_progress_pkey;
ALTER TABLE book_task_progress ALTER COLUMN user_id DROP NOT NULL;
INSERT INTO book_task_progress VALUES (NULL,'00000000-0000-0000-0000-000000000010',true,now());
\set ON_ERROR_STOP off
\ir ../database/migrations/20261101_book_task_progress_auth_user_fk.sql
\set ON_ERROR_STOP on
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='book_task_progress'::regclass AND confrelid='auth.users'::regclass) OR NOT EXISTS(SELECT 1 FROM book_task_progress WHERE user_id IS NULL) THEN RAISE EXCEPTION 'Unowned row silently repaired'; END IF;
 IF NOT EXISTS(SELECT 1 FROM book_chapter_tasks WHERE title='shared task') OR (SELECT count(*) FROM auth.users)<>1 THEN RAISE EXCEPTION 'Negative cases changed users/shared tasks'; END IF;
END $$;
SELECT 'PASS: orphan/NULL ownership, incompatible type/FK, incoming dependencies and custom DELETE triggers block migration without data repair or partial DDL' AS result;
