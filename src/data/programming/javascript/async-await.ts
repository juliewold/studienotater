import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptAsyncAwait: ProgrammingLesson = {
  id: "async-await",
  title: "Async / Await",

  sections: [
    {
      title: "Hva er asynkron kode?",
      content:
        "Normalt kjører JavaScript én linje om gangen. Noen oppgaver, som å hente data fra internett, tar tid. Da brukes asynkron kode slik at programmet ikke stopper opp mens det venter.",
    },

    {
      title: "Async",
      content:
        "Et async-nøkkelord forteller at en funksjon er asynkron og kan bruke await.",
      code: `async function hentData() {
  console.log("Henter data...");
}`,
      output: `Henter data...`,
    },

    {
      title: "Await",
      content:
        "await gjør at JavaScript venter på at en asynkron operasjon skal bli ferdig før koden fortsetter.",
      code: `async function hentData() {
  const resultat = await Promise.resolve("Ferdig!");

  console.log(resultat);
}

hentData();`,
      output: `Ferdig!`,
      tip: "await kan bare brukes inne i en async-funksjon.",
    },

    {
      title: "Hvorfor bruke async/await?",
      content:
        "Async/await gjør asynkron kode enklere å lese enn lange kjeder med .then().",
      code: `async function hentTall() {
  const tall = await Promise.resolve(42);

  console.log(tall);
}

hentTall();`,
      output: `42`,
    },

    {
      title: "Vanlig feil",
      content:
        "await kan ikke brukes utenfor en async-funksjon.",
      code: `const data = await Promise.resolve("Hei");`,
      warning:
        "Denne koden gir en feil fordi await må brukes inne i en async-funksjon.",
    },

    {
      title: "Oppsummering",
      content:
        "Async og await brukes for å skrive asynkron kode på en ryddig og lettlest måte. Du kommer til å bruke dette sammen med fetch() når du henter data fra API-er.",
    },
  ],
};