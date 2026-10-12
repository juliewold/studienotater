-- Add provenance for new note-generated cards. Existing cards stay unchanged.
BEGIN;
ALTER TABLE public.flashcards
  ADD COLUMN IF NOT EXISTS note_id uuid REFERENCES public.notes(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS flashcards_note_id_idx ON public.flashcards(note_id);
COMMIT;
