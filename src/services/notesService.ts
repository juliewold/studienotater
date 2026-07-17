import { supabase } from "../lib/supabase";

export type NoteContentJson = Record<string, unknown> | null;

export type DatabaseNote = {
  id: string;
  subjectId: string;
  folderId: string | null;
  slug: string;
  title: string;
  description: string;
  content: string;
  contentJson: NoteContentJson;
};

type CreateNoteInput = {
  subjectId: string;
  folderId?: string | null;
  slug: string;
  title: string;
  description: string;
  content: string;
  contentJson?: NoteContentJson;
};

type UpdateNoteInput = {
  title: string;
  description: string;
  content: string;
  contentJson?: NoteContentJson;
  folderId?: string | null;
};

function mapDatabaseNote(note: {
  id: string;
  subject_id: string;
  folder_id: string | null;
  slug: string;
  title: string;
  description: string;
  content: string | null;
  content_json: NoteContentJson;
}): DatabaseNote {
  return {
    id: note.id,
    subjectId: note.subject_id,
    folderId: note.folder_id,
    slug: note.slug,
    title: note.title,
    description: note.description,
    content: note.content ?? "",
    contentJson: note.content_json ?? null,
  };
}

export async function getNotesBySubject(
  subjectId: string,
): Promise<DatabaseNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapDatabaseNote);
}

export async function getNotesByFolder(
  subjectId: string,
  folderId: string,
): Promise<DatabaseNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("subject_id", subjectId)
    .eq("folder_id", folderId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapDatabaseNote);
}

export async function getNotesWithoutFolder(
  subjectId: string,
): Promise<DatabaseNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("subject_id", subjectId)
    .is("folder_id", null)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapDatabaseNote);
}

export async function getNoteById(
  id: string,
): Promise<DatabaseNote | null> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapDatabaseNote(data) : null;
}

export async function getNoteBySlug(
  subjectId: string,
  slug: string,
): Promise<DatabaseNote | null> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("subject_id", subjectId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapDatabaseNote(data) : null;
}

export async function createNote({
  subjectId,
  folderId = null,
  slug,
  title,
  description,
  content,
  contentJson = null,
}: CreateNoteInput): Promise<DatabaseNote> {
  const { data, error } = await supabase
    .from("notes")
    .insert({
      subject_id: subjectId,
      folder_id: folderId,
      slug,
      title,
      description,
      content,
      content_json: contentJson,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapDatabaseNote(data);
}

export async function updateNote(
  id: string,
  {
    title,
    description,
    content,
    contentJson,
    folderId,
  }: UpdateNoteInput,
): Promise<DatabaseNote> {
  const updates: {
    title: string;
    description: string;
    content: string;
    content_json?: NoteContentJson;
    folder_id?: string | null;
  } = {
    title,
    description,
    content,
  };

  if (contentJson !== undefined) {
    updates.content_json = contentJson;
  }

  if (folderId !== undefined) {
    updates.folder_id = folderId;
  }

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapDatabaseNote(data);
}

export async function moveNoteToFolder(
  id: string,
  folderId: string | null,
): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .update({
      folder_id: folderId,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}