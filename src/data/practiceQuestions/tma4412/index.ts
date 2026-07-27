import type { PracticeQuestion } from "../types";
import { funksjonerQuestions } from "./funksjoner";
import { mengderQuestions } from "./mengder";
import { relasjonerQuestions } from "./relasjoner";
import { utsagnslogikkQuestions } from "./utsagnslogikk";
import { predikatlogikkQuestions } from "./predikatlogikk";
import { bevisteknikkerQuestions } from "./bevisteknikker";
import { induksjonQuestions } from "./induksjon";
import { gcdQuestions } from "./gcd";
import { kongruensQuestions } from "./kongruens";

export const tma4412Questions: PracticeQuestion[] = [
  ...mengderQuestions,
  ...relasjonerQuestions,
  ...funksjonerQuestions,
  ...utsagnslogikkQuestions,
  ...predikatlogikkQuestions,
  ...bevisteknikkerQuestions,
  ...induksjonQuestions,
  ...gcdQuestions,
  ...kongruensQuestions,
];
