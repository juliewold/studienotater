import type { Lesson } from "../types";

// Tema 9, Konfidens- og prediksjonsintervall. Pensum: WMMY 8.5–8.6, 9.2–9.6, 9.8 (til «Variances Unknown but Equal»), 9.10, 9.12.
// Formelbok: side 3 (z), 4 (t), 5 (χ²), 8–9 (F, α = 0,025).

const formelbok = (pages: string) => `(Formelbok ${pages})`;

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "ecbc0608-01fe-465f-9141-3e01f8551849",
  reviewed: "2026-11-10",
  summary: "Et **konfidensintervall** (KI) er en regel som fanger den ukjente parameteren med sannsynlighet $1 - \\alpha$ i gjentatte utvalg. Oppskriften er nesten alltid **estimat ± kritisk verdi · standardfeil**. Velg riktig kritisk verdi ($z$, $t$, $\\chi^2$ eller $F$) ut fra hva som er kjent. Et **prediksjonsintervall** dekker en ny observasjon, og er bredere.",
  overview: [
    "**Oppskrift:** estimat ± kritisk verdi · standardfeil. Standardfeil er $\\sigma/\\sqrt{n}$ med $\\sigma$ kjent, og $s/\\sqrt{n}$ med $\\sigma$ ukjent.",
    "**$z$ eller $t$ for $\\mu$:** $z$ hvis $\\sigma$ er kjent. $t_{n-1}$ hvis $\\sigma$ er ukjent og estimeres med $s$. Bruk aldri $z$ med ukjent $\\sigma$ og små $n$.",
    "**Varians:** KI for $\\sigma^2$ bruker $\\chi^2$, og er ikke symmetrisk rundt $s^2$.",
    "**Andel:** $\\hat{p} \\pm z\\sqrt{\\hat{p}(1-\\hat{p})/n}$ når $n$ er stor nok.",
    "**Prediksjon:** en ny observasjon $X_{n+1}$ har større usikkerhet enn gjennomsnittet, så intervallet er bredere.",
  ],
  keyFormulas: [
    { latex: "\\bar{x} \\pm z_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}}", label: "KI for μ, σ kjent" },
    { latex: "\\bar{x} \\pm t_{\\alpha/2,\\,n-1}\\dfrac{s}{\\sqrt{n}}", label: "KI for μ, σ ukjent" },
    { latex: "\\left(\\dfrac{(n-1)s^2}{\\chi^2_{\\alpha/2,\\,n-1}},\\ \\dfrac{(n-1)s^2}{\\chi^2_{1-\\alpha/2,\\,n-1}}\\right)", label: "KI for σ²" },
    { latex: "\\bar{x} \\pm t_{\\alpha/2,\\,n-1}\\, s\\sqrt{1 + \\dfrac{1}{n}}", label: "Prediksjonsintervall for en ny observasjon" },
  ],
  goals: [
    "Kunne velge riktig kritisk verdi og standardfeil for μ, σ², andel og forskjell i gjennomsnitt.",
    "Kunne finne KI for σ² med $\\chi^2$ (læreboka 9.12) og KI for μ₁ − μ₂ når variansene er ulike (9.8).",
    "Kunne skille mellom konfidensintervall og prediksjonsintervall.",
    "Kunne beregne nødvendig utvalgsstørrelse for en gitt feilmargin.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 3–5, 8–9", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "tolkning",
      title: "Hva et konfidensintervall er",
      blocks: [
        { type: "text", text: "Et 95 % KI betyr at metoden fanger den sanne $\\mu$ i 95 % av gjentatte utvalg. For et enkelt utvalg kan du ikke si at $\\mu$ ligger inne i intervallet med 95 % sannsynlighet, for $\\mu$ er ikke tilfeldig. Intervallet er tilfeldig." },
        { type: "box", variant: "pitfall", title: "Vanlig feil", blocks: [
          { type: "text", text: "«Det er 95 % sannsynlighet for at $\\mu$ ligger mellom 45 og 55.» Dette er feil tolkning. Riktig: «Metoden gir intervaller som dekker $\\mu$ i 95 % av utvalgene.»" },
        ] },
      ],
    },
    {
      id: "mu",
      title: "Gjennomsnitt μ",
      blocks: [
        { type: "formula", latex: "\\bar{x} \\pm z_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}}", name: "KI for μ, σ kjent", caption: `Kritisk verdi $z_{\\alpha/2}$ fra formelboka ${formelbok("s. 3")}. For 95 % er $z_{0{,}025} = 1{,}960$.` },
        { type: "formula", latex: "\\bar{x} \\pm t_{\\alpha/2,\\,n-1}\\dfrac{s}{\\sqrt{n}}", name: "KI for μ, σ ukjent", caption: `Kritisk verdi $t_{\\alpha/2, n-1}$ fra formelboka ${formelbok("s. 4")}. Tabellen gir øvre hale, så bruk $\\alpha/2$.` },
        { type: "example", title: "$n = 16$, $\\bar{x} = 50$, $s = 8$", blocks: [
          { type: "text", text: "$t_{0{,}025, 15} = 2{,}131$. Standardfeilen er $8/\\sqrt{16} = 2$." },
          { type: "text", text: "KI: $50 \\pm 2{,}131 \\cdot 2 = 50 \\pm 4{,}26$, altså $(45{,}74;\\ 54{,}26)$." },
        ] },
      ],
    },
    {
      id: "andel",
      title: "Andel p",
      blocks: [
        { type: "formula", latex: "\\hat{p} \\pm z_{\\alpha/2}\\sqrt{\\dfrac{\\hat{p}(1-\\hat{p})}{n}}", name: "KI for andel", caption: `Tilnærmingen krever at $n\\hat{p}$ og $n(1-\\hat{p})$ er store. Kritisk verdi fra formelboka ${formelbok("s. 3")}.` },
        { type: "example", title: "80 av 200", blocks: [
          { type: "text", text: "$\\hat{p} = 0{,}4$, og $\\sqrt{0{,}4 \\cdot 0{,}6/200} = 0{,}0346$. KI: $0{,}4 \\pm 1{,}96 \\cdot 0{,}0346 = 0{,}4 \\pm 0{,}068$, altså $(0{,}332;\\ 0{,}468)$." },
        ] },
      ],
    },
    {
      id: "varians",
      title: "Varians σ²",
      blocks: [
        { type: "formula", latex: "\\left(\\dfrac{(n-1)s^2}{\\chi^2_{\\alpha/2,\\,n-1}},\\ \\dfrac{(n-1)s^2}{\\chi^2_{1-\\alpha/2,\\,n-1}}\\right)", name: "KI for σ²", caption: `Formelboka ${formelbok("s. 5")} gir øvre hale. Øvre grense bruker $\\chi^2_{1-\\alpha/2}$, som er den nedre verdien. Brukes med normale data.` },
        { type: "example", title: "$n = 10$, $s^2 = 4$", blocks: [
          { type: "text", text: "$\\chi^2_{0{,}025, 9} = 19{,}023$ og $\\chi^2_{0{,}975, 9} = 2{,}700$ (side 5)." },
          { type: "text", text: "Nedre grense: $9 \\cdot 4/19{,}023 = 1{,}89$. Øvre grense: $9 \\cdot 4/2{,}700 = 13{,}33$. KI for $\\sigma^2$ er $(1{,}89;\\ 13{,}33)$." },
          { type: "text", text: "Intervallet er ikke symmetrisk rundt $s^2 = 4$, fordi $\\chi^2$-fordelingen er skjev." },
        ] },
      ],
    },
    {
      id: "to-utvalg",
      title: "To utvalg: forskjell i gjennomsnitt",
      blocks: [
        { type: "formula", latex: "(\\bar{x}_1 - \\bar{x}_2) \\pm t_{\\alpha/2,\\,\\nu} \\sqrt{\\dfrac{s_1^2}{n_1} + \\dfrac{s_2^2}{n_2}}", name: "KI for μ₁ − μ₂ (ulik varians)", caption: "Pensum 9.8 (før «Variances Unknown but Equal»). Frihetsgradene $\\nu$ beregnes med Welch-formelen i læreboka, som ikke står i formelboka. Felles varians (pooled) er ikke pensum." },
        { type: "box", variant: "pitfall", title: "Ikke pensum", blocks: [
          { type: "text", text: "KI for forholdet mellom to varianser (læreboka 9.13) og KI for forskjell i andeler (9.11) er ikke pensum. Variansforholdet brukes bare i testen i tema 10 (10.10)." },
        ] },
      ],
    },
    {
      id: "prediksjon",
      title: "Prediksjonsintervall",
      blocks: [
        { type: "formula", latex: "\\bar{x} \\pm t_{\\alpha/2,\\,n-1}\\, s\\sqrt{1 + \\dfrac{1}{n}}", name: "Prediksjonsintervall", caption: "Ikke i formelboka. Leddet $1$ er usikkerheten i den nye observasjonen, og $1/n$ er usikkerheten i gjennomsnittet." },
        { type: "example", title: "Samme data som over", blocks: [
          { type: "text", text: "$s\\sqrt{1 + 1/16} = 8 \\cdot 1{,}031 = 8{,}25$, og $2{,}131 \\cdot 8{,}25 = 17{,}57$." },
          { type: "text", text: "Prediksjonsintervall: $50 \\pm 17{,}57$, altså $(32{,}43;\\ 67{,}57)$. Det er mye bredere enn KI for $\\mu$." },
        ] },
      ],
    },
    {
      id: "utvalgsstorrelse",
      title: "Velge utvalgsstørrelse",
      blocks: [
        { type: "formula", latex: "n \\ge \\left(\\dfrac{z_{\\alpha/2}\\,\\sigma}{E}\\right)^2", name: "Nødvendig utvalgsstørrelse", caption: "Ikke i formelboka. $E$ er ønsket feilmargin i KI for $\\mu$ med $\\sigma$ kjent. Rund alltid opp." },
        { type: "example", title: "$\\sigma = 8$, $E = 2$, 95 %", blocks: [
          { type: "text", text: "$n \\ge (1{,}96 \\cdot 8/2)^2 = 7{,}84^2 = 61{,}5$. Velg $n = 62$." },
        ] },
        { type: "box", variant: "tip", title: "Hvilket intervall?", blocks: [
          { type: "list", items: [
            "Gjennomsnitt, $\\sigma$ kjent: $z$.",
            "Gjennomsnitt, $\\sigma$ ukjent: $t_{n-1}$.",
            "Andel, stor $n$: $z$ med $\\hat{p}$.",
            "Varians: $\\chi^2_{n-1}$.",
            "Ny observasjon: prediksjonsintervall, bredere enn KI.",
          ] },
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["KI for μ med kjent σ", "Aug 2026, oppg. 6b", "$\\bar{x} \\pm z_{0{,}025}\\,\\sigma/\\sqrt{n}$. Her er $\\sigma = 2$ gitt i oppgaven."],
          ["KI for en funksjon av parameteren", "Aug 2026, oppg. 6d", "Transformer grensene med en monoton funksjon. Her avtar $p$ i $\\mu$, så grensene bytter plass."],
          ["KI med pivotal fordeling", "Des 2025, oppg. 5d", "Bruk en størrelse med kjent fordeling som ikke avhenger av parameteren. Her: $\\chi^2_{2n}$."],
        ] },
        { type: "example", title: "Aug 2026, oppg. 6b: KI for μ", blocks: [
          { type: "text", text: "Gjennomsnitt $5{,}265$, $\\sigma = 2$ og $n = 10$: $5{,}265 \\pm 1{,}96 \\cdot 2/\\sqrt{10} = 5{,}265 \\pm 1{,}239$, altså $(4{,}03;\\ 6{,}50)$." },
        ] },
        { type: "example", title: "Aug 2026, oppg. 6d: KI for p = P(sertifisering)", blocks: [
          { type: "text", text: "Sannsynligheten for at tre baller består er $p(\\mu) = \\Phi\\left(\\frac{10 - \\mu}{2}\\right)^3$, som avtar i $\\mu$." },
          { type: "text", text: "Grensene blir $\\Phi\\left(\\frac{10 - 6{,}50}{2}\\right)^3 \\approx 0{,}884$ og $\\Phi\\left(\\frac{10 - 4{,}03}{2}\\right)^3 \\approx 0{,}996$." },
        ] },
        { type: "example", title: "Des 2025, oppg. 5d: KI for μ med χ²-pivot", blocks: [
          { type: "text", text: "$2e^{\\mu}\\sum e^{-X_i} \\sim \\chi^2_{2n} = \\chi^2_{100}$. Med $\\chi^2_{0{,}975,100} = 74{,}222$ og $\\chi^2_{0{,}025,100} = 129{,}561$ (side 5)." },
          { type: "text", text: "KI for μ: $\\left(\\ln \\frac{74{,}222}{2 \\cdot 253{,}4},\\ \\ln \\frac{129{,}561}{2 \\cdot 253{,}4}\\right) = (-1{,}92;\\ -1{,}36)$." },
        ] },
      ],
    },
    {
      id: "simulering",
      title: "KI og stokastisk simulering",
      blocks: [
        { type: "text", text: "**Dekningssannsynlighet** er sannsynligheten for at et konfidensintervall inneholder den sanne parameteren. Den kan estimeres ved simulering: trekk mange utvalg fra en modell med kjent parameter, lag KI for hvert utvalg, og tell hvor ofte den sanne verdien ligger i intervallet. Dette er pensumemnet «KI og stokastisk simulering» og oppgave 8 i mai 2026 (TMA4245)." },
        { type: "pseudocode", title: "Estimer dekningssannsynligheten", lines: [
          "tell ← 0",
          "for i = 1 til N:",
          "  simuler x₁, …, xₙ fra modellen med sann parameter",
          "  beregn intervallet (L, U) fra utvalget",
          "  if L ≤ sann parameter ≤ U: tell ← tell + 1",
          "p̂ ← tell / N",
        ], caption: "Den forventningsrette estimatoren er $\\hat{p} = \\text{tell}/N$. Standardfeilen er $\\sqrt{\\hat{p}(1-\\hat{p})/N}$." },
        { type: "example", title: "Mai 2026, oppg. 8: gamma med kjent α = 4", blocks: [
          { type: "text", text: "Utvalget kommer fra en gammafordeling med $\\alpha = 4$ og ukjent $\\beta$. Den tilnærmede KI-en for $\\beta$ er gitt i oppgaven som $\\bar{X}/(4 + 3{,}92/\\sqrt{n}) \\le \\beta \\le \\bar{X}/(4 - 3{,}92/\\sqrt{n})$." },
          { type: "text", text: "Simuler $N$ utvalg med sann $\\beta$, lag intervallet for hvert utvalg, og tell hvor ofte $\\beta$ ligger i intervallet. Løsningsforslaget gjør dette med en Python-funksjon med `gamma.rvs`." },
        ] },
      ],
    },
  ],
};
