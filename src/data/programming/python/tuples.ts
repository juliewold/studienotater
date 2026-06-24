export const pythonTuples = {
  id: "tuples",
  title: "Tuples",

  sections: [
    {
      title: "Hva er en tuple?",
      content:
        "En tuple ligner på en liste, men kan ikke endres etter at den er opprettet. Tuples brukes når data skal være faste.",
    },

    {
      title: "Opprette en tuple",
      content:
        "Tuples skrives med parenteser.",
      code: `koordinat = (10, 20)

print(koordinat)`,
      output: `(10, 20)`,
    },

    {
      title: "Hente elementer",
      content:
        "På samme måte som lister kan vi hente elementer med indekser.",
      code: `koordinat = (10, 20)

print(koordinat[0])
print(koordinat[1])`,
      output: `10
20`,
    },

    {
      title: "Tuples kan ikke endres",
      content:
        "I motsetning til lister kan du ikke endre verdier i en tuple.",
      code: `koordinat = (10, 20)

# Gir feil:
# koordinat[0] = 15`,
    },

    {
      title: "Hvorfor bruke tuples?",
      content:
        "Tuples er nyttige når data ikke skal endres, for eksempel koordinater, datoer eller faste innstillinger.",
    },

    {
      title: "Tuple unpacking",
      content:
        "Du kan pakke ut verdiene i en tuple til flere variabler samtidig.",
      code: `koordinat = (10, 20)

x, y = koordinat

print(x)
print(y)`,
      output: `10
20`,
    },

    {
      title: "Oppsummering",
      content:
        "En tuple er som en liste som ikke kan endres. Den bruker indekser på samme måte som lister, men er immutable.",
    },
  ],
};