BEGIN;
ALTER TABLE public.note_folders ADD COLUMN IF NOT EXISTS sort_order integer;
ALTER TABLE public.note_folders ADD COLUMN IF NOT EXISTS color_index integer;
-- Preserve the sidebar's existing creation-order palette, independently of sorting.
WITH colors AS (
 SELECT id, ((row_number() OVER (PARTITION BY subject_id ORDER BY created_at, id) - 1) % 5)::integer AS tone
 FROM public.note_folders
)
UPDATE public.note_folders f SET color_index = colors.tone FROM colors
WHERE f.id = colors.id AND f.color_index IS NULL;
ALTER TABLE public.note_folders ALTER COLUMN color_index SET DEFAULT floor(random() * 5)::integer;
ALTER TABLE public.note_folders ALTER COLUMN color_index SET NOT NULL;

CREATE OR REPLACE FUNCTION public.reorder_note_folders(p_subject_id text, p_folder_ids uuid[])
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp AS $$
DECLARE expected integer; changed integer;
BEGIN
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
