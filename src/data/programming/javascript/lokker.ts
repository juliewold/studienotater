import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptLoops: ProgrammingLesson = {
  id: "lokker",
  title: "Løkker",

  sections: [
    {
      title: "Hva er en løkke?",
      content:
        "Løkker brukes når du vil kjøre den samme koden flere ganger uten å skrive den på nytt.",
    },

    {
      title: "for-løkke",
      content:
        "En for-løkke brukes når du vet hvor mange ganger koden skal kjøres.",
      code: `for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
      output: `0
1
2
3
4`,
      tip: "Variabelen i starter ofte på 0 og økes med 1 for hver runde.",
    },

    {
      title: "while-løkke",
      content:
        "En while-løkke kjører så lenge betingelsen er true.",
      code: `let i = 0;

while (i < 5) {
  console.log(i);
  i++;
}`,
      output: `0
1
2
3
4`,
      warning:
        "Husk å oppdatere betingelsen. Hvis ikke kan du få en uendelig løkke.",
    },

    {
      title: "for...of",
      content:
        "for...of brukes til å gå gjennom alle verdiene i en array.",
      code: `const frukter = ["eple", "banan", "appelsin"];

for (const frukt of frukter) {
  console.log(frukt);
}`,
      output: `eple
banan
appelsin`,
      tip: "for...of er ofte enklere å lese enn en vanlig for-løkke når du bare trenger verdiene.",
    },

    {
      title: "break",
      content:
        "break avslutter løkken med en gang.",
      code: `for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break;
  }

  console.log(i);
}`,
      output: `0
1
2
3
4`,
    },

    {
      title: "continue",
      content:
        "continue hopper over resten av den aktuelle runden og fortsetter med neste.",
      code: `for (let i = 0; i < 5; i++) {
  if (i === 2) {
    continue;
  }

  console.log(i);
}`,
      output: `0
1
3
4`,
    },

    {
      title: "Oppsummering",
      content:
        "Bruk for når du vet hvor mange ganger du skal gjenta noe, while når du ikke vet det på forhånd, og for...of når du skal gå gjennom en array.",
    },
  ],
};