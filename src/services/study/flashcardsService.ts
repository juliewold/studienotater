import { supabase } from "../../lib/supabase";

export type DatabaseFlashcard = {
  id: string;
  subjectId: string;
  noteId?: string | null;

  topicId: string;
  topicName: string;

  subtopicId: string;
  subtopicName: string;

  slug: string;
  question: string;
  answer: string;
  /** Exam sub-task the card helps with, for example "Eksamen aug 2026 · 5a". */
  examTask: string | null;
  /** Path in the note-images bucket, or null when the card has no figure. */
  questionImagePath: string | null;
  answerImagePath: string | null;
  /** Worked solution shown under the answer. Optional. */
  explanation: string | null;
  /** Key of a built-in figure shown with the card, for example "normal". Null when there is none. */
  figureKey: string | null;
  /** Shown as four answer choices in practice when true. */
  multipleChoice: boolean;
  /** Three wrong answers. Only set for multiple-choice cards. */
  distractors: string[];
  createdAt: string;
};

export type FlashcardFields = {
  subtopicId: string | null;
  question: string;
  answer: string;
  examTask: string | null;
  questionImagePath: string | null;
  answerImagePath: string | null;
  explanation: string | null;
  multipleChoice: boolean;
  distractors: string[];
};

const flashcardSelect = `
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
`;

// Mapping is shared so every reader gets the same shape.
type FlashcardRow = {
  id: string;
  subject_id: string;
  note_id: string | null;
  slug: string;
  question: string;
  answer: string;
  exam_task: string | null;
  question_image_path: string | null;
  answer_image_path: string | null;
  explanation: string | null;
  figure_key?: string | null;
  multiple_choice: boolean;
  distractors: string[] | null;
  created_at: string;
  subtopics: {
    id: string;
    name: string;
    topics: { id: string; name: string } | null;
  } | null;
};

function toDatabaseFlashcard(flashcard: FlashcardRow): DatabaseFlashcard {
  return {
    id: flashcard.id,
    subjectId: flashcard.subject_id,
    noteId: flashcard.note_id ?? null,

    topicId: flashcard.subtopics?.topics?.id ?? "",
    topicName: flashcard.subtopics?.topics?.name ?? "",

    subtopicId: flashcard.subtopics?.id ?? "",
    subtopicName: flashcard.subtopics?.name ?? "",

    slug: flashcard.slug,
    question: flashcard.question,
    answer: flashcard.answer,
    examTask: flashcard.exam_task ?? null,
    questionImagePath: flashcard.question_image_path ?? null,
    answerImagePath: flashcard.answer_image_path ?? null,
    explanation: flashcard.explanation ?? null,
    figureKey: flashcard.figure_key ?? null,
    multipleChoice: flashcard.multiple_choice === true,
    distractors: flashcard.distractors ?? [],
    createdAt: flashcard.created_at,
  };
}

export async function getFlashcardsBySubject(
  subjectId: string,
): Promise<DatabaseFlashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select(flashcardSelect)
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as FlashcardRow[]).map(toDatabaseFlashcard);
}

export async function getAllFlashcards(): Promise<DatabaseFlashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select(flashcardSelect)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as FlashcardRow[]).map(toDatabaseFlashcard);
}

export async function createFlashcard(input: {
  subjectId: string;
  slug: string;
  noteId?: string;
} & FlashcardFields) {
  const { error } = await supabase.from("flashcards").insert({
    ...(input.noteId ? { note_id: input.noteId } : {}),
    subject_id: input.subjectId,
    subtopic_id: input.subtopicId,
    slug: input.slug,
    question: input.question,
    answer: input.answer,
    exam_task: input.examTask,
    question_image_path: input.questionImagePath,
    answer_image_path: input.answerImagePath,
    explanation: input.explanation,
    multiple_choice: input.multipleChoice,
    distractors: input.multipleChoice ? input.distractors : null,
  });

  if (error) {
    throw error;
  }
}

export async function updateFlashcard(id: string, input: FlashcardFields) {
  const { error } = await supabase
    .from("flashcards")
    .update({
      subtopic_id: input.subtopicId,
      question: input.question,
      answer: input.answer,
      exam_task: input.examTask,
      question_image_path: input.questionImagePath,
      answer_image_path: input.answerImagePath,
      explanation: input.explanation,
      multiple_choice: input.multipleChoice,
      distractors: input.multipleChoice ? input.distractors : null,
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
