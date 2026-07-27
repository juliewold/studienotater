import type { PracticeQuestion } from "../types";

export const kongruensQuestions: PracticeQuestion[] = [
  {
    id: "kongruens-1",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kongruens", "teori"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva betyr a ≡ b (mod n)?",

    options: [
      "a og b gir samme rest ved divisjon med n.",
      "a = b.",
      "a er delelig med b.",
      "b er et primtall.",
    ],

    correctAnswer: "a og b gir samme rest ved divisjon med n.",

    explanation:
      "To tall er kongruente modulo n dersom de har samme rest når de deles på n.",
  },

  {
    id: "kongruens-2",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kongruens"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva er resten når 17 deles på 5?",

    options: ["2", "3", "4", "5"],

    correctAnswer: "2",

    explanation: "17 = 3·5 + 2, så resten er 2.",
  },

  {
    id: "kongruens-3",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kongruens"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hvilket utsagn er riktig?",

    options: [
      "17 ≡ 2 (mod 5)",
      "17 ≡ 3 (mod 5)",
      "17 ≡ 5 (mod 5)",
      "17 ≡ 1 (mod 5)",
    ],

    correctAnswer: "17 ≡ 2 (mod 5)",

    explanation: "Begge tallene har rest 2 ved divisjon med 5.",
  },

  {
    id: "kongruens-4",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kongruens", "teori"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva betyr 'mod 7'?",

    options: [
      "Vi ser på resten etter divisjon med 7.",
      "Vi multipliserer med 7.",
      "Vi deler på 7 uten rest.",
      "Vi trekker fra 7 én gang.",
    ],

    correctAnswer: "Vi ser på resten etter divisjon med 7.",

    explanation: "Modulo handler alltid om resten etter divisjon.",
  },

  {
    id: "kongruens-5",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kongruens", "teori"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hvilken betingelse er ekvivalent med a ≡ b (mod n)?",

    options: ["n deler (a − b).", "a deler b.", "b deler a.", "gcd(a, b) = n."],

    correctAnswer: "n deler (a − b).",

    explanation:
      "Definisjonen av kongruens er at differansen a − b er delelig med n.",
  },

  {
    id: "kongruens-6",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["modulo", "regning"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva er 23 mod 6?",

    options: ["5", "4", "3", "2"],

    correctAnswer: "5",

    explanation: "23 = 3·6 + 5, så resten er 5.",
  },

  {
    id: "kongruens-7",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["modulo", "regning"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva er 31 mod 8?",

    options: ["7", "6", "5", "3"],

    correctAnswer: "7",

    explanation: "31 = 3·8 + 7, så resten er 7.",
  },

  {
    id: "kongruens-8",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["addisjon", "modulo"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er (7 + 9) mod 5?",

    options: ["1", "2", "3", "4"],

    correctAnswer: "1",

    explanation: "7 + 9 = 16 og 16 mod 5 = 1.",
  },

  {
    id: "kongruens-9",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["subtraksjon", "modulo"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er (14 − 8) mod 5?",

    options: ["1", "2", "3", "4"],

    correctAnswer: "1",

    explanation: "14 − 8 = 6 og 6 mod 5 = 1.",
  },

  {
    id: "kongruens-10",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["multiplikasjon", "modulo"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er (4 · 6) mod 5?",

    options: ["4", "3", "2", "1"],

    correctAnswer: "4",

    explanation: "4 · 6 = 24 og 24 mod 5 = 4.",
  },

  {
    id: "kongruens-11",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["potenser", "modulo"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er 2² mod 5?",

    options: ["4", "2", "1", "3"],

    correctAnswer: "4",

    explanation: "2² = 4 og 4 mod 5 = 4.",
  },

  {
    id: "kongruens-12",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["potenser", "modulo"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er 3² mod 5?",

    options: ["4", "3", "2", "1"],

    correctAnswer: "4",

    explanation: "3² = 9 og 9 mod 5 = 4.",
  },

  {
    id: "kongruens-13",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kongruens", "teori"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hvis a ≡ b (mod n), hva kan du si om restene til a og b ved divisjon med n?",

    options: [
      "De er like.",
      "De er alltid ulike.",
      "De er begge 0.",
      "Det kan ikke avgjøres.",
    ],

    correctAnswer: "De er like.",

    explanation: "Kongruente tall har samme rest modulo n.",
  },

  {
    id: "kongruens-14",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kongruens", "regning"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvilket utsagn er riktig?",

    options: [
      "22 ≡ 1 (mod 7)",
      "22 ≡ 2 (mod 7)",
      "22 ≡ 3 (mod 7)",
      "22 ≡ 4 (mod 7)",
    ],

    correctAnswer: "22 ≡ 1 (mod 7)",

    explanation: "22 = 3·7 + 1, så resten er 1.",
  },

  {
    id: "kongruens-15",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["modulo", "eksamen"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er den raskeste måten å regne 52 mod 10 på?",

    options: [
      "Finne resten når 52 deles på 10.",
      "Dele 10 på 52.",
      "Trekke fra 10 én gang.",
      "Faktorisere 52.",
    ],

    correctAnswer: "Finne resten når 52 deles på 10.",

    explanation: "Modulo betyr alltid å finne resten etter divisjon.",
  },

  {
    id: "kongruens-16",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["addisjon", "kongruens"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvis 8 ≡ 3 (mod 5) og 12 ≡ 2 (mod 5), hva er 8 + 12 modulo 5?",

    options: ["0", "1", "2", "3"],

    correctAnswer: "0",

    explanation:
      "8 + 12 = 20 og 20 mod 5 = 0. Alternativt: 3 + 2 = 5 ≡ 0 (mod 5).",
  },

  {
    id: "kongruens-17",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["subtraksjon", "kongruens"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er (19 − 8) mod 6?",

    options: ["5", "4", "3", "2"],

    correctAnswer: "5",

    explanation: "19 − 8 = 11 og 11 mod 6 = 5.",
  },

  {
    id: "kongruens-18",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["multiplikasjon", "kongruens"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er (8 · 7) mod 5?",

    options: ["1", "2", "3", "4"],

    correctAnswer: "1",

    explanation: "8 · 7 = 56 og 56 mod 5 = 1.",
  },

  {
    id: "kongruens-19",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["regneregler"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvilken regneregel er gyldig modulo n?",

    options: [
      "Hvis a ≡ b (mod n), så er a + c ≡ b + c (mod n).",
      "Hvis a ≡ b (mod n), så er a + c = b + c.",
      "Hvis a ≡ b (mod n), så er a = b.",
      "Ingen av disse.",
    ],

    correctAnswer: "Hvis a ≡ b (mod n), så er a + c ≡ b + c (mod n).",

    explanation: "Vi kan addere samme tall på begge sider av en kongruens.",
  },

  {
    id: "kongruens-20",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["regneregler"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvis a ≡ b (mod n), hvilken annen regel gjelder alltid?",

    options: ["ac ≡ bc (mod n).", "a/c ≡ b/c (mod n).", "a = b.", "a > b."],

    correctAnswer: "ac ≡ bc (mod n).",

    explanation:
      "Vi kan multiplisere begge sider av en kongruens med samme heltall.",
  },

  {
    id: "kongruens-21",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["potenser"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er 2³ mod 5?",

    options: ["3", "2", "4", "1"],

    correctAnswer: "3",

    explanation: "2³ = 8 og 8 mod 5 = 3.",
  },

  {
    id: "kongruens-22",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["potenser"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er 3³ mod 7?",

    options: ["6", "5", "4", "3"],

    correctAnswer: "6",

    explanation: "3³ = 27 og 27 mod 7 = 6.",
  },

  {
    id: "kongruens-23",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["forenkling"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er den enkleste representanten for 29 modulo 6?",

    options: ["5", "6", "4", "3"],

    correctAnswer: "5",

    explanation: "29 = 4·6 + 5, så 29 ≡ 5 (mod 6).",
  },

  {
    id: "kongruens-24",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["regneregler", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvis a ≡ b (mod n) og c ≡ d (mod n), hva kan vi konkludere?",

    options: ["a + c ≡ b + d (mod n).", "a + c = b + d.", "a = b.", "c = d."],

    correctAnswer: "a + c ≡ b + d (mod n).",

    explanation: "Kongruenser kan legges sammen leddvis.",
  },

  {
    id: "kongruens-25",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["regneregler", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvis a ≡ b (mod n) og c ≡ d (mod n), hva gjelder også alltid?",

    options: ["ac ≡ bd (mod n).", "ac = bd.", "a = c.", "b = d."],

    correctAnswer: "ac ≡ bd (mod n).",

    explanation: "Kongruenser kan også multipliseres leddvis.",
  },

  {
    id: "kongruens-26",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["modulær-invers", "teori"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er en modulær invers til a modulo n?",

    options: [
      "Et tall x slik at ax ≡ 1 (mod n).",
      "Et tall x slik at ax = n.",
      "Et tall x slik at a + x = n.",
      "Et tall x slik at x = 1.",
    ],

    correctAnswer: "Et tall x slik at ax ≡ 1 (mod n).",

    explanation:
      "En modulær invers er et tall som gir rest 1 når det multipliseres med a modulo n.",
  },

  {
    id: "kongruens-27",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["modulær-invers"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Når eksisterer en modulær invers til a modulo n?",

    options: [
      "Når gcd(a, n) = 1.",
      "Når a er et primtall.",
      "Når n er et primtall.",
      "Alltid.",
    ],

    correctAnswer: "Når gcd(a, n) = 1.",

    explanation:
      "En modulær invers eksisterer bare dersom a og n er relativt primiske.",
  },

  {
    id: "kongruens-28",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["modulær-invers"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Har tallet 3 en modulær invers modulo 7?",

    options: ["Ja.", "Nei.", "Bare hvis 7 er partall.", "Kan ikke avgjøres."],

    correctAnswer: "Ja.",

    explanation: "gcd(3, 7) = 1, derfor eksisterer en modulær invers.",
  },

  {
    id: "kongruens-29",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["modulær-invers"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er den modulære inversen til 3 modulo 7?",

    options: ["5", "2", "3", "6"],

    correctAnswer: "5",

    explanation: "3 · 5 = 15 ≡ 1 (mod 7).",
  },

  {
    id: "kongruens-30",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["bezout", "modulær-invers"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvilken metode brukes vanligvis for å finne en modulær invers?",

    options: [
      "Den utvidede Euklids algoritme.",
      "Primtallsfaktorisering.",
      "Sannhetstabell.",
      "Induksjon.",
    ],

    correctAnswer: "Den utvidede Euklids algoritme.",

    explanation:
      "Den utvidede Euklids algoritme finner Bézout-koeffisientene som brukes til å finne den modulære inversen.",
  },

  {
    id: "kongruens-31",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["modulær-invers"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Finnes det en modulær invers til 4 modulo 8?",

    options: [
      "Nei.",
      "Ja.",
      "Bare hvis vi bruker negative tall.",
      "Bare hvis vi bruker desimaltall.",
    ],

    correctAnswer: "Nei.",

    explanation: "gcd(4, 8) = 4 ≠ 1, derfor finnes ingen modulær invers.",
  },

  {
    id: "kongruens-32",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["modulær-invers", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvorfor er modulære inverser viktige?",

    options: [
      "De brukes blant annet i RSA og ved løsning av kongruenser.",
      "De brukes bare til primtallsfaktorisering.",
      "De brukes bare i induksjon.",
      "De brukes bare i sannhetstabeller.",
    ],

    correctAnswer: "De brukes blant annet i RSA og ved løsning av kongruenser.",

    explanation:
      "Modulære inverser er sentrale i både tallteori og moderne kryptografi.",
  },

  {
    id: "kongruens-33",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["modulær-invers"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva må du alltid sjekke før du leter etter en modulær invers?",

    options: [
      "At gcd(a, n) = 1.",
      "At a er et primtall.",
      "At n er større enn 10.",
      "At a er positiv.",
    ],

    correctAnswer: "At gcd(a, n) = 1.",

    explanation:
      "Dette er den nødvendige og tilstrekkelige betingelsen for at en modulær invers skal eksistere.",
  },

  {
    id: "kongruens-34",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["modulær-invers", "bezout"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva representerer Bézout-koeffisienten til a når gcd(a, n) = 1?",

    options: [
      "Den modulære inversen til a modulo n.",
      "Resten ved divisjon.",
      "Kvotienten.",
      "Primfaktoriseringen.",
    ],

    correctAnswer: "Den modulære inversen til a modulo n.",

    explanation:
      "Hvis ax + ny = 1, er x den modulære inversen til a modulo n (eventuelt justert modulo n).",
  },

  {
    id: "kongruens-35",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["modulær-invers", "oppsummering"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er det viktigste å huske om modulære inverser?",

    options: [
      "De eksisterer bare når gcd(a, n) = 1.",
      "Alle tall har en modulær invers.",
      "Bare primtall har modulære inverser.",
      "De brukes bare i kryptografi.",
    ],

    correctAnswer: "De eksisterer bare når gcd(a, n) = 1.",

    explanation:
      "Dette er den viktigste regelen og dukker opp svært ofte på eksamen.",
  },

  {
    id: "kongruens-36",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kongruens", "eksamen"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er 15 mod 4?",

    options: ["3", "2", "1", "0"],

    correctAnswer: "3",

    explanation: "15 = 3·4 + 3, så resten er 3.",
  },

  {
    id: "kongruens-37",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["potenser"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er 5² mod 6?",

    options: ["1", "5", "4", "0"],

    correctAnswer: "1",

    explanation: "5² = 25 og 25 mod 6 = 1.",
  },

  {
    id: "kongruens-38",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["forenkling"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er den enkleste representanten for 41 modulo 9?",

    options: ["5", "4", "3", "2"],

    correctAnswer: "5",

    explanation: "41 = 4·9 + 5.",
  },

  {
    id: "kongruens-39",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kongruens"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvilket utsagn er riktig?",

    options: [
      "29 ≡ 5 (mod 8)",
      "29 ≡ 4 (mod 8)",
      "29 ≡ 3 (mod 8)",
      "29 ≡ 2 (mod 8)",
    ],

    correctAnswer: "29 ≡ 5 (mod 8)",

    explanation: "29 = 3·8 + 5.",
  },

  {
    id: "kongruens-40",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["regneregler"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er (9 + 14) mod 7?",

    options: ["2", "1", "0", "6"],

    correctAnswer: "2",

    explanation: "9 + 14 = 23 og 23 mod 7 = 2.",
  },

  {
    id: "kongruens-41",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den vanligste feilen studenter gjør i kongruensregning?",

    options: [
      "Feil beregning av resten.",
      "Bruker for mye algebra.",
      "Skriver for mange mellomregninger.",
      "Bruker primtallsfaktorisering.",
    ],

    correctAnswer: "Feil beregning av resten.",

    explanation:
      "En liten feil i restberegningen gir ofte feil svar videre i oppgaven.",
  },

  {
    id: "kongruens-42",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er ofte den smarteste strategien når du regner modulo n?",

    options: [
      "Reduser tallene modulo n underveis.",
      "Vent til slutt med å ta modulo.",
      "Bruk alltid store tall.",
      "Unngå å bruke regnereglene.",
    ],

    correctAnswer: "Reduser tallene modulo n underveis.",

    explanation:
      "Mindre tall gjør regningen enklere og reduserer risikoen for regnefeil.",
  },

  {
    id: "kongruens-43",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["modulær-invers"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvorfor er modulære inverser nyttige når man løser kongruenser?",

    options: [
      "De gjør det mulig å 'dele' modulo n når inversen eksisterer.",
      "De gjør alle tall primiske.",
      "De fjerner modulo.",
      "De finner alltid gcd.",
    ],

    correctAnswer:
      "De gjør det mulig å 'dele' modulo n når inversen eksisterer.",

    explanation:
      "Hvis a har en modulær invers modulo n, kan vi multiplisere begge sider med denne inversen.",
  },

  {
    id: "kongruens-44",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["regneregler"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er 7 · 8 mod 5?",

    options: ["1", "2", "3", "4"],

    correctAnswer: "1",

    explanation: "7·8 = 56 og 56 mod 5 = 1.",
  },

  {
    id: "kongruens-45",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["potenser"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er 4² mod 7?",

    options: ["2", "3", "4", "5"],

    correctAnswer: "2",

    explanation: "4² = 16 og 16 mod 7 = 2.",
  },

  {
    id: "kongruens-46",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["teori"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva betyr uttrykket a mod n?",

    options: [
      "Resten når a deles på n.",
      "Kvotienten når a deles på n.",
      "Største felles divisor.",
      "Minste felles multiplum.",
    ],

    correctAnswer: "Resten når a deles på n.",

    explanation: "Modulooperatoren returnerer alltid resten ved divisjon.",
  },

  {
    id: "kongruens-47",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva er den viktigste betingelsen for at en modulær invers skal eksistere?",

    options: [
      "gcd(a, n) = 1.",
      "a er et primtall.",
      "n er et primtall.",
      "a > n.",
    ],

    correctAnswer: "gcd(a, n) = 1.",

    explanation: "Dette er den nødvendige og tilstrekkelige betingelsen.",
  },

  {
    id: "kongruens-48",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er hovedideen i kongruensregning?",

    options: [
      "Å regne med rester etter divisjon.",
      "Å finne primtallsfaktorer.",
      "Å bruke induksjon.",
      "Å finne gcd.",
    ],

    correctAnswer: "Å regne med rester etter divisjon.",

    explanation:
      "Kongruensregning handler om å arbeide med restklasser modulo n.",
  },

  {
    id: "kongruens-49",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den viktigste regneregelen i kongruensregning?",

    options: [
      "Vi kan erstatte et tall med et kongruent tall modulo n.",
      "Vi kan alltid dividere med et tall.",
      "Vi kan ignorere modulo.",
      "Vi kan alltid forkorte.",
    ],

    correctAnswer: "Vi kan erstatte et tall med et kongruent tall modulo n.",

    explanation:
      "Dette gjør beregningene mye enklere og er grunnlaget for de fleste løsninger.",
  },

  {
    id: "kongruens-50",
    subjectId: "tma4412",
    topic: "Kongruensregning",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering", "eksamen"],
    estimatedTime: 4,
    examFrequency: "high",

    question:
      "Hva bør du alltid gjøre først når du får en oppgave i kongruensregning?",

    options: [
      "Identifiser hvilket modulus som brukes.",
      "Finn gcd.",
      "Bruk induksjon.",
      "Primtallsfaktoriser tallene.",
    ],

    correctAnswer: "Identifiser hvilket modulus som brukes.",

    explanation:
      "Før du kan regne modulo n, må du vite hvilket modulus oppgaven bruker.",
  },
];
