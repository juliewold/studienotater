-- Manual deployment only. Adds a deletion event log without user identifiers.
-- Installing this migration does not delete users, rows or files.
BEGIN;

CREATE TABLE IF NOT EXISTS public.account_deletion_log (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 created_at timestamptz NOT NULL DEFAULT now(),
 outcome text NOT NULL CHECK (outcome = 'ACCOUNT_DELETED')
);
ALTER TABLE public.account_deletion_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.account_deletion_log FROM PUBLIC, anon, authenticated;

-- Replaces the reviewed completion check. The only change is the final two
-- statements: a log row is written at COMMIT, after the Auth row is confirmed
-- gone, so a rolled-back or cancelled deletion is never logged. Rows older
-- than 90 days are removed in the same transaction.
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
 INSERT INTO public.account_deletion_log(outcome) VALUES ('ACCOUNT_DELETED');
 DELETE FROM public.account_deletion_log WHERE created_at < now() - interval '90 days';
 RETURN NULL;
END $$;
REVOKE ALL ON FUNCTION account_deletion_internal.assert_account_deletion_complete() FROM PUBLIC, anon, authenticated, service_role;

COMMIT;
