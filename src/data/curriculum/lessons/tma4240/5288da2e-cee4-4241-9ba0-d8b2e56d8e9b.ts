import type { Lesson } from "../types";

// Tema 8, Parameterestimering. Pensum: WMMY Kap 1 (1.1–1.7), 8.1–8.3, 8.8 (QQ-plott), 9.1–9.5 og 9.14 (maks. sannsynlighet).
// Formelbok: side 27 (S² og χ²/t-fordelinger), 35 (varians av lineærkombinasjoner), 38 (konsistens).

const formelbok = (pages: string) => `(Formelbok ${pages})`;

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "5288da2e-cee4-4241-9ba0-d8b2e56d8e9b",
  reviewed: "2026-11-10",
  summary: "Målet er å bruke et utvalg til å anslå ukjente parametre som $\\mu$, $\\sigma^2$ eller $\\beta$. En **estimator** er en formel for utvalget, og et **estimat** er tallet du får når du setter inn data. God estimator er **forventningsrett** og **konsistent**. **Maksimum-likelihood** gir en systematisk metode for å finne estimatorer.",
  overview: [
    "**Estimator** $\\hat{\\theta}$ er en funksjon av utvalget. **Estimat** er verdien for det konkrete utvalget.",
    "**Forventningsrett:** $E(\\hat{\\theta}) = \\theta$. Gjennomsnittet $\\bar{X}$ er forventningsrett for $\\mu$, og $S^2$ er forventningsrett for $\\sigma^2$.",
    "**Varians av $\\bar{X}$:** $\\sigma^2/n$. Standardfeilen er $\\sigma/\\sqrt{n}$.",
    "**Konsistens:** $\\hat{\\theta} \\to \\theta$ når $n \\to \\infty$. Holder når $E(\\hat{\\theta}) \\to \\theta$ og $\\text{Var}(\\hat{\\theta}) \\to 0$.",
    "**Maks. sannsynlighet:** finn $\\theta$ som maksimerer $L(\\theta) = \\prod f(x_i; \\theta)$. For eksponensial og normal har du lukkede uttrykk.",
  ],
  keyFormulas: [
    { latex: "S^2 = \\dfrac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})^2", label: "Utvalgsvarians" },
    { latex: "E(\\hat{\\theta}) = \\theta, \\qquad \\text{Var}(\\bar{X}) = \\dfrac{\\sigma^2}{n}", label: "Forventningsrett og varians av gjennomsnitt" },
    { latex: "L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta), \\qquad \\hat{\\theta} = \\arg\\max_\\theta L(\\theta)", label: "Maks. sannsynlighet" },
    { latex: "\\hat{\\beta} = \\bar{x} \\quad \\text{(eksponensial)}, \\qquad \\hat{\\mu} = \\bar{x}, \\ \\hat{\\sigma}^2 = \\dfrac{1}{n}\\sum(x_i - \\bar{x})^2 \\quad \\text{(normal)}", label: "Vanlige maks.-sannsynlighetsestimatorer" },
  ],
  goals: [
    "Kunne skille estimator fra estimat, og avgjøre om en estimator er forventningsrett.",
    "Kunne beregne $\\bar{x}$, $s$ og kvartiler, og lese et boksplott og et QQ-plott.",
    "Kunne finne maks. sannsynlighetsestimatoren for en gitt fordeling.",
    "Kunne forklare hvorfor $S^2$ deler på $n - 1$, og ikke på $n$.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 27, 35, 38", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "beskrivende",
      title: "Beskrivende statistikk og plott",
      blocks: [
        { type: "text", text: "Før du estimerer, se på dataene. Histogram og boksplott viser form og utliggere. Et **boksplott** har boks fra $Q_1$ til $Q_3$ og en utligger hvis den ligger utenfor $Q_1 - 1{,}5\\,\\text{IQR}$ eller $Q_3 + 1{,}5\\,\\text{IQR}$, der $\\text{IQR} = Q_3 - Q_1$." },
        { type: "formula", latex: "\\bar{x} = \\dfrac{1}{n}\\sum x_i, \\qquad s = \\sqrt{\\dfrac{1}{n-1}\\sum (x_i - \\bar{x})^2}", name: "Gjennomsnitt og standardavvik", caption: `Formelboka ${formelbok("s. 27")} for $S^2$. Den samme formelen er kvadratroten av varians.` },
        { type: "text", text: "Et **QQ-plott** setter utvalgskvantiler mot de teoretiske normalkvantilene. Punktene ligger nær en rett linje hvis dataene er normale. Kraftig avvik i halene tyder på tunge haler, og en buet linje tyder på skjevhet." },
        { type: "box", variant: "pitfall", title: "Vanlig feil", blocks: [
          { type: "text", text: "Å tolke et QQ-plott som et histogram. Det som betyr noe, er hvor punktene ligger i forhold til linjen, ikke hvor høyt de ligger." },
        ] },
      ],
    },
    {
      id: "estimatorer",
      title: "Estimatorer: forventningsrett og varians",
      blocks: [
        { type: "text", text: "Observatoren er en funksjon av de stokastiske $X_i$. Estimatet er verdien for dine observasjoner. Forventningsrett betyr at du i gjennomsnitt treffer riktig verdi. Varians forteller hvor mye estimatet varierer fra utvalg til utvalg." },
        { type: "formula", latex: "\\text{Bias}(\\hat{\\theta}) = E(\\hat{\\theta}) - \\theta", name: "Bias", caption: "Ikke i formelboka. $\\hat{\\theta}$ er forventningsrett når bias er 0." },
        { type: "formula", latex: "E(\\bar{X}) = \\mu, \\qquad \\text{Var}(\\bar{X}) = \\dfrac{\\sigma^2}{n}", name: "Gjennomsnittet som estimator", caption: `Formelboka ${formelbok("s. 34")}: lineærkombinasjon med $a_i = 1/n$.` },
        { type: "formula", latex: "E(S^2) = \\sigma^2", name: "Utvalgsvariansen er forventningsrett", caption: `Formelboka ${formelbok("s. 27")} gir $(n-1)S^2/\\sigma^2 \\sim \\chi^2_{n-1}$, og forventningen til $\\chi^2_{n-1}$ er $n - 1$.` },
        { type: "example", title: "Hvorfor $n - 1$?", blocks: [
          { type: "text", text: "Med $\\sum (x_i - \\bar{x})^2$ er summen alltid mindre enn $\\sum (x_i - \\mu)^2$, fordi $\\bar{x}$ er valgt til å minimere den. Å dele på $n$ gir en systematisk underestimering av $\\sigma^2$. Å dele på $n - 1$ kompenserer for at en frihetsgrad er brukt på $\\bar{x}$." },
        ] },
        { type: "formula", latex: "\\text{MSE}(\\hat{\\theta}) = \\text{Var}(\\hat{\\theta}) + \\text{Bias}(\\hat{\\theta})^2", name: "Middelkvadratfeil", caption: "Ikke i formelboka. Brukes til å sammenligne estimatorer med forskjellig bias og varians." },
      ],
    },
    {
      id: "konsistens",
      title: "Konsistens",
      blocks: [
        { type: "formula", latex: "E(\\hat{\\theta}_n) \\to \\theta \\quad \\text{og} \\quad \\text{Var}(\\hat{\\theta}_n) \\to 0 \\quad \\Rightarrow \\quad \\hat{\\theta}_n \\xrightarrow{p} \\theta", name: "Konsistens", caption: `Formelboka ${formelbok("s. 38")}. Konvergens i sannsynlighet er definert der.` },
        { type: "text", text: "Konsistens er en egenskap ved hele følgen av estimatorer når $n$ vokser. Den sier ikke noe om små utvalg." },
      ],
    },
    {
      id: "mle",
      title: "Maksimum-likelihood",
      blocks: [
        { type: "text", text: "Likelihood er sannsynligheten for de observerte dataene, uttrykt som funksjon av parameteren. Maksimer $L(\\theta)$, eller $\\ell(\\theta) = \\ln L(\\theta)$, som er lettere å derivere." },
        { type: "formula", latex: "L(\\theta) = \\prod_{i=1}^{n} f(x_i; \\theta), \\qquad \\ell(\\theta) = \\sum_{i=1}^{n} \\ln f(x_i; \\theta)", name: "Likelihood og log-likelihood", caption: "Ikke i formelboka. Sett $\\partial \\ell/\\partial\\theta = 0$ og sjekk at det er et maksimum." },
        { type: "example", title: "Eksponensial med $\\beta$", blocks: [
          { type: "text", text: "$f(x; \\beta) = \\frac{1}{\\beta}e^{-x/\\beta}$, så $\\ell(\\beta) = -n\\ln\\beta - \\frac{1}{\\beta}\\sum x_i$." },
          { type: "text", text: "$\\dfrac{d\\ell}{d\\beta} = -\\dfrac{n}{\\beta} + \\dfrac{\\sum x_i}{\\beta^2} = 0$ gir $\\hat{\\beta} = \\bar{x}$." },
          { type: "text", text: "For $x = (2, 3, 5, 4)$ er $\\hat{\\beta} = 3{,}5$." },
        ] },
        { type: "example", title: "Normal med ukjent $\\mu$ og $\\sigma^2$", blocks: [
          { type: "text", text: "Deriver $\\ell(\\mu, \\sigma^2)$ med hensyn på $\\mu$ og $\\sigma^2$. Løsningen er $\\hat{\\mu} = \\bar{x}$ og $\\hat{\\sigma}^2 = \\frac{1}{n}\\sum(x_i - \\bar{x})^2$." },
          { type: "text", text: "$\\hat{\\sigma}^2$ deler på $n$, ikke $n - 1$. Den er derfor ikke forventningsrett, men er likevel konsistent." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlige feil", blocks: [
          { type: "list", items: [
            "Å forveksle $S^2$ (deler på $n-1$) og $\\hat{\\sigma}^2$ (deler på $n$, fra MLE).",
            "Å glemme at støtten begrenser parameteren. For eksponensial må $\\beta > 0$.",
            "Å tro at maksimum alltid er der $\\ell' = 0$. Sjekk også endepunkter og at den andrederiverte er negativ.",
          ] },
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["Maks. sannsynlighet, normal med kjent σ", "Aug 2026, oppg. 6a", "$L(\\mu) = \\prod f(x_i;\\mu)$, log og deriver. Løsningen er $\\hat\\mu = \\bar{X}$."],
          ["Maks. sannsynlighet med transformert log-sannsynlighet", "Des 2025, oppg. 5c", "Vis tettheten først. Deriver log-likelihood med hensyn på $\\mu$, og løs $\\ell'(\\mu) = 0$."],
          ["Maks. sannsynlighet for en vektet sum (TMA4245)", "Mai 2026, oppg. 4", "Med $X \\sim N(\\mu, 4)$ og $Y \\sim N(2\\mu, 9)$ uavhengige: $\\ell'(\\mu) = 0$ gir $\\hat\\mu = (9X + 8Y)/25$."],
          ["Velge mellom to forventningsrette estimatorer (TMA4245)", "Mai 2026, oppg. 9c", "Sjekk forventningsrett først. Foretrekk den med minst varians, og begrunn."],
        ] },
        { type: "example", title: "Aug 2026, oppg. 6a: estimat for forventet vektøkning", blocks: [
          { type: "text", text: "$\\hat\\mu = \\frac{1}{10}\\sum x_i = \\frac{52{,}65}{10} = 5{,}265$." },
        ] },
        { type: "example", title: "Des 2025, oppg. 5c: estimat for μ i flomhøyde-modellen", blocks: [
          { type: "text", text: "$\\hat\\mu = \\ln n - \\ln \\sum e^{-X_i}$. Med $n = 50$ og $\\sum e^{-x_i} = 253{,}4$ blir $\\hat\\mu = \\ln 50 - \\ln 253{,}4 \\approx -1{,}62$." },
        ] },
      ],
    },
    {
      id: "simulering-estimator",
      title: "Estimering og stokastisk simulering",
      blocks: [
        { type: "text", text: "Når en estimator er vanskelig å analysere, simulerer du mange utvalg fra en modell med kjent parameter, beregner estimatoren for hvert utvalg, og ser på gjennomsnitt og spredning. Gjennomsnittet minus den sanne verdien estimerer bias, og standardavviket estimerer standardfeilen." },
        { type: "pseudocode", title: "Simuler egenskapene til en estimator", lines: [
          "for i = 1 til N:",
          "  simuler x₁, …, xₙ fra modellen med sann θ",
          "  θ̂ᵢ ← estimator(x₁, …, xₙ)",
          "bias ≈ gjennomsnitt(θ̂ᵢ) − θ",
          "standardfeil ≈ sd(θ̂ᵢ)",
        ], caption: "Med stor $N$ er simuleringsfeilen liten. Den gir ikke en eksakt verdi." },
      ],
    },
  ],
};
