import type { PracticeQuestion } from "../types";

export const kinesiskeRestteoremQuestions: PracticeQuestion[] = [
  {
    id: "tma4412-krt-1",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "easy",
    tags: ["definisjon", "crt"],
    estimatedTime: 30,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva brukes Kinesiske restteorem (CRT) til?",
    options: [
      "Å løse flere kongruenser samtidig",
      "Å finne primtallsfaktorisering",
      "Å beregne gcd",
      "Å finne modulære inverser",
    ],
    correctAnswer: "Å løse flere kongruenser samtidig",
    explanation:
      "CRT brukes til å finne et tall som oppfyller flere kongruenser samtidig.",
  },

  {
    id: "tma4412-krt-2",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "easy",
    tags: ["betingelse", "crt"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Når kan Kinesiske restteorem brukes direkte?",
    options: [
      "Når modulene er parvis relativt primiske",
      "Når alle modulene er primtall",
      "Når alle modulene er partall",
      "Når alle restene er like",
    ],
    correctAnswer: "Når modulene er parvis relativt primiske",
    explanation:
      "Den klassiske versjonen av CRT krever at alle modulene er parvis relativt primiske.",
  },

  {
    id: "tma4412-krt-3",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "easy",
    tags: ["relativt primiske", "gcd"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Er modulene 3 og 5 relativt primiske?",
    options: ["Ja", "Nei", "Bare hvis resten er 1", "Kan ikke avgjøres"],
    correctAnswer: "Ja",
    explanation: "$\\gcd(3,5)=1$, derfor er de relativt primiske.",
  },

  {
    id: "tma4412-krt-4",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "easy",
    tags: ["relativt primiske", "gcd"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Er modulene 6 og 9 relativt primiske?",
    options: ["Ja", "Nei", "Bare hvis resten er 0", "Kan ikke avgjøres"],
    correctAnswer: "Nei",
    explanation: "$\\gcd(6,9)=3$, derfor er de ikke relativt primiske.",
  },

  {
    id: "tma4412-krt-5",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "easy",
    tags: ["kongruens", "crt"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "number-answer",
    question:
      "Finn den minste positive løsningen til\n$x\\equiv1\\pmod2$\nog\n$x\\equiv2\\pmod3$.",
    correctAnswer: 5,
    explanation:
      "Tallene som er 1 modulo 2 er 1,3,5,7,... Det første som også er 2 modulo 3 er 5.",
  },

  {
    id: "tma4412-krt-6",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "easy",
    tags: ["kongruens", "crt"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "number-answer",
    question:
      "Finn den minste positive løsningen til\n$x\\equiv0\\pmod2$\nog\n$x\\equiv1\\pmod3$.",
    correctAnswer: 4,
    explanation:
      "De partallene er 2,4,6,8,... Det første som gir rest 1 ved divisjon på 3 er 4.",
  },

  {
    id: "tma4412-krt-7",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "medium",
    tags: ["unik løsning", "produkt"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hvis modulene er 3 og 5, hvilken modulo er løsningen unik modulo?",
    options: ["15", "8", "5", "3"],
    correctAnswer: "15",
    explanation:
      "Når modulene er relativt primiske, er løsningen unik modulo produktet av modulene.",
  },

  {
    id: "tma4412-krt-8",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "medium",
    tags: ["produkt", "crt"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "number-answer",
    question: "Hva er produktet av modulene 4 og 7?",
    correctAnswer: 28,
    explanation: "Produktet er $4\\cdot7=28$.",
  },

  {
    id: "tma4412-krt-9",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "medium",
    tags: ["betingelse", "gcd"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hvorfor kan ikke standardversjonen av CRT brukes direkte på modulene 6 og 9?",
    options: [
      "De er ikke relativt primiske",
      "Begge er partall",
      "Begge er sammensatte",
      "Restene er ukjente",
    ],
    correctAnswer: "De er ikke relativt primiske",
    explanation: "$\\gcd(6,9)=3\\neq1$, derfor er ikke betingelsen oppfylt.",
  },

  {
    id: "tma4412-krt-10",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "medium",
    tags: ["framgangsmåte", "crt"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva er første steg når du skal løse en CRT-oppgave?",
    options: [
      "Sjekk at modulene er parvis relativt primiske",
      "Finn primtallsfaktoriseringen",
      "Bruk Euklids algoritme",
      "Finn alle restene først",
    ],
    correctAnswer: "Sjekk at modulene er parvis relativt primiske",
    explanation:
      "Dette er alltid første kontroll før resten av metoden brukes.",
  },

  {
    id: "tma4412-krt-11",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "medium",
    tags: ["kongruens", "minste løsning"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "number-answer",
    question:
      "Finn den minste positive løsningen til\n$x\\equiv2\\pmod3$\nog\n$x\\equiv3\\pmod5$.",
    correctAnswer: 8,
    explanation:
      "Tall som er 2 modulo 3 er 2, 5, 8, 11, ... Det første som også er 3 modulo 5 er 8.",
  },

  {
    id: "tma4412-krt-12",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "medium",
    tags: ["kongruens", "minste løsning"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "number-answer",
    question:
      "Finn den minste positive løsningen til\n$x\\equiv1\\pmod4$\nog\n$x\\equiv2\\pmod5$.",
    correctAnswer: 17,
    explanation:
      "Tall som er 1 modulo 4 er 1, 5, 9, 13, 17, ... Det første som også er 2 modulo 5 er 17.",
  },

  {
    id: "tma4412-krt-13",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "medium",
    tags: ["kontroll", "kongruens"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Hvordan kontrollerer du en løsning på en CRT-oppgave?",
    options: [
      "Sjekk at alle kongruensene er oppfylt",
      "Sjekk bare én kongruens",
      "Sjekk at løsningen er et primtall",
      "Sjekk at løsningen er mindre enn alle modulene",
    ],
    correctAnswer: "Sjekk at alle kongruensene er oppfylt",
    explanation:
      "En løsning er bare riktig dersom den oppfyller samtlige kongruenser.",
  },

  {
    id: "tma4412-krt-14",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "hard",
    tags: ["modulær invers", "crt"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hvilket hjelpemiddel brukes ofte sammen med CRT når vi regner ut løsningen?",
    options: ["Modulære inverser", "Derivasjon", "Komplekse tall", "Binærsøk"],
    correctAnswer: "Modulære inverser",
    explanation:
      "Standardmetoden for CRT bruker ofte modulære inverser når løsningen bygges opp.",
  },

  {
    id: "tma4412-krt-15",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "hard",
    tags: ["unik løsning", "produkt"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hvis modulene er 4, 5 og 7, hvilken modulo er løsningen unik modulo?",
    options: ["140", "35", "16", "28"],
    correctAnswer: "140",
    explanation: "Løsningen er unik modulo produktet $4\\cdot5\\cdot7=140$.",
  },

  {
    id: "tma4412-krt-16",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "hard",
    tags: ["produkt", "crt"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "number-answer",
    question: "Hva er produktet av modulene 3, 5 og 7?",
    correctAnswer: 105,
    explanation: "$3\\cdot5\\cdot7=105$.",
  },

  {
    id: "tma4412-krt-17",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "hard",
    tags: ["strategi", "crt"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hvorfor er det lurt å kontrollere svaret etter en CRT-oppgave?",
    options: [
      "Små regnefeil kan gjøre at én av kongruensene ikke stemmer",
      "For å finne gcd",
      "For å finne primtallsfaktoriseringen",
      "Det er ikke nødvendig",
    ],
    correctAnswer: "Små regnefeil kan gjøre at én av kongruensene ikke stemmer",
    explanation:
      "Selv en liten regnefeil kan føre til at én eller flere av kongruensene ikke er oppfylt.",
  },

  {
    id: "tma4412-krt-18",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "hard",
    tags: ["betingelse", "gcd"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva må være sant om modulene for at standardversjonen av CRT skal kunne brukes?",
    options: [
      "Alle modulene må være parvis relativt primiske",
      "Alle modulene må være primtall",
      "Alle modulene må være oddetall",
      "Alle modulene må være forskjellige",
    ],
    correctAnswer: "Alle modulene må være parvis relativt primiske",
    explanation:
      "Dette er den grunnleggende forutsetningen i den klassiske versjonen av Kinesiske restteorem.",
  },

  {
    id: "tma4412-krt-19",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er første regnesteg etter at du har kontrollert at modulene er parvis relativt primiske?",
    options: [
      "Finn produktet av modulene",
      "Finn gcd på nytt",
      "Primtallsfaktoriser alle modulene",
      "Sett $x=0$",
    ],
    correctAnswer: "Finn produktet av modulene",
    explanation:
      "I standardmetoden setter man først $M$ lik produktet av alle modulene.",
  },

  {
    id: "tma4412-krt-20",
    subjectId: "tma4412",
    topic: "Kinesisk restteorem",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er riktig framgangsmåte når du løser en CRT-oppgave på eksamen?",
    options: [
      "Sjekk betingelsen, finn produktet av modulene, bruk modulære inverser, kontroller svaret",
      "Primtallsfaktoriser alle modulene først",
      "Bruk Euklids algoritme på alle modulene",
      "Gjett en løsning og kontroller etterpå",
    ],
    correctAnswer:
      "Sjekk betingelsen, finn produktet av modulene, bruk modulære inverser, kontroller svaret",
    explanation:
      "Dette er den standard framgangsmåten som brukes på de fleste CRT-oppgaver.",
  },
];
