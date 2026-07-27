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
    id: "mengder-kartesisk-produkt-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La A = {1, 2, 3, 4, 5} og B = {a, b, c}. Hvor mange elementer har A × B?",
    correctAnswer: 15,
    explanation:
      "A har 5 elementer og B har 3 elementer. Derfor har A × B totalt 5 · 3 = 15 elementer.",
  },
  {
    id: "mengder-potensmengde-1",
    subjectId: "tma4412",
    topic: "Mengder",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La A = {1, 2, 3, 4, 5}. Hvor mange elementer har potensmengden P(A)?",
    correctAnswer: 32,
    explanation:
      "En mengde med n elementer har 2^n delmengder. Her får vi 2^5 = 32.",
  },
  {
    id: "relasjoner-antall-1",
    subjectId: "tma4412",
    topic: "Relasjoner",
    type: "number-answer",
    difficulty: "medium",
    question:
      "La A = {1, 2, 3, 4, 5}. Hvor mange relasjoner finnes på A?",
    correctAnswer: 33554432,
    explanation:
      "En relasjon på A er en delmengde av A × A. A × A har 25 elementer, så antall relasjoner er 2^25 = 33 554 432.",
  },
  {
    id: "funksjoner-antall-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La A ha 5 elementer og B ha 3 elementer. Hvor mange funksjoner finnes fra A til B?",
    correctAnswer: 243,
    explanation:
      "Hvert av de 5 elementene i A kan sendes til ett av 3 elementer i B. Derfor får vi 3^5 = 243 funksjoner.",
  },
  {
    id: "funksjoner-injektive-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "medium",
    question:
      "La B ha 3 elementer og A ha 5 elementer. Hvor mange injektive funksjoner finnes fra B til A?",
    correctAnswer: 60,
    explanation:
      "Det første elementet kan sendes til 5 steder, det neste til 4 og det siste til 3. Dermed får vi 5 · 4 · 3 = 60.",
  },
  {
    id: "funksjoner-surjektive-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "hard",
    question:
      "La A ha 5 elementer og B ha 3 elementer. Hvor mange surjektive funksjoner finnes fra A til B?",
    correctAnswer: 150,
    explanation:
      "Det finnes totalt 3^5 = 243 funksjoner. Ved inklusjon-eksklusjon får vi 243 - 3·2^5 + 3 = 150 surjektive funksjoner.",
  },

  {
    id: "relasjoner-refleksiv-1",
    subjectId: "tma4412",
    topic: "Relasjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "La R være relasjonen på positive heltall gitt ved xRy dersom x < 2y. Er R refleksiv?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "For alle positive heltall x gjelder x < 2x. Derfor er xRx for alle x, og relasjonen er refleksiv.",
  },
  {
    id: "relasjoner-symmetrisk-1",
    subjectId: "tma4412",
    topic: "Relasjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "La R være relasjonen på positive heltall gitt ved xRy dersom x < 2y. Er R symmetrisk?",
    options: ["Ja", "Nei"],
    correctAnswer: "Nei",
    explanation:
      "Vi har 1R3 fordi 1 < 6, men ikke 3R1 fordi 3 < 2 er usant. Derfor er relasjonen ikke symmetrisk.",
  },
  {
    id: "relasjoner-transitiv-1",
    subjectId: "tma4412",
    topic: "Relasjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "La R være relasjonen på positive heltall gitt ved xRy dersom x < 2y. Er R transitiv?",
    options: ["Ja", "Nei"],
    correctAnswer: "Nei",
    explanation:
      "Vi har 5R3 og 3R2, men ikke 5R2. Derfor er relasjonen ikke transitiv.",
  },
  {
    id: "relasjoner-antisymmetrisk-1",
    subjectId: "tma4412",
    topic: "Relasjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "La R være relasjonen på positive heltall gitt ved xRy dersom x < 2y. Er R antisymmetrisk?",
    options: ["Ja", "Nei"],
    correctAnswer: "Nei",
    explanation:
      "Vi har 2R3 og 3R2, samtidig som 2 ≠ 3. Dermed er relasjonen ikke antisymmetrisk.",
  },

  {
    id: "crt-losbart-1",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Er systemet x ≡ 2 (mod 3) og x ≡ 3 (mod 5) løsbart?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "Modulusene 3 og 5 er relativt primiske. Det kinesiske restteoremet garanterer derfor en løsning.",
  },
  {
    id: "crt-losbart-2",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Er systemet x ≡ 1 (mod 4) og x ≡ 2 (mod 6) løsbart?",
    options: ["Ja", "Nei"],
    correctAnswer: "Nei",
    explanation:
      "Tall som er 1 modulo 4 er oddetall, mens tall som er 2 modulo 6 er partall. Derfor finnes ingen løsning.",
  },
  {
    id: "crt-losbart-3",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "Er systemet x ≡ 2 (mod 6) og x ≡ 8 (mod 9) løsbart?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "Systemet har løsningene x ≡ 8 (mod 18). Modulusene trenger ikke være relativt primiske så lenge kongruensene er kompatible.",
  },

  {
    id: "logikk-klassifisering-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Klassifiser formelen (P ∧ Q) ∨ (¬P ∧ ¬Q).",
    options: [
      "Tautologi",
      "Motsigelse",
      "Ingen av delene",
    ],
    correctAnswer: "Ingen av delene",
    explanation:
      "Formelen er sann når P og Q har samme sannhetsverdi, og usann når de har ulik sannhetsverdi.",
  },
  {
    id: "logikk-klassifisering-2",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Klassifiser formelen ((P ∧ Q) → P) ∧ (P → (P ∨ Q)).",
    options: [
      "Tautologi",
      "Motsigelse",
      "Ingen av delene",
    ],
    correctAnswer: "Tautologi",
    explanation:
      "Begge implikasjonene er alltid sanne. Derfor er også konjunksjonen alltid sann.",
  },
  {
    id: "logikk-klassifisering-3",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Klassifiser formelen P ∧ (¬P ∨ Q).",
    options: [
      "Tautologi",
      "Motsigelse",
      "Ingen av delene",
    ],
    correctAnswer: "Ingen av delene",
    explanation:
      "Formelen er ekvivalent med P ∧ Q. Den kan derfor være både sann og usann.",
  },
  {
    id: "logikk-klassifisering-4",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Klassifiser formelen (P ∨ Q) ∧ (¬P ∧ ¬Q).",
    options: [
      "Tautologi",
      "Motsigelse",
      "Ingen av delene",
    ],
    correctAnswer: "Motsigelse",
    explanation:
      "P ∨ Q krever at minst ett utsagn er sant, mens ¬P ∧ ¬Q krever at begge er usanne. Det kan aldri skje samtidig.",
  },
  {
    id: "logikk-klassifisering-5",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Klassifiser formelen (P ∧ ¬Q) ∨ (¬P ∧ Q).",
    options: [
      "Tautologi",
      "Motsigelse",
      "Ingen av delene",
    ],
    correctAnswer: "Ingen av delene",
    explanation:
      "Formelen er sann når nøyaktig ett av P og Q er sant, og usann ellers.",
  },

  {
    id: "kombinatorikk-passord-1",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "hard",
    question:
      "Et passord har 6 tegn. Det første tegnet må være en av 29 små norske bokstaver. De fem siste tegnene kan være bokstaver eller sifre, totalt 39 muligheter per tegn. Passordet må inneholde minst ett siffer. Hvor mange passord finnes?",
    correctAnswer: 2021678450,
    explanation:
      "Det finnes 29·39^5 mulige strenger med bokstav først. Vi trekker fra de 29^6 som bare inneholder bokstaver. Svaret blir 29·39^5 - 29^6 = 2 021 678 450.",
  },
  {
    id: "kombinatorikk-anagram-1",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Hvor mange forskjellige anagrammer kan lages av bokstavene i EKSAMENSFEST?",
    correctAnswer: 13305600,
    explanation:
      "Ordet har 12 bokstaver, med 3 E-er og 3 S-er. Antallet blir 12! / (3!·3!) = 13 305 600.",
  },
];