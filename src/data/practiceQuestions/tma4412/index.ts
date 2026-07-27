import type { PracticeQuestion } from "../types";
import { mengderQuestions } from "./mengder";
import { relasjonerQuestions } from "./relasjoner";

export const tma4412Questions: PracticeQuestion[] = [
  ...mengderQuestions,
  ...relasjonerQuestions,
];