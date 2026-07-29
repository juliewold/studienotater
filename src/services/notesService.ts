import { supabase } from "../lib/supabase";

export type NoteContentJson = Record<string, unknown> | null;

export type DatabaseNote = {
  id: string;
  subjectId: string;
  folderId: string | null;

  subtopicId: string | null;
  subtopicName: string | null;
  topicId: string | null;
  topicName: string | null;

  slug: string;
  title: string;
  description: string;
  content: string;
  contentJson: NoteContentJson;
};

type CreateNoteInput = {
  subjectId: string;
  folderId?: string | null;
  subtopicId?: string | null;
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
  subtopicId?: string | null;
};

type TopicRelation = {
  id: string;
  name: string;
  subject_id: string;
};

type SubtopicRelation = {
  id: string;
  name: string;
  topic_id: string;
  topics: TopicRelation | TopicRelation[] | null;
};

type NoteRow = {
  id: string;
  subject_id: string;
  folder_id: string | null;
  subtopic_id: string | null;
  slug: string;
  title: string;
  description: string;
  content: string | null;
  content_json: NoteContentJson;
  subtopics: SubtopicRelation | SubtopicRelation[] | null;
};

const noteSelect = `
  id,
  subject_id,
  folder_id,
  subtopic_id,
  slug,
  title,
  description,
  content,
  content_json,
  subtopics (
    id,
    name,
    topic_id,
    topics (
      id,
      name,
      subject_id
    )
  )
`;

const getFirstRelation = <T>(relation: T | T[] | null): T | null => {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
};

function mapDatabaseNote(note: NoteRow): DatabaseNote {
  const subtopic = getFirstRelation(note.subtopics);

  const topic = subtopic ? getFirstRelation(subtopic.topics) : null;

  return {
    id: note.id,
    subjectId: note.subject_id,
    folderId: note.folder_id,

    subtopicId: note.subtopic_id,
    subtopicName: subtopic?.name ?? null,
    topicId: topic?.id ?? null,
    topicName: topic?.name ?? null,

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
    .select(noteSelect)
    .eq("subject_id", subjectId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as NoteRow[]).map(mapDatabaseNote);
}

export async function getNotesByFolder(
  subjectId: string,
  folderId: string,
): Promise<DatabaseNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select(noteSelect)
    .eq("subject_id", subjectId)
    .eq("folder_id", folderId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as NoteRow[]).map(mapDatabaseNote);
}

export async function moveAllNotesOutOfFolder(folderId: string): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .update({
      folder_id: null,
    })
    .eq("folder_id", folderId);

  if (error) {
    throw error;
  }
}

export async function getNotesWithoutFolder(
  subjectId: string,
): Promise<DatabaseNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select(noteSelect)
    .eq("subject_id", subjectId)
    .is("folder_id", null)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as NoteRow[]).map(mapDatabaseNote);
}

export async function getNoteById(id: string): Promise<DatabaseNote | null> {
  const { data, error } = await supabase
    .from("notes")
    .select(noteSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapDatabaseNote(data as NoteRow);
}

export async function getNoteBySlug(
  subjectId: string,
  slug: string,
): Promise<DatabaseNote | null> {
  const { data, error } = await supabase
    .from("notes")
    .select(noteSelect)
    .eq("subject_id", subjectId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapDatabaseNote(data as NoteRow);
}

export async function createNote({
  subjectId,
  folderId = null,
  subtopicId = null,
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
      subtopic_id: subtopicId,
      slug,
      title,
      description,
      content,
      content_json: contentJson,
    })
    .select(noteSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapDatabaseNote(data as NoteRow);
}

export async function updateNote(
  id: string,
  {
    title,
    description,
    content,
    contentJson,
    folderId,
    subtopicId,
  }: UpdateNoteInput,
): Promise<DatabaseNote> {
  const updates: {
    title: string;
    description: string;
    content: string;
    content_json?: NoteContentJson;
    folder_id?: string | null;
    subtopic_id?: string | null;
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

  if (subtopicId !== undefined) {
    updates.subtopic_id = subtopicId;
  }

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .select(noteSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapDatabaseNote(data as NoteRow);
}

export async function updateNoteTitle(
  id: string,
  title: string,
): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .update({
      title,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function updateNoteSubtopic(
  id: string,
  subtopicId: string | null,
): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .update({
      subtopic_id: subtopicId,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
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
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
