import type { PracticeQuestion } from "../types";

export const diskreteLogaritmerQuestions: PracticeQuestion[] = [
  {
    id: "tma4412-diskrete-logaritmer-1",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "easy",
    tags: ["definisjon", "diskret logaritme"],
    estimatedTime: 30,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Hva er en diskret logaritme?",
    options: [
      "Et tall $x$ slik at $a^x\\equiv b\\pmod n$",
      "Et tall $x$ slik at $ax=b$",
      "Et tall $x$ slik at $a+x=b$",
      "Et tall $x$ slik at $a^x=b$ for alle reelle tall",
    ],
    correctAnswer: "Et tall $x$ slik at $a^x\\equiv b\\pmod n$",
    explanation:
      "En diskret logaritme er eksponenten $x$ som oppfyller kongruensen $a^x\\equiv b\\pmod n$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-2",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "easy",
    tags: ["potenser", "modulregning"],
    estimatedTime: 45,
    examFrequency: "medium",
    type: "number-answer",
    question: "Hva er $2^3\\pmod5$?",
    correctAnswer: 3,
    explanation: "$2^3=8$ og $8\\equiv3\\pmod5$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-3",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "easy",
    tags: ["diskret logaritme", "prøving"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "number-answer",
    question: "Finn $x$ slik at $2^x\\equiv4\\pmod5$.",
    correctAnswer: 2,
    explanation: "$2^2=4$, så $x=2$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-4",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "easy",
    tags: ["diskret logaritme", "prøving"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "number-answer",
    question: "Finn $x$ slik at $3^x\\equiv2\\pmod7$.",
    correctAnswer: 2,
    explanation: "$3^2=9\\equiv2\\pmod7$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-5",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "easy",
    tags: ["potenser", "modulregning"],
    estimatedTime: 45,
    examFrequency: "medium",
    type: "number-answer",
    question: "Hva er $3^3\\pmod7$?",
    correctAnswer: 6,
    explanation: "$3^3=27\\equiv6\\pmod7$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-6",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "medium",
    tags: ["potenser", "kongruens"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "Hvilken metode brukes oftest for små oppgaver med diskrete logaritmer?",
    options: [
      "Prøv eksponentene én etter én",
      "Bruk derivasjon",
      "Bruk binærsøk",
      "Bruk primtallsfaktorisering",
    ],
    correctAnswer: "Prøv eksponentene én etter én",
    explanation:
      "På små eksamensoppgaver er systematisk prøving som regel den enkleste metoden.",
  },

  {
    id: "tma4412-diskrete-logaritmer-7",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "medium",
    tags: ["potenser", "modulregning"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "number-answer",
    question: "Hva er $2^4\\pmod7$?",
    correctAnswer: 2,
    explanation: "$2^4=16\\equiv2\\pmod7$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-8",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "medium",
    tags: ["kontroll", "potenser"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Hvordan kontrollerer du en diskret logaritme?",
    options: [
      "Sett eksponenten inn og sjekk kongruensen",
      "Regn ut gcd",
      "Finn en modulær invers",
      "Primtallsfaktoriser moduloen",
    ],
    correctAnswer: "Sett eksponenten inn og sjekk kongruensen",
    explanation:
      "Den enkleste kontrollen er å regne ut $a^x\\pmod n$ og se om resultatet blir $b$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-9",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "medium",
    tags: ["diskret logaritme", "prøving"],
    estimatedTime: 75,
    examFrequency: "medium",
    type: "number-answer",
    question: "Finn $x$ slik at $2^x\\equiv1\\pmod7$.",
    correctAnswer: 3,
    explanation: "$2^3=8\\equiv1\\pmod7$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-10",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "medium",
    tags: ["strategi", "eksamen"],
    estimatedTime: 75,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "Hva er vanligvis den raskeste metoden på eksamen når tallene er små?",
    options: [
      "Lag en tabell over potensene modulo $n$",
      "Bruk utvidet Euklids algoritme",
      "Bruk CRT",
      "Bruk Fermats lille teorem",
    ],
    correctAnswer: "Lag en tabell over potensene modulo $n$",
    explanation:
      "For små tall er det ofte raskest å regne ut potensene én etter én og finne riktig eksponent.",
  },

  {
    id: "tma4412-diskrete-logaritmer-11",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "medium",
    tags: ["potenser", "modulregning"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "number-answer",
    question: "Hva er $5^2\\pmod7$?",
    correctAnswer: 4,
    explanation: "$5^2=25\\equiv4\\pmod7$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-12",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "medium",
    tags: ["diskret logaritme", "prøving"],
    estimatedTime: 75,
    examFrequency: "medium",
    type: "number-answer",
    question: "Finn $x$ slik at $5^x\\equiv4\\pmod7$.",
    correctAnswer: 2,
    explanation: "Siden $5^2\\equiv4\\pmod7$, er $x=2$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-13",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "medium",
    tags: ["potenser", "modulregning"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "number-answer",
    question: "Hva er $2^5\\pmod{11}$?",
    correctAnswer: 10,
    explanation: "$2^5=32\\equiv10\\pmod{11}$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-14",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "hard",
    tags: ["kontroll", "strategi"],
    estimatedTime: 75,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "Hva er den viktigste kontrollen etter at du har funnet en diskret logaritme?",
    options: [
      "Sjekk at $a^x\\equiv b\\pmod n$",
      "Sjekk at $a+b=x$",
      "Sjekk at $x<n$",
      "Sjekk at $a$ er et primtall",
    ],
    correctAnswer: "Sjekk at $a^x\\equiv b\\pmod n$",
    explanation:
      "Du kontrollerer alltid ved å sette eksponenten tilbake i kongruensen.",
  },

  {
    id: "tma4412-diskrete-logaritmer-15",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "hard",
    tags: ["teori", "kryptografi"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Hvorfor er diskrete logaritmer viktige i kryptografi?",
    options: [
      "De er vanskelige å beregne for store tall",
      "De gjør divisjon enklere",
      "De brukes til å finne gcd",
      "De erstatter modulregning",
    ],
    correctAnswer: "De er vanskelige å beregne for store tall",
    explanation:
      "Sikkerheten i flere kryptografiske systemer bygger på at diskrete logaritmer er beregningsmessig vanskelige.",
  },

  {
    id: "tma4412-diskrete-logaritmer-16",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "hard",
    tags: ["diffie-hellman", "kryptografi"],
    estimatedTime: 75,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "Hvilken kryptografisk metode bygger på problemet med diskrete logaritmer?",
    options: [
      "Diffie–Hellman",
      "Euklids algoritme",
      "Boblesortering",
      "Dijkstras algoritme",
    ],
    correctAnswer: "Diffie–Hellman",
    explanation:
      "Diffie–Hellman-nøkkelutveksling er basert på at diskrete logaritmer er vanskelige å beregne.",
  },

  {
    id: "tma4412-diskrete-logaritmer-17",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "hard",
    tags: ["rsa", "kryptografi"],
    estimatedTime: 75,
    examFrequency: "low",
    type: "multiple-choice",
    question:
      "Hvilket av disse temaene henger tettest sammen med diskrete logaritmer?",
    options: [
      "Diffie–Hellman",
      "Primtallsfaktorisering",
      "Grafer",
      "Relasjoner",
    ],
    correctAnswer: "Diffie–Hellman",
    explanation:
      "Diffie–Hellman bygger direkte på problemet med diskrete logaritmer, mens RSA bygger på primtallsfaktorisering.",
  },

  {
    id: "tma4412-diskrete-logaritmer-18",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 75,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "Hva er den vanligste framgangsmåten på små eksamensoppgaver om diskrete logaritmer?",
    options: [
      "Regn ut potensene modulo $n$ til du finner riktig rest",
      "Bruk CRT først",
      "Bruk utvidet Euklids algoritme",
      "Primtallsfaktoriser moduloen",
    ],
    correctAnswer: "Regn ut potensene modulo $n$ til du finner riktig rest",
    explanation:
      "For små tall er systematisk utregning av potensene den raskeste metoden.",
  },

  {
    id: "tma4412-diskrete-logaritmer-19",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "hard",
    tags: ["definisjon", "teori"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Hva prøver du å finne når du løser en diskret logaritme?",
    options: ["Eksponenten", "Moduloen", "Grunntallet", "Resten"],
    correctAnswer: "Eksponenten",
    explanation:
      "Den ukjente i en diskret logaritme er eksponenten $x$ i uttrykket $a^x\\equiv b\\pmod n$.",
  },

  {
    id: "tma4412-diskrete-logaritmer-20",
    subjectId: "tma4412",
    topic: "Diskrete logaritmer",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 90,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "Hva er riktig framgangsmåte når du løser en liten oppgave om diskrete logaritmer på eksamen?",
    options: [
      "Regn ut potensene modulo $n$, finn riktig eksponent og kontroller svaret",
      "Bruk alltid utvidet Euklids algoritme",
      "Bruk alltid CRT",
      "Primtallsfaktoriser alle tallene",
    ],
    correctAnswer:
      "Regn ut potensene modulo $n$, finn riktig eksponent og kontroller svaret",
    explanation:
      "På små oppgaver er dette den enkleste og mest effektive metoden.",
  },
];
