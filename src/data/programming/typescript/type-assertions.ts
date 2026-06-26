import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptTypeAssertions: ProgrammingLesson = {
  id: "type-assertions",
  title: "Type Assertions",

  sections: [
    {
      title: "Hva er en Type Assertion?",
      content:
        "En Type Assertion forteller TypeScript hvilken type du mener en verdi har. Den endrer ikke verdien, men hjelper TypeScript med typekontroll.",
    },

    {
      title: "as",
      content:
        "Den vanligste måten å skrive en Type Assertion på er med nøkkelordet as.",
      code: `const input = document.querySelector(
  "input"
) as HTMLInputElement;

console.log(input.value);`,
      output: `Julie`,
      tip:
        "Type Assertions brukes ofte når TypeScript ikke klarer å forstå hvilken type et element har.",
    },

    {
      title: "Hvorfor trengs det?",
      content:
        "querySelector() kan returnere mange ulike typer elementer. Derfor vet ikke TypeScript at elementet har en value-egenskap.",
      code: `const input = document.querySelector(
  "input"
);

console.log(input.value);`,
      warning:
        "Denne koden gir en TypeScript-feil fordi input kan være null eller et annet HTML-element.",
    },

    {
      title: "Bruk med forsiktighet",
      content:
        "En Type Assertion forteller bare TypeScript hva du tror typen er. Hvis du tar feil, kan programmet fortsatt krasje under kjøring.",
      note:
        "Bruk Type Assertions når du er sikker på hvilken type verdien har.",
    },

    {
      title: "Oppsummering",
      content:
        "Type Assertions hjelper TypeScript med å forstå hvilken type en verdi har. De brukes ofte sammen med DOM-elementer og eksterne biblioteker.",
    },
  ],
};