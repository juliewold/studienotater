import type { ProgrammingLesson } from "../../../types/programming";

export const pythonIntroduction: ProgrammingLesson = {
  id: "introduksjon",
  title: "Introduksjon",

  sections: [
    {
      title: "Hva er Python?",
      content:
        "Python er et enkelt og populært programmeringsspråk som brukes til alt fra nettsider til AI.",
    },

    {
      title: "Første program",
      content: "Slik skriver du Hello World i Python.",

      code: `print("Hello, world!")`,
      output: `Hello, world!`
    },
  ],
};