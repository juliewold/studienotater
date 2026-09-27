import { supabase } from "../../lib/supabase";

export type NoteSubtopicLink = {
  noteId: string;
  subtopicId: string;
};

export async function getSubtopicIdsByNote(noteId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("note_subtopics")
    .select("subtopic_id")
    .eq("note_id", noteId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => row.subtopic_id);
}

export async function addNoteSubtopic(
  noteId: string,
  subtopicId: string,
): Promise<void> {
  const { error } = await supabase.from("note_subtopics").upsert(
    {
      note_id: noteId,
      subtopic_id: subtopicId,
    },
    {
      onConflict: "note_id,subtopic_id",
    },
  );

  if (error) {
    throw error;
  }
}

export async function removeNoteSubtopic(
  noteId: string,
  subtopicId: string,
): Promise<void> {
  const { error } = await supabase
    .from("note_subtopics")
    .delete()
    .eq("note_id", noteId)
    .eq("subtopic_id", subtopicId);

  if (error) {
    throw error;
  }
}

export async function replaceNoteSubtopics(
  noteId: string,
  subtopicIds: string[],
): Promise<void> {
  const uniqueSubtopicIds = [...new Set(subtopicIds)];

  const { error: deleteError } = await supabase
    .from("note_subtopics")
    .delete()
    .eq("note_id", noteId);

  if (deleteError) {
    throw deleteError;
  }

  if (uniqueSubtopicIds.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from("note_subtopics").insert(
    uniqueSubtopicIds.map((subtopicId) => ({
      note_id: noteId,
      subtopic_id: subtopicId,
    })),
  );

  if (insertError) {
    throw insertError;
  }
}
