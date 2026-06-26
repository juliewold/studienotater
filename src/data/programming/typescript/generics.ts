import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptGenerics: ProgrammingLesson = {
  id: "generics",
  title: "Generics",

  sections: [
    {
      title: "Hva er Generics?",
      content:
        "Generics lar deg skrive kode som fungerer med flere typer uten å miste typeinformasjonen. De gjør funksjoner og klasser mer fleksible.",
    },

    {
      title: "Et enkelt eksempel",
      content:
        "Her lager vi en funksjon som returnerer verdien den får inn, uansett type.",
      code: `function identitet<T>(verdi: T): T {
  return verdi;
}

console.log(identitet("Julie"));
console.log(identitet(19));`,
      output: `Julie
19`,
      tip:
        "T er en typeparameter. Du kan tenke på den som en plassholder for en type.",
    },

    {
      title: "Generics med arrays",
      content:
        "Generics brukes ofte sammen med arrays.",
      code: `function førsteElement<T>(liste: T[]): T {
  return liste[0];
}

console.log(førsteElement([1, 2, 3]));
console.log(førsteElement(["A", "B", "C"]));`,
      output: `1
A`,
    },

    {
      title: "Hvorfor bruke Generics?",
      content:
        "Uten generics måtte du laget flere nesten like funksjoner for ulike typer. Med generics kan én funksjon brukes for mange typer.",
      note:
        "Generics brukes mye i React, biblioteker og TypeScript generelt.",
    },

    {
      title: "Vanlig feil",
      content:
        "Ikke tenk på T som en bestemt datatype. Den representerer typen som sendes inn når funksjonen brukes.",
      warning:
        "T betyr ikke 'tekst'. Det er bare et vanlig navn på en typeparameter. Du kan også bruke andre navn, som Value eller Item.",
    },

    {
      title: "Oppsummering",
      content:
        "Generics gjør koden fleksibel uten å miste typeinformasjon. De lar deg skrive én funksjon som fungerer med mange ulike typer.",
    },
  ],
};