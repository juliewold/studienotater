import type { PracticeQuestion } from "../types";

export const funksjonerQuestions: PracticeQuestion[] = [
  {
    id: "funksjoner-definisjon-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Hva må være sant for at en relasjon $f \\colon A \\to B$ skal være en funksjon?",
    options: [
      "Hvert element i $A$ må ha nøyaktig én verdi i $B$",
      "Hvert element i $B$ må ha nøyaktig én verdi i $A$",
      "Alle elementene i $A$ og $B$ må være ulike",
      "Mengdene $A$ og $B$ må ha like mange elementer",
    ],
    correctAnswer:
      "Hvert element i $A$ må ha nøyaktig én verdi i $B$",
    explanation:
      "En funksjon må tilordne hvert element i definisjonsmengden $A$ nøyaktig ett element i kodomenet $B$.",
  },
  {
    id: "funksjoner-definisjonsmengde-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "I funksjonen $f \\colon A \\to B$, hva kalles mengden $A$?",
    options: [
      "Definisjonsmengden",
      "Verdimengden",
      "Kodomenet",
      "Bildet",
    ],
    correctAnswer: "Definisjonsmengden",
    explanation:
      "$A$ er definisjonsmengden, altså mengden av mulige inputverdier.",
  },
  {
    id: "funksjoner-kodomene-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "I funksjonen $f \\colon A \\to B$, hva kalles mengden $B$?",
    options: [
      "Kodomenet",
      "Definisjonsmengden",
      "Domenet",
      "Urbildet",
    ],
    correctAnswer: "Kodomenet",
    explanation:
      "$B$ er kodomenet, altså mengden funksjonsverdiene skal ligge i.",
  },
  {
    id: "funksjoner-verdi-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $f(x)=2x+3$. Finn $f(4)$.",
    correctAnswer: 11,
    explanation:
      "Vi setter inn $x=4$: $f(4)=2\\cdot4+3=11$.",
  },
  {
    id: "funksjoner-verdi-2",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "easy",
    question:
      "La $f(x)=x^2-1$. Finn $f(3)$.",
    correctAnswer: 8,
    explanation:
      "$f(3)=3^2-1=9-1=8$.",
  },
  {
    id: "funksjoner-injektiv-definisjon-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Hva betyr det at en funksjon $f \\colon A \\to B$ er injektiv?",
    options: [
      "Forskjellige inputverdier gir forskjellige funksjonsverdier",
      "Alle elementene i $B$ blir truffet",
      "Alle funksjonsverdiene er like",
      "Funksjonen har en konstant verdi",
    ],
    correctAnswer:
      "Forskjellige inputverdier gir forskjellige funksjonsverdier",
    explanation:
      "Injektiv betyr at $f(a)=f(b)$ bare kan skje når $a=b$.",
  },
  {
    id: "funksjoner-surjektiv-definisjon-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Hva betyr det at en funksjon $f \\colon A \\to B$ er surjektiv?",
    options: [
      "Hvert element i $B$ er funksjonsverdi for minst ett element i $A$",
      "Forskjellige inputverdier gir forskjellige verdier",
      "Funksjonen er både økende og avtakende",
      "Mengden $A$ er tom",
    ],
    correctAnswer:
      "Hvert element i $B$ er funksjonsverdi for minst ett element i $A$",
    explanation:
      "Surjektiv betyr at alle elementene i kodomenet $B$ blir truffet.",
  },
  {
    id: "funksjoner-bijektiv-definisjon-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Hva betyr det at en funksjon er bijektiv?",
    options: [
      "Den er både injektiv og surjektiv",
      "Den er bare injektiv",
      "Den er bare surjektiv",
      "Den er verken injektiv eller surjektiv",
    ],
    correctAnswer: "Den er både injektiv og surjektiv",
    explanation:
      "En bijeksjon er både injektiv og surjektiv.",
  },
  {
    id: "funksjoner-lineaer-injektiv-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Er funksjonen $f \\colon \\mathbb{R}\\to\\mathbb{R}$ gitt ved $f(x)=2x+1$ injektiv?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "Hvis $f(a)=f(b)$, får vi $2a+1=2b+1$, og dermed $a=b$. Funksjonen er injektiv.",
  },
  {
    id: "funksjoner-lineaer-surjektiv-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Er funksjonen $f \\colon \\mathbb{R}\\to\\mathbb{R}$ gitt ved $f(x)=2x+1$ surjektiv?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "For enhver $y\\in\\mathbb{R}$ kan vi velge $x=(y-1)/2$. Da er $f(x)=y$.",
  },
  {
    id: "funksjoner-kvadrat-injektiv-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Er funksjonen $f \\colon \\mathbb{R}\\to\\mathbb{R}$ gitt ved $f(x)=x^2$ injektiv?",
    options: ["Ja", "Nei"],
    correctAnswer: "Nei",
    explanation:
      "For eksempel er $f(2)=4$ og $f(-2)=4$, selv om $2\\ne -2$.",
  },
  {
    id: "funksjoner-kvadrat-surjektiv-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Er funksjonen $f \\colon \\mathbb{R}\\to\\mathbb{R}$ gitt ved $f(x)=x^2$ surjektiv?",
    options: ["Ja", "Nei"],
    correctAnswer: "Nei",
    explanation:
      "Ingen negative reelle tall blir truffet, siden $x^2\\ge0$ for alle $x\\in\\mathbb{R}$.",
  },
  {
    id: "funksjoner-kvadrat-begrenset-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Er funksjonen $f \\colon [0,\\infty)\\to[0,\\infty)$ gitt ved $f(x)=x^2$ bijektiv?",
    options: ["Ja", "Nei"],
    correctAnswer: "Ja",
    explanation:
      "På $[0,\\infty)$ er funksjonen injektiv, og alle ikke-negative tall blir truffet. Derfor er den bijektiv.",
  },
  {
    id: "funksjoner-konstant-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "easy",
    question:
      "Er den konstante funksjonen $f \\colon \\mathbb{R}\\to\\mathbb{R}$ gitt ved $f(x)=5$ injektiv?",
    options: ["Ja", "Nei"],
    correctAnswer: "Nei",
    explanation:
      "Alle inputverdier gir samme funksjonsverdi. Derfor er funksjonen ikke injektiv.",
  },
  {
    id: "funksjoner-sammensetning-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "medium",
    question:
      "La $f(x)=2x+1$ og $g(x)=x^2$. Finn $(g\\circ f)(2)$.",
    correctAnswer: 25,
    explanation:
      "Først finner vi $f(2)=5$. Deretter får vi $g(5)=25$. Altså er $(g\\circ f)(2)=25$.",
  },
  {
    id: "funksjoner-sammensetning-2",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "medium",
    question:
      "La $f(x)=x+3$ og $g(x)=2x$. Finn $(f\\circ g)(4)$.",
    correctAnswer: 11,
    explanation:
      "Først får vi $g(4)=8$. Deretter er $f(8)=8+3=11$.",
  },
  {
    id: "funksjoner-sammensetning-rekkefolge-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Hva betyr $(f\\circ g)(x)$?",
    options: [
      "$f(g(x))$",
      "$g(f(x))$",
      "$f(x)g(x)$",
      "$f(x)+g(x)$",
    ],
    correctAnswer: "$f(g(x))$",
    explanation:
      "Ved sammensetning utføres $g$ først og deretter $f$.",
  },
  {
    id: "funksjoner-invers-definisjon-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Når har en funksjon $f \\colon A\\to B$ en invers funksjon $f^{-1}\\colon B\\to A$?",
    options: [
      "Når $f$ er bijektiv",
      "Når $f$ bare er injektiv",
      "Når $f$ bare er surjektiv",
      "Når $f$ er konstant",
    ],
    correctAnswer: "Når $f$ er bijektiv",
    explanation:
      "En funksjon har en invers funksjon akkurat når den er både injektiv og surjektiv.",
  },
  {
    id: "funksjoner-invers-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Hva er inversen til $f(x)=2x+3$?",
    options: [
      "$f^{-1}(x)=\\frac{x-3}{2}$",
      "$f^{-1}(x)=2x-3$",
      "$f^{-1}(x)=\\frac{x+3}{2}$",
      "$f^{-1}(x)=3x+2$",
    ],
    correctAnswer: "$f^{-1}(x)=\\frac{x-3}{2}$",
    explanation:
      "Sett $y=2x+3$ og løs for $x$: $x=(y-3)/2$. Derfor er $f^{-1}(x)=(x-3)/2$.",
  },
  {
    id: "funksjoner-invers-verdi-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "medium",
    question:
      "La $f(x)=3x-6$. Finn $f^{-1}(9)$.",
    correctAnswer: 5,
    explanation:
      "Vi løser $3x-6=9$. Da får vi $3x=15$, altså $x=5$.",
  },
  {
    id: "funksjoner-antall-funksjoner-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Mengden $A$ har $3$ elementer og mengden $B$ har $2$ elementer. Hvor mange funksjoner finnes fra $A$ til $B$?",
    correctAnswer: 8,
    explanation:
      "Hvert av de tre elementene i $A$ kan sendes til ett av to elementer i $B$. Dermed finnes det $2^3=8$ funksjoner.",
  },
  {
    id: "funksjoner-antall-funksjoner-2",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "medium",
    question:
      "Mengden $A$ har $4$ elementer og mengden $B$ har $3$ elementer. Hvor mange funksjoner finnes fra $A$ til $B$?",
    correctAnswer: 81,
    explanation:
      "For hvert av de fire elementene i $A$ finnes tre valg i $B$. Derfor er antallet funksjoner $3^4=81$.",
  },
  {
    id: "funksjoner-antall-injektive-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "hard",
    question:
      "Mengden $A$ har $3$ elementer og mengden $B$ har $5$ elementer. Hvor mange injektive funksjoner finnes fra $A$ til $B$?",
    correctAnswer: 60,
    explanation:
      "Det første elementet har $5$ valg, det neste $4$, og det siste $3$. Dermed får vi $5\\cdot4\\cdot3=60$.",
  },
  {
    id: "funksjoner-antall-bijektive-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "number-answer",
    difficulty: "hard",
    question:
      "Mengdene $A$ og $B$ har begge $4$ elementer. Hvor mange bijektive funksjoner finnes fra $A$ til $B$?",
    correctAnswer: 24,
    explanation:
      "Antallet bijeksjoner mellom to mengder med fire elementer er $4!=24$.",
  },
  {
    id: "funksjoner-injektiv-mulig-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Kan det finnes en injektiv funksjon fra en mengde med $5$ elementer til en mengde med $3$ elementer?",
    options: ["Ja", "Nei"],
    correctAnswer: "Nei",
    explanation:
      "Fem forskjellige elementer kan ikke få fem forskjellige bilder i en mengde som bare har tre elementer.",
  },
  {
    id: "funksjoner-surjektiv-mulig-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "medium",
    question:
      "Kan det finnes en surjektiv funksjon fra en mengde med $3$ elementer til en mengde med $5$ elementer?",
    options: ["Ja", "Nei"],
    correctAnswer: "Nei",
    explanation:
      "Tre inputverdier kan ikke treffe alle fem elementene i kodomenet.",
  },
  {
    id: "funksjoner-endelig-bijektiv-1",
    subjectId: "tma4412",
    topic: "Funksjoner",
    type: "multiple-choice",
    difficulty: "hard",
    question:
      "La $A$ og $B$ være endelige mengder med like mange elementer. Dersom $f\\colon A\\to B$ er injektiv, hva kan vi konkludere?",
    options: [
      "$f$ er også surjektiv",
      "$f$ er konstant",
      "$f$ er ikke surjektiv",
      "Vi kan ikke si noe",
    ],
    correctAnswer: "$f$ er også surjektiv",
    explanation:
      "Mellom endelige mengder med samme størrelse vil en injektiv funksjon automatisk være surjektiv, og dermed bijektiv.",
  },
];