import { supabase } from "../lib/supabase";

export type NoteFolder = {
  id: string;
  subjectId: string;
  name: string;
  createdAt: string;
};

export async function getNoteFoldersBySubject(
  subjectId: string,
): Promise<NoteFolder[]> {
  const { data, error } = await supabase
    .from("note_folders")
    .select("*")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((folder) => ({
    id: folder.id,
    subjectId: folder.subject_id,
    name: folder.name,
    createdAt: folder.created_at,
  }));
}

export async function getNoteFolderById(
  id: string,
): Promise<NoteFolder | null> {
  const { data, error } = await supabase
    .from("note_folders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    subjectId: data.subject_id,
    name: data.name,
    createdAt: data.created_at,
  };
}

export async function createNoteFolder(
  subjectId: string,
  name: string,
): Promise<NoteFolder> {
  const { data, error } = await supabase
    .from("note_folders")
    .insert({
      subject_id: subjectId,
      name,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    subjectId: data.subject_id,
    name: data.name,
    createdAt: data.created_at,
  };
}

export async function updateNoteFolder(id: string, name: string) {
  const { error } = await supabase
    .from("note_folders")
    .update({
      name,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteNoteFolder(id: string) {
  const { error } = await supabase
    .from("note_folders")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}