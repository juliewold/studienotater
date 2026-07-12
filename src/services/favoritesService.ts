import { supabase } from "../lib/supabase";
import type {
  FavoriteItem,
  FavoriteType,
} from "../utils/favorites";

export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(
    (favorite): FavoriteItem => ({
      id: favorite.item_id,
      title: favorite.title,
      subject: favorite.subject ?? undefined,
      type: favorite.item_type as FavoriteType,
      url: favorite.url,
    }),
  );
}

export async function addFavorite(
  userId: string,
  item: FavoriteItem,
) {
  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    item_id: item.id,
    item_type: item.type,
    title: item.title,
    subject: item.subject ?? null,
    url: item.url,
  });

  if (error) {
    throw error;
  }
}

export async function removeFavorite(
  userId: string,
  itemId: string,
  itemType: FavoriteType,
) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .eq("item_type", itemType);

  if (error) {
    throw error;
  }
}