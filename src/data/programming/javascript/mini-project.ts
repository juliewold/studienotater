import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptMiniProject: ProgrammingLesson = {
  id: "mini-project",
  title: "Mini Project – To-Do List",

  sections: [
    {
      title: "Prosjekt",
      content:
        "Nå skal du bruke det du har lært til å lage en enkel To-Do List. Dette prosjektet kombinerer mange av de viktigste konseptene i JavaScript.",
    },

    {
      title: "Du kommer til å bruke",
      content:
        "I dette prosjektet skal du bruke variabler, arrays, objects, DOM, event listeners og Local Storage.",
    },

    {
      title: "Funksjoner",
      content:
        "Prosjektet bør minst kunne:",
      note:
`• Legge til en oppgave
• Slette en oppgave
• Markere en oppgave som fullført
• Lagre oppgavene i Local Storage
• Lese oppgavene når siden åpnes`,
    },

    {
      title: "Ekstra utfordringer",
      content:
        "Hvis du vil utfordre deg selv kan du prøve å legge til:",
      challenge: {
        question:
`Kan du legge til:
• Filtrering
• Søk
• Kategorier
• Prioritet
• Mørk modus?`,
        answer:
"Det finnes mange riktige løsninger. Prøv først selv før du ser på andres kode.",
      },
    },

    {
      title: "Oppsummering",
      content:
        "Hvis du klarer dette prosjektet, har du brukt de viktigste konseptene i moderne JavaScript sammen i én applikasjon.",
    },
  ],
};