import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptModules: ProgrammingLesson = {
  id: "modules",
  title: "Modules",

  sections: [
    {
      title: "Hva er moduler?",
      content:
        "Moduler gjør at du kan dele opp koden i flere filer. Dette gjør prosjekter enklere å organisere og vedlikeholde.",
    },

    {
      title: "Eksportere",
      content:
        "export brukes for å gjøre funksjoner, variabler eller klasser tilgjengelige for andre filer.",
      code: `export function hei() {
  console.log("Hei!");
}`,
      tip:
        "Hver fil kan eksportere det som andre filer skal kunne bruke.",
    },

    {
      title: "Importere",
      content:
        "import brukes for å hente inn kode fra en annen fil.",
      code: `import { hei } from "./utils";

hei();`,
      output: `Hei!`,
    },

    {
      title: "Default export",
      content:
        "En fil kan ha én default export.",
      code: `export default function hei() {
  console.log("Hei!");
}`,
      note:
        "Default exports importeres uten krøllparenteser.",
    },

    {
      title: "Import av default export",
      content:
        "Når en fil bruker default export, importeres den uten {}.",
      code: `import hei from "./utils";

hei();`,
      output: `Hei!`,
    },

    {
      title: "Hvorfor bruke moduler?",
      content:
        "Store prosjekter består ofte av mange filer. Moduler gjør koden enklere å lese, gjenbruke og vedlikeholde.",
      warning:
        "Unngå å legge all koden i én stor fil. Del den opp i logiske moduler.",
    },

    {
      title: "Oppsummering",
      content:
        "Moduler gjør det mulig å organisere kode i flere filer ved hjelp av import og export. Dette brukes i nesten alle moderne JavaScript-prosjekter.",
    },
  ],
};