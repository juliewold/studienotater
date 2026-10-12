-- Run in Supabase before deploying the frontend. SECURITY INVOKER preserves RLS.
-- No existing rows, tables, policies or grants on tables are changed.
BEGIN;
CREATE OR REPLACE FUNCTION public.complete_subject_structure(
  p_subject_id text, p_plan jsonb, p_note_ids jsonb
) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp AS $$
DECLARE
  t jsonb; s jsonb; n jsonb;
  topic_row public.topics%ROWTYPE;
  subtopic_row public.subtopics%ROWTYPE;
  note_row public.notes%ROWTYPE;
  topic_name text; subtopic_name text;
  topics_created integer := 0; subtopics_created integer := 0;
  notes_organized integer := 0; notes_skipped integer := 0;
  reused_topics text[] := '{}'; reused_subtopics text[] := '{}';
  created_topics text[] := '{}'; created_subtopics text[] := '{}';
  handled_notes text[] := '{}';
BEGIN
  IF jsonb_typeof(p_plan->'topics') IS DISTINCT FROM 'array'
     OR jsonb_typeof(p_note_ids) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Invalid structure plan';
  END IF;
  -- Serializes concurrent AI completions for this subject. RLS still applies.
  PERFORM pg_advisory_xact_lock(hashtextextended('subject-structure:' || p_subject_id, 0));
  -- Lock notes before checking manual links. Normal editor updates acquire these
  -- same row locks; FK inserts into note_subtopics must also wait for them.
  PERFORM id FROM public.notes WHERE subject_id::text = p_subject_id
    AND p_note_ids ? id::text ORDER BY id FOR UPDATE;
  FOR n IN SELECT value FROM jsonb_array_elements(p_note_ids) LOOP
    IF jsonb_typeof(n) <> 'string' OR NOT EXISTS (
      SELECT 1 FROM public.notes WHERE id::text = n #>> '{}' AND subject_id::text = p_subject_id
    ) THEN RAISE EXCEPTION 'Unknown or inaccessible input note'; END IF;
  END LOOP;

  FOR t IN SELECT value FROM jsonb_array_elements(p_plan->'topics') LOOP
    IF jsonb_typeof(t->'name') IS DISTINCT FROM 'string' OR btrim(t->>'name') = ''
       OR jsonb_typeof(t->'subtopics') IS DISTINCT FROM 'array' THEN
      RAISE EXCEPTION 'Invalid topic';
    END IF;
    topic_name := lower(regexp_replace(normalize(btrim(t->>'name'), NFKC), '\s+', ' ', 'g'));
    IF t->>'id' IS NOT NULL THEN
      SELECT * INTO topic_row FROM public.topics WHERE id::text = t->>'id' AND subject_id::text = p_subject_id;
      IF NOT FOUND THEN RAISE EXCEPTION 'Unknown or inaccessible topic'; END IF;
    ELSE
      SELECT * INTO topic_row FROM public.topics WHERE subject_id::text = p_subject_id
        AND lower(regexp_replace(normalize(btrim(name), NFKC), '\s+', ' ', 'g')) = topic_name
        ORDER BY sort_order, id LIMIT 1;
      IF NOT FOUND THEN
        INSERT INTO public.topics(subject_id, name, sort_order)
          VALUES (p_subject_id, btrim(t->>'name'),
            (SELECT coalesce(max(sort_order), -1) + 1 FROM public.topics WHERE subject_id::text = p_subject_id))
          RETURNING * INTO topic_row;
        topics_created := topics_created + 1;
        created_topics := array_append(created_topics, topic_row.id::text);
      END IF;
    END IF;
    IF NOT topic_row.id::text = ANY(created_topics || reused_topics) THEN
      reused_topics := array_append(reused_topics, topic_row.id::text);
    END IF;

    FOR s IN SELECT value FROM jsonb_array_elements(t->'subtopics') LOOP
      IF jsonb_typeof(s->'name') IS DISTINCT FROM 'string' OR btrim(s->>'name') = ''
         OR jsonb_typeof(s->'noteIds') IS DISTINCT FROM 'array' THEN
        RAISE EXCEPTION 'Invalid subtopic';
      END IF;
      subtopic_name := lower(regexp_replace(normalize(btrim(s->>'name'), NFKC), '\s+', ' ', 'g'));
      IF s->>'id' IS NOT NULL THEN
        SELECT * INTO subtopic_row FROM public.subtopics WHERE id::text = s->>'id' AND topic_id = topic_row.id;
        IF NOT FOUND THEN RAISE EXCEPTION 'Unknown subtopic or wrong parent'; END IF;
      ELSE
        SELECT * INTO subtopic_row FROM public.subtopics WHERE topic_id = topic_row.id
          AND lower(regexp_replace(normalize(btrim(name), NFKC), '\s+', ' ', 'g')) = subtopic_name
          ORDER BY sort_order, id LIMIT 1;
        IF NOT FOUND THEN
          INSERT INTO public.subtopics(topic_id, name, sort_order)
            VALUES (topic_row.id, btrim(s->>'name'),
              (SELECT coalesce(max(sort_order), -1) + 1 FROM public.subtopics WHERE topic_id = topic_row.id))
            RETURNING * INTO subtopic_row;
          subtopics_created := subtopics_created + 1;
          created_subtopics := array_append(created_subtopics, subtopic_row.id::text);
        END IF;
      END IF;
      IF NOT subtopic_row.id::text = ANY(created_subtopics || reused_subtopics) THEN
        reused_subtopics := array_append(reused_subtopics, subtopic_row.id::text);
      END IF;

      FOR n IN SELECT value FROM jsonb_array_elements(s->'noteIds') LOOP
        IF jsonb_typeof(n) <> 'string' OR NOT p_note_ids ? (n #>> '{}') THEN
          RAISE EXCEPTION 'Plan includes a protected or unknown note';
        END IF;
        IF (n #>> '{}') = ANY(handled_notes) THEN RAISE EXCEPTION 'Duplicate note assignment'; END IF;
        handled_notes := array_append(handled_notes, n #>> '{}');
        SELECT * INTO STRICT note_row FROM public.notes WHERE id::text = n #>> '{}' AND subject_id::text = p_subject_id;
        IF note_row.subtopic_id IS NOT NULL OR EXISTS (
          SELECT 1 FROM public.note_subtopics WHERE note_id = note_row.id
        ) THEN
          notes_skipped := notes_skipped + 1;
          CONTINUE;
        END IF;
        UPDATE public.notes SET subtopic_id = subtopic_row.id
          WHERE id = note_row.id AND subtopic_id IS NULL;
        IF NOT FOUND THEN RAISE EXCEPTION 'Note placement not permitted'; END IF;
        INSERT INTO public.note_subtopics(note_id, subtopic_id) VALUES (note_row.id, subtopic_row.id);
        notes_organized := notes_organized + 1;
      END LOOP;
    END LOOP;
  END LOOP;
  IF cardinality(handled_notes) <> jsonb_array_length(p_note_ids) THEN
    RAISE EXCEPTION 'Plan omitted input notes';
  END IF;
  RETURN jsonb_build_object(
    'topicsCreated', topics_created, 'subtopicsCreated', subtopics_created,
    'topicsReused', cardinality(reused_topics), 'subtopicsReused', cardinality(reused_subtopics),
    'notesOrganized', notes_organized, 'notesSkipped', notes_skipped);
END;
$$;
REVOKE ALL ON FUNCTION public.complete_subject_structure(text, jsonb, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_subject_structure(text, jsonb, jsonb) TO authenticated;
COMMIT;
