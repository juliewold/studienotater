import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptTypes: ProgrammingLesson = {
  id: "types",
  title: "Grunnleggende typer",

  sections: [
    {
      title: "Hva er en type?",
      content:
        "En type forteller hvilke verdier en variabel kan inneholde. TypeScript bruker typer for å oppdage feil før programmet kjøres.",
    },

    {
      title: "String",
      content:
        "string brukes for tekst.",
      code: `let navn: string = "Julie";

console.log(navn);`,
      output: `Julie`,
    },

    {
      title: "Number",
      content:
        "number brukes for både heltall og desimaltall.",
      code: `let alder: number = 19;

console.log(alder);`,
      output: `19`,
    },

    {
      title: "Boolean",
      content:
        "boolean kan bare være true eller false.",
      code: `let student: boolean = true;

console.log(student);`,
      output: `true`,
    },

    {
      title: "Arrays",
      content:
        "Du kan angi typen til alle elementene i en array.",
      code: `const tall: number[] = [1, 2, 3];

console.log(tall);`,
      output: `[1, 2, 3]`,
      tip:
        "number[] betyr en array som bare kan inneholde tall.",
    },

    {
      title: "Vanlig feil",
      content:
        "TypeScript lar deg ikke lagre feil datatype.",
      code: `let alder: number = "19";`,
      warning:
        "Denne koden gir en TypeScript-feil fordi en string ikke kan lagres i en number.",
    },

    {
      title: "Oppsummering",
      content:
        "De vanligste typene er string, number, boolean og arrays. TypeScript bruker disse til å kontrollere at koden er riktig.",
    },
  ],
};