import { supabase } from "../../lib/supabase";

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

type TopicRelation = {
  id: string;
  subject_id: string;
  name: string;
  sort_order: number;
};

type SubtopicRelation = {
  id: string;
  name: string;
  sort_order: number;
  topic_id: string;
  topics: TopicRelation | TopicRelation[];
};

type VideoRow = {
  id: string;
  subject_id: string;
  title: string;
  youtube_id: string;
  sort_order: number;
  subtopic_id: string;
  subtopics: SubtopicRelation | SubtopicRelation[];
};

const getFirstRelation = <T>(relation: T | T[] | null): T | null => {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
};

const mapVideos = (rows: VideoRow[]): DatabaseVideo[] => {
  const mappedVideos = rows.flatMap((video) => {
    const subtopic = getFirstRelation(video.subtopics);

    if (!subtopic) {
      return [];
    }

    const topic = getFirstRelation(subtopic.topics);

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
};

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
        subtopics!inner (
          id,
          name,
          sort_order,
          topic_id,
          topics!inner (
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

  return mapVideos((data ?? []) as VideoRow[]);
}

export async function getAllVideos(): Promise<DatabaseVideo[]> {
  const { data, error } = await supabase.from("videos").select(
    `
        id,
        subject_id,
        title,
        youtube_id,
        sort_order,
        subtopic_id,
        subtopics!inner (
          id,
          name,
          sort_order,
          topic_id,
          topics!inner (
            id,
            subject_id,
            name,
            sort_order
          )
        )
      `,
  );

  if (error) {
    throw error;
  }

  return mapVideos((data ?? []) as VideoRow[]);
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
