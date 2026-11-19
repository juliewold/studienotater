// Topic of each numbered lecture, for subjects whose pensum is not split into units.
// Taken from the lecture summaries (Oppsummering) and the first page of each lecture PDF.
// The matrix (wiki.math.ntnu.no/tma4240/2026h/matrise) lists weeks, not numbered lectures.
const tma4240LectureTitles: Record<string, string> = {
  "1": "Utfallsrom, hendelser og sannsynlighet",
  "2": "Kombinatorikk og like sannsynlige utfall",
  "3": "Betinget sannsynlighet",
  "4": "Bayes’ teorem og stokastiske variabler",
  "5": "Funksjoner av stokastiske variabler og simulering",
  "6": "Forventningsverdi og varians",
  "7": "Kovarians og korrelasjon",
  "8": "Binomisk fordeling",
  "9": "Geometrisk og negativ binomisk fordeling",
  "10": "Normalfordelingen",
  "11": "Poissonprosess og eksponentialfordelingen",
  "12": "Feilforplantning og tilnærmet varians",
  "13": "Momentgenererende funksjoner",
  "14": "Gjennomsnitt og sentralgrenseteoremet",
  "15": "Statistisk inferens og forventningsrette estimatorer",
  "16": "Observatorer og estimatorer",
  "17": "Konfidensintervall",
  "18": "Estimering av en ukjent sannsynlighet",
  "19": "Hypotesetesting",
  "20": "Hypotesetester for binomisk test og to utvalg",
  "21": "Feil og teststyrke i hypotesetesting",
  "22": "Teststyrke, permutasjonstest og fortegnstest",
  "23": "Enkel lineær regresjon",
  "24": "Minste kvadraters metode og SME for β",
  "25": "Konfidens- og prediksjonsintervall i lineær regresjon",
  "26": "Hypotesetest i enkel lineær regresjon",
};

const lectureTitles: Record<string, Record<string, string>> = {
  tma4240: tma4240LectureTitles,
};

export const getLectureTitles = (subjectId: string): Record<string, string> | undefined => lectureTitles[subjectId];
