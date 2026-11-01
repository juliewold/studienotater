-- Manual deployment only. Requires schema review documented in ACCOUNT_DELETION.md.
-- No existing users/rows/objects are deleted by installing this migration.
BEGIN;

CREATE OR REPLACE FUNCTION public.account_deletion_targets()
RETURNS TABLE(table_name text, owner_column text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 VALUES ('favorites','user_id'), ('progress','user_id'),
        ('book_progress','user_id'), ('book_task_progress','user_id'),
        ('exam_task_progress','user_id'), ('semester_subjects','user_id'),
        ('profiles','id')
 UNION ALL
 SELECT 'calendar_events','user_id' WHERE EXISTS (
   SELECT 1 FROM pg_catalog.pg_attribute
   WHERE attrelid = pg_catalog.to_regclass('public.calendar_events')
     AND attname = 'user_id' AND NOT attisdropped
 );
$$;
REVOKE ALL ON FUNCTION public.account_deletion_targets() FROM PUBLIC, anon, authenticated;

-- Explicit classification, not an inference from SET NULL. Every addition
-- requires review of the table's content/ownership and regression coverage.
CREATE OR REPLACE FUNCTION public.account_deletion_shared_attribution()
RETURNS TABLE(schema_name text, table_name text, column_name text)
LANGUAGE sql IMMUTABLE SECURITY DEFINER SET search_path = '' AS $$
 VALUES ('public', 'notes', 'created_by');
$$;
REVOKE ALL ON FUNCTION public.account_deletion_shared_attribution() FROM PUBLIC, anon, authenticated;

-- Transaction-local in effect: successful checks delete their own rows and any
-- failed deletion rolls back its insert. Not an erasure history or public API.
CREATE SCHEMA IF NOT EXISTS account_deletion_internal;
REVOKE ALL ON SCHEMA account_deletion_internal FROM PUBLIC, anon, authenticated, service_role;
CREATE TABLE IF NOT EXISTS account_deletion_internal.pending_checks (
 user_id uuid NOT NULL,
 transaction_id bigint NOT NULL DEFAULT txid_current(),
 PRIMARY KEY (user_id, transaction_id)
);
REVOKE ALL ON TABLE account_deletion_internal.pending_checks FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.account_deletion_preflight(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE target record; rel oid; owner_att smallint; trigger_ready boolean;
BEGIN
 IF p_user_id IS NULL THEN RAISE EXCEPTION 'ACCOUNT_SCHEMA_REVIEW'; END IF;
 SELECT EXISTS (SELECT 1 FROM pg_catalog.pg_trigger
   WHERE tgrelid = 'auth.users'::regclass AND tgname = 'delete_account_personal_data'
     AND tgfoid = 'public.delete_account_personal_data()'::regprocedure
     AND tgtype = 11 AND tgenabled = 'O' AND NOT tgisinternal) INTO trigger_ready;
 IF NOT trigger_ready THEN RAISE EXCEPTION 'ACCOUNT_SCHEMA_REVIEW'; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_trigger
   WHERE tgrelid = 'account_deletion_internal.pending_checks'::regclass
     AND tgname = 'assert_account_deletion_complete' AND tgtype = 5
     AND tgfoid = 'account_deletion_internal.assert_account_deletion_complete()'::regprocedure
     AND tgdeferrable AND tginitdeferred AND tgenabled = 'O')
 THEN RAISE EXCEPTION 'ACCOUNT_SCHEMA_REVIEW'; END IF;

 FOR target IN SELECT * FROM public.account_deletion_targets() LOOP
   rel := pg_catalog.to_regclass('public.' || target.table_name);
   SELECT attnum INTO owner_att FROM pg_catalog.pg_attribute
     WHERE attrelid = rel AND attname = target.owner_column
       AND atttypid = 'uuid'::regtype AND NOT attisdropped;
   IF rel IS NULL OR owner_att IS NULL OR NOT EXISTS (
     SELECT 1 FROM pg_catalog.pg_constraint c
     JOIN pg_catalog.pg_attribute dest ON dest.attrelid = c.confrelid AND dest.attnum = c.confkey[1]
     WHERE c.contype = 'f' AND c.conrelid = rel AND c.conkey = ARRAY[owner_att]
       AND cardinality(c.confkey) = 1 AND dest.attname = 'id' AND c.convalidated
       AND (c.confrelid = 'auth.users'::regclass
         OR (target.table_name <> 'profiles' AND c.confrelid = 'public.profiles'::regclass))
   ) THEN RAISE EXCEPTION 'ACCOUNT_SCHEMA_REVIEW'; END IF;
 END LOOP;

 -- Fail closed for unreviewed cascading dependencies. Shared attribution may
 -- only be detached for explicitly classified fields through a validated,
 -- nullable single-column ON DELETE SET NULL FK to the parent's id.
 IF EXISTS (
   SELECT 1 FROM pg_catalog.pg_constraint c
   JOIN pg_catalog.pg_class child ON child.oid = c.conrelid
   JOIN pg_catalog.pg_namespace ns ON ns.oid = child.relnamespace
   WHERE c.contype = 'f' AND ns.nspname NOT IN ('auth','storage')
     AND (c.confrelid = 'auth.users'::regclass OR c.confrelid IN (
       SELECT pg_catalog.to_regclass('public.' || t.table_name) FROM public.account_deletion_targets() t))
     AND NOT (
       ns.nspname = 'public' AND EXISTS (
         SELECT 1 FROM public.account_deletion_targets() t
         JOIN pg_catalog.pg_attribute a ON a.attrelid = c.conrelid AND a.attname = t.owner_column
         WHERE t.table_name = child.relname AND c.conkey = ARRAY[a.attnum]
           AND c.confrelid IN ('auth.users'::regclass,'public.profiles'::regclass)
           AND cardinality(c.confkey) = 1 AND c.convalidated
           AND EXISTS (SELECT 1 FROM pg_catalog.pg_attribute dest
             WHERE dest.attrelid = c.confrelid AND dest.attnum = c.confkey[1] AND dest.attname = 'id')
       )
     )
     AND NOT (c.confdeltype = 'n' AND c.convalidated AND cardinality(c.conkey) = 1 AND cardinality(c.confkey) = 1
       AND c.confrelid IN ('auth.users'::regclass,'public.profiles'::regclass)
       AND EXISTS (SELECT 1 FROM public.account_deletion_shared_attribution() shared
         JOIN pg_catalog.pg_attribute a ON a.attrelid = c.conrelid AND a.attname = shared.column_name
         WHERE shared.schema_name = ns.nspname AND shared.table_name = child.relname AND c.conkey = ARRAY[a.attnum])
       AND EXISTS (SELECT 1 FROM pg_catalog.pg_attribute dest
         WHERE dest.attrelid = c.confrelid AND dest.attnum = c.confkey[1] AND dest.attname = 'id')
       AND NOT EXISTS (SELECT 1 FROM pg_catalog.pg_attribute a
         WHERE a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey) AND a.attnotnull))
 ) THEN RAISE EXCEPTION 'ACCOUNT_SCHEMA_REVIEW'; END IF;

 -- Detect owner-like fields not covered by the manifest or a reviewed SET NULL
 -- attribution FK. The manual inventory must also inspect email/free-text data.
 IF EXISTS (
   SELECT 1 FROM pg_catalog.pg_attribute a
   JOIN pg_catalog.pg_class r ON r.oid = a.attrelid
   JOIN pg_catalog.pg_namespace n ON n.oid = r.relnamespace
   WHERE n.nspname = 'public' AND r.relkind IN ('r','p') AND NOT a.attisdropped
     AND a.attname IN ('user_id','owner_id','created_by','updated_by','uploaded_by')
     AND NOT EXISTS (SELECT 1 FROM public.account_deletion_targets() t
       WHERE t.table_name = r.relname AND t.owner_column = a.attname)
     AND NOT EXISTS (SELECT 1 FROM pg_catalog.pg_constraint c
       WHERE c.conrelid = r.oid AND c.contype = 'f' AND c.conkey = ARRAY[a.attnum]
         AND c.confrelid IN ('auth.users'::regclass,'public.profiles'::regclass)
         AND c.confdeltype = 'n' AND c.convalidated AND cardinality(c.confkey) = 1 AND NOT a.attnotnull
         AND EXISTS (SELECT 1 FROM public.account_deletion_shared_attribution() shared
           WHERE shared.schema_name = n.nspname AND shared.table_name = r.relname AND shared.column_name = a.attname)
         AND EXISTS (SELECT 1 FROM pg_catalog.pg_attribute dest
           WHERE dest.attrelid = c.confrelid AND dest.attnum = c.confkey[1] AND dest.attname = 'id'))
 ) THEN RAISE EXCEPTION 'ACCOUNT_SCHEMA_REVIEW'; END IF;

 -- Never delete shared uploads or edit Storage metadata. Ownership in any
 -- bucket requires operator review/reassignment using a supported procedure.
 IF EXISTS (SELECT 1 FROM storage.objects o
   WHERE to_jsonb(o)->>'owner_id' = p_user_id::text OR to_jsonb(o)->>'owner' = p_user_id::text)
 OR EXISTS (SELECT 1 FROM storage.buckets b
   WHERE to_jsonb(b)->>'owner_id' = p_user_id::text OR to_jsonb(b)->>'owner' = p_user_id::text)
 THEN RAISE EXCEPTION 'ACCOUNT_STORAGE_OWNERSHIP'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.account_deletion_preflight(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.account_deletion_preflight(uuid) TO service_role;

CREATE OR REPLACE FUNCTION account_deletion_internal.assert_account_deletion_complete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE target record; remaining boolean;
BEGIN
 IF EXISTS (SELECT 1 FROM auth.users WHERE id = NEW.user_id) THEN
   RAISE EXCEPTION 'ACCOUNT_DELETION_INCOMPLETE';
 END IF;
 FOR target IN SELECT * FROM public.account_deletion_targets() LOOP
   EXECUTE format('SELECT EXISTS (SELECT 1 FROM public.%I WHERE %I = $1)', target.table_name, target.owner_column)
     INTO remaining USING NEW.user_id;
   IF remaining THEN RAISE EXCEPTION 'ACCOUNT_DELETION_INCOMPLETE'; END IF;
 END LOOP;
 DELETE FROM account_deletion_internal.pending_checks
   WHERE user_id = NEW.user_id AND transaction_id = NEW.transaction_id;
 RETURN NULL;
END $$;
REVOKE ALL ON FUNCTION account_deletion_internal.assert_account_deletion_complete() FROM PUBLIC, anon, authenticated, service_role;
DROP TRIGGER IF EXISTS assert_account_deletion_complete ON account_deletion_internal.pending_checks;
CREATE CONSTRAINT TRIGGER assert_account_deletion_complete
AFTER INSERT ON account_deletion_internal.pending_checks
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW
EXECUTE FUNCTION account_deletion_internal.assert_account_deletion_complete();

CREATE OR REPLACE FUNCTION public.delete_account_personal_data()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE target record; expected bigint; removed bigint; remaining boolean;
BEGIN
 -- Recheck inside the deletion transaction: preflight RPC is not a transaction
 -- spanning the subsequent Auth API call. Any failure rolls back Auth + data.
 PERFORM public.account_deletion_preflight(OLD.id);
 INSERT INTO account_deletion_internal.pending_checks(user_id) VALUES (OLD.id)
 ON CONFLICT DO NOTHING;
 FOR target IN SELECT * FROM public.account_deletion_targets()
   ORDER BY (table_name = 'profiles'), table_name LOOP
   EXECUTE format('SELECT count(*) FROM (SELECT 1 FROM public.%I WHERE %I = $1 FOR UPDATE) locked_rows', target.table_name, target.owner_column)
     INTO expected USING OLD.id;
   EXECUTE format('DELETE FROM public.%I WHERE %I = $1', target.table_name, target.owner_column) USING OLD.id;
   GET DIAGNOSTICS removed = ROW_COUNT;
   IF removed <> expected THEN RAISE EXCEPTION 'ACCOUNT_DELETION_INCOMPLETE'; END IF;
 END LOOP;
 -- A later cleanup trigger may recreate rows in a table already visited.
 FOR target IN SELECT * FROM public.account_deletion_targets() LOOP
   EXECUTE format('SELECT EXISTS (SELECT 1 FROM public.%I WHERE %I = $1)', target.table_name, target.owner_column)
     INTO remaining USING OLD.id;
   IF remaining THEN RAISE EXCEPTION 'ACCOUNT_DELETION_INCOMPLETE'; END IF;
 END LOOP;
 RETURN OLD;
END $$;
REVOKE ALL ON FUNCTION public.delete_account_personal_data() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS delete_account_personal_data ON auth.users;
CREATE TRIGGER delete_account_personal_data BEFORE DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.delete_account_personal_data();
COMMIT;
