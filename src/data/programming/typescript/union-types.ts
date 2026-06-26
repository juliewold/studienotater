import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptUnionTypes: ProgrammingLesson = {
  id: "union-types",
  title: "Union Types",

  sections: [
    {
      title: "Hva er en Union Type?",
      content:
        "En Union Type lar en variabel ha flere mulige typer. Du bruker tegnet | mellom typene.",
    },

    {
      title: "Flere mulige typer",
      content:
        "Her kan variabelen være enten en string eller et number.",
      code: `let verdi: string | number;

verdi = "Julie";
verdi = 19;

console.log(verdi);`,
      output: `19`,
      tip:
        "Union Types brukes når en verdi kan ha flere gyldige typer.",
    },

    {
      title: "Funksjoner med Union Types",
      content:
        "Parametere kan også ha flere mulige typer.",
      code: `function skrivUt(verdi: string | number) {
  console.log(verdi);
}

skrivUt("Hei");
skrivUt(42);`,
      output: `Hei
42`,
    },

    {
      title: "Type Guards",
      content:
        "Når en verdi kan ha flere typer, må du ofte sjekke hvilken type den har før du bruker den.",
      code: `function skrivUt(verdi: string | number) {
  if (typeof verdi === "string") {
    console.log(verdi.toUpperCase());
  } else {
    console.log(verdi.toFixed(2));
  }
}`,
      note:
        "typeof brukes som en type guard. Da vet TypeScript hvilken type verdien har inne i hver gren.",
    },

    {
      title: "Vanlig feil",
      content:
        "Du kan ikke bruke metoder som bare finnes på én av typene uten å sjekke typen først.",
      code: `function skrivUt(verdi: string | number) {
  console.log(verdi.toUpperCase());
}`,
      warning:
        "Denne koden gir en feil fordi number ikke har metoden toUpperCase().",
    },

    {
      title: "Oppsummering",
      content:
        "Union Types gjør at en verdi kan ha flere mulige typer. Bruk type guards som typeof når du må skille mellom dem.",
    },
  ],
};