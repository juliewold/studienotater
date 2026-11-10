import type { Lesson } from "../types";

// Tema 4, Forventningsverdi og varians. Pensum: WMMY Kap 4.1–4.3 (4.3 til «What If the Function Is Nonlinear?»).
// Formelbok: side 33 (kovarians, korrelasjon), side 34 (lineærkombinasjoner), side 35 (E[g(X)]).

const formelbok = (page: number) => `(Formelbok s. ${page})`;

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "0f87ebbc-2345-47d7-8680-11d40d16d34f",
  reviewed: "2026-11-10",
  summary: "**Forventningsverdien** $E(X)$ er den langsiktige gjennomsnittsverdien. **Variansen** $\\text{Var}(X)$ måler spredningen rundt den. For lineære kombinasjoner gjelder enkle regler, men **kovariansen** må med når variablene er avhengige.",
  overview: [
    "**Forventning:** $E(X) = \\sum x f(x)$ eller $\\int x f(x)\\,dx$. Forventning er lineær: $E(aX + bY) = aE(X) + bE(Y)$.",
    "**Varians:** $\\text{Var}(X) = E(X^2) - \\mu^2$. Konstanter kommer ut kvadrert: $\\text{Var}(aX + b) = a^2\\,\\text{Var}(X)$.",
    "**Kovarians:** $\\text{Cov}(X, Y) = E(XY) - E(X)E(Y)$. Med uavhengige variabler er $\\text{Cov} = 0$.",
    "**Varians av en sum:** $\\text{Var}(aX + bY) = a^2\\text{Var}(X) + b^2\\text{Var}(Y) + 2ab\\,\\text{Cov}(X, Y)$. Fortegnet på $ab$ teller.",
    "**Korrelasjon:** $\\rho = \\text{Cov}(X, Y)/\\sqrt{\\text{Var}(X)\\text{Var}(Y)}$ ligger alltid mellom $-1$ og $1$.",
  ],
  keyFormulas: [
    { latex: "E(X) = \\sum_x x\\,f(x) \\qquad \\text{eller} \\qquad \\int x\\,f(x)\\,dx", label: "Forventningsverdi" },
    { latex: "\\text{Var}(X) = E(X^2) - \\mu^2", label: "Varians" },
    { latex: "\\text{Var}(aX + bY) = a^2\\text{Var}(X) + b^2\\text{Var}(Y) + 2ab\\,\\text{Cov}(X, Y)", label: "Varians av lineær kombinasjon" },
    { latex: "\\rho(X, Y) = \\dfrac{\\text{Cov}(X, Y)}{\\sqrt{\\text{Var}(X)\\,\\text{Var}(Y)}}", label: "Korrelasjon" },
  ],
  goals: [
    "Kunne finne $E(X)$, $\\text{Var}(X)$ og standardavvik fra en fordeling.",
    "Kunne finne $E(g(X))$ og bruke $E(X^2)$ i variansformelen.",
    "Kunne regne ut varians og kovarians for lineære kombinasjoner, også med avhengige variabler.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 33–35", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "forventning",
      title: "Forventningsverdi",
      blocks: [
        { type: "text", text: "Forventningen er vektet gjennomsnitt av verdiene. For en funksjon $g$ av $X$ veier du $g(x)$ med sannsynligheten. Dette er grunnlaget for både variansen og senere resultater." },
        { type: "formula", latex: "E[g(X)] = \\sum_x g(x)\\,f(x) \\qquad \\text{eller} \\qquad \\int g(x)\\,f(x)\\,dx", name: "Forventning av en funksjon", book: { status: "book", pages: "35" }, caption: `Formelboka ${formelbok(35)}. Brukes med $g(x) = x$ og $g(x) = x^2$.` },
        { type: "example", title: "Diskret forventning", blocks: [
          { type: "text", text: "$P(X = 0) = 0{,}2$, $P(X = 1) = 0{,}5$ og $P(X = 2) = 0{,}3$. Da er $E(X) = 0 \\cdot 0{,}2 + 1 \\cdot 0{,}5 + 2 \\cdot 0{,}3 = 1{,}1$." },
        ] },
      ],
    },
    {
      id: "varians",
      title: "Varians og standardavvik",
      blocks: [
        { type: "formula", latex: "\\text{Var}(X) = E(X^2) - \\mu^2, \\qquad \\text{sd}(X) = \\sqrt{\\text{Var}(X)}", name: "Varians og standardavvik", book: { status: "missing" }, caption: "Ikke i formelboka i denne formen. Må kunnes. Forventningsverdi og varians for spesifikke fordelinger står side 25–28." },
        { type: "formula", latex: "\\text{Var}(aX + b) = a^2\\,\\text{Var}(X)", name: "Lineær transformasjon av varians", book: { status: "partial", pages: "34", missing: "Særtilfellet Var(aX + b) = a²Var(X) må læres; boka har den generelle formelen" }, caption: "Konstanten $b$ påvirker ikke variansen. Konstanten $a$ kvadreres." },
        { type: "example", title: "Fortsettelse av eksempelet", blocks: [
          { type: "text", text: "$E(X^2) = 0^2 \\cdot 0{,}2 + 1^2 \\cdot 0{,}5 + 2^2 \\cdot 0{,}3 = 1{,}7$." },
          { type: "text", text: "$\\text{Var}(X) = 1{,}7 - 1{,}1^2 = 1{,}7 - 1{,}21 = 0{,}49$, og $\\text{sd}(X) = 0{,}7$." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlig feil", blocks: [
          { type: "text", text: "Å skrive $E(X^2) = (E(X))^2$. Dette er ikke sant. $E(X^2) \\ge (E(X))^2$, og forskjellen er nettopp variansen." },
        ] },
      ],
    },
    {
      id: "kovarians",
      title: "Kovarians og korrelasjon",
      blocks: [
        { type: "formula", latex: "\\text{Cov}(X, Y) = E(XY) - E(X)E(Y)", name: "Kovarians", book: { status: "book", pages: "33" }, caption: `Formelboka ${formelbok(33)}.` },
        { type: "formula", latex: "\\rho(X, Y) = \\dfrac{\\text{Cov}(X, Y)}{\\sqrt{\\text{Var}(X)\\,\\text{Var}(Y)}}", name: "Korrelasjonskoeffisient", book: { status: "book", pages: "33" }, caption: `Formelboka ${formelbok(33)}. Korrelasjonen måler bare lineær sammenheng.` },
        { type: "box", variant: "pitfall", title: "Kovarians 0 betyr ikke uavhengig", blocks: [
          { type: "text", text: "Uavhengige variabler har $\\text{Cov} = 0$, men det motsatte gjelder ikke generelt. Det er bare for normale variabler at $\\text{Cov} = 0$ impliserer uavhengighet." },
        ] },
      ],
    },
    {
      id: "lineaere",
      title: "Lineære kombinasjoner",
      blocks: [
        { type: "formula", latex: "E(Y) = \\sum_{i=1}^{n} a_i E(X_i) + b, \\qquad \\text{Var}(Y) = \\sum_{i=1}^{n} \\sum_{j=1}^{n} a_i a_j \\text{Cov}(X_i, X_j)", name: "Lineær kombinasjon", book: { status: "book", pages: "34" }, caption: `Formelboka ${formelbok(34)}. For to variabler er det samme som nøkkelformelen for $\\text{Var}(aX + bY)$.` },
        { type: "text", text: "Hvis variablene er uavhengige, faller alle kovarianstermene bort, og $\\text{Var}(Y) = \\sum a_i^2 \\text{Var}(X_i)$." },
        { type: "example", title: "Avhengige variabler: differanse", blocks: [
          { type: "text", text: "$\\text{Var}(X) = 4$, $\\text{Var}(Y) = 9$ og $\\text{Cov}(X, Y) = 1$. For $2X - Y$ er $a = 2$ og $b = -1$." },
          { type: "text", text: "$\\text{Var}(2X - Y) = 4 \\cdot 4 + 1 \\cdot 9 + 2 \\cdot 2 \\cdot (-1) \\cdot 1 = 16 + 9 - 4 = 21$." },
          { type: "text", text: "Med uavhengige variabler ville svaret vært $16 + 9 = 25$." },
        ] },
        { type: "box", variant: "tip", title: "Tankegang", blocks: [
          { type: "text", text: "Skriv alltid ut $a$ og $b$ først. For $X - Y$ er $a = 1$ og $b = -1$, så kovariansleddet blir $2 \\cdot 1 \\cdot (-1) \\cdot \\text{Cov}(X, Y) = -2\\text{Cov}(X, Y)$." },
        ] },
      ],
    },
    {
      id: "typiske-feil",
      title: "Typiske feil",
      blocks: [
        { type: "list", items: [
          "Å glemme kovariansleddet når variablene er avhengige, for eksempel i to målinger av samme objekt.",
          "Å sette $\\text{Var}(X - Y) = \\text{Var}(X) - \\text{Var}(Y)$. Variansen av en sum eller differanse av uavhengige variabler er alltid summen av variansene.",
          "Å forveksle standardavvik og varians. Standardavviket er kvadratroten av variansen og har samme enhet som $X$.",
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["Varians av differanse, uavhengige", "Aug 2026, oppg. 4d", "$\\text{Var}(X - Y) = \\text{Var}(X) + \\text{Var}(Y)$ når de er uavhengige. Minustegnet forsvinner i kvadratet."],
          ["Forventning og varians av funksjon", "Des 2025, oppg. 3a–c", "Regn ut $E(X^2)$ først, deretter $\\text{Var}(X) = E(X^2) - \\mu^2$."],
        ] },
        { type: "example", title: "Aug 2026, oppg. 4d: differanse av to Poisson", blocks: [
          { type: "text", text: "$X \\sim \\text{Po}(1{,}2)$ og $Y \\sim \\text{Po}(0{,}4)$ er uavhengige." },
          { type: "text", text: "$E(X - Y) = 1{,}2 - 0{,}4 = 0{,}8$ og $\\text{Var}(X - Y) = 1{,}2 + 0{,}4 = 1{,}6$. For Poisson er varians lik forventning (side 25)." },
        ] },
      ],
    },
  ],
};
