import type { ProgrammingLesson } from "../../../types/programming";

export const pythonCheatsheet: ProgrammingLesson = {
  id: "cheatsheet",
  title: "Cheatsheet",

  sections: [
    {
      title: "Variabler",
      code: `navn = "Julie"
alder = 19
er_student = True`,
    },

    {
      title: "Datatyper",
      code: `str
int
float
bool

type(verdi)`,
    },

    {
      title: "Input og output",
      code: `navn = input("Navn: ")

print(navn)`,
    },

    {
      title: "If-setninger",
      code: `if x > 0:
    print("Positiv")
elif x < 0:
    print("Negativ")
else:
    print("Null")`,
    },

    {
      title: "Sammenligningsoperatorer",
      code: `==  lik
!=  ulik
>   større enn
<   mindre enn
>=  større eller lik
<=  mindre eller lik`,
    },

    {
      title: "Logiske operatorer",
      code: `and
or
not`,
    },

    {
      title: "For-løkke",
      code: `for i in range(5):
    print(i)`,
    },

    {
      title: "While-løkke",
      code: `while x < 5:
    x += 1`,
    },

    {
      title: "Funksjoner",
      code: `def hei(navn):
    print("Hei", navn)

hei("Julie")`,
    },

    {
      title: "Lister",
      code: `frukter = ["eple", "banan"]

frukter.append("appelsin")
frukter.remove("banan")

print(frukter[0])
len(frukter)`,
    },

    {
      title: "Dictionaries",
      code: `student = {
    "navn": "Julie",
    "alder": 19
}

print(student["navn"])

student["alder"] = 20`,
    },

    {
      title: "Tuples",
      code: `koordinat = (10, 20)

x, y = koordinat`,
    },

    {
      title: "Sets",
      code: `tall = {1, 2, 3}

tall.add(4)
tall.remove(2)`,
    },

    {
      title: "Klasser",
      code: `class Student:
    def __init__(self, navn):
        self.navn = navn

student = Student("Julie")`,
    },

    {
      title: "Filer",
      code: `with open("fil.txt", "r") as fil:
    innhold = fil.read()`,
    },

    {
      title: "Moduler",
      code: `import math

print(math.sqrt(25))`,
    },

    {
      title: "Virtual Environments",
      code: `python -m venv venv

source venv/bin/activate

pip install django`,
    },
  ],
};