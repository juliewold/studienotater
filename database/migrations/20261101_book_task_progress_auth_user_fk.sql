-- Manual review/apply only. Prerequisite for account-deletion activation.
-- Never deletes/repairs progress, users or shared tasks. Incompatible schema or
-- existing orphan/unowned rows abort the entire transaction for operator review.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

DO $$
DECLARE
 progress_rel oid := pg_catalog.to_regclass('public.book_task_progress');
 users_rel oid := pg_catalog.to_regclass('auth.users');
 progress_att smallint;
 users_att smallint;
 existing record;
 matching integer;
BEGIN
 IF progress_rel IS NULL OR users_rel IS NULL OR EXISTS (
   SELECT 1 FROM pg_catalog.pg_class WHERE oid IN (progress_rel, users_rel) AND relkind <> 'r'
 ) THEN RAISE EXCEPTION 'BOOK_TASK_PROGRESS_SCHEMA_REVIEW'; END IF;

 -- Stabilize the child rows/schema while inspecting and adding the FK. A busy
 -- table causes a bounded lock failure, not an indefinitely blocked application.
 LOCK TABLE public.book_task_progress IN SHARE ROW EXCLUSIVE MODE;
 SELECT attnum INTO progress_att FROM pg_catalog.pg_attribute
 WHERE attrelid = progress_rel AND attname = 'user_id'
   AND atttypid = 'uuid'::regtype AND NOT attisdropped;
 SELECT attnum INTO users_att FROM pg_catalog.pg_attribute
 WHERE attrelid = users_rel AND attname = 'id'
   AND atttypid = 'uuid'::regtype AND NOT attisdropped;
 IF progress_att IS NULL OR users_att IS NULL OR NOT EXISTS (
   SELECT 1 FROM pg_catalog.pg_constraint WHERE conrelid = users_rel
   AND contype = 'p' AND conkey = ARRAY[users_att]
 ) THEN RAISE EXCEPTION 'BOOK_TASK_PROGRESS_SCHEMA_REVIEW'; END IF;

 -- A new cascade must not silently propagate into another table or invoke
 -- unreviewed custom DELETE side effects. Internal RI triggers are expected.
 IF EXISTS (SELECT 1 FROM pg_catalog.pg_constraint
   WHERE contype = 'f' AND confrelid = progress_rel)
 OR EXISTS (SELECT 1 FROM pg_catalog.pg_trigger
   WHERE tgrelid = progress_rel AND NOT tgisinternal AND tgenabled <> 'D'
     AND (tgtype::integer & 8) <> 0)
 THEN RAISE EXCEPTION 'BOOK_TASK_PROGRESS_DEPENDENCY_REVIEW'; END IF;

 -- Do not reinterpret a conflicting/composite/deferred FK, replace constraints
 -- or silently introduce a second FK to another ownership model.
 SELECT count(*) INTO matching FROM pg_catalog.pg_constraint
 WHERE conrelid = progress_rel AND contype = 'f' AND progress_att = ANY(conkey);
 IF matching > 1 THEN RAISE EXCEPTION 'BOOK_TASK_PROGRESS_SCHEMA_REVIEW'; END IF;
 IF matching = 1 THEN
   SELECT * INTO existing FROM pg_catalog.pg_constraint
   WHERE conrelid = progress_rel AND contype = 'f' AND progress_att = ANY(conkey);
   IF existing.conkey <> ARRAY[progress_att] OR existing.confrelid <> users_rel
      OR existing.confkey <> ARRAY[users_att] OR existing.confdeltype <> 'c'
      OR existing.confupdtype <> 'a' OR existing.confmatchtype <> 's'
      OR existing.condeferrable THEN
     RAISE EXCEPTION 'BOOK_TASK_PROGRESS_SCHEMA_REVIEW';
   END IF;
 ELSIF EXISTS (SELECT 1 FROM pg_catalog.pg_constraint
   WHERE conrelid = progress_rel AND conname = 'book_task_progress_user_id_auth_users_fkey') THEN
   RAISE EXCEPTION 'BOOK_TASK_PROGRESS_SCHEMA_REVIEW';
 END IF;

 IF EXISTS (SELECT 1 FROM public.book_task_progress p
   WHERE p.user_id IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.user_id))
 THEN RAISE EXCEPTION 'BOOK_TASK_PROGRESS_ORPHAN_REVIEW'; END IF;

 IF matching = 0 THEN
   ALTER TABLE public.book_task_progress
     ADD CONSTRAINT book_task_progress_user_id_auth_users_fkey
     FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
   ALTER TABLE public.book_task_progress
     VALIDATE CONSTRAINT book_task_progress_user_id_auth_users_fkey;
 ELSIF NOT existing.convalidated THEN
   EXECUTE format('ALTER TABLE public.book_task_progress VALIDATE CONSTRAINT %I', existing.conname);
 END IF;
END $$;
COMMIT;
