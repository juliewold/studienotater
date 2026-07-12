import { supabase } from "./supabase";

export async function addFavorite(
  userId: string,
  itemId: string,
  itemType: string,
) {
  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    item_id: itemId,
    item_type: itemType,
  });

  if (error) throw error;
}