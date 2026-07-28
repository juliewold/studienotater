import type { PracticeQuestion } from "../../data/practiceQuestions";
import {
  getQuestionProgressForSubject,
} from "./practiceQuestionProgress";

export type PracticeSelectionMode =
  | "recommended"
  | "new"
  | "review"
  | "random";

const shuffle = <T,>(array: T[]) =>
  [...array].sort(() => Math.random() - 0.5);

const weightQuestion = (
  question: PracticeQuestion,
  progress: ReturnType<
    typeof getQuestionProgressForSubject
  >,
) => {
  const status =
    progress.get(question.id)?.status ?? "new";

  switch (status) {
    case "new":
      return 5;

    case "review":
      return 4;

    case "learning":
      return 2;

    case "mastered":
      return 1;
  }
};

export const selectPracticeQuestions = ({
  subjectId,
  questions,
  amount,
  mode,
}: {
  subjectId: string;
  questions: PracticeQuestion[];
  amount: number;
  mode: PracticeSelectionMode;
}) => {
  const progress =
    getQuestionProgressForSubject(subjectId);

  if (mode === "random") {
    return shuffle(questions).slice(0, amount);
  }

  if (mode === "new") {
    return shuffle(
      questions.filter(
        (question) =>
          (progress.get(question.id)?.status ??
            "new") === "new",
      ),
    ).slice(0, amount);
  }

  if (mode === "review") {
    return shuffle(
      questions.filter(
        (question) =>
          progress.get(question.id)?.status ===
          "review",
      ),
    ).slice(0, amount);
  }

  const weightedQuestions = questions.flatMap(
    (question) =>
      Array.from({
        length: weightQuestion(
          question,
          progress,
        ),
      }).map(() => question),
  );

  return shuffle(weightedQuestions)
    .filter(
      (question, index, array) =>
        array.findIndex(
          (candidate) =>
            candidate.id === question.id,
        ) === index,
    )
    .slice(0, amount);
};