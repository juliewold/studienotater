import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptArrayMethods: ProgrammingLesson = {
  id: "array-methods",
  title: "Array Methods",

  sections: [
    {
      title: "Hva er array methods?",
      content:
        "Array methods er innebygde funksjoner som gjør det enkelt å jobbe med arrays. De brukes hele tiden i moderne JavaScript og React.",
    },

    {
      title: "forEach()",
      content:
        "forEach() går gjennom alle elementene i en array.",
      code: `const frukter = ["eple", "banan", "appelsin"];

frukter.forEach((frukt) => {
  console.log(frukt);
});`,
      output: `eple
banan
appelsin`,
      tip: "Bruk forEach() når du vil gjøre noe med hvert element uten å lage en ny array.",
    },

    {
      title: "map()",
      content:
        "map() lager en ny array ved å endre hvert element.",
      code: `const tall = [1, 2, 3];

const doble = tall.map((tall) => tall * 2);

console.log(doble);`,
      output: `[2, 4, 6]`,
      note: "map() endrer ikke den originale arrayen.",
    },

    {
      title: "filter()",
      content:
        "filter() lager en ny array med bare elementene som oppfyller en betingelse.",
      code: `const tall = [1, 2, 3, 4, 5];

const partall = tall.filter((tall) => tall % 2 === 0);

console.log(partall);`,
      output: `[2, 4]`,
    },

    {
      title: "find()",
      content:
        "find() returnerer det første elementet som oppfyller en betingelse.",
      code: `const tall = [5, 10, 15, 20];

const resultat = tall.find((tall) => tall > 10);

console.log(resultat);`,
      output: `15`,
    },

    {
      title: "some()",
      content:
        "some() returnerer true hvis minst ett element oppfyller betingelsen.",
      code: `const tall = [1, 2, 3];

console.log(
  tall.some((tall) => tall > 2)
);`,
      output: `true`,
    },

    {
      title: "every()",
      content:
        "every() returnerer true bare hvis alle elementene oppfyller betingelsen.",
      code: `const tall = [2, 4, 6];

console.log(
  tall.every((tall) => tall % 2 === 0)
);`,
      output: `true`,
    },

    {
      title: "reduce()",
      content:
        "reduce() brukes til å redusere en array til én verdi, for eksempel summen av alle tallene.",
      code: `const tall = [1, 2, 3, 4];

const sum = tall.reduce(
  (sum, tall) => sum + tall,
  0
);

console.log(sum);`,
      output: `10`,
      warning:
        "reduce() kan være vanskelig i starten. Ikke stress hvis den føles litt komplisert.",
    },

    {
      title: "Oppsummering",
      content:
        "map(), filter(), find(), some(), every() og reduce() er blant de viktigste metodene i moderne JavaScript. Du kommer til å bruke dem mye i React.",
    },
  ],
};