import type { PracticeQuestion } from "../types";

export const automaterQuestions: PracticeQuestion[] = [
  {
    id: "tma4412-automater-1",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "easy",
    tags: ["definisjon", "dfa"],
    estimatedTime: 30,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva er en endelig automat (finite automaton)?",
    options: [
      "En modell som leser symboler og skifter mellom et endelig antall tilstander",
      "En algoritme for modulregning",
      "Et binært tre",
      "En graf med vekter",
    ],
    correctAnswer:
      "En modell som leser symboler og skifter mellom et endelig antall tilstander",
    explanation:
      "En endelig automat består av et endelig antall tilstander og overganger mellom disse.",
  },

  {
    id: "tma4412-automater-2",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "easy",
    tags: ["starttilstand", "dfa"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hvor mange starttilstander har en DFA?",
    options: ["Én", "Ingen", "To", "Valgfritt mange"],
    correctAnswer: "Én",
    explanation:
      "En deterministisk endelig automat har alltid nøyaktig én starttilstand.",
  },

  {
    id: "tma4412-automater-3",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "easy",
    tags: ["aksepttilstand", "dfa"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hvordan markeres en aksepttilstand i et tilstandsdiagram?",
    options: [
      "Med en dobbel sirkel",
      "Med en firkant",
      "Med en pil",
      "Med en trekant",
    ],
    correctAnswer: "Med en dobbel sirkel",
    explanation: "Aksepttilstander tegnes med dobbel sirkel.",
  },

  {
    id: "tma4412-automater-4",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "easy",
    tags: ["ord", "aksept"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Når aksepterer en automat et ord?",
    options: [
      "Når den ender i en aksepttilstand",
      "Når den besøker alle tilstander",
      "Når ordet er tomt",
      "Når den går tilbake til start",
    ],
    correctAnswer: "Når den ender i en aksepttilstand",
    explanation:
      "Et ord aksepteres dersom automaten ender i en aksepttilstand etter at hele ordet er lest.",
  },

  {
    id: "tma4412-automater-5",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "easy",
    tags: ["dfa", "overganger"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva kjennetegner en DFA?",
    options: [
      "Nøyaktig én overgang for hvert symbol fra hver tilstand",
      "Flere overganger med samme symbol er alltid tillatt",
      "Ingen overganger er nødvendig",
      "Alle tilstander er aksepttilstander",
    ],
    correctAnswer: "Nøyaktig én overgang for hvert symbol fra hver tilstand",
    explanation: "Dette er definisjonen av en deterministisk endelig automat.",
  },

  {
    id: "tma4412-automater-6",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "medium",
    tags: ["nfa", "teori"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Hva betyr NFA?",
    options: [
      "Ikke-deterministisk endelig automat",
      "Normal endelig automat",
      "Numerisk funksjonsautomat",
      "Nivåbasert automat",
    ],
    correctAnswer: "Ikke-deterministisk endelig automat",
    explanation: "NFA står for ikke-deterministisk endelig automat.",
  },

  {
    id: "tma4412-automater-7",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "medium",
    tags: ["dfa", "nfa"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva er den viktigste forskjellen mellom DFA og NFA?",
    options: [
      "En NFA kan ha flere mulige overganger for samme symbol",
      "En DFA har ingen tilstander",
      "En NFA kan ikke ha aksepttilstander",
      "En DFA kan lese flere symboler samtidig",
    ],
    correctAnswer: "En NFA kan ha flere mulige overganger for samme symbol",
    explanation:
      "I en NFA kan flere overganger være mulige fra samme tilstand med samme symbol.",
  },

  {
    id: "tma4412-automater-8",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "medium",
    tags: ["tilstander", "graf"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva representerer kantene i et tilstandsdiagram?",
    options: [
      "Overganger mellom tilstander",
      "Aksepttilstander",
      "Starttilstanden",
      "Alfabetet",
    ],
    correctAnswer: "Overganger mellom tilstander",
    explanation:
      "Kantene viser hvilke overganger som skjer når et symbol leses.",
  },

  {
    id: "tma4412-automater-9",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "medium",
    tags: ["alfabet", "teori"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva er alfabetet til en automat?",
    options: [
      "Mengden av symboler automaten kan lese",
      "Mengden av tilstander",
      "Mengden av aksepttilstander",
      "Mengden av kanter",
    ],
    correctAnswer: "Mengden av symboler automaten kan lese",
    explanation:
      "Alfabetet består av alle symbolene som kan forekomme i input.",
  },

  {
    id: "tma4412-automater-10",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "medium",
    tags: ["eksamen", "strategi"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva gjør du først når du skal undersøke om en automat aksepterer et ord?",
    options: [
      "Start i starttilstanden og følg overgangene symbol for symbol",
      "Tell antall tilstander",
      "Finn alle aksepttilstander",
      "Skriv regulært uttrykk først",
    ],
    correctAnswer:
      "Start i starttilstanden og følg overgangene symbol for symbol",
    explanation:
      "Den enkleste metoden er å simulere automaten ett symbol om gangen.",
  },

  {
    id: "tma4412-automater-11",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "medium",
    tags: ["epsilon", "nfa"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Hva er en ε-overgang i en NFA?",
    options: [
      "En overgang som kan tas uten å lese et symbol",
      "En overgang som leser alle symboler samtidig",
      "En overgang til starttilstanden",
      "En overgang som alltid går til en aksepttilstand",
    ],
    correctAnswer: "En overgang som kan tas uten å lese et symbol",
    explanation:
      "En ε-overgang lar automaten skifte tilstand uten å lese et inputsymbol.",
  },

  {
    id: "tma4412-automater-12",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "medium",
    tags: ["dfa", "epsilon"],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Kan en DFA ha ε-overganger?",
    options: [
      "Nei",
      "Ja",
      "Bare fra starttilstanden",
      "Bare til en aksepttilstand",
    ],
    correctAnswer: "Nei",
    explanation: "ε-overganger er tillatt i NFA-er, men ikke i DFA-er.",
  },

  {
    id: "tma4412-automater-13",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "medium",
    tags: ["simulering", "ord"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva gjør du når automaten leser neste symbol i et ord?",
    options: [
      "Følger overgangen merket med symbolet",
      "Går alltid tilbake til starttilstanden",
      "Velger en tilfeldig overgang",
      "Stopper simuleringen",
    ],
    correctAnswer: "Følger overgangen merket med symbolet",
    explanation:
      "Ved simulering følger du overgangen som er merket med det aktuelle symbolet.",
  },

  {
    id: "tma4412-automater-14",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "hard",
    tags: ["determinisme", "dfa"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva betyr det at en automat er deterministisk?",
    options: [
      "Neste tilstand er entydig bestemt for hvert symbol",
      "Automaten har bare én tilstand",
      "Alle tilstander er aksepttilstander",
      "Automaten har ingen løkker",
    ],
    correctAnswer: "Neste tilstand er entydig bestemt for hvert symbol",
    explanation:
      "I en DFA finnes det nøyaktig én mulig overgang for hvert symbol fra hver tilstand.",
  },

  {
    id: "tma4412-automater-15",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "hard",
    tags: ["nfa", "aksept"],
    estimatedTime: 75,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Når aksepterer en NFA et ord?",
    options: [
      "Hvis minst én mulig sti ender i en aksepttilstand",
      "Bare hvis alle stier ender i en aksepttilstand",
      "Bare hvis ordet er tomt",
      "Bare hvis starttilstanden er en aksepttilstand",
    ],
    correctAnswer: "Hvis minst én mulig sti ender i en aksepttilstand",
    explanation:
      "Det er nok at én av de mulige beregningene ender i en aksepttilstand.",
  },

  {
    id: "tma4412-automater-16",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "hard",
    tags: ["dfa", "nfa"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Kan alle NFA-er omgjøres til en ekvivalent DFA?",
    options: [
      "Ja",
      "Nei",
      "Bare hvis de har to tilstander",
      "Bare hvis de ikke har ε-overganger",
    ],
    correctAnswer: "Ja",
    explanation:
      "Alle NFA-er kan konverteres til en ekvivalent DFA ved delmengdekonstruksjon.",
  },

  {
    id: "tma4412-automater-17",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "hard",
    tags: ["graf", "tilstander"],
    estimatedTime: 75,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Hva representerer nodene i et tilstandsdiagram?",
    options: [
      "Tilstandene i automaten",
      "Inputsymbolene",
      "Ordene i språket",
      "Alfabetet",
    ],
    correctAnswer: "Tilstandene i automaten",
    explanation: "Hver node i diagrammet representerer én tilstand.",
  },

  {
    id: "tma4412-automater-18",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "hard",
    tags: ["eksamen", "simulering"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er den vanligste feilen når man simulerer en automat på eksamen?",
    options: [
      "Å hoppe over et symbol eller følge feil overgang",
      "Å telle for mange tilstander",
      "Å tegne for mange sirkler",
      "Å bruke for mange farger",
    ],
    correctAnswer: "Å hoppe over et symbol eller følge feil overgang",
    explanation:
      "Les alltid ordet ett symbol om gangen og følg overgangene nøye.",
  },

  {
    id: "tma4412-automater-19",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva bør du gjøre hvis en oppgave spør om et ord aksepteres av en automat?",
    options: [
      "Simuler automaten fra starttilstanden til hele ordet er lest",
      "Tell antall tilstander",
      "Finn først et regulært uttrykk",
      "Regn ut antall kanter",
    ],
    correctAnswer:
      "Simuler automaten fra starttilstanden til hele ordet er lest",
    explanation: "Dette er den sikreste og raskeste metoden på eksamen.",
  },

  {
    id: "tma4412-automater-20",
    subjectId: "tma4412",
    topic: "Automater",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva er en god framgangsmåte når du får en oppgave om automater?",
    options: [
      "Identifiser starttilstand, aksepttilstander og følg overgangene systematisk",
      "Tell bare antall tilstander",
      "Finn alltid et regulært uttrykk først",
      "Se bare på aksepttilstandene",
    ],
    correctAnswer:
      "Identifiser starttilstand, aksepttilstander og følg overgangene systematisk",
    explanation:
      "Dette gir en strukturert og sikker løsning på de fleste eksamensoppgaver om automater.",
  },
];
