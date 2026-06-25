import type { ProgrammingLesson } from "../../../types/programming";

export const pythonDataTypes: ProgrammingLesson = {
  id: "datatyper",
  title: "Datatyper",

  sections: [
    {
      title: "Hva er en datatype?",
      content:
        "En datatype beskriver hvilken type verdi en variabel inneholder. Python bruker ulike datatyper for tekst, tall, sann/usann-verdier og mye mer.",
    },

    {
      title: "String (tekst)",
      content:
        "Strings brukes til å lagre tekst. Tekst skrives mellom anførselstegn.",
      code: `navn = "Julie"
by = 'Trondheim'

print(navn)`,
output: `Julie`
    },

    {
      title: "Integer (heltall)",
      content:
        "Integers er hele tall uten desimaler.",
      code: `alder = 19
antall_studenter = 250

print(alder)`,
output: `19`
    },

    {
      title: "Float (desimaltall)",
      content:
        "Floats brukes når tallet har desimaler.",
      code: `pi = 3.14159
temperatur = 21.5

print(pi)`,
output: `3.14159`
    },

    {
      title: "Boolean (True/False)",
      content:
        "Booleans representerer sannhetsverdier. De brukes mye i if-setninger.",
      code: `er_student = True
har_bestatt = False

print(er_student)`,
output: `True`
    },

    {
      title: "Finne datatype med type()",
      content:
        "Du kan bruke type() for å sjekke hvilken datatype en verdi har.",
      code: `navn = "Julie"
alder = 19

print(type(navn))
print(type(alder))`,
output: `<class 'str'>
<class 'int'>`
    },

    {
      title: "Konvertering mellom datatyper",
      content:
        "Noen ganger må du gjøre om en datatype til en annen.",
      code: `alder = "19"

alder_tall = int(alder)

print(alder_tall)
print(type(alder_tall))`,
output: `19
<class 'int'>`
    },

    {
      title: "Vanlige konverteringsfunksjoner",
      content:
        "Python har flere innebygde funksjoner for å konvertere datatyper.",
      code: `str(10)
int("25")
float("3.14")
bool(1)`,
    },

    {
      title: "Oppsummering",
      content:
        "De viktigste datatypene i Python er string (tekst), integer (heltall), float (desimaltall) og boolean (True/False). type() brukes til å undersøke datatyper, og funksjoner som int(), str() og float() brukes til konvertering.",
    },
  ],
};