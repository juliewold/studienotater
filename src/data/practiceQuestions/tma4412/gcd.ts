import type { PracticeQuestion } from "../types";

export const gcdQuestions: PracticeQuestion[] = [
  {
    id: "gcd-1",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["gcd", "teori"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hva står forkortelsen gcd for?",

    options: [
      "Greatest Common Divisor",
      "General Common Division",
      "Greatest Calculated Difference",
      "Global Common Divisor",
    ],

    correctAnswer: "Greatest Common Divisor",

    explanation:
      "gcd(a, b) er den største positive divisoren som deler både a og b.",
  },

  {
    id: "gcd-2",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["gcd"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hva betyr gcd(12, 18)?",

    options: [
      "Den største positive faktoren som deler både 12 og 18.",
      "Summen av 12 og 18.",
      "Produktet av 12 og 18.",
      "Forskjellen mellom 12 og 18.",
    ],

    correctAnswer:
      "Den største positive faktoren som deler både 12 og 18.",

    explanation:
      "gcd finner den største felles divisoren til de to tallene.",
  },

  {
    id: "gcd-3",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["gcd", "regning"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hva er gcd(8, 12)?",

    options: [
      "4",
      "2",
      "6",
      "24",
    ],

    correctAnswer: "4",

    explanation:
      "4 er den største positive divisoren som deler både 8 og 12.",
  },

  {
    id: "gcd-4",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["gcd", "regning"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hva er gcd(15, 25)?",

    options: [
      "5",
      "10",
      "15",
      "1",
    ],

    correctAnswer: "5",

    explanation:
      "5 er den største positive divisoren som deler både 15 og 25.",
  },

  {
    id: "gcd-5",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["gcd", "teori"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hva betyr det dersom gcd(a, b) = 1?",

    options: [
      "Tallene er relativt primiske.",
      "Tallene er begge primtall.",
      "Tallene er like.",
      "Tallene er partall.",
    ],

    correctAnswer:
      "Tallene er relativt primiske.",

    explanation:
      "To tall med gcd = 1 har ingen felles positive divisor større enn 1.",
  },
];