import { supabase } from "../../lib/supabase";

export type StudyTopicItemType =
  | "reading"
  | "lecture"
  | "exercise"
  | "assignment"
  | "stack";

export type StudyTopicResourceType =
  | "pdf"
  | "note"
  | "video";

export type DatabaseStudyTopicItem = {
  id: string;
  topicId: string;
  type: StudyTopicItemType;
  value: string;
  sortOrder: number;
};

export type DatabaseStudyTopicResource = {
  id: string;
  topicId: string;
  resourceType: StudyTopicResourceType;
  resourceId: string;
  sortOrder: number;
};

export type DatabaseStudyTopic = {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
  sortOrder: number;
  items: DatabaseStudyTopicItem[];
  resources: DatabaseStudyTopicResource[];
};

const mapStudyTopicItem = (
  item: Record<string, unknown>,
): DatabaseStudyTopicItem => {
  return {
    id: String(item.id),
    topicId: String(item.topic_id),
    type: item.type as StudyTopicItemType,
    value: String(item.value),
    sortOrder: Number(item.sort_order),
  };
};

const mapStudyTopicResource = (
  resource: Record<string, unknown>,
): DatabaseStudyTopicResource => {
  return {
    id: String(resource.id),
    topicId: String(resource.topic_id),
    resourceType:
      resource.resource_type as StudyTopicResourceType,
    resourceId: String(resource.resource_id),
    sortOrder: Number(resource.sort_order),
  };
};

export async function getStudyTopicsBySubject(
  subjectId: string,
): Promise<DatabaseStudyTopic[]> {
  const { data: topicData, error: topicError } = await supabase
    .from("study_topics")
    .select("*")
    .eq("subject_id", subjectId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (topicError) {
    throw topicError;
  }

  if (!topicData || topicData.length === 0) {
    return [];
  }

  const topicIds = topicData.map((topic) => topic.id);

  const [
    { data: itemData, error: itemError },
    { data: resourceData, error: resourceError },
  ] = await Promise.all([
    supabase
      .from("study_topic_items")
      .select("*")
      .in("topic_id", topicIds)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),

    supabase
      .from("study_topic_resources")
      .select("*")
      .in("topic_id", topicIds)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (itemError) {
    throw itemError;
  }

  if (resourceError) {
    throw resourceError;
  }

  const items = (itemData ?? []).map(mapStudyTopicItem);
  const resources = (resourceData ?? []).map(
    mapStudyTopicResource,
  );

  return topicData.map((topic) => ({
    id: topic.id,
    subjectId: topic.subject_id,
    slug: topic.slug,
    title: topic.title,
    sortOrder: topic.sort_order,
    items: items.filter((item) => item.topicId === topic.id),
    resources: resources.filter(
      (resource) => resource.topicId === topic.id,
    ),
  }));
}

export async function createStudyTopic(
  subjectId: string,
  slug: string,
  title: string,
  sortOrder: number,
): Promise<string> {
  const { data, error } = await supabase
    .from("study_topics")
    .insert({
      subject_id: subjectId,
      slug,
      title,
      sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function updateStudyTopic(
  id: string,
  title: string,
  sortOrder: number,
) {
  const { error } = await supabase
    .from("study_topics")
    .update({
      title,
      sort_order: sortOrder,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteStudyTopic(id: string) {
  const { error } = await supabase
    .from("study_topics")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function createStudyTopicItem(
  topicId: string,
  type: StudyTopicItemType,
  value: string,
  sortOrder: number,
) {
  const { error } = await supabase
    .from("study_topic_items")
    .insert({
      topic_id: topicId,
      type,
      value,
      sort_order: sortOrder,
    });

  if (error) {
    throw error;
  }
}

export async function updateStudyTopicItem(
  id: string,
  type: StudyTopicItemType,
  value: string,
  sortOrder: number,
) {
  const { error } = await supabase
    .from("study_topic_items")
    .update({
      type,
      value,
      sort_order: sortOrder,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteStudyTopicItem(id: string) {
  const { error } = await supabase
    .from("study_topic_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function createStudyTopicResource(
  topicId: string,
  resourceType: StudyTopicResourceType,
  resourceId: string,
  sortOrder: number,
) {
  const { error } = await supabase
    .from("study_topic_resources")
    .insert({
      topic_id: topicId,
      resource_type: resourceType,
      resource_id: resourceId,
      sort_order: sortOrder,
    });

  if (error) {
    throw error;
  }
}

export async function deleteStudyTopicResource(id: string) {
  const { error } = await supabase
    .from("study_topic_resources")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function replaceStudyTopicItems(
  topicId: string,
  items: Array<{
    type: StudyTopicItemType;
    value: string;
  }>,
) {
  const { error: deleteError } = await supabase
    .from("study_topic_items")
    .delete()
    .eq("topic_id", topicId);

  if (deleteError) {
    throw deleteError;
  }

  if (items.length === 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from("study_topic_items")
    .insert(
      items.map((item, index) => ({
        topic_id: topicId,
        type: item.type,
        value: item.value,
        sort_order: index,
      })),
    );

  if (insertError) {
    throw insertError;
  }
}

export async function replaceStudyTopicResources(
  topicId: string,
  resources: Array<{
    resourceType: StudyTopicResourceType;
    resourceId: string;
  }>,
) {
  const { error: deleteError } = await supabase
    .from("study_topic_resources")
    .delete()
    .eq("topic_id", topicId);

  if (deleteError) {
    throw deleteError;
  }

  if (resources.length === 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from("study_topic_resources")
    .insert(
      resources.map((resource, index) => ({
        topic_id: topicId,
        resource_type: resource.resourceType,
        resource_id: resource.resourceId,
        sort_order: index,
      })),
    );

  if (insertError) {
    throw insertError;
  }
}