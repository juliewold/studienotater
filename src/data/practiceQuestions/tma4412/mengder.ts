import type { PracticeQuestion } from "../types";

export const mengderQuestions: PracticeQuestion[] = [
  {
    id: "mengder-kartesisk-produkt-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $A = \\{1,2,3,4,5\\}$ og $B = \\{a,b,c\\}$. Hvor mange elementer har $A \\times B$?",
    correctAnswer: 15,
    explanation:
      "$|A| = 5$ og $|B| = 3$. Derfor er $|A \\times B| = 5 \\cdot 3 = 15$.",
  },
  {
    id: "mengder-potensmengde-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $A = \\{1,2,3,4,5\\}$. Hvor mange elementer har potensmengden $\\mathcal{P}(A)$?",
    correctAnswer: 32,
    explanation:
      "En mengde med $n$ elementer har $2^n$ delmengder. Her får vi $2^5 = 32$.",
  },
  {
    id: "mengder-kardinalitet-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "multiple-choice",
    difficulty: "easy",
    question: "Hva er kardinaliteten til mengden $A = \\{2,4,6,8\\}$?",
    options: ["2", "4", "6", "8"],
    correctAnswer: "4",
    explanation:
      "Kardinaliteten er antall elementer i mengden. Mengden har fire elementer, så $|A| = 4$.",
  },
  {
    id: "mengder-duplikater-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question: "Hvor mange elementer har mengden $A = \\{1,1,2,2,3,3\\}$?",
    correctAnswer: 3,
    explanation:
      "Et element telles bare én gang i en mengde. Derfor er $A = \\{1,2,3\\}$ og $|A| = 3$.",
  },
  {
    id: "mengder-potensmengde-2",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question: "En mengde har $4$ elementer. Hvor mange delmengder har den?",
    correctAnswer: 16,
    explanation:
      "En mengde med $n$ elementer har $2^n$ delmengder. Dermed får vi $2^4 = 16$.",
  },
  {
    id: "mengder-potensmengde-3",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Potensmengden $\\mathcal{P}(A)$ har $64$ elementer. Hvor mange elementer har $A$?",
    correctAnswer: 6,
    explanation:
      "Vi må løse $2^{|A|} = 64$. Siden $64 = 2^6$, har mengden $A$ seks elementer.",
  },
  {
    id: "mengder-kartesisk-produkt-2",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question:
      "Mengden $A$ har $6$ elementer og mengden $B$ har $4$ elementer. Hvor mange elementer har $A \\times B$?",
    correctAnswer: 24,
    explanation: "$|A \\times B| = |A| \\cdot |B| = 6 \\cdot 4 = 24$.",
  },
  {
    id: "mengder-kartesisk-produkt-3",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Mengden $A \\times B$ har $35$ elementer, og $A$ har $5$ elementer. Hvor mange elementer har $B$?",
    correctAnswer: 7,
    explanation:
      "Vi har $|A \\times B| = |A| \\cdot |B|$. Dermed er $35 = 5 \\cdot |B|$, så $|B| = 7$.",
  },
  {
    id: "mengder-union-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $A = \\{1,2,3\\}$ og $B = \\{3,4,5\\}$. Hvor mange elementer har $A \\cup B$?",
    correctAnswer: 5,
    explanation:
      "$A \\cup B = \\{1,2,3,4,5\\}$. Elementet $3$ tas bare med én gang.",
  },
  {
    id: "mengder-snitt-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $A = \\{1,2,3,4\\}$ og $B = \\{3,4,5,6\\}$. Hvor mange elementer har $A \\cap B$?",
    correctAnswer: 2,
    explanation: "$A \\cap B = \\{3,4\\}$, så snittet har to elementer.",
  },
  {
    id: "mengder-differanse-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $A = \\{1,2,3,4,5\\}$ og $B = \\{2,4,6\\}$. Hvor mange elementer har $A \\setminus B$?",
    correctAnswer: 3,
    explanation:
      "$A \\setminus B = \\{1,3,5\\}$, så mengden har tre elementer.",
  },
  {
    id: "mengder-inklusjon-eksklusjon-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Vi har $|A| = 12$, $|B| = 9$ og $|A \\cap B| = 4$. Finn $|A \\cup B|$.",
    correctAnswer: 17,
    explanation:
      "Ved inklusjon-eksklusjon får vi $|A \\cup B| = |A| + |B| - |A \\cap B| = 12 + 9 - 4 = 17$.",
  },
  {
    id: "mengder-inklusjon-eksklusjon-2",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Vi har $|A \\cup B| = 20$, $|A| = 13$ og $|B| = 11$. Finn $|A \\cap B|$.",
    correctAnswer: 4,
    explanation:
      "Fra $|A \\cup B| = |A| + |B| - |A \\cap B|$ får vi $20 = 13 + 11 - |A \\cap B|$. Dermed er $|A \\cap B| = 4$.",
  },
  {
    id: "mengder-delmengde-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "La $A = \\{1,2\\}$ og $B = \\{1,2,3\\}$. Gjelder $A \\subseteq B$?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "Alle elementene i $A$ finnes også i $B$. Derfor er $A \\subseteq B$.",
  },
  {
    id: "mengder-delmengde-2",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "multiple-choice",
    difficulty: "easy",
    question: "Gjelder $\\varnothing \\subseteq A$ for enhver mengde $A$?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation: "Den tomme mengden er en delmengde av enhver mengde.",
  },
  {
    id: "mengder-tom-mengde-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question: "Hvor mange elementer har den tomme mengden $\\varnothing$?",
    correctAnswer: 0,
    explanation:
      "Den tomme mengden inneholder ingen elementer, så $|\\varnothing| = 0$.",
  },
  {
    id: "mengder-potensmengde-tom-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Hvor mange elementer har potensmengden $\\mathcal{P}(\\varnothing)$?",
    correctAnswer: 1,
    explanation:
      "Den tomme mengden har én delmengde, nemlig seg selv. Derfor er $\\mathcal{P}(\\varnothing) = \\{\\varnothing\\}$.",
  },
  {
    id: "mengder-disjunkte-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "La $A = \\{1,3,5\\}$ og $B = \\{2,4,6\\}$. Er $A$ og $B$ disjunkte?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "Mengdene har ingen felles elementer, altså er $A \\cap B = \\varnothing$.",
  },
  {
    id: "mengder-komplement-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Universalmengden $U$ har $20$ elementer, og $A \\subseteq U$ har $7$ elementer. Hvor mange elementer har komplementet $A^c$?",
    correctAnswer: 13,
    explanation:
      "$A^c$ inneholder elementene i $U$ som ikke ligger i $A$. Derfor er $|A^c| = 20 - 7 = 13$.",
  },
  {
    id: "mengder-de-morgan-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "multiple-choice",
    difficulty: "medium",
    question: "Hvilket uttrykk er lik $(A \\cup B)^c$?",
    options: [
      "$A^c \\cap B^c$",
      "$A^c \\cup B^c$",
      "$A \\cap B$",
      "$A \\cup B$",
    ],
    correctAnswer: "$A^c \\cap B^c$",
    explanation: "De Morgans lov sier at $(A \\cup B)^c = A^c \\cap B^c$.",
  },
];
