-- Requires 20261013_note_folder_order.sql and 20261013_note_folder_admin.sql.
-- Adds nested folders. Existing folders get parent_id NULL (top level) and keep
-- their notes, names, colours and sort order. Nothing is dropped or rewritten.
BEGIN;

ALTER TABLE public.note_folders
 ADD COLUMN IF NOT EXISTS parent_id uuid NULL REFERENCES public.note_folders(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS note_folders_parent_id_idx ON public.note_folders (parent_id);

-- Structural guard for every writer, including roles that bypass RLS:
-- same subject, never itself, never one of its own descendants.
CREATE OR REPLACE FUNCTION public.validate_note_folder_parent()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE parent_subject text;
BEGIN
 IF NEW.parent_id IS NULL THEN
   RETURN NEW;
 END IF;
 IF TG_OP = 'UPDATE' AND NEW.parent_id IS NOT DISTINCT FROM OLD.parent_id
    AND NEW.subject_id IS NOT DISTINCT FROM OLD.subject_id THEN
   RETURN NEW;
 END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('folder-tree:' || NEW.subject_id::text, 0));
 IF NEW.parent_id = NEW.id THEN
   RAISE EXCEPTION 'A folder cannot be placed inside itself' USING ERRCODE = '23514';
 END IF;
 SELECT f.subject_id::text INTO parent_subject FROM public.note_folders f WHERE f.id = NEW.parent_id;
 IF parent_subject IS NULL THEN
   RAISE EXCEPTION 'Parent folder does not exist' USING ERRCODE = '23503';
 END IF;
 IF parent_subject <> NEW.subject_id::text THEN
   RAISE EXCEPTION 'Parent folder belongs to another subject' USING ERRCODE = '23514';
 END IF;
 IF EXISTS (
   WITH RECURSIVE ancestors(id, parent_id) AS (
     SELECT f.id, f.parent_id FROM public.note_folders f WHERE f.id = NEW.parent_id
     UNION
     SELECT f.id, f.parent_id FROM public.note_folders f JOIN ancestors a ON f.id = a.parent_id
   )
   SELECT 1 FROM ancestors WHERE id = NEW.id
 ) THEN
   RAISE EXCEPTION 'A folder cannot be moved into one of its own subfolders' USING ERRCODE = '23514';
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.validate_note_folder_parent() FROM PUBLIC;
DROP TRIGGER IF EXISTS validate_note_folder_parent ON public.note_folders;
CREATE TRIGGER validate_note_folder_parent BEFORE INSERT OR UPDATE OF parent_id, subject_id ON public.note_folders
FOR EACH ROW EXECUTE FUNCTION public.validate_note_folder_parent();

-- Deleting a folder never deletes content: direct subfolders and notes move up one
-- level (to the parent folder, or to the top level when the folder was top level).
CREATE OR REPLACE FUNCTION public.delete_note_folder(p_folder_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp AS $$
DECLARE target public.note_folders%ROWTYPE;
BEGIN
 IF NOT public.can_manage_note_folders() THEN
   RAISE EXCEPTION 'Only admins may delete shared folders' USING ERRCODE = '42501';
 END IF;
 SELECT * INTO target FROM public.note_folders WHERE id = p_folder_id FOR UPDATE;
 IF NOT FOUND THEN
   RETURN;
 END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('folder-tree:' || target.subject_id::text, 0));
 UPDATE public.note_folders SET parent_id = target.parent_id WHERE parent_id = target.id;
 UPDATE public.notes SET folder_id = target.parent_id WHERE folder_id = target.id;
 DELETE FROM public.note_folders WHERE id = target.id;
END $$;
REVOKE ALL ON FUNCTION public.delete_note_folder(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_note_folder(uuid) TO authenticated;

-- Same signature as before, so existing clients keep working. Drag-sorting only
-- orders top-level folders; subfolders keep their own sort_order.
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
 SELECT count(*) INTO expected FROM public.note_folders
 WHERE subject_id::text = p_subject_id AND parent_id IS NULL;
 IF expected <> cardinality(p_folder_ids) OR EXISTS (
   SELECT 1 FROM unnest(p_folder_ids) AS ids(id) WHERE NOT EXISTS (
     SELECT 1 FROM public.note_folders f
     WHERE f.id = ids.id AND f.subject_id::text = p_subject_id AND f.parent_id IS NULL
   )
 ) THEN RAISE EXCEPTION 'Folder list changed; reload before reordering'; END IF;
 UPDATE public.note_folders f SET sort_order = position.ordinality - 1
 FROM unnest(p_folder_ids) WITH ORDINALITY AS position(id, ordinality)
 WHERE f.id = position.id AND f.subject_id::text = p_subject_id AND f.parent_id IS NULL;
 GET DIAGNOSTICS changed = ROW_COUNT;
 IF changed <> expected THEN RAISE EXCEPTION 'Not all folders could be reordered'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.reorder_note_folders(text, uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reorder_note_folders(text, uuid[]) TO authenticated;

COMMIT;
