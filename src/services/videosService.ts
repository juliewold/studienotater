import { supabase } from "../lib/supabase";

export type DatabaseVideoTopic = {
  id: string;
  subjectId: string;
  name: string;
  sortOrder: number;
};

export type DatabaseVideoSubtopic = {
  id: string;
  topicId: string;
  name: string;
  sortOrder: number;
};

export type DatabaseVideo = {
  id: string;
  subjectId: string;
  topicId: string;
  topic: string;
  topicOrder: number;
  subtopicId: string;
  subtopic: string;
  subtopicOrder: number;
  title: string;
  youtubeId: string;
  sortOrder: number;
};

type VideoRow = {
  id: string;
  subject_id: string;
  title: string;
  youtube_id: string;
  sort_order: number;
  subtopic_id: string;
  video_subtopics:
    | {
        id: string;
        name: string;
        sort_order: number;
        topic_id: string;
        video_topics:
          | {
              id: string;
              subject_id: string;
              name: string;
              sort_order: number;
            }
          | {
              id: string;
              subject_id: string;
              name: string;
              sort_order: number;
            }[];
      }
    | {
        id: string;
        name: string;
        sort_order: number;
        topic_id: string;
        video_topics:
          | {
              id: string;
              subject_id: string;
              name: string;
              sort_order: number;
            }
          | {
              id: string;
              subject_id: string;
              name: string;
              sort_order: number;
            }[];
      }[];
};

const getFirstRelation = <T>(relation: T | T[] | null): T | null => {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
};

export async function getVideoTopicsBySubject(
  subjectId: string,
): Promise<DatabaseVideoTopic[]> {
  const { data, error } = await supabase
    .from("video_topics")
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

export async function getVideoSubtopicsByTopic(
  topicId: string,
): Promise<DatabaseVideoSubtopic[]> {
  const { data, error } = await supabase
    .from("video_subtopics")
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

export async function getVideosBySubject(
  subjectId: string,
): Promise<DatabaseVideo[]> {
  const { data, error } = await supabase
    .from("videos")
    .select(
      `
      id,
      subject_id,
      title,
      youtube_id,
      sort_order,
      subtopic_id,
      video_subtopics!inner (
        id,
        name,
        sort_order,
        topic_id,
        video_topics!inner (
          id,
          subject_id,
          name,
          sort_order
        )
      )
    `,
    )
    .eq("subject_id", subjectId);

  if (error) {
    throw error;
  }

  const mappedVideos = ((data ?? []) as VideoRow[]).flatMap((video) => {
    const subtopic = getFirstRelation(video.video_subtopics);

    if (!subtopic) {
      return [];
    }

    const topic = getFirstRelation(subtopic.video_topics);

    if (!topic) {
      return [];
    }

    return [
      {
        id: video.id,
        subjectId: video.subject_id,
        topicId: topic.id,
        topic: topic.name,
        topicOrder: topic.sort_order,
        subtopicId: subtopic.id,
        subtopic: subtopic.name,
        subtopicOrder: subtopic.sort_order,
        title: video.title,
        youtubeId: video.youtube_id,
        sortOrder: video.sort_order,
      },
    ];
  });

  return mappedVideos.sort((firstVideo, secondVideo) => {
    const topicComparison = firstVideo.topicOrder - secondVideo.topicOrder;

    if (topicComparison !== 0) {
      return topicComparison;
    }

    const subtopicComparison =
      firstVideo.subtopicOrder - secondVideo.subtopicOrder;

    if (subtopicComparison !== 0) {
      return subtopicComparison;
    }

    const videoComparison = firstVideo.sortOrder - secondVideo.sortOrder;

    if (videoComparison !== 0) {
      return videoComparison;
    }

    return firstVideo.title.localeCompare(secondVideo.title, "nb");
  });
}

export async function createVideoTopic(
  subjectId: string,
  name: string,
  sortOrder: number,
): Promise<DatabaseVideoTopic> {
  const { data, error } = await supabase
    .from("video_topics")
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

export async function updateVideoTopic(
  id: string,
  name: string,
  sortOrder: number,
) {
  const { error } = await supabase
    .from("video_topics")
    .update({
      name,
      sort_order: sortOrder,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function createVideoSubtopic(
  topicId: string,
  name: string,
  sortOrder: number,
): Promise<DatabaseVideoSubtopic> {
  const { data, error } = await supabase
    .from("video_subtopics")
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

export async function updateVideoSubtopic(
  id: string,
  name: string,
  sortOrder: number,
) {
  const { error } = await supabase
    .from("video_subtopics")
    .update({
      name,
      sort_order: sortOrder,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function createVideo(
  subjectId: string,
  subtopicId: string,
  title: string,
  youtubeId: string,
  sortOrder: number,
) {
  const { error } = await supabase.from("videos").insert({
    subject_id: subjectId,
    subtopic_id: subtopicId,
    title,
    youtube_id: youtubeId,
    sort_order: sortOrder,
  });

  if (error) {
    throw error;
  }
}

export async function updateVideo(
  id: string,
  subtopicId: string,
  title: string,
  youtubeId: string,
  sortOrder: number,
) {
  const { error } = await supabase
    .from("videos")
    .update({
      subtopic_id: subtopicId,
      title,
      youtube_id: youtubeId,
      sort_order: sortOrder,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteVideo(id: string) {
  const { error } = await supabase.from("videos").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getAllVideoSubtopicsBySubject(
  subjectId: string,
): Promise<DatabaseVideoSubtopic[]> {
  const { data: topics, error: topicsError } = await supabase
    .from("video_topics")
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
    .from("video_subtopics")
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

export async function deleteVideoTopic(id: string) {
  const { error } = await supabase.from("video_topics").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteVideoSubtopic(id: string) {
  const { error } = await supabase
    .from("video_subtopics")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
