-- Run ONLY in a disposable PostgreSQL database: creates a minimal fixture schema.
\set ON_ERROR_STOP on
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated; END IF; END $$;
CREATE TABLE topics (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subject_id text NOT NULL, name text NOT NULL, sort_order int);
CREATE TABLE subtopics (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), topic_id uuid REFERENCES topics(id), name text NOT NULL, sort_order int);
CREATE TABLE notes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subject_id text NOT NULL, subtopic_id uuid REFERENCES subtopics(id), content text DEFAULT 'manual content');
CREATE TABLE note_subtopics (note_id uuid REFERENCES notes(id), subtopic_id uuid REFERENCES subtopics(id), PRIMARY KEY(note_id, subtopic_id));
\ir ../database/migrations/20261012_complete_subject_structure.sql
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON topics, subtopics, notes, note_subtopics TO authenticated;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_subtopics ENABLE ROW LEVEL SECURITY;
CREATE POLICY topic_access ON topics TO authenticated USING (subject_id = 'subject') WITH CHECK (subject_id = 'subject');
CREATE POLICY subtopic_access ON subtopics TO authenticated USING (EXISTS (SELECT 1 FROM topics WHERE id = topic_id)) WITH CHECK (name <> 'Denied' AND EXISTS (SELECT 1 FROM topics WHERE id = topic_id));
CREATE POLICY note_access ON notes TO authenticated USING (subject_id = 'subject') WITH CHECK (subject_id = 'subject');
CREATE POLICY link_access ON note_subtopics TO authenticated USING (EXISTS (SELECT 1 FROM notes WHERE id = note_id)) WITH CHECK (note_id <> '00000000-0000-0000-0000-000000000014' AND EXISTS (SELECT 1 FROM notes WHERE id = note_id));
INSERT INTO topics(id,subject_id,name,sort_order) VALUES ('00000000-0000-0000-0000-000000000001','subject','Existing topic',7), ('00000000-0000-0000-0000-000000000002','other','Private',0);
INSERT INTO subtopics(id,topic_id,name,sort_order) VALUES ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','Existing subtopic',9);
INSERT INTO notes(id,subject_id) VALUES ('00000000-0000-0000-0000-000000000010','subject'), ('00000000-0000-0000-0000-000000000011','subject'), ('00000000-0000-0000-0000-000000000012','other'), ('00000000-0000-0000-0000-000000000013','subject'), ('00000000-0000-0000-0000-000000000014','subject');
-- Added by a user after the frontend's initial read: must be protected at save time.
INSERT INTO note_subtopics VALUES ('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000003');
UPDATE notes SET subtopic_id='00000000-0000-0000-0000-000000000003' WHERE id='00000000-0000-0000-0000-000000000013';
SET ROLE authenticated;
DO $$
DECLARE
  plan jsonb := '{"topics":[{"name":"  EXISTING   topic ","subtopics":[{"name":"existing subtopic","noteIds":["00000000-0000-0000-0000-000000000010","00000000-0000-0000-0000-000000000011","00000000-0000-0000-0000-000000000013"]},{"name":"New subtopic","noteIds":[]}]},{"name":"Existing topic","subtopics":[{"name":"New subtopic","noteIds":[]}]}]}';
  ids jsonb := '["00000000-0000-0000-0000-000000000010","00000000-0000-0000-0000-000000000011","00000000-0000-0000-0000-000000000013"]';
  result jsonb;
  before_count int;
BEGIN
  result := complete_subject_structure('subject',plan,ids);
  ASSERT result->>'topicsCreated' = '0' AND result->>'subtopicsCreated' = '1', result::text;
  ASSERT result->>'topicsReused' = '1' AND result->>'subtopicsReused' = '1', result::text;
  ASSERT result->>'notesOrganized' = '1' AND result->>'notesSkipped' = '2', result::text;
  ASSERT (SELECT subtopic_id IS NOT NULL FROM notes WHERE id='00000000-0000-0000-0000-000000000010');
  ASSERT (SELECT count(*)=1 FROM note_subtopics WHERE note_id='00000000-0000-0000-0000-000000000010');
  ASSERT (SELECT subtopic_id IS NULL FROM notes WHERE id='00000000-0000-0000-0000-000000000011');
  ASSERT (SELECT count(*)=0 FROM note_subtopics WHERE note_id='00000000-0000-0000-0000-000000000013');
  ASSERT (SELECT name='Existing topic' AND sort_order=7 FROM topics WHERE id='00000000-0000-0000-0000-000000000001');
  ASSERT NOT EXISTS (SELECT 1 FROM notes WHERE content <> 'manual content');
  result := complete_subject_structure('subject',plan,ids);
  ASSERT result->>'subtopicsCreated' = '0' AND result->>'notesOrganized' = '0' AND result->>'notesSkipped' = '3', result::text;
  -- ID reuse must not rename or move existing data even if AI changes the name.
  result := complete_subject_structure('subject','{"topics":[{"id":"00000000-0000-0000-0000-000000000001","name":"Renamed","subtopics":[{"id":"00000000-0000-0000-0000-000000000003","name":"Renamed","noteIds":[]}]}]}','[]');
  ASSERT (SELECT name='Existing subtopic' FROM subtopics WHERE id='00000000-0000-0000-0000-000000000003');
  SELECT count(*) INTO before_count FROM topics;
  BEGIN
    PERFORM complete_subject_structure('subject','{"topics":[{"name":"Rollback topic","subtopics":[{"name":"Denied","noteIds":[]}]}]}','[]');
    RAISE EXCEPTION 'Expected RLS failure';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  ASSERT (SELECT count(*) FROM topics)=before_count, 'Partial topic was not rolled back';
  BEGIN
    PERFORM complete_subject_structure('subject','{"topics":[{"name":"Rollback topic","subtopics":[]}]}',ids);
    RAISE EXCEPTION 'Expected omitted-note error';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Plan omitted input notes' THEN RAISE; END IF;
  END;
  ASSERT (SELECT count(*) FROM topics)=before_count;
  BEGIN
    PERFORM complete_subject_structure('subject',plan,'["00000000-0000-0000-0000-000000000012"]');
    RAISE EXCEPTION 'Expected ownership error';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Unknown or inaccessible input note' THEN RAISE; END IF;
  END;
  BEGIN
    PERFORM complete_subject_structure('subject','{"topics":[{"name":"Link rollback","subtopics":[{"name":"New","noteIds":["00000000-0000-0000-0000-000000000014"]}]}]}','["00000000-0000-0000-0000-000000000014"]');
    RAISE EXCEPTION 'Expected link RLS failure';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  ASSERT (SELECT count(*) FROM topics)=before_count;
  ASSERT (SELECT subtopic_id IS NULL FROM notes WHERE id='00000000-0000-0000-0000-000000000014'), 'Failed link left primary placement behind';
  RAISE NOTICE 'PASS: reuse, deduplication, manual links, primary placement, idempotency, RLS and rollback';
END $$;
RESET ROLE;
