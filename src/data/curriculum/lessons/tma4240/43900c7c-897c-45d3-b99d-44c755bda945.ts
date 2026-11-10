import type { Lesson } from "../types";

// Tema 3, Stokastisk simulering. Pensum: Evans & Rosenthal Kap 2.10 og 4.5 (hele), jf. emnematrisa uke 36.
// Forelesningsnotatene (uke 3 og 5) bruker inversjonsmetoden med numpy. Eksponensial står i formelboka side 26 med β.

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "43900c7c-897c-45d3-b99d-44c755bda945",
  reviewed: "2026-11-10",
  summary: "Simulering betyr å trekke tilfeldige tall fra en gitt fordeling. Med **inversjonsmetoden** kan du bruke et uniformt tall $U \\sim \\text{U}(0, 1)$ og få $X = F^{-1}(U)$, der $F$ er fordelingsfunksjonen. Monte Carlo-estimatet er gjennomsnittet av mange simuleringer.",
  overview: [
    "**Uniform:** $U \\sim \\text{U}(0, 1)$ gir alle tall i $(0, 1)$ like sannsynlig. Pseudotilfeldige tall er deterministiske, men ser tilfeldige ut.",
    "**Inversjonsmetoden:** $X = F^{-1}(U)$ har fordelingsfunksjon $F$. Dette er grunnlaget for all simulering i pensum.",
    "**Eksponensial med β:** $F(x) = 1 - e^{-x/\\beta}$, så $X = -\\beta \\ln(1 - U)$.",
    "**Diskret:** finn minste $x$ slik at $F(x) \\ge U$.",
    "**Monte Carlo:** $\\hat{p} = (\\text{antall som oppfyller } A)/N$ estimerer $P(A)$ med standardfeil $\\sqrt{p(1-p)/N}$.",
  ],
  keyFormulas: [
    { latex: "X = F^{-1}(U), \\qquad U \\sim \\text{U}(0, 1)", label: "Inversjonsmetoden" },
    { latex: "X = -\\beta\\ln(1 - U)", label: "Eksponensial med gjennomsnitt β" },
    { latex: "\\hat{p} = \\dfrac{\\text{antall } A}{N}", label: "Monte Carlo-estimat" },
  ],
  goals: [
    "Kunne forklare hvorfor $F^{-1}(U)$ har fordelingsfunksjon $F$.",
    "Kunne simulere fra en eksponensial- og en diskret fordeling med en gitt $F$.",
    "Kunne tolke et Monte Carlo-estimat og dets usikkerhet.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 26", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "inversjon",
      title: "Inversjonsmetoden",
      blocks: [
        { type: "text", text: "Anta at $F$ er strengt voksende. La $U \\sim \\text{U}(0, 1)$, og la $X = F^{-1}(U)$. Da er $P(X \\le x) = P(F^{-1}(U) \\le x) = P(U \\le F(x)) = F(x)$. Derfor har $X$ fordelingsfunksjon $F$." },
        { type: "formula", latex: "P(X \\le x) = P(U \\le F(x)) = F(x)", name: "Hvorfor inversjonsmetoden virker", caption: "Argumentet må kunnes. Det står ikke i formelboka." },
        { type: "example", title: "Eksponensial med $\\beta = 10$", blocks: [
          { type: "text", text: "$F(x) = 1 - e^{-x/10}$. Løs $u = 1 - e^{-x/10}$ for $x$: $e^{-x/10} = 1 - u$, så $x = -10\\ln(1 - u)$." },
          { type: "text", text: "Med $u = 0{,}5$ får du $x = -10\\ln(0{,}5) \\approx 6{,}93$. Forventningen er $\\beta = 10$, så 6,93 er under medianen." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlig feil", blocks: [
          { type: "text", text: "Å bruke $\\lambda$ der formelboka bruker $\\beta$. Formelboka har $f(x) = \\frac{1}{\\beta}e^{-x/\\beta}$ og $\\lambda = 1/\\beta$ (side 26). Sjekk hva oppgaven gir." },
        ] },
      ],
    },
    {
      id: "diskret",
      title: "Simulering fra en diskret fordeling",
      blocks: [
        { type: "text", text: "For diskrete variabler er $F$ en trappefunksjon. Sett $X = x_k$ der $F(x_{k-1}) < U \\le F(x_k)$. Det er den minste $x$ med $F(x) \\ge U$." },
        { type: "formula", latex: "X = x_k \\quad \\text{når} \\quad F(x_{k-1}) < U \\le F(x_k)", name: "Diskret inversjon", caption: "Ikke i formelboka. Metoden er den samme som for kontinuerlige fordelinger." },
        { type: "example", title: "Tre utfall", blocks: [
          { type: "text", text: "$P(X = 0) = 0{,}3$, $P(X = 1) = 0{,}5$ og $P(X = 2) = 0{,}2$. Da er $F(0) = 0{,}3$, $F(1) = 0{,}8$ og $F(2) = 1$." },
          { type: "text", text: "$U = 0{,}25$ gir $X = 0$. $U = 0{,}65$ gir $X = 1$. $U = 0{,}9$ gir $X = 2$." },
        ] },
      ],
    },
    {
      id: "monte-carlo",
      title: "Monte Carlo-estimat",
      blocks: [
        { type: "text", text: "Simuler $N$ uavhengige utfall og tell hvor ofte hendelsen $A$ inntreffer. Relativ frekvens estimerer $P(A)$. Estimatet er forventningsrett og har standardfeil som avtar med $\\sqrt{N}$." },
        { type: "formula", latex: "\\hat{p} = \\dfrac{\\text{antall } A}{N}, \\qquad E(\\hat{p}) = p, \\qquad \\text{sd}(\\hat{p}) = \\sqrt{\\dfrac{p(1-p)}{N}}", name: "Monte Carlo-estimat", caption: "Ikke i formelboka. Usikkerheten avhenger av $p$ og $N$, ikke av størrelsen på populasjonen." },
        { type: "example", title: "Sum av tre terningkast", blocks: [
          { type: "text", text: "Simuler $W = X + Y + Z$ med tre terninger. Estimatet for $P(W \\ge 15)$ er antall simuleringer med $W \\ge 15$ delt på $N$." },
          { type: "text", text: "Teoretisk er $E(W) = 3 \\cdot 3{,}5 = 10{,}5$. Kontroller at simuleringen gir gjennomsnitt nær 10,5 før du stoler på resten." },
        ] },
      ],
    },
    {
      id: "feil",
      title: "Typiske feil",
      blocks: [
        { type: "list", items: [
          "En simulering gir en tilnærming. Ett estimat med $N = 100$ kan avvike mye fra den sanne sannsynligheten.",
          "Å bruke samme tilfeldige tall for alle variablene. Bruk nye $U$-tall for hver variabel og hver simulering.",
          "Å glemme minustegnet i $X = -\\beta\\ln(1 - U)$. Da blir simulerte verdier negative.",
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["Simulering ved inversjon", "Des 2025, oppg. 5b", "Løs $F(x) = u$ for $x$. Gumbel-fordelingen står ikke i formelboka, så $F$ må gis i oppgaven."],
          ["Monte Carlo-estimat for $P(X > Y)$", "Aug 2026, oppg. 4c", "Simuler mange par, tell hvor ofte hendelsen inntreffer, og del på antall simuleringer."],
        ] },
        { type: "example", title: "Aug 2026, oppg. 4c: estimat fra 1000 simuleringer", blocks: [
          { type: "text", text: "Tabellen har 1000 realisasjoner. Summen av cellene der $x > y$ er $233 + (132 + 67) + (61 + 17 + 4) + (23 + 6 + 1) + (3 + 2) = 549$." },
          { type: "text", text: "Estimatet er $\\hat{p} = 549/1000 = 0{,}549$, med standardfeil $\\sqrt{0{,}549 \\cdot 0{,}451/1000} \\approx 0{,}016$." },
          { type: "text", text: "Kontroll: alle celler summerer til 1000." },
        ] },
      ],
    },
  ],
};
