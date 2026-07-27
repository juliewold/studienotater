import type { PracticeQuestion } from "../types";

export const bevisteknikkerQuestions: PracticeQuestion[] = [
  {
    id: "bevis-1",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["bevismetoder"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hvilken bevismetode starter med å anta at premisset er sant og utleder konklusjonen?",

    options: [
      "Direkte bevis",
      "Kontraposisjon",
      "Motsigelsesbevis",
      "Moteksempel",
    ],

    correctAnswer: "Direkte bevis",

    explanation:
      "I et direkte bevis antar vi at premisset gjelder og viser steg for steg at konklusjonen følger.",
  },

  {
    id: "bevis-2",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kontraposisjon"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hvilken bevismetode starter med å anta at konklusjonen er usann?",

    options: ["Kontraposisjon", "Direkte bevis", "Moteksempel", "Induksjon"],

    correctAnswer: "Kontraposisjon",

    explanation:
      "Ved kontraposisjon antar vi at konklusjonen er usann og viser at premisset også må være usant.",
  },

  {
    id: "bevis-3",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["motsigelse"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hvilken bevismetode går ut på å anta at utsagnet er usant og så komme frem til en selvmotsigelse?",

    options: [
      "Motsigelsesbevis",
      "Direkte bevis",
      "Moteksempel",
      "Kontraposisjon",
    ],

    correctAnswer: "Motsigelsesbevis",

    explanation:
      "Hvis antakelsen fører til en motsigelse, må den være feil, og utsagnet er derfor sant.",
  },

  {
    id: "bevis-4",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["moteksempel"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hvordan viser man at et universelt utsagn er usant?",

    options: [
      "Finne ett moteksempel",
      "Bruke induksjon",
      "Bruke kontraposisjon",
      "Lage et direkte bevis",
    ],

    correctAnswer: "Finne ett moteksempel",

    explanation:
      "Ett eneste moteksempel er nok til å motbevise et universelt utsagn.",
  },

  {
    id: "bevis-5",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["valg-av-metode"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Du skal bevise: 'Hvis n er partall, så er n² partall.' Hvilken metode er mest naturlig?",

    options: ["Direkte bevis", "Moteksempel", "Motsigelse", "Kontraposisjon"],

    correctAnswer: "Direkte bevis",

    explanation:
      "Vi kan skrive n = 2k og regne oss direkte frem til at n² også er delelig på 2.",
  },

  {
    id: "bevis-6",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["valg-av-metode"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Du skal bevise: 'Hvis n² er partall, så er n partall.' Hvilken metode er mest naturlig?",

    options: ["Kontraposisjon", "Direkte bevis", "Moteksempel", "Induksjon"],

    correctAnswer: "Kontraposisjon",

    explanation:
      "Det er enklere å vise kontraposisjonen: Hvis n er oddetall, så er n² oddetall.",
  },

  {
    id: "bevis-7",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["valg-av-metode"],
    estimatedTime: 2,
    examFrequency: "medium",

    question:
      "Du skal vise at √2 er irrasjonalt. Hvilken bevismetode brukes vanligvis?",

    options: ["Motsigelsesbevis", "Direkte bevis", "Moteksempel", "Induksjon"],

    correctAnswer: "Motsigelsesbevis",

    explanation:
      "Det klassiske beviset antar at √2 er rasjonalt og ender i en motsigelse.",
  },

  {
    id: "bevis-8",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["moteksempel"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hvilket av følgende er et moteksempel til utsagnet 'Alle oddetall er primtall'?",

    options: ["9", "7", "5", "3"],

    correctAnswer: "9",

    explanation: "9 er oddetall, men ikke et primtall siden 9 = 3 · 3.",
  },

  {
    id: "bevis-9",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["direkte-bevis"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva er første steg i et direkte bevis av utsagnet 'Hvis n er partall, så er n² partall'?",

    options: [
      "Anta at n er partall.",
      "Anta at n² er partall.",
      "Anta at n er oddetall.",
      "Finn et moteksempel.",
    ],

    correctAnswer: "Anta at n er partall.",

    explanation:
      "Et direkte bevis starter alltid med å anta at premisset er sant.",
  },

  {
    id: "bevis-10",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["direkte-bevis", "partall"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Etter at du har antatt at n er partall, hva gjør du vanligvis videre?",

    options: [
      "Skriv n = 2k for et heltall k.",
      "Skriv n = 2k + 1.",
      "Bruk induksjon.",
      "Anta at konklusjonen er usann.",
    ],

    correctAnswer: "Skriv n = 2k for et heltall k.",

    explanation:
      "Definisjonen av et partall er at det kan skrives som n = 2k for et heltall k.",
  },
  {
    id: "bevis-11",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kontraposisjon"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva er kontraposisjonen til utsagnet P → Q?",

    options: ["¬Q → ¬P", "¬P → ¬Q", "Q → P", "P → ¬Q"],

    correctAnswer: "¬Q → ¬P",

    explanation: "Kontraposisjonen til P → Q er alltid ¬Q → ¬P.",
  },

  {
    id: "bevis-12",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["kontraposisjon"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Er et utsagn og kontraposisjonen alltid logisk ekvivalente?",

    options: ["Ja", "Nei"],

    correctAnswer: "Ja",

    explanation:
      "Et utsagn og kontraposisjonen har alltid samme sannhetsverdi.",
  },

  {
    id: "bevis-13",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kontraposisjon"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva antar man først når man skal bevise P → Q ved kontraposisjon?",

    options: ["¬Q", "P", "Q", "¬P"],

    correctAnswer: "¬Q",

    explanation: "Ved kontraposisjon antar vi at konklusjonen er usann.",
  },

  {
    id: "bevis-14",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kontraposisjon"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er målet etter at vi har antatt ¬Q?",

    options: ["Å vise ¬P", "Å vise P", "Å vise Q", "Å finne et moteksempel"],

    correctAnswer: "Å vise ¬P",

    explanation: "Kontraposisjonen består av utsagnet ¬Q → ¬P.",
  },

  {
    id: "bevis-15",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kontraposisjon", "partall"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva er kontraposisjonen til 'Hvis n er partall, så er n² partall'?",

    options: [
      "Hvis n² er oddetall, så er n oddetall.",
      "Hvis n² er partall, så er n partall.",
      "Hvis n er oddetall, så er n² partall.",
      "Hvis n² er oddetall, så er n partall.",
    ],

    correctAnswer: "Hvis n² er oddetall, så er n oddetall.",

    explanation: "Vi negerer begge utsagnene og bytter plass på dem.",
  },

  {
    id: "bevis-16",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kontraposisjon"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvorfor brukes kontraposisjon ofte?",

    options: [
      "Fordi kontraposisjonen ofte er enklere å bevise.",
      "Fordi den alltid er kortere.",
      "Fordi direkte bevis er feil.",
      "Fordi den gir moteksempler.",
    ],

    correctAnswer: "Fordi kontraposisjonen ofte er enklere å bevise.",

    explanation:
      "Mange utsagn er vanskelige å bevise direkte, men enkle via kontraposisjon.",
  },

  {
    id: "bevis-17",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["kontraposisjon"],
    estimatedTime: 2,
    examFrequency: "medium",

    question: "Hva er kontraposisjonen til 'Hvis x > 2, så er x > 1'?",

    options: [
      "Hvis x ≤ 1, så er x ≤ 2.",
      "Hvis x ≤ 2, så er x ≤ 1.",
      "Hvis x > 1, så er x > 2.",
      "Hvis x ≤ 2, så er x > 1.",
    ],

    correctAnswer: "Hvis x ≤ 1, så er x ≤ 2.",

    explanation: "Vi negerer begge utsagnene og bytter rekkefølgen.",
  },

  {
    id: "bevis-18",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["kontraposisjon"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvilket utsagn er logisk ekvivalent med P → Q?",

    options: ["¬Q → ¬P", "Q → P", "¬P → ¬Q", "P ∧ Q"],

    correctAnswer: "¬Q → ¬P",

    explanation: "Et utsagn er alltid logisk ekvivalent med kontraposisjonen.",
  },

  {
    id: "bevis-19",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["kontraposisjon"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Når er kontraposisjon spesielt nyttig?",

    options: [
      "Når direkte bevis blir vanskelig.",
      "Kun ved induksjon.",
      "Kun ved mengdebevis.",
      "Kun ved sannhetstabeller.",
    ],

    correctAnswer: "Når direkte bevis blir vanskelig.",

    explanation: "Da kan kontraposisjonen gi en mye enklere vei til beviset.",
  },

  {
    id: "bevis-20",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["kontraposisjon", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva er den vanligste feilen når studenter bruker kontraposisjon?",

    options: [
      "De skriver inversen i stedet for kontraposisjonen.",
      "De bruker for mange mellomregninger.",
      "De glemmer å nummerere stegene.",
      "De bruker for mange symboler.",
    ],

    correctAnswer: "De skriver inversen i stedet for kontraposisjonen.",

    explanation:
      "Mange blander sammen inversen (¬P → ¬Q) og kontraposisjonen (¬Q → ¬P).",
  },

  {
    id: "bevis-21",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["motsigelse"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva er første steg i et motsigelsesbevis?",

    options: [
      "Anta at utsagnet er usant.",
      "Anta at utsagnet er sant.",
      "Finn et moteksempel.",
      "Bruk induksjon.",
    ],

    correctAnswer: "Anta at utsagnet er usant.",

    explanation:
      "I et motsigelsesbevis antar vi det motsatte av det vi ønsker å bevise.",
  },

  {
    id: "bevis-22",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["motsigelse"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Når er et motsigelsesbevis ferdig?",

    options: [
      "Når antakelsen fører til en selvmotsigelse.",
      "Når vi finner et moteksempel.",
      "Når vi har brukt kontraposisjon.",
      "Når vi har skrevet definisjonen.",
    ],

    correctAnswer: "Når antakelsen fører til en selvmotsigelse.",

    explanation:
      "En selvmotsigelse viser at den opprinnelige antakelsen må være feil.",
  },

  {
    id: "bevis-23",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["motsigelse"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er hensikten med å finne en motsigelse?",

    options: [
      "Å vise at antakelsen ikke kan være sann.",
      "Å finne et moteksempel.",
      "Å vise at definisjonen er feil.",
      "Å bevise kontraposisjonen.",
    ],

    correctAnswer: "Å vise at antakelsen ikke kan være sann.",

    explanation: "Hvis antakelsen gir en logisk umulighet, må den forkastes.",
  },

  {
    id: "bevis-24",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["motsigelse"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvilket utsagn bevises klassisk med motsigelse?",

    options: [
      "√2 er irrasjonalt.",
      "2 + 2 = 4.",
      "Summen av to partall er partall.",
      "0 er et heltall.",
    ],

    correctAnswer: "√2 er irrasjonalt.",

    explanation:
      "Dette er kanskje det mest kjente motsigelsesbeviset i matematikk.",
  },

  {
    id: "bevis-25",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["motsigelse"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "I beviset for at √2 er irrasjonalt antar vi først at ...",

    options: [
      "√2 er rasjonalt.",
      "√2 er irrasjonalt.",
      "√2 er et heltall.",
      "√2 er negativt.",
    ],

    correctAnswer: "√2 er rasjonalt.",

    explanation: "Vi antar det motsatte av det vi ønsker å bevise.",
  },

  {
    id: "bevis-26",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["motsigelse"],
    estimatedTime: 2,
    examFrequency: "medium",

    question:
      "Hva viser en motsigelse som 'et tall er både partall og oddetall'?",

    options: [
      "At en tidligere antakelse må være feil.",
      "At definisjonen av partall er feil.",
      "At algebra ikke fungerer.",
      "At utsagnet er usant.",
    ],

    correctAnswer: "At en tidligere antakelse må være feil.",

    explanation: "En logisk umulighet betyr at én av antakelsene må forkastes.",
  },

  {
    id: "bevis-27",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["motsigelse"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvorfor fungerer motsigelsesbevis?",

    options: [
      "Fordi en sann antakelse ikke kan føre til en logisk motsigelse.",
      "Fordi alle utsagn kan bevises.",
      "Fordi moteksempler alltid finnes.",
      "Fordi induksjon alltid virker.",
    ],

    correctAnswer:
      "Fordi en sann antakelse ikke kan føre til en logisk motsigelse.",

    explanation:
      "Logikken bygger på at sanne premisser ikke kan gi en selvmotsigelse.",
  },

  {
    id: "bevis-28",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["motsigelse"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvilket av følgende er en logisk motsigelse?",

    options: ["P og ¬P", "P eller ¬P", "P → Q", "¬P → Q"],

    correctAnswer: "P og ¬P",

    explanation: "Et utsagn kan ikke være både sant og usant samtidig.",
  },

  {
    id: "bevis-29",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["motsigelse"],
    estimatedTime: 3,
    examFrequency: "medium",

    question: "Hva gjør du etter at du har funnet en motsigelse?",

    options: [
      "Konkluderer at antakelsen var feil.",
      "Starter beviset på nytt.",
      "Leter etter et moteksempel.",
      "Bruker kontraposisjon.",
    ],

    correctAnswer: "Konkluderer at antakelsen var feil.",

    explanation:
      "Når motsigelsen er funnet, vet vi at den opprinnelige antakelsen ikke kan stemme.",
  },

  {
    id: "bevis-30",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["motsigelse", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den vanligste feilen studenter gjør i motsigelsesbevis?",

    options: [
      "De avslutter uten å forklare hva motsigelsen innebærer.",
      "De bruker for mange symboler.",
      "De skriver for mange mellomregninger.",
      "De bruker for lite tekst.",
    ],

    correctAnswer: "De avslutter uten å forklare hva motsigelsen innebærer.",

    explanation:
      "Et godt bevis må alltid avslutte med å forklare hvorfor motsigelsen viser at utsagnet er sant.",
  },

  {
    id: "bevis-31",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["moteksempel"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Hvor mange moteksempler trenger du for å motbevise et universelt utsagn?",

    options: ["Ett", "To", "Tre", "Uendelig mange"],

    correctAnswer: "Ett",

    explanation:
      "Ett eneste moteksempel er nok til å vise at et universelt utsagn er usant.",
  },

  {
    id: "bevis-32",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["moteksempel"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva viser et moteksempel?",

    options: [
      "At et universelt utsagn er usant.",
      "At et utsagn alltid er sant.",
      "At kontraposisjonen gjelder.",
      "At et bevis er fullført.",
    ],

    correctAnswer: "At et universelt utsagn er usant.",

    explanation:
      "Et moteksempel viser at utsagnet ikke gjelder for alle elementer.",
  },

  {
    id: "bevis-33",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["moteksempel"],
    estimatedTime: 2,
    examFrequency: "medium",

    question:
      "Hvilket tall er et moteksempel til utsagnet 'Alle primtall er oddetall'?",

    options: ["2", "3", "5", "7"],

    correctAnswer: "2",

    explanation: "2 er et primtall, men det er partall.",
  },

  {
    id: "bevis-34",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["moteksempel"],
    estimatedTime: 2,
    examFrequency: "medium",

    question: "Kan et moteksempel brukes til å bevise at et utsagn er sant?",

    options: ["Nei", "Ja"],

    correctAnswer: "Nei",

    explanation: "Moteksempler brukes bare til å motbevise universelle utsagn.",
  },

  {
    id: "bevis-35",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["moteksempel"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hvilket tall er et moteksempel til utsagnet 'For alle heltall x gjelder x² > x'?",

    options: ["0", "2", "3", "4"],

    correctAnswer: "0",

    explanation: "For x = 0 får vi 0² = 0, og 0 > 0 er usant.",
  },

  {
    id: "bevis-36",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["eksamen", "vanlige-feil"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er den vanligste feilen i et direkte bevis?",

    options: [
      "Å anta konklusjonen i stedet for premisset.",
      "Å bruke for mange symboler.",
      "Å bruke for mye tekst.",
      "Å skrive svaret for kort.",
    ],

    correctAnswer: "Å anta konklusjonen i stedet for premisset.",

    explanation: "I et direkte bevis skal man alltid starte med premisset.",
  },

  {
    id: "bevis-37",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["eksamen", "vanlige-feil"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er den vanligste feilen ved kontraposisjon?",

    options: [
      "Å skrive inversen i stedet for kontraposisjonen.",
      "Å bruke induksjon.",
      "Å finne et moteksempel.",
      "Å starte med premisset.",
    ],

    correctAnswer: "Å skrive inversen i stedet for kontraposisjonen.",

    explanation: "Mange bytter ikke rekkefølgen når de negerer utsagnet.",
  },

  {
    id: "bevis-38",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen", "vanlige-feil"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva bør alltid stå i siste linje av et matematisk bevis?",

    options: [
      "En konklusjon som forklarer hvorfor beviset er ferdig.",
      "Et nytt regnestykke.",
      "Et eksempel.",
      "Et moteksempel.",
    ],

    correctAnswer: "En konklusjon som forklarer hvorfor beviset er ferdig.",

    explanation:
      "Sensor ønsker å se at du knytter sammen argumentasjonen og konklusjonen.",
  },

  {
    id: "bevis-39",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hvilken bevismetode bør du normalt prøve først dersom et direkte bevis virker enkelt?",

    options: ["Direkte bevis", "Motsigelse", "Kontraposisjon", "Moteksempel"],

    correctAnswer: "Direkte bevis",

    explanation:
      "Det enkleste gyldige beviset er vanligvis det beste valget på eksamen.",
  },

  {
    id: "bevis-40",
    subjectId: "tma4412",
    topic: "Bevisteknikker",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["bevismetoder", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den viktigste regelen når du velger bevismetode?",

    options: [
      "Velg metoden som gjør beviset enklest.",
      "Bruk alltid motsigelse.",
      "Bruk alltid kontraposisjon.",
      "Bruk alltid induksjon.",
    ],

    correctAnswer: "Velg metoden som gjør beviset enklest.",

    explanation:
      "Det finnes sjelden én riktig metode. Målet er å velge en korrekt metode som gjør beviset oversiktlig og enkelt.",
  },
];
