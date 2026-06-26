import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptTypeAliases: ProgrammingLesson = {
  id: "type-aliases",
  title: "Type Aliases",

  sections: [
    {
      title: "Hva er et type alias?",
      content:
        "Et type alias lar deg gi et navn til en type. Det gjør koden enklere å lese og gjenbruke.",
    },

    {
      title: "Lage et type alias",
      content:
        "Et type alias opprettes med nøkkelordet type.",
      code: `type Student = {
  navn: string;
  alder: number;
};

const student: Student = {
  navn: "Julie",
  alder: 19,
};

console.log(student);`,
      output: `{ navn: "Julie", alder: 19 }`,
    },

    {
      title: "Gjenbruke typer",
      content:
        "Når du har laget et type alias, kan du bruke det flere steder i programmet.",
      code: `type Student = {
  navn: string;
  alder: number;
};

const student1: Student = {
  navn: "Julie",
  alder: 19,
};

const student2: Student = {
  navn: "Ola",
  alder: 21,
};`,
      tip:
        "Type aliases gjør at du slipper å skrive den samme typen flere ganger.",
    },

    {
      title: "Interface eller type?",
      content:
        "Både interface og type kan beskrive objekter. I praksis brukes begge mye.",
      note:
        "Mange prosjekter bruker interface for objekter og type for union types og andre sammensatte typer.",
    },

    {
      title: "Oppsummering",
      content:
        "Type aliases gir navn til typer og gjør koden mer oversiktlig. De brukes ofte sammen med interfaces i TypeScript-prosjekter.",
    },
  ],
};