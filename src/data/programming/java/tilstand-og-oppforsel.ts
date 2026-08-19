import type { ProgrammingLesson } from "../../../types/programming";

export const javaStateAndBehavior: ProgrammingLesson = {
  id: "tilstand-og-oppforsel",
  title: "Tilstand og oppførsel",

  sections: [
    {
      title: "Hva betyr tilstand og oppførsel?",
      content:
        "Et objekt i Java har både tilstand og oppførsel. Tilstanden er verdiene objektet lagrer i variablene sine. Oppførselen er det objektet kan gjøre gjennom metodene sine.",
    },
    {
      title: "Tilstand",
      content:
        "Tilstanden til et objekt består av verdiene til alle attributtene eller feltene i objektet. Hvis et objekt for eksempel lagrer en tellerverdi og en sluttverdi, er disse verdiene en del av objektets tilstand.",
      code: `public class Counter {
  int end;
  int counter = 0;
}`,
      note: "Her er counter og end en del av tilstanden til hvert Counter-objekt.",
    },
    {
      title: "Oppførsel",
      content:
        "Oppførselen til et objekt bestemmes av metodene. Metoder kan lese tilstanden, returnere informasjon eller endre tilstanden.",
      code: `int getCounter() {
  return counter;
}

void count() {
  if (counter < end) {
    counter = counter + 1;
  }
}`,
      note: "getCounter() leser tilstanden uten å endre den. count() kan derimot endre verdien til counter.",
    },
    {
      title: "Et komplett Counter-eksempel",
      content:
        "Counter-objektet lagrer en sluttverdi og en teller. Hver gang count() kalles, økes telleren med 1 så lenge sluttverdien ikke er nådd.",
      code: `public class Counter {
  int end;
  int counter = 0;

  Counter(int end) {
    this.end = end;
  }

  int getCounter() {
    return counter;
  }

  void count() {
    if (counter < end) {
      counter = counter + 1;
    }
  }
}`,
    },
    {
      title: "Hvordan endrer tilstanden seg?",
      content:
        "Hvis vi lager et Counter-objekt med sluttverdi 3, starter counter på 0. Hver gang count() kalles, går objektet over til en ny tilstand.",
      code: `Counter counter = new Counter(3);

System.out.println(counter.getCounter());

counter.count();
System.out.println(counter.getCounter());

counter.count();
System.out.println(counter.getCounter());`,
      output: `0
1
2`,
      tip: "Tenk på samme objekt som noe som kan være i forskjellige tilstander over tid. Objektet er det samme, men verdiene inni objektet endrer seg.",
    },
    {
      title: "Metoder som leser og metoder som endrer",
      content:
        "Noen metoder leser bare objektets tilstand, mens andre endrer den. Dette skillet er viktig når du prøver å forstå hva en klasse gjør.",
      code: `int getCounter() {
  return counter;
}

void count() {
  counter = counter + 1;
}`,
      note: "getCounter() observerer tilstanden. count() endrer tilstanden.",
    },
    {
      title: "Argumenter kan påvirke oppførselen",
      content:
        "En metode kan ta inn argumenter som bestemmer hvordan tilstanden skal endres. Her bestemmer inc hvor mye telleren skal økes.",
      code: `void count(int inc) {
  counter = counter + inc;
}`,
    },
    {
      title: "Ulovlige operasjoner",
      content:
        "Noen operasjoner bør bare være lovlige i bestemte tilstander. Hvis telleren allerede har nådd sluttverdien, kan vi for eksempel velge å kaste et unntak.",
      code: `void count(int inc) {
  if (counter >= end) {
    throw new IllegalStateException(
      "Cannot increment counter when limit has been reached"
    );
  }

  counter = counter + inc;

  if (counter >= end) {
    counter = end;
  }
}`,
      warning:
        "IllegalStateException betyr at selve metodekallet ikke er lovlig i objektets nåværende tilstand.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du leser en Java-klasse, kan du stille to spørsmål: Hvilke verdier lagrer objektet? Og hvilke metoder kan lese eller endre disse verdiene? Da finner du objektets tilstand og oppførsel.",
    },
    {
      title: "Kort oppsummert",
      content:
        "Tilstand er dataene objektet lagrer. Oppførsel er hva objektet kan gjøre med disse dataene. Metoder kan enten lese tilstanden eller endre den, og hvilke metodekall som er lovlige kan avhenge av hvilken tilstand objektet er i.",
      tip: "Når du ser en ny klasse i IT1901, start med å finne feltene og metodene. Da får du raskt oversikt over hva objektet husker og hva det kan gjøre.",
    },
  ],
};
