export const pythonFiles = {
  id: "filer",
  title: "Filer",

  sections: [
    {
      title: "Hvorfor bruke filer?",
      content:
        "Variabler forsvinner når programmet avsluttes. Filer brukes når du vil lagre data permanent på datamaskinen.",
    },

    {
      title: "Åpne en fil",
      content:
        "open() brukes for å åpne en fil.",
      code: `fil = open("tekst.txt", "r")`,
    },

    {
      title: "Lese en hel fil",
      content:
        "read() leser alt innholdet i filen.",
      code: `fil = open("tekst.txt", "r")

innhold = fil.read()

print(innhold)

fil.close()`,
      output: `Hei
Dette er innholdet i filen.`,
    },

    {
      title: "Skrive til en fil",
      content:
        "w betyr write. Hvis filen ikke finnes opprettes den.",
      code: `fil = open("tekst.txt", "w")

fil.write("Hei verden!")

fil.close()`,
    },

    {
      title: "Legge til tekst",
      content:
        "a betyr append og legger til tekst bakerst i filen.",
      code: `fil = open("tekst.txt", "a")

fil.write("\\nNy linje")

fil.close()`,
    },

    {
      title: "with open()",
      content:
        "Dette er den anbefalte måten å jobbe med filer på. Python lukker filen automatisk.",
      code: `with open("tekst.txt", "r") as fil:
    innhold = fil.read()

print(innhold)`,
      output: `Hei verden!`,
    },

    {
      title: "Vanlige moduser",
      content:
        "Når du åpner filer må du velge modus.",
      code: `r  # read
w  # write
a  # append`,
    },

    {
      title: "Oppsummering",
      content:
        "Filer brukes til å lagre data permanent. open() åpner filer, read() leser innhold, write() skriver innhold, og with open() er den anbefalte måten å arbeide med filer på.",
    },
  ],
};