import type { ProgrammingLesson } from "../../../types/programming";

export const pythonClasses: ProgrammingLesson = {
  id: "klasser",
  title: "Klasser",

  sections: [
    {
      title: "Hva er en klasse?",
      content:
        "En klasse er en mal for å lage objekter. Objekter kan ha egne verdier (attributter) og egne funksjoner (metoder).",
    },

    {
      title: "Lage en klasse",
      content:
        "Klasser opprettes med nøkkelordet class.",
      code: `class Student:
    pass`,
    },

    {
      title: "Konstruktøren (__init__)",
      content:
        "Konstruktøren kjøres når et nytt objekt opprettes. Den brukes til å lagre informasjon om objektet.",
      code: `class Student:
    def __init__(self, navn, alder):
        self.navn = navn
        self.alder = alder`,
    },

    {
      title: "Opprette et objekt",
      content:
        "Et objekt lages ved å kalle klassen som en funksjon.",
      code: `class Student:
    def __init__(self, navn, alder):
        self.navn = navn
        self.alder = alder

student1 = Student("Julie", 19)

print(student1.navn)`,
      output: `Julie`,
    },

    {
      title: "Attributter",
      content:
        "Attributter er verdier som tilhører objektet.",
      code: `class Student:
    def __init__(self, navn, alder):
        self.navn = navn
        self.alder = alder

student1 = Student("Julie", 19)

print(student1.alder)`,
      output: `19`,
    },

    {
      title: "Metoder",
      content:
        "Metoder er funksjoner som tilhører en klasse.",
      code: `class Student:
    def __init__(self, navn):
        self.navn = navn

    def hei(self):
        print("Hei, jeg heter", self.navn)

student1 = Student("Julie")

student1.hei()`,
      output: `Hei, jeg heter Julie`,
    },

    {
      title: "Flere objekter",
      content:
        "Hvert objekt har sine egne verdier.",
      code: `student1 = Student("Julie")
student2 = Student("Ola")

print(student1.navn)
print(student2.navn)`,
      output: `Julie
Ola`,
    },

    {
      title: "Hvorfor bruke klasser?",
      content:
        "Klasser gjør det lettere å organisere større programmer. De brukes mye i spill, webutvikling, GUI-programmer og backend-utvikling.",
    },

    {
      title: "Oppsummering",
      content:
        "En klasse er en mal for objekter. __init__ brukes til å opprette attributter, og metoder brukes til å gi objektene funksjonalitet.",
    },
  ],
};