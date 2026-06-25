import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptFunctions: ProgrammingLesson = {
  id: "funksjoner",
  title: "Funksjoner",

  sections: [
    {
      title: "Hva er en funksjon?",
      content:
        "En funksjon er en blokk med kode som kan brukes flere ganger. Den gjør programmet mer ryddig og reduserer gjentakelser.",
    },

    {
      title: "Lage en funksjon",
      content:
        "En funksjon opprettes med nøkkelordet function.",
      code: `function hei() {
  console.log("Hei!");
}

hei();`,
      output: `Hei!`,
    },

    {
      title: "Parametere",
      content:
        "Parametere gjør at funksjonen kan motta verdier når den blir kalt.",
      code: `function hei(navn) {
  console.log("Hei " + navn);
}

hei("Julie");
hei("Ola");`,
      output: `Hei Julie
Hei Ola`,
    },

    {
      title: "Return",
      content:
        "return sender en verdi tilbake fra funksjonen.",
      code: `function addisjon(a, b) {
  return a + b;
}

const resultat = addisjon(3, 5);

console.log(resultat);`,
      output: `8`,
      tip: "Bruk return når funksjonen skal gi tilbake en verdi som kan brukes senere.",
    },

    {
      title: "Arrow functions",
      content:
        "Arrow functions er en kortere måte å skrive funksjoner på. De brukes mye i moderne JavaScript og React.",
      code: `const hei = (navn) => {
  console.log("Hei " + navn);
};

hei("Julie");`,
      output: `Hei Julie`,
      note:
        "Du kommer til å bruke arrow functions veldig mye når vi begynner med React.",
    },

    {
      title: "Kort arrow function",
      content:
        "Hvis funksjonen bare returnerer én verdi, kan den skrives enda kortere.",
      code: `const kvadrat = (x) => x * x;

console.log(kvadrat(4));`,
      output: `16`,
    },

    {
      title: "Oppsummering",
      content:
        "Funksjoner gjør koden ryddigere og enklere å gjenbruke. I moderne JavaScript brukes ofte arrow functions, spesielt i React.",
    },
  ],
};