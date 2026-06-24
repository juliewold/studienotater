export const pythonSets = {
  id: "sets",
  title: "Sets",

  sections: [
    {
      title: "Hva er et set?",
      content:
        "Et set er en samling verdier der hver verdi bare kan finnes én gang. Sets brukes ofte når du vil fjerne duplikater eller sjekke om noe finnes.",
    },

    {
      title: "Opprette et set",
      content: "Sets skrives med krøllparenteser.",
      code: `tall = {1, 2, 3}

print(tall)`,
      output: `{1, 2, 3}`,
    },

    {
      title: "Duplikater fjernes",
      content:
        "Hvis du legger inn samme verdi flere ganger, beholder Python bare én av dem.",
      code: `tall = {1, 2, 2, 3, 3, 3}

print(tall)`,
      output: `{1, 2, 3}`,
    },

    {
      title: "Legge til verdier",
      content: "add() legger til en ny verdi i settet.",
      code: `frukter = {"eple", "banan"}

frukter.add("appelsin")

print(frukter)`,
      output: `{'eple', 'banan', 'appelsin'}`,
    },

    {
      title: "Fjerne verdier",
      content: "remove() fjerner en verdi fra settet.",
      code: `frukter = {"eple", "banan", "appelsin"}

frukter.remove("banan")

print(frukter)`,
      output: `{'eple', 'appelsin'}`,
    },

    {
      title: "Sjekke om en verdi finnes",
      content:
        "Du kan bruke in for å sjekke om en verdi finnes i et set.",
      code: `frukter = {"eple", "banan", "appelsin"}

print("eple" in frukter)`,
      output: `True`,
    },

    {
      title: "Oppsummering",
      content:
        "Sets brukes til unike verdier. De fjerner duplikater automatisk og er nyttige når du vil sjekke om noe finnes.",
    },
  ],
};