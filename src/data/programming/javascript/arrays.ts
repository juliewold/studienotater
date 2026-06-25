import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptArrays: ProgrammingLesson = {
  id: "arrays",
  title: "Arrays",

  sections: [
    {
      title: "Hva er en array?",
      content:
        "En array brukes til å lagre flere verdier i én variabel. Hvert element har en indeks som starter på 0.",
    },

    {
      title: "Opprette en array",
      content:
        "Arrays skrives med hakeparenteser.",
      code: `const frukter = ["eple", "banan", "appelsin"];

console.log(frukter);`,
      output: `["eple", "banan", "appelsin"]`,
    },

    {
      title: "Hente elementer",
      content:
        "Du kan hente et element ved å bruke indeksen. Den første verdien har indeks 0.",
      code: `const frukter = ["eple", "banan", "appelsin"];

console.log(frukter[0]);
console.log(frukter[1]);`,
      output: `eple
banan`,
      warning:
        "Indekser starter på 0. Det første elementet er frukter[0], ikke frukter[1].",
    },

    {
      title: "Legge til elementer",
      content:
        "push() legger til et nytt element bakerst i arrayen.",
      code: `const frukter = ["eple", "banan"];

frukter.push("appelsin");

console.log(frukter);`,
      output: `["eple", "banan", "appelsin"]`,
    },

    {
      title: "Fjerne siste element",
      content:
        "pop() fjerner det siste elementet i arrayen.",
      code: `const frukter = ["eple", "banan", "appelsin"];

frukter.pop();

console.log(frukter);`,
      output: `["eple", "banan"]`,
    },

    {
      title: "Lengden på en array",
      content:
        "length forteller hvor mange elementer arrayen inneholder.",
      code: `const frukter = ["eple", "banan", "appelsin"];

console.log(frukter.length);`,
      output: `3`,
      tip: "Husk at length er en egenskap, ikke en funksjon. Derfor skriver vi ikke length().",
    },

    {
      title: "Løkke gjennom en array",
      content:
        "for...of brukes ofte når du vil gå gjennom alle elementene.",
      code: `const frukter = ["eple", "banan", "appelsin"];

for (const frukt of frukter) {
  console.log(frukt);
}`,
      output: `eple
banan
appelsin`,
    },

    {
      title: "Oppsummering",
      content:
        "Arrays brukes til å lagre flere verdier. Du kan hente elementer med indekser, legge til med push(), fjerne med pop() og finne antall elementer med length.",
    },
  ],
};