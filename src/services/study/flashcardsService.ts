import { supabase } from "../../lib/supabase";

export type DatabaseFlashcard = {
  id: string;
  subjectId: string;

  topicId: string;
  topicName: string;

  subtopicId: string;
  subtopicName: string;

  slug: string;
  question: string;
  answer: string;
  createdAt: string;
};

export async function getFlashcardsBySubject(
  subjectId: string,
): Promise<DatabaseFlashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select(
      `
  *,
  subtopics (
    id,
    name,
    topic_id,
    topics (
      id,
      name
    )
  )
`,
    )
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((flashcard) => ({
    id: flashcard.id,
    subjectId: flashcard.subject_id,

    topicId: flashcard.subtopics?.topics?.id ?? "",

    topicName: flashcard.subtopics?.topics?.name ?? "",

    subtopicId: flashcard.subtopics?.id ?? "",

    subtopicName: flashcard.subtopics?.name ?? "",

    slug: flashcard.slug,
    question: flashcard.question,
    answer: flashcard.answer,
    createdAt: flashcard.created_at,
  }));
}

export async function getAllFlashcards(): Promise<DatabaseFlashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select(
      `
        *,
        subtopics (
          id,
          name,
          topic_id,
          topics (
            id,
            name
          )
        )
      `,
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((flashcard) => ({
    id: flashcard.id,
    subjectId: flashcard.subject_id,

    topicId: flashcard.subtopics?.topics?.id ?? "",
    topicName: flashcard.subtopics?.topics?.name ?? "",

    subtopicId: flashcard.subtopics?.id ?? "",
    subtopicName: flashcard.subtopics?.name ?? "",

    slug: flashcard.slug,
    question: flashcard.question,
    answer: flashcard.answer,
    createdAt: flashcard.created_at,
  }));
}

export async function createFlashcard(
  subjectId: string,
  subtopicId: string,
  slug: string,
  question: string,
  answer: string,
) {
  const { error } = await supabase.from("flashcards").insert({
    subject_id: subjectId,
    subtopic_id: subtopicId,
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
  subtopicId: string,
  question: string,
  answer: string,
) {
  const { error } = await supabase
    .from("flashcards")
    .update({
      subtopic_id: subtopicId,
      question,
      answer,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteFlashcard(id: string) {
  const { error } = await supabase.from("flashcards").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
