export type QuestionDifficulty = "easy" | "medium" | "hard";

export type MultipleChoiceQuestion = {
  id: string;
  subjectId: string;
  topic: string;
  type: "multiple-choice";
  difficulty: QuestionDifficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type NumberAnswerQuestion = {
  id: string;
  subjectId: string;
  topic: string;
  type: "number-answer";
  difficulty: QuestionDifficulty;
  question: string;
  correctAnswer: number;
  explanation: string;
};

export type PracticeQuestion = MultipleChoiceQuestion | NumberAnswerQuestion;

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "mengder-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "multiple-choice",
    difficulty: "easy",
    question: "Hva er kardinaliteten til mengden {1, 2, 3, 4, 5}?",
    options: ["4", "5", "6", "7"],
    correctAnswer: "5",
    explanation:
      "Kardinaliteten er antall elementer i mengden. Mengden har fem elementer.",
  },
  {
    id: "mengder-2",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question:
      "Hvor mange elementer har potensmengden til en mengde med 3 elementer?",
    correctAnswer: 8,
    explanation:
      "En mengde med n elementer har 2^n delmengder. Her får vi 2^3 = 8.",
  },
  {
    id: "relasjoner-1",
    subjectId: "tma4412",
    topic: "Relasjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question: "Hvilken egenskap beskrives av utsagnet: For alle a gjelder aRa?",
    options: ["Refleksivitet", "Symmetri", "Antisymmetri", "Transitivitet"],
    correctAnswer: "Refleksivitet",
    explanation:
      "En relasjon er refleksiv når hvert element er relatert til seg selv.",
  },
  {
    id: "gcd-1",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "number-answer",
    difficulty: "easy",
    question: "Finn gcd(24, 36).",
    correctAnswer: 12,
    explanation: "Den største felles divisoren til 24 og 36 er 12.",
  },
  {
    id: "kongruens-1",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "number-answer",
    difficulty: "easy",
    question: "Regn ut 17 mod 5.",
    correctAnswer: 2,
    explanation: "17 = 3 · 5 + 2, så resten er 2.",
  },
];
