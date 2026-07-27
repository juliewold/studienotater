import type { PracticeQuestion } from "../types";

export const regulaereUttrykkQuestions: PracticeQuestion[] = [
  {
    id: "tma4412-regulaere-uttrykk-1",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "easy",
    tags: ["definisjon", "regex"],
    estimatedTime: 30,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva beskriver et regulært uttrykk?",
    options: ["Et regulært språk", "En graf", "Et binært tre", "En funksjon"],
    correctAnswer: "Et regulært språk",
    explanation:
      "Et regulært uttrykk beskriver mengden av ord som tilhører et regulært språk.",
  },

  {
    id: "tma4412-regulaere-uttrykk-2",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "easy",
    tags: ["union", "regex"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva betyr operatoren | i et regulært uttrykk?",
    options: ["Union (eller)", "Konkatenasjon", "Kleene-stjerne", "Tomt ord"],
    correctAnswer: "Union (eller)",
    explanation: "Operatoren | betyr at ett av uttrykkene kan velges.",
  },

  {
    id: "tma4412-regulaere-uttrykk-3",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "easy",
    tags: ["kleene", "regex"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva betyr Kleene-stjernen (*)?",
    options: [
      "Null eller flere repetisjoner",
      "Nøyaktig én repetisjon",
      "Maksimalt én repetisjon",
      "To repetisjoner",
    ],
    correctAnswer: "Null eller flere repetisjoner",
    explanation:
      "Kleene-stjernen betyr at uttrykket kan gjentas vilkårlig mange ganger, også null ganger.",
  },

  {
    id: "tma4412-regulaere-uttrykk-4",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "easy",
    tags: ["konkatenasjon", "regex"],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva betyr konkatenasjon?",
    options: [
      "Å sette uttrykk etter hverandre",
      "Å velge mellom uttrykk",
      "Å gjenta et uttrykk",
      "Å avslutte et uttrykk",
    ],
    correctAnswer: "Å sette uttrykk etter hverandre",
    explanation:
      "Konkatenasjon betyr at symbolene eller uttrykkene kommer etter hverandre.",
  },

  {
    id: "tma4412-regulaere-uttrykk-5",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "easy",
    tags: ["epsilon", "regex"],
    estimatedTime: 45,
    examFrequency: "medium",
    type: "multiple-choice",
    question: "Hva representerer ε i regulære uttrykk?",
    options: [
      "Det tomme ordet",
      "Den tomme mengden",
      "En starttilstand",
      "Et alfabet",
    ],
    correctAnswer: "Det tomme ordet",
    explanation: "ε er ordet med lengde 0.",
  },

  {
    id: "tma4412-regulaere-uttrykk-6",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "medium",
    tags: ["regex", "språk"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hvilket språk beskriver uttrykket a*?",
    options: [
      "Alle ord som består av null eller flere a-er",
      "Bare ordet a",
      "Alle ord med én b",
      "Alle ord som starter med b",
    ],
    correctAnswer: "Alle ord som består av null eller flere a-er",
    explanation: "a* beskriver ε, a, aa, aaa osv.",
  },

  {
    id: "tma4412-regulaere-uttrykk-7",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "medium",
    tags: ["regex", "union"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hvilket språk beskriver uttrykket a|b?",
    options: [
      "Ordene a eller b",
      "Bare ab",
      "Alle ord som inneholder a",
      "Alle ord som inneholder b",
    ],
    correctAnswer: "Ordene a eller b",
    explanation: "Operatoren | betyr valg mellom alternativene.",
  },

  {
    id: "tma4412-regulaere-uttrykk-8",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "medium",
    tags: ["regex", "konkatenasjon"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hvilket ord beskrives av uttrykket ab?",
    options: [
      "Bare ordet ab",
      "a eller b",
      "Alle ord som starter med a",
      "Alle ord med to bokstaver",
    ],
    correctAnswer: "Bare ordet ab",
    explanation:
      "Konkatenasjon betyr at symbolene kommer rett etter hverandre.",
  },

  {
    id: "tma4412-regulaere-uttrykk-9",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "medium",
    tags: ["regex", "kleene"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hvilket av disse ordene tilhører språket beskrevet av a*?",
    options: ["aaaa", "b", "ab", "ba"],
    correctAnswer: "aaaa",
    explanation:
      "Alle ord som bare består av a-er (inkludert ε) ligger i språket.",
  },

  {
    id: "tma4412-regulaere-uttrykk-10",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "medium",
    tags: ["eksamen", "strategi"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva bør du gjøre først når du får et regulært uttrykk på eksamen?",
    options: [
      "Finn ut hvilke ord uttrykket beskriver",
      "Tegn en graf",
      "Finn gcd",
      "Regn ut en modulær invers",
    ],
    correctAnswer: "Finn ut hvilke ord uttrykket beskriver",
    explanation:
      "Start alltid med å tolke betydningen av operatorene og hvilket språk uttrykket beskriver.",
  },

  {
    id: "tma4412-regulaere-uttrykk-11",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "medium",
    tags: ["regex", "konkatenasjon"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hvilket språk beskriver uttrykket (ab)*?",
    options: [
      "Alle ord som består av null eller flere repetisjoner av ab",
      "Alle ord som starter med a",
      "Alle ord som slutter med b",
      "Bare ordet ab",
    ],
    correctAnswer: "Alle ord som består av null eller flere repetisjoner av ab",
    explanation: "(ab)* beskriver ε, ab, abab, ababab osv.",
  },

  {
    id: "tma4412-regulaere-uttrykk-12",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "medium",
    tags: ["union", "regex"],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hvilket språk beskriver uttrykket (a|b)*?",
    options: [
      "Alle ord over alfabetet {a,b}",
      "Bare ordet ab",
      "Alle ord som inneholder minst én a",
      "Alle ord med nøyaktig to bokstaver",
    ],
    correctAnswer: "Alle ord over alfabetet {a,b}",
    explanation:
      "(a|b)* beskriver alle endelige ord som kan dannes av symbolene a og b.",
  },

  {
    id: "tma4412-regulaere-uttrykk-13",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "hard",
    tags: ["automater", "regex"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er sammenhengen mellom regulære uttrykk og endelige automater?",
    options: [
      "De beskriver nøyaktig de samme språkene",
      "Regulære uttrykk kan beskrive flere språk enn automater",
      "Automater kan beskrive flere språk enn regulære uttrykk",
      "De har ingen sammenheng",
    ],
    correctAnswer: "De beskriver nøyaktig de samme språkene",
    explanation:
      "Regulære uttrykk og endelige automater er ekvivalente modeller for regulære språk.",
  },

  {
    id: "tma4412-regulaere-uttrykk-14",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "hard",
    tags: ["automater", "teori"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Kan enhver DFA omgjøres til et regulært uttrykk?",
    options: [
      "Ja",
      "Nei",
      "Bare hvis den har én aksepttilstand",
      "Bare hvis alfabetet har to symboler",
    ],
    correctAnswer: "Ja",
    explanation:
      "Alle DFA-er kan konverteres til et ekvivalent regulært uttrykk.",
  },

  {
    id: "tma4412-regulaere-uttrykk-15",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "hard",
    tags: ["automater", "teori"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Kan ethvert regulært uttrykk omgjøres til en automat?",
    options: [
      "Ja",
      "Nei",
      "Bare hvis uttrykket ikke inneholder *",
      "Bare hvis uttrykket inneholder |",
    ],
    correctAnswer: "Ja",
    explanation:
      "Alle regulære uttrykk kan konverteres til en ekvivalent NFA, og videre til en DFA.",
  },

  {
    id: "tma4412-regulaere-uttrykk-16",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "hard",
    tags: ["kleene", "teori"],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva er den viktigste egenskapen til Kleene-stjernen?",
    options: [
      "Den tillater null eller flere repetisjoner",
      "Den betyr nøyaktig én repetisjon",
      "Den betyr valg mellom to uttrykk",
      "Den markerer en aksepttilstand",
    ],
    correctAnswer: "Den tillater null eller flere repetisjoner",
    explanation:
      "Kleene-stjernen er operatoren som gjør at et uttrykk kan gjentas vilkårlig mange ganger.",
  },

  {
    id: "tma4412-regulaere-uttrykk-17",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "hard",
    tags: ["eksamen", "tolkning"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question: "Hva er den vanligste feilen når man tolker et regulært uttrykk?",
    options: [
      "Å misforstå betydningen av operatorene",
      "Å telle for mange tilstander",
      "Å glemme starttilstanden",
      "Å bruke for mange parenteser",
    ],
    correctAnswer: "Å misforstå betydningen av operatorene",
    explanation:
      "De fleste feil skyldes feil tolkning av |, konkatenasjon eller Kleene-stjernen.",
  },

  {
    id: "tma4412-regulaere-uttrykk-18",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er en god strategi når du skal lage et regulært uttrykk fra en tekstbeskrivelse?",
    options: [
      "Finn først hvilke ord som skal være med, og bygg uttrykket steg for steg",
      "Skriv alltid * først",
      "Begynn med en automat",
      "Tell antall symboler",
    ],
    correctAnswer:
      "Finn først hvilke ord som skal være med, og bygg uttrykket steg for steg",
    explanation:
      "Det er enklest å oversette beskrivelsen til små deler og deretter sette dem sammen.",
  },

  {
    id: "tma4412-regulaere-uttrykk-19",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er en god strategi når du skal finne språket til et regulært uttrykk?",
    options: [
      "Skriv opp noen ord som matcher uttrykket og se etter et mønster",
      "Finn gcd",
      "Primtallsfaktoriser uttrykket",
      "Lag alltid et binært tre",
    ],
    correctAnswer:
      "Skriv opp noen ord som matcher uttrykket og se etter et mønster",
    explanation:
      "Å teste uttrykket på noen enkle ord gjør det ofte mye lettere å se hvilket språk det beskriver.",
  },

  {
    id: "tma4412-regulaere-uttrykk-20",
    subjectId: "tma4412",
    topic: "Regulære uttrykk",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er en god framgangsmåte når du får en oppgave om regulære uttrykk?",
    options: [
      "Bryt uttrykket opp i små deler, tolk hver operator og kontroller med eksempler",
      "Tell antall parenteser",
      "Finn først alle tilstandene",
      "Bruk alltid en sannhetstabell",
    ],
    correctAnswer:
      "Bryt uttrykket opp i små deler, tolk hver operator og kontroller med eksempler",
    explanation:
      "Dette er den mest systematiske metoden og fungerer på de fleste eksamensoppgaver.",
  },
];
