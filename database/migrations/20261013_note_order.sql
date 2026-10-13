-- Requires shared-note and folder-admin migrations. No content/placement changes.
BEGIN;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS sort_order integer;
-- One-time initial order; runtime ordering uses only this saved value and ID ties.
WITH initial AS (
 SELECT id, (row_number() OVER (PARTITION BY subject_id, folder_id ORDER BY title, id) - 1)::integer AS position
 FROM public.notes
)
UPDATE public.notes n SET sort_order=initial.position FROM initial WHERE n.id=initial.id AND n.sort_order IS NULL;

CREATE OR REPLACE FUNCTION public.append_note_order()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp AS $$
BEGIN
 IF TG_OP = 'INSERT' OR NEW.folder_id IS DISTINCT FROM OLD.folder_id OR NEW.subject_id IS DISTINCT FROM OLD.subject_id THEN
   SELECT coalesce(max(sort_order), -1) + 1 INTO NEW.sort_order FROM public.notes
   WHERE subject_id=NEW.subject_id AND folder_id IS NOT DISTINCT FROM NEW.folder_id AND id <> NEW.id;
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.append_note_order() FROM PUBLIC;
DROP TRIGGER IF EXISTS append_note_order ON public.notes;
CREATE TRIGGER append_note_order BEFORE INSERT OR UPDATE OF folder_id, subject_id ON public.notes
FOR EACH ROW EXECUTE FUNCTION public.append_note_order();
ALTER TABLE public.notes ALTER COLUMN sort_order SET NOT NULL;

CREATE OR REPLACE FUNCTION public.reorder_notes(p_subject_id text, p_folder_id uuid, p_note_ids uuid[])
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp AS $$
DECLARE expected integer; changed integer;
BEGIN
 IF NOT public.can_manage_note_folders() THEN
   RAISE EXCEPTION 'Only admins may reorder shared notes' USING ERRCODE='42501';
 END IF;
 IF p_note_ids IS NULL OR array_position(p_note_ids,NULL) IS NOT NULL
 OR cardinality(p_note_ids) <> (SELECT count(DISTINCT id) FROM unnest(p_note_ids) ids(id)) THEN
   RAISE EXCEPTION 'Invalid note order';
 END IF;
 IF p_folder_id IS NOT NULL AND NOT EXISTS (
   SELECT 1 FROM public.note_folders WHERE id=p_folder_id AND subject_id::text=p_subject_id
 ) THEN RAISE EXCEPTION 'Unknown or inaccessible folder'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('note-order:' || p_subject_id,0));
 PERFORM id FROM public.notes WHERE subject_id::text=p_subject_id AND folder_id IS NOT DISTINCT FROM p_folder_id ORDER BY id FOR UPDATE;
 SELECT count(*) INTO expected FROM public.notes WHERE subject_id::text=p_subject_id AND folder_id IS NOT DISTINCT FROM p_folder_id;
 IF expected <> cardinality(p_note_ids) OR EXISTS (
   SELECT 1 FROM unnest(p_note_ids) ids(id) WHERE NOT EXISTS (
     SELECT 1 FROM public.notes n WHERE n.id=ids.id AND n.subject_id::text=p_subject_id AND n.folder_id IS NOT DISTINCT FROM p_folder_id
   )
 ) THEN RAISE EXCEPTION 'Note list changed; reload before reordering'; END IF;
 UPDATE public.notes n SET sort_order=position.ordinality-1
 FROM unnest(p_note_ids) WITH ORDINALITY position(id,ordinality)
 WHERE n.id=position.id AND n.subject_id::text=p_subject_id AND n.folder_id IS NOT DISTINCT FROM p_folder_id;
 GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed <> expected THEN RAISE EXCEPTION 'Not all notes could be reordered'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.reorder_notes(text,uuid,uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reorder_notes(text,uuid,uuid[]) TO authenticated;
COMMIT;
