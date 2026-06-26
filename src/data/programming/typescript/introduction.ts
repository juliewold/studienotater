import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptIntroduction: ProgrammingLesson = {
  id: "introduction",
  title: "Introduksjon",

  sections: [
    {
      title: "Hva er TypeScript?",
      content:
        "TypeScript er et programmeringsspråk som bygger på JavaScript. Det legger til statiske typer som gjør det enklere å oppdage feil før programmet kjøres.",
    },

    {
      title: "JavaScript vs TypeScript",
      content:
        "All gyldig JavaScript er også gyldig TypeScript. Forskjellen er at TypeScript lar deg beskrive hvilke typer variabler og funksjoner skal ha.",
      code: `// JavaScript
let navn = "Julie";

// TypeScript
let navn: string = "Julie";`,
      note:
        "TypeScript-koden kompileres til vanlig JavaScript før den kjøres i nettleseren.",
    },

    {
      title: "Hvorfor bruke TypeScript?",
      content:
        "TypeScript gjør store prosjekter enklere å vedlikeholde. Det gir bedre autoutfylling, tydeligere kode og finner mange feil mens du skriver.",
      tip:
        "TypeScript brukes i mange moderne React-prosjekter, inkludert dette prosjektet.",
    },

    {
      title: "Oppsummering",
      content:
        "TypeScript bygger videre på JavaScript ved å legge til typer. Dette gjør koden tryggere og enklere å utvikle.",
    },
  ],
};