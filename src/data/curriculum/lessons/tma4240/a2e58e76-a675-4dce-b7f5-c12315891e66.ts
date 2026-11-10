import type { Lesson } from "../types";

// Tema 7, Funksjoner av stokastiske variabler. Pensum: WMMY 7.1, 7.2 (unntatt teorem 7.2 og 7.4 med eksempler), 7.3,
// 4.3 fra «What If the Function Is Nonlinear?», 6.5 (normal som tilnærming til binomisk), 8.4 (CLT).
// Formelbok: side 33 (MGF), 34 (transformasjon, lineærkombinasjoner), 35 (fordeling av lineærkombinasjoner, delta-metoden), 31 (grenser), 38 (CLT).

const formelbok = (pages: string) => `(Formelbok ${pages})`;

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "a2e58e76-a675-4dce-b7f5-c12315891e66",
  reviewed: "2026-11-10",
  summary: "Når du har en ny variabel $Y = g(X)$ eller en sum av variabler, spør du: hva er fordelingen, forventningen og variansen? Svarene kommer fra **transformasjonsformelen**, **lineærkombinasjoner**, **delta-metoden** og **momentgenererende funksjoner**. For store $n$ gir **sentralgrenseteoremet** en tilnærmet normalfordeling for gjennomsnittet.",
  overview: [
    "**Transformasjon:** for monoton $g$ og $Y = g(X)$: $f_Y(y) = f_X(w(y)) \\cdot |w'(y)|$, der $w = g^{-1}$.",
    "**Lineær kombinasjon:** $E(Y)$ og $\\text{Var}(Y)$ fra tema 4. Normale variabler gir normal lineærkombinasjon.",
    "**Delta-metoden:** $E[g(X)] \\approx g(\\mu)$ og $\\text{Var}[g(X)] \\approx (g'(\\mu))^2 \\sigma^2$. Dette er feilforplantning.",
    "**MGF:** $M_X(t) = E(e^{tX})$. Den unike MGF-en identifiserer fordelingen. Sum av uavhengige: produkt av MGF-ene.",
    "**CLT:** $(\\bar{X} - \\mu)/(\\sigma/\\sqrt{n}) \\to N(0, 1)$. Normal tilnærming til binomisk: $\\mu = np$, $\\sigma^2 = np(1-p)$.",
  ],
  keyFormulas: [
    { latex: "f_Y(y) = f_X(w(y))\\,|w'(y)|", label: "Transformasjon av én variabel" },
    { latex: "\\text{Var}[g(X)] \\approx \\left(g'(\\mu)\\right)^2 \\sigma^2", label: "Delta-metoden" },
    { latex: "M_X(t) = E(e^{tX})", label: "Momentgenererende funksjon" },
    { latex: "\\dfrac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\approx N(0, 1)", label: "Sentralgrenseteoremet" },
  ],
  goals: [
    "Kunne finne tettheten til $Y = g(X)$ for monotone $g$.",
    "Kunne finne forventning og varians av lineære kombinasjoner, og avgjøre om resultatet er normalt.",
    "Kunne bruke delta-metoden til å tilnærme forventning og varians av $g(X)$.",
    "Kunne bruke CLT og normal tilnærming til binomisk med kontinuitetskorreksjon.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 31, 33–35, 38", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "transformasjon",
      title: "Transformasjon av én variabel",
      blocks: [
        { type: "text", text: "Anta at $g$ er strengt monoton og deriverbar, og at $X = w(Y)$ er den inverse funksjonen. Tettheten til $Y$ er da $f_X$ evaluert i $w(y)$, ganget med den absolutte verdien av den deriverte." },
        { type: "formula", latex: "f_Y(y) = f_X(w(y)) \\cdot |w'(y)|", name: "Transformasjonsformelen", book: { status: "book", pages: "34" }, caption: `Formelboka ${formelbok("s. 34")}. Absoluttverdien er nødvendig for at tettheten skal bli positiv.` },
        { type: "example", title: "$Y = X^2$ med $f(x) = 2x$ på $(0, 1)$", blocks: [
          { type: "text", text: "Den inverse er $w(y) = \\sqrt{y}$, og $w'(y) = \\dfrac{1}{2\\sqrt{y}}$." },
          { type: "text", text: "$f_Y(y) = 2\\sqrt{y} \\cdot \\dfrac{1}{2\\sqrt{y}} = 1$ for $0 < y < 1$. Altså er $Y \\sim U(0, 1)$." },
          { type: "text", text: "Kontroll med fordelingsfunksjonen: $P(Y \\le y) = P(X \\le \\sqrt{y}) = y$, så $F_Y(y) = y$ og $f_Y = 1$." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlig feil", blocks: [
          { type: "text", text: "Å bruke transformasjonsformelen når $g$ ikke er monoton på støtten. For $Y = X^2$ med $X \\in (-1, 1)$ må du dele i to intervaller og legge sammen bidragene." },
        ] },
      ],
    },
    {
      id: "lineaer",
      title: "Lineære kombinasjoner og normalfordelingen",
      blocks: [
        { type: "formula", latex: "E(Y) = \\sum a_i E(X_i) + b, \\qquad \\text{Var}(Y) = \\sum a_i^2\\,\\text{Var}(X_i) \\text{ for uavhengige } X_i", name: "Lineær kombinasjon", book: { status: "book", pages: "34" }, caption: `Formelboka ${formelbok("s. 34")}. Full form med kovarians står i tema 4.` },
        { type: "formula", latex: "Y = \\sum a_i X_i \\sim N\\!\\left(\\sum a_i \\mu_i,\\ \\sum a_i^2 \\sigma_i^2\\right)", name: "Lineær kombinasjon av normale", book: { status: "book", pages: "35" }, caption: `Formelboka ${formelbok("s. 35")}. Gjelder for uavhengige normale $X_i$.` },
        { type: "formula", latex: "\\sum X_i \\sim \\text{Bin}\\!\\left(\\sum m_i, p\\right), \\qquad \\sum X_i \\sim \\text{Po}\\!\\left(\\sum \\mu_i\\right), \\qquad \\sum X_i \\sim \\chi^2\\!\\left(\\sum \\nu_i\\right)", name: "Summer av uavhengige", book: { status: "book", pages: "35" }, caption: `Formelboka ${formelbok("s. 35")}. Samme $p$ for binomisk, og uavhengighet for alle.` },
        { type: "example", title: "$Y = X_1 - 2X_2$", blocks: [
          { type: "text", text: "$X_1 \\sim N(1, 4)$ og $X_2 \\sim N(2, 9)$, uavhengige. $E(Y) = 1 - 2 \\cdot 2 = -3$ og $\\text{Var}(Y) = 4 + 4 \\cdot 9 = 40$." },
          { type: "text", text: "$P(Y > 0) = 1 - \\Phi\\!\\left(\\dfrac{0 + 3}{\\sqrt{40}}\\right) = 1 - \\Phi(0{,}474) \\approx 0{,}318$." },
        ] },
      ],
    },
    {
      id: "delta",
      title: "Feilforplantning og delta-metoden",
      blocks: [
        { type: "text", text: "Når $g$ ikke er lineær, bruker du en første ordens Taylor-utvikling rundt forventningen. Dette gir tilnærmede verdier for forventning og varians. Formelen er også kjent som feilforplantningsformelen." },
        { type: "formula", latex: "E[g(X)] \\approx g(\\mu), \\qquad \\text{Var}[g(X)] \\approx \\sum_i \\left(\\dfrac{\\partial g}{\\partial \\mu_i}\\right)^2 \\text{Var}(X_i) + 2\\sum_{i<j} \\dfrac{\\partial g}{\\partial \\mu_i}\\dfrac{\\partial g}{\\partial \\mu_j}\\text{Cov}(X_i, X_j)", name: "Delta-metoden", book: { status: "book", pages: "35" }, caption: `Formelboka ${formelbok("s. 35")}. Med én variabel: $\\text{Var}[g(X)] \\approx (g'(\\mu))^2\\sigma^2$.` },
        { type: "example", title: "$g(X) = 1/X$ med $\\mu = 2$ og $\\sigma^2 = 0{,}25$", blocks: [
          { type: "text", text: "$E(1/X) \\approx 1/2 = 0{,}5$. $g'(x) = -1/x^2$, så $g'(2) = -1/4$." },
          { type: "text", text: "$\\text{Var}(1/X) \\approx (1/4)^2 \\cdot 0{,}25 = 0{,}015625$, med standardavvik $\\approx 0{,}125$." },
        ] },
        { type: "box", variant: "tip", title: "Tankegang", blocks: [
          { type: "text", text: "Delta-metoden er god når $\\sigma$ er liten i forhold til $\\mu$. Sjekk derfor at variasjonen er liten før du stoler på tilnærmingen." },
        ] },
      ],
    },
    {
      id: "mgf",
      title: "Momentgenererende funksjoner",
      blocks: [
        { type: "formula", latex: "M_X(t) = E(e^{tX}), \\qquad E(X) = M_X'(0), \\qquad E(X^2) = M_X''(0)", name: "Momentgenererende funksjon", book: { status: "book", pages: "33" }, caption: `Formelboka ${formelbok("s. 33")}. Hver fordeling har sin egen $M_X$, som står i formelboka side 25–28.` },
        { type: "formula", latex: "M_{X+Y}(t) = M_X(t)\\,M_Y(t) \\quad \\text{for uavhengige } X, Y", name: "MGF til en sum", book: { status: "missing" }, caption: "Ikke i formelboka. Brukes til å vise at en sum av uavhengige har en kjent fordeling." },
        { type: "example", title: "Summen av to Poisson-variabler", blocks: [
          { type: "text", text: "For $X \\sim \\text{Po}(\\mu_1)$ er $M_X(t) = e^{\\mu_1(e^t - 1)}$ (side 25). Produktet med $M_Y(t) = e^{\\mu_2(e^t - 1)}$ er $e^{(\\mu_1 + \\mu_2)(e^t - 1)}$." },
          { type: "text", text: "Dette er MGF-en til $\\text{Po}(\\mu_1 + \\mu_2)$, så summen er Poisson. Gjennomsnittet er $\\mu_1 + \\mu_2$." },
        ] },
      ],
    },
    {
      id: "clt",
      title: "Sentralgrenseteoremet",
      blocks: [
        { type: "formula", latex: "\\dfrac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\ \\xrightarrow{d}\\ N(0, 1)", name: "Sentralgrenseteoremet", book: { status: "book", pages: "38" }, caption: `Formelboka ${formelbok("s. 38")}. Gjelder for uavhengige og identisk fordelte $X_i$ med endelig varians.` },
        { type: "example", title: "Eksponensial med $\\beta = 2$, $n = 50$", blocks: [
          { type: "text", text: "$E(X) = 2$, $\\text{Var}(X) = 4$, så $\\text{sd}(\\bar{X}) = \\sqrt{4/50} = 0{,}283$." },
          { type: "text", text: "$P(\\bar{X} > 2{,}5) \\approx 1 - \\Phi\\!\\left(\\dfrac{0{,}5}{0{,}283}\\right) = 1 - \\Phi(1{,}77) \\approx 0{,}038$." },
        ] },
      ],
    },
    {
      id: "normal-binomisk",
      title: "Normal tilnærming til binomisk",
      blocks: [
        { type: "formula", latex: "X \\approx N\\big(np,\\ np(1-p)\\big), \\qquad P(X \\le x) \\approx \\Phi\\!\\left(\\dfrac{x + 0{,}5 - np}{\\sqrt{np(1-p)}}\\right)", name: "Normal tilnærming til binomisk", book: { status: "partial", pages: "31", missing: "Kontinuitetskorreksjonen ±0,5 må læres; boka har μ = np og σ² = np(1 − p)" }, caption: `Grensen er vist i formelboka ${formelbok("s. 31")}. Kontinuitetskorreksjonen $\\pm 0{,}5$ er ikke i boka.` },
        { type: "example", title: "$X \\sim \\text{Bin}(100, 0{,}3)$", blocks: [
          { type: "text", text: "$\\mu = 30$ og $\\sigma^2 = 21$, så $\\sigma \\approx 4{,}58$." },
          { type: "text", text: "$P(X \\le 25) \\approx \\Phi\\!\\left(\\dfrac{25{,}5 - 30}{4{,}58}\\right) = \\Phi(-0{,}98) \\approx 0{,}163$." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlige feil", blocks: [
          { type: "list", items: [
            "Å glemme kontinuitetskorreksjonen. $P(X \\le 25)$ bruker $25{,}5$, og $P(X \\ge 25)$ bruker $24{,}5$.",
            "Å bruke normalfordeling når $np$ eller $n(1-p)$ er lav. Tommelfingerregelen er minst 5 i hver.",
          ] },
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["Transformasjon av tetthet", "Des 2025, oppg. 5d", "$f_Y(y) = f_X(w(y))\\,|w'(y)|$. Her er $Y = 2e^{-X+\\mu}$, og tettheten blir $\\tfrac{1}{2}e^{-y/2}$, altså $\\chi^2_2$."],
          ["Pivotal størrelse fra transformasjon", "Des 2025, oppg. 5d", "$\\sum 2e^{-X_i+\\mu} \\sim \\chi^2_{2n}$ uavhengig av $\\mu$, så den er pivotal."],
          ["Normal tilnærming til differanse", "Aug 2026, oppg. 4d", "$X - Y$ er tilnærmet normal. Bruk kontinuitetskorreksjon $\\pm 0{,}5$ når variablene er heltall."],
          ["Fordeling av transformert variabel (TMA4245)", "Mai 2026, oppg. 9b", "Vis $F_Y(y) = P(Y \\le y)$ først og deriver. Kjenn igjen $\\chi^2_2$-tettheten, som er eksponensial med $\\beta = 2$ (formelbok s. 27)."],
        ] },
        { type: "example", title: "Aug 2026, oppg. 4d: $P(X - Y > 0{,}5)$", blocks: [
          { type: "text", text: "$E(X - Y) = 0{,}8$ og $\\text{Var}(X - Y) = 1{,}6$. Seier for lag A er $X - Y \\ge 1$, og kontinuitetskorreksjonen gir grensen $0{,}5$." },
          { type: "text", text: "$P(X - Y > 0{,}5) \\approx 1 - \\Phi\\left(\\frac{0{,}5 - 0{,}8}{\\sqrt{1{,}6}}\\right) = 1 - \\Phi(-0{,}237) \\approx 0{,}594$." },
        ] },
      ],
    },
  ],
};
