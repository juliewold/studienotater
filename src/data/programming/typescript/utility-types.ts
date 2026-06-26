import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptUtilityTypes: ProgrammingLesson = {
  id: "utility-types",
  title: "Utility Types",

  sections: [
    {
      title: "Hva er Utility Types?",
      content:
        "Utility Types er innebygde TypeScript-typer som gjør det enklere å lage nye typer basert på eksisterende typer.",
    },

    {
      title: "Partial",
      content:
        "Partial gjør alle egenskapene i en type valgfrie.",
      code: `interface Student {
  navn: string;
  alder: number;
}

const student: Partial<Student> = {
  navn: "Julie",
};`,
      tip:
        "Partial brukes ofte når bare noen av egenskapene skal oppdateres.",
    },

    {
      title: "Readonly",
      content:
        "Readonly gjør at egenskaper ikke kan endres etter at objektet er opprettet.",
      code: `interface Student {
  navn: string;
}

const student: Readonly<Student> = {
  navn: "Julie",
};

// student.navn = "Ola";`,
      note:
        "TypeScript vil gi en feil hvis du prøver å endre en readonly-egenskap.",
    },

    {
      title: "Pick",
      content:
        "Pick lager en ny type med bare utvalgte egenskaper.",
      code: `interface Student {
  navn: string;
  alder: number;
  studie: string;
}

type StudentInfo = Pick<
  Student,
  "navn" | "studie"
>;`,
    },

    {
      title: "Omit",
      content:
        "Omit lager en ny type uten bestemte egenskaper.",
      code: `interface Student {
  navn: string;
  alder: number;
  studie: string;
}

type StudentInfo = Omit<
  Student,
  "alder"
>;`,
    },

    {
      title: "Oppsummering",
      content:
        "Utility Types hjelper deg med å lage nye typer uten å skrive alt på nytt. De vanligste er Partial, Readonly, Pick og Omit.",
    },
  ],
};