import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptFunctions: ProgrammingLesson = {
  id: "functions",
  title: "Funksjoner",

  sections: [
    {
      title: "Typer på parametere",
      content:
        "I TypeScript kan du angi hvilke typer parametrene til en funksjon skal ha.",
      code: `function hei(navn: string) {
  console.log("Hei " + navn);
}

hei("Julie");`,
      output: `Hei Julie`,
    },

    {
      title: "Returtyper",
      content:
        "Du kan også angi hvilken type funksjonen skal returnere.",
      code: `function addisjon(a: number, b: number): number {
  return a + b;
}

console.log(addisjon(3, 5));`,
      output: `8`,
      tip:
        "Returtypen skrives etter parameterlisten med kolon (:).",
    },

    {
      title: "Arrow Functions",
      content:
        "Arrow functions fungerer på samme måte som i JavaScript, men parametere og returverdi kan ha typer.",
      code: `const kvadrat = (x: number): number => {
  return x * x;
};

console.log(kvadrat(4));`,
      output: `16`,
    },

    {
      title: "Vanlig feil",
      content:
        "Alle argumentene må ha riktig type.",
      code: `function addisjon(a: number, b: number) {
  return a + b;
}

addisjon("3", 5);`,
      warning:
        "Denne koden gir en feil fordi '3' er en string og ikke et number.",
    },

    {
      title: "Oppsummering",
      content:
        "TypeScript lar deg angi typer på både parametere og returverdier. Dette gjør funksjoner tryggere og enklere å bruke.",
    },
  ],
};