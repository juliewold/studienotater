-- Testfixture for database/migrations/20261117_exam_task_notes.sql.
-- Kjør bare i en TOM testdatabase, aldri i Supabase:
--   psql -v ON_ERROR_STOP=1 -d <tom-testdatabase> -f tests/exam-task-notes.sql
-- Fixturen lager minimale versjoner av auth.uid(), profiles, exams, notes og
-- can_manage_note_folders() slik de finnes i Supabase. Migrasjonen kjøres to ganger for å
-- kontrollere at den kan kjøres på nytt.
\set ON_ERROR_STOP on

DROP SCHEMA IF EXISTS auth CASCADE;
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
END $$;

DROP TABLE IF EXISTS public.exam_task_notes, public.exams, public.notes, public.profiles CASCADE;
CREATE TABLE public.profiles (id uuid PRIMARY KEY, role text NOT NULL);
CREATE TABLE public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id text NOT NULL, title text NOT NULL, semester text NOT NULL, year int NOT NULL,
  relevant_tasks text[] NOT NULL DEFAULT '{}',
  exam_file_path text, solution_file_path text, my_solution_file_path text
);
CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id text NOT NULL, slug text NOT NULL, title text NOT NULL,
  content text NOT NULL DEFAULT '', content_json jsonb
);

-- Samme definisjon som i 20261013_note_folder_admin.sql.
CREATE OR REPLACE FUNCTION public.can_manage_note_folders()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- Supabase gir authenticated tabellrettigheter og begrenser dem med RLS. Fixturen gjør det samme.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exams, public.notes TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_note_folders() TO anon, authenticated;

\i database/migrations/20261117_exam_task_notes.sql
-- Migrasjonen skal kunne kjøres på nytt uten feil.
\i database/migrations/20261117_exam_task_notes.sql

INSERT INTO public.profiles VALUES
  ('00000000-0000-0000-0000-00000000000a', 'admin'),
  ('00000000-0000-0000-0000-00000000000b', 'student');

INSERT INTO public.exams (id, subject_id, title, semester, year, relevant_tasks, exam_file_path, solution_file_path, my_solution_file_path) VALUES
  ('00000000-0000-0000-0000-0000000000e1', 'tma4240', 'Eksamen august 2026', 'august', 2026, '{1a,1b}', 'pdf/e1-oppgave.pdf', 'pdf/e1-losning.pdf', 'pdf/e1-ipad.pdf'),
  ('00000000-0000-0000-0000-0000000000e2', 'tma4240', 'Eksamen desember 2025', 'desember', 2025, '{1a}', 'pdf/e2-oppgave.pdf', NULL, NULL),
  ('00000000-0000-0000-0000-0000000000e3', 'tdt4120', 'Eksamen mai 2026', 'mai', 2026, '{1a}', NULL, NULL, NULL);

INSERT INTO public.notes (id, subject_id, slug, title, content, content_json) VALUES
  ('00000000-0000-0000-0000-0000000000c1', 'tma4240', 'n1', 'Oppgave 1a august', '<p>Besvarelse n1</p>', '{"type":"doc"}'),
  ('00000000-0000-0000-0000-0000000000c2', 'tma4240', 'n2', 'Oppgave 1b august', '<p>Besvarelse n2</p>', NULL),
  ('00000000-0000-0000-0000-0000000000c3', 'tdt4120', 'n3', 'Oppgave 1a mai', '<p>Besvarelse n3</p>', NULL);

-- Øvrige rader skal ikke endres av kobling. Vi tar et øyeblikksbilde og sammenligner til slutt.
CREATE TEMP TABLE snapshot_before AS
  SELECT 'note' AS kind, id::text AS id, md5(content || coalesce(content_json::text, '')) AS fingerprint FROM public.notes
  UNION ALL
  SELECT 'exam', id::text, md5(coalesce(title,'') || coalesce(exam_file_path,'') || coalesce(solution_file_path,'') || coalesce(my_solution_file_path,'') || array_to_string(relevant_tasks, ','))
  FROM public.exams;

CREATE OR REPLACE FUNCTION pg_temp.expect_sqlstate(stmt text, expected text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE stmt;
  RAISE EXCEPTION 'Forventet feil %, men setningen lyktes: %', expected, stmt;
EXCEPTION WHEN OTHERS THEN
  IF SQLSTATE <> expected THEN
    RAISE EXCEPTION 'Forventet feil %, fikk % (%): %', expected, SQLSTATE, SQLERRM, stmt;
  END IF;
END $$;

-- 1. Administrator kobler et notat til en deloppgave.
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
SET ROLE authenticated;
INSERT INTO public.exam_task_notes (exam_id, task_label, note_id)
VALUES ('00000000-0000-0000-0000-0000000000e1', '1a', '00000000-0000-0000-0000-0000000000c1');
RESET ROLE;

-- 2. Samme notat kan ikke kobles til en annen deloppgave. Det gir ingen duplikat.
SET ROLE authenticated;
SELECT pg_temp.expect_sqlstate($q$INSERT INTO public.exam_task_notes (exam_id, task_label, note_id)
  VALUES ('00000000-0000-0000-0000-0000000000e1', '1b', '00000000-0000-0000-0000-0000000000c1')$q$, '23505');
RESET ROLE;

-- 3. Notat fra et annet fag kan ikke kobles til eksamenen.
SET ROLE authenticated;
SELECT pg_temp.expect_sqlstate($q$INSERT INTO public.exam_task_notes (exam_id, task_label, note_id)
  VALUES ('00000000-0000-0000-0000-0000000000e1', '1b', '00000000-0000-0000-0000-0000000000c3')$q$, '23514');
RESET ROLE;

-- 4. Bytte av notat på samme deloppgave (upsert) erstatter koblingen. Det gamle notatet blir ledig.
SET ROLE authenticated;
INSERT INTO public.exam_task_notes (exam_id, task_label, note_id)
VALUES ('00000000-0000-0000-0000-0000000000e1', '1a', '00000000-0000-0000-0000-0000000000c2')
ON CONFLICT (exam_id, task_label) DO UPDATE SET note_id = EXCLUDED.note_id;
RESET ROLE;
DO $$ BEGIN
  IF (SELECT note_id FROM public.exam_task_notes WHERE exam_id = '00000000-0000-0000-0000-0000000000e1' AND task_label = '1a')
     <> '00000000-0000-0000-0000-0000000000c2' THEN
    RAISE EXCEPTION 'Bytte av notat ble ikke lagret';
  END IF;
END $$;

-- 5. Det frigjorte notatet kan kobles til en oppgave i en annen eksamen (ingen dobbeltkobling).
SET ROLE authenticated;
INSERT INTO public.exam_task_notes (exam_id, task_label, note_id)
VALUES ('00000000-0000-0000-0000-0000000000e2', '1a', '00000000-0000-0000-0000-0000000000c1');
RESET ROLE;

-- 6. Vanlig student kan ikke skrive. Det avvises av RLS.
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
SET ROLE authenticated;
SELECT pg_temp.expect_sqlstate($q$INSERT INTO public.exam_task_notes (exam_id, task_label, note_id)
  VALUES ('00000000-0000-0000-0000-0000000000e3', '1a', '00000000-0000-0000-0000-0000000000c3')$q$, '42501');
RESET ROLE;

-- 7. Student kan ikke slette eller endre koblinger. Det påvirker ingen rader.
DO $$ DECLARE affected int; BEGIN
  SET LOCAL ROLE authenticated;
  DELETE FROM public.exam_task_notes WHERE exam_id = '00000000-0000-0000-0000-0000000000e1';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Student slettet % koblinger', affected; END IF;
  UPDATE public.exam_task_notes SET task_label = '9z' WHERE exam_id = '00000000-0000-0000-0000-0000000000e1';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Student endret % koblinger', affected; END IF;
  RESET ROLE;
END $$;

-- 8. Student kan lese koblingene.
SET ROLE authenticated;
DO $$ DECLARE seen int; BEGIN
  SELECT count(*) INTO seen FROM public.exam_task_notes;
  IF seen <> 2 THEN RAISE EXCEPTION 'Student ser % koblinger, forventet 2', seen; END IF;
END $$;
RESET ROLE;

-- 9. Uinnloggede (anon) får ikke lese koblingene.
SET ROLE anon;
SELECT pg_temp.expect_sqlstate('SELECT 1 FROM public.exam_task_notes', '42501');
RESET ROLE;

-- 10. Sletting av et notat fjerner bare koblingen. Eksamen og øvrige notater består.
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
SET ROLE authenticated;
DELETE FROM public.notes WHERE id = '00000000-0000-0000-0000-0000000000c2';
RESET ROLE;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM public.exam_task_notes WHERE note_id = '00000000-0000-0000-0000-0000000000c2') THEN
    RAISE EXCEPTION 'Kobling til slettet notat ble ikke fjernet';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.exams WHERE id = '00000000-0000-0000-0000-0000000000e1') THEN
    RAISE EXCEPTION 'Eksamen ble slettet sammen med notatet';
  END IF;
END $$;

-- 11. Sletting av en eksamen fjerner bare koblingene. Notatene består.
SET ROLE authenticated;
DELETE FROM public.exams WHERE id = '00000000-0000-0000-0000-0000000000e2';
RESET ROLE;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM public.exam_task_notes WHERE exam_id = '00000000-0000-0000-0000-0000000000e2') THEN
    RAISE EXCEPTION 'Koblinger til slettet eksamen ble ikke fjernet';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.notes WHERE id = '00000000-0000-0000-0000-0000000000c1') THEN
    RAISE EXCEPTION 'Notat ble slettet sammen med eksamenen';
  END IF;
END $$;

-- 12. Ingen eksisterende notat- eller eksamensdata er endret av koblingene.
-- Notatet c2 og eksamen e2 er slettet bewusst over, så de tas ut av sammenligningen.
DO $$ DECLARE mismatches int; BEGIN
  SELECT count(*) INTO mismatches
  FROM snapshot_before b
  LEFT JOIN (
    SELECT 'note' AS kind, id::text AS id, md5(content || coalesce(content_json::text, '')) AS fingerprint FROM public.notes
    UNION ALL
    SELECT 'exam', id::text, md5(coalesce(title,'') || coalesce(exam_file_path,'') || coalesce(solution_file_path,'') || coalesce(my_solution_file_path,'') || array_to_string(relevant_tasks, ','))
    FROM public.exams
  ) a ON a.kind = b.kind AND a.id = b.id
  WHERE a.id IS NULL AND b.id NOT IN ('00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000e2')
     OR (a.id IS NOT NULL AND a.fingerprint <> b.fingerprint);
  IF mismatches <> 0 THEN RAISE EXCEPTION 'Eksisterende data ble endret (% avvik)', mismatches; END IF;
END $$;

SELECT 'exam_task_notes-testene bestod' AS resultat;
