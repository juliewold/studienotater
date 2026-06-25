import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptDataTypes: ProgrammingLesson = {
  id: "datatyper",
  title: "Datatyper",

  sections: [
    {
      title: "Hva er en datatype?",
      content:
        "En datatype forteller JavaScript hvilken type verdi en variabel inneholder. Ulike datatyper brukes til ulike formål.",
    },

    {
      title: "String",
      content:
        "En string er tekst og skrives med enkle eller doble anførselstegn.",
      code: `const navn = "Julie";

console.log(navn);`,
      output: `Julie`,
      tip: "Strings brukes til navn, meldinger og annen tekst.",
    },

    {
      title: "Number",
      content:
        "JavaScript bruker én datatype, Number, for både heltall og desimaltall.",
      code: `const alder = 19;
const pi = 3.14;

console.log(alder);
console.log(pi);`,
      output: `19
3.14`,
    },

    {
      title: "Boolean",
      content:
        "Boolean kan bare være true eller false.",
      code: `const erStudent = true;

console.log(erStudent);`,
      output: `true`,
    },

    {
      title: "Null",
      content:
        "null brukes når en variabel bevisst ikke skal ha en verdi.",
      code: `const bruker = null;

console.log(bruker);`,
      output: `null`,
      note: "null betyr 'ingen verdi', men verdien er satt med vilje.",
    },

    {
      title: "Undefined",
      content:
        "undefined betyr at en variabel finnes, men ikke har fått en verdi ennå.",
      code: `let navn;

console.log(navn);`,
      output: `undefined`,
      warning:
        "Mange blander null og undefined. De betyr ikke det samme.",
    },

    {
      title: "Sjekke datatype",
      content:
        "typeof brukes for å finne datatypen til en verdi.",
      code: `console.log(typeof "Julie");
console.log(typeof 19);
console.log(typeof true);`,
      output: `string
number
boolean`,
    },

    {
      title: "Oppsummering",
      content:
        "De vanligste datatypene i JavaScript er string, number, boolean, null og undefined. Med typeof kan du sjekke hvilken datatype en verdi har.",
    },
  ],
};