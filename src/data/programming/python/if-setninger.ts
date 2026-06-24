export const pythonIfStatements = {
  id: "if-setninger",
  title: "If-setninger",

  sections: [
    {
      title: "Hva er en if-setning?",
      content:
        "If-setninger lar programmet ta valg. Koden inni if-blokken kjører bare dersom betingelsen er sann.",
    },

    {
      title: "En enkel if-setning",
      content:
        "Hvis betingelsen er True, kjører koden inni blokken.",
      code: `alder = 19

if alder >= 18:
    print("Du er myndig")`,
    },

    {
      title: "if og else",
      content:
        "Else brukes når betingelsen i if-setningen ikke er oppfylt.",
      code: `alder = 16

if alder >= 18:
    print("Du er myndig")
else:
    print("Du er ikke myndig")`,
    },

    {
      title: "if, elif og else",
      content:
        "Elif lar deg sjekke flere betingelser etter hverandre.",
      code: `karakter = 4

if karakter == 6:
    print("A")
elif karakter == 5:
    print("B")
else:
    print("Ikke A eller B")`,
    },

    {
      title: "Sammenligningsoperatorer",
      content:
        "Disse brukes ofte i if-setninger for å sammenligne verdier.",
      code: `==   # lik
!=   # ulik
>    # større enn
<    # mindre enn
>=   # større eller lik
<=   # mindre eller lik`,
    },

    {
      title: "and",
      content:
        "and krever at begge betingelsene er sanne.",
      code: `alder = 19
har_billett = True

if alder >= 18 and har_billett:
    print("Velkommen inn")`,
    },

    {
      title: "or",
      content:
        "or krever at minst én av betingelsene er sann.",
      code: `er_student = False
er_ansatt = True

if er_student or er_ansatt:
    print("Rabatt")`,
    },

    {
      title: "not",
      content:
        "not snur sannhetsverdien.",
      code: `er_logget_inn = False

if not er_logget_inn:
    print("Logg inn først")`,
    },

    {
      title: "Innrykk er viktig",
      content:
        "Python bruker innrykk for å vite hvilken kode som tilhører if-blokken.",
      code: `alder = 19

if alder >= 18:
    print("Myndig")
    print("Kan stemme")

print("Programmet fortsetter")`,
    },

    {
      title: "Oppsummering",
      content:
        "if brukes for valg i programmet. elif lar deg teste flere alternativer, og else kjører dersom ingen tidligere betingelser er oppfylt. and, or og not brukes til å kombinere betingelser.",
    },
  ],
};