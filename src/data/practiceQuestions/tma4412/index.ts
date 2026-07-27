import type { PracticeQuestion } from "../types";
import { funksjonerQuestions } from "./funksjoner";
import { mengderQuestions } from "./mengder";
import { relasjonerQuestions } from "./relasjoner";
import { utsagnslogikkQuestions } from "./utsagnslogikk";

export const tma4412Questions: PracticeQuestion[] = [
  ...mengderQuestions,
  ...relasjonerQuestions,
  ...funksjonerQuestions,
  ...utsagnslogikkQuestions,
];