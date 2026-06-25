import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptOperators: ProgrammingLesson = {
  id: "operatorer",
  title: "Operatorer",

  sections: [
    {
      title: "Hva er operatorer?",
      content:
        "Operatorer brukes til å gjøre beregninger, sammenligne verdier og kombinere betingelser.",
    },
    {
      title: "Aritmetiske operatorer",
      content: "Disse brukes til vanlige regneoperasjoner.",
      code: `console.log(10 + 5);
console.log(10 - 5);
console.log(10 * 5);
console.log(10 / 5);`,
      output: `15
5
50
2`,
    },
    {
      title: "Restoperator (%)",
      content:
        "% gir resten etter en divisjon. Den brukes ofte til å sjekke om et tall er partall eller oddetall.",
      code: `console.log(10 % 3);
console.log(8 % 2);`,
      output: `1
0`,
      tip: "Hvis tall % 2 blir 0, er tallet partall.",
    },
    {
      title: "Sammenligningsoperatorer",
      content:
        "Sammenligningsoperatorer returnerer true eller false.",
      code: `console.log(5 > 3);
console.log(5 < 3);
console.log(5 === 5);
console.log(5 !== 3);`,
      output: `true
false
true
true`,
    },
    {
      title: "=== og !==",
      content:
        "I moderne JavaScript bør du vanligvis bruke === og !== for å sammenligne verdier.",
      code: `console.log(5 === "5");
console.log(5 == "5");`,
      output: `false
true`,
      warning:
        "== prøver å konvertere verdier før sammenligning. Derfor kan det gi overraskende resultater. Bruk === som standard.",
    },
    {
      title: "Logiske operatorer",
      content:
        "Logiske operatorer brukes til å kombinere betingelser.",
      code: `const alder = 19;
const harBillett = true;

console.log(alder >= 18 && harBillett);
console.log(alder < 18 || harBillett);
console.log(!harBillett);`,
      output: `true
true
false`,
    },
    {
      title: "Oppsummering",
      content:
        "Operatorer brukes til regning, sammenligning og logikk. Bruk === og !== som standard når du sammenligner verdier i JavaScript.",
    },
  ],
};