import type { PracticeQuestion } from "../types";

export const induktivtDefinerteMengderQuestions:
  PracticeQuestion[] = [
  {
    id: "tma4412-induktivt-definerte-mengder-1",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "easy",
    tags: [
      "definisjon",
      "basissteg",
      "induksjonssteg",
    ],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er en induktivt definert mengde?",
    options: [
      "En vilkårlig endelig mengde",
      "Den største mengden som inneholder en gitt basismengde",
      "Den minste mengden som inneholder en gitt basismengde og er lukket under bestemte operasjoner",
      "En mengde som bare inneholder naturlige tall",
    ],
    correctAnswer:
      "Den minste mengden som inneholder en gitt basismengde og er lukket under bestemte operasjoner",
    explanation:
      "En induktivt definert mengde bygges fra en basismengde ved å bruke én eller flere operasjoner. Vi tar bare med elementene som må være med, altså den minste mengden som oppfyller reglene.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-2",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "easy",
    tags: [
      "basissteg",
      "definisjon",
    ],
    estimatedTime: 30,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva forteller basissteget i en induktiv definisjon?",
    options: [
      "Hvilke elementer vi starter med",
      "Hvordan vi avslutter definisjonen",
      "Hvilke elementer som ikke er med",
      "Hvor mange elementer mengden har",
    ],
    correctAnswer:
      "Hvilke elementer vi starter med",
    explanation:
      "Basissteget angir basismengden. Elementene i basismengden skal alltid tilhøre den induktivt definerte mengden.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-3",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "easy",
    tags: [
      "induksjonssteg",
      "operasjon",
    ],
    estimatedTime: 30,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva forteller induksjonssteget i en induktiv definisjon?",
    options: [
      "Hvordan nye elementer kan lages fra elementer som allerede er med",
      "Hvilket element som skal fjernes først",
      "At mengden må være endelig",
      "At alle elementer i universet er med",
    ],
    correctAnswer:
      "Hvordan nye elementer kan lages fra elementer som allerede er med",
    explanation:
      "Induksjonssteget gir én eller flere operasjoner som kan brukes på elementer vi allerede vet tilhører mengden.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-4",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "easy",
    tags: [
      "lukkethet",
      "operasjon",
    ],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva betyr det at en mengde $A$ er lukket under en operasjon $f$?",
    options: [
      "For alle $a\\in A$ er $f(a)\\in A$",
      "For alle $a\\in A$ er $f(a)\\notin A$",
      "Operasjonen kan bare brukes én gang",
      "Mengden $A$ må være endelig",
    ],
    correctAnswer:
      "For alle $a\\in A$ er $f(a)\\in A$",
    explanation:
      "Lukkethet betyr at operasjonen ikke fører oss ut av mengden. Når vi bruker $f$ på et element i $A$, må resultatet også være i $A$.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-5",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "easy",
    tags: [
      "lukkethet",
      "moteksempel",
    ],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "La $M=\\{0,1,2\\}$ og $f(x)=x+1$. Hvorfor er ikke $M$ lukket under $f$?",
    options: [
      "Fordi $f(0)=1$",
      "Fordi $f(1)=2$",
      "Fordi $f(2)=3$ og $3\\notin M$",
      "Fordi $0\\in M$",
    ],
    correctAnswer:
      "Fordi $f(2)=3$ og $3\\notin M$",
    explanation:
      "For at $M$ skal være lukket, må $f(x)$ ligge i $M$ for alle $x\\in M$. Men $2\\in M$ og $f(2)=3\\notin M$.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-6",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "easy",
    tags: [
      "tillukning",
      "definisjon",
    ],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er tillukningen av en mengde $M$ under en operasjon?",
    options: [
      "Den minste mengden som inneholder $M$ og er lukket under operasjonen",
      "Den største delmengden av $M$",
      "Mengden som består av elementene som fjernes fra $M$",
      "En mengde som bare inneholder resultatet etter én operasjon",
    ],
    correctAnswer:
      "Den minste mengden som inneholder $M$ og er lukket under operasjonen",
    explanation:
      "Tillukningen inneholder basismengden og alle elementene som må legges til for at mengden skal bli lukket under operasjonen.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-7",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "easy",
    tags: [
      "naturlige tall",
      "tillukning",
      "operasjon",
    ],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hva er tillukningen av $M=\\{0\\}$ under operasjonen $f(x)=x+1$?",
    options: [
      "$\\{0\\}$",
      "$\\{0,1\\}$",
      "$\\mathbb{N}$",
      "$\\mathbb{Z}$",
    ],
    correctAnswer:
      "$\\mathbb{N}$",
    explanation:
      "Vi starter med 0. Deretter får vi 1, 2, 3 og så videre ved gjentatt bruk av $f(x)=x+1$. Dermed får vi de naturlige tallene.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-8",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "easy",
    tags: [
      "heltall",
      "tillukning",
      "operasjoner",
    ],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Vi starter med $M=\\{0\\}$ og bruker operasjonene $f_1(x)=x+1$ og $f_2(x)=x-1$. Hvilken mengde får vi?",
    options: [
      "$\\mathbb{N}$",
      "$\\mathbb{Z}$",
      "Bare partallene",
      "Bare de positive heltallene",
    ],
    correctAnswer:
      "$\\mathbb{Z}$",
    explanation:
      "Fra 0 kan vi bruke $x+1$ for å lage alle positive heltall og $x-1$ for å lage alle negative heltall. Derfor får vi hele $\\mathbb{Z}$.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-9",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "easy",
    tags: [
      "oddetall",
      "basissteg",
      "induksjonssteg",
    ],
    estimatedTime: 45,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "La $A$ være definert ved basissteget $1\\in A$ og regelen: Hvis $n\\in A$, så er $n+2\\in A$. Hvilken mengde er $A$?",
    options: [
      "De positive oddetallene",
      "De positive partallene",
      "Alle heltall",
      "Alle naturlige tall",
    ],
    correctAnswer:
      "De positive oddetallene",
    explanation:
      "Vi starter med 1 og legger til 2 hver gang. Da får vi $1,3,5,7,\\ldots$, som er de positive oddetallene.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-10",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "medium",
    tags: [
      "oddetall",
      "medlemskap",
      "konstruksjon",
    ],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "La $A$ være definert ved $1\\in A$ og: Hvis $n\\in A$, så er $n+2\\in A$. Hvilket tall tilhører ikke $A$?",
    options: [
      "$5$",
      "$9$",
      "$12$",
      "$17$",
    ],
    correctAnswer:
      "$12$",
    explanation:
      "Mengden inneholder bare positive oddetall. Tallene 5, 9 og 17 er oddetall, mens 12 er et partall.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-11",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "medium",
    tags: [
      "oddetall",
      "konstruksjon",
      "antall steg",
    ],
    estimatedTime: 75,
    examFrequency: "medium",
    type: "number-answer",
    question:
      "La $A$ være definert ved $1\\in A$ og: Hvis $n\\in A$, så er $n+2\\in A$. Hvor mange ganger må induksjonsregelen brukes for å lage tallet 11 fra basisverdien 1?",
    correctAnswer: 5,
    explanation:
      "Vi får $1\\to3\\to5\\to7\\to9\\to11$. Operasjonen $n\\mapsto n+2$ brukes fem ganger.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-12",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "medium",
    tags: [
      "delelighet",
      "tillukning",
      "operasjon",
    ],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "Vi starter med $M=\\{0\\}$ og bruker operasjonen $f(x)=x+42$. Hvilken mengde får vi?",
    options: [
      "Alle heltall som er delelige med 42",
      "Alle ikke-negative heltall som er delelige med 42",
      "Alle positive heltall",
      "Alle tall større enn eller lik 42",
    ],
    correctAnswer:
      "Alle ikke-negative heltall som er delelige med 42",
    explanation:
      "Vi får $0,42,84,126,\\ldots$. Vi kan ikke lage negative tall fordi operasjonen bare legger til 42.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-13",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "medium",
    tags: [
      "heltall",
      "basissteg",
      "tillukning",
    ],
    estimatedTime: 60,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "Vi starter med $M=\\{3\\}$ og bruker operasjonen $f(x)=x+1$. Hvilken mengde får vi?",
    options: [
      "Alle heltall",
      "Alle naturlige tall",
      "Alle heltall større enn eller lik 3",
      "Alle heltall større enn 3",
    ],
    correctAnswer:
      "Alle heltall større enn eller lik 3",
    explanation:
      "Basisverdien 3 er med. Videre får vi 4, 5, 6 og så videre. Derfor inneholder mengden alle heltall som er minst 3.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-14",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "medium",
    tags: [
      "minste mengde",
      "induktiv definisjon",
    ],
    estimatedTime: 60,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hvorfor sier definisjonen at vi skal ta den minste mengden som oppfyller reglene?",
    options: [
      "For å unngå at mengden inneholder elementer som ikke kan bygges fra basisreglene",
      "Fordi alle induktivt definerte mengder må være små",
      "Fordi operasjonene bare kan brukes én gang",
      "For å sikre at mengden er endelig",
    ],
    correctAnswer:
      "For å unngå at mengden inneholder elementer som ikke kan bygges fra basisreglene",
    explanation:
      "Mange større mengder kan også inneholde basismengden og være lukket under operasjonene. Kravet om den minste mengden sikrer at bare elementer som kan konstrueres med reglene, tas med.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-15",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "medium",
    tags: [
      "formelle språk",
      "alfabet",
      "strenger",
    ],
    estimatedTime: 45,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "La $A$ være et alfabet. Hva betegner $A^*$?",
    options: [
      "Mengden av alle endelige strenger over alfabetet $A$",
      "Mengden som bare inneholder symbolene i $A$",
      "Mengden av alle uendelige strenger over $A$",
      "Mengden av alle delmengder av $A$",
    ],
    correctAnswer:
      "Mengden av alle endelige strenger over alfabetet $A$",
    explanation:
      "$A^*$ består av alle endelige strenger som kan lages av symboler fra $A$. Den tomme strengen er også med.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-16",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "medium",
    tags: [
      "formelle språk",
      "tom streng",
      "lambda",
    ],
    estimatedTime: 30,
    examFrequency: "medium",
    type: "multiple-choice",
    question:
      "Hva betegner symbolet $\\lambda$ i teorien om formelle språk?",
    options: [
      "Den tomme strengen",
      "Et vilkårlig alfabet",
      "Den lengste strengen",
      "Et logisk utsagn",
    ],
    correctAnswer:
      "Den tomme strengen",
    explanation:
      "Den tomme strengen har lengde 0 og betegnes ofte med den greske bokstaven $\\lambda$.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-17",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "medium",
    tags: [
      "konkatenering",
      "strenger",
      "lengde",
    ],
    estimatedTime: 45,
    examFrequency: "medium",
    type: "number-answer",
    question:
      "En streng $s$ har lengde 4, og en streng $t$ har lengde 3. Hva er lengden til konkateneringen $st$?",
    correctAnswer: 7,
    explanation:
      "Ved konkatenering settes strengene etter hverandre. Lengden blir derfor $4+3=7$.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-18",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "hard",
    tags: [
      "palindrom",
      "formelt språk",
      "induktiv definisjon",
    ],
    estimatedTime: 90,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "La $S$ være den minste mengden som inneholder $\\lambda$ og hvert enkelt symbol i alfabetet $A$, og som oppfyller: Hvis $\\sigma\\in S$ og $a\\in A$, så er $a\\sigma a\\in S$. Hvilket språk beskriver $S$?",
    options: [
      "Alle strenger over $A$",
      "Alle strenger med partallslengde",
      "Alle palindromer over $A$",
      "Alle strenger som starter med bokstaven $a$",
    ],
    correctAnswer:
      "Alle palindromer over $A$",
    explanation:
      "Basisstrengene har lengde 0 eller 1 og er palindromer. Regelen legger samme symbol på begge sider av et palindrom, så resultatet er fortsatt et palindrom.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-19",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "hard",
    tags: [
      "palindrom",
      "medlemskap",
      "formelt språk",
    ],
    estimatedTime: 75,
    examFrequency: "high",
    type: "multiple-choice",
    question:
      "Hvilken streng kan ikke bygges med palindromdefinisjonen der $\\lambda$ og alle enkeltbokstaver er basisstrenger, og $a\\sigma a$ kan bygges når $\\sigma$ allerede er med?",
    options: [
      "$abba$",
      "$pop$",
      "$otto$",
      "$abc$",
    ],
    correctAnswer:
      "$abc$",
    explanation:
      "$abba$, $pop$ og $otto$ leses likt fra begge retninger. Strengen $abc$ er ikke et palindrom og kan derfor ikke bygges med reglene.",
  },
  {
    id: "tma4412-induktivt-definerte-mengder-20",
    subjectId: "tma4412",
    topic: "Induktivt definerte mengder",
    difficulty: "hard",
    tags: [
      "palindrom",
      "konstruksjon",
      "induksjonssteg",
    ],
    estimatedTime: 90,
    examFrequency: "high",
    type: "number-answer",
    question:
      "Hvor mange ganger brukes regelen $a\\sigma a$ for å bygge palindromet $abccba$ når vi starter med basisstrengen $\\lambda$?",
    correctAnswer: 3,
    explanation:
      "Vi starter med $\\lambda$. Først lager vi $cc$, deretter $bccb$, og til slutt $abccba$. Regelen brukes dermed tre ganger.",
  },
];