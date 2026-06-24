export const pythonFunctions = {
  id: "funksjoner",
  title: "Funksjoner",

  sections: [
    {
      title: "Hva er en funksjon?",
      content:
        "En funksjon er en blokk med kode som kan gjenbrukes. I stedet for å skrive den samme koden flere ganger, kan du samle den i en funksjon og kalle den når du trenger den.",
    },

    {
      title: "Lage en funksjon",
      content:
        "Funksjoner opprettes med nøkkelordet def.",
      code: `def hei():
    print("Hei!")

hei()`,
    },

    {
      title: "Parametere",
      content:
        "Parametere lar deg sende inn informasjon til funksjonen.",
      code: `def hei(navn):
    print("Hei", navn)

hei("Julie")
hei("Ola")`,
    },

    {
      title: "Flere parametere",
      content:
        "En funksjon kan ta imot flere verdier samtidig.",
      code: `def addisjon(a, b):
    print(a + b)

addisjon(3, 5)`,
    },

    {
      title: "Return",
      content:
        "return sender en verdi tilbake fra funksjonen.",
      code: `def addisjon(a, b):
    return a + b

sum = addisjon(3, 5)

print(sum)`,
    },

    {
      title: "Lokal variabel",
      content:
        "Variabler som opprettes inni en funksjon finnes bare inni funksjonen.",
      code: `def test():
    melding = "Hei"

test()

# melding finnes ikke her`,
    },

    {
      title: "Standardverdier",
      content:
        "Parametere kan få standardverdier.",
      code: `def hei(navn="student"):
    print("Hei", navn)

hei()
hei("Julie")`,
    },

    {
      title: "Hvorfor bruke funksjoner?",
      content:
        "Funksjoner gjør koden mer ryddig, lettere å lese og enklere å gjenbruke.",
    },

    {
      title: "Oppsummering",
      content:
        "Funksjoner opprettes med def. Parametere brukes til input, og return brukes når funksjonen skal sende tilbake en verdi.",
    },
  ],
};