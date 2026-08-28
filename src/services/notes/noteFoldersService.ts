import { supabase } from "../../lib/supabase";

export type NoteFolder = {
  id: string;
  subjectId: string;

  topicId: string | null;
  topicName: string | null;

  name: string;
  createdAt: string;
};

type TopicRelation = {
  id: string;
  name: string;
  subject_id: string;
};

type NoteFolderRow = {
  id: string;
  subject_id: string;
  topic_id: string | null;
  name: string;
  created_at: string;
  topics: TopicRelation | TopicRelation[] | null;
};

const noteFolderSelect = `
  id,
  subject_id,
  topic_id,
  name,
  created_at,
  topics (
    id,
    name,
    subject_id
  )
`;

const getFirstRelation = <T>(relation: T | T[] | null): T | null => {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
};

const mapNoteFolder = (folder: NoteFolderRow): NoteFolder => {
  const topic = getFirstRelation(folder.topics);

  return {
    id: folder.id,
    subjectId: folder.subject_id,

    topicId: folder.topic_id,
    topicName: topic?.name ?? null,

    name: folder.name,
    createdAt: folder.created_at,
  };
};

export async function getNoteFoldersBySubject(
  subjectId: string,
): Promise<NoteFolder[]> {
  const { data, error } = await supabase
    .from("note_folders")
    .select(noteFolderSelect)
    .eq("subject_id", subjectId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as NoteFolderRow[]).map(mapNoteFolder);
}

export async function getNoteFolderById(
  id: string,
): Promise<NoteFolder | null> {
  const { data, error } = await supabase
    .from("note_folders")
    .select(noteFolderSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapNoteFolder(data as NoteFolderRow);
}

export async function createNoteFolder(
  subjectId: string,
  name: string,
  topicId: string | null = null,
): Promise<NoteFolder> {
  const { data, error } = await supabase
    .from("note_folders")
    .insert({
      subject_id: subjectId,
      topic_id: topicId,
      name,
    })
    .select(noteFolderSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapNoteFolder(data as NoteFolderRow);
}

export async function updateNoteFolder(
  id: string,
  name: string,
): Promise<void> {
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

export async function updateNoteFolderTopic(
  id: string,
  topicId: string | null,
): Promise<void> {
  const { error } = await supabase
    .from("note_folders")
    .update({
      topic_id: topicId,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteNoteFolder(id: string): Promise<void> {
  const { error } = await supabase.from("note_folders").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
