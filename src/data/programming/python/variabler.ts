export const pythonVariables = {
  id: "variabler",
  title: "Variabler",

  sections: [
    {
      title: "Hva er en variabel?",
      content:
        "En variabel brukes til å lagre informasjon som du kan bruke senere i programmet. Du kan tenke på en variabel som en boks med et navn.",
    },
    {
      title: "Lage variabler",
      content:
        "I Python lager du en variabel ved å skrive et navn, likhetstegn og verdien du vil lagre.",
      code: `navn = "Julie"
alder = 19
er_student = True`,
    },
    {
      title: "Bruke variabler",
      content:
        "Når en verdi er lagret i en variabel, kan du bruke variabelnavnet senere i koden.",
      code: `navn = "Julie"

print(navn)`,
    },
    {
      title: "Endre verdi",
      content:
        "Du kan endre verdien til en variabel ved å gi den en ny verdi senere i koden.",
      code: `alder = 19
alder = 20

print(alder)`,
    },
    {
      title: "Navneregler",
      content:
        "Variabelnavn bør være tydelige. Bruk små bokstaver og understrek mellom ord. Ikke start med tall.",
      code: `fornavn = "Julie"
favoritt_farge = "rosa"

# Dårligere navn:
x = "Julie"
ff = "rosa"`,
    },
    {
      title: "Oppsummering",
      content:
        "Variabler brukes til å lagre verdier. De gjør at programmet kan huske og gjenbruke informasjon.",
    },
  ],
};
