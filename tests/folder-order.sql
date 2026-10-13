-- Run only in an empty disposable PostgreSQL database.
\set ON_ERROR_STOP on
CREATE TABLE note_folders(id uuid PRIMARY KEY, subject_id text, name text, created_at timestamptz);
INSERT INTO note_folders VALUES
 ('00000000-0000-0000-0000-000000000001','subject','B','2026-01-01'),
 ('00000000-0000-0000-0000-000000000002','subject','A','2026-01-02'),
 ('00000000-0000-0000-0000-000000000003','other','Private','2026-01-03');
\ir ../database/migrations/20261013_note_folder_order.sql
SELECT reorder_note_folders('subject', ARRAY['00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001']::uuid[]);
\ir ../database/migrations/20261013_note_folder_order.sql
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM note_folders WHERE name='B' AND sort_order=1 AND color_index=0)
 OR NOT EXISTS (SELECT 1 FROM note_folders WHERE name='A' AND sort_order=0 AND color_index=1) THEN
 RAISE EXCEPTION 'Order or palette lost'; END IF;
 BEGIN
  PERFORM reorder_note_folders('subject', ARRAY['00000000-0000-0000-0000-000000000001']::uuid[]);
  RAISE EXCEPTION 'Accepted incomplete list';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Accepted incomplete list' THEN RAISE; END IF; END;
 BEGIN
  PERFORM reorder_note_folders('subject', ARRAY['00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003']::uuid[]);
  RAISE EXCEPTION 'Accepted foreign folder';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Accepted foreign folder' THEN RAISE; END IF; END;
 BEGIN
  PERFORM reorder_note_folders('subject', ARRAY['00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001']::uuid[]);
  RAISE EXCEPTION 'Accepted duplicate';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Accepted duplicate' THEN RAISE; END IF; END;
END $$;
GRANT SELECT, UPDATE ON note_folders TO authenticated;
ALTER TABLE note_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY read_folders ON note_folders FOR SELECT TO authenticated USING(subject_id='subject');
CREATE POLICY update_folders ON note_folders FOR UPDATE TO authenticated USING(name='A') WITH CHECK (name='A');
SET ROLE authenticated;
DO $$ BEGIN
 BEGIN
  PERFORM reorder_note_folders('subject', ARRAY['00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002']::uuid[]);
  RAISE EXCEPTION 'Accepted partial RLS update';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Accepted partial RLS update' THEN RAISE; END IF; END;
 IF NOT EXISTS (SELECT 1 FROM note_folders WHERE name='A' AND sort_order=0) THEN RAISE EXCEPTION 'Partial update was not rolled back'; END IF;
END $$;
RESET ROLE;
SELECT 'PASS: persistent order, stable palette, reruns, invalid lists and atomic RLS rollback';
