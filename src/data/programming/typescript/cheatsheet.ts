import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptCheatsheet: ProgrammingLesson = {
  id: "cheatsheet",
  title: "Cheatsheet",

  sections: [
    {
      title: "Grunnleggende typer",
      code: `string
number
boolean
null
undefined`,
    },

    {
      title: "Arrays",
      code: `const tall: number[] = [1, 2, 3];`,
    },

    {
      title: "Funksjoner",
      code: `function addisjon(
  a: number,
  b: number
): number {
  return a + b;
}`,
    },

    {
      title: "Interfaces",
      code: `interface Student {
  navn: string;
  alder: number;
}`,
    },

    {
      title: "Type Aliases",
      code: `type Student = {
  navn: string;
  alder: number;
};`,
    },

    {
      title: "Union Types",
      code: `let verdi: string | number;`,
    },

    {
      title: "Generics",
      code: `function identitet<T>(
  verdi: T
): T {
  return verdi;
}`,
    },

    {
      title: "Utility Types",
      code: `Partial<T>

Readonly<T>

Pick<T, K>

Omit<T, K>`,
    },

    {
      title: "Enums",
      code: `enum Rolle {
  Admin,
  Bruker,
}`,
    },

    {
      title: "Type Assertions",
      code: `const input =
  document.querySelector(
    "input"
  ) as HTMLInputElement;`,
    },
  ],
};