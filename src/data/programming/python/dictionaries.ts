export const pythonDictionaries = {
  id: "dictionaries",
  title: "Dictionaries",

  sections: [
    {
      title: "Hva er et dictionary?",
      content:
        "Et dictionary lagrer data som nøkkel-verdi-par. I stedet for å hente verdier med indekser som i lister, bruker vi nøkler.",
    },

    {
      title: "Opprette et dictionary",
      content:
        "Et dictionary skrives med krøllparenteser. Hver nøkkel kobles til en verdi med kolon.",
      code: `student = {
    "navn": "Julie",
    "alder": 19,
    "studie": "Datateknologi"
}

print(student)`,
      output: `{'navn': 'Julie', 'alder': 19, 'studie': 'Datateknologi'}`,
    },

    {
      title: "Hente en verdi",
      content:
        "For å hente en verdi bruker vi nøkkelen i hakeparenteser.",
      code: `student = {
    "navn": "Julie",
    "alder": 19
}

print(student["navn"])`,
      output: `Julie`,
    },

    {
      title: "Legge til nye verdier",
      content:
        "Du kan legge til nye nøkkel-verdi-par ved å bruke en ny nøkkel.",
      code: `student = {
    "navn": "Julie"
}

student["alder"] = 19

print(student)`,
      output: `{'navn': 'Julie', 'alder': 19}`,
    },

    {
      title: "Endre eksisterende verdier",
      content:
        "Hvis nøkkelen allerede finnes, blir verdien oppdatert.",
      code: `student = {
    "navn": "Julie",
    "alder": 19
}

student["alder"] = 20

print(student)`,
      output: `{'navn': 'Julie', 'alder': 20}`,
    },

    {
      title: "Fjerne verdier",
      content:
        "del brukes til å fjerne et nøkkel-verdi-par.",
      code: `student = {
    "navn": "Julie",
    "alder": 19
}

del student["alder"]

print(student)`,
      output: `{'navn': 'Julie'}`,
    },

    {
      title: "Gå gjennom et dictionary",
      content:
        "items() lar oss hente både nøkkel og verdi i en løkke.",
      code: `student = {
    "navn": "Julie",
    "alder": 19
}

for nøkkel, verdi in student.items():
    print(nøkkel, verdi)`,
      output: `navn Julie
alder 19`,
    },

    {
      title: "Hvorfor bruke dictionaries?",
      content:
        "Dictionaries er nyttige når data har navn. Det er lettere å skrive student['navn'] enn student[0]. De brukes mye i webutvikling, API-er og databaser.",
    },

    {
      title: "Oppsummering",
      content:
        "Et dictionary lagrer nøkkel-verdi-par. Du kan hente, legge til, endre og fjerne verdier ved hjelp av nøklene.",
    },
  ],
};