import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptTypeInference: ProgrammingLesson = {
  id: "type-inference",
  title: "Type Inference",

  sections: [
    {
      title: "Hva er Type Inference?",
      content:
        "Type Inference betyr at TypeScript ofte kan finne ut hvilken type en variabel har uten at du trenger å skrive den selv.",
    },

    {
      title: "Automatisk type",
      content:
        "Når du gir en variabel en verdi, forstår TypeScript vanligvis hvilken type den har.",
      code: `let navn = "Julie";

console.log(navn);`,
      output: `Julie`,
      tip:
        "TypeScript forstår automatisk at 'navn' er en string.",
    },

    {
      title: "Når trenger du ikke typer?",
      content:
        "I enkle tilfeller er det ofte unødvendig å skrive typen eksplisitt.",
      code: `const alder = 19;
const student = true;`,
      note:
        "TypeScript tolker automatisk at alder er number og student er boolean.",
    },

    {
      title: "Når bør du skrive typen selv?",
      content:
        "Funksjoner, objekter og API-er blir ofte tydeligere hvis du skriver typen eksplisitt.",
      code: `function hei(navn: string) {
  console.log("Hei " + navn);
}`,
      tip:
        "Selv om TypeScript kan gjette mye, er eksplisitte typer ofte enklere å lese.",
    },

    {
      title: "Vanlig feil",
      content:
        "Når en variabel først har fått en type, kan den ikke få en verdi av en annen type.",
      code: `let navn = "Julie";

navn = 42;`,
      warning:
        "TypeScript gir en feil fordi 'navn' ble tolket som en string.",
    },

    {
      title: "Oppsummering",
      content:
        "Type Inference gjør at TypeScript automatisk finner riktige typer i mange situasjoner. Du trenger derfor ikke alltid å skrive dem selv.",
    },
  ],
};