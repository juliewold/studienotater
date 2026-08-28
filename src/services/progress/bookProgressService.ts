import { supabase } from "../../lib/supabase";

export async function getBookProgress(
  userId: string,
  bookId: string,
): Promise<number[]> {
  const { data, error } = await supabase
    .from("book_progress")
    .select("checked_pages")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Array.isArray(data?.checked_pages)
    ? data.checked_pages.map(Number)
    : [];
}

export async function saveBookProgress(
  userId: string,
  bookId: string,
  checkedPages: number[],
) {
  const { error } = await supabase
    .from("book_progress")
    .upsert(
      {
        user_id: userId,
        book_id: bookId,
        checked_pages: checkedPages,
      },
      {
        onConflict: "user_id,book_id",
      },
    );

  if (error) {
    throw error;
  }
}