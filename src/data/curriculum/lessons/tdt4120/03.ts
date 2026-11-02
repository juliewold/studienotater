import type { Lesson } from "../types";
import {
  BisectFigure, DivideConquerFigure, MasterCasesFigure, MergeSortFigure, PartitionFigure, QuicksortShapesFigure, RecursionTreeFigure,
} from "./figures03";

const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view`, kind: "drive" as const });

// Based on the pensum booklet (lecture 3, goals C1–C7, appendices C and D), the lecture slides,
// exercise 3 with its solution and the reviewed notes for lecture 3 and exercise 3 (parts 1 and 2).
export const lesson: Lesson = {
  subjectId: "tdt4120",
  unitId: "03",
  reviewed: "2026-11-02",
  summary: "**Splitt og hersk** løser en instans ved å dele den i mindre, uavhengige delinstanser, løse dem rekursivt og kombinere svarene. Forelesningen viser tre slike algoritmer (**binærsøk**, **Merge-Sort** og **Quicksort**) og verktøyene for å finne kjøretiden deres: **rekurrenser**, løst med iterasjon, rekursjonstrær, substitusjon og **masterteoremet**. Korrekthetsbeviset (induksjon) og kjøretidsberegningen (rekurrens) har samme form.",
  overview: [
    "**Splitt og hersk:** del i uavhengige delinstanser, løs dem rekursivt, kombiner. Korrekthet med induksjon: grunntilfelle, IH (delinstansene er løst riktig) og trinn.",
    "**Rekurrens:** $T(n) = aT(n/b) + f(n)$ med $a$ kall, delinstanser av størrelse $n/b$ og arbeid $f(n)$ utenom kallene. Anta algoritmiske rekurrenser (konstant grunntilfelle).",
    "**Finn løsningen** med iterasjon (ekspander til mønsteret i linje $i$, velg $i$ som treffer grunntilfellet), rekursjonstre (arbeid per nivå × antall nivåer) eller masterteoremet. **Bevis** den med substitusjon.",
    "**$O$-fella:** «$T(n-1) = O(1) \\Rightarrow T(n) = O(1) + 1 = O(1)$» er feil. Skriv ut konstanten og vis nøyaktig samme påstand, $T(n) \\le c\\,g(n)$.",
    "**Bisect:** sortert tabell, se på midten, let i én halvdel. $\\Theta(\\lg n)$ i verste og $\\Theta(1)$ i beste tilfelle. Bisect′ er samme algoritme med løkke.",
    "**Merge-Sort:** del gratis, flett med Merge i $\\Theta(n)$. Alltid $\\Theta(n \\lg n)$. Stabil, men ikke in-place.",
    "**Quicksort:** Partition rundt $x = A[r]$ i $\\Theta(n)$, kombinering gratis. $\\Theta(n \\lg n)$ i beste og gjennomsnittlig tilfelle, $\\Theta(n^2)$ i verste (sortert input eller alle like). In-place, ikke stabil.",
    "**Randomized-Quicksort:** tilfeldig pivot gir forventet $\\Theta(n \\lg n)$ for enhver input. Verste tilfelle er fortsatt $\\Theta(n^2)$, men bare ved uflaks.",
    "**Masterteoremet:** sammenlign $f(n)$ med $n^{\\log_b a}$. Polynomisk mindre: $\\Theta(n^{\\log_b a})$. Lik (ganger $\\lg^k n$): gang med $\\lg n$. Polynomisk større og regulær: $\\Theta(f(n))$. Gjelder ikke $T(n-1)$.",
  ],
  keyFormulas: [
    { latex: "T(n) = aT(n/b) + f(n), \\quad a \\ge 1,\\ b > 1", label: "Splitt og hersk-rekurrens" },
    { latex: "f(n) = O(n^{\\log_b a - \\varepsilon}) \\Rightarrow T(n) = \\Theta(n^{\\log_b a})", label: "Master, tilfelle 1" },
    { latex: "f(n) = \\Theta(n^{\\log_b a} \\lg^k n),\\ k \\ge 0 \\Rightarrow T(n) = \\Theta(n^{\\log_b a} \\lg^{k+1} n)", label: "Master, tilfelle 2" },
    { latex: "f(n) = \\Omega(n^{\\log_b a + \\varepsilon}),\\ af(n/b) \\le cf(n),\\ c < 1 \\Rightarrow T(n) = \\Theta(f(n))", label: "Master, tilfelle 3" },
    { latex: "T(n/2) + 1 = \\Theta(\\lg n), \\quad 2T(n/2) + n = \\Theta(n \\lg n), \\quad T(n-1) + n = \\Theta(n^2)", label: "Rekurrensene til Bisect, Merge-Sort og Quicksort (verst)" },
  ],
  goals: [
    "Forstå rekursiv dekomponering og induksjon over delinstanser **(C1, !)**",
    "Forstå designmetoden splitt og hersk (divide and conquer) **(C2, !)**",
    "Forstå Bisect og Bisect′ (appendiks D i pensumheftet) **(C3)**",
    "Forstå Merge-Sort **(C4)**",
    "Forstå Quicksort og Randomized-Quicksort **(C5)**",
    "Kunne løse rekurrenser med substitusjon, rekursjonstrær og masterteoremet **(C6, !)**",
    "Kunne løse rekurrenser med iterasjonsmetoden (appendiks C i pensumheftet) **(C7, !)**",
  ],
  concepts: [
    "recursive-decomposition", "divide-and-conquer", "base-case", "induksjon", "induction-hypothesis", "lokkeinvariant",
    "recurrence", "iteration-method", "recursion-tree", "substitution-method", "master-theorem",
    "binary-search", "merge", "merge-sort", "stable-sorting", "partition", "pivot", "quicksort",
    "randomized-partition", "randomized-quicksort", "randomized-algorithm", "best-case", "worst-case", "average-case", "expected-runtime",
  ],
  notes: [{ slug: "forelesning-3-splitt-og-hersk", label: "Forelesning 3 - Splitt og hersk" }],
  sources: [
    drive("Pensumhefte 2026, forelesning 3 og appendiks C og D", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
    drive("Forelesning 3 (lysark)", "1u4Y9AsGBP6OtRCwI3C2-GCZLAt80yqd_"),
    drive("Øving 3: Splitt og hersk", "1E14SjWeQj8vDYzQggZ-XG2sneqe2SGJN"),
    drive("Løsningsforslag øving 3", "1JA9bpWgnazreq9wXf3G4FebI9TV3vx2t"),
    { label: "Forelesning 3 - Splitt og hersk", url: "forelesning-3-splitt-og-hersk", kind: "note" },
    { label: "Øving 3, del 1: spørsmål 1–23 (løsningsforslag)", url: "ving-3-splitt-og-hersk-del-1-sp-rsmal-1-23-l-sningsforslag", kind: "note" },
    { label: "Øving 3, del 2: ekstraoppgaver (spørsmål 24)", url: "ving-3-splitt-og-hersk-del-2-ekstraoppgaver-sp-rsmal-24", kind: "note" },
  ],
  sections: [
    {
      id: "splitt-og-hersk",
      title: "Rekursiv dekomponering og splitt og hersk",
      blocks: [
        { type: "text", text: "**Rekursiv dekomponering:** løs en instans ved hjelp av løsninger på mindre instanser av samme problem. Det er induksjon brukt til å lage algoritmer. Alle induktive trinn er like, så vi trenger bare å forstå ett av dem og aldri følge rekursjonen helt ned." },
        { type: "table", head: ["Induksjon", "Algoritmen"], rows: [
          ["Grunntilfelle: vis $P(1)$", "løs den minste instansen direkte (ofte trivielt)"],
          ["Induksjonshypotese: anta $P(k)$ for alle $k < n$", "anta at de rekursive kallene svarer riktig"],
          ["Induksjonstrinn: vis $P(n)$", "del opp og kombiner riktige delsvar til et riktig svar"],
        ], caption: "Delinstansene kan ha størrelse $n/2$, så vi bruker **sterk induksjon**: anta alle mindre instanser, ikke bare $n - 1$." },
        { type: "pseudocode", title: "Divide-and-Conquer(X)", lines: [
          "if X is a base case",
          "    return basic solution",
          "divide X into L and R",
          "Divide-and-Conquer(L)",
          "Divide-and-Conquer(R)",
          "return solutions combined",
        ], caption: "Linje 3 (del) og 6 (kombiner) er kjernen i designet, resten er «klipp og lim». $L$ og $R$ er uavhengige og overlapper ikke. Overlapp gir dynamisk programmering (forelesning 6)." },
        { type: "list", ordered: true, items: [
          "**Del** (divide): gjør $X$ om til mindre delinstanser. Det kan være flere enn to.",
          "**Hersk** (conquer): løs hver delinstans rekursivt. Ofte trenger vi bare én av dem.",
          "**Kombiner** (combine): sett sammen delløsningene.",
        ] },
        { type: "figure", component: DivideConquerFigure, caption: "Hvor arbeidet ligger (lilla): Quicksort jobber i delingen, Merge-Sort i kombineringen, og binærsøk løser bare én halvdel." },
        { type: "box", variant: "tip", title: "Når skjer flyttingen? (øving 3, spm. 3)", blocks: [
          { type: "text", text: "Quicksort flytter tallene i Partition **før** de rekursive kallene. Merge-Sort regner bare ut midten og flytter tallene i Merge **etter** kallene." },
        ] },
      ],
    },
    {
      id: "rekurrenser",
      title: "Rekurrenser, iterasjonsmetoden og rekursjonstrær",
      blocks: [
        { type: "text", text: "Kjøretiden til en rekursiv algoritme beskrives med en **rekurrens**, en ligning der $T$ står på begge sider. Den gjelder for alle $n$, så også for argumentet $n/2$: fra $T(n) = T(n/2) + 1$ får vi $T(n/2) = T(n/4) + 1$. Det er dette vi bruker når vi ekspanderer." },
        { type: "formula", latex: "T(n) = \\underbrace{a}_{\\text{antall kall}} \\cdot T(\\underbrace{n/b}_{\\text{delinstans}}) + \\underbrace{f(n)}_{\\text{arbeid utenom kallene}}", name: "Generell splitt og hersk-rekurrens" },
        { type: "box", variant: "definition", title: "Algoritmisk rekurrens", blocks: [
          { type: "text", text: "Grunntilfellet koster konstant tid (det finnes $n_0$ og $0 < c_1 \\le T(n) \\le c_2$ for $n < n_0$), og rekursjonen stopper etter endelig mange steg. Boka skriver det uformelt som «$T(n) = \\Theta(1)$ for $n < n_0$». Anta dette når ikke annet er sagt, og se bort fra avrunding som $\\lfloor n/2 \\rfloor$." },
        ] },
        { type: "table", head: ["Rekurrens", "Les den slik", "Løsning"], rows: [
          ["$T(n) = T(n-1) + 1$", "ett kall på $n-1$, én operasjon", "$\\Theta(n)$"],
          ["$T(n) = T(n/2) + 1$", "ett kall på halvparten (binærsøk)", "$\\Theta(\\lg n)$"],
          ["$T(n) = 2T(n/2) + n$", "to kall på halvparten, $n$ arbeid (Merge-Sort)", "$\\Theta(n \\lg n)$"],
          ["$T(n) = T(n-1) + n$", "ett kall på $n-1$, $n$ arbeid (Quicksort, verst)", "$\\Theta(n^2)$"],
        ], caption: "Å trekke fra en konstant, $T(n - c)$, gir lineært mange nivåer. Å dele på en konstant, $T(n/c)$, gir logaritmisk mange." },
        { type: "text", text: "**Iterasjonsmetoden** (appendiks C): bytt ut $T(\\dots)$ på høyre side med rekurrensen selv, igjen og igjen, til du ser mønsteret etter $i$ ekspansjoner. Velg så $i$ slik at argumentet blir grunntilfellet." },
        { type: "formula", latex: "\\begin{aligned} T(n) &= 2T(n/2) + n = 4T(n/4) + 2n = 8T(n/8) + 3n \\\\ &= 2^i\\, T(n/2^i) + i\\,n \\\\ &= n\\,T(1) + n \\lg n = n \\lg n + n \\qquad (i = \\lg n) \\end{aligned}", name: "Iterasjon på Merge-Sort-rekurrensen", caption: "Halveringer: $n/2^i = 1 \\iff i = \\lg n$. For $T(n) = T(n-1) + 1$ blir mønsteret $T(n-i) + i$, og $i = n$ gir $T(0) + n$." },
        { type: "text", text: "**Rekursjonstre:** iterasjonsmetoden tegnet. Hver node er ett kall med arbeidet utenom egne rekursive kall. Summer per nivå, finn antall nivåer ($\\log_b n$) og summer alt." },
        { type: "figure", component: RecursionTreeFigure, caption: "Merge-Sort: hvert nivå koster til sammen $n$, og det er $\\lg n + 1$ nivåer." },
        { type: "box", variant: "tip", title: "Sumformler du trenger", blocks: [
          { type: "formula", latex: "1 + 2 + \\dots + n = \\frac{n(n+1)}{2}, \\qquad \\sum_{i=0}^{k} x^i = \\frac{x^{k+1} - 1}{x - 1}\\ (x \\ne 1)", name: "Aritmetisk og geometrisk sum" },
          { type: "text", text: "Med $x = \\tfrac12$ er $n + n/2 + n/4 + \\dots < 2n$. Derfor er $T(n) = T(n/2) + n = \\Theta(n)$." },
        ] },
        { type: "box", variant: "tip", title: "Høyden på treet (øving 3, spm. 19 og 20)", blocks: [
          { type: "text", text: "Høyden følger grenen som krymper **saktest**. $T(n/10) + T(n/5) + T(n/\\pi) + n^3$ har høyde $\\log_\\pi n = \\Theta(\\lg n)$; $n^3$ er arbeid per node, ikke høyde. Med $T(\\sqrt{n})$ blir argumentet $n^{1/2^k}$ etter $k$ nivåer, så høyden er $\\Theta(\\lg \\lg n)$." },
        ] },
      ],
    },
    {
      id: "substitusjon",
      title: "Substitusjonsmetoden",
      blocks: [
        { type: "text", text: "Iterasjon og rekursjonstrær er uformelle. **Substitusjon** er et ekte bevis: gjett (eller finn) en løsning og bevis den med induksjon. Vis grunntilfellet, anta løsningen for alle $k < n$ (IH), og sett IH inn i rekurrensen." },
        { type: "formula", latex: "T(n) = 2T(n/2) + n = 2\\left(\\tfrac{n}{2}\\lg\\tfrac{n}{2} + \\tfrac{n}{2}\\right) + n = n(\\lg n - 1) + 2n = n \\lg n + n", name: "Substitusjon for Merge-Sort", caption: "Grunntilfelle $T(1) = 1 \\cdot 0 + 1 = 1$. Bruk eksakte uttrykk i IH, ikke $\\Theta$." },
        { type: "box", variant: "pitfall", title: "O-fella (klassisk eksamensfelle)", blocks: [
          { type: "text", text: "«Anta $T(n-1) = O(1)$. Da er $T(n) = O(1) + 1 = O(1)$.» Feil: $O(1)$ skjuler en konstant $c$, og grensen blir $c + 1$, $c + 2$, …, $c + n$. Påstanden må være **nøyaktig den samme** før og etter. Skriv derfor $T(k) \\le c \\cdot g(k)$ i IH og vis $T(n) \\le c \\cdot g(n)$ med samme $c$." },
        ] },
        { type: "example", title: "Hvilke induksjonstrinn holder? (øving 3, spm. 10)", blocks: [
          { type: "text", text: "Vi vil vise $\\Omega(n^3)$ med IH $T(m) \\ge c\\,m^3$. Trinnet ga $T_1 \\ge cn^3 - 5n^2$, $T_2 \\ge cn^4 + 5n^2$, $T_3 \\ge cn^3 + n$ og $T_4 \\ge cn^3 - 1$. Bare $T_2$ og $T_3$ gir $\\ge cn^3$, så bare $A_2$ og $A_3$ er bevist. At beviset feiler for $T_1$, betyr ikke at påstanden er usann." },
        ] },
        { type: "box", variant: "tip", title: "Trekk fra et lavere ledd når beviset nesten går", blocks: [
          { type: "text", text: "For $T(n) = 4T(n/2) + n$ gir IH $T(m) \\le cm^2$ bare $T(n) \\le cn^2 + n$. Styrk påstanden til $T(m) \\le cm^2 - bm$: da blir $T(n) \\le cn^2 - 2bn + n \\le cn^2 - bn$ når $b \\ge 1$ (CLRS 4.3-2). En sterkere hypotese gir også en sterkere antagelse å bygge på." },
        ] },
      ],
    },
    {
      id: "binaersok",
      title: "Binærsøk: Bisect og Bisect′",
      blocks: [
        { type: "text", text: "**Problem:** gitt en sortert tabell $A$ og en verdi $v$, finn $i$ med $A[i] = v$, eller svar nil. **Idé:** se på midten. Fordi $A$ er sortert, vet vi hvilken halvdel $v$ må ligge i." },
        { type: "pseudocode", title: "Bisect(A, p, r, v)", lines: [
          "if p ≤ r",
          "    q = ⌊(p + r)/2⌋",
          "    if v == A[q]",
          "        return q",
          "    elseif v < A[q]",
          "        return Bisect(A, p, q − 1, v)",
          "    else return Bisect(A, q + 1, r, v)",
          "else return nil",
        ], caption: "$A[p : r]$ er segmentet vi fortsatt leter i. Kall med Bisect$(A, 1, n, v)$." },
        { type: "figure", component: BisectFigure, caption: "Søk etter $v = 7$ i $\\langle 1, 3, 4, 6, 8, 9, 11, 14 \\rangle$: tre runder, så er segmentet tomt og svaret nil." },
        { type: "text", text: "**Korrekthet** (induksjon over lengden av $A[p : r]$): er segmentet tomt, er nil riktig; er $v = A[q]$, er $q$ riktig. Ellers ligger $v$ bare i den halvdelen vi går til, og den er kortere, så IH gir riktig svar." },
        { type: "formula", latex: "T(1) = 1,\\quad T(n) = T(n/2) + 1 \\;\\Longrightarrow\\; T(n) = \\lg n + 1 = \\Theta(\\lg n)", name: "Kjøretid for binærsøk", caption: "Pensumheftet antar $n = 2^k$ og teller sammenligningene $p \\le r$. Beste tilfelle er $\\Theta(1)$ (treff med en gang)." },
        { type: "pseudocode", title: "Bisect′(A, p, r, v)", lines: [
          "while p ≤ r",
          "    q = ⌊(p + r)/2⌋",
          "    if v == A[q]",
          "        return q",
          "    elseif v < A[q]",
          "        r = q − 1",
          "    else p = q + 1",
          "return nil",
        ], caption: "Det rekursive kallet er det siste som skjer (et **tail call**), så det kan byttes med en løkke. Slipper kostnaden ved funksjonskall og bruker $O(1)$ ekstra minne. Invariant: finnes $v$ i $A$, så finnes $v$ i $A[p : r]$." },
        { type: "box", variant: "tip", title: "Antall runder", blocks: [
          { type: "text", text: "Løkka i Bisect′ kjører høyst $\\lfloor \\lg n \\rfloor + 1$ runder. For $n = 100$ er det $6 + 1 = 7$, fordi $2^6 = 64 \\le 100 < 128$." },
        ] },
      ],
    },
    {
      id: "merge-sort",
      title: "Merge-Sort",
      blocks: [
        { type: "text", text: "**Sortering** (innledningen til del II): input $\\langle a_1, \\dots, a_n \\rangle$, output de samme tallene i stigende rekkefølge. **Merge-Sort** deler på midten (gratis), sorterer begge halvdeler rekursivt og fletter dem (der jobben gjøres)." },
        { type: "pseudocode", title: "Merge(A, p, q, r)", lines: [
          "copy A[p : q] into L and A[q + 1 : r] into R, with ∞ at the end of each",
          "i = j = 1",
          "for k = p to r",
          "    if L[i] ≤ R[j]",
          "        A[k] = L[i]",
          "        i = i + 1",
          "    else A[k] = R[j]",
          "        j = j + 1",
        ], caption: "Forelesningens versjon med **vaktposter** $\\infty$: når $L$ er brukt opp, er $L[i] = \\infty$ og $R$ vinner alltid. Hvert element flyttes én gang, så Merge er $\\Theta(n)$. Boka (4. utg.) har en lengre versjon uten vaktposter." },
        { type: "pseudocode", title: "Merge-Sort(A, p, r)", lines: [
          "if p ≥ r",
          "    return",
          "q = ⌊(p + r)/2⌋",
          "Merge-Sort(A, p, q)",
          "Merge-Sort(A, q + 1, r)",
          "Merge(A, p, q, r)",
        ], caption: "0 eller 1 element er allerede sortert." },
        { type: "figure", component: MergeSortFigure, caption: "CLRS-eksempelet $\\langle 5, 2, 4, 7, 1, 3, 2, 6 \\rangle$. Siste fletting er $L = \\langle 2, 4, 5, 7 \\rangle$ og $R = \\langle 1, 2, 3, 6 \\rangle$." },
        { type: "formula", latex: "T(n) = 2T(n/2) + n \\;\\Longrightarrow\\; T(n) = \\Theta(n \\lg n) \\text{ i alle tilfeller}", name: "Kjøretid for Merge-Sort" },
        { type: "table", head: ["Egenskap", "Merge-Sort", "Hvorfor"], rows: [
          ["Stabil", "ja", "$\\le$ i Merge velger fra $L$ ved like verdier"],
          ["In-place", "nei", "$L$ og $R$ krever $\\Theta(n)$ ekstra minne"],
          ["Avhenger av input", "nei", "deler alltid på midten, så sortert input er ikke spesielt"],
        ] },
        { type: "box", variant: "tip", title: "Løkkeinvariant for Merge", blocks: [
          { type: "text", text: "Ved starten av hver runde inneholder $A[p : k-1]$ de $k - p$ minste elementene fra $L$ og $R$, sortert, og $L[i]$ og $R[j]$ er de minste som ikke er kopiert. Ved slutt er $k = r + 1$." },
        ] },
        { type: "box", variant: "pitfall", title: "Merge rører bare intervallet (øving 3, spm. 5)", blocks: [
          { type: "text", text: "$A = \\langle 1, 8, 3, 4, 1, 2, 7, 6, 8 \\rangle$ og Merge$(A, 3, 4, 7)$: $L = \\langle 3, 4 \\rangle$, $R = \\langle 1, 2, 7 \\rangle$, og resultatet er $\\langle 1, 8, \\mathbf{1, 2, 3, 4, 7}, 6, 8 \\rangle$. Plass 1, 2, 8 og 9 er uendret." },
        ] },
      ],
    },
    {
      id: "quicksort",
      title: "Quicksort og Randomized-Quicksort",
      blocks: [
        { type: "text", text: "**Quicksort** (Hoare, 1962) snur Merge-Sort på hodet: arbeidet ligger i delingen. Partition flytter små elementer til venstre og store til høyre for en **pivot**. Pivoten står da på endelig plass, og vi sorterer bare de to sidene. Kombinering er gratis." },
        { type: "pseudocode", title: "Partition(A, p, r)", lines: [
          "x = A[r]",
          "i = p − 1",
          "for j = p to r − 1",
          "    if A[j] ≤ x",
          "        i = i + 1",
          "        exchange A[i] with A[j]",
          "exchange A[i + 1] with A[r]",
          "return i + 1",
        ], caption: "Invariant: $A[p : i] \\le x$, $A[i+1 : j-1] > x$ og $A[r] = x$. Hvert element ses én gang, så Partition er $\\Theta(n)$, også på sortert input." },
        { type: "figure", component: PartitionFigure, caption: "Partition$(A, 1, 8)$ på $\\langle 2, 8, 7, 1, 3, 5, 6, 4 \\rangle$. Resultatet er delt rundt pivoten, men ikke sortert." },
        { type: "pseudocode", title: "Quicksort(A, p, r)", lines: [
          "if p < r",
          "    q = Partition(A, p, r)",
          "    Quicksort(A, p, q − 1)",
          "    Quicksort(A, q + 1, r)",
        ] },
        { type: "table", head: ["Tilfelle", "Splitt", "Rekurrens", "Kjøretid"], rows: [
          ["Beste", "på midten hver gang", "$T(n) = 2T(n/2) + n$", "$\\Theta(n \\lg n)$"],
          ["Gjennomsnitt", "tilfeldig (unike verdier, alle rekkefølger like sannsynlige)", "–", "$\\Theta(n \\lg n)$"],
          ["Verste", "$n - 1$ og $0$ hver gang", "$T(n) = T(n-1) + n$", "$\\Theta(n^2)$"],
        ] },
        { type: "figure", component: QuicksortShapesFigure, caption: "Formen på rekursjonstreet avgjør kjøretiden. Med pivot $A[r]$ gir sortert input (stigende eller synkende) og input der alle er like en kjede." },
        { type: "text", text: "**Hvorfor er snittet godt?** En dårlig splitt fulgt av en god koster $\\Theta(n) + \\Theta(n - 1) = \\Theta(n)$, som én god splitt. Og selv en fast 9 : 1-splitt gir $\\log_{10/9} n = \\Theta(\\lg n)$ nivåer à høyst $cn$. Enhver splitt med konstant proporsjon gir $\\Theta(n \\lg n)$." },
        { type: "pseudocode", title: "Randomized-Partition(A, p, r)", lines: [
          "i = Random(p, r)",
          "exchange A[r] with A[i]",
          "return Partition(A, p, r)",
        ], caption: "Randomized-Quicksort er Quicksort med Randomized-Partition. Pivoten byttes med det **siste** elementet, ikke det første." },
        { type: "box", variant: "theorem", title: "Randomized-Quicksort", blocks: [
          { type: "text", text: "Forventet kjøretid er $\\Theta(n \\lg n)$ for **enhver** input (med unike verdier). Verste tilfelle er fortsatt $\\Theta(n^2)$, men skyldes uflaks i trekningen, ikke en bestemt input. Derfor er forventet tid det vi faktisk kan regne med (CLRS 7.3-1)." },
        ] },
        { type: "table", head: ["Snitt over", "Kalles"], rows: [
          ["mulige input", "gjennomsnittlig tilfelle (average case)"],
          ["en sekvens operasjoner", "amortisering (forelesning 2a)"],
          ["algoritmens egne tilfeldige valg", "forventet kjøretid"],
        ] },
        { type: "table", head: ["", "Merge-Sort", "Quicksort"], rows: [
          ["Arbeidet ligger i", "kombineringen (Merge)", "delingen (Partition)"],
          ["Verste tilfelle", "$\\Theta(n \\lg n)$", "$\\Theta(n^2)$"],
          ["Beste og snitt", "$\\Theta(n \\lg n)$", "$\\Theta(n \\lg n)$"],
          ["Stabil", "ja", "nei"],
          ["In-place", "nei", "ja"],
        ] },
        { type: "box", variant: "pitfall", title: "Like verdier (CLRS 7.2-2 og 7-2)", blocks: [
          { type: "text", text: "Er alle elementene like, er $A[j] \\le x$ alltid sant, så Partition returnerer $q = r$ og $T(n) = T(n-1) + \\Theta(n) = \\Theta(n^2)$, også med tilfeldig pivot. Løsningen er en trevegs-Partition ($< x$, $= x$, $> x$) der midtdelen er ferdig." },
        ] },
      ],
    },
    {
      id: "masterteoremet",
      title: "Masterteoremet",
      blocks: [
        { type: "text", text: "Masterteoremet (CLRS teorem 4.1) løser rekurrenser på formen $T(n) = aT(n/b) + f(n)$ med $a \\ge 1$ og $b > 1$. Nivå $i$ i rekursjonstreet har $a^i$ noder som hver koster $f(n/b^i)$, og treet har $a^{\\log_b n}$ blader." },
        { type: "formula", latex: "a^{\\log_b n} = n^{\\log_b a}", name: "Antall blader i rekursjonstreet", caption: "Ta $\\log_b$ av begge sider: $\\log_b n \\cdot \\log_b a$ på begge. $n^{\\log_b a}$ kalles **vannskillefunksjonen**." },
        { type: "formula", latex: "T(n) = f(n) + af(n/b) + a^2 f(n/b^2) + \\dots + \\Theta\\!\\left(n^{\\log_b a}\\right)", name: "Rekurrensen ekspandert", caption: "Masterteoremet spør bare: hvem dominerer, roten eller bladene?" },
        { type: "table", head: ["Tilfelle", "Krav", "Svar", "Intuisjon"], rows: [
          ["1", "$f(n) = O(n^{\\log_b a - \\varepsilon})$ for en $\\varepsilon > 0$", "$\\Theta(n^{\\log_b a})$", "bladene dominerer"],
          ["2", "$f(n) = \\Theta(n^{\\log_b a} \\lg^k n)$ for en $k \\ge 0$", "$\\Theta(n^{\\log_b a} \\lg^{k+1} n)$", "alle nivåer like"],
          ["3", "$f(n) = \\Omega(n^{\\log_b a + \\varepsilon})$ og $af(n/b) \\le cf(n)$ for en $c < 1$", "$\\Theta(f(n))$", "roten dominerer"],
        ], caption: "$\\varepsilon > 0$ betyr at forskjellen må være **polynomisk** (en faktor $n^{\\varepsilon}$). En ren $\\lg$-faktor er ikke nok for tilfelle 1 eller 3." },
        { type: "figure", component: MasterCasesFigure, caption: "Arbeid per nivå: voksende mot bladene (tilfelle 1), likt (tilfelle 2) eller avtakende fra roten (tilfelle 3)." },
        { type: "list", ordered: true, items: [
          "Les av $a$, $b$ og $f(n)$.",
          "Regn ut $n^{\\log_b a}$.",
          "Sammenlign $f(n)$ med $n^{\\log_b a}$ og velg tilfelle.",
          "I tilfelle 3: sjekk regularitet, $af(n/b) \\le cf(n)$ med $c < 1$.",
        ] },
        { type: "table", head: ["Rekurrens", "$n^{\\log_b a}$", "Tilfelle", "Svar"], rows: [
          ["$T(n/2) + 1$ (binærsøk)", "$1$", "2, $k = 0$", "$\\Theta(\\lg n)$"],
          ["$2T(n/2) + n$ (Merge-Sort)", "$n$", "2, $k = 0$", "$\\Theta(n \\lg n)$"],
          ["$2T(n/2) + n \\lg n$", "$n$", "2, $k = 1$", "$\\Theta(n \\lg^2 n)$"],
          ["$4T(n/2) + n$", "$n^2$", "1", "$\\Theta(n^2)$"],
          ["$3T(n/2) + n$", "$n^{\\lg 3} \\approx n^{1{,}58}$", "1", "$\\Theta(n^{\\lg 3})$"],
          ["$7T(n/2) + n^2$", "$n^{\\lg 7} \\approx n^{2{,}81}$", "1", "$\\Theta(n^{\\lg 7})$"],
          ["$2T(n/2) + n^2$", "$n$", "3, $c = \\tfrac12$", "$\\Theta(n^2)$"],
          ["$T(n/2) + n$", "$1$", "3, $c = \\tfrac12$", "$\\Theta(n)$"],
          ["$3T(n/4) + n \\lg n$", "$n^{\\log_4 3} \\approx n^{0{,}79}$", "3, $c = \\tfrac34$", "$\\Theta(n \\lg n)$"],
        ] },
        { type: "box", variant: "pitfall", title: "Når virker masterteoremet ikke?", blocks: [
          { type: "list", items: [
            "Delinstansen er $n - 1$, ikke $n/b$: $T(n) = T(n-1) + n$. Bruk iterasjon ($\\Theta(n^2)$).",
            "Ulike størrelser: $T(n) = T(n/3) + T(2n/3) + n$. Bruk rekursjonstre ($\\Theta(n \\lg n)$).",
            "Hull mellom tilfellene: $T(n) = 2T(n/2) + n/\\lg n$ svarer til $k = -1$ og dekkes ikke. Rekursjonstreet gir $\\Theta(n \\lg \\lg n)$ (eksamen august 2023).",
          ] },
        ] },
        { type: "box", variant: "tip", title: "Tilfelle 2 med $k$ er nytt i 4. utgave", blocks: [
          { type: "text", text: "Eldre løsningsforslag (3. utgave) sier at for eksempel $3T(n/9) + \\sqrt{n} \\lg n$ ikke kan løses med masterteoremet. Med pensumutgaven er det tilfelle 2 med $k = 1$: $\\Theta(\\sqrt{n} \\lg^2 n)$ (øving 3, spm. 14)." },
        ] },
      ],
    },
    {
      id: "oving",
      title: "Øv på øvings- og eksamensoppgaver",
      blocks: [
        { type: "example", title: "Sett opp rekurrensen fra kode (øving 3, spm. 15 og 17)", blocks: [
          { type: "text", text: "Function-A$(n)$ kaller Function-C$(n)$ ($\\Theta(\\sqrt{n})$), A$(n/3)$ og B$(n)$, mens B$(n)$ kaller C$(n)$ og A$(n/3)$. Sett inn $T_B$ i $T_A$:" },
          { type: "formula", latex: "T_A(n) = T_A(n/3) + \\bigl[T_A(n/3) + \\Theta(\\sqrt{n})\\bigr] + \\Theta(\\sqrt{n}) = 2T_A(n/3) + \\Theta(\\sqrt{n})", caption: "$n^{\\log_3 2} \\approx n^{0{,}63}$ og $\\sqrt{n} = n^{0{,}5}$ er polynomisk mindre: tilfelle 1, $\\Theta(n^{\\log_3 2})$." },
          { type: "text", text: "Function-E har to nøstede løkker ($\\sum_i (n - i) = \\Theta(n^2)$) og 36 kall på $n/6$: $T(n) = 36T(n/6) + \\Theta(n^2)$. Siden $\\log_6 36 = 2$, er det tilfelle 2: $\\Theta(n^2 \\lg n)$." },
        ] },
        { type: "example", title: "Trekke fra en konstant (øving 3, spm. 16)", blocks: [
          { type: "text", text: "Function-D$(n)$ kaller D$(n - 42)$ og D$(42)$ når $n > 42$. D$(42)$ stopper med en gang, så $T(n) = T(n - 42) + \\Theta(1)$. Det blir $\\Theta(n/42) = \\Theta(n)$ kall, altså $\\Theta(n)$. Den stopper alltid." },
        ] },
        { type: "example", title: "Ulikheter gir bare én grense (øving 3, spm. 21 og 22)", blocks: [
          { type: "text", text: "Fra $T(n) \\ge 7T(n/4) + \\Theta(n \\lg n)$ følger bare $\\Omega$: tilfelle 1 gir $T(n) = \\Omega(n^{\\log_4 7})$, og dermed også $\\Omega(n \\lg n)$. Med $T(n) \\le 3T(n/4) + \\Theta(n \\lg n)$ og $T(n) \\ge 2T(n/3) + O(\\sqrt{n})$ får vi $O(n \\lg n)$ og $\\Omega(n^{\\log_3 2})$, men ingen $\\Theta$, fordi grensene er ulike." },
        ] },
        { type: "example", title: "Forenkle, gjett og bevis (øving 3, spm. 18)", blocks: [
          { type: "text", text: "$T(n) = T(n/2) + T(n/2 - 1) + T(n/2 - 2) + T(n/2 - 3) + n^2/36$. Uten de små konstantene er det $4T(n/2) + n^2 = \\Theta(n^2 \\lg n)$. Bevis gjetningen med substitusjon: $T(n) \\le 4c(n/2)^2 \\lg(n/2) + n^2/36 = cn^2 \\lg n - cn^2 + n^2/36 \\le cn^2 \\lg n$ når $c \\ge 1/36$. Grunntilfellet $n = 1$ feiler ($\\lg 1 = 0$), så velg $n_0 = 2$." },
        ] },
        { type: "example", title: "Splitt og hersk på en sortert tabell (eksamen august 2024, oppgave 20)", blocks: [
          { type: "text", text: "Tell forekomster av verdiene $0..k$ i en sortert $A$. Er første og siste element i intervallet like, er alle like, så vi legger til lengden. Ellers del på midten." },
          { type: "pseudocode", title: "Freq(A, C, p, r)", lines: [
            "if A[p] == A[r]",
            "    C[A[p]] = C[A[p]] + r − p + 1",
            "else q = ⌊(p + r)/2⌋",
            "    Freq(A, C, p, q)",
            "    Freq(A, C, q + 1, r)",
          ], caption: "$T(n) \\le 2T(n/2) + \\Theta(1)$ gir $O(n)$ (tilfelle 1). Med $d$ ulike verdier blir det $O(d \\lg n)$ kall, så mange duplikater gjør den raskere." },
        ] },
        { type: "example", title: "Binærsøk på formen (øving 3, spm. 11)", blocks: [
          { type: "text", text: "En **unimodal** tabell er strengt stigende og så strengt synkende, etter en rotasjon. Tenk på den som en ring med én topp. Se om tabellen stiger eller synker ved $low$ og ved $mid$, og om $A[mid] > A[low]$, og kast halvdelen som ikke kan ha toppen. $T(n) = T(n/2) + \\Theta(1) = \\Theta(\\lg n)$." },
        ] },
        { type: "example", title: "Garantert $\\Theta(n \\lg n)$ og lav stakkdybde (eksamen august 2024, oppgave 16, og CLRS 7-5)", blocks: [
          { type: "text", text: "Bruk medianen som pivot, funnet med Select i lineær tid (forelesning 4). Da er $T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n \\lg n)$ i verste tilfelle, men med høy konstantfaktor. For å begrense stakkdybden til $O(\\lg n)$: rekurser på den minste siden og la en løkke ta den største." },
        ] },
        { type: "quiz", items: [
          { question: "Quicksort: «q = UNKNOWN(A, p, r)», så kall på $A[p : q-1]$ og $A[q+1 : r]$. Hva er UNKNOWN?", answer: "**Partition.** Den returnerer en indeks, og $A[q]$ må stå på endelig plass." },
          { question: "Er $A[1] \\le A[n]$ alltid sant etter Partition$(A, 1, n)$?", answer: "**Ja.** $A[1]$ er $\\le x$ og $A[n]$ er $\\ge x$. Og er $A[n]$ ekte størst fra før, endres ingenting." },
          { question: "Quicksort på en tabell sortert stigende og en sortert synkende. Kjøretid?", answer: "**$\\Theta(n^2)$ for begge.** Pivoten er alltid et ytterpunkt, så $T(n) = T(n-1) + \\Theta(n)$." },
          { question: "Hvilken av Quicksort og Merge-Sort sorterer in-place?", answer: "**Quicksort.** Merge-Sort bruker $\\Theta(n)$ ekstra plass til $L$ og $R$." },
          { question: "Kan Randomized-Quicksort bruke $\\Theta(n^2)$ tid på en sortert tabell?", answer: "**Ja, men sjelden.** Verste tilfelle er $\\Theta(n^2)$, men en sortert tabell gir ikke **alltid** $\\Theta(n^2)$. Forventet tid er $\\Theta(n \\lg n)$." },
          { question: "$T(n) = 32T(n/4) + 3n^3 + 7n$. Hvilket tilfelle?", answer: "**Tilfelle 3.** $\\log_4 32 = 2{,}5$, og $n^3$ er polynomisk større ($\\varepsilon = 0{,}5$). Svar $\\Theta(n^3)$." },
          { question: "$T(n) = 64T(n/4) + 3n^3 + 7n$?", answer: "$\\log_4 64 = 3$, så tilfelle 2 med $k = 0$: **$\\Theta(n^3 \\lg n)$**." },
          { question: "$T(n) = T(n-1) + 2n - 1$ med $T(0) = 0$, eksakt (eksamen desember 2025)?", answer: "**$T(n) = n^2$**, summen av de $n$ første oddetallene." },
          { question: "$T(n) = T(n/5) + T(4n/5) + n$ (eksamen august 2026)?", answer: "**$\\Theta(n \\lg n)$.** Hvert fulle nivå koster $n$, og både korteste og lengste sti er $\\Theta(\\lg n)$." },
          { question: "Lurvik-Sort kjører Insertion-Sort og så Merge-Sort, Smartnes-Sort motsatt. Hvem er best i verste tilfelle?", answer: "**Smartnes-Sort:** Merge-Sort $\\Theta(n \\lg n)$, så Insertion-Sort på sortert tabell $\\Theta(n)$. Lurvik-Sort risikerer $\\Theta(n^2)$ (eksamen august 2023)." },
        ] },
      ],
    },
  ],
};
