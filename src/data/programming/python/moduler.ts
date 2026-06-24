export const pythonModules = {
  id: "moduler",
  title: "Moduler",

  sections: [
    {
      title: "Hva er en modul?",
      content:
        "En modul er en Python-fil som inneholder kode du kan gjenbruke i andre programmer. Moduler gjør det lettere å organisere og dele kode.",
    },

    {
      title: "Importere en modul",
      content:
        "Du kan bruke import for å få tilgang til kode som ligger i en modul.",
      code: `import math

print(math.sqrt(25))`,
      output: `5.0`,
    },

    {
      title: "Importere spesifikke funksjoner",
      content:
        "Du kan importere bare det du trenger fra en modul.",
      code: `from math import sqrt

print(sqrt(25))`,
      output: `5.0`,
    },

    {
      title: "Gi modulen et kort navn",
      content:
        "as brukes for å gi modulen et alias.",
      code: `import math as m

print(m.pi)`,
      output: `3.141592653589793`,
    },

    {
      title: "Lage din egen modul",
      content:
        "Du kan lage en vanlig Python-fil og importere den i andre programmer.",
      code: `# min_modul.py

def hei():
    print("Hei!")

# main.py

import min_modul

min_modul.hei()`,
      output: `Hei!`,
    },

    {
      title: "Nyttige innebygde moduler",
      content:
        "Python kommer med mange ferdige moduler som kan brukes uten installasjon.",
      code: `math
random
datetime
os
json`,
    },

    {
      title: "Eksempel med random",
      content:
        "random brukes ofte for å generere tilfeldige tall.",
      code: `import random

print(random.randint(1, 6))`,
      output: `Et tilfeldig tall mellom 1 og 6`,
    },

    {
      title: "Oppsummering",
      content:
        "Moduler gjør det mulig å organisere og gjenbruke kode. Du kan bruke innebygde moduler eller lage dine egne.",
    },
  ],
};