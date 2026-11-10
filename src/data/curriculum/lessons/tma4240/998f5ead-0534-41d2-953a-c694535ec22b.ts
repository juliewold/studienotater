import type { Lesson } from "../types";
import { NormalRegionFigure, TestChoiceFigure } from "./figures";

// Tema 10, Hypotesetesting. Pensum: WMMY 10.1–10.4, 10.5 (til «Unknown But Equal Variances»), 10.6, 10.7 (delvis), 10.8,
// 10.10 (til «Example 10.13»), 16.1 (fortegnstesten til eksempel 16.2). Permutasjonstest: Ernst Kap 3 og 4.2.
// Formelbok: side 1–5 (z, t, χ²), 6–11 (F), 12–17 (binomisk, fortegnstesten), 27 (samplingfordelinger), 38 (CLT).

const formelbok = (pages: string) => `(Formelbok ${pages})`;

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "998f5ead-0534-41d2-953a-c694535ec22b",
  reviewed: "2026-11-10",
  summary: "En **hypotesetest** avgjør om dataene er i strid med en nullhypotese $H_0$. Du regner ut en **testobservator**, finner **p-verdien** eller sammenligner med en kritisk verdi, og forkaster $H_0$ hvis observasjonen er for usannsynlig under $H_0$. Velg test ut fra hva parameteren er og hva som er kjent.",
  overview: [
    "**Oppskrift:** sett $H_0$ og $H_1$, velg $\\alpha$, beregn testobservatoren, sammenlign med kritisk verdi eller regn $p$-verdi, og konkluder i sammenheng.",
    "**Testobservator** for $\\mu$ med $\\sigma$ kjent: $Z = (\\bar{X} - \\mu_0)/(\\sigma/\\sqrt{n})$. Med $\\sigma$ ukjent: $T = (\\bar{X} - \\mu_0)/(S/\\sqrt{n}) \\sim t_{n-1}$.",
    "**p-verdi** er sannsynligheten for at testobservatoren er minst så ekstrem som observert, gitt at $H_0$ er sann.",
    "**Type I-feil** er å forkaste $H_0$ når den er sann (sannsynlighet $\\alpha$). **Type II-feil** er å ikke forkaste $H_0$ når den er falsk (sannsynlighet $\\beta$). Styrke er $1 - \\beta$.",
    "**Dualitet:** en tosidig test på nivå $\\alpha$ forkaster $\\mu_0$ nøyaktig når $\\mu_0$ ligger utenfor $(1 - \\alpha)$-KI.",
  ],
  keyFormulas: [
    { latex: "Z = \\dfrac{\\bar{X} - \\mu_0}{\\sigma/\\sqrt{n}} \\sim N(0,1), \\qquad T = \\dfrac{\\bar{X} - \\mu_0}{S/\\sqrt{n}} \\sim t_{n-1}", label: "Testobservatorer for μ" },
    { latex: "\\dfrac{(n-1)S^2}{\\sigma_0^2} \\sim \\chi^2_{n-1}", label: "Test for σ²" },
    { latex: "\\beta = \\Phi\\!\\left(z_\\alpha - \\dfrac{(\\mu_1 - \\mu_0)\\sqrt{n}}{\\sigma}\\right)", label: "Type II-feil for høyresidig z-test" },
    { latex: "\\hat{p} = \\dfrac{\\text{antall positive}}{n}, \\qquad X \\sim \\text{Bin}(n, \\tfrac{1}{2}) \\text{ under } H_0", label: "Fortegnstesten" },
  ],
  goals: [
    "Kunne formulere $H_0$ og $H_1$, og velge riktig test for μ, σ², p og forskjell i gjennomsnitt.",
    "Kunne regne ut en p-verdi og tolke den riktig.",
    "Kunne beregne type II-feil og styrke for en z-test.",
    "Kunne bruke KI til å teste og fortegnstesten når data ikke er normale.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 1–17, 27, 38", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "oppskrift",
      title: "Hypoteser og testobservator",
      blocks: [
        { type: "text", text: "$H_0$ er det du antar inntil det motsatte er vist, for eksempel $\\mu = \\mu_0$. $H_1$ er alternativet, for eksempel $\\mu > \\mu_0$ (ensidig) eller $\\mu \\ne \\mu_0$ (tosidig). Hypotesene settes før du ser på dataene." },
        { type: "formula", latex: "Z = \\dfrac{\\bar{X} - \\mu_0}{\\sigma/\\sqrt{n}} \\sim N(0, 1) \\text{ under } H_0", name: "z-test for μ (σ kjent)", caption: `Formelboka ${formelbok("s. 1–3")}. Samplingfordelingen følger av normalitet eller CLT ${formelbok("s. 38")}.` },
        { type: "formula", latex: "T = \\dfrac{\\bar{X} - \\mu_0}{S/\\sqrt{n}} \\sim t_{n-1} \\text{ under } H_0", name: "t-test for μ (σ ukjent)", caption: `Formelboka ${formelbok("s. 27")}. Kritisk verdi fra tabellen på side 4.` },
        { type: "example", title: "$\\mu_0 = 50$, $\\sigma = 8$, $n = 16$, $\\bar{x} = 54$", blocks: [
          { type: "text", text: "$H_0: \\mu = 50$ mot $H_1: \\mu \\ne 50$. $z = (54 - 50)/(8/4) = 2$." },
          { type: "text", text: "Tosidig $p = 2(1 - \\Phi(2)) = 2 \\cdot 0{,}0228 = 0{,}0455$. Siden $0{,}0455 < 0{,}05$, forkastes $H_0$ på 5 %-nivå." },
        ] },
        { type: "figure", component: () => NormalRegionFigure({ label: "Forkastningsområdet for tosidig z-test på 5 %-nivå", shaded: [[-4, -1.96], [1.96, 4]], marks: [{ z: -1.96, text: "−1,96" }, { z: 1.96, text: "1,96" }] }), caption: "Under $H_0$ er $Z \\sim N(0, 1)$. Forkastningsområdet er områdene der $|Z| > 1{,}96$, med samlet areal 0,05." },
      ],
    },
    {
      id: "feil",
      title: "Type I- og type II-feil og styrke",
      blocks: [
        { type: "text", text: "$\\alpha$ bestemmer hvor stor type I-feilsannsynligheten skal være, og du velger den før testen. $\\beta$ avhenger av hvor sann $H_1$ er, og av $n$. Styrken $1 - \\beta$ er sannsynligheten for å forkaste $H_0$ når $H_1$ er sann." },
        { type: "formula", latex: "\\beta = \\Phi\\!\\left(z_\\alpha - \\dfrac{(\\mu_1 - \\mu_0)\\sqrt{n}}{\\sigma}\\right), \\qquad 1 - \\beta = \\text{styrke}", name: "Type II-feil for høyresidig z-test", caption: `Formelbokas $\\Phi$-tabell side 1–2 og kritisk verdi $z_\\alpha$ side 3. Ikke i boka som formel.` },
        { type: "example", title: "Styrke ved $\\mu_1 = 54$", blocks: [
          { type: "text", text: "Høyresidig test, $\\alpha = 0{,}05$, $z_\\alpha = 1{,}645$. $\\delta = \\mu_1 - \\mu_0 = 4$, og $\\delta\\sqrt{n}/\\sigma = 4 \\cdot 4/8 = 2$." },
          { type: "text", text: "$\\beta = \\Phi(1{,}645 - 2) = \\Phi(-0{,}355) \\approx 0{,}361$. Styrken er $0{,}639$." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlige feil", blocks: [
          { type: "list", items: [
            "Å si at du «aksepterer $H_0$» når du ikke forkaster den. Du har ikke vist at den er sann.",
            "Å øke $\\alpha$ etter at du har sett på dataene, for å få signifikans.",
            "Å tro at $\\alpha$ og $\\beta$ må summere til 1. De er sannsynligheter under forskjellige hypoteser.",
          ] },
        ] },
      ],
    },
    {
      id: "p-verdi",
      title: "p-verdien",
      blocks: [
        { type: "text", text: "$p$-verdien er sannsynligheten under $H_0$ for å få en testobservator minst like ekstrem som den observerte. Liten $p$ betyr at dataene er lite forenlige med $H_0$." },
        { type: "formula", latex: "p = P(\\text{testobservator så ekstrem som observert} \\mid H_0)", name: "p-verdi", caption: "Ikke i formelboka. For t-testen finner du intervallet for $p$ med tabellen på side 4." },
        { type: "example", title: "Samme data, t-test", blocks: [
          { type: "text", text: "$s = 8$, så $t = (54 - 50)/(8/4) = 2$ med $\\nu = 15$. Side 4: $t_{0{,}025, 15} = 2{,}131$ og $t_{0{,}05, 15} = 1{,}753$." },
          { type: "text", text: "Siden $1{,}753 < 2 < 2{,}131$, er den tosidige $p$-verdien mellom 0,05 og 0,10. Ikke forkast $H_0$ på 5 %-nivå." },
        ] },
        { type: "box", variant: "tip", title: "Tankegang", blocks: [
          { type: "text", text: "Når oppgaven bruker z, er $p$-verdien eksakt fra $\\Phi$. Når den bruker t, gir tabellen bare et intervall for $p$. Skriv begge deler i svaret." },
        ] },
      ],
    },
    {
      id: "andre-tester",
      title: "Varians, andel og forhold mellom varianser",
      blocks: [
        { type: "formula", latex: "\\dfrac{(n-1)S^2}{\\sigma_0^2} \\sim \\chi^2_{n-1} \\text{ under } H_0", name: "χ²-test for σ²", caption: `Formelboka ${formelbok("s. 27")}, med kritiske verdier fra side 5.` },
        { type: "formula", latex: "\\dfrac{S_1^2}{S_2^2} \\sim F_{n_1-1,\\, n_2-1} \\text{ under } H_0: \\sigma_1^2 = \\sigma_2^2", name: "F-test for to varianser", caption: `Formelboka ${formelbok("s. 6–11")}. Telleren har $n_1 - 1$ frihetsgrader.` },
        { type: "formula", latex: "Z = \\dfrac{\\hat{p} - p_0}{\\sqrt{p_0(1-p_0)/n}} \\approx N(0, 1)", name: "z-test for andel", caption: `Tilnærmingen følger av CLT ${formelbok("s. 38")}. Bruk $p_0$ i standardfeilen under $H_0$.` },
      ],
    },
    {
      id: "ki",
      title: "Konfidensintervall og tosidig test",
      blocks: [
        { type: "text", text: "En tosidig test på nivå $\\alpha$ og et $(1 - \\alpha)$-konfidensintervall gir samme konklusjon. Forkast $\\mu_0$ hvis og bare hvis $\\mu_0$ ligger utenfor intervallet." },
        { type: "example", title: "Samme data som over", blocks: [
          { type: "text", text: "95 % KI for $\\mu$: $54 \\pm 2{,}131 \\cdot 2 = (49{,}74;\\ 58{,}26)$. Det inneholder 50, så $H_0$ forkastes ikke. Det stemmer med at den eksakte tosidige $p$-verdien er ca. $0{,}064$ (mellom 0,05 og 0,10 i tabellen)." },
        ] },
      ],
    },
    {
      id: "fortegn",
      title: "Fortegnstesten og permutasjonstest",
      blocks: [
        { type: "text", text: "Fortegnstesten brukes når du ikke kan anta normalitet. Du teller hvor mange differanser som er positive. Under $H_0$ (medianen er $\\mu_0$) er antallet $X \\sim \\text{Bin}(n, \\tfrac{1}{2})$." },
        { type: "formula", latex: "P(X \\ge x) = \\sum_{k=x}^{n} \\binom{n}{k} \\left(\\tfrac{1}{2}\\right)^n", name: "Fortegnstesten", caption: `Tabell for binomisk på side 12–17 med $p = 0{,}50$ ${formelbok("s. 12–17")}. Pensum er til eksempel 16.2.` },
        { type: "example", title: "8 av 10 positive", blocks: [
          { type: "text", text: "Tosidig: $P(X \\ge 8) = \\dfrac{45 + 10 + 1}{1024} = 0{,}0547$. Dobbelt for tosidig gir $0{,}109$. Ikke forkast $H_0$ på 5 %-nivå." },
          { type: "text", text: "Hvis testen er ensidig og $\\alpha = 0{,}05$, forkastes $H_0$ ikke, fordi $0{,}0547 > 0{,}05$." },
        ] },
        { type: "text", text: "**Permutasjonstest:** under $H_0$ er alle permutasjoner av merkelappene like sannsynlige. Telle hvor mange permutasjoner gir en testobservator minst så ekstrem som den observerte, og del på totalt antall permutasjoner. Dette er eksakt $p$-verdi uten normalitet. (Ernst Kap 3 og 4.2.)" },
      ],
    },
    {
      id: "velg",
      title: "Velge test",
      blocks: [
        { type: "figure", component: TestChoiceFigure, caption: "Start med hva parameteren er, og hva som er kjent. Velg deretter testobservator og fordeling." },
        { type: "box", variant: "pitfall", title: "Typiske feil i besvarelsen", blocks: [
          { type: "list", items: [
            "Å bruke $z$ når $\\sigma$ er ukjent. Bruk $t$ med $S$.",
            "Å glemme å si om testen er ensidig eller tosidig før du ser på dataene.",
            "Å skrive «$p = 0{,}05$ betyr at $H_0$ er riktig». $p$ er ikke sannsynligheten for $H_0$.",
          ] },
        ] },
      ],
    },
  ],
};
