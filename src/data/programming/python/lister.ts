export const pythonLists = {
  id: "lister",
  title: "Lister",

  sections: [
    {
      title: "Hva er en liste?",
      content:
        "En liste brukes til å lagre flere verdier i én variabel. I stedet for å lage mange separate variabler kan vi samle verdiene i en liste.",
    },

    {
      title: "Opprette en liste",
      content:
        "Lister skrives med hakeparenteser. Her lager vi en liste som inneholder tre frukter.",
      code: `frukter = ["eple", "banan", "appelsin"]

print(frukter)`,
      output: `['eple', 'banan', 'appelsin']`,
    },

    {
      title: "Hente elementer",
      content:
        "Elementene i en liste har en indeks. Den første verdien har indeks 0, den andre har indeks 1 osv. I eksemplet under skriver Python ut 'eple' og deretter 'banan'.",
      code: `frukter = ["eple", "banan", "appelsin"]

print(frukter[0])
print(frukter[1])`,
      output: `eple
banan`,
    },

    {
      title: "Hente siste element",
      content:
        "Du kan bruke -1 for å hente det siste elementet i listen.",
      code: `frukter = ["eple", "banan", "appelsin"]

print(frukter[-1])`,
      output: `appelsin`,
    },

    {
      title: "Endre elementer",
      content:
        "Du kan endre et element ved å bruke indeksen. Her bytter vi ut 'banan' med 'pære'.",
      code: `frukter = ["eple", "banan", "appelsin"]

frukter[1] = "pære"

print(frukter)`,
      output: `['eple', 'pære', 'appelsin']`,
    },

    {
      title: "Legge til elementer",
      content:
        "append() legger til et nytt element bakerst i listen.",
      code: `frukter = ["eple", "banan"]

frukter.append("appelsin")

print(frukter)`,
      output: `['eple', 'banan', 'appelsin']`,
    },

    {
      title: "Fjerne elementer",
      content:
        "remove() fjerner et bestemt element fra listen.",
      code: `frukter = ["eple", "banan", "appelsin"]

frukter.remove("banan")

print(frukter)`,
      output: `['eple', 'appelsin']`,
    },

    {
      title: "Lengden på en liste",
      content:
        "len() forteller hvor mange elementer listen inneholder.",
      code: `frukter = ["eple", "banan", "appelsin"]

print(len(frukter))`,
      output: `3`,
    },

    {
      title: "Løkke gjennom en liste",
      content:
        "Lister brukes ofte sammen med for-løkker. Her går vi gjennom alle elementene og skriver dem ut én etter én.",
      code: `frukter = ["eple", "banan", "appelsin"]

for frukt in frukter:
    print(frukt)`,
      output: `eple
banan
appelsin`,
    },

    {
      title: "Oppsummering",
      content:
        "Lister brukes til å lagre flere verdier. Du kan hente elementer med indekser, endre verdier, legge til og fjerne elementer, og bruke lister sammen med løkker.",
    },
  ],
};