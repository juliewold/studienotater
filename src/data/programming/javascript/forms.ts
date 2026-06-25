import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptForms: ProgrammingLesson = {
  id: "forms",
  title: "Forms",

  sections: [
    {
      title: "Hva er et skjema?",
      content:
        "Et HTML-skjema (form) brukes til å samle inn informasjon fra brukeren, for eksempel navn, e-post eller passord.",
    },

    {
      title: "Hente verdien fra et inputfelt",
      content:
        "Du kan lese det brukeren har skrevet ved hjelp av value.",
      code: `const input = document.querySelector("input");

console.log(input.value);`,
      output: `Julie`,
      tip: "value inneholder teksten brukeren har skrevet inn.",
    },

    {
      title: "Lytte etter innsending",
      content:
        "submit-hendelsen brukes når et skjema sendes inn.",
      code: `const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  console.log("Skjema sendt!");
});`,
      output: `Skjema sendt!`,
      warning:
        "event.preventDefault() hindrer at siden lastes på nytt når skjemaet sendes inn.",
    },

    {
      title: "Hente flere inputfelt",
      content:
        "Du kan hente flere inputfelt og bruke verdiene sammen.",
      code: `const navn = document.querySelector("#navn");
const alder = document.querySelector("#alder");

console.log(navn.value);
console.log(alder.value);`,
      output: `Julie
19`,
    },

    {
      title: "Enkel validering",
      content:
        "Du kan sjekke at brukeren har fylt ut nødvendige felt før skjemaet sendes.",
      code: `if (navn.value === "") {
  console.log("Skriv inn navnet ditt.");
}`,
      output: `Skriv inn navnet ditt.`,
      note:
        "Validering gjør at brukeren får beskjed hvis noe mangler eller er feil.",
    },

    {
      title: "Oppsummering",
      content:
        "Forms brukes til å samle inn data fra brukeren. De viktigste konseptene er value, submit og event.preventDefault().",
    },
  ],
};