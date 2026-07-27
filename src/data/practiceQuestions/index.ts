import type { PracticeQuestion } from "./types";
import { tma4412Questions } from "./tma4412";

export type {
  MultipleChoiceQuestion,
  NumberAnswerQuestion,
  PracticeQuestion,
  QuestionDifficulty,
} from "./types";

export const practiceQuestions: PracticeQuestion[] = [
  ...tma4412Questions,
];