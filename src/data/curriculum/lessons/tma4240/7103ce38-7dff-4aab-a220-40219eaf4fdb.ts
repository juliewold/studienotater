import type { Lesson } from "../types";

// Tema 2, Stokastiske variabler og fordelinger. Pensum: WMMY Kap 3 (hele).
// Formelboka har bare fordelingsspesifikke formler (side 25–28). Generelle definisjoner må kunnes.

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "7103ce38-7dff-4aab-a220-40219eaf4fdb",
  reviewed: "2026-11-10",
  summary: "En **stokastisk variabel** $X$ gir et tall til hvert utfall. Fordelingen beskrives av **punktsannsynlighet** $f(x) = P(X = x)$ for diskrete variabler og av **tetthet** $f(x)$ for kontinuerlige variabler. Fordelingsfunksjonen $F(x) = P(X \\le x)$ gjelder for begge. Simultanfordeling og uavhengighet gjelder når flere variabler inngår samtidig.",
  overview: [
    "**Diskret:** $f(x) \\ge 0$ og $\\sum f(x) = 1$. $F$ er en trappefunksjon.",
    "**Kontinuerlig:** $f(x) \\ge 0$ og $\\int f(x)\\,dx = 1$. Sannsynlighet er areal, så $P(X = x) = 0$.",
    "**Fordelingsfunksjonen** $F(x) = P(X \\le x)$ gir alle sannsynligheter: $P(a < X \\le b) = F(b) - F(a)$.",
    "**Kontinuerlig:** $F'(x) = f(x)$, og $f(x) = dF/dx$.",
    "**Kvantil** $q_p$ er den verdien der $F(q_p) = p$. Median er $q_{0{,}5}$.",
    "**Uavhengighet:** $f(x, y) = f_X(x) f_Y(y)$ for alle $x$ og $y$. Marginal fordeling: $f_X(x) = \\sum_y f(x, y)$ eller $\\int f(x, y)\\,dy$.",
  ],
  keyFormulas: [
    { latex: "\\sum_x f(x) = 1 \\qquad \\text{eller} \\qquad \\int f(x)\\,dx = 1", label: "Normering" },
    { latex: "F(x) = P(X \\le x), \\qquad P(a < X \\le b) = F(b) - F(a)", label: "Fordelingsfunksjonen" },
    { latex: "f_X(x) = \\sum_y f(x, y) \\qquad \\text{eller} \\qquad f_X(x) = \\int f(x, y)\\,dy", label: "Marginal fordeling" },
    { latex: "f(x, y) = f_X(x)\\,f_Y(y)", label: "Uavhengige variabler" },
  ],
  goals: [
    "Kunne normere en gitt $f$ og finne konstanten $c$.",
    "Kunne bruke $F$ til å finne sannsynligheter og kvantiler.",
    "Kunne finne marginal- og betingede fordelinger fra en simultanfordeling.",
    "Kunne avgjøre om to variabler er uavhengige.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 25–28", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "diskrete",
      title: "Diskrete variabler",
      blocks: [
        { type: "text", text: "En diskret variabel tar endelig eller tellbart mange verdier. Punktsannsynligheten $f(x) = P(X = x)$ må være ikke-negativ og summere til 1. Fordelingsfunksjonen summerer opp: $F(x) = \\sum_{t \\le x} f(t)$." },
        { type: "formula", latex: "\\sum_{x} f(x) = 1, \\qquad F(x) = \\sum_{t \\le x} f(t)", name: "Diskret fordeling", book: { status: "missing" }, caption: "Ikke i formelboka i generell form. Spesifikke fordelinger står side 25–26." },
        { type: "example", title: "Finn konstanten og en sannsynlighet", blocks: [
          { type: "text", text: "$f(x) = c\\,x$ for $x \\in \\{1, 2, 3\\}$. Normering gir $c(1 + 2 + 3) = 1$, altså $c = 1/6$." },
          { type: "text", text: "$F(2) = P(X \\le 2) = \\frac{1}{6} + \\frac{2}{6} = \\frac{1}{2}$. Da er $P(X \\ge 2) = 1 - F(1) = 1 - \\frac{1}{6} = \\frac{5}{6}$." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlige feil", blocks: [
          { type: "list", items: [
            "$P(X \\ge 2)$ er ikke $1 - F(2)$. Den er $1 - F(1)$, fordi $P(X < 2) = F(1)$ for heltallsvariabler.",
            "Verdiene utenfor støtten har $f(x) = 0$, og de må ikke glemmes i normeringen.",
          ] },
        ] },
      ],
    },
    {
      id: "kontinuerlige",
      title: "Kontinuerlige variabler",
      blocks: [
        { type: "text", text: "Tettheten $f(x)$ kan være større enn 1. Det som må være riktig, er at arealet under kurven er 1. Sannsynligheter er areal: $P(a < X < b) = \\int_a^b f(x)\\,dx$." },
        { type: "formula", latex: "F(x) = \\int_{-\\infty}^{x} f(t)\\,dt, \\qquad f(x) = F'(x)", name: "Kontinuerlig fordeling", book: { status: "missing" }, caption: "Definisjonen av $F$ og $f$. Ikke i formelboka i generell form." },
        { type: "formula", latex: "P(X = x) = 0", name: "Punktsannsynlighet er null", book: { status: "missing" }, caption: "Derfor gjelder $P(a < X < b) = P(a \\le X \\le b)$ for kontinuerlige variabler." },
        { type: "example", title: "Tetthet og kvantil", blocks: [
          { type: "text", text: "$f(x) = 2x$ på $[0, 1]$. Da er $F(x) = x^2$ for $0 \\le x \\le 1$." },
          { type: "text", text: "$P(0{,}2 < X < 0{,}5) = F(0{,}5) - F(0{,}2) = 0{,}25 - 0{,}04 = 0{,}21$." },
          { type: "text", text: "Medianen $m$ løser $F(m) = 0{,}5$, altså $m^2 = 0{,}5$ og $m = \\sqrt{0{,}5} \\approx 0{,}707$." },
        ] },
        { type: "box", variant: "tip", title: "Tankegang", blocks: [
          { type: "text", text: "Hvis oppgaven spør om en sannsynlighet, start med $F$. Hvis den spør om en tetthet, deriver $F$. Hvis den spør om en kvantil, løs $F(q) = p$." },
        ] },
      ],
    },
    {
      id: "simultan",
      title: "Simultanfordeling, marginal og betinget fordeling",
      blocks: [
        { type: "text", text: "Når to variabler $X$ og $Y$ inngår samtidig, beskriver $f(x, y)$ den felles fordelingen. Marginalfordelingene får du ved å summere (eller integrere) ut den andre variabelen." },
        { type: "formula", latex: "f_X(x) = \\sum_y f(x, y), \\qquad f(x \\mid y) = \\dfrac{f(x, y)}{f_Y(y)}", name: "Marginal og betinget fordeling", book: { status: "missing" }, caption: "Ikke i formelboka. Samme form for kontinuerlige variabler, med integraler." },
        { type: "formula", latex: "f(x, y) = f_X(x)\\,f_Y(y)", name: "Uavhengighet", book: { status: "missing" }, caption: "Gjelder for alle $(x, y)$, ikke bare noen. Kontroller alle punkter." },
        { type: "example", title: "Er $X$ og $Y$ uavhengige?", blocks: [
          { type: "text", text: "$f(x, y) = c\\,x\\,y$ for $x, y \\in \\{1, 2\\}$. Normering: $c(1 + 2 + 2 + 4) = 9c = 1$, altså $c = 1/9$." },
          { type: "text", text: "Marginalen er $f_X(x) = \\sum_y \\frac{xy}{9} = \\frac{x}{9}(1 + 2) = \\frac{x}{3}$, og tilsvarende $f_Y(y) = \\frac{y}{3}$." },
          { type: "text", text: "Produktet er $f_X(x)f_Y(y) = \\frac{xy}{9} = f(x, y)$ for alle punkter, så $X$ og $Y$ er uavhengige." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlig feil", blocks: [
          { type: "text", text: "Å bare sjekke ett punkt. Uavhengighet må holde for alle $(x, y)$. Ett motpunkt er nok til å si at de er avhengige." },
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["Konstant i tetthet", "Des 2025, oppg. 3", "Integrer $f$ over støtten og løs for konstanten."],
          ["Sannsynlighet og median fra tetthet", "Des 2025, oppg. 3d–e", "$P(X \\le a) = \\int_0^a f(x)\\,dx$. Medianen $m$ løser $F(m) = 1/2$."],
          ["Forventning og varians fra tetthet", "Des 2025, oppg. 3a–c", "$E(X) = \\int x f(x)\\,dx$, $E(X^2) = \\int x^2 f(x)\\,dx$ og $\\text{Var}(X) = E(X^2) - \\mu^2$."],
        ] },
        { type: "example", title: "Des 2025, oppg. 3: $f(x) = 3x^2$ på $(0, 1)$", blocks: [
          { type: "text", text: "$E(X) = \\int_0^1 3x^3\\,dx = \\frac{3}{4}$ og $E(X^2) = \\int_0^1 3x^4\\,dx = \\frac{3}{5}$." },
          { type: "text", text: "$\\text{Var}(X) = \\frac{3}{5} - \\left(\\frac{3}{4}\\right)^2 = 0{,}0375$, og $P(X \\le \\tfrac{1}{2}) = \\left(\\tfrac{1}{2}\\right)^3 = 0{,}125$." },
          { type: "text", text: "$F(x) = x^3$, så $F(m) = \\tfrac{1}{2}$ gir $m = (1/2)^{1/3} \\approx 0{,}794$." },
        ] },
      ],
    },
  ],
};
