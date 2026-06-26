import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptInterfaces: ProgrammingLesson = {
  id: "interfaces",
  title: "Interfaces",

  sections: [
    {
      title: "Hva er et interface?",
      content:
        "Et interface beskriver hvordan et objekt skal se ut. Det forteller hvilke egenskaper objektet må ha og hvilke typer de skal være.",
    },

    {
      title: "Lage et interface",
      content:
        "Et interface opprettes med nøkkelordet interface.",
      code: `interface Student {
  navn: string;
  alder: number;
}

const student: Student = {
  navn: "Julie",
  alder: 19,
};

console.log(student);`,
      output: `{ navn: "Julie", alder: 19 }`,
    },

    {
      title: "Bruke et interface",
      content:
        "Når et objekt har en type, må alle egenskapene stemme med interfacet.",
      code: `interface Student {
  navn: string;
  alder: number;
}

const student: Student = {
  navn: "Julie",
  alder: 19,
};`,
      tip:
        "Interfaces gjør objekter enklere å forstå og gir bedre autoutfylling.",
    },

    {
      title: "Valgfrie egenskaper",
      content:
        "Et spørsmålstegn (?) gjør en egenskap valgfri.",
      code: `interface Student {
  navn: string;
  alder?: number;
}

const student: Student = {
  navn: "Julie",
};`,
      note:
        "Her er alder valgfri og trenger ikke være med.",
    },

    {
      title: "Vanlig feil",
      content:
        "Et objekt må inneholde alle obligatoriske egenskaper.",
      code: `interface Student {
  navn: string;
  alder: number;
}

const student: Student = {
  navn: "Julie",
};`,
      warning:
        "Denne koden gir en feil fordi egenskapen alder mangler.",
    },

    {
      title: "Oppsummering",
      content:
        "Interfaces beskriver strukturen til objekter. De brukes mye i React for props, API-data og state.",
    },
  ],
};