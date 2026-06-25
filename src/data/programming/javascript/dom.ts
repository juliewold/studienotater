import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptDom: ProgrammingLesson = {
  id: "dom",
  title: "DOM",

  sections: [
    {
      title: "Hva er DOM?",
      content:
        "DOM (Document Object Model) er en representasjon av HTML-siden. Med JavaScript kan vi lese og endre elementer på nettsiden gjennom DOM.",
    },

    {
      title: "Hente et element",
      content:
        "querySelector() brukes for å finne et element på siden.",
      code: `const heading = document.querySelector("h1");

console.log(heading);`,
      output: `<h1>...</h1>`,
      tip: "querySelector() returnerer det første elementet som matcher CSS-selektoren.",
    },

    {
      title: "Endre tekst",
      content:
        "Du kan endre teksten i et element ved å bruke textContent.",
      code: `const heading = document.querySelector("h1");

heading.textContent = "Hei verden!";`,
      note:
        "Når denne koden kjører, endres teksten som vises på nettsiden.",
    },

    {
      title: "Endre HTML",
      content:
        "innerHTML lar deg legge inn HTML i et element.",
      code: `const box = document.querySelector(".box");

box.innerHTML = "<strong>Hei!</strong>";`,
      warning:
        "Vær forsiktig med innerHTML hvis innholdet kommer fra brukere. Det kan føre til sikkerhetsproblemer.",
    },

    {
      title: "Endre stil",
      content:
        "Du kan endre CSS direkte fra JavaScript.",
      code: `const heading = document.querySelector("h1");

heading.style.color = "red";`,
    },

    {
      title: "Legge til en CSS-klasse",
      content:
        "classList brukes til å legge til eller fjerne CSS-klasser.",
      code: `const card = document.querySelector(".card");

card.classList.add("active");`,
      tip:
        "Det er ofte bedre å legge til en CSS-klasse enn å endre style direkte.",
    },

    {
      title: "Oppsummering",
      content:
        "DOM gjør at JavaScript kan lese og endre HTML-elementer. querySelector(), textContent, innerHTML, style og classList er blant de viktigste verktøyene.",
    },
  ],
};