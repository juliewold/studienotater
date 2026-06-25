import type { ProgrammingLesson } from "../../../types/programming";

export const javascriptIfStatements: ProgrammingLesson = {
  id: "if-setninger",
  title: "If-setninger",

  sections: [
    {
      title: "Hva er en if-setning?",
      content:
        "En if-setning lar programmet ta ulike valg avhengig av om en betingelse er sann eller usann.",
    },

    {
      title: "Enkel if",
      content:
        "Koden inni if-blokken kjører bare hvis betingelsen er true.",
      code: `const alder = 19;

if (alder >= 18) {
  console.log("Du er myndig");
}`,
      output: `Du er myndig`,
    },

    {
      title: "if og else",
      content:
        "else kjører når betingelsen i if ikke er oppfylt.",
      code: `const alder = 16;

if (alder >= 18) {
  console.log("Du er myndig");
} else {
  console.log("Du er ikke myndig");
}`,
      output: `Du er ikke myndig`,
    },

    {
      title: "if, else if og else",
      content:
        "Du kan teste flere betingelser etter hverandre med else if.",
      code: `const karakter = "C";

if (karakter === "A") {
  console.log("Veldig bra!");
} else if (karakter === "B") {
  console.log("Bra!");
} else {
  console.log("Fortsett å øve!");
}`,
      output: `Fortsett å øve!`,
    },

    {
      title: "Logiske operatorer",
      content:
        "Du kan kombinere flere betingelser med && (og) og || (eller).",
      code: `const alder = 19;
const harBillett = true;

if (alder >= 18 && harBillett) {
  console.log("Velkommen inn!");
}`,
      output: `Velkommen inn!`,
      tip: "&& betyr at begge betingelsene må være sanne.",
    },

    {
      title: "Vanlig feil",
      content:
        "Bruk === når du sammenligner verdier.",
      code: `const alder = 18;

if (alder === 18) {
  console.log("Riktig!");
}`,
      output: `Riktig!`,
      warning:
        "Ikke bruk = i en if-setning. = brukes til å tildele en verdi, mens === brukes til å sammenligne.",
    },

    {
      title: "Oppsummering",
      content:
        "If-setninger gjør at programmet kan ta beslutninger. Bruk if, else og else if sammen med sammenlignings- og logiske operatorer.",
    },
  ],
};