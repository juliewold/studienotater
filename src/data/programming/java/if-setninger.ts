import type { ProgrammingLesson } from "../../../types/programming";

export const javaIfStatements: ProgrammingLesson = {
  id: "if-setninger",
  title: "If-setninger",

  sections: [
    {
      title: "Hva er en if-setning?",
      content:
        "En if-setning lar programmet ta valg. Koden inne i if-blokken kjøres bare dersom betingelsen er true.",
    },
    {
      title: "Grunnleggende syntaks",
      content:
        "Betingelsen skrives mellom parenteser etter if. Hvis betingelsen er true, kjøres koden mellom krøllparentesene.",
      code: `int age = 20;

if (age >= 18) {
  System.out.println("Du er myndig");
}`,
      output: `Du er myndig`,
      note: "Uttrykket age >= 18 gir enten true eller false. Her blir det true, så koden inne i blokken kjøres.",
    },
    {
      title: "Når betingelsen er false",
      content: "Hvis betingelsen er false, hopper Java over hele if-blokken.",
      code: `int age = 16;

if (age >= 18) {
  System.out.println("Du er myndig");
}

System.out.println("Programmet fortsetter");`,
      output: `Programmet fortsetter`,
    },
    {
      title: "else",
      content:
        "else brukes når vi vil kjøre annen kode dersom if-betingelsen er false.",
      code: `int age = 16;

if (age >= 18) {
  System.out.println("Du er myndig");
} else {
  System.out.println("Du er under 18");
}`,
      output: `Du er under 18`,
      note: "Nøyaktig én av blokkene kjøres: enten if-blokken eller else-blokken.",
    },
    {
      title: "else if",
      content:
        "Når vi har flere mulige tilfeller, kan vi bruke else if. Java tester betingelsene ovenfra og ned og stopper ved den første som er true.",
      code: `int score = 82;

if (score >= 90) {
  System.out.println("A");
} else if (score >= 80) {
  System.out.println("B");
} else if (score >= 70) {
  System.out.println("C");
} else {
  System.out.println("Lavere enn C");
}`,
      output: `B`,
      tip: "Rekkefølgen betyr noe. Test ofte de strengeste eller høyeste grensene først.",
    },
    {
      title: "Hvorfor rekkefølgen betyr noe",
      content:
        "I en if/else if-kjede stopper Java ved første sanne betingelse. Derfor kan feil rekkefølge gi feil resultat.",
      code: `int score = 95;

if (score >= 70) {
  System.out.println("C eller bedre");
} else if (score >= 90) {
  System.out.println("A");
}`,
      output: `C eller bedre`,
      warning:
        "Den andre betingelsen blir aldri undersøkt når score er 95, fordi score >= 70 allerede er true.",
    },
    {
      title: "Kombinere flere betingelser",
      content:
        "Med && og || kan en if-setning kontrollere flere ting samtidig.",
      code: `int age = 20;
boolean hasTicket = true;

if (age >= 18 && hasTicket) {
  System.out.println("Du kan komme inn");
}`,
      output: `Du kan komme inn`,
      note: "Med && må begge betingelsene være true.",
    },
    {
      title: "Bruke ||",
      content: "Med || holder det at minst én av betingelsene er true.",
      code: `boolean isAdmin = false;
boolean isOwner = true;

if (isAdmin || isOwner) {
  System.out.println("Du kan redigere");
}`,
      output: `Du kan redigere`,
    },
    {
      title: "Boolean trenger ikke == true",
      content:
        "Hvis du allerede har en boolean-variabel, kan den brukes direkte som betingelse.",
      code: `boolean loggedIn = true;

if (loggedIn) {
  System.out.println("Velkommen!");
}`,
      output: `Velkommen!`,
      tip: "if (loggedIn) er enklere og mer vanlig enn if (loggedIn == true).",
    },
    {
      title: "Teste det motsatte med !",
      content:
        "! snur en boolean-verdi. Derfor kan !loggedIn leses som «ikke innlogget».",
      code: `boolean loggedIn = false;

if (!loggedIn) {
  System.out.println("Du må logge inn");
}`,
      output: `Du må logge inn`,
    },
    {
      title: "Nøstede if-setninger",
      content:
        "En if-setning kan ligge inne i en annen if-setning. Dette kalles nesting.",
      code: `boolean loggedIn = true;
boolean isAdmin = true;

if (loggedIn) {
  System.out.println("Innlogget");

  if (isAdmin) {
    System.out.println("Administrator");
  }
}`,
      output: `Innlogget
Administrator`,
      tip: "Nesting er noen ganger nyttig, men mange nivåer med nøstede if-setninger kan gjøre koden vanskelig å lese.",
    },
    {
      title: "Sammenligne String",
      content:
        "Når du vil sammenligne innholdet i String-objekter, bruker du vanligvis equals().",
      code: `String language = "Java";

if (language.equals("Java")) {
  System.out.println("Vi lærer Java");
}`,
      output: `Vi lærer Java`,
      warning:
        "Ikke bruk == når du egentlig vil undersøke om to String-objekter inneholder samme tekst.",
    },
    {
      title: "if kan brukes til å endre tilstand",
      content:
        "If-setninger brukes ofte inne i metoder for å bestemme om et objekt skal endre tilstanden sin. Dette er akkurat det Counter-klassen gjør.",
      code: `void count() {
  if (counter < end) {
    counter++;
  }
}`,
      note: "counter endres bare dersom counter < end er true. Dette kobler if-setninger direkte til tilstand og oppførsel i objekter.",
    },
    {
      title: "Tidlig return",
      content:
        "En metode kan bruke return for å avslutte tidlig dersom en betingelse er oppfylt. Dette kan gjøre koden enklere å lese.",
      code: `void printAccess(boolean loggedIn) {
  if (!loggedIn) {
    System.out.println("Ingen tilgang");
    return;
  }

  System.out.println("Velkommen");
}`,
      note: "Hvis loggedIn er false, avsluttes metoden ved return. Resten av metoden kjøres ikke.",
    },
    {
      title: "Vanlig feil: semikolon etter if",
      content:
        "Det skal normalt ikke stå semikolon rett etter betingelsen til en if-setning.",
      code: `// Feil:
if (age >= 18); {
  System.out.println("Myndig");
}

// Riktig:
if (age >= 18) {
  System.out.println("Myndig");
}`,
      warning:
        "Et semikolon avslutter setningen. Da tilhører ikke blokken if-setningen slik du sannsynligvis hadde tenkt.",
    },
    {
      title: "Eksempel: tilgang til et system",
      content:
        "Her kombinerer vi flere av konseptene for å bestemme hvilken tilgang en bruker skal få.",
      code: `boolean loggedIn = true;
boolean isAdmin = false;
int age = 20;

if (!loggedIn) {
  System.out.println("Logg inn først");
} else if (isAdmin) {
  System.out.println("Administrator");
} else if (age >= 18) {
  System.out.println("Vanlig bruker");
} else {
  System.out.println("Begrenset tilgang");
}`,
      output: `Vanlig bruker`,
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du møter en if-setning, evaluer betingelsen til true eller false. Følg deretter bare grenen som faktisk kjøres. I en if/else if/else-kjede velges den første betingelsen som er true.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne skrive if, else if og else, kombinere betingelser med &&, || og !, bruke boolean-variabler direkte og forstå hvilken gren av koden som kjøres. Du bør også kunne lese en if-setning og følge programflyten steg for steg.",
      tip: "Når en if-setning blir komplisert, skriv ned verdiene til variablene og avgjør hver delbetingelse separat som true eller false.",
    },
  ],
};
