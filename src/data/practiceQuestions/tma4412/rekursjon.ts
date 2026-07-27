import type { PracticeQuestion } from "../types";

export const rekursjonQuestions: PracticeQuestion[] = [
  {
    id: "tma4412-rekursjon-1",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "multiple-choice",
    question: "Hva beskriver en rekursiv definisjon?",
    options: [
      "En definisjon som bare bruker lukkede formler",
      "En definisjon som beskriver et objekt ved hjelp av tidligere verdier",
      "En definisjon som alltid inneholder et induksjonsbevis",
      "En definisjon som bare brukes i programmering",
    ],
    correctAnswer:
      "En definisjon som beskriver et objekt ved hjelp av tidligere verdier",
    explanation:
      "En rekursiv definisjon bygger nye verdier ved hjelp av tidligere verdier. Den må også ha ett eller flere basissteg som rekursjonen kan starte fra.",
  },
  {
    id: "tma4412-rekursjon-2",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "multiple-choice",
    question:
      "Hvilken del av en rekursiv definisjon gjør at rekursjonen kan starte?",
    options: [
      "Induksjonssteget",
      "Basissteget",
      "Sluttsteget",
      "Rekursjonssteget alene",
    ],
    correctAnswer: "Basissteget",
    explanation:
      "Basissteget gir den første kjente verdien. Uten en startverdi kan ikke rekursjonsregelen brukes.",
  },
  {
    id: "tma4412-rekursjon-3",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "multiple-choice",
    question: "Hva brukes rekursjonsregelen til?",
    options: [
      "Å avslutte rekursjonen",
      "Å beregne nye verdier fra tidligere verdier",
      "Å finne det største elementet i en mengde",
      "Å bevise at basissteget er riktig",
    ],
    correctAnswer: "Å beregne nye verdier fra tidligere verdier",
    explanation:
      "Rekursjonsregelen forteller hvordan en ny verdi kan beregnes når tidligere verdier allerede er kjent.",
  },
  {
    id: "tma4412-rekursjon-4",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "multiple-choice",
    question: "Hvilken av følgende er en rekursiv definisjon?",
    options: [
      "$a_n=2n+1$",
      "$a_1=3$ og $a_n=a_{n-1}+2$ for $n\\geq 2$",
      "$a_n=n^2$",
      "$a_n=5n$",
    ],
    correctAnswer: "$a_1=3$ og $a_n=a_{n-1}+2$ for $n\\geq 2$",
    explanation:
      "Denne definisjonen er rekursiv fordi $a_n$ blir definert ved hjelp av den tidligere verdien $a_{n-1}$. De andre er eksplisitte formler.",
  },
  {
    id: "tma4412-rekursjon-5",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_1=2$ og $a_n=a_{n-1}+3$ for $n\\geq 2$. Hva er $a_2$?",
    correctAnswer: 5,
    explanation: "Sett $n=2$: $a_2=a_1+3=2+3=5$.",
  },
  {
    id: "tma4412-rekursjon-6",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_1=2$ og $a_n=a_{n-1}+3$ for $n\\geq 2$. Hva er $a_3$?",
    correctAnswer: 8,
    explanation: "Først får vi $a_2=2+3=5$. Deretter blir $a_3=a_2+3=5+3=8$.",
  },
  {
    id: "tma4412-rekursjon-7",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_1=2$ og $a_n=a_{n-1}+3$ for $n\\geq 2$. Hva er $a_4$?",
    correctAnswer: 11,
    explanation: "$a_2=5$, $a_3=8$ og $a_4=8+3=11$.",
  },
  {
    id: "tma4412-rekursjon-8",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_1=4$ og $a_n=2a_{n-1}$ for $n\\geq 2$. Hva er $a_3$?",
    correctAnswer: 16,
    explanation: "$a_2=2a_1=2\\cdot4=8$. Deretter er $a_3=2a_2=2\\cdot8=16$.",
  },
  {
    id: "tma4412-rekursjon-9",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_1=5$ og $a_n=a_{n-1}-1$ for $n\\geq 2$. Hva er $a_5$?",
    correctAnswer: 1,
    explanation: "Følgen blir $5,4,3,2,1,\\ldots$. Derfor er $a_5=1$.",
  },
  {
    id: "tma4412-rekursjon-10",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "easy",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_1=1$ og $a_n=2a_{n-1}+1$ for $n\\geq 2$. Hva er $a_3$?",
    correctAnswer: 7,
    explanation: "$a_2=2\\cdot1+1=3$. Deretter er $a_3=2\\cdot3+1=7$.",
  },
  {
    id: "tma4412-rekursjon-11",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "medium",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_0=3$ og $a_n=a_{n-1}+2n$ for $n\\geq 1$. Hva er $a_3$?",
    correctAnswer: 15,
    explanation:
      "$a_1=3+2\\cdot1=5$, $a_2=5+2\\cdot2=9$ og $a_3=9+2\\cdot3=15$.",
  },
  {
    id: "tma4412-rekursjon-12",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "medium",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_0=2$, $a_1=3$ og $a_n=a_{n-1}+a_{n-2}$ for $n\\geq 2$. Hva er $a_4$?",
    correctAnswer: 13,
    explanation: "$a_2=3+2=5$, $a_3=5+3=8$ og $a_4=8+5=13$.",
  },
  {
    id: "tma4412-rekursjon-13",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "medium",
    type: "multiple-choice",
    question:
      "Følgen $2,5,8,11,\\ldots$ skal defineres rekursivt. Hvilken definisjon passer?",
    options: [
      "$a_1=2$ og $a_n=a_{n-1}+3$",
      "$a_1=2$ og $a_n=3a_{n-1}$",
      "$a_1=2$ og $a_n=a_{n-1}+2$",
      "$a_1=5$ og $a_n=a_{n-1}+3$",
    ],
    correctAnswer: "$a_1=2$ og $a_n=a_{n-1}+3$",
    explanation:
      "Første ledd er 2, og forskjellen mellom to påfølgende ledd er alltid 3.",
  },
  {
    id: "tma4412-rekursjon-14",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "medium",
    type: "multiple-choice",
    question:
      "Følgen $3,6,12,24,\\ldots$ skal defineres rekursivt. Hvilken definisjon passer?",
    options: [
      "$a_1=3$ og $a_n=a_{n-1}+3$",
      "$a_1=3$ og $a_n=2a_{n-1}$",
      "$a_1=6$ og $a_n=2a_{n-1}$",
      "$a_1=3$ og $a_n=a_{n-1}^2$",
    ],
    correctAnswer: "$a_1=3$ og $a_n=2a_{n-1}$",
    explanation:
      "Følgen starter på 3, og hvert nytt ledd er dobbelt så stort som det forrige.",
  },
  {
    id: "tma4412-rekursjon-15",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "medium",
    type: "multiple-choice",
    question:
      "Hva er forskjellen mellom en eksplisitt og en rekursiv formel for en følge?",
    options: [
      "En eksplisitt formel gir $a_n$ direkte fra $n$, mens en rekursiv formel bruker tidligere ledd",
      "En rekursiv formel gir alltid svaret raskere",
      "En eksplisitt formel trenger alltid to basisverdier",
      "Det er ingen forskjell",
    ],
    correctAnswer:
      "En eksplisitt formel gir $a_n$ direkte fra $n$, mens en rekursiv formel bruker tidligere ledd",
    explanation:
      "I en eksplisitt formel kan $a_n$ beregnes direkte fra $n$. I en rekursiv definisjon må man vanligvis kjenne ett eller flere tidligere ledd.",
  },
  {
    id: "tma4412-rekursjon-16",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "medium",
    type: "number-answer",
    question:
      "La $f(0)=1$ og $f(n)=n\\cdot f(n-1)$ for $n\\geq1$. Hva er $f(4)$?",
    correctAnswer: 24,
    explanation:
      "$f(1)=1$, $f(2)=2$, $f(3)=6$ og $f(4)=4\\cdot6=24$. Dette er den rekursive definisjonen av fakultet.",
  },
  {
    id: "tma4412-rekursjon-17",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "medium",
    type: "number-answer",
    question: "La $f(0)=2$ og $f(n)=f(n-1)+2n+1$ for $n\\geq1$. Hva er $f(3)$?",
    correctAnswer: 17,
    explanation: "$f(1)=2+3=5$, $f(2)=5+5=10$ og $f(3)=10+7=17$.",
  },
  {
    id: "tma4412-rekursjon-18",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "hard",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_0=1$ og $a_n=3a_{n-1}-2$ for $n\\geq1$. Hva er $a_4$?",
    correctAnswer: 1,
    explanation:
      "$a_1=3\\cdot1-2=1$. Den samme beregningen gir derfor $a_2=a_3=a_4=1$.",
  },
  {
    id: "tma4412-rekursjon-19",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "hard",
    type: "number-answer",
    question:
      "Følgen er definert ved $a_0=0$, $a_1=1$ og $a_n=2a_{n-1}+a_{n-2}$ for $n\\geq2$. Hva er $a_5$?",
    correctAnswer: 29,
    explanation:
      "$a_2=2\\cdot1+0=2$, $a_3=2\\cdot2+1=5$, $a_4=2\\cdot5+2=12$ og $a_5=2\\cdot12+5=29$.",
  },
  {
    id: "tma4412-rekursjon-20",
    subjectId: "tma4412",
    topic: "Rekursjon",
    difficulty: "hard",
    type: "multiple-choice",
    question:
      "En følge er definert ved $a_1=1$ og $a_n=a_{n-1}+2n-1$ for $n\\geq2$. Hvilke tall beskriver følgen?",
    options: [
      "Kvadrattallene $1,4,9,16,\\ldots$",
      "Partallene $2,4,6,8,\\ldots$",
      "Oddetallene $1,3,5,7,\\ldots$",
      "Potensene av 2: $1,2,4,8,\\ldots$",
    ],
    correctAnswer: "Kvadrattallene $1,4,9,16,\\ldots$",
    explanation:
      "Vi får $a_2=1+3=4$, $a_3=4+5=9$ og $a_4=9+7=16$. Når det neste oddetallet legges til et kvadrattall, får vi det neste kvadrattallet.",
  },
];
