import { supabase } from "../lib/supabase";

export type DatabaseNote = {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
  description: string;
  content: string;
};

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

  return (data ?? []).map((note) => ({
    id: note.id,
    subjectId: note.subject_id,
    slug: note.slug,
    title: note.title,
    description: note.description,
    content: note.content,
  }));
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

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    subjectId: data.subject_id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    content: data.content,
  };
}

export async function createNote(
  subjectId: string,
  slug: string,
  title: string,
  description: string,
  content: string,
) {
  const { error } = await supabase.from("notes").insert({
    subject_id: subjectId,
    slug,
    title,
    description,
    content,
  });

  if (error) {
    throw error;
  }
}

export async function updateNote(
  id: string,
  title: string,
  description: string,
  content: string,
) {
  const { error } = await supabase
    .from("notes")
    .update({
      title,
      description,
      content,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteNote(id: string) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}