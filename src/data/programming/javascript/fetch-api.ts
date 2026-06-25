import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptFetchApi: ProgrammingLesson = {
  id: "fetch-api",
  title: "Fetch API",

  sections: [
    {
      title: "Hva er Fetch API?",
      content:
        "Fetch API brukes til å hente eller sende data over internett. Det brukes ofte når en nettside kommuniserer med en server eller et API.",
    },

    {
      title: "Hente data",
      content:
        "fetch() sender en forespørsel til en URL og returnerer et Promise.",
      code: `async function hentData() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  const data = await response.json();

  console.log(data);
}

hentData();`,
      output: `[ { ... }, { ... }, ... ]`,
      tip:
        "response.json() gjør om JSON-data til vanlige JavaScript-objekter.",
    },

    {
      title: "POST-request",
      content:
        "Du kan også sende data til en server med en POST-request.",
      code: `await fetch("https://example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    navn: "Julie",
  }),
});`,
      note:
        "POST brukes når du vil opprette nye data på serveren.",
    },

    {
      title: "Håndtere feil",
      content:
        "Bruk try/catch for å håndtere feil som kan oppstå når du henter data.",
      code: `async function hentData() {
  try {
    const response = await fetch(
      "https://example.com"
    );

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.log("Noe gikk galt.");
  }
}`,
      output: `Noe gikk galt.`,
      warning:
        "Nettverksfeil kan alltid oppstå. Derfor bør fetch-kall som regel ligge i en try/catch-blokk.",
    },

    {
      title: "Oppsummering",
      content:
        "Fetch API brukes til å hente og sende data. Sammen med async og await er det en av de viktigste delene av moderne JavaScript.",
    },
  ],
};