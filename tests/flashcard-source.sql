-- Run only in a disposable local database.
\set ON_ERROR_STOP on
CREATE TABLE notes (id uuid PRIMARY KEY);
CREATE TABLE flashcards (id int PRIMARY KEY, question text NOT NULL);
INSERT INTO notes VALUES ('00000000-0000-0000-0000-000000000001');
INSERT INTO flashcards VALUES (1, 'Existing card');
\ir ../database/migrations/20261012_flashcard_source_note.sql
\ir ../database/migrations/20261012_flashcard_source_note.sql
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM flashcards WHERE id=1 AND question='Existing card' AND note_id IS NULL) THEN RAISE EXCEPTION 'Existing card changed'; END IF;
 BEGIN
  INSERT INTO flashcards VALUES (2, 'Invalid source', '00000000-0000-0000-0000-000000000002');
  RAISE EXCEPTION 'Invalid source accepted';
 EXCEPTION WHEN foreign_key_violation THEN NULL;
 END;
END $$;
INSERT INTO flashcards VALUES (3, 'New card', '00000000-0000-0000-0000-000000000001');
DELETE FROM notes;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM flashcards WHERE id=3 AND note_id IS NULL) THEN RAISE EXCEPTION 'Card lost on source deletion'; END IF;
END $$;
SELECT 'PASS: migration preserves existing cards, validates sources and keeps cards on note deletion';
