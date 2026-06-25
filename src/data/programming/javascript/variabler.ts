import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptVariables: ProgrammingLesson = {
  id: "variabler",
  title: "Variabler",

  sections: [
    {
      title: "Hva er en variabel?",
      content:
        "En variabel brukes til å lagre informasjon som kan brukes senere i programmet. I JavaScript opprettes variabler med let, const eller var.",
    },

    {
      title: "let",
      content:
        "let brukes når verdien kan endres senere.",
      code: `let navn = "Julie";

console.log(navn);`,
      output: `Julie`,
      tip: "Bruk let når variabelen skal kunne endres.",
    },

    {
      title: "const",
      content:
        "const brukes når verdien ikke skal endres.",
      code: `const pi = 3.14;

console.log(pi);`,
      output: `3.14`,
      tip: "Bruk const som standard. Velg let bare når du vet at verdien skal endres.",
    },

    {
      title: "Endre en variabel",
      content:
        "Variabler som er opprettet med let kan få en ny verdi.",
      code: `let alder = 19;

alder = 20;

console.log(alder);`,
      output: `20`,
      warning:
        "Du kan ikke endre en variabel som er opprettet med const.",
    },

    {
      title: "Oppsummering",
      content:
        "JavaScript har tre måter å opprette variabler på: let, const og var. I moderne JavaScript brukes nesten alltid const og let.",
    },
  ],
};