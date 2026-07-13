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