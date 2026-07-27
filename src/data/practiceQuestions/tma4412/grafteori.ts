import type { PracticeQuestion } from "../types";

export const grafteoriQuestions: PracticeQuestion[] = [
  {
    id: "graf-1",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["grafer", "teori"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva består en graf av?",

    options: [
      "Noder og kanter.",
      "Tall og funksjoner.",
      "Mengder og relasjoner.",
      "Primtall og divisorer.",
    ],

    correctAnswer: "Noder og kanter.",

    explanation:
      "En graf består av et sett med noder (hjørner) og et sett med kanter mellom nodene.",
  },

  {
    id: "graf-2",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["rettede-grafer"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva kjennetegner en rettet graf?",

    options: [
      "Kantene har en retning.",
      "Grafen har alltid en sirkel.",
      "Alle noder har samme grad.",
      "Grafen inneholder ingen kanter.",
    ],

    correctAnswer: "Kantene har en retning.",

    explanation:
      "I en rettet graf går kantene fra én node til en annen i en bestemt retning.",
  },

  {
    id: "graf-3",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["urettede-grafer"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva kjennetegner en urettet graf?",

    options: [
      "Kantene har ingen retning.",
      "Grafen inneholder bare én node.",
      "Alle kanter er dobbeltrettede.",
      "Alle noder har grad 0.",
    ],

    correctAnswer: "Kantene har ingen retning.",

    explanation:
      "En kant mellom A og B kan traverseres begge veier i en urettet graf.",
  },

  {
    id: "graf-4",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["grad"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er graden til en node i en urettet graf?",

    options: [
      "Antall kanter som er koblet til noden.",
      "Antall noder i grafen.",
      "Antall komponenter.",
      "Antall sykler.",
    ],

    correctAnswer: "Antall kanter som er koblet til noden.",

    explanation: "Graden til en node er antall kanter som møter noden.",
  },

  {
    id: "graf-5",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["isomorfi"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva betyr det at to grafer er isomorfe?",

    options: [
      "De har samme struktur, selv om nodene kan ha ulike navn.",
      "De har samme antall noder.",
      "De har samme antall kanter.",
      "De er tegnet likt.",
    ],

    correctAnswer: "De har samme struktur, selv om nodene kan ha ulike navn.",

    explanation:
      "Isomorfe grafer kan omnummereres slik at kantene stemmer overens.",
  },

  {
    id: "graf-6",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "number-answer",
    difficulty: "medium",
    tags: ["komplette-grafer", "kanter"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvor mange kanter har en komplett urettet graf med 4 noder?",

    correctAnswer: 6,

    explanation:
      "En komplett urettet graf med n noder har n(n−1)/2 kanter. For n = 4 får vi 4·3/2 = 6.",
  },

  {
    id: "graf-7",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "number-answer",
    difficulty: "medium",
    tags: ["komplette-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvor mange kanter har en komplett urettet graf med 5 noder?",

    correctAnswer: 10,

    explanation: "5·4/2 = 10.",
  },

  {
    id: "graf-8",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["komplette-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva er formelen for antall kanter i en komplett urettet graf med n noder?",

    options: ["n(n−1)/2", "n²", "2n", "n!"],

    correctAnswer: "n(n−1)/2",

    explanation: "Hvert par av noder danner én kant.",
  },

  {
    id: "graf-9",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["komplette-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvorfor deler vi på 2 i formelen n(n−1)/2?",

    options: [
      "Hver kant blir telt to ganger.",
      "Halvparten av kantene fjernes.",
      "Grafen er urettet.",
      "Både A og C.",
    ],

    correctAnswer: "Både A og C.",

    explanation:
      "Når vi teller fra hver node, telles kanten mellom A og B både fra A og fra B. Derfor deler vi på 2 i en urettet graf.",
  },

  {
    id: "graf-10",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "number-answer",
    difficulty: "medium",
    tags: ["rettede-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hvor mange mulige rettede kanter finnes mellom 4 noder dersom løkker ikke er tillatt?",

    correctAnswer: 12,

    explanation:
      "Hver av de 4 nodene kan ha kant til de 3 andre nodene. 4·3 = 12.",
  },

  {
    id: "graf-11",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["rettede-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er formelen for antall mulige rettede kanter uten løkker?",

    options: ["n(n−1)", "n(n−1)/2", "2ⁿ", "n!"],

    correctAnswer: "n(n−1)",

    explanation: "Fra hver node kan vi gå til alle de andre nodene.",
  },

  {
    id: "graf-12",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["grad"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er summen av gradene til alle nodene i en urettet graf?",

    options: [
      "To ganger antall kanter.",
      "Lik antall kanter.",
      "Lik antall noder.",
      "Alltid et oddetall.",
    ],

    correctAnswer: "To ganger antall kanter.",

    explanation: "Hver kant bidrar med grad 1 til hver av sine to endepunkter.",
  },

  {
    id: "graf-13",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["gradfølge"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "To grafer har ulike gradfølger. Kan de være isomorfe?",

    options: [
      "Nei.",
      "Ja, alltid.",
      "Bare hvis de har like mange kanter.",
      "Bare hvis de har samme antall noder.",
    ],

    correctAnswer: "Nei.",

    explanation: "Isomorfe grafer må ha samme gradfølge.",
  },

  {
    id: "graf-14",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["isomorfi"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Er lik gradfølge nok til å konkludere at to grafer er isomorfe?",

    options: ["Nei.", "Ja.", "Bare for komplette grafer.", "Bare for trær."],

    correctAnswer: "Nei.",

    explanation:
      "Lik gradfølge er en nødvendig, men ikke tilstrekkelig, betingelse.",
  },

  {
    id: "graf-15",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["isomorfi", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva bør du sjekke først når du skal avgjøre om to grafer kan være isomorfe?",

    options: [
      "Antall noder, antall kanter og gradfølge.",
      "Bare antall noder.",
      "Bare antall kanter.",
      "Bare om de ser like ut.",
    ],

    correctAnswer: "Antall noder, antall kanter og gradfølge.",

    explanation:
      "Hvis noen av disse er forskjellige, kan grafene ikke være isomorfe.",
  },

  {
    id: "graf-16",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["telling-av-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvorfor brukes potensen 2 når vi teller urettede grafer?",

    options: [
      "Hver mulig kant kan enten være med eller ikke.",
      "Hver node har grad 2.",
      "Grafen har alltid to komponenter.",
      "Alle grafer har to kanter.",
    ],

    correctAnswer: "Hver mulig kant kan enten være med eller ikke.",

    explanation:
      "For hver mulig kant har vi to valg: ta den med eller la den være.",
  },

  {
    id: "graf-17",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "number-answer",
    difficulty: "medium",
    tags: ["telling-av-grafer"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvor mange urettede grafer finnes på 3 navngitte noder?",

    correctAnswer: 8,

    explanation:
      "Det finnes 3 mulige kanter. Hver kant kan være med eller ikke, så antallet blir 2³ = 8.",
  },

  {
    id: "graf-18",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "number-answer",
    difficulty: "medium",
    tags: ["telling-av-grafer"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvor mange urettede grafer finnes på 4 navngitte noder?",

    correctAnswer: 64,

    explanation:
      "En komplett graf på 4 noder har 6 mulige kanter. Dermed finnes 2⁶ = 64 ulike grafer.",
  },

  {
    id: "graf-19",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["telling-av-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hvor mange mulige kanter finnes mellom 5 noder i en urettet graf?",

    options: ["10", "20", "25", "15"],

    correctAnswer: "10",

    explanation: "Antallet er 5·4/2 = 10.",
  },

  {
    id: "graf-20",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["telling-av-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva er formelen for antall urettede grafer på n navngitte noder?",

    options: ["2^(n(n−1)/2)", "n!", "2^n", "n²"],

    correctAnswer: "2^(n(n−1)/2)",

    explanation:
      "Det finnes n(n−1)/2 mulige kanter, og hver kant kan være med eller ikke.",
  },

  {
    id: "graf-21",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["rettede-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva er formelen for antall rettede grafer på n navngitte noder uten løkker?",

    options: ["2^(n(n−1))", "2^(n(n−1)/2)", "n!", "2^n"],

    correctAnswer: "2^(n(n−1))",

    explanation:
      "Det finnes n(n−1) mulige rettede kanter, og hver av dem kan være med eller ikke.",
  },

  {
    id: "graf-22",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["telling-av-grafer"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva er den viktigste forskjellen når man teller rettede og urettede grafer?",

    options: [
      "I rettede grafer teller retningen på kantene.",
      "Urettede grafer har alltid flere kanter.",
      "Rettede grafer har ingen noder.",
      "Urettede grafer kan ikke ha sykler.",
    ],

    correctAnswer: "I rettede grafer teller retningen på kantene.",

    explanation: "En kant A→B er forskjellig fra en kant B→A.",
  },

  {
    id: "graf-23",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["stack", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den vanligste feilen når man teller antall grafer?",

    options: [
      "Å bruke feil antall mulige kanter.",
      "Å bruke induksjon.",
      "Å bruke modulo.",
      "Å regne med fakultet.",
    ],

    correctAnswer: "Å bruke feil antall mulige kanter.",

    explanation:
      "Start alltid med å finne hvor mange kanter som kan eksistere.",
  },

  {
    id: "graf-24",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["strategi"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva bør du gjøre først når du skal telle antall grafer?",

    options: [
      "Finn antall mulige kanter.",
      "Regn ut graden.",
      "Tegn alle grafene.",
      "Finn en sykel.",
    ],

    correctAnswer: "Finn antall mulige kanter.",

    explanation:
      "Når antall mulige kanter er kjent, er resten ofte en ren telleoppgave.",
  },

  {
    id: "graf-25",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er hovedideen bak telling av grafer?",

    options: [
      "Hver mulig kant representerer et ja/nei-valg.",
      "Alle noder må kobles sammen.",
      "Alle grafer er komplette.",
      "Alle kanter må brukes.",
    ],

    correctAnswer: "Hver mulig kant representerer et ja/nei-valg.",

    explanation:
      "For hver mulig kant velger vi om den skal være med eller ikke.",
  },

  {
    id: "graf-26",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["håndtrykkslemma", "grad"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva sier håndtrykkslemmaet?",

    options: [
      "Summen av gradene er lik to ganger antall kanter.",
      "Summen av gradene er lik antall kanter.",
      "Alle grafer har partall mange kanter.",
      "Alle noder har samme grad.",
    ],

    correctAnswer: "Summen av gradene er lik to ganger antall kanter.",

    explanation:
      "Hver kant bidrar med 1 til graden til hvert av sine to endepunkter.",
  },

  {
    id: "graf-27",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "number-answer",
    difficulty: "medium",
    tags: ["håndtrykkslemma"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "En urettet graf har 8 kanter. Hva er summen av gradene?",

    correctAnswer: 16,

    explanation: "Håndtrykkslemmaet gir 2·8 = 16.",
  },

  {
    id: "graf-28",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["grad"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvor mange noder med oddetallsgrad kan en urettet graf ha?",

    options: ["Et partall.", "Et oddetall.", "Akkurat to.", "Akkurat fire."],

    correctAnswer: "Et partall.",

    explanation:
      "En konsekvens av håndtrykkslemmaet er at antallet noder med oddetallsgrad alltid er partall.",
  },

  {
    id: "graf-29",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["gradfølge"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvilken gradfølge kan ikke komme fra en urettet graf?",

    options: ["(3,2,2)", "(2,2,2,2)", "(3,3,2,2)", "(1,1)"],

    correctAnswer: "(3,2,2)",

    explanation:
      "Summen av gradene er 7, som er oddetall. Det er umulig i en urettet graf.",
  },

  {
    id: "graf-30",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["isomorfi"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvilken egenskap bevares alltid under en grafisomorfi?",

    options: [
      "Graden til hver node.",
      "Navnene på nodene.",
      "Hvordan grafen er tegnet.",
      "Plasseringen på arket.",
    ],

    correctAnswer: "Graden til hver node.",

    explanation:
      "Isomorfi bevarer grafens struktur, ikke hvordan den tegnes eller hvilke navn nodene har.",
  },

  {
    id: "graf-31",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["isomorfi"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "To grafer har samme antall noder og samme antall kanter. Er de nødvendigvis isomorfe?",

    options: [
      "Nei.",
      "Ja.",
      "Bare hvis de er komplette.",
      "Bare hvis de er trær.",
    ],

    correctAnswer: "Nei.",

    explanation:
      "Like mange noder og kanter er nødvendig, men ikke tilstrekkelig for isomorfi.",
  },

  {
    id: "graf-32",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["komplette-grafer"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er graden til hver node i en komplett graf K₆?",

    options: ["5", "6", "10", "15"],

    correctAnswer: "5",

    explanation: "I K₆ er hver node koblet til de fem andre nodene.",
  },

  {
    id: "graf-33",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "number-answer",
    difficulty: "medium",
    tags: ["komplette-grafer"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvor mange kanter har den komplette grafen K₆?",

    correctAnswer: 15,

    explanation: "K₆ har 6·5/2 = 15 kanter.",
  },

  {
    id: "graf-34",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva er den beste strategien når du skal avgjøre om to grafer er isomorfe?",

    options: [
      "Sammenlign antall noder, kanter og gradfølger først.",
      "Se om de ser like ut.",
      "Tegn dem på nytt.",
      "Tell bare antall kanter.",
    ],

    correctAnswer: "Sammenlign antall noder, kanter og gradfølger først.",

    explanation:
      "Disse enkle testene kan raskt utelukke at to grafer er isomorfe.",
  },

  {
    id: "graf-35",
    subjectId: "tma4412",
    topic: "Grafer",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den viktigste lærdommen fra grafteori i TMA4412?",

    options: [
      "Analyser grafens struktur systematisk før du regner.",
      "Start alltid med en formel.",
      "Bruk alltid induksjon.",
      "Alle grafer kan behandles likt.",
    ],

    correctAnswer: "Analyser grafens struktur systematisk før du regner.",

    explanation:
      "Mange grafoppgaver blir enkle når du først identifiserer struktur, grad og type graf.",
  },
];
