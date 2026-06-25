import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptEventListeners: ProgrammingLesson = {
  id: "event-listeners",
  title: "Event Listeners",

  sections: [
    {
      title: "Hva er en Event Listener?",
      content:
        "En event listener lar JavaScript reagere når noe skjer på nettsiden, for eksempel når brukeren klikker på en knapp eller skriver i et inputfelt.",
    },

    {
      title: "Lytte etter et klikk",
      content:
        "addEventListener() brukes for å kjøre kode når en hendelse skjer.",
      code: `const button = document.querySelector("button");

button.addEventListener("click", () => {
  console.log("Knappen ble klikket!");
});`,
      output: `Knappen ble klikket!`,
      tip: "Event listeners gjør nettsider interaktive.",
    },

    {
      title: "Endre tekst ved klikk",
      content:
        "Du kan kombinere event listeners med DOM for å endre innhold på siden.",
      code: `const button = document.querySelector("button");
const heading = document.querySelector("h1");

button.addEventListener("click", () => {
  heading.textContent = "Hei!";
});`,
      note:
        "Når brukeren klikker på knappen, endres overskriften.",
    },

    {
      title: "Mouse Events",
      content:
        "JavaScript kan reagere på flere musehendelser enn bare klikk.",
      code: `element.addEventListener("mouseenter", () => {
  console.log("Musen er over elementet");
});`,
      output: `Musen er over elementet`,
    },

    {
      title: "Keyboard Events",
      content:
        "Du kan også lytte etter tastetrykk.",
      code: `document.addEventListener("keydown", (event) => {
  console.log(event.key);
});`,
      output: `a`,
      tip:
        "event.key forteller hvilken tast brukeren trykket på.",
    },

    {
      title: "Oppsummering",
      content:
        "Event listeners brukes for å reagere på brukerhandlinger som klikk, tastetrykk og musebevegelser. De er grunnlaget for interaktive nettsider.",
    },
  ],
};