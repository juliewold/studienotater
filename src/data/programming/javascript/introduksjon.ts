import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptIntroduction: ProgrammingLesson = {
  id: "introduksjon",
  title: "Introduksjon",

  sections: [
    {
      title: "Hva er JavaScript?",
      content:
        "JavaScript er programmeringsspråket som gjør nettsider interaktive. Det brukes sammen med HTML og CSS, men kan også brukes på backend med Node.js.",
    },
    {
      title: "Første eksempel",
      content: "console.log() brukes for å skrive ut tekst i konsollen.",
      code: `console.log("Hello, World!");`,
      output: `Hello, World!`,
    },
  ],
};