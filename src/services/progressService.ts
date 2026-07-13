import { supabase } from "../lib/supabase";

export type Progress = {
  completed: boolean;
  rating: number;
};

export type ProgressItem = Progress & {
  itemId: string;
  itemType: string;
};

export async function getProgress(
  userId: string,
  itemId: string,
  itemType: string,
) {
  const { data, error } = await supabase
    .from("progress")
    .select("completed, rating")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .eq("item_type", itemType)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (
    data ?? {
      completed: false,
      rating: 0,
    }
  );
}

export async function getAllProgress(
  userId: string,
): Promise<ProgressItem[]> {
  const { data, error } = await supabase
    .from("progress")
    .select("item_id, item_type, completed, rating")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data.map((item) => ({
    itemId: item.item_id,
    itemType: item.item_type,
    completed: item.completed,
    rating: item.rating,
  }));
}

export async function saveProgress(
  userId: string,
  itemId: string,
  itemType: string,
  completed: boolean,
  rating: number,
) {
  const { error } = await supabase
    .from("progress")
    .upsert(
      {
        user_id: userId,
        item_id: itemId,
        item_type: itemType,
        completed,
        rating,
      },
      {
        onConflict: "user_id,item_id,item_type",
      },
    );

  if (error) {
    throw error;
  }
}

export async function getCompletedSyllabusTopics(
  userId: string,
  subjectId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("progress")
    .select("item_id")
    .eq("user_id", userId)
    .eq("item_type", "syllabus")
    .eq("completed", true)
    .like("item_id", `${subjectId}-%`);

  if (error) {
    throw error;
  }

  return data.map((item) =>
    item.item_id.replace(`${subjectId}-`, ""),
  );
}

export async function saveSyllabusTopic(
  userId: string,
  subjectId: string,
  topicId: string,
  completed: boolean,
) {
  const itemId = `${subjectId}-${topicId}`;

  const { error } = await supabase
    .from("progress")
    .upsert(
      {
        user_id: userId,
        item_id: itemId,
        item_type: "syllabus",
        completed,
        rating: 0,
      },
      {
        onConflict: "user_id,item_id,item_type",
      },
    );

  if (error) {
    throw error;
  }
}

export async function getStudyPlanItems(
  userId: string,
  subjectId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("progress")
    .select("item_id")
    .eq("user_id", userId)
    .eq("item_type", "study_plan")
    .eq("completed", true)
    .like("item_id", `${subjectId}-%`);

  if (error) {
    throw error;
  }

  return data.map((item) =>
    item.item_id.replace(`${subjectId}-`, ""),
  );
}

export async function saveStudyPlanItem(
  userId: string,
  subjectId: string,
  itemId: string,
  completed: boolean,
) {
  const { error } = await supabase
    .from("progress")
    .upsert(
      {
        user_id: userId,
        item_id: `${subjectId}-${itemId}`,
        item_type: "study_plan",
        completed,
        rating: 0,
      },
      {
        onConflict: "user_id,item_id,item_type",
      },
    );

  if (error) {
    throw error;
  }
}