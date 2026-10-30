import { sortNotes } from "./noteOrder";
import { notifyNotesChanged } from "./notesNavigationEvents";
import { supabase } from "../../lib/supabase";

export type NoteContentJson = Record<string, unknown> | null;

export type NoteMetadata = {
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
  createdAt: string;
  sortOrder?: number;
};

export type DatabaseNote = NoteMetadata & {
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
  created_at: string;
  sort_order: number;
  subtopics: SubtopicRelation | SubtopicRelation[] | null;
};

type NoteMetadataRow = Omit<NoteRow, "content" | "content_json">;

const noteMetadataSelect = `
  id,
  subject_id,
  folder_id,
  subtopic_id,
  slug,
  title,
  description,
  created_at,
  sort_order,
  subtopics!notes_subtopic_id_fkey (
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

const noteSelect = `${noteMetadataSelect}, content, content_json`;

const getFirstRelation = <T>(relation: T | T[] | null): T | null => {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
};

function mapNoteMetadata(note: NoteMetadataRow): NoteMetadata {
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
    createdAt: note.created_at,
    sortOrder: note.sort_order,
  };
}

function mapDatabaseNote(note: NoteRow): DatabaseNote {
  return { ...mapNoteMetadata(note), content: note.content ?? "", contentJson: note.content_json ?? null };
}

// List consumers must opt into metadata; existing full-content APIs stay unchanged.
export async function getNoteMetadataBySubject(subjectId: string): Promise<NoteMetadata[]> {
  const { data, error } = await supabase.from("notes").select(noteMetadataSelect)
    .eq("subject_id", subjectId).order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return sortNotes(((data ?? []) as NoteMetadataRow[]).map(mapNoteMetadata));
}

export async function getNoteMetadataByFolder(subjectId: string, folderId: string): Promise<NoteMetadata[]> {
  const { data, error } = await supabase.from("notes").select(noteMetadataSelect)
    .eq("subject_id", subjectId).eq("folder_id", folderId)
    .order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return sortNotes(((data ?? []) as NoteMetadataRow[]).map(mapNoteMetadata));
}

export async function getNoteMetadataWithoutFolder(subjectId: string): Promise<NoteMetadata[]> {
  const { data, error } = await supabase.from("notes").select(noteMetadataSelect)
    .eq("subject_id", subjectId).is("folder_id", null)
    .order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return sortNotes(((data ?? []) as NoteMetadataRow[]).map(mapNoteMetadata));
}

export async function getNotesBySubject(
  subjectId: string,
): Promise<DatabaseNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select(noteSelect)
    .eq("subject_id", subjectId)
    .order("sort_order", { ascending: true }).order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return sortNotes(((data ?? []) as NoteRow[]).map(mapDatabaseNote));
}

/** Search needs HTML for matches/snippets, but never the editor JSON. */
export type SearchNote = NoteMetadata & { content: string };

export async function getAllSearchNotes(): Promise<SearchNote[]> {
  const { data, error } = await supabase.from("notes")
    .select(`${noteMetadataSelect}, content`)
    .order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return sortNotes(((data ?? []) as NoteRow[]).map(note => ({
    ...mapNoteMetadata(note), content: note.content ?? "",
  })));
}

export async function getAllNotes(range?: { from: number; to: number }): Promise<DatabaseNote[]> {
  let query = supabase
    .from("notes")
    .select(noteSelect)
    .order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (range) query = query.range(range.from, range.to);
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return sortNotes(((data ?? []) as NoteRow[]).map(mapDatabaseNote));
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
    .order("sort_order", { ascending: true }).order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return sortNotes(((data ?? []) as NoteRow[]).map(mapDatabaseNote));
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

  notifyNotesChanged();
}

export async function getNotesWithoutFolder(
  subjectId: string,
): Promise<DatabaseNote[]> {
  const { data, error } = await supabase
    .from("notes")
    .select(noteSelect)
    .eq("subject_id", subjectId)
    .is("folder_id", null)
    .order("sort_order", { ascending: true }).order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return sortNotes(((data ?? []) as NoteRow[]).map(mapDatabaseNote));
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

  notifyNotesChanged();

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

  notifyNotesChanged({ note: mapNoteMetadata(data as NoteRow) });

  return mapDatabaseNote(data as NoteRow);
}

// AI processing can take time. Only save links if the note content is still current.
export async function updateNoteConceptLinks(
  note: DatabaseNote,
  content: string,
  contentJson: NoteContentJson,
): Promise<void> {
  let query = supabase
    .from("notes")
    .update({ content, content_json: contentJson })
    .eq("id", note.id)
    .eq("content", note.content);

  query =
    note.contentJson === null
      ? query.is("content_json", null)
      : query.eq("content_json", JSON.stringify(note.contentJson));

  const { data, error } = await query.select("id").maybeSingle();
  if (error) throw error;
  if (!data) {
    throw new Error(
      "Notatet ble endret eller kunne ikke lagres. Kjør genereringen på nytt.",
    );
  }
  notifyNotesChanged({ navigation: false });
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

  notifyNotesChanged();
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

  notifyNotesChanged();
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

  notifyNotesChanged();
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    throw error;
  }

  notifyNotesChanged();
}

export async function reorderNotes(subjectId: string, folderId: string | null, noteIds: string[]): Promise<void> {
  const { error } = await supabase.rpc("reorder_notes", {
    p_subject_id: subjectId, p_folder_id: folderId, p_note_ids: noteIds,
  });
  if (error) throw error;
  notifyNotesChanged();
}
