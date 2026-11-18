import { supabase } from "../../lib/supabase";

export type FlashcardSourceNote = {
  id: string;
  title: string;
  content: string;
  subtopicId: string | null;
  flashcardsContentHash: string | null;
};

export type CoveredNote = {
  noteId: string;
  contentHash: string;
};

/** SHA-256 of the note HTML. Equal hashes mean the flashcards already reflect this text. */
export async function hashNoteContent(content: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function getFlashcardSourceNotes(subjectId: string): Promise<FlashcardSourceNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, subtopic_id, flashcards_content_hash")
    .eq("subject_id", subjectId)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((note) => ({
    id: note.id,
    title: note.title,
    content: note.content ?? "",
    subtopicId: note.subtopic_id ?? null,
    flashcardsContentHash: note.flashcards_content_hash ?? null,
  }));
}

export async function markNotesFlashcardsCovered(notes: CoveredNote[]) {
  for (const note of notes) {
    const { error } = await supabase
      .from("notes")
      .update({ flashcards_content_hash: note.contentHash })
      .eq("id", note.noteId);

    if (error) {
      throw error;
    }
  }
}
