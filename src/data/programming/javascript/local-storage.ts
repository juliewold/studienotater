import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptLocalStorage: ProgrammingLesson = {
  id: "local-storage",
  title: "Local Storage",

  sections: [
    {
      title: "Hva er Local Storage?",
      content:
        "Local Storage gjør at en nettside kan lagre data i nettleseren. Dataene blir værende selv om brukeren oppdaterer siden eller lukker nettleseren.",
    },

    {
      title: "Lagre data",
      content:
        "setItem() brukes for å lagre en verdi.",
      code: `localStorage.setItem(
  "navn",
  "Julie"
);`,
      tip:
        "Verdier lagres som tekst (strings).",
    },

    {
      title: "Hente data",
      content:
        "getItem() henter en verdi som tidligere er lagret.",
      code: `const navn = localStorage.getItem(
  "navn"
);

console.log(navn);`,
      output: `Julie`,
    },

    {
      title: "Slette data",
      content:
        "removeItem() sletter én verdi, mens clear() sletter alt.",
      code: `localStorage.removeItem("navn");

// eller

localStorage.clear();`,
    },

    {
      title: "Lagre objekter",
      content:
        "Objekter må gjøres om til JSON før de kan lagres.",
      code: `const student = {
  navn: "Julie",
  alder: 19,
};

localStorage.setItem(
  "student",
  JSON.stringify(student)
);`,
      note:
        "JSON.stringify() gjør et objekt om til tekst.",
    },

    {
      title: "Lese objekter",
      content:
        "Når objektet hentes tilbake, må teksten gjøres om til et JavaScript-objekt.",
      code: `const student = JSON.parse(
  localStorage.getItem("student")
);

console.log(student.navn);`,
      output: `Julie`,
      warning:
        "Husk alltid JSON.parse() når du henter objekter fra Local Storage.",
    },

    {
      title: "Oppsummering",
      content:
        "Local Storage brukes til å lagre data i nettleseren. Bruk JSON.stringify() når du lagrer objekter og JSON.parse() når du henter dem tilbake.",
    },
  ],
};