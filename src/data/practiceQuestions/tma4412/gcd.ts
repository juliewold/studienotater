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

    question: "Hva står forkortelsen gcd for?",

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

    question: "Hva betyr gcd(12, 18)?",

    options: [
      "Den største positive faktoren som deler både 12 og 18.",
      "Summen av 12 og 18.",
      "Produktet av 12 og 18.",
      "Forskjellen mellom 12 og 18.",
    ],

    correctAnswer: "Den største positive faktoren som deler både 12 og 18.",

    explanation: "gcd finner den største felles divisoren til de to tallene.",
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

    question: "Hva er gcd(8, 12)?",

    options: ["4", "2", "6", "24"],

    correctAnswer: "4",

    explanation: "4 er den største positive divisoren som deler både 8 og 12.",
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

    question: "Hva er gcd(15, 25)?",

    options: ["5", "10", "15", "1"],

    correctAnswer: "5",

    explanation: "5 er den største positive divisoren som deler både 15 og 25.",
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

    question: "Hva betyr det dersom gcd(a, b) = 1?",

    options: [
      "Tallene er relativt primiske.",
      "Tallene er begge primtall.",
      "Tallene er like.",
      "Tallene er partall.",
    ],

    correctAnswer: "Tallene er relativt primiske.",

    explanation:
      "To tall med gcd = 1 har ingen felles positive divisor større enn 1.",
  },

  {
    id: "gcd-6",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["euklid", "teori"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva brukes Euklids algoritme til?",

    options: [
      "Å finne gcd(a, b).",
      "Å finne minste felles multiplum.",
      "Å teste om et tall er primtall.",
      "Å løse sannhetstabeller.",
    ],

    correctAnswer: "Å finne gcd(a, b).",

    explanation:
      "Euklids algoritme er den mest effektive metoden for å finne gcd(a, b).",
  },

  {
    id: "gcd-7",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["euklid"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hvilken operasjon brukes gjentatte ganger i Euklids algoritme?",

    options: ["Rest ved divisjon.", "Addisjon.", "Potenser.", "Fakultet."],

    correctAnswer: "Rest ved divisjon.",

    explanation:
      "Algoritmen bygger på å regne ut resten når det største tallet deles på det minste.",
  },

  {
    id: "gcd-8",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Når stopper Euklids algoritme?",

    options: [
      "Når resten blir 0.",
      "Når tallene er like.",
      "Når resten blir 1.",
      "Når kvotienten blir 2.",
    ],

    correctAnswer: "Når resten blir 0.",

    explanation: "Når resten er 0, er den siste ikke-null resten gcd.",
  },

  {
    id: "gcd-9",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva er gcd dersom algoritmen stopper med siste ikke-null rest lik 7?",

    options: ["7", "0", "1", "Kan ikke avgjøres."],

    correctAnswer: "7",

    explanation: "Den siste ikke-null resten er alltid gcd.",
  },

  {
    id: "gcd-10",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["gcd"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er gcd(17, 19)?",

    options: ["1", "2", "17", "19"],

    correctAnswer: "1",

    explanation:
      "17 og 19 har ingen felles positive divisor større enn 1 og er derfor relativt primiske.",
  },

  {
    id: "gcd-11",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid", "egenskaper"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvilken egenskap gjør Euklids algoritme mulig?",

    options: [
      "gcd(a, b) = gcd(b, a mod b)",
      "gcd(a, b) = a + b",
      "gcd(a, b) = a · b",
      "gcd(a, b) = a − b",
    ],

    correctAnswer: "gcd(a, b) = gcd(b, a mod b)",

    explanation: "Dette er den grunnleggende egenskapen algoritmen bygger på.",
  },

  {
    id: "gcd-12",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva blir neste tallpar dersom vi har (48, 18)?",

    options: ["(18, 12)", "(18, 48)", "(12, 18)", "(48, 12)"],

    correctAnswer: "(18, 12)",

    explanation: "48 mod 18 = 12, så neste steg er (18, 12).",
  },

  {
    id: "gcd-13",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva blir neste tallpar dersom vi har (18, 12)?",

    options: ["(12, 6)", "(6, 12)", "(18, 6)", "(12, 18)"],

    correctAnswer: "(12, 6)",

    explanation: "18 mod 12 = 6, så neste steg er (12, 6).",
  },

  {
    id: "gcd-14",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva blir neste tallpar dersom vi har (12, 6)?",

    options: ["(6, 0)", "(6, 6)", "(12, 0)", "(0, 6)"],

    correctAnswer: "(6, 0)",

    explanation: "12 mod 6 = 0, så algoritmen stopper.",
  },

  {
    id: "gcd-15",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid", "eksamen"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er gcd(48, 18)?",

    options: ["6", "12", "3", "18"],

    correctAnswer: "6",

    explanation: "48 → 18 → 12 → 6 → 0. Den siste ikke-null resten er 6.",
  },

  {
    id: "gcd-16",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid", "regning"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva er første steg når du skal finne gcd(42, 30) med Euklids algoritme?",

    options: [
      "42 mod 30 = 12",
      "30 mod 42 = 30",
      "42 mod 12 = 6",
      "30 mod 12 = 6",
    ],

    correctAnswer: "42 mod 30 = 12",

    explanation: "Vi deler alltid det største tallet på det minste først.",
  },

  {
    id: "gcd-17",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid", "regning"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva blir neste tallpar etter første steg i gcd(42, 30)?",

    options: ["(30, 12)", "(42, 12)", "(12, 30)", "(30, 42)"],

    correctAnswer: "(30, 12)",

    explanation: "Etter 42 mod 30 = 12 fortsetter algoritmen med (30, 12).",
  },

  {
    id: "gcd-18",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er neste rest når vi har tallparet (30, 12)?",

    options: ["6", "12", "18", "0"],

    correctAnswer: "6",

    explanation: "30 mod 12 = 6.",
  },

  {
    id: "gcd-19",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva blir neste tallpar etter (30, 12)?",

    options: ["(12, 6)", "(6, 12)", "(30, 6)", "(12, 30)"],

    correctAnswer: "(12, 6)",

    explanation: "Etter resten 6 fortsetter algoritmen med (12, 6).",
  },

  {
    id: "gcd-20",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["euklid"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er gcd(42, 30)?",

    options: ["6", "12", "2", "3"],

    correctAnswer: "6",

    explanation: "42 → 30 → 12 → 6 → 0. Den siste ikke-null resten er 6.",
  },

  {
    id: "gcd-21",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["regning"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er gcd(27, 18)?",

    options: ["9", "3", "6", "1"],

    correctAnswer: "9",

    explanation: "27 mod 18 = 9 og 18 mod 9 = 0. Derfor er gcd = 9.",
  },

  {
    id: "gcd-22",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["regning"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er gcd(35, 20)?",

    options: ["5", "10", "15", "1"],

    correctAnswer: "5",

    explanation: "35 mod 20 = 15, 20 mod 15 = 5, 15 mod 5 = 0.",
  },

  {
    id: "gcd-23",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["regning"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er gcd(100, 40)?",

    options: ["20", "10", "40", "5"],

    correctAnswer: "20",

    explanation: "100 mod 40 = 20 og 40 mod 20 = 0.",
  },

  {
    id: "gcd-24",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["regning"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er gcd(81, 54)?",

    options: ["27", "9", "18", "3"],

    correctAnswer: "27",

    explanation: "81 mod 54 = 27 og 54 mod 27 = 0.",
  },

  {
    id: "gcd-25",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["euklid", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva er den viktigste fordelen med Euklids algoritme sammenlignet med å teste alle felles divisorer?",

    options: [
      "Den er mye mer effektiv.",
      "Den krever ingen divisjon.",
      "Den fungerer bare for primtall.",
      "Den gir alltid gcd = 1.",
    ],

    correctAnswer: "Den er mye mer effektiv.",

    explanation:
      "Euklids algoritme finner gcd raskt selv for svært store tall, uten å teste alle mulige divisorer.",
  },

  {
    id: "gcd-26",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["bezout", "teori"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva sier Bézouts identitet?",

    options: [
      "Det finnes heltall x og y slik at ax + by = gcd(a, b).",
      "a + b = gcd(a, b).",
      "ab = gcd(a, b).",
      "a − b = gcd(a, b).",
    ],

    correctAnswer: "Det finnes heltall x og y slik at ax + by = gcd(a, b).",

    explanation:
      "Bézouts identitet sier at gcd(a, b) alltid kan skrives som en lineærkombinasjon av a og b.",
  },

  {
    id: "gcd-27",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["bezout"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva representerer x og y i Bézouts identitet?",

    options: ["Heltall.", "Primtall.", "Naturlige tall.", "Positive tall."],

    correctAnswer: "Heltall.",

    explanation: "x og y kan være både positive, negative eller 0.",
  },

  {
    id: "gcd-28",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["bezout"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Når kan Bézouts identitet brukes?",

    options: [
      "For alle heltall a og b som ikke begge er 0.",
      "Bare når a og b er primtall.",
      "Bare når gcd = 1.",
      "Bare når a > b.",
    ],

    correctAnswer: "For alle heltall a og b som ikke begge er 0.",

    explanation: "Identiteten gjelder generelt for heltall.",
  },

  {
    id: "gcd-29",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["bezout", "teori"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva brukes den utvidede Euklids algoritme til?",

    options: [
      "Å finne x og y i Bézouts identitet.",
      "Å finne minste felles multiplum.",
      "Å finne primtall.",
      "Å løse sannhetstabeller.",
    ],

    correctAnswer: "Å finne x og y i Bézouts identitet.",

    explanation:
      "Den utvidede algoritmen finner både gcd og koeffisientene x og y.",
  },

  {
    id: "gcd-30",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["bezout"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvis gcd(a, b) = 1, hva betyr Bézouts identitet?",

    options: [
      "Det finnes heltall x og y slik at ax + by = 1.",
      "a + b = 1.",
      "ab = 1.",
      "x og y må være positive.",
    ],

    correctAnswer: "Det finnes heltall x og y slik at ax + by = 1.",

    explanation:
      "Dette er en svært viktig egenskap som brukes ved modulære inverser.",
  },

  {
    id: "gcd-31",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["bezout", "modulær-invers"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvorfor er Bézouts identitet viktig i kryptografi?",

    options: [
      "Den brukes til å finne modulære inverser.",
      "Den brukes til å sortere tall.",
      "Den brukes til sannhetstabeller.",
      "Den brukes til å finne primfaktorer.",
    ],

    correctAnswer: "Den brukes til å finne modulære inverser.",

    explanation:
      "RSA og andre kryptosystemer bruker modulære inverser som beregnes med den utvidede Euklids algoritme.",
  },

  {
    id: "gcd-32",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["bezout"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva må være sant for at a skal ha en modulær invers modulo n?",

    options: [
      "gcd(a, n) = 1.",
      "a må være et primtall.",
      "n må være et primtall.",
      "a må være større enn n.",
    ],

    correctAnswer: "gcd(a, n) = 1.",

    explanation:
      "En modulær invers eksisterer bare når a og n er relativt primiske.",
  },

  {
    id: "gcd-33",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["bezout", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva finner den vanlige Euklids algoritme ikke?",

    options: [
      "Koeffisientene x og y.",
      "gcd(a, b).",
      "Den siste resten.",
      "Når algoritmen stopper.",
    ],

    correctAnswer: "Koeffisientene x og y.",

    explanation:
      "Bare den utvidede Euklids algoritme finner Bézout-koeffisientene.",
  },

  {
    id: "gcd-34",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["bezout", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den første delen av den utvidede Euklids algoritme?",

    options: [
      "Utfør den vanlige Euklids algoritme.",
      "Finn primfaktoriseringen.",
      "Bruk sannhetstabell.",
      "Finn minste felles multiplum.",
    ],

    correctAnswer: "Utfør den vanlige Euklids algoritme.",

    explanation:
      "Den utvidede algoritmen starter alltid med den vanlige Euklids algoritme.",
  },

  {
    id: "gcd-35",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["bezout", "oppsummering"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er hovedmålet med den utvidede Euklids algoritme?",

    options: [
      "Å finne både gcd og Bézout-koeffisientene.",
      "Å finne bare gcd.",
      "Å finne minste felles multiplum.",
      "Å faktorisere tall.",
    ],

    correctAnswer: "Å finne både gcd og Bézout-koeffisientene.",

    explanation:
      "Den utvidede algoritmen gir mer informasjon enn den vanlige algoritmen og er derfor svært nyttig i tallteori.",
  },

  {
    id: "gcd-36",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["programmering", "euklid"],
    estimatedTime: 2,
    examFrequency: "medium",

    question:
      "Hva gjør variabelen 'rest' i en implementasjon av Euklids algoritme?",

    options: [
      "Lagrer resten etter divisjon.",
      "Lagrer gcd direkte.",
      "Lagrer kvotienten.",
      "Lagrer summen av tallene.",
    ],

    correctAnswer: "Lagrer resten etter divisjon.",

    explanation: "Resten brukes til å oppdatere tallparet i neste iterasjon.",
  },

  {
    id: "gcd-37",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["programmering"],
    estimatedTime: 2,
    examFrequency: "medium",

    question: "Hva returnerer en korrekt implementasjon av Euklids algoritme?",

    options: [
      "gcd(a, b)",
      "Den siste resten, selv om den er 0.",
      "Kvotienten.",
      "Summen av tallene.",
    ],

    correctAnswer: "gcd(a, b)",

    explanation:
      "Algoritmen returnerer den siste ikke-null resten, som er gcd.",
  },

  {
    id: "gcd-38",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["programmering", "rekursjon"],
    estimatedTime: 3,
    examFrequency: "medium",

    question:
      "Hva er rekursjonssteget i en rekursiv implementasjon av Euklids algoritme?",

    options: ["gcd(b, a % b)", "gcd(a, b)", "gcd(a % b, b)", "gcd(a + b, b)"],

    correctAnswer: "gcd(b, a % b)",

    explanation:
      "Den rekursive versjonen bruker identiteten gcd(a, b) = gcd(b, a mod b).",
  },

  {
    id: "gcd-39",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["programmering"],
    estimatedTime: 3,
    examFrequency: "medium",

    question:
      "Hva er basissteget i en rekursiv implementasjon av Euklids algoritme?",

    options: ["Når b = 0.", "Når a = 0.", "Når a = b.", "Når resten er 1."],

    correctAnswer: "Når b = 0.",

    explanation: "Når b = 0 returneres a, som da er gcd.",
  },

  {
    id: "gcd-40",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hvis du gjør en regnefeil i én rest under Euklids algoritme, hva skjer?",

    options: [
      "Resten av beregningen blir vanligvis feil.",
      "Bare siste steg blir feil.",
      "Det spiller ingen rolle.",
      "Algoritmen retter seg selv.",
    ],

    correctAnswer: "Resten av beregningen blir vanligvis feil.",

    explanation:
      "Hvert steg bygger på det forrige, så en tidlig feil forplanter seg videre.",
  },

  {
    id: "gcd-41",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvorfor brukes Euklids algoritme ofte på eksamen?",

    options: [
      "Den er grunnlaget for flere andre temaer i tallteori.",
      "Den brukes bare i programmering.",
      "Den krever ingen divisjon.",
      "Den gjelder bare for primtall.",
    ],

    correctAnswer: "Den er grunnlaget for flere andre temaer i tallteori.",

    explanation:
      "Modulære inverser, Bézouts identitet og RSA bygger alle på Euklids algoritme.",
  },

  {
    id: "gcd-42",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den viktigste egenskapen til gcd?",

    options: [
      "Den er den største positive divisoren som deler begge tallene.",
      "Den er alltid et primtall.",
      "Den er alltid mindre enn 10.",
      "Den er alltid lik 1.",
    ],

    correctAnswer:
      "Den er den største positive divisoren som deler begge tallene.",

    explanation: "Dette er selve definisjonen av gcd.",
  },

  {
    id: "gcd-43",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den viktigste regelen i Euklids algoritme?",

    options: [
      "Erstatt (a, b) med (b, a mod b).",
      "Trekk alltid det minste tallet fra det største.",
      "Del alltid på 2.",
      "Sorter tallene alfabetisk.",
    ],

    correctAnswer: "Erstatt (a, b) med (b, a mod b).",

    explanation: "Dette er regelen som gjør algoritmen effektiv.",
  },

  {
    id: "gcd-44",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva er den vanligste årsaken til feil på eksamen i oppgaver om Euklids algoritme?",

    options: [
      "Feil utregning av resten.",
      "Feil definisjon av primtall.",
      "Feil bruk av sannhetstabeller.",
      "Feil bruk av Venn-diagram.",
    ],

    correctAnswer: "Feil utregning av resten.",

    explanation:
      "Små regnefeil i restene fører ofte til feil svar på hele oppgaven.",
  },

  {
    id: "gcd-45",
    subjectId: "tma4412",
    topic: "GCD og Euklids algoritme",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering", "eksamen"],
    estimatedTime: 4,
    examFrequency: "high",

    question:
      "Hva bør du alltid huske når du løser en gcd-oppgave med Euklids algoritme?",

    options: [
      "Fortsett til resten blir 0, og ta den siste ikke-null resten som gcd.",
      "Stopp når resten blir 1.",
      "Stopp når tallene er like.",
      "Ta alltid den første resten som gcd.",
    ],

    correctAnswer:
      "Fortsett til resten blir 0, og ta den siste ikke-null resten som gcd.",

    explanation:
      "Dette er hovedregelen som gjør at algoritmen alltid gir riktig svar.",
  },
];
