import { supabase } from "../../lib/supabase";

export type DatabaseTopic = {
  id: string;
  subjectId: string;
  name: string;
  sortOrder: number;
};

export type DatabaseSubtopic = {
  id: string;
  topicId: string;
  name: string;
  sortOrder: number;
};

export async function getTopicsBySubject(
  subjectId: string,
): Promise<DatabaseTopic[]> {
  const { data, error } = await supabase
    .from("topics")
    .select("id, subject_id, name, sort_order")
    .eq("subject_id", subjectId)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((topic) => ({
    id: topic.id,
    subjectId: topic.subject_id,
    name: topic.name,
    sortOrder: topic.sort_order,
  }));
}

export async function getSubtopicsByTopic(
  topicId: string,
): Promise<DatabaseSubtopic[]> {
  const { data, error } = await supabase
    .from("subtopics")
    .select("id, topic_id, name, sort_order")
    .eq("topic_id", topicId)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((subtopic) => ({
    id: subtopic.id,
    topicId: subtopic.topic_id,
    name: subtopic.name,
    sortOrder: subtopic.sort_order,
  }));
}

export async function getAllSubtopicsBySubject(
  subjectId: string,
): Promise<DatabaseSubtopic[]> {
  const { data: topics, error: topicsError } = await supabase
    .from("topics")
    .select("id")
    .eq("subject_id", subjectId);

  if (topicsError) {
    throw topicsError;
  }

  const topicIds = (topics ?? []).map((topic) => topic.id);

  if (topicIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("subtopics")
    .select("id, topic_id, name, sort_order")
    .in("topic_id", topicIds)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((subtopic) => ({
    id: subtopic.id,
    topicId: subtopic.topic_id,
    name: subtopic.name,
    sortOrder: subtopic.sort_order,
  }));
}

export async function createTopic(
  subjectId: string,
  name: string,
  sortOrder: number,
): Promise<DatabaseTopic> {
  const { data, error } = await supabase
    .from("topics")
    .insert({
      subject_id: subjectId,
      name,
      sort_order: sortOrder,
    })
    .select("id, subject_id, name, sort_order")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    subjectId: data.subject_id,
    name: data.name,
    sortOrder: data.sort_order,
  };
}

export async function updateTopic(id: string, name: string, sortOrder: number) {
  const { error } = await supabase
    .from("topics")
    .update({
      name,
      sort_order: sortOrder,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteTopic(id: string) {
  const { error } = await supabase.from("topics").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function createSubtopic(
  topicId: string,
  name: string,
  sortOrder: number,
): Promise<DatabaseSubtopic> {
  const { data, error } = await supabase
    .from("subtopics")
    .insert({
      topic_id: topicId,
      name,
      sort_order: sortOrder,
    })
    .select("id, topic_id, name, sort_order")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    topicId: data.topic_id,
    name: data.name,
    sortOrder: data.sort_order,
  };
}

export async function updateSubtopic(
  id: string,
  name: string,
  sortOrder: number,
) {
  const { error } = await supabase
    .from("subtopics")
    .update({
      name,
      sort_order: sortOrder,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteSubtopic(id: string) {
  const { error } = await supabase.from("subtopics").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
