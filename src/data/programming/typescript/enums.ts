import type { ProgrammingLesson } from "../../../types/programming";

export const typescriptEnums: ProgrammingLesson = {
  id: "enums",
  title: "Enums",

  sections: [
    {
      title: "Hva er et enum?",
      content:
        "Et enum brukes når en verdi bare kan være én av et fast sett med alternativer. Det gjør koden mer lesbar og reduserer skrivefeil.",
    },

    {
      title: "Lage et enum",
      content:
        "Et enum opprettes med nøkkelordet enum.",
      code: `enum Farge {
  Rød,
  Grønn,
  Blå,
}

console.log(Farge.Rød);`,
      output: `0`,
      note:
        "Hvis du ikke angir verdier selv, starter TypeScript på 0 og teller opp.",
    },

    {
      title: "Egne verdier",
      content:
        "Du kan også gi enum-medlemmene egne verdier.",
      code: `enum Rolle {
  Admin = "admin",
  Bruker = "bruker",
}

console.log(Rolle.Admin);`,
      output: `admin`,
      tip:
        "String-enums er ofte enklere å lese enn nummererte enums.",
    },

    {
      title: "Bruke et enum",
      content:
        "Enums kan brukes som type på variabler og parametere.",
      code: `enum Rolle {
  Admin = "admin",
  Bruker = "bruker",
}

function loggInn(rolle: Rolle) {
  console.log(rolle);
}

loggInn(Rolle.Admin);`,
      output: `admin`,
    },

    {
      title: "Når bør du bruke enums?",
      content:
        "Enums passer godt når en verdi bare kan ha noen få faste alternativer.",
      warning:
        "I moderne TypeScript brukes ofte union types i stedet for enums. Du kommer til å se begge deler i eksisterende kode.",
    },

    {
      title: "Oppsummering",
      content:
        "Enums samler faste verdier under ett navn. De gjør koden enklere å lese og reduserer risikoen for skrivefeil.",
    },
  ],
};