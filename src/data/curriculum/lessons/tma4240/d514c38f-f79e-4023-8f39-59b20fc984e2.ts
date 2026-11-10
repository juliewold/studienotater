import type { Lesson } from "../types";

// Tema 5, Viktige diskrete fordelinger. Pensum: WMMY 5.1–5.2 og 5.4–5.6 (5.3 hypergeometrisk er ikke pensum).
// Formelbok: side 25 (formler), 26 (diskret uniform, multinomisk), 12–17 (binomisk tabell), 18–20 (Poisson tabell), 31 (grenser).

const formelbok = (pages: string) => `(Formelbok ${pages})`;

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "d514c38f-f79e-4023-8f39-59b20fc984e2",
  reviewed: "2026-11-10",
  summary: "Den **binomiske** fordelingen teller suksesser i $n$ uavhengige forsøk. Den **Poisson**-fordelingen teller hendelser i et tidsrom med gjennomsnitt $\\mu$, og er grensen for binomisk når $n$ er stor og $p$ er liten. **Geometrisk** og **negativ binomisk** teller forsøk til første eller $k$-te suksess.",
  overview: [
    "**Binomisk** $X \\sim \\text{Bin}(n, p)$: $P(X = x) = \\binom{n}{x} p^x (1-p)^{n-x}$. Tabell side 12–17 gir $P(X \\le x)$.",
    "**Poisson** $X \\sim \\text{Po}(\\mu)$: $P(X = x) = \\mu^x e^{-\\mu}/x!$. Tabell side 18–20 gir $P(X \\le x)$. $E(X) = \\text{Var}(X) = \\mu$.",
    "**Geometrisk:** antall forsøk til første suksess, $x = 1, 2, \\ldots$. Negativ binomisk: antall forsøk til $k$-te suksess, $x = k, k+1, \\ldots$.",
    "**Poisson-grensen:** $\\text{Bin}(n, p) \\approx \\text{Po}(np)$ når $n$ er stor og $p$ er liten (side 31).",
    "**Multinomisk** generaliserer binomisk til flere utfallskategorier. Med $k = 2$ får du den binomiske.",
  ],
  keyFormulas: [
    { latex: "P(X = x) = \\binom{n}{x} p^x (1 - p)^{n-x}, \\qquad E(X) = np, \\quad \\text{Var}(X) = np(1-p)", label: "Binomisk" },
    { latex: "P(X = x) = \\dfrac{\\mu^x e^{-\\mu}}{x!}, \\qquad E(X) = \\text{Var}(X) = \\mu", label: "Poisson" },
    { latex: "g(x) = p(1-p)^{x-1}, \\qquad E(X) = \\dfrac{1}{p}, \\quad \\text{Var}(X) = \\dfrac{1-p}{p^2}", label: "Geometrisk" },
    { latex: "b^*(x) = \\binom{x-1}{k-1} p^k (1-p)^{x-k}, \\qquad E(X) = \\dfrac{k}{p}", label: "Negativ binomisk" },
  ],
  goals: [
    "Kunne velge riktig fordeling ut fra hva som telles og om antall forsøk er fast.",
    "Kunne bruke binomisk og Poisson-tabellen til å finne $P(X = x)$, $P(X \\le x)$ og $P(X \\ge x)$.",
    "Kunne bruke Poisson til å tilnærme binomisk, og vurdere når tilnærmingen er god.",
    "Kunne finne forventning og varians for alle fordelingene i temaet.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 12–20, 25–26, 31", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "binomisk",
      title: "Binomisk fordeling",
      blocks: [
        { type: "text", text: "Bruk den binomiske fordelingen når du har $n$ **uavhengige** forsøk med samme suksessannsynlighet $p$, og teller antall suksesser $X$. Hvis $p$ eller $n$ endrer seg underveis, er ikke modellen riktig." },
        { type: "formula", latex: "P(X = x) = \\binom{n}{x} p^x (1-p)^{n-x}, \\quad x = 0, 1, \\ldots, n", name: "Binomisk fordeling", book: { status: "book", pages: "25" }, caption: `Formelboka ${formelbok("s. 25")}. Forventning $np$ og varians $np(1-p)$ står på samme side.` },
        { type: "text", text: "Tabellen på side 12–17 gir $P(X \\le x)$ for $p \\in \\{0{,}05, \\ldots, 0{,}90\\}$. Da trekker du fra forrige rad for å få $P(X = x)$." },
        { type: "formula", latex: "P(X = x) = P(X \\le x) - P(X \\le x-1), \\qquad P(X \\ge x) = 1 - P(X \\le x-1)", name: "Bruk av tabell (binomisk)", book: { status: "partial", pages: "12–17", missing: "P(X = x) = P(X ≤ x) − P(X ≤ x−1) og P(X ≥ x) må læres" }, caption: `Formelboka ${formelbok("s. 12–17")}. Tabellen gir kumulative verdier.` },
        { type: "example", title: "$X \\sim \\text{Bin}(10, 0{,}3)$", blocks: [
          { type: "text", text: "$P(X = 2) = \\binom{10}{2} \\cdot 0{,}3^2 \\cdot 0{,}7^8 = 45 \\cdot 0{,}09 \\cdot 0{,}05765 \\approx 0{,}2335$." },
          { type: "text", text: "Tabell: $P(X \\le 2) = 0{,}383$ og $P(X \\le 1) = 0{,}149$. Differansen er $0{,}234$, som stemmer med $0{,}2335$ når du avrunder." },
          { type: "text", text: "$P(\\text{minst én}) = 1 - P(X = 0) = 1 - 0{,}7^{10} = 1 - 0{,}0282 = 0{,}972$." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlige feil", blocks: [
          { type: "list", items: [
            "Å lese $P(X = x)$ rett av tabellen. Den gir $P(X \\le x)$.",
            "Å glemme at $P(X \\ge x) = 1 - P(X \\le x-1)$, ikke $1 - P(X \\le x)$.",
            "Å bruke feil kolonne for $p$. Radene er $n$ og kolonnene er $p$.",
          ] },
        ] },
      ],
    },
    {
      id: "poisson",
      title: "Poisson-fordelingen og Poisson-prosesser",
      blocks: [
        { type: "text", text: "Poisson telle hendelser i et tidsrom eller område når de skjer tilfeldig, uavhengig og med konstant rate. Hvis rate er $\\lambda$ per enhet og intervallet har lengde $t$, er $\\mu = \\lambda t$." },
        { type: "formula", latex: "P(X = x) = \\dfrac{\\mu^x e^{-\\mu}}{x!}, \\quad x = 0, 1, \\ldots; \\qquad E(X) = \\text{Var}(X) = \\mu", name: "Poissonfordeling", book: { status: "book", pages: "25" }, caption: `Formelboka ${formelbok("s. 25")}. Tabell for $P(X \\le x)$ på side 18–20.` },
        { type: "formula", latex: "\\mu = \\lambda t", name: "Poisson-prosess", book: { status: "missing" }, caption: "Ikke i formelboka i denne formen. Formelboka har bare $\\mu$. Rate per enhet og lengde på intervallet må du sette selv." },
        { type: "example", title: "Hendelser per time", blocks: [
          { type: "text", text: "$\\lambda = 3$ per time. For 20 minutter er $\\mu = 3 \\cdot \\tfrac{1}{3} = 1$, og $P(X = 0) = e^{-1} \\approx 0{,}368$." },
          { type: "text", text: "For $\\mu = 2$: $P(X \\le 1) = e^{-2}(1 + 2) = 0{,}406$ (side 18), og $P(X = 3) = \\frac{2^3 e^{-2}}{3!} \\approx 0{,}180$." },
        ] },
      ],
    },
    {
      id: "grense",
      title: "Poisson som tilnærming til binomisk",
      blocks: [
        { type: "text", text: "Når $n$ er stor og $p$ er liten, kan du sette $\\mu = np$ og bruke Poisson. Tommelfingerregelen er $n \\ge 20$ og $p \\le 0{,}05$. Den står ikke i formelboka." },
        { type: "formula", latex: "\\text{Bin}(n, p) \\approx \\text{Po}(np) \\quad \\text{for } n \\text{ stor og } p \\text{ liten}", name: "Poisson-tilnærming", book: { status: "partial", pages: "31", missing: "Tommelfingerregelen n ≥ 20 og p ≤ 0,05 må læres" }, caption: `Grensen er vist i formelboka ${formelbok("s. 31")} som $\\mu = np$ når $n \\to \\infty$.` },
        { type: "example", title: "$X \\sim \\text{Bin}(200, 0{,}01)$", blocks: [
          { type: "text", text: "Tilnærmingen er $\\mu = 200 \\cdot 0{,}01 = 2$. Da er $P(X \\le 1) \\approx 0{,}406$ fra Poisson-tabellen." },
          { type: "text", text: "Den eksakte binomiske verdien er $0{,}9900^{200} + 200 \\cdot 0{,}01 \\cdot 0{,}9900^{199} \\approx 0{,}405$. Tilnærmingen er god." },
        ] },
        { type: "box", variant: "tip", title: "Tankegang", blocks: [
          { type: "text", text: "Be om to ting før du tilnærmer: store $n$ og lite $p$. Hvis $p$ er stor, som $p = 0{,}5$ med $n = 20$, er Poisson en dårlig modell. Bruk binomisk tabell i stedet." },
        ] },
      ],
    },
    {
      id: "geometrisk",
      title: "Geometrisk og negativ binomisk",
      blocks: [
        { type: "text", text: "Den **geometriske** fordelingen teller forsøk til første suksess. Den **negative binomiske** teller forsøk til $k$-te suksess. Sjekk alltid om $X$ er antall forsøk eller antall feil før du setter inn formelen." },
        { type: "formula", latex: "g(x) = p(1-p)^{x-1}, \\quad x = 1, 2, \\ldots; \\qquad E(X) = \\dfrac{1}{p}, \\quad \\text{Var}(X) = \\dfrac{1-p}{p^2}", name: "Geometrisk fordeling", book: { status: "book", pages: "25" }, caption: `Formelboka ${formelbok("s. 25")}. $X$ teller forsøk, ikke feil.` },
        { type: "formula", latex: "b^*(x; k, p) = \\binom{x-1}{k-1} p^k (1-p)^{x-k}, \\quad x = k, k+1, \\ldots; \\qquad E(X) = \\dfrac{k}{p}", name: "Negativ binomisk fordeling", book: { status: "book", pages: "25" }, caption: `Formelboka ${formelbok("s. 25")}. For $k = 1$ får du den geometriske.` },
        { type: "example", title: "Geometrisk og negativ", blocks: [
          { type: "text", text: "$p = 0{,}2$: $P(X = 3) = 0{,}2 \\cdot 0{,}8^2 = 0{,}128$, og $E(X) = 5$." },
          { type: "text", text: "$k = 3$, $p = 0{,}5$: $P(X = 5) = \\binom{4}{2} \\cdot 0{,}5^3 \\cdot 0{,}5^2 = 6 \\cdot 0{,}5^5 = 0{,}1875$." },
        ] },
      ],
    },
    {
      id: "multinomisk-uniform",
      title: "Diskret uniform og multinomisk",
      blocks: [
        { type: "formula", latex: "f(x) = \\dfrac{1}{k}, \\quad E(X) = \\dfrac{1}{k}\\sum_{i=1}^{k} x_i", name: "Diskret uniform", book: { status: "book", pages: "26" }, caption: `Formelboka ${formelbok("s. 26")}. Et terningkast har $E(X) = 3{,}5$.` },
        { type: "formula", latex: "E(X_i) = np_i, \\quad \\text{Var}(X_i) = np_i(1-p_i), \\quad \\text{Cov}(X_i, X_j) = -np_ip_j", name: "Multinomisk fordeling", book: { status: "book", pages: "26" }, caption: `Formelboka ${formelbok("s. 26")}. Med $k = 2$ er $X_1$ binomisk.` },
        { type: "text", text: "Kovariansen i den multinomiske er negativ: flere i én kategori betyr færre i de andre." },
      ],
    },
    {
      id: "avgrensning",
      title: "Avgrensning",
      blocks: [
        { type: "box", variant: "pitfall", title: "Ikke pensum", blocks: [
          { type: "text", text: "Hypergeometrisk fordeling (formelboka side 21–22) er **ikke pensum**, fordi 5.3 er utelatt. Hvis en oppgave ser ut som «trekning uten tilbakelegging», løs den med multiplikasjonssetningen i stedet (side 32)." },
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["Binomisk: minst én", "Aug 2026, oppg. 2a–b", "$P(X \\ge 1) = 1 - P(X = 0) = 1 - 0{,}99^{200}$. Forventningen er $np$."],
          ["Poisson-tilnærming til binomisk", "Aug 2026, oppg. 2c", "$\\mu = np = 2$. Slå opp $P(X \\le x)$ i Poisson-tabellen (side 18)."],
          ["Poisson-prosess over et tidsrom", "Des 2025, oppg. 7a", "Antall i et intervall av lengde $t$ er $\\text{Po}(\\lambda t)$. Forutsetningen er uavhengige delintervall."],
          ["To uavhengige Poisson-variabler", "Aug 2026, oppg. 4a", "$P(X = 2, Y = 1) = P(X = 2)\\,P(Y = 1)$. Her er $\\mu_X = \\lambda_X \\cdot 90$ minutter."],
        ] },
        { type: "example", title: "Des 2025, oppg. 7a: viltpåkjørsler", blocks: [
          { type: "text", text: "$\\lambda = 9$ per år og 2 år gir $\\mu = 18$. Da er $E(X) = 18$ og $\\text{SD}(X) = \\sqrt{18} \\approx 4{,}24$." },
          { type: "text", text: "$P(X \\ge 18) = 1 - P(X \\le 17) = 1 - 0{,}4686 = 0{,}5314$ (side 20, $\\mu = 18$)." },
        ] },
      ],
    },
  ],
};
