import { supabase } from "../lib/supabase";

export type DatabaseVideo = {
  id: string;
  subjectId: string;
  topic: string;
  subtopic: string;
  title: string;
  youtubeId: string;
  sortOrder: number;
};

export async function getVideosBySubject(
  subjectId: string,
): Promise<DatabaseVideo[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("subject_id", subjectId)
    .order("topic", { ascending: true })
    .order("subtopic", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((video) => ({
    id: video.id,
    subjectId: video.subject_id,
    topic: video.topic,
    subtopic: video.subtopic,
    title: video.title,
    youtubeId: video.youtube_id,
    sortOrder: video.sort_order,
  }));
}

export async function createVideo(
  subjectId: string,
  topic: string,
  subtopic: string,
  title: string,
  youtubeId: string,
  sortOrder: number,
) {
  const { error } = await supabase.from("videos").insert({
    subject_id: subjectId,
    topic,
    subtopic,
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
  topic: string,
  subtopic: string,
  title: string,
  youtubeId: string,
  sortOrder: number,
) {
  const { error } = await supabase
    .from("videos")
    .update({
      topic,
      subtopic,
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
  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}