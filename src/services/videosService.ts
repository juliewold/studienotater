import { supabase } from "../lib/supabase";

export type DatabaseVideo = {
  id: string;
  subjectId: string;
  topic: string;
  title: string;
  youtubeId: string;
};

export async function getVideosBySubject(
  subjectId: string,
): Promise<DatabaseVideo[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((video) => ({
    id: video.id,
    subjectId: video.subject_id,
    topic: video.topic,
    title: video.title,
    youtubeId: video.youtube_id,
  }));
}

export async function createVideo(
  subjectId: string,
  topic: string,
  title: string,
  youtubeId: string,
) {
  const { error } = await supabase.from("videos").insert({
    subject_id: subjectId,
    topic,
    title,
    youtube_id: youtubeId,
  });

  if (error) {
    throw error;
  }
}

export async function updateVideo(
  id: string,
  topic: string,
  title: string,
  youtubeId: string,
) {
  const { error } = await supabase
    .from("videos")
    .update({
      topic,
      title,
      youtube_id: youtubeId,
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