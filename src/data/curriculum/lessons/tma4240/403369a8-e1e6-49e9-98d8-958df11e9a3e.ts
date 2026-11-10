import type { Lesson } from "../types";
import { BayesTreeFigure } from "./figures";

// Tema 1, Sannsynlighet. Pensum: WMMY Kap 2 (2.1–2.8). Formelbok: side 32 (sannsynlighet og kombinatorikk).
const formelbok = (page: number) => `(Formelbok s. ${page})`;

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "403369a8-e1e6-49e9-98d8-958df11e9a3e",
  reviewed: "2026-11-10",
  summary: "Sannsynlighet måler hvor sannsynlig en hendelse er. Med **uniform modell** er $P(A) = |A|/|S|$. Med **betinget sannsynlighet** endrer informasjon sannsynligheten: $P(A|B) = P(A \\cap B)/P(B)$. Bayes' regel snur retningen: fra $P(A|B_i)$ til $P(B_i|A)$.",
  overview: [
    "**Tre regler å kunne:** komplement $P(A^c) = 1 - P(A)$, addisjon $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ og multiplikasjon $P(A \\cap B) = P(A|B)P(B)$.",
    "**Uavhengighet** betyr $P(A \\cap B) = P(A)P(B)$. Det er et utsagn om sannsynligheter, ikke om at hendelsene er disjunkte.",
    "**Disjunkte** betyr $A \\cap B = \\emptyset$. Da er $P(A \\cap B) = 0$. Disjunkte hendelser med positiv sannsynlighet er ikke uavhengige.",
    "**Total sannsynlighet:** deler opp utfallsrommet i $B_1, \\ldots, B_k$ og summerer $P(A|B_i)P(B_i)$.",
    "**Bayes:** $P(B_r|A) = P(A|B_r)P(B_r)/P(A)$, der $P(A)$ er fra total sannsynlighet.",
    "**Kombinatorikk** gir antall utfall i uniform modell: $n!$, $_nP_r$ og $\\binom{n}{r}$.",
  ],
  keyFormulas: [
    { latex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", label: "Addisjon for to hendelser" },
    { latex: "P(A|B) = \\dfrac{P(A \\cap B)}{P(B)}", label: "Betinget sannsynlighet" },
    { latex: "P(A) = \\sum_{i} P(A|B_i)\\,P(B_i)", label: "Total sannsynlighet" },
    { latex: "P(B_r|A) = \\dfrac{P(A|B_r)\\,P(B_r)}{\\sum_{i} P(A|B_i)\\,P(B_i)}", label: "Bayes' regel" },
  ],
  goals: [
    "Kunne bruke aksiomene og komplementregelen for å finne sannsynligheter.",
    "Kunne skille mellom disjunkte og uavhengige hendelser.",
    "Kunne telle utfall med kombinatorikk i en uniform modell.",
    "Kunne bruke total sannsynlighet og Bayes' regel på et tretdiagram.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 32", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "grunnbegreper",
      title: "Grunnbegreper og aksiomer",
      blocks: [
        { type: "text", text: "Et **stokastisk forsøk** gir et utfall. Utfallsrommet $S$ er mengden av alle mulige utfall, og en **hendelse** $A$ er en delmengde av $S$. Hendelsen inntreffer hvis utfallet ligger i $A$." },
        { type: "box", variant: "definition", title: "Aksiomene (må kunne)", blocks: [
          { type: "list", items: [
            "$0 \\le P(A) \\le 1$ for alle hendelser $A$.",
            "$P(S) = 1$.",
            "Hvis $A_1, A_2, \\ldots$ er disjunkte, så er $P(A_1 \\cup A_2 \\cup \\cdots) = \\sum_i P(A_i)$.",
          ] },
          { type: "text", text: "Aksiomene står ikke i formelboka. Når en oppgave spør om en tallfunksjon er et sannsynlighetsmål, sjekker du de tre punktene." },
        ] },
        { type: "formula", latex: "P(A^c) = 1 - P(A)", name: "Komplementregelen", book: { status: "missing" }, caption: "Ikke i formelboka. Brukes ofte når «minst én» er enklere å finne enn «ingen»." },
        { type: "example", title: "Komplementregelen i praksis", blocks: [
          { type: "text", text: "Tre uavhengige forsøk med $P(\\text{suksess}) = 0{,}2$ hver. Sannsynligheten for minst én suksess er $1 - 0{,}8^3 = 1 - 0{,}512 = 0{,}488$." },
        ] },
      ],
    },
    {
      id: "addisjon",
      title: "Addisjon og union",
      blocks: [
        { type: "formula", latex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", name: "Addisjonssetningen (to hendelser)", book: { status: "book", pages: "32" }, caption: `Generell form for flere hendelser står i formelboka ${formelbok(32)}.` },
        { type: "text", text: "Hvis $A$ og $B$ er disjunkte, er $P(A \\cap B) = 0$, og formelen blir $P(A) + P(B)$. Trekk fra snittet når hendelsene kan skje samtidig." },
        { type: "example", title: "Union med snitt", blocks: [
          { type: "text", text: "$P(A) = 0{,}5$, $P(B) = 0{,}4$ og $P(A \\cap B) = 0{,}2$. Da er $P(A \\cup B) = 0{,}5 + 0{,}4 - 0{,}2 = 0{,}7$." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlig feil", blocks: [
          { type: "text", text: "Å legge sammen $P(A)$ og $P(B)$ uten å trekke fra snittet. Da telles de felles utfallene to ganger." },
        ] },
      ],
    },
    {
      id: "kombinatorikk",
      title: "Uniform modell og kombinatorikk",
      blocks: [
        { type: "text", text: "Hvis alle utfall er like sannsynlige, er $P(A) = |A|/|S|$. Da må du telle utfall. Bruk **permutasjon** når rekkefølgen teller, og **kombinasjon** når den ikke gjør det." },
        { type: "formula", latex: "{}_nP_r = \\dfrac{n!}{(n-r)!}", name: "Permutasjoner (ordnet utvalg)", book: { status: "book", pages: "32" }, caption: `Ordnede utvalg av $r$ fra $n$ uten tilbakelegging ${formelbok(32)}.` },
        { type: "formula", latex: "\\binom{n}{r} = \\dfrac{n!}{r!\\,(n-r)!}", name: "Kombinasjoner (uordnet utvalg)", book: { status: "book", pages: "32" }, caption: `Uordnede utvalg av $r$ fra $n$ uten tilbakelegging ${formelbok(32)}.` },
        { type: "example", title: "Velge 4 forsvarsspillere av 9", blocks: [
          { type: "text", text: "Rekkefølgen er ikke viktig, så kombinasjoner. Med kalkulator: $\\binom{9}{4} = 126$." },
          { type: "text", text: "Hvis en bestemt spiller alltid må være med, velger du 3 av de 8 andre: $\\binom{8}{3} = 56$." },
        ] },
      ],
    },
    {
      id: "betinget",
      title: "Betinget sannsynlighet og uavhengighet",
      blocks: [
        { type: "formula", latex: "P(A|B) = \\dfrac{P(A \\cap B)}{P(B)}, \\qquad P(B) > 0", name: "Betinget sannsynlighet", book: { status: "book", pages: "32" }, caption: `Formelen står i formelboka som $P(B_r|A) = P(B_r \\cap A)/P(A)$ under Bayes' regel ${formelbok(32)}. Den er lik i begge retninger.` },
        { type: "text", text: "$P(A|B)$ er sannsynligheten for $A$ når vi vet at $B$ har skjedd. Hendelsen $B$ blir da det nye utfallsrommet." },
        { type: "formula", latex: "P(A \\cap B) = P(A)\\,P(B)", name: "Uavhengige hendelser", book: { status: "partial", pages: "32", missing: "P(A ∩ B) = P(A)P(B) må læres; boka har bare multiplikasjonssetningen" }, caption: "Ikke i formelboka i denne formen. Den følger av multiplikasjonssetningen i formelboka, når $P(A|B) = P(A)$." },
        { type: "formula", latex: "P(A_1 \\cap \\cdots \\cap A_n) = P(A_1)\\,P(A_2|A_1)\\cdots P(A_n|A_1 \\cap \\cdots \\cap A_{n-1})", name: "Multiplikasjonssetningen", book: { status: "book", pages: "32" }, caption: `Formelboka ${formelbok(32)}. Brukes når trekninger skjer uten tilbakelegging.` },
        { type: "example", title: "To defekte av 10, uten tilbakelegging", blocks: [
          { type: "text", text: "Det er 3 defekte av 10 varer. Sannsynligheten for at de to første er defekte er $P(D_1 \\cap D_2) = \\dfrac{3}{10} \\cdot \\dfrac{2}{9} = \\dfrac{1}{15} \\approx 0{,}067$." },
          { type: "text", text: "Den andre faktoren er betinget på at den første var defekt. Det er 2 defekte igjen av 9 varer." },
        ] },
      ],
    },
    {
      id: "total-bayes",
      title: "Total sannsynlighet og Bayes' regel",
      blocks: [
        { type: "text", text: "**Bruk** når en hendelse $A$ skjer gjennom flere mulige årsaker $B_1, \\ldots, B_k$ som er disjunkte og dekker alle utfall. Deretter spør oppgaven: gitt at $A$ har skjedd, hva er sannsynligheten for årsak $B_r$?" },
        { type: "formula", latex: "P(A) = \\sum_{i=1}^{k} P(A|B_i)\\,P(B_i)", name: "Total sannsynlighet", book: { status: "book", pages: "32" }, caption: `Formelboka ${formelbok(32)}. Partisjonen $B_1, \\ldots, B_k$ må dekke hele utfallsrommet.` },
        { type: "formula", latex: "P(B_r|A) = \\dfrac{P(A|B_r)\\,P(B_r)}{\\sum_{i=1}^{k} P(A|B_i)\\,P(B_i)}", name: "Bayes' regel", book: { status: "book", pages: "32" }, caption: `Formelboka ${formelbok(32)}. Nevneren er $P(A)$ fra total sannsynlighet.` },
        { type: "figure", component: BayesTreeFigure, caption: "Tre maskiner produserer 50 %, 30 % og 20 % av varene. Sannsynlighetene for defekt er 1 %, 2 % og 3 %. Tretdiagrammet viser hvordan grenene multipliseres." },
        { type: "example", title: "Hvilken maskin lagde den defekte varen?", blocks: [
          { type: "text", text: "**Steg 1: total sannsynlighet.** $P(D) = 0{,}5 \\cdot 0{,}01 + 0{,}3 \\cdot 0{,}02 + 0{,}2 \\cdot 0{,}03 = 0{,}005 + 0{,}006 + 0{,}006 = 0{,}017$." },
          { type: "text", text: "**Steg 2: Bayes.** $P(M_3|D) = \\dfrac{0{,}2 \\cdot 0{,}03}{0{,}017} = \\dfrac{0{,}006}{0{,}017} \\approx 0{,}353$." },
          { type: "text", text: "Maskin 3 står for 20 % av produksjonen, men for 35 % av de defekte varene." },
        ] },
        { type: "box", variant: "tip", title: "Tankegang", blocks: [
          { type: "text", text: "Bayes' regel stiller spørsmålet «hva er årsaken, gitt effekten?». Total sannsynlighet er tellingen av alle mulige effekter. Skriv alltid ut hva som er betinget på hva før du setter tall inn." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlige feil", blocks: [
          { type: "list", items: [
            "Å forveksle $P(A|B)$ med $P(B|A)$. Tallene i tretdiagrammet er alltid $P(\\text{effekt} | \\text{årsak})$.",
            "Å glemme å multiplisere med $P(B_i)$ i total sannsynlighet.",
            "At $B_i$ ikke dekker hele utfallsrommet. Da blir summen mindre enn 1.",
          ] },
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["Betinget sannsynlighet fra tabell", "Aug 2026, oppg. 3a–d", "Les tabellen som sannsynligheter per 1. juli. Bruk $P(B|A) = P(A \\cap B)/P(A)$. Hvis $B \\subset A$, er $P(A \\cap B) = P(B)$ og $P(A|B) = 1$."],
          ["Bayes med sensitivitet og spesifisitet", "Des 2025, oppg. 1a–d", "Del opp etter $C$ og $C'$. Total sannsynlighet gir $P(T)$, og Bayes gir $P(C|T)$. Komplementregelen gir $P(C'|T)$."],
          ["Kortkombinatorikk i uniform modell", "Des 2025, oppg. 2a–c", "Tell utfall med kombinasjoner. Hus: $13 \\cdot 12 \\cdot \\binom{4}{3}\\binom{4}{2}$ av $\\binom{52}{5}$ mulige."],
          ["Lagoppsett med kombinasjoner", "Aug 2026, oppg. 1a–c", "Velg per posisjon med kombinasjoner og multipliser. Sannsynlighet = gunstige / mulige."],
        ] },
        { type: "example", title: "Des 2025, oppg. 1: Bayes med test", blocks: [
          { type: "text", text: "Sensitivitet $P(T|C) = 0{,}7$, $P(C) = 0{,}03$ og $P(T|C') = 0{,}01$." },
          { type: "text", text: "**Steg 1: total sannsynlighet.** $P(T) = 0{,}7 \\cdot 0{,}03 + 0{,}01 \\cdot 0{,}97 = 0{,}0307$." },
          { type: "text", text: "**Steg 2: Bayes.** $P(C|T) = \\frac{0{,}7 \\cdot 0{,}03}{0{,}0307} \\approx 0{,}684$, og $P(C'|T) = 1 - 0{,}684 = 0{,}316$." },
          { type: "text", text: "Formelboka side 32 gir total sannsynlighet og Bayes. Komplementregelen står ikke der." },
        ] },
      ],
    },
  ],
};
