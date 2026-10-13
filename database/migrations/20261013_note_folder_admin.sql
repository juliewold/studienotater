-- Run after 20261013_note_folder_order.sql. Preserve all SELECT policies/data.
BEGIN;
CREATE OR REPLACE FUNCTION public.can_manage_note_folders()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;
REVOKE ALL ON FUNCTION public.can_manage_note_folders() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_manage_note_folders() TO anon, authenticated;

-- The profile role is our authority, so clients must not be able to promote
-- themselves by editing/inserting profiles (even under permissive legacy RLS).
CREATE OR REPLACE FUNCTION public.protect_profile_admin_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 IF (TG_OP = 'INSERT' AND NEW.role::text = 'admin') OR
    (TG_OP = 'UPDATE' AND (NEW.role IS DISTINCT FROM OLD.role OR NEW.id IS DISTINCT FROM OLD.id)) THEN
   IF current_setting('role', true) IN ('anon', 'authenticated')
      AND NOT public.can_manage_note_folders() THEN
     RAISE EXCEPTION 'Only admins may change profile roles or identities' USING ERRCODE = '42501';
   END IF;
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.protect_profile_admin_role() FROM PUBLIC;
DROP TRIGGER IF EXISTS protect_profile_admin_role ON public.profiles;
CREATE TRIGGER protect_profile_admin_role BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_admin_role();

ALTER TABLE public.note_folders ENABLE ROW LEVEL SECURITY;
-- Restrictive policies AND with every existing permissive policy, including ALL.
DROP POLICY IF EXISTS note_folders_admin_insert_guard ON public.note_folders;
CREATE POLICY note_folders_admin_insert_guard ON public.note_folders AS RESTRICTIVE
 FOR INSERT TO anon, authenticated WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS note_folders_admin_update_guard ON public.note_folders;
CREATE POLICY note_folders_admin_update_guard ON public.note_folders AS RESTRICTIVE
 FOR UPDATE TO anon, authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS note_folders_admin_delete_guard ON public.note_folders;
CREATE POLICY note_folders_admin_delete_guard ON public.note_folders AS RESTRICTIVE
 FOR DELETE TO anon, authenticated USING (public.can_manage_note_folders());
-- Permit admin writes without widening SELECT access or table grants.
DROP POLICY IF EXISTS note_folders_admin_insert ON public.note_folders;
CREATE POLICY note_folders_admin_insert ON public.note_folders FOR INSERT TO authenticated WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS note_folders_admin_update ON public.note_folders;
CREATE POLICY note_folders_admin_update ON public.note_folders FOR UPDATE TO authenticated USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders());
DROP POLICY IF EXISTS note_folders_admin_delete ON public.note_folders;
CREATE POLICY note_folders_admin_delete ON public.note_folders FOR DELETE TO authenticated USING (public.can_manage_note_folders());

CREATE OR REPLACE FUNCTION public.reorder_note_folders(p_subject_id text, p_folder_ids uuid[])
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp AS $$
DECLARE expected integer; changed integer;
BEGIN
 IF NOT public.can_manage_note_folders() THEN
   RAISE EXCEPTION 'Only admins may reorder shared folders' USING ERRCODE = '42501';
 END IF;
 IF p_folder_ids IS NULL OR array_position(p_folder_ids, NULL) IS NOT NULL
 OR cardinality(p_folder_ids) <> (SELECT count(DISTINCT id) FROM unnest(p_folder_ids) AS ids(id)) THEN
   RAISE EXCEPTION 'Invalid folder order';
 END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('folder-order:' || p_subject_id, 0));
 PERFORM id FROM public.note_folders WHERE subject_id::text = p_subject_id ORDER BY id FOR UPDATE;
 SELECT count(*) INTO expected FROM public.note_folders WHERE subject_id::text = p_subject_id;
 IF expected <> cardinality(p_folder_ids) OR EXISTS (
   SELECT 1 FROM unnest(p_folder_ids) AS ids(id) WHERE NOT EXISTS (
     SELECT 1 FROM public.note_folders f WHERE f.id = ids.id AND f.subject_id::text = p_subject_id
   )
 ) THEN RAISE EXCEPTION 'Folder list changed; reload before reordering'; END IF;
 UPDATE public.note_folders f SET sort_order = position.ordinality - 1
 FROM unnest(p_folder_ids) WITH ORDINALITY AS position(id, ordinality)
 WHERE f.id = position.id AND f.subject_id::text = p_subject_id;
 GET DIAGNOSTICS changed = ROW_COUNT;
 IF changed <> expected THEN RAISE EXCEPTION 'Not all folders could be reordered'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.reorder_note_folders(text, uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reorder_note_folders(text, uuid[]) TO authenticated;
COMMIT;
