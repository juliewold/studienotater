import type { PracticeQuestion } from "../types";

export const induksjonQuestions: PracticeQuestion[] = [
  {
    id: "induksjon-1",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["induksjon", "teori"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva er hovedideen bak matematisk induksjon?",

    options: [
      "Å vise at et utsagn gjelder for alle naturlige tall.",
      "Å finne et moteksempel.",
      "Å bevise ved kontraposisjon.",
      "Å bruke sannhetstabeller.",
    ],

    correctAnswer: "Å vise at et utsagn gjelder for alle naturlige tall.",

    explanation:
      "Matematisk induksjon brukes til å bevise utsagn som skal gjelde for alle naturlige tall.",
  },

  {
    id: "induksjon-2",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["basissteg"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva kalles det første steget i et induksjonsbevis?",

    options: [
      "Basissteget",
      "Induksjonshypotesen",
      "Induksjonssteget",
      "Konklusjonen",
    ],

    correctAnswer: "Basissteget",

    explanation:
      "Basissteget viser at utsagnet gjelder for startverdien, ofte n = 1.",
  },

  {
    id: "induksjon-3",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["induksjonshypotese"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva gjør vi i induksjonshypotesen?",

    options: [
      "Vi antar at utsagnet gjelder for n = k.",
      "Vi viser at utsagnet gjelder for n = 1.",
      "Vi antar at utsagnet er usant.",
      "Vi finner et moteksempel.",
    ],

    correctAnswer: "Vi antar at utsagnet gjelder for n = k.",

    explanation:
      "Induksjonshypotesen er en midlertidig antakelse som brukes i neste steg.",
  },

  {
    id: "induksjon-4",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["induksjonssteg"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva er målet i induksjonssteget?",

    options: [
      "Å vise at utsagnet gjelder for n = k + 1.",
      "Å vise at utsagnet gjelder for n = 0.",
      "Å motbevise hypotesen.",
      "Å finne et moteksempel.",
    ],

    correctAnswer: "Å vise at utsagnet gjelder for n = k + 1.",

    explanation: "Vi bruker induksjonshypotesen til å bevise neste tilfelle.",
  },

  {
    id: "induksjon-5",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["teori"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvilke tre deler består et vanlig induksjonsbevis av?",

    options: [
      "Basissteg, induksjonshypotese og induksjonssteg.",
      "Premiss, konklusjon og motsigelse.",
      "Direkte bevis, kontraposisjon og moteksempel.",
      "Definisjon, teorem og korollar.",
    ],

    correctAnswer: "Basissteg, induksjonshypotese og induksjonssteg.",

    explanation: "Et standard induksjonsbevis består av disse tre delene.",
  },

  {
    id: "induksjon-6",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["basissteg"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hvilken verdi brukes oftest i basissteget?",

    options: ["n = 1", "n = k", "n = k + 1", "n = 2k"],

    correctAnswer: "n = 1",

    explanation:
      "De fleste induksjonsbevis starter med å vise at utsagnet gjelder for n = 1, men andre startverdier kan også forekomme.",
  },

  {
    id: "induksjon-7",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["basissteg"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hvorfor må basissteget bevises?",

    options: [
      "For å vise at induksjonen har et gyldig startpunkt.",
      "For å finne induksjonshypotesen.",
      "For å vise at utsagnet er usant.",
      "For å velge bevismetode.",
    ],

    correctAnswer: "For å vise at induksjonen har et gyldig startpunkt.",

    explanation:
      "Uten et gyldig startpunkt kan ikke induksjonen settes i gang.",
  },

  {
    id: "induksjon-8",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["induksjonshypotese"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva betyr det å anta induksjonshypotesen?",

    options: [
      "Vi antar midlertidig at utsagnet gjelder for n = k.",
      "Vi antar at utsagnet er bevist.",
      "Vi antar at utsagnet er usant.",
      "Vi antar at n = k + 1.",
    ],

    correctAnswer: "Vi antar midlertidig at utsagnet gjelder for n = k.",

    explanation:
      "Hypotesen brukes bare som et hjelpemiddel for å bevise neste tilfelle.",
  },

  {
    id: "induksjon-9",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["induksjonssteg"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva bruker vi induksjonshypotesen til?",

    options: [
      "Å bevise utsagnet for n = k + 1.",
      "Å bevise basissteget.",
      "Å finne et moteksempel.",
      "Å motbevise utsagnet.",
    ],

    correctAnswer: "Å bevise utsagnet for n = k + 1.",

    explanation:
      "Induksjonshypotesen er verktøyet vi bruker i induksjonssteget.",
  },

  {
    id: "induksjon-10",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["induksjonssteg"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er den vanligste feilen i induksjonssteget?",

    options: [
      "Å ikke bruke induksjonshypotesen.",
      "Å starte med n = 1.",
      "Å bruke algebra.",
      "Å skrive for mange mellomregninger.",
    ],

    correctAnswer: "Å ikke bruke induksjonshypotesen.",

    explanation:
      "Hvis hypotesen aldri brukes, er det ikke et gyldig induksjonsbevis.",
  },

  {
    id: "induksjon-11",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["teori"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvorfor virker matematisk induksjon?",

    options: [
      "Fordi basissteget og induksjonssteget sammen dekker alle naturlige tall.",
      "Fordi alle matematiske utsagn er sanne.",
      "Fordi vi bruker algebra.",
      "Fordi kontraposisjon gjelder.",
    ],

    correctAnswer:
      "Fordi basissteget og induksjonssteget sammen dekker alle naturlige tall.",

    explanation:
      "Når første brikke faller og hver brikke velter den neste, velter alle.",
  },

  {
    id: "induksjon-12",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["teori"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvilken analogi brukes ofte for å forklare induksjon?",

    options: ["Dominobrikker", "Sannhetstabeller", "Venn-diagram", "Grafer"],

    correctAnswer: "Dominobrikker",

    explanation:
      "Hvis den første dominobrikken faller, og hver brikke velter den neste, faller alle.",
  },

  {
    id: "induksjon-13",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["induksjonshypotese"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva bør du aldri gjøre med induksjonshypotesen?",

    options: [
      "Prøve å bevise den.",
      "Bruke den i induksjonssteget.",
      "Anta at den gjelder.",
      "Sette inn n = k.",
    ],

    correctAnswer: "Prøve å bevise den.",

    explanation:
      "Induksjonshypotesen er en antakelse. Det er utsagnet for n = k + 1 som skal bevises.",
  },

  {
    id: "induksjon-14",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["basissteg"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva skjer dersom basissteget er feil?",

    options: [
      "Hele induksjonsbeviset blir ugyldig.",
      "Bare induksjonssteget blir feil.",
      "Ingenting.",
      "Vi kan hoppe over basissteget.",
    ],

    correctAnswer: "Hele induksjonsbeviset blir ugyldig.",

    explanation: "Uten et gyldig startpunkt kan ikke induksjonen brukes.",
  },

  {
    id: "induksjon-15",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva ser sensor oftest etter i et induksjonsbevis?",

    options: [
      "At basissteg, induksjonshypotese og induksjonssteg alle er tydelige.",
      "At beviset er kortest mulig.",
      "At det brukes mange symboler.",
      "At svaret fyller minst én side.",
    ],

    correctAnswer:
      "At basissteg, induksjonshypotese og induksjonssteg alle er tydelige.",

    explanation:
      "Et godt strukturert induksjonsbevis gjør det enkelt å følge argumentasjonen og kontrollere at alle nødvendige steg er med.",
  },

  {
    id: "induksjon-16",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["eksamen", "basissteg"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Du skal bevise en formel ved induksjon. Hva gjør du først?",

    options: [
      "Vis at utsagnet gjelder for startverdien.",
      "Anta at utsagnet gjelder for n = k.",
      "Vis at utsagnet gjelder for n = k + 1.",
      "Sett n = 100.",
    ],

    correctAnswer: "Vis at utsagnet gjelder for startverdien.",

    explanation: "Alle induksjonsbevis starter med basissteget.",
  },

  {
    id: "induksjon-17",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["eksamen", "induksjonshypotese"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Etter basissteget, hva er neste del av beviset?",

    options: [
      "Anta at utsagnet gjelder for n = k.",
      "Sett n = 0.",
      "Bruk motsigelse.",
      "Finn et moteksempel.",
    ],

    correctAnswer: "Anta at utsagnet gjelder for n = k.",

    explanation: "Dette er induksjonshypotesen.",
  },

  {
    id: "induksjon-18",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["eksamen", "induksjonssteg"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er målet etter at induksjonshypotesen er satt opp?",

    options: [
      "Å vise at utsagnet gjelder for n = k + 1.",
      "Å vise at utsagnet gjelder for n = 2.",
      "Å vise at hypotesen er sann.",
      "Å bevise basissteget på nytt.",
    ],

    correctAnswer: "Å vise at utsagnet gjelder for n = k + 1.",

    explanation: "Hele induksjonssteget handler om å bevise neste tilfelle.",
  },

  {
    id: "induksjon-19",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["eksamen", "induksjonshypotese"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er den viktigste grunnen til at vi innfører n = k?",

    options: [
      "For å kunne bruke antakelsen i neste steg.",
      "For å slippe basissteget.",
      "For å finne et moteksempel.",
      "For å bruke kontraposisjon.",
    ],

    correctAnswer: "For å kunne bruke antakelsen i neste steg.",

    explanation:
      "Induksjonshypotesen er verktøyet som gjør det mulig å bevise tilfellet k + 1.",
  },

  {
    id: "induksjon-20",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["eksamen", "vanlige-feil"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva er den vanligste feilen studenter gjør i induksjonsbevis?",

    options: [
      "De glemmer å bruke induksjonshypotesen.",
      "De bruker for mye algebra.",
      "De skriver for mange ord.",
      "De velger n = 1.",
    ],

    correctAnswer: "De glemmer å bruke induksjonshypotesen.",

    explanation:
      "Hvis hypotesen aldri brukes, er ikke beviset et gyldig induksjonsbevis.",
  },

  {
    id: "induksjon-21",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["summer"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvilken type oppgave bevises oftest med matematisk induksjon?",

    options: [
      "Formler for summer.",
      "Sannhetstabeller.",
      "Relasjoner.",
      "Mengdeoperasjoner.",
    ],

    correctAnswer: "Formler for summer.",

    explanation: "Summer som 1 + 2 + ... + n er klassiske induksjonsoppgaver.",
  },

  {
    id: "induksjon-22",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["summer"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva gjør man vanligvis først i induksjonssteget når man skal bevise en sumformel?",

    options: [
      "Start med uttrykket for n = k + 1.",
      "Start med basissteget.",
      "Sett n = 0.",
      "Bruk moteksempel.",
    ],

    correctAnswer: "Start med uttrykket for n = k + 1.",

    explanation:
      "I induksjonssteget skriver man ofte venstresiden for n = k + 1 og bruker induksjonshypotesen underveis.",
  },

  {
    id: "induksjon-23",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["summer"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Når brukes induksjonshypotesen i et induksjonsbevis av en sumformel?",

    options: [
      "Når delen fram til k skal erstattes med formelen.",
      "I basissteget.",
      "Etter konklusjonen.",
      "Den brukes ikke.",
    ],

    correctAnswer: "Når delen fram til k skal erstattes med formelen.",

    explanation:
      "Summen fra 1 til k erstattes med uttrykket vi har antatt er riktig.",
  },

  {
    id: "induksjon-24",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["summer", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva er målet etter at induksjonshypotesen er brukt i en sumoppgave?",

    options: [
      "Å omskrive uttrykket til formelen for n = k + 1.",
      "Å bevise basissteget igjen.",
      "Å finne et moteksempel.",
      "Å bruke kontraposisjon.",
    ],

    correctAnswer: "Å omskrive uttrykket til formelen for n = k + 1.",

    explanation:
      "Etter innsetting gjenstår algebra til høyresiden får ønsket form.",
  },

  {
    id: "induksjon-25",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen", "algebra"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva avgjør ofte om et induksjonsbevis lykkes?",

    options: [
      "God algebra etter at induksjonshypotesen er satt inn.",
      "Et langt basissteg.",
      "Mange eksempler.",
      "Bruk av motsigelse.",
    ],

    correctAnswer: "God algebra etter at induksjonshypotesen er satt inn.",

    explanation:
      "Selve innsettingen er ofte enkel. Utfordringen er å omskrive uttrykket til riktig form.",
  },

  {
    id: "induksjon-26",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["summer", "eksamen"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Du skal bevise formelen 1 + 2 + ... + n = n(n+1)/2 ved induksjon. Hva skal vises i basissteget?",

    options: [
      "At formelen stemmer for n = 1.",
      "At formelen stemmer for n = k.",
      "At formelen stemmer for n = k + 1.",
      "At formelen gjelder for alle n.",
    ],

    correctAnswer: "At formelen stemmer for n = 1.",

    explanation:
      "Basissteget består i å kontrollere at formelen gjelder for startverdien.",
  },

  {
    id: "induksjon-27",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["summer"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva antar du i induksjonshypotesen for denne sumformelen?",

    options: [
      "At formelen gjelder for n = k.",
      "At formelen gjelder for n = k + 1.",
      "At formelen er usann.",
      "At n = 1.",
    ],

    correctAnswer: "At formelen gjelder for n = k.",

    explanation:
      "Induksjonshypotesen er alltid antakelsen om at utsagnet gjelder for n = k.",
  },

  {
    id: "induksjon-28",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["summer"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva legger du til på venstresiden når du går fra n = k til n = k + 1 i en sum?",

    options: ["k + 1", "1", "k", "2k"],

    correctAnswer: "k + 1",

    explanation:
      "Summen fra 1 til k+1 er summen til k pluss det nye leddet k+1.",
  },

  {
    id: "induksjon-29",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["summer", "induksjonshypotese"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Når bruker du induksjonshypotesen i et bevis av en sumformel?",

    options: [
      "Når summen fra 1 til k skal erstattes med formelen.",
      "I basissteget.",
      "Etter konklusjonen.",
      "Den brukes ikke.",
    ],

    correctAnswer: "Når summen fra 1 til k skal erstattes med formelen.",

    explanation:
      "Hele poenget med hypotesen er å erstatte summen med et kjent uttrykk.",
  },

  {
    id: "induksjon-30",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["summer", "algebra"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hva gjenstår vanligvis etter at induksjonshypotesen er satt inn?",

    options: [
      "Algebraisk omskriving.",
      "Et nytt basissteg.",
      "Et moteksempel.",
      "En sannhetstabell.",
    ],

    correctAnswer: "Algebraisk omskriving.",

    explanation:
      "Etter innsetting må uttrykket omskrives til ønsket form for n = k + 1.",
  },

  {
    id: "induksjon-31",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["delelighet"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva viser man ofte i induksjonsoppgaver om delelighet?",

    options: [
      "At et uttrykk er delelig med et bestemt tall for alle n.",
      "At alle tall er primtall.",
      "At alle summer er like.",
      "At alle relasjoner er transitive.",
    ],

    correctAnswer: "At et uttrykk er delelig med et bestemt tall for alle n.",

    explanation: "Delelighetsbevis er en svært vanlig type induksjonsoppgave.",
  },

  {
    id: "induksjon-32",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["delelighet"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva er målet etter at induksjonshypotesen er brukt i en delelighetsoppgave?",

    options: [
      "Å faktorisere uttrykket slik at deleligheten blir tydelig.",
      "Å bruke motsigelse.",
      "Å finne et moteksempel.",
      "Å starte på nytt.",
    ],

    correctAnswer: "Å faktorisere uttrykket slik at deleligheten blir tydelig.",

    explanation:
      "Etter innsetting prøver man ofte å trekke ut faktoren som viser deleligheten.",
  },

  {
    id: "induksjon-33",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen", "vanlige-feil"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er en vanlig feil når man beviser sumformler ved induksjon?",

    options: [
      "Å glemme å legge til leddet k + 1.",
      "Å bruke for mye algebra.",
      "Å skrive basissteget.",
      "Å bruke n = k.",
    ],

    correctAnswer: "Å glemme å legge til leddet k + 1.",

    explanation:
      "Når man går fra n = k til n = k + 1 må det nye leddet legges til på venstresiden.",
  },

  {
    id: "induksjon-34",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva bør siste linje i et induksjonsbevis inneholde?",

    options: [
      "En tydelig konklusjon om at utsagnet gjelder for alle naturlige tall.",
      "Et nytt regnestykke.",
      "Et moteksempel.",
      "En ny induksjonshypotese.",
    ],

    correctAnswer:
      "En tydelig konklusjon om at utsagnet gjelder for alle naturlige tall.",

    explanation:
      "Avslutt alltid med å knytte sammen basissteget og induksjonssteget til en samlet konklusjon.",
  },

  {
    id: "induksjon-35",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hva er det viktigste rådet for å lykkes med induksjonsoppgaver på eksamen?",

    options: [
      "Følg strukturen: basissteg, induksjonshypotese og induksjonssteg.",
      "Lær alle formler utenat.",
      "Bruk alltid motsigelse.",
      "Hopp over basissteget hvis du har dårlig tid.",
    ],

    correctAnswer:
      "Følg strukturen: basissteg, induksjonshypotese og induksjonssteg.",

    explanation:
      "En tydelig struktur gjør beviset lettere å skrive og lettere for sensor å følge.",
  },

  {
    id: "induksjon-36",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["kvadratsummer", "eksamen"],
    estimatedTime: 4,
    examFrequency: "medium",

    question:
      "Hvilken type sumformel krever ofte litt mer algebra i induksjonssteget?",

    options: [
      "Summen av kvadrater.",
      "Summen 1 + 2.",
      "En sannhetstabell.",
      "Et Venn-diagram.",
    ],

    correctAnswer: "Summen av kvadrater.",

    explanation:
      "Formler som 1² + 2² + ... + n² krever ofte mer algebra enn den vanlige summen 1 + 2 + ... + n.",
  },

  {
    id: "induksjon-37",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["geometriske-rekker", "eksamen"],
    estimatedTime: 4,
    examFrequency: "medium",

    question:
      "Hva legger du til når du går fra en geometrisk sum for n = k til n = k + 1?",

    options: [
      "Det neste leddet i rekken.",
      "Det første leddet på nytt.",
      "Basissteget.",
      "Et moteksempel.",
    ],

    correctAnswer: "Det neste leddet i rekken.",

    explanation:
      "På samme måte som for vanlige summer legges det neste leddet til når man går fra k til k + 1.",
  },

  {
    id: "induksjon-38",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["rekursjon", "induksjon"],
    estimatedTime: 4,
    examFrequency: "medium",

    question:
      "Hvorfor brukes matematisk induksjon ofte sammen med rekursive definisjoner?",

    options: [
      "Fordi begge bygger opp resultatet steg for steg.",
      "Fordi begge bruker sannhetstabeller.",
      "Fordi begge krever kontraposisjon.",
      "Fordi begge handler om relasjoner.",
    ],

    correctAnswer: "Fordi begge bygger opp resultatet steg for steg.",

    explanation:
      "Rekursive definisjoner beskriver ett steg av gangen, og induksjon passer naturlig til å bevise egenskaper om slike definisjoner.",
  },

  {
    id: "induksjon-39",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen", "strategi"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvis du står fast i induksjonssteget, hva bør du prøve først?",

    options: [
      "Se om induksjonshypotesen kan settes inn tidligere i regningen.",
      "Hoppe over induksjonssteget.",
      "Starte hele beviset på nytt med n = 2.",
      "Bruke motsigelse i stedet.",
    ],

    correctAnswer:
      "Se om induksjonshypotesen kan settes inn tidligere i regningen.",

    explanation:
      "Mange induksjonsbevis blir enklere dersom hypotesen brukes på riktig tidspunkt i utregningen.",
  },

  {
    id: "induksjon-40",
    subjectId: "tma4412",
    topic: "Induksjon",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering", "eksamen"],
    estimatedTime: 4,
    examFrequency: "high",

    question: "Når er et induksjonsbevis fullført?",

    options: [
      "Når basissteget er vist, induksjonssteget er bevist, og det konkluderes at utsagnet gjelder for alle naturlige tall.",
      "Når induksjonshypotesen er skrevet ned.",
      "Når basissteget er ferdig.",
      "Når uttrykket er faktorisert.",
    ],

    correctAnswer:
      "Når basissteget er vist, induksjonssteget er bevist, og det konkluderes at utsagnet gjelder for alle naturlige tall.",

    explanation:
      "Et fullstendig induksjonsbevis krever både et gyldig basissteg, et korrekt induksjonssteg og en avsluttende konklusjon.",
  },
];
