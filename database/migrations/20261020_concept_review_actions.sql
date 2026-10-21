-- Run manually after 20261013_note_folder_admin.sql. No existing data is changed.
BEGIN;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_subtopics ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE t text; op text; BEGIN
 FOREACH t IN ARRAY ARRAY['concepts','concept_subtopics'] LOOP
  FOREACH op IN ARRAY ARRAY['INSERT','UPDATE','DELETE'] LOOP
   EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_review_' || lower(op), t);
   EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR %s TO anon, authenticated %s',
     t || '_review_' || lower(op), t, op,
     CASE WHEN op = 'INSERT' THEN 'WITH CHECK (public.can_manage_note_folders())'
          WHEN op = 'UPDATE' THEN 'USING (public.can_manage_note_folders()) WITH CHECK (public.can_manage_note_folders())'
          ELSE 'USING (public.can_manage_note_folders())' END);
  END LOOP;
 END LOOP;
END $$;

-- Applies to direct DELETE as well as the reviewed RPC. Fail closed on references
-- outside the one join table whose cleanup we understand. Never rewrite notes.
CREATE OR REPLACE FUNCTION public.guard_concept_review_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE ref record; linked boolean;
BEGIN
 IF NOT public.can_manage_note_folders() THEN RAISE EXCEPTION 'Admin required' USING ERRCODE = '42501'; END IF;
 LOCK TABLE public.notes IN SHARE ROW EXCLUSIVE MODE;
 IF EXISTS (SELECT 1 FROM public.notes n WHERE
   strpos(to_jsonb(n)::text, OLD.id::text) > 0 OR
   (nullif(OLD.slug, '') IS NOT NULL AND strpos(to_jsonb(n)::text, '/concepts/' || OLD.slug) > 0)) THEN
   RAISE EXCEPTION 'Begrepet refereres fra notatdata og kan ikke slettes uten å endre notatet.';
 END IF;
 FOR ref IN SELECT c.conrelid::regclass AS relation, a.attname AS column_name, cardinality(c.conkey) AS keys, target.attname AS target_column
   FROM pg_catalog.pg_constraint c
   JOIN pg_catalog.pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
   JOIN pg_catalog.pg_attribute target ON target.attrelid = c.confrelid AND target.attnum = c.confkey[1]
   WHERE c.contype = 'f' AND c.confrelid = 'public.concepts'::regclass
     AND NOT (c.conrelid = 'public.concept_subtopics'::regclass AND a.attname = 'concept_id')
 LOOP
   IF ref.keys <> 1 THEN RAISE EXCEPTION 'Ukjent sammensatt begrepsreferanse; sletting stoppet.'; END IF;
   EXECUTE format('SELECT EXISTS (SELECT 1 FROM %s WHERE %I::text = $1)', ref.relation, ref.column_name)
     INTO linked USING to_jsonb(OLD)->>ref.target_column;
   IF linked THEN RAISE EXCEPTION 'Begrepet har andre referanser; sletting stoppet.'; END IF;
 END LOOP;
 DELETE FROM public.concept_subtopics WHERE concept_id::text = OLD.id::text;
 RETURN OLD;
END $$;
REVOKE ALL ON FUNCTION public.guard_concept_review_delete() FROM PUBLIC;
DROP TRIGGER IF EXISTS concept_review_delete_guard ON public.concepts;
CREATE TRIGGER concept_review_delete_guard BEFORE DELETE ON public.concepts
 FOR EACH ROW EXECUTE FUNCTION public.guard_concept_review_delete();

CREATE OR REPLACE FUNCTION public.review_concept_action(p_id text, p_expected jsonb, p_action text, p_values jsonb DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE current_row public.concepts%ROWTYPE;
BEGIN
 IF NOT public.can_manage_note_folders() THEN RAISE EXCEPTION 'Admin required' USING ERRCODE = '42501'; END IF;
 IF p_action NOT IN ('edit','delete') OR p_action IS NULL THEN RAISE EXCEPTION 'Invalid action'; END IF;
 SELECT * INTO current_row FROM public.concepts WHERE id::text = p_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Begrepet finnes ikke lenger. Last gjennomgangen på nytt.'; END IF;
 IF p_expected IS DISTINCT FROM jsonb_build_object('name',current_row.name,'shortDefinition',current_row.short_definition,'explanation',current_row.explanation) THEN
  RAISE EXCEPTION 'Begrepet er endret siden gjennomgangen ble lastet. Last på nytt før du fortsetter.';
 END IF;
 IF p_action = 'delete' THEN
  DELETE FROM public.concepts WHERE id = current_row.id;
 ELSE
  IF jsonb_typeof(p_values->'name') IS DISTINCT FROM 'string'
    OR jsonb_typeof(p_values->'shortDefinition') IS DISTINCT FROM 'string'
    OR jsonb_typeof(p_values->'explanation') IS DISTINCT FROM 'string'
    OR length(btrim(p_values->>'name')) NOT BETWEEN 1 AND 300
    OR length(btrim(p_values->>'shortDefinition')) NOT BETWEEN 1 AND 10000
    OR length(p_values->>'explanation') > 50000 THEN RAISE EXCEPTION 'Ugyldige tekstfelt'; END IF;
  IF EXISTS (SELECT 1 FROM public.concepts WHERE id <> current_row.id AND lower(btrim(name)) = lower(btrim(p_values->>'name'))) THEN
   RAISE EXCEPTION 'Et annet begrep har allerede dette navnet. Ingen sammenslåing utføres.';
  END IF;
  UPDATE public.concepts SET name=btrim(p_values->>'name'), short_definition=btrim(p_values->>'shortDefinition'),
    explanation=p_values->>'explanation' WHERE id=current_row.id;
 END IF;
END $$;
REVOKE ALL ON FUNCTION public.review_concept_action(text,jsonb,text,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_concept_action(text,jsonb,text,jsonb) TO authenticated;
COMMIT;
