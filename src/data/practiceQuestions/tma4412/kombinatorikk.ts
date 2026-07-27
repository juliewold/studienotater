import type { PracticeQuestion } from "../types";

export const kombinatorikkQuestions: PracticeQuestion[] = [
  {
    id: "kombinatorikk-1",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["produktregelen", "telling"],
    estimatedTime: 1,
    examFrequency: "high",

    question: "Hva brukes produktregelen til?",

    options: [
      "Å telle antall valg når flere valg tas etter hverandre.",
      "Å addere antall muligheter.",
      "Å regne ut gcd.",
      "Å finne primtall.",
    ],

    correctAnswer: "Å telle antall valg når flere valg tas etter hverandre.",

    explanation:
      "Produktregelen sier at dersom et valg kan tas på a måter og deretter et annet valg på b måter, finnes det a·b muligheter totalt.",
  },

  {
    id: "kombinatorikk-2",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["produktregelen"],
    estimatedTime: 1,
    examFrequency: "high",

    question:
      "Du har 3 skjorter og 4 bukser. Hvor mange ulike antrekk kan du lage?",

    options: ["12", "7", "24", "1"],

    correctAnswer: "12",

    explanation: "3 valg av skjorte og 4 valg av bukse gir 3·4 = 12 antrekk.",
  },

  {
    id: "kombinatorikk-3",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["injektive-funksjoner"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva betyr det at en funksjon er injektiv?",

    options: [
      "Ulike elementer i definisjonsmengden sendes til ulike elementer i målmengden.",
      "Alle elementer i målmengden brukes.",
      "Funksjonen er konstant.",
      "Alle elementer sendes til samme verdi.",
    ],

    correctAnswer:
      "Ulike elementer i definisjonsmengden sendes til ulike elementer i målmengden.",

    explanation: "Ingen to ulike elementer kan få samme funksjonsverdi.",
  },

  {
    id: "kombinatorikk-4",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["injektive-funksjoner"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hvor mange valg har du for f(2) dersom f er injektiv og f(1) allerede er bestemt?",

    options: [
      "Alle verdier unntatt den som allerede er brukt.",
      "Bare én verdi.",
      "Ingen verdier.",
      "Alle verdier.",
    ],

    correctAnswer: "Alle verdier unntatt den som allerede er brukt.",

    explanation:
      "Ved en injektiv funksjon kan samme verdi ikke brukes to ganger.",
  },

  {
    id: "kombinatorikk-5",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["injektive-funksjoner", "stack"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Når teller man antall injektive funksjoner fra A til B, hvilken tellemetode brukes vanligvis?",

    options: [
      "Produktregelen.",
      "Pytagoras.",
      "Induksjon.",
      "Euklids algoritme.",
    ],

    correctAnswer: "Produktregelen.",

    explanation:
      "Man teller hvor mange valg man har for hvert element i A og multipliserer antall valg sammen.",
  },

  {
    id: "kombinatorikk-6",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "medium",
    tags: ["injektive-funksjoner", "stack"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "La A = {1, 2, 3} og B = {1, 2, 3, 4, 5}. Hvor mange injektive funksjoner f fra A til B finnes når f(1) = 3?",

    correctAnswer: 12,

    explanation:
      "Verdien f(1) = 3 er allerede bestemt. For f(2) kan vi velge blant de 4 gjenværende verdiene i B. Deretter har vi 3 valg for f(3). Produktregelen gir 4·3 = 12.",
  },

  {
    id: "kombinatorikk-7",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["injektive-funksjoner", "produktregelen"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hvorfor har vi 4 valg for f(2) når f(1) = 3 og målmengden har 5 elementer?",

    options: [
      "Fordi verdien 3 allerede er brukt og ikke kan brukes igjen.",
      "Fordi definisjonsmengden har 3 elementer.",
      "Fordi funksjonen må være surjektiv.",
      "Fordi f(2) må være mindre enn 5.",
    ],

    correctAnswer:
      "Fordi verdien 3 allerede er brukt og ikke kan brukes igjen.",

    explanation:
      "En injektiv funksjon kan ikke sende to ulike elementer til samme verdi.",
  },

  {
    id: "kombinatorikk-8",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "medium",
    tags: ["injektive-funksjoner"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hvor mange injektive funksjoner finnes fra en mengde med 3 elementer til en mengde med 5 elementer?",

    correctAnswer: 60,

    explanation:
      "Det første elementet har 5 mulige bilder, det andre har 4 og det tredje har 3. Dermed får vi 5·4·3 = 60.",
  },

  {
    id: "kombinatorikk-9",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["injektive-funksjoner", "teori"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Kan det finnes en injektiv funksjon fra en mengde med 6 elementer til en mengde med 4 elementer?",

    options: [
      "Nei, fordi målmengden har færre elementer.",
      "Ja, alltid.",
      "Ja, dersom funksjonen er konstant.",
      "Bare dersom 6 er delelig med 4.",
    ],

    correctAnswer: "Nei, fordi målmengden har færre elementer.",

    explanation:
      "Alle de 6 elementene måtte fått ulike bilder, men målmengden inneholder bare 4 mulige verdier.",
  },

  {
    id: "kombinatorikk-10",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["farging", "produktregelen"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Tre hus på rad skal farges rødt, hvitt eller grått slik at nabohus har ulik farge. Hvor mange valg har vi for det første huset?",

    options: ["3", "2", "1", "6"],

    correctAnswer: "3",

    explanation:
      "Det første huset kan farges med hvilken som helst av de tre fargene.",
  },

  {
    id: "kombinatorikk-11",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["farging", "produktregelen"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Når et hus er farget, hvor mange farger kan nabohuset velge mellom dersom nabohus må ha ulik farge og vi har 3 farger?",

    options: ["2", "3", "1", "0"],

    correctAnswer: "2",

    explanation:
      "Nabohuset kan bruke alle fargene unntatt fargen til huset ved siden av.",
  },

  {
    id: "kombinatorikk-12",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "medium",
    tags: ["farging", "stack"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "På hvor mange måter kan tre hus langs en gate farges rødt, hvitt eller grått slik at nabohus har ulik farge?",

    correctAnswer: 12,

    explanation:
      "Det første huset har 3 valg. Det andre har 2 valg, og det tredje har 2 valg. Produktregelen gir 3·2·2 = 12.",
  },

  {
    id: "kombinatorikk-13",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "medium",
    tags: ["farging", "stack"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "På hvor mange måter kan fem hus langs en gate farges rødt, hvitt eller grått slik at nabohus har ulik farge?",

    correctAnswer: 48,

    explanation:
      "Det første huset har 3 valg. Hvert av de fire neste husene har 2 valg. Dermed får vi 3·2⁴ = 48.",
  },

  {
    id: "kombinatorikk-14",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["farging", "generell-formel"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hvilken formel gir antall måter å farge n hus på rad med 3 farger når nabohus må ha ulik farge?",

    options: ["3·2^(n − 1)", "3^n", "2·3^(n − 1)", "n!"],

    correctAnswer: "3·2^(n − 1)",

    explanation:
      "Det første huset har 3 valg. Hvert av de resterende n − 1 husene har 2 valg.",
  },

  {
    id: "kombinatorikk-15",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["farging", "eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hvorfor er svaret ikke 3^n når n hus skal farges med 3 farger og nabohus må ha ulik farge?",

    options: [
      "Fordi fargevalgene ikke er uavhengige: hvert hus kan ikke bruke samme farge som naboen.",
      "Fordi det første huset bare har 2 valg.",
      "Fordi alle hus må ha forskjellige farger.",
      "Fordi n alltid er mindre enn 3.",
    ],

    correctAnswer:
      "Fordi fargevalgene ikke er uavhengige: hvert hus kan ikke bruke samme farge som naboen.",

    explanation:
      "Uttrykket 3^n gjelder når hvert hus fritt kan velge mellom alle tre fargene. Nabobetingelsen reduserer valgene etter det første huset.",
  },

  {
    id: "kombinatorikk-16",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["rutenett", "vandringer"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvor mange steg må en korteste vandring fra (0,0) til (4,5) ha?",

    options: ["9", "8", "20", "5"],

    correctAnswer: "9",

    explanation:
      "Vi må gå 4 steg mot høyre og 5 steg opp. Totalt blir det 4 + 5 = 9 steg.",
  },

  {
    id: "kombinatorikk-17",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["rutenett"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "En korteste vandring fra (0,0) til (4,5) består av hvor mange høyresteg og oppsteg?",

    options: ["4 høyre og 5 opp", "5 høyre og 4 opp", "9 høyre", "9 opp"],

    correctAnswer: "4 høyre og 5 opp",

    explanation: "x-koordinaten øker med 4 og y-koordinaten øker med 5.",
  },

  {
    id: "kombinatorikk-18",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["binomialkoeffisient"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hvilket uttrykk brukes vanligvis for å telle korteste rutenettvandringer?",

    options: [
      "Binomialkoeffisienten",
      "GCD",
      "Induksjon",
      "Primtallsfaktorisering",
    ],

    correctAnswer: "Binomialkoeffisienten",

    explanation:
      "Vi skal velge hvilke av stegene som går mot høyre (eller opp), og dette telles med en binomialkoeffisient.",
  },

  {
    id: "kombinatorikk-19",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "medium",
    tags: ["binomialkoeffisient", "rutenett"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvor mange korteste vandringer finnes fra (0,0) til (2,1)?",

    correctAnswer: 3,

    explanation:
      "Vi har 3 steg totalt, hvorav 2 er høyresteg. Antallet er C(3,2) = 3.",
  },

  {
    id: "kombinatorikk-20",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "medium",
    tags: ["binomialkoeffisient", "rutenett"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hvor mange korteste vandringer finnes fra (0,0) til (2,2)?",

    correctAnswer: 6,

    explanation:
      "Vi har 4 steg totalt og skal velge hvilke 2 som går mot høyre. C(4,2) = 6.",
  },

  {
    id: "kombinatorikk-21",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["binomialkoeffisient"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hva betyr C(n,k) i rutenettoppgaver?",

    options: [
      "Vi velger hvilke av n steg som skal være av én bestemt type.",
      "Vi finner største felles divisor.",
      "Vi finner antall primtall.",
      "Vi regner modulo n.",
    ],

    correctAnswer:
      "Vi velger hvilke av n steg som skal være av én bestemt type.",

    explanation:
      "For eksempel hvilke steg som går mot høyre blant alle stegene.",
  },

  {
    id: "kombinatorikk-22",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["rutenett", "stack"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hvis en korteste vandring må gå gjennom et bestemt punkt, hva gjør man vanligvis?",

    options: [
      "Deler vandringen i to delvandringer og multipliserer antall muligheter.",
      "Adderer antall steg.",
      "Bruker Euklids algoritme.",
      "Bruker induksjon.",
    ],

    correctAnswer:
      "Deler vandringen i to delvandringer og multipliserer antall muligheter.",

    explanation:
      "Først teller vi vandringer til punktet, deretter fra punktet til målet. Produktregelen brukes.",
  },

  {
    id: "kombinatorikk-23",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["produktregelen", "stack"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "Hvorfor kan produktregelen brukes når en vandring deles opp i to deler?",

    options: [
      "Fordi enhver fullstendig vandring består av ett valg for første del og ett valg for andre del.",
      "Fordi begge delene alltid er like lange.",
      "Fordi binomialkoeffisienter alltid multipliseres.",
      "Fordi alle vandringer er identiske.",
    ],

    correctAnswer:
      "Fordi enhver fullstendig vandring består av ett valg for første del og ett valg for andre del.",

    explanation:
      "Hver kombinasjon av en første del og en andre del gir én unik fullstendig vandring.",
  },

  {
    id: "kombinatorikk-24",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["stack", "rutenett"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den vanligste feilen i rutenettoppgaver?",

    options: [
      "Å bruke feil antall høyre- og oppsteg.",
      "Å bruke modulo.",
      "Å regne med gcd.",
      "Å bruke for mange parenteser.",
    ],

    correctAnswer: "Å bruke feil antall høyre- og oppsteg.",

    explanation:
      "Start alltid med å telle hvor mange steg som faktisk må tas i hver retning.",
  },

  {
    id: "kombinatorikk-25",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen", "rutenett"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva bør du gjøre først når du får en rutenettoppgave?",

    options: [
      "Bestemme hvor mange steg som må tas i hver retning.",
      "Regne ut binomialkoeffisienten med én gang.",
      "Tegne hele rutenettet.",
      "Bruke produktregelen først.",
    ],

    correctAnswer: "Bestemme hvor mange steg som må tas i hver retning.",

    explanation:
      "Når antall høyre- og oppsteg er kjent, blir resten av oppgaven ofte rett fram.",
  },

  {
    id: "kombinatorikk-26",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["rutenett", "produktregelen"],
    estimatedTime: 3,
    examFrequency: "high",

    question:
      "En vandring må gå gjennom et bestemt punkt. Hvordan finner man antall slike vandringer?",

    options: [
      "Tell antall vandringer til punktet og fra punktet, og multipliser.",
      "Legg sammen antall vandringer til punktet og fra punktet.",
      "Trekk antall vandringer fra hverandre.",
      "Bruk alltid n!.",
    ],

    correctAnswer:
      "Tell antall vandringer til punktet og fra punktet, og multipliser.",

    explanation:
      "Enhver vandring består av én del til punktet og én del fra punktet til målet.",
  },

  {
    id: "kombinatorikk-27",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["produktregelen"],
    estimatedTime: 2,
    examFrequency: "high",

    question:
      "Hvorfor kan produktregelen brukes når en vandring deles opp i to uavhengige deler?",

    options: [
      "Fordi hvert valg av første del kan kombineres med hvert valg av andre del.",
      "Fordi begge delene alltid har like mange steg.",
      "Fordi binomialkoeffisienter alltid er like.",
      "Fordi alle vandringer er identiske.",
    ],

    correctAnswer:
      "Fordi hvert valg av første del kan kombineres med hvert valg av andre del.",

    explanation:
      "Produktregelen gjelder når alle kombinasjoner av delvalg er mulige.",
  },

  {
    id: "kombinatorikk-28",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "medium",
    tags: ["binomialkoeffisient"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er verdien av C(5,2)?",

    correctAnswer: 10,

    explanation: "C(5,2) = 5!/(2!·3!) = 10.",
  },

  {
    id: "kombinatorikk-29",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "number-answer",
    difficulty: "medium",
    tags: ["binomialkoeffisient"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er verdien av C(6,3)?",

    correctAnswer: 20,

    explanation: "C(6,3) = 20.",
  },

  {
    id: "kombinatorikk-30",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["binomialkoeffisient"],
    estimatedTime: 2,
    examFrequency: "high",

    question: "Hvilken egenskap gjelder alltid for binomialkoeffisienter?",

    options: [
      "C(n,k) = C(n,n-k)",
      "C(n,k) = n·k",
      "C(n,k) = n!",
      "C(n,k) = k!",
    ],

    correctAnswer: "C(n,k) = C(n,n-k)",

    explanation:
      "Å velge k elementer er det samme som å velge hvilke n − k elementer som ikke velges.",
  },

  {
    id: "kombinatorikk-31",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["rutenett", "strategi"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva gjør du dersom en rutenettoppgave inneholder flere delkrav?",

    options: [
      "Del opp oppgaven i mindre deler og løs én del om gangen.",
      "Bruk alltid samme formel.",
      "Regn alt samtidig.",
      "Start med svaret.",
    ],

    correctAnswer: "Del opp oppgaven i mindre deler og løs én del om gangen.",

    explanation:
      "Mange STACK-oppgaver løses enklest ved å dele dem opp i mindre delproblemer.",
  },

  {
    id: "kombinatorikk-32",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["rutenett"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er den vanligste årsaken til feil i rutenettoppgaver?",

    options: [
      "At man teller feil antall steg eller deler opp oppgaven feil.",
      "At man bruker for mange binomialkoeffisienter.",
      "At man bruker modulo.",
      "At man glemmer fakultet.",
    ],

    correctAnswer:
      "At man teller feil antall steg eller deler opp oppgaven feil.",

    explanation:
      "Et lite feil antall høyre- eller oppsteg gir ofte helt feil svar.",
  },

  {
    id: "kombinatorikk-33",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["telling"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva er hovedideen bak de fleste telleoppgaver i kombinatorikk?",

    options: [
      "Bryt problemet ned i mindre valg som kan telles.",
      "Bruk induksjon.",
      "Finn gcd.",
      "Regn modulo.",
    ],

    correctAnswer: "Bryt problemet ned i mindre valg som kan telles.",

    explanation:
      "De fleste telleoppgaver løses ved å identifisere valg og telle dem systematisk.",
  },

  {
    id: "kombinatorikk-34",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["eksamen"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva bør du gjøre før du setter opp en formel i en telleoppgave?",

    options: [
      "Forstå hva som faktisk skal telles.",
      "Bruke n! med én gang.",
      "Regne ut alle binomialkoeffisienter.",
      "Bruke produktregelen automatisk.",
    ],

    correctAnswer: "Forstå hva som faktisk skal telles.",

    explanation:
      "Den vanligste feilen er å velge en formel før man har analysert problemet.",
  },

  {
    id: "kombinatorikk-35",
    subjectId: "tma4412",
    topic: "Kombinatorikk",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["oppsummering"],
    estimatedTime: 3,
    examFrequency: "high",

    question: "Hva kjennetegner de fleste kombinatorikkoppgaver på eksamen?",

    options: [
      "De kan ofte løses ved å kombinere flere enkle telleprinsipper.",
      "De handler alltid om grafer.",
      "De krever induksjon.",
      "De inneholder alltid modulo.",
    ],

    correctAnswer:
      "De kan ofte løses ved å kombinere flere enkle telleprinsipper.",

    explanation:
      "Mange oppgaver krever en kombinasjon av produktregelen, binomialkoeffisienter og oppdeling i delproblemer.",
  },
];
