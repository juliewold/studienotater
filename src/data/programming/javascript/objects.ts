import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptObjects: ProgrammingLesson = {
  id: "objects",
  title: "Objects",

  sections: [
    {
      title: "Hva er et object?",
      content:
        "Et object brukes til å samle informasjon om én ting. Verdiene lagres som nøkkel-verdi-par.",
    },

    {
      title: "Opprette et object",
      content:
        "Et object skrives med krøllparenteser.",
      code: `const student = {
  navn: "Julie",
  alder: 19,
  studie: "Datateknologi",
};

console.log(student);`,
      output: `{ navn: "Julie", alder: 19, studie: "Datateknologi" }`,
    },

    {
      title: "Hente verdier",
      content:
        "Du kan hente verdier med punktnotasjon.",
      code: `const student = {
  navn: "Julie",
  alder: 19,
};

console.log(student.navn);
console.log(student.alder);`,
      output: `Julie
19`,
      tip: "Punktnotasjon er den vanligste måten å hente verdier på.",
    },

    {
      title: "Endre verdier",
      content:
        "Du kan endre egenskaper selv om objektet er opprettet med const.",
      code: `const student = {
  navn: "Julie",
};

student.navn = "Ola";

console.log(student.navn);`,
      output: `Ola`,
      note:
        "const betyr at variabelen ikke kan peke på et nytt objekt. Selve innholdet kan fortsatt endres.",
    },

    {
      title: "Legge til nye egenskaper",
      content:
        "Du kan legge til nye egenskaper etter at objektet er opprettet.",
      code: `const student = {
  navn: "Julie",
};

student.alder = 19;

console.log(student);`,
      output: `{ navn: "Julie", alder: 19 }`,
    },

    {
      title: "Objekter i arrays",
      content:
        "Det er veldig vanlig å lagre flere objekter i en array.",
      code: `const studenter = [
  { navn: "Julie" },
  { navn: "Ola" },
];

console.log(studenter[0].navn);`,
      output: `Julie`,
      tip: "Denne strukturen brukes hele tiden i React og når du henter data fra API-er.",
    },

    {
      title: "Oppsummering",
      content:
        "Objects brukes til å beskrive én ting med flere egenskaper. De er en av de viktigste datastrukturene i JavaScript.",
    },
  ],
};