import { supabase } from "../../lib/supabase";

export type DatabaseBookChapter = {
  id: string;
  title: string;
  startPage: number;
  endPage: number;
  sortOrder: number;
};

export type DatabaseBookTask = {
  id: string;
  chapterId: string;
  title: string;
  sortOrder: number;
};

export type DatabaseBook = {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
  shortTitle: string | null;
  sortOrder: number;
  chapters: DatabaseBookChapter[];
};

export async function getBookBySubject(
  subjectId: string,
): Promise<DatabaseBook | null> {
  const { data: bookData, error: bookError } = await supabase
    .from("books")
    .select("id, subject_id, slug, title, short_title, sort_order")
    .eq("subject_id", subjectId)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (bookError) {
    throw bookError;
  }

  if (!bookData) {
    return null;
  }

  const { data: chapterData, error: chapterError } = await supabase
    .from("book_chapters")
    .select("id, title, start_page, end_page, sort_order")
    .eq("book_id", bookData.id)
    .order("sort_order", { ascending: true });

  if (chapterError) {
    throw chapterError;
  }

  return {
    id: bookData.id,
    subjectId: bookData.subject_id,
    slug: bookData.slug,
    title: bookData.title,
    shortTitle: bookData.short_title,
    sortOrder: bookData.sort_order,
    chapters: (chapterData ?? []).map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      startPage: chapter.start_page,
      endPage: chapter.end_page,
      sortOrder: chapter.sort_order,
    })),
  };
}

export async function getBookTasksByChapter(
  chapterId: string,
): Promise<DatabaseBookTask[]> {
  const { data, error } = await supabase
    .from("book_chapter_tasks")
    .select("id, chapter_id, title, sort_order")
    .eq("chapter_id", chapterId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((task) => ({
    id: task.id,
    chapterId: task.chapter_id,
    title: task.title,
    sortOrder: task.sort_order,
  }));
}

export async function getCompletedBookTaskIds(
  userId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("book_task_progress")
    .select("task_id")
    .eq("user_id", userId)
    .eq("completed", true);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => item.task_id);
}

export async function setBookTaskCompleted(
  userId: string,
  taskId: string,
  completed: boolean,
) {
  const { error } = await supabase.from("book_task_progress").upsert(
    {
      user_id: userId,
      task_id: taskId,
      completed,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,task_id",
    },
  );

  if (error) {
    throw error;
  }
}

export async function getBooksBySubject(
  subjectId: string,
): Promise<DatabaseBook[]> {
  const { data, error } = await supabase
    .from("books")
    .select("id, subject_id, slug, title, short_title, sort_order")
    .eq("subject_id", subjectId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((book) => ({
    id: book.id,
    subjectId: book.subject_id,
    slug: book.slug,
    title: book.title,
    shortTitle: book.short_title,
    sortOrder: book.sort_order,
    chapters: [],
  }));
}

export async function getBookChapters(
  bookId: string,
): Promise<DatabaseBookChapter[]> {
  const { data, error } = await supabase
    .from("book_chapters")
    .select("id, title, start_page, end_page, sort_order")
    .eq("book_id", bookId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    startPage: chapter.start_page,
    endPage: chapter.end_page,
    sortOrder: chapter.sort_order,
  }));
}

export type BookInput = {
  subjectId: string;
  slug: string;
  title: string;
  shortTitle: string | null;
  sortOrder: number;
};

export type BookChapterInput = {
  bookId: string;
  title: string;
  startPage: number;
  endPage: number;
  sortOrder: number;
};

export type BookTaskInput = {
  chapterId: string;
  title: string;
  sortOrder: number;
};

export async function createBook(input: BookInput): Promise<string> {
  const { data, error } = await supabase
    .from("books")
    .insert({
      subject_id: input.subjectId,
      slug: input.slug,
      title: input.title,
      short_title: input.shortTitle,
      sort_order: input.sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function updateBook(bookId: string, input: BookInput) {
  const { error } = await supabase
    .from("books")
    .update({
      subject_id: input.subjectId,
      slug: input.slug,
      title: input.title,
      short_title: input.shortTitle,
      sort_order: input.sortOrder,
    })
    .eq("id", bookId);

  if (error) {
    throw error;
  }
}

export async function deleteBook(bookId: string) {
  const { error } = await supabase.from("books").delete().eq("id", bookId);

  if (error) {
    throw error;
  }
}

export async function createBookChapter(
  input: BookChapterInput,
): Promise<string> {
  const { data, error } = await supabase
    .from("book_chapters")
    .insert({
      book_id: input.bookId,
      title: input.title,
      start_page: input.startPage,
      end_page: input.endPage,
      sort_order: input.sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function updateBookChapter(
  chapterId: string,
  input: BookChapterInput,
) {
  const { error } = await supabase
    .from("book_chapters")
    .update({
      book_id: input.bookId,
      title: input.title,
      start_page: input.startPage,
      end_page: input.endPage,
      sort_order: input.sortOrder,
    })
    .eq("id", chapterId);

  if (error) {
    throw error;
  }
}

export async function deleteBookChapter(chapterId: string) {
  const { error } = await supabase
    .from("book_chapters")
    .delete()
    .eq("id", chapterId);

  if (error) {
    throw error;
  }
}

export async function createBookTask(input: BookTaskInput): Promise<string> {
  const { data, error } = await supabase
    .from("book_chapter_tasks")
    .insert({
      chapter_id: input.chapterId,
      title: input.title,
      sort_order: input.sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function updateBookTask(taskId: string, input: BookTaskInput) {
  const { error } = await supabase
    .from("book_chapter_tasks")
    .update({
      chapter_id: input.chapterId,
      title: input.title,
      sort_order: input.sortOrder,
    })
    .eq("id", taskId);

  if (error) {
    throw error;
  }
}

export async function deleteBookTask(taskId: string) {
  const { error } = await supabase
    .from("book_chapter_tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    throw error;
  }
}

export async function getBookBySlug(
  subjectId: string,
  slug: string,
): Promise<DatabaseBook | null> {
  const { data: bookData, error: bookError } = await supabase
    .from("books")
    .select("id, subject_id, slug, title, short_title, sort_order")
    .eq("subject_id", subjectId)
    .eq("slug", slug)
    .maybeSingle();

  if (bookError) {
    throw bookError;
  }

  if (!bookData) {
    return null;
  }

  const chapters = await getBookChapters(bookData.id);

  return {
    id: bookData.id,
    subjectId: bookData.subject_id,
    slug: bookData.slug,
    title: bookData.title,
    shortTitle: bookData.short_title,
    sortOrder: bookData.sort_order,
    chapters,
  };
}
