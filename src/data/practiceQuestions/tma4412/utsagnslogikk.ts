import type { PracticeQuestion } from "../types";

export const utsagnslogikkQuestions: PracticeQuestion[] = [
  {
    id: "logikk-negasjon-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Hva er negasjonen av utsagnet $P$?",
    options: ["$\\neg P$", "$P \\land P$", "$P \\lor P$", "$P \\to P$"],
    correctAnswer: "$\\neg P$",
    explanation:
      "Negasjonen av $P$ skrives $\\neg P$ og har motsatt sannhetsverdi av $P$.",
  },
  {
    id: "logikk-og-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Når er $P \\land Q$ sann?",
    options: [
      "Bare når både $P$ og $Q$ er sanne",
      "Når minst ett av utsagnene er sant",
      "Bare når begge er usanne",
      "Alltid",
    ],
    correctAnswer:
      "Bare når både $P$ og $Q$ er sanne",
    explanation:
      "En konjunksjon er sann bare når begge utsagnene er sanne.",
  },
  {
    id: "logikk-eller-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Når er $P \\lor Q$ usann?",
    options: [
      "Bare når både $P$ og $Q$ er usanne",
      "Når minst ett utsagn er sant",
      "Bare når begge er sanne",
      "Aldri",
    ],
    correctAnswer:
      "Bare når både $P$ og $Q$ er usanne",
    explanation:
      "En disjunksjon er usann bare når begge utsagnene er usanne.",
  },
  {
    id: "logikk-implikasjon-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Når er implikasjonen $P \\to Q$ usann?",
    options: [
      "Når $P=1$ og $Q=0$",
      "Når $P=0$ og $Q=1$",
      "Når $P=1$ og $Q=1$",
      "Når $P=0$ og $Q=0$",
    ],
    correctAnswer:
      "Når $P=1$ og $Q=0$",
    explanation:
      "En implikasjon er bare usann når forleddet er sant og etterleddet er usant.",
  },
  {
    id: "logikk-bikondisjon-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Når er $P \\leftrightarrow Q$ sann?",
    options: [
      "Når $P$ og $Q$ har samme sannhetsverdi",
      "Bare når $P=1$",
      "Bare når $Q=0$",
      "Når $P$ og $Q$ har ulik sannhetsverdi",
    ],
    correctAnswer:
      "Når $P$ og $Q$ har samme sannhetsverdi",
    explanation:
      "En bikondisjon er sann når begge utsagnene har samme sannhetsverdi.",
  },
  {
    id: "logikk-verdi-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $P=1$ og $Q=0$. Hva er sannhetsverdien til $P \\land Q$?",
    correctAnswer: 0,
    explanation:
      "$1 \\land 0 = 0$ fordi begge utsagnene må være sanne.",
  },
  {
    id: "logikk-verdi-2",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $P=1$ og $Q=0$. Hva er sannhetsverdien til $P \\lor Q$?",
    correctAnswer: 1,
    explanation:
      "$1 \\lor 0 = 1$ fordi minst ett av utsagnene er sant.",
  },
  {
    id: "logikk-verdi-3",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $P=1$ og $Q=0$. Hva er sannhetsverdien til $P \\to Q$?",
    correctAnswer: 0,
    explanation:
      "$1 \\to 0 = 0$. Dette er den eneste situasjonen der en implikasjon er usann.",
  },
  {
    id: "logikk-verdi-4",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $P=0$ og $Q=0$. Hva er sannhetsverdien til $P \\to Q$?",
    correctAnswer: 1,
    explanation:
      "Når forleddet er usant, er implikasjonen sann.",
  },
  {
    id: "logikk-verdi-5",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "number-answer",
    difficulty: "medium",
    question:
      "La $P=1$, $Q=0$ og $R=1$. Finn sannhetsverdien til $(P \\land Q) \\lor R$.",
    correctAnswer: 1,
    explanation:
      "Først får vi $P \\land Q = 1 \\land 0 = 0$. Deretter blir $0 \\lor 1 = 1$.",
  },
  {
    id: "logikk-verdi-6",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "number-answer",
    difficulty: "medium",
    question:
      "La $P=0$ og $Q=1$. Finn sannhetsverdien til $\\neg P \\land Q$.",
    correctAnswer: 1,
    explanation:
      "Siden $P=0$, er $\\neg P=1$. Dermed får vi $1 \\land 1=1$.",
  },
  {
    id: "logikk-ekvivalens-implikasjon-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Hvilket uttrykk er logisk ekvivalent med $P \\to Q$?",
    options: [
      "$\\neg P \\lor Q$",
      "$P \\land Q$",
      "$P \\lor \\neg Q$",
      "$\\neg P \\land Q$",
    ],
    correctAnswer:
      "$\\neg P \\lor Q$",
    explanation:
      "Implikasjonen $P \\to Q$ er logisk ekvivalent med $\\neg P \\lor Q$.",
  },
  {
    id: "logikk-kontraposisjon-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Hva er kontraposisjonen til $P \\to Q$?",
    options: [
      "$\\neg Q \\to \\neg P$",
      "$Q \\to P$",
      "$\\neg P \\to \\neg Q$",
      "$P \\to \\neg Q$",
    ],
    correctAnswer:
      "$\\neg Q \\to \\neg P$",
    explanation:
      "En implikasjon og dens kontraposisjon er logisk ekvivalente.",
  },
  {
    id: "logikk-omvendt-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Hva er det omvendte utsagnet til $P \\to Q$?",
    options: [
      "$Q \\to P$",
      "$\\neg Q \\to \\neg P$",
      "$\\neg P \\to \\neg Q$",
      "$P \\leftrightarrow Q$",
    ],
    correctAnswer:
      "$Q \\to P$",
    explanation:
      "Det omvendte utsagnet får vi ved å bytte plass på forledd og etterledd.",
  },
  {
    id: "logikk-de-morgan-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Hvilket uttrykk er ekvivalent med $\\neg(P \\land Q)$?",
    options: [
      "$\\neg P \\lor \\neg Q$",
      "$\\neg P \\land \\neg Q$",
      "$P \\lor Q$",
      "$P \\land Q$",
    ],
    correctAnswer:
      "$\\neg P \\lor \\neg Q$",
    explanation:
      "De Morgans lov sier at $\\neg(P \\land Q) \\equiv \\neg P \\lor \\neg Q$.",
  },
  {
    id: "logikk-de-morgan-2",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Hvilket uttrykk er ekvivalent med $\\neg(P \\lor Q)$?",
    options: [
      "$\\neg P \\land \\neg Q$",
      "$\\neg P \\lor \\neg Q$",
      "$P \\land Q$",
      "$P \\lor Q$",
    ],
    correctAnswer:
      "$\\neg P \\land \\neg Q$",
    explanation:
      "De Morgans lov sier at $\\neg(P \\lor Q) \\equiv \\neg P \\land \\neg Q$.",
  },
  {
    id: "logikk-tautologi-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Klassifiser formelen $P \\lor \\neg P$.",
    options: [
      "Tautologi",
      "Kontradiksjon",
      "Kontingens",
    ],
    correctAnswer: "Tautologi",
    explanation:
      "Uansett om $P$ er sann eller usann, er $P \\lor \\neg P$ sann.",
  },
  {
    id: "logikk-kontradiksjon-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Klassifiser formelen $P \\land \\neg P$.",
    options: [
      "Tautologi",
      "Kontradiksjon",
      "Kontingens",
    ],
    correctAnswer: "Kontradiksjon",
    explanation:
      "Et utsagn og dets negasjon kan aldri være sanne samtidig.",
  },
  {
    id: "logikk-kontingens-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Klassifiser formelen $P \\land Q$.",
    options: [
      "Tautologi",
      "Kontradiksjon",
      "Kontingens",
    ],
    correctAnswer: "Kontingens",
    explanation:
      "Formelen er sann for noen sannhetsverdier og usann for andre.",
  },
  {
    id: "logikk-tautologi-2",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "Klassifiser formelen $((P \\land Q) \\to P)$.",
    options: [
      "Tautologi",
      "Kontradiksjon",
      "Kontingens",
    ],
    correctAnswer: "Tautologi",
    explanation:
      "Hvis $P \\land Q$ er sann, er $P$ nødvendigvis sann. Hvis forleddet er usant, er implikasjonen også sann.",
  },
  {
    id: "logikk-tautologi-3",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "Klassifiser formelen $(P \\to Q) \\lor (Q \\to P)$.",
    options: [
      "Tautologi",
      "Kontradiksjon",
      "Kontingens",
    ],
    correctAnswer: "Tautologi",
    explanation:
      "For alle kombinasjoner av sannhetsverdier er minst én av de to implikasjonene sann.",
  },
  {
    id: "logikk-kontingens-2",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "Klassifiser formelen $(P \\land Q) \\lor (\\neg P \\land \\neg Q)$.",
    options: [
      "Tautologi",
      "Kontradiksjon",
      "Kontingens",
    ],
    correctAnswer: "Kontingens",
    explanation:
      "Formelen er sann når $P$ og $Q$ har samme sannhetsverdi, men usann når de har ulik sannhetsverdi.",
  },
  {
    id: "logikk-kontradiksjon-2",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "Klassifiser formelen $(P \\lor Q) \\land (\\neg P \\land \\neg Q)$.",
    options: [
      "Tautologi",
      "Kontradiksjon",
      "Kontingens",
    ],
    correctAnswer: "Kontradiksjon",
    explanation:
      "Andre del krever at både $P$ og $Q$ er usanne, men da er $P \\lor Q$ usann.",
  },
  {
    id: "logikk-xor-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "Hva uttrykker formelen $(P \\land \\neg Q) \\lor (\\neg P \\land Q)$?",
    options: [
      "Nøyaktig ett av $P$ og $Q$ er sant",
      "Begge er sanne",
      "Begge er usanne",
      "$P$ medfører $Q$",
    ],
    correctAnswer:
      "Nøyaktig ett av $P$ og $Q$ er sant",
    explanation:
      "Formelen er eksklusiv eller, ofte skrevet XOR.",
  },
  {
    id: "logikk-antall-rader-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "number-answer",
    difficulty: "easy",
    question:
      "Hvor mange rader har en sannhetstabell med $3$ utsagnsvariabler?",
    correctAnswer: 8,
    explanation:
      "Med $n$ utsagnsvariabler får vi $2^n$ rader. Her blir det $2^3=8$.",
  },
  {
    id: "logikk-antall-rader-2",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Hvor mange rader har en sannhetstabell med $5$ utsagnsvariabler?",
    correctAnswer: 32,
    explanation:
      "Antallet rader er $2^5=32$.",
  },
  {
    id: "logikk-ekvivalens-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "Hvilket uttrykk er ekvivalent med $P \\leftrightarrow Q$?",
    options: [
      "$(P \\to Q) \\land (Q \\to P)$",
      "$(P \\to Q) \\lor (Q \\to P)$",
      "$P \\land Q$",
      "$P \\lor Q$",
    ],
    correctAnswer:
      "$(P \\to Q) \\land (Q \\to P)$",
    explanation:
      "En bikondisjon betyr at begge implikasjonene må gjelde.",
  },
  {
    id: "logikk-forenkling-1",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "Forenkle $P \\land (P \\lor Q)$.",
    options: [
      "$P$",
      "$Q$",
      "$P \\lor Q$",
      "$P \\land Q$",
    ],
    correctAnswer: "$P$",
    explanation:
      "Ved absorpsjonsloven gjelder $P \\land (P \\lor Q) \\equiv P$.",
  },
  {
    id: "logikk-forenkling-2",
    subjectId: "tma4412",
    topic: "Utsagnslogikk",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "Forenkle $P \\lor (P \\land Q)$.",
    options: [
      "$P$",
      "$Q$",
      "$P \\land Q$",
      "$P \\lor Q$",
    ],
    correctAnswer: "$P$",
    explanation:
      "Ved absorpsjonsloven gjelder $P \\lor (P \\land Q) \\equiv P$.",
  },
];