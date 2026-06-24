export const pythonLoops = {
  id: "lokker",
  title: "Løkker",

  sections: [
    {
      title: "Hva er en løkke?",
      content:
        "Løkker brukes når du vil kjøre den samme koden flere ganger uten å skrive den på nytt.",
    },

    {
      title: "for-løkke",
      content:
        "for brukes når du vet hvor mange ganger noe skal gjentas.",
      code: `for i in range(5):
    print(i)`,
    output: `0
1
2
3
4`
    },

    {
      title: "range()",
      content:
        "range() lager en sekvens med tall.",
      code: `range(5)      # 0, 1, 2, 3, 4
range(1, 6)   # 1, 2, 3, 4, 5`,
    },

    {
      title: "Løkke gjennom en liste",
      content:
        "Du kan gå gjennom alle elementene i en liste.",
      code: `frukter = ["eple", "banan", "appelsin"]

for frukt in frukter:
    print(frukt)`,
    output: `eple
banan
appelsin`
    },

    {
      title: "while-løkke",
      content:
        "while kjører så lenge en betingelse er sann.",
      code: `teller = 0

while teller < 5:
    print(teller)
    teller += 1`,
    output: `0
1
2
3
4`
    },

    {
      title: "break",
      content:
        "break avslutter løkken umiddelbart.",
      code: `for i in range(10):
    if i == 5:
        break

    print(i)`,
    output: `0
1
2
3
4`
    },

    {
      title: "continue",
      content:
        "continue hopper over resten av den nåværende iterasjonen.",
      code: `for i in range(5):
    if i == 2:
        continue

    print(i)`,
    output: `0
1
3
4`
    },

    {
      title: "Innrykk i løkker",
      content:
        "Alt som skal gjentas må stå innrykket inne i løkken.",
      code: `for i in range(3):
    print("Hei")

print("Ferdig")`,
output: `Hei
Hei
Hei
Ferdig`
    },

    {
      title: "Oppsummering",
      content:
        "for brukes når du vet hvor mange ganger noe skal gjentas. while brukes når en betingelse styrer hvor lenge løkken skal kjøre. break avslutter løkken, mens continue hopper over én iterasjon.",
    },
  ],
};