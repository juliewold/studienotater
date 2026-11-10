import type { Lesson } from "../types";
import { NormalRegionFigure } from "./figures";

// Tema 6, Viktige kontinuerlige fordelinger. Pensum: WMMY 6.1–6.4 og 6.6–6.7 (6.5 ligger under Funksjoner, jf. emnematrisa).
// Formelbok: side 1–3 (normal), 4 (t-kritisk), 5 (χ²-kritisk), 26 (normal og eksponensial), 27 (χ² og t), 28 (gamma og uniform).

const formelbok = (pages: string) => `(Formelbok ${pages})`;

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "58e81f44-a248-4cc2-8eda-5e43fa335bac",
  reviewed: "2026-11-10",
  summary: "**Normalfordelingen** er den viktigste kontinuerlige fordelingen, fordi sentralgrenseteoremet gjør mange gjennomsnitt tilnærmet normale. **Eksponensial**, **gamma**, **χ²** og **t** dukker opp i tid mellom hendelser og i variansinferens. Alle slås opp i tabellene i formelboka, men du må vite hvilken fordeling oppgaven bruker.",
  overview: [
    "**Normal** $N(\\mu, \\sigma^2)$: standardiser med $Z = (X - \\mu)/\\sigma$, og slå opp $\\Phi$ på side 1–2. Bruk $\\Phi(-z) = 1 - \\Phi(z)$.",
    "**Eksponensial** med gjennomsnitt $\\beta$: $P(X > x) = e^{-x/\\beta}$. Formelboka bruker $\\beta$, ikke $\\lambda$.",
    "**Gamma** $(\\alpha, \\beta)$ har forventning $\\alpha\\beta$. Eksponensial er gamma med $\\alpha = 1$, og $\\chi^2_\\nu$ er gamma med $\\alpha = \\nu/2$ og $\\beta = 2$.",
    "**χ²** med $\\nu$ frihetsgrader: $E = \\nu$, $\\text{Var} = 2\\nu$. Tabellen på side 5 er øvre hale.",
    "**t** med $\\nu$ frihetsgrader: brukes når $\\sigma$ er ukjent og estimeres med $S$. Tabellen på side 4 er også øvre hale.",
  ],
  keyFormulas: [
    { latex: "Z = \\dfrac{X - \\mu}{\\sigma}, \\qquad F(x) = \\Phi\\!\\left(\\dfrac{x - \\mu}{\\sigma}\\right)", label: "Normalfordelingen" },
    { latex: "f(x) = \\dfrac{1}{\\beta} e^{-x/\\beta}, \\qquad E(X) = \\beta, \\quad \\text{Var}(X) = \\beta^2", label: "Eksponensial" },
    { latex: "\\dfrac{\\bar{X} - \\mu}{S/\\sqrt{n}} \\sim t_{n-1}", label: "t-størrelsen" },
    { latex: "\\dfrac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2_{n-1}", label: "Sampling av variansen" },
  ],
  goals: [
    "Kunne standardisere og finne sannsynligheter og kvantiler i normalfordelingen.",
    "Kunne bruke eksponensial med parameteren β og finne sannsynligheter med $e^{-x/\\beta}$.",
    "Kunne slå opp kritiske verdier i t- og χ²-tabellene for øvre hale.",
    "Kunne forklare hvorfor $(\\bar{X} - \\mu)/(S/\\sqrt{n})$ er t-fordelt, ikke normal.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 1–5, 26–28", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "uniform",
      title: "Kontinuerlig uniform fordeling",
      blocks: [
        { type: "formula", latex: "f(x) = \\dfrac{1}{b-a}, \\quad a \\le x \\le b; \\qquad E(X) = \\dfrac{a+b}{2}, \\quad \\text{Var}(X) = \\dfrac{(b-a)^2}{12}", name: "Kontinuerlig uniform", caption: `Formelboka ${formelbok("s. 28")}. Sannsynlighet er lengde delt på $b - a$.` },
        { type: "example", title: "$X \\sim U(2, 8)$", blocks: [
          { type: "text", text: "$P(3 < X < 5) = \\dfrac{5-3}{8-2} = \\dfrac{1}{3}$. $E(X) = 5$ og $\\text{Var}(X) = 36/12 = 3$." },
        ] },
      ],
    },
    {
      id: "normal",
      title: "Normalfordelingen",
      blocks: [
        { type: "formula", latex: "f(x) = \\dfrac{1}{\\sqrt{2\\pi}\\,\\sigma} \\exp\\!\\left(-\\dfrac{(x-\\mu)^2}{2\\sigma^2}\\right), \\qquad E(X) = \\mu, \\quad \\text{Var}(X) = \\sigma^2", name: "Normalfordeling", caption: `Formelboka ${formelbok("s. 26")}. Sannsynligheter slås opp i $\\Phi$-tabellen på side 1–2.` },
        { type: "formula", latex: "P(X \\le x) = \\Phi\\!\\left(\\dfrac{x - \\mu}{\\sigma}\\right)", name: "Sannsynlighet i normalfordelingen", caption: `Formelboka ${formelbok("s. 1–2, 26")}. Tabellen gir $\\Phi(z)$ for $z$ fra $-3{,}7$ til $3{,}7$.` },
        { type: "figure", component: () => NormalRegionFigure({ label: "Standard normal med areal over z = 1", shaded: [[1, 4]], marks: [{ z: 1, text: "z = 1" }] }), caption: "Arealet til høyre for $z = 1$ er $1 - \\Phi(1) = 0{,}1587$." },
        { type: "example", title: "$X \\sim N(10, 4)$", blocks: [
          { type: "text", text: "$P(X > 12) = 1 - \\Phi\\!\\left(\\dfrac{12 - 10}{2}\\right) = 1 - \\Phi(1) = 1 - 0{,}8413 = 0{,}1587$." },
          { type: "text", text: "Baklengs: finn $x$ med $P(X \\le x) = 0{,}9$. Da er $z = 1{,}282$ (side 3), og $x = 10 + 2 \\cdot 1{,}282 = 12{,}56$." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlige feil", blocks: [
          { type: "list", items: [
            "Å bruke $\\sigma$ der du skulle bruke $\\sigma^2$ i standardiseringen. $\\sigma$ er standardavviket, $\\sigma^2$ er variansen.",
            "Å glemme $\\Phi(-z) = 1 - \\Phi(z)$. Tabellen på side 1 er for negative $z$, men du kan bruke symmetri.",
          ] },
        ] },
      ],
    },
    {
      id: "eksponensial",
      title: "Eksponensialfordelingen",
      blocks: [
        { type: "text", text: "Eksponensialfordelingen beskriver tiden til neste hendelse i en Poisson-prosess. Formelboka bruker gjennomsnittet $\\beta$. Hvis oppgaven gir intensiteten $\\lambda$, er $\\beta = 1/\\lambda$." },
        { type: "formula", latex: "f(x) = \\dfrac{1}{\\beta} e^{-x/\\beta}, \\quad x \\ge 0; \\qquad P(X > x) = e^{-x/\\beta}", name: "Eksponensialfordeling", caption: `Formelboka ${formelbok("s. 26")}. Sannsynligheten for å overskride $x$ er $e^{-x/\\beta}$, som ikke står i boka.` },
        { type: "example", title: "$\\beta = 5$", blocks: [
          { type: "text", text: "$P(X > 3) = e^{-3/5} = e^{-0{,}6} \\approx 0{,}5488$. Forventningen er 5, og variansen er 25." },
        ] },
      ],
    },
    {
      id: "gamma-chi",
      title: "Gamma- og χ²-fordelingen",
      blocks: [
        { type: "formula", latex: "E(X) = \\alpha\\beta, \\qquad \\text{Var}(X) = \\alpha\\beta^2", name: "Gamma-fordelingen", caption: `Formelboka ${formelbok("s. 28")}. Eksponensial er $\\alpha = 1$, og $\\chi^2_\\nu$ er $\\alpha = \\nu/2$, $\\beta = 2$.` },
        { type: "formula", latex: "E(X) = \\nu, \\qquad \\text{Var}(X) = 2\\nu", name: "χ²-fordelingen", caption: `Formelboka ${formelbok("s. 27")}. Hvis $X_1, \\ldots, X_n$ er uavhengige og standard normale, er $\\sum X_i^2 \\sim \\chi^2_n$.` },
        { type: "formula", latex: "\\dfrac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2_{n-1}", name: "Variansen i et normalt utvalg", caption: `Formelboka ${formelbok("s. 27")}. $\\bar{X}$ og $\\sum(X_i - \\bar{X})^2$ er uavhengige.` },
        { type: "example", title: "Øvre 5 % for $\\chi^2_{10}$", blocks: [
          { type: "text", text: "Side 5: $P(\\chi^2_{10} > 18{,}307) = 0{,}05$. Kolonnen er $\\alpha = 0{,}050$, og raden er $\\nu = 10$." },
        ] },
      ],
    },
    {
      id: "t",
      title: "Student t-fordelingen",
      blocks: [
        { type: "text", text: "Hvis $Z \\sim N(0,1)$ og $V \\sim \\chi^2_\\nu$ er uavhengige, er $Z/\\sqrt{V/\\nu}$ t-fordelt med $\\nu$ frihetsgrader. Det er dette som gir t-test og t-intervall for et normalt utvalg med ukjent $\\sigma$." },
        { type: "formula", latex: "\\dfrac{\\bar{X} - \\mu}{S/\\sqrt{n}} \\sim t_{n-1}", name: "t-størrelsen", caption: `Formelboka ${formelbok("s. 27")}. Gjelder for normale $X_i$. Tabellen på side 4.` },
        { type: "formula", latex: "E(T) = 0 \\ (\\nu \\ge 2), \\qquad \\text{Var}(T) = \\dfrac{\\nu}{\\nu - 2} \\ (\\nu \\ge 3)", name: "Forventning og varians i t", caption: `Formelboka ${formelbok("s. 27")}. $t_1$ er Cauchy, og $t_\\nu \\to N(0, 1)$ når $\\nu \\to \\infty$.` },
        { type: "example", title: "$\\nu = 15$, tosidig 95 %", blocks: [
          { type: "text", text: "Side 4: $t_{0{,}025, 15} = 2{,}131$. Sammenlign med $z_{0{,}025} = 1{,}960$. t-verdien er større fordi $\\nu$ er liten." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlig feil", blocks: [
          { type: "text", text: "Å bruke $z$ når $\\sigma$ er ukjent. Da skal du bruke $S$ og t-tabellen med $n - 1$ frihetsgrader." },
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["Normal: sannsynlighet mellom to grenser", "Des 2025, oppg. 4a–c", "Standardiser begge grensene og bruk $\\Phi$. Hent $\\sigma$ fra tetthetsformelen."],
          ["Kontinuerlig: punktsannsynlighet", "Des 2025, oppg. 4d", "$P(Y = y) = 0$. Bare intervaller har positiv sannsynlighet."],
        ] },
        { type: "example", title: "Des 2025, oppg. 4c: normal med $\\mu = 2$ og $\\sigma = 5$", blocks: [
          { type: "text", text: "$P(2 \\le Y \\le 4) = \\Phi\\left(\\frac{4 - 2}{5}\\right) - \\Phi(0) = \\Phi(0{,}40) - 0{,}5 = 0{,}6554 - 0{,}5 = 0{,}1554$." },
          { type: "text", text: "$\\Phi(0{,}40) = 0{,}6554$ finner du på side 2." },
        ] },
      ],
    },
  ],
};
