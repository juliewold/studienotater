import { supabase } from "../lib/supabase";

export type DatabaseFlashcard = {
  id: string;
  subjectId: string;
  slug: string;
  question: string;
  answer: string;
};

export async function getFlashcardsBySubject(
  subjectId: string,
): Promise<DatabaseFlashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((flashcard) => ({
    id: flashcard.id,
    subjectId: flashcard.subject_id,
    slug: flashcard.slug,
    question: flashcard.question,
    answer: flashcard.answer,
  }));
}

export async function createFlashcard(
  subjectId: string,
  slug: string,
  question: string,
  answer: string,
) {
  const { error } = await supabase.from("flashcards").insert({
    subject_id: subjectId,
    slug,
    question,
    answer,
  });

  if (error) {
    throw error;
  }
}

export async function updateFlashcard(
  id: string,
  question: string,
  answer: string,
) {
  const { error } = await supabase
    .from("flashcards")
    .update({
      question,
      answer,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteFlashcard(id: string) {
  const { error } = await supabase
    .from("flashcards")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}