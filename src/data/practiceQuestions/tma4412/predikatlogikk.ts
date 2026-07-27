import type { PracticeQuestion } from "../types";

export const predikatlogikkQuestions: PracticeQuestion[] = [
  {
    id: "predikat-kvantor-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kvantorer", "universalkvantor"],
    estimatedTime: 1,
    examFrequency: "medium",
    question: "Hva betyr kvantoren $\\forall$?",
    options: [
      "For alle",
      "Det finnes minst én",
      "Det finnes nøyaktig én",
      "Ingen",
    ],
    correctAnswer: "For alle",
    explanation:
      "$\\forall$ er universalkvantoren og betyr «for alle».",
  },
  {
    id: "predikat-kvantor-2",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kvantorer", "eksistenskvantor"],
    estimatedTime: 1,
    examFrequency: "medium",
    question: "Hva betyr kvantoren $\\exists$?",
    options: [
      "Det finnes minst én",
      "For alle",
      "Det finnes nøyaktig én",
      "Ingen",
    ],
    correctAnswer: "Det finnes minst én",
    explanation:
      "$\\exists$ er eksistenskvantoren og betyr at det finnes minst ett element.",
  },
  {
    id: "predikat-tolkning-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kvantorer", "universalkvantor"],
    estimatedTime: 1,
    examFrequency: "medium",
    question:
      "Hva betyr utsagnet $\\forall x\\in A\\;P(x)$?",
    options: [
      "$P(x)$ gjelder for alle elementer i $A$",
      "$P(x)$ gjelder for minst ett element i $A$",
      "$P(x)$ gjelder ikke for noen elementer i $A$",
      "$P(x)$ gjelder for nøyaktig ett element i $A$",
    ],
    correctAnswer:
      "$P(x)$ gjelder for alle elementer i $A$",
    explanation:
      "Universalkvantoren krever at predikatet er sant for hvert element i mengden.",
  },
  {
    id: "predikat-tolkning-2",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kvantorer", "eksistenskvantor"],
    estimatedTime: 1,
    examFrequency: "medium",
    question:
      "Hva betyr utsagnet $\\exists x\\in A\\;P(x)$?",
    options: [
      "Det finnes minst ett element i $A$ som oppfyller $P$",
      "Alle elementene i $A$ oppfyller $P$",
      "Ingen elementer i $A$ oppfyller $P$",
      "Nøyaktig to elementer i $A$ oppfyller $P$",
    ],
    correctAnswer:
      "Det finnes minst ett element i $A$ som oppfyller $P$",
    explanation:
      "Eksistenskvantoren krever bare at predikatet er sant for minst ett element.",
  },
  {
    id: "predikat-oversettelse-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["oversettelse", "universalkvantor"],
    estimatedTime: 1,
    examFrequency: "high",
    question:
      "La $S(x)$ bety «$x$ er student». Hvordan skrives «Alle personer er studenter»?",
    options: [
      "$\\forall x\\;S(x)$",
      "$\\exists x\\;S(x)$",
      "$\\forall x\\;\\neg S(x)$",
      "$\\neg\\exists x\\;S(x)$",
    ],
    correctAnswer: "$\\forall x\\;S(x)$",
    explanation:
      "Ordet «alle» uttrykkes med universalkvantoren $\\forall$.",
  },
  {
    id: "predikat-oversettelse-2",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["oversettelse", "eksistenskvantor"],
    estimatedTime: 1,
    examFrequency: "high",
    question:
      "La $B(x)$ bety «$x$ består eksamen». Hvordan skrives «Noen består eksamen»?",
    options: [
      "$\\exists x\\;B(x)$",
      "$\\forall x\\;B(x)$",
      "$\\forall x\\;\\neg B(x)$",
      "$\\neg\\exists x\\;B(x)$",
    ],
    correctAnswer: "$\\exists x\\;B(x)$",
    explanation:
      "«Noen» betyr at det finnes minst én, og uttrykkes derfor med $\\exists$.",
  },
  {
    id: "predikat-oversettelse-3",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["oversettelse", "implikasjon", "universalkvantor"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "La $S(x)$ bety «$x$ er student», og $L(x)$ bety «$x$ leser». Hvordan skrives «Alle studenter leser»?",
    options: [
      "$\\forall x\\;(S(x)\\to L(x))$",
      "$\\forall x\\;(S(x)\\land L(x))$",
      "$\\exists x\\;(S(x)\\to L(x))$",
      "$\\forall x\\;(L(x)\\to S(x))$",
    ],
    correctAnswer:
      "$\\forall x\\;(S(x)\\to L(x))$",
    explanation:
      "For hvert element sier vi at dersom elementet er en student, så leser det.",
  },
  {
    id: "predikat-oversettelse-4",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["oversettelse", "konjunksjon", "eksistenskvantor"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "La $S(x)$ bety «$x$ er student», og $L(x)$ bety «$x$ leser». Hvordan skrives «Det finnes en student som leser»?",
    options: [
      "$\\exists x\\;(S(x)\\land L(x))$",
      "$\\forall x\\;(S(x)\\to L(x))$",
      "$\\exists x\\;(S(x)\\to L(x))$",
      "$\\forall x\\;(S(x)\\land L(x))$",
    ],
    correctAnswer:
      "$\\exists x\\;(S(x)\\land L(x))$",
    explanation:
      "Det samme elementet må både være student og lese. Derfor bruker vi konjunksjon.",
  },
  {
    id: "predikat-oversettelse-5",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["oversettelse", "negasjon", "universalkvantor"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "La $B(x)$ bety «$x$ består». Hvordan skrives «Ingen består»?",
    options: [
      "$\\forall x\\;\\neg B(x)$",
      "$\\exists x\\;\\neg B(x)$",
      "$\\forall x\\;B(x)$",
      "$\\neg\\forall x\\;B(x)$",
    ],
    correctAnswer:
      "$\\forall x\\;\\neg B(x)$",
    explanation:
      "«Ingen består» betyr at alle elementene har egenskapen «består ikke».",
  },
  {
    id: "predikat-oversettelse-6",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["oversettelse", "negasjon", "eksistenskvantor"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "La $B(x)$ bety «$x$ består». Hvordan skrives «Ikke alle består»?",
    options: [
      "$\\exists x\\;\\neg B(x)$",
      "$\\forall x\\;\\neg B(x)$",
      "$\\exists x\\;B(x)$",
      "$\\neg\\exists x\\;B(x)$",
    ],
    correctAnswer:
      "$\\exists x\\;\\neg B(x)$",
    explanation:
      "«Ikke alle består» betyr at det finnes minst én som ikke består.",
  },
  {
    id: "predikat-negasjon-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["negasjon", "kvantorer"],
    estimatedTime: 1,
    examFrequency: "high",
    question:
      "Hva er negasjonen av $\\forall x\\;P(x)$?",
    options: [
      "$\\exists x\\;\\neg P(x)$",
      "$\\forall x\\;\\neg P(x)$",
      "$\\exists x\\;P(x)$",
      "$\\neg P(x)$",
    ],
    correctAnswer:
      "$\\exists x\\;\\neg P(x)$",
    explanation:
      "Når vi negerer, byttes $\\forall$ til $\\exists$, og predikatet negeres.",
  },
  {
    id: "predikat-negasjon-2",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["negasjon", "kvantorer"],
    estimatedTime: 1,
    examFrequency: "high",
    question:
      "Hva er negasjonen av $\\exists x\\;P(x)$?",
    options: [
      "$\\forall x\\;\\neg P(x)$",
      "$\\exists x\\;\\neg P(x)$",
      "$\\forall x\\;P(x)$",
      "$\\neg P(x)$",
    ],
    correctAnswer:
      "$\\forall x\\;\\neg P(x)$",
    explanation:
      "Når vi negerer, byttes $\\exists$ til $\\forall$, og predikatet negeres.",
  },
  {
    id: "predikat-negasjon-3",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["negasjon", "implikasjon", "kvantorer"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "Hva er negasjonen av $\\forall x\\;(P(x)\\to Q(x))$?",
    options: [
      "$\\exists x\\;(P(x)\\land\\neg Q(x))$",
      "$\\exists x\\;(\\neg P(x)\\to Q(x))$",
      "$\\forall x\\;(P(x)\\land\\neg Q(x))$",
      "$\\exists x\\;(\\neg P(x)\\land Q(x))$",
    ],
    correctAnswer:
      "$\\exists x\\;(P(x)\\land\\neg Q(x))$",
    explanation:
      "Først byttes $\\forall$ til $\\exists$. Deretter bruker vi at $\\neg(P\\to Q)\\equiv P\\land\\neg Q$.",
  },
  {
    id: "predikat-negasjon-4",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["negasjon", "konjunksjon", "kvantorer"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "Hva er negasjonen av $\\exists x\\;(P(x)\\land Q(x))$?",
    options: [
      "$\\forall x\\;(\\neg P(x)\\lor\\neg Q(x))$",
      "$\\forall x\\;(\\neg P(x)\\land\\neg Q(x))$",
      "$\\exists x\\;(\\neg P(x)\\lor\\neg Q(x))$",
      "$\\forall x\\;(P(x)\\lor Q(x))$",
    ],
    correctAnswer:
      "$\\forall x\\;(\\neg P(x)\\lor\\neg Q(x))$",
    explanation:
      "Kvantoren byttes, og De Morgans lov gir $\\neg(P\\land Q)\\equiv\\neg P\\lor\\neg Q$.",
  },
  {
    id: "predikat-negasjon-5",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["negasjon", "disjunksjon", "kvantorer"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "Hva er negasjonen av $\\forall x\\;(P(x)\\lor Q(x))$?",
    options: [
      "$\\exists x\\;(\\neg P(x)\\land\\neg Q(x))$",
      "$\\exists x\\;(\\neg P(x)\\lor\\neg Q(x))$",
      "$\\forall x\\;(\\neg P(x)\\land\\neg Q(x))$",
      "$\\exists x\\;(P(x)\\land Q(x))$",
    ],
    correctAnswer:
      "$\\exists x\\;(\\neg P(x)\\land\\neg Q(x))$",
    explanation:
      "Kvantoren byttes, og De Morgans lov gir $\\neg(P\\lor Q)\\equiv\\neg P\\land\\neg Q$.",
  },
  {
    id: "predikat-kvantorrekkefolge-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kvantorer", "kvantorrekkefølge"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "Hva betyr $\\forall x\\;\\exists y\\;P(x,y)$?",
    options: [
      "For hvert $x$ finnes det minst ett $y$ slik at $P(x,y)$",
      "Det finnes ett bestemt $y$ som fungerer for alle $x$",
      "Alle $x$ og alle $y$ oppfyller $P(x,y)$",
      "Det finnes ett $x$ og ett $y$ som oppfyller $P(x,y)$",
    ],
    correctAnswer:
      "For hvert $x$ finnes det minst ett $y$ slik at $P(x,y)$",
    explanation:
      "$y$ kan avhenge av hvilket $x$ vi har valgt.",
  },
  {
    id: "predikat-kvantorrekkefolge-2",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kvantorer", "kvantorrekkefølge"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "Hva betyr $\\exists y\\;\\forall x\\;P(x,y)$?",
    options: [
      "Det finnes ett bestemt $y$ som fungerer for alle $x$",
      "For hvert $x$ finnes det et mulig nytt $y$",
      "Alle $y$ fungerer for alle $x$",
      "Det finnes bare ett element i definisjonsmengden",
    ],
    correctAnswer:
      "Det finnes ett bestemt $y$ som fungerer for alle $x$",
    explanation:
      "$y$ velges før $x$, så det samme $y$ må fungere for alle $x$.",
  },
  {
    id: "predikat-kvantorrekkefolge-3",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kvantorer", "kvantorrekkefølge", "ekvivalens"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "Er $\\forall x\\exists y\\;P(x,y)$ og $\\exists y\\forall x\\;P(x,y)$ alltid logisk ekvivalente?",
    options: ["Nei", "Ja"],
    correctAnswer: "Nei",
    explanation:
      "I det første utsagnet kan $y$ avhenge av $x$. I det andre må ett bestemt $y$ fungere for alle $x$.",
  },
  {
    id: "predikat-negasjon-flere-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["negasjon", "kvantorer", "kvantorrekkefølge"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "Hva er negasjonen av $\\forall x\\exists y\\;P(x,y)$?",
    options: [
      "$\\exists x\\forall y\\;\\neg P(x,y)$",
      "$\\forall x\\exists y\\;\\neg P(x,y)$",
      "$\\exists x\\exists y\\;\\neg P(x,y)$",
      "$\\forall x\\forall y\\;\\neg P(x,y)$",
    ],
    correctAnswer:
      "$\\exists x\\forall y\\;\\neg P(x,y)$",
    explanation:
      "Hver kvantor byttes: $\\forall$ blir $\\exists$, og $\\exists$ blir $\\forall$. Til slutt negeres predikatet.",
  },
  {
    id: "predikat-negasjon-flere-2",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["negasjon", "kvantorer", "kvantorrekkefølge"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "Hva er negasjonen av $\\exists x\\forall y\\;P(x,y)$?",
    options: [
      "$\\forall x\\exists y\\;\\neg P(x,y)$",
      "$\\exists x\\forall y\\;\\neg P(x,y)$",
      "$\\forall x\\forall y\\;\\neg P(x,y)$",
      "$\\exists x\\exists y\\;\\neg P(x,y)$",
    ],
    correctAnswer:
      "$\\forall x\\exists y\\;\\neg P(x,y)$",
    explanation:
      "Begge kvantorene byttes, og predikatet negeres.",
  },
  {
    id: "predikat-sannhetsverdi-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kvantorer", "sannhetsverdi"],
    estimatedTime: 1,
    examFrequency: "medium",
    question:
      "Er utsagnet $\\forall x\\in\\mathbb{Z}\\;(x+1>x)$ sant?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "For ethvert heltall $x$ er $x+1$ større enn $x$.",
  },
  {
    id: "predikat-sannhetsverdi-2",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kvantorer", "sannhetsverdi", "moteksempel"],
    estimatedTime: 1,
    examFrequency: "medium",
    question:
      "Er utsagnet $\\forall x\\in\\mathbb{Z}\\;(x^2>0)$ sant?",
    options: ["Nei", "Ja"],
    correctAnswer: "Nei",
    explanation:
      "Moteksempelet $x=0$ gir $x^2=0$, som ikke er større enn $0$.",
  },
  {
    id: "predikat-sannhetsverdi-3",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kvantorer", "sannhetsverdi", "eksistenskvantor"],
    estimatedTime: 1,
    examFrequency: "medium",
    question:
      "Er utsagnet $\\exists x\\in\\mathbb{Z}\\;(x^2=9)$ sant?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "Både $x=3$ og $x=-3$ oppfyller likningen.",
  },
  {
    id: "predikat-sannhetsverdi-4",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kvantorer", "sannhetsverdi"],
    estimatedTime: 2,
    examFrequency: "medium",
    question:
      "Er utsagnet $\\exists x\\in\\mathbb{N}\\;(x+2=1)$ sant?",
    options: ["Nei", "Ja"],
    correctAnswer: "Nei",
    explanation:
      "Likningen gir $x=-1$, og $-1$ er ikke et naturlig tall.",
  },
  {
    id: "predikat-sannhetsverdi-5",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kvantorer", "kvantorrekkefølge", "sannhetsverdi"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "Er utsagnet $\\forall x\\in\\mathbb{Z}\\;\\exists y\\in\\mathbb{Z}\\;(x+y=0)$ sant?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "For hvert heltall $x$ kan vi velge $y=-x$. Da blir $x+y=0$.",
  },
  {
    id: "predikat-sannhetsverdi-6",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["kvantorer", "kvantorrekkefølge", "sannhetsverdi"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "Er utsagnet $\\exists y\\in\\mathbb{Z}\\;\\forall x\\in\\mathbb{Z}\\;(x+y=0)$ sant?",
    options: ["Nei", "Ja"],
    correctAnswer: "Nei",
    explanation:
      "Det finnes ikke ett bestemt heltall $y$ som gjør $x+y=0$ for alle heltall $x$.",
  },
  {
    id: "predikat-sannhetsverdi-7",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kvantorer", "sannhetsverdi"],
    estimatedTime: 2,
    examFrequency: "medium",
    question:
      "Er utsagnet $\\forall x\\in\\mathbb{R}\\;\\exists y\\in\\mathbb{R}\\;(y=x^2)$ sant?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "For hvert reelt tall $x$ kan vi velge det reelle tallet $y=x^2$.",
  },
  {
    id: "predikat-sannhetsverdi-8",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["kvantorer", "kvantorrekkefølge", "sannhetsverdi"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "Er utsagnet $\\exists y\\in\\mathbb{R}\\;\\forall x\\in\\mathbb{R}\\;(y=x^2)$ sant?",
    options: ["Nei", "Ja"],
    correctAnswer: "Nei",
    explanation:
      "Verdien $x^2$ varierer med $x$. Ett bestemt tall $y$ kan derfor ikke være lik $x^2$ for alle $x$.",
  },
  {
    id: "predikat-oversettelse-7",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oversettelse", "kvantorer", "implikasjon"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "La $M(x)$ bety «$x$ er menneske», og $D(x)$ bety «$x$ er dødelig». Hvilken formel uttrykker «Alle mennesker er dødelige»?",
    options: [
      "$\\forall x\\;(M(x)\\to D(x))$",
      "$\\forall x\\;(M(x)\\land D(x))$",
      "$\\exists x\\;(M(x)\\to D(x))$",
      "$\\forall x\\;(D(x)\\to M(x))$",
    ],
    correctAnswer:
      "$\\forall x\\;(M(x)\\to D(x))$",
    explanation:
      "Vi sier at for alle $x$: dersom $x$ er et menneske, så er $x$ dødelig.",
  },
  {
    id: "predikat-oversettelse-8",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oversettelse", "kvantorer", "negasjon"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "La $S(x)$ bety «$x$ er student», og $B(x)$ bety «$x$ består». Hvilken formel uttrykker «Det finnes en student som ikke består»?",
    options: [
      "$\\exists x\\;(S(x)\\land\\neg B(x))$",
      "$\\forall x\\;(S(x)\\to\\neg B(x))$",
      "$\\exists x\\;(S(x)\\to\\neg B(x))$",
      "$\\forall x\\;(S(x)\\land\\neg B(x))$",
    ],
    correctAnswer:
      "$\\exists x\\;(S(x)\\land\\neg B(x))$",
    explanation:
      "Det må finnes ett element som både er student og ikke består.",
  },
  {
    id: "predikat-oversettelse-9",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oversettelse", "kvantorer", "relasjoner"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "La $L(x,y)$ bety «$x$ liker $y$». Hvordan skrives «Alle liker noen»?",
    options: [
      "$\\forall x\\exists y\\;L(x,y)$",
      "$\\exists y\\forall x\\;L(x,y)$",
      "$\\forall x\\forall y\\;L(x,y)$",
      "$\\exists x\\exists y\\;L(x,y)$",
    ],
    correctAnswer:
      "$\\forall x\\exists y\\;L(x,y)$",
    explanation:
      "For hver person $x$ må det finnes minst én person $y$ som $x$ liker.",
  },
  {
    id: "predikat-oversettelse-10",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oversettelse", "kvantorer", "relasjoner"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "La $L(x,y)$ bety «$x$ liker $y$». Hvordan skrives «Det finnes noen som alle liker»?",
    options: [
      "$\\exists y\\forall x\\;L(x,y)$",
      "$\\forall x\\exists y\\;L(x,y)$",
      "$\\exists x\\forall y\\;L(x,y)$",
      "$\\forall y\\exists x\\;L(x,y)$",
    ],
    correctAnswer:
      "$\\exists y\\forall x\\;L(x,y)$",
    explanation:
      "Det finnes én bestemt person $y$ som blir likt av alle personer $x$.",
  },
  {
    id: "predikat-frie-bundne-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kvantorer", "frie-variabler"],
    estimatedTime: 2,
    examFrequency: "medium",
    question:
      "Hvilken variabel er bundet i uttrykket $\\forall x\\;P(x,y)$?",
    options: ["$x$", "$y$", "Både $x$ og $y$", "Ingen"],
    correctAnswer: "$x$",
    explanation:
      "$x$ er bundet av kvantoren $\\forall x$. Variabelen $y$ er fri.",
  },
  {
    id: "predikat-frie-bundne-2",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kvantorer", "frie-variabler"],
    estimatedTime: 2,
    examFrequency: "medium",
    question:
      "Hvilken variabel er fri i uttrykket $\\exists y\\;Q(x,y)$?",
    options: ["$x$", "$y$", "Både $x$ og $y$", "Ingen"],
    correctAnswer: "$x$",
    explanation:
      "$y$ er bundet av $\\exists y$, mens $x$ ikke har noen tilhørende kvantor.",
  },
  {
    id: "predikat-moteksempel-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "number-answer",
    difficulty: "medium",
    tags: ["universalkvantor", "moteksempel", "sannhetsverdi"],
    estimatedTime: 2,
    examFrequency: "high",
    question:
      "Finn et heltall $x$ som viser at utsagnet $\\forall x\\in\\mathbb{Z}\\;(x^2>x)$ er usant.",
    correctAnswer: 0,
    explanation:
      "For $x=0$ får vi $x^2=0$, og ulikheten $0>0$ er usann. Dermed er $x=0$ et moteksempel.",
  },
  {
    id: "predikat-vitne-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "number-answer",
    difficulty: "easy",
    tags: ["eksistenskvantor", "vitne", "sannhetsverdi"],
    estimatedTime: 1,
    examFrequency: "medium",
    question:
      "Oppgi et positivt heltall $x$ som viser at $\\exists x\\in\\mathbb{Z}_{>0}\\;(x^2=16)$ er sant.",
    correctAnswer: 4,
    explanation:
      "$x=4$ er et vitne fordi $4^2=16$.",
  },
  {
    id: "predikat-ekvivalens-1",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["ekvivalens", "negasjon", "kvantorer"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "Hvilket uttrykk er logisk ekvivalent med $\\neg\\forall x\\;P(x)$?",
    options: [
      "$\\exists x\\;\\neg P(x)$",
      "$\\forall x\\;\\neg P(x)$",
      "$\\exists x\\;P(x)$",
      "$\\neg\\exists x\\;P(x)$",
    ],
    correctAnswer:
      "$\\exists x\\;\\neg P(x)$",
    explanation:
      "«Det er ikke slik at alle har egenskapen» betyr at minst én ikke har egenskapen.",
  },
  {
    id: "predikat-ekvivalens-2",
    subjectId: "tma4412",
    topic: "Predikatlogikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["ekvivalens", "negasjon", "kvantorer"],
    estimatedTime: 3,
    examFrequency: "high",
    question:
      "Hvilket uttrykk er logisk ekvivalent med $\\neg\\exists x\\;P(x)$?",
    options: [
      "$\\forall x\\;\\neg P(x)$",
      "$\\exists x\\;\\neg P(x)$",
      "$\\forall x\\;P(x)$",
      "$\\neg\\forall x\\;P(x)$",
    ],
    correctAnswer:
      "$\\forall x\\;\\neg P(x)$",
    explanation:
      "«Det finnes ingen med egenskapen» betyr at alle mangler egenskapen.",
  },
];