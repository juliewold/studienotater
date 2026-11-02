import type { Lesson } from "../types";
import {
  BucketSortFigure, CountingSortFigure, DecisionTreeFigure, MedianOfMediansFigure, RadixPitfallsFigure, RadixSortFigure,
  RandomizedSelectFigure, SelectTreeFigure, StabilityFigure, StrategyFigure,
} from "./figures04";

const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view`, kind: "drive" as const });

// Based on the pensum booklet (lecture 4, goals D1–D7), the lecture slides, CLRS chapters 8 and 9,
// exercise 4 with its solution and the reviewed notes for lecture 4 and exercise 4 (parts 1 and 2).
export const lesson: Lesson = {
  subjectId: "tdt4120",
  unitId: "04",
  reviewed: "2026-11-02",
  summary: "Sortering som bare bruker **sammenligninger** ($x \\le y$) trenger $\\Omega(n \\lg n)$ tid i verste tilfelle, fordi den må skille mellom alle $n!$ rekkefølger. Forelesningen viser to måter å komme under grensen: **svekk kravet til output** (finn bare ett element med en gitt rang: **Randomized-Select** og **Select**) eller **styrk kravet til input** (anta noe om verdiene: **Counting-Sort**, **Radix-Sort** og **Bucket-Sort**). Alle fem bruker lineær tid under sine egne antagelser.",
  overview: [
    "**Sorteringsgrensen (D1, !):** et beslutningstre for $n$ elementer har minst $n!$ blader og høyde $h$ med $2^h \\ge n!$. Derfor $h \\ge \\lg n! = \\Theta(n \\lg n)$: verste tilfelle er $\\Omega(n \\lg n)$ for **enhver** sammenligningsbasert sortering.",
    "Grensen er en **nedre grense for verste tilfelle**. Gjennomsnittet er også $\\Omega(n \\lg n)$, beste tilfelle kan være $\\Theta(n)$, og en algoritme kan alltid være verre.",
    "**Stabil (D2):** like nøkler kommer i samme rekkefølge i output som i input.",
    "**Counting-Sort (D3):** heltall i $0..k$. Tell, gjør $C$ kumulativ ($C[v]$ = plassen til siste $v$) og plasser baklengs. $\\Theta(n + k)$. Baklengs løkke gjør den **stabil**.",
    "**Radix-Sort (D4, !):** sorter på ett siffer om gangen, **minst signifikant først**, med en **stabil** subrutine. $\\Theta(d(n + k))$ med Counting-Sort. Ustabil subrutine eller feil retning gir feil svar.",
    "**Bucket-Sort (D5):** uniformt fordelte tall i $[0, 1)$. Legg $A[i]$ i bøtte $\\lfloor nA[i] \\rfloor$, sorter hver bøtte med Insertion-Sort og sett sammen. $\\Theta(n)$ i **snitt** (over input), $\\Theta(n^2)$ i verste tilfelle.",
    "**Randomized-Select (D6):** Quicksort + binærsøk. Partition rundt tilfeldig pivot, $k = q - p + 1$, og fortsett bare på siden med rang $i$ (høyre side: $i - k$). **Forventet** $\\Theta(n)$, verste $\\Theta(n^2)$.",
    "**Select (D7):** median av medianer (grupper på 5) gir en pivot med minst ca. $3n/10$ elementer på hver side. $\\Theta(n)$ i **verste** tilfelle. De $k$ minste: Select + Partition i $O(n)$.",
  ],
  keyFormulas: [
    { latex: "2^h \\ge n! \\;\\Rightarrow\\; h \\ge \\lg n! = \\Theta(n \\lg n)", label: "Sorteringsgrensen (beslutningstre med høyde $h$)" },
    { latex: "T(n) = T(n/2) + n = 2n - 1 = \\Theta(n)", label: "Randomized-Select, intuitiv forventet tid" },
    { latex: "T(n) \\le T(n/5) + T(7n/10) + O(n) = O(n)", label: "Select, verste tilfelle" },
    { latex: "\\Theta(n + k), \\qquad \\Theta\\bigl(d(n + k)\\bigr), \\qquad \\Theta(n) \\text{ i snitt}", label: "Counting-Sort, Radix-Sort og Bucket-Sort" },
    { latex: "\\text{bøtte}(A[i]) = \\lfloor n \\cdot A[i] \\rfloor", label: "Bucket-Sort: hvilken bøtte" },
  ],
  goals: [
    "Forstå hvorfor sammenligningsbasert sortering har en worst-case på $\\Omega(n \\lg n)$ **(D1, !)**",
    "Vite hva en stabil sorteringsalgoritme er **(D2)**",
    "Forstå Counting-Sort, og hvorfor den er stabil **(D3)**",
    "Forstå Radix-Sort, og hvorfor den trenger en stabil subrutine **(D4, !)**",
    "Forstå Bucket-Sort **(D5)**",
    "Forstå Randomized-Select **(D6)**",
    "Kjenne til Select, inkludert at den finner de $k$ minste elementene i $O(n)$. Grundig forståelse av virkemåten kreves ikke **(D7)**",
  ],
  concepts: [
    "comparison-based-sorting", "sorting-lower-bound", "decision-tree", "sorting-algorithm", "stable-sorting",
    "counting-sort", "radix-sort", "bucket-sort", "insertion-sort", "uniform-fordeling",
    "order-statistic", "selection-problem", "randomized-select", "select", "median-of-medians",
    "partition", "randomized-partition", "pivot", "randomized-algorithm", "expected-runtime", "best-case", "worst-case", "average-case",
  ],
  notes: [{ slug: "forelesning-4-rangering-i-line-r-tid", label: "Forelesning 4 - Rangering i lineær tid" }],
  sources: [
    drive("Pensumhefte 2026, forelesning 4", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
    drive("Forelesning 4 (lysark)", "129eEHRDLGQc_u7yZaou9WdUs4GaH1sq9"),
    drive("Øving 4: Rangering i lineær tid", "1E7jTmI9w_ILcUbq7OQkC9FAxh-5qEJbU"),
    drive("Løsningsforslag øving 4", "1TAQtW8pgMfBqhG6NKFSnngND1K-EYTfx"),
    { label: "Forelesning 4 - Rangering i lineær tid", url: "forelesning-4-rangering-i-line-r-tid", kind: "note" },
    { label: "Øving 4, del 1: spørsmål 1–22 (løsningsforslag)", url: "ving-4-rangering-i-line-r-tid-del-1-sp-rsmal-1-22-l-sningsforslag", kind: "note" },
    { label: "Øving 4, del 2: ekstraoppgaver (spørsmål 23)", url: "ving-4-rangering-i-line-r-tid-del-2-ekstraoppgaver-sp-rsmal-23", kind: "note" },
  ],
  sections: [
    {
      id: "ideen",
      title: "Idéen: endre problemet litt",
      blocks: [
        { type: "text", text: "Pensumheftet sier det slik: vi får ofte bedre løsninger ved å **styrke kravene til input** eller **svekke kravene til output**. Sortering er eksempelet. Med bare sammenligninger kommer vi ikke under $n \\lg n$, men om vi bare vil finne **ett** element, eller vet mer om verdiene, går det i lineær tid." },
        { type: "figure", component: StrategyFigure, caption: "Forelesningens seks deler: grensen, to utvalgsalgoritmer (venstre) og tre sorteringer som antar noe om input (høyre)." },
        { type: "table", head: ["Ord", "Betyr"], rows: [
          ["**rang** $i$", "plassen et element ville hatt i sortert rekkefølge: rang 1 er minst, rang $n$ er størst"],
          ["**$i$-te ordensstatistikk**", "elementet med rang $i$. Minimum er $i = 1$, maksimum er $i = n$"],
          ["**median**", "midterste element, rang $\\lfloor (n+1)/2 \\rfloor$ (nedre median når $n$ er partall)"],
          ["**utvalgsproblemet** (selection)", "gitt $A$ og $i$, finn elementet med rang $i$"],
        ], caption: "Utvalgsproblemet kan løses ved å sortere og slå opp ($\\Theta(n \\lg n)$), men det gjør mye unødvendig arbeid: vi trenger ikke rekkefølgen til alle de andre." },
      ],
    },
    {
      id: "sorteringsgrensen",
      title: "Sorteringsgrensen: hvorfor Ω(n lg n)?",
      blocks: [
        { type: "text", text: "En **sammenligningsbasert** sortering lærer bare om input ved å spørre «er $a_i \\le a_j$?». Insertion-Sort, Merge-Sort, Quicksort og Heapsort er slike. Spørsmålet er: hvor mange slike ja/nei-spørsmål trengs **alltid**, uansett hvor lur algoritmen er?" },
        { type: "list", ordered: true, items: [
          "$n$ ulike elementer kan ligge i $n! = n \\cdot (n-1) \\cdots 2 \\cdot 1$ rekkefølger (permutasjoner). Algoritmen må skille mellom alle, for hver av dem krever en annen omstokking.",
          "Hvert ja/nei-svar kan høyst halvere mengden rekkefølger som fortsatt er mulige.",
          "Etter $T(n)$ spørsmål kan vi derfor skille mellom høyst $2^{T(n)}$ tilfeller, så vi må ha $2^{T(n)} \\ge n!$.",
          "Ta $\\lg$ (logaritme med grunntall 2) på begge sider: $T(n) \\ge \\lg n!$.",
        ] },
        { type: "box", variant: "definition", title: "Beslutningstre", blocks: [
          { type: "text", text: "Et binært tre som viser **alle** sammenligningene algoritmen kan gjøre for en gitt $n$. Hver indre node $i : j$ er en sammenligning, hvert blad er en ferdig rekkefølge. En kjøring er en sti fra roten til et blad, og **verste tilfelle er høyden** $h$ (lengste sti)." },
        ] },
        { type: "figure", component: DecisionTreeFigure, caption: "Insertion-Sort på tre elementer. Lilla sti: input $\\langle 6, 8, 5 \\rangle$ gir bladet $\\langle 3, 1, 2 \\rangle$, altså $a_3 \\le a_1 \\le a_2$, eller $5 \\le 6 \\le 8$." },
        { type: "formula", latex: "n! \\le \\text{antall blader} \\le 2^h \\;\\Longrightarrow\\; h \\ge \\lg n!", name: "Beslutningstreet: blader og høyde", caption: "Et binært tre med høyde $h$ har høyst $2^h$ blader. Hvert av de $n!$ svarene må være et blad." },
        { type: "text", text: "Nå trenger vi bare å vise at $\\lg n!$ vokser som $n \\lg n$. Bruk **Stirlings tilnærming** (en nedre grense for $n!$; $e \\approx 2{,}718$):" },
        { type: "formula", latex: "n! > \\left(\\frac{n}{e}\\right)^{n} \\;\\Longrightarrow\\; \\lg n! > n \\lg \\frac{n}{e} = n \\lg n - n \\lg e = \\Omega(n \\lg n)", name: "Fra lg n! til n lg n (Stirling)", caption: "$\\lg(x^n) = n \\lg x$ og $\\lg(x/y) = \\lg x - \\lg y$. Leddet $n \\lg e \\approx 1{,}44\\,n$ vokser saktere enn $n \\lg n$." },
        { type: "box", variant: "theorem", title: "Teorem 8.1 (CLRS)", blocks: [
          { type: "text", text: "Enhver sammenligningsbasert sorteringsalgoritme bruker $\\Omega(n \\lg n)$ sammenligninger i verste tilfelle. Siden $n! \\le n^n$, er også $\\lg n! \\le n \\lg n$, så $\\lg n! = \\Theta(n \\lg n)$. Grensen er tett: Merge-Sort og Heapsort når den." },
        ] },
        { type: "table", head: ["Tilfelle", "Nedre grense for alle", "Hvorfor"], rows: [
          ["Verste, $T_w$", "$\\Omega(n \\lg n)$", "høyden på beslutningstreet er minst $\\lg n!$"],
          ["Gjennomsnitt og forventet, $T_a$", "$\\Omega(n \\lg n)$", "også gjennomsnittlig bladdybde er minst $\\lg n!$"],
          ["Beste, $T_b$", "$\\Omega(n)$", "for å garantere rett svar må alle $n$ elementer leses (Insertion-Sort på sortert input er $\\Theta(n)$)"],
        ], caption: "Det finnes ingen generell **øvre** grense: en algoritme kan alltid være vilkårlig dårlig. Derfor er svaret på øving 4, spm. 5, «$\\Omega(n \\lg n)$» og ikke $\\Theta(n \\lg n)$." },
        { type: "box", variant: "pitfall", title: "Ukens snubletråd (pensumheftet)", blocks: [
          { type: "text", text: "Her beskrives **verste tilfelle** med en **nedre** grense ($\\Omega$). Alle asymptotiske notasjoner kan brukes på alle tilfeller. For at grensen skal «smitte over» på et annet problem $X$, må vi redusere **fra** sortering **til** $X$ med en reduksjon som tar $o(n \\lg n)$ tid. Tok reduksjonen selv $\\Omega(n \\lg n)$, kunne all sorteringsjobben ligge i reduksjonen, og vi ville ikke lært noe om $X$." },
        ] },
        { type: "example", title: "Detektiv Smartnes (øving 4, spm. 7)", blocks: [
          { type: "text", text: "Hun skal finne hvordan 14 personer satt rundt bordet og stiller flervalgsspørsmål med **4** alternativer. Samme tankegang, men hvert svar deler mulighetene i 4 i stedet for 2:" },
          { type: "formula", latex: "4^k \\ge 14! \\;\\Longrightarrow\\; k \\ge \\log_4 14! \\approx 18{,}17 \\;\\Longrightarrow\\; k = 19", caption: "$14! \\approx 8{,}7 \\cdot 10^{10}$. Antall spørsmål er et heltall, så **minst 19** i verste tilfelle." },
        ] },
      ],
    },
    {
      id: "randomized-select",
      title: "Randomized-Select",
      blocks: [
        { type: "text", text: "**Idé:** Quicksort + binærsøk. Partition setter pivoten på **endelig plass** (som i Quicksort). Da vet vi hvilken side elementet med rang $i$ ligger på, og trenger bare å fortsette der (som i binærsøk). Ett rekursivt kall i stedet for to. Vi antar at alle verdiene er ulike." },
        { type: "pseudocode", title: "Randomized-Select(A, p, r, i)", lines: [
          "if p == r",
          "    return A[p]",
          "q = Randomized-Partition(A, p, r)",
          "k = q − p + 1",
          "if i == k",
          "    return A[q]",
          "elseif i < k",
          "    return Randomized-Select(A, p, q − 1, i)",
          "else return Randomized-Select(A, q + 1, r, i − k)",
        ], caption: "$A$ er tabellen, $A[p : r]$ delen vi leter i, $i$ rangen vi leter etter **innenfor** $A[p : r]$. $q$ er pivotens indeks og $k$ pivotens rang i $A[p : r]$. Randomized-Partition bytter et tilfeldig element inn på plass $r$ og kjører Partition (forelesning 3)." },
        { type: "list", items: [
          "**Hvorfor $k = q - p + 1$?** Etter Partition er $A[p : q-1]$ mindre enn pivoten. Det er $q - p$ elementer, så pivoten selv er nummer $q - p + 1$.",
          "**Hvorfor $i - k$ til høyre?** Til venstre for og på $q$ ligger de $k$ minste. Leter vi etter rang 7 og pivoten har rang 4, er svaret rang $7 - 4 = 3$ blant elementene til høyre.",
          "**Til venstre** beholder vi $i$, fordi ingen mindre elementer er kastet.",
        ] },
        { type: "figure", component: RandomizedSelectFigure, caption: "Finn rang $i = 4$ i $\\langle 4, 6, 8, 3, 2, 5, 7, 1 \\rangle$. Pivotene er valgt for eksempelets skyld (i algoritmen er de tilfeldige), og tabellene viser det Partition faktisk gir." },
        { type: "text", text: "**Forventet kjøretid, intuitivt** (forelesningen): en tilfeldig pivot deler i snitt omtrent på midten. Partition koster $n$, og vi rekurserer på én halvdel:" },
        { type: "formula", latex: "\\begin{aligned} T(n) &= n + T(n/2) = n + \\tfrac{n}{2} + T(n/4) = \\dots \\\\ &= n + \\tfrac{n}{2} + \\tfrac{n}{4} + \\dots + 2 + 1 = 2n - 1 \\end{aligned}", name: "Randomized-Select: iterasjon på T(n) = T(n/2) + n", caption: "Geometrisk sum med $\\lg n$ halveringer ned til $T(1) = 1$. Hver halvering koster halvparten av forrige, så totalen er under $2n$." },
        { type: "box", variant: "tip", title: "Verifiser med substitusjon (fra lysarkene)", blocks: [
          { type: "text", text: "Grunntilfelle: $T(1) = 2 \\cdot 1 - 1 = 1$. IH: $T(k) = 2k - 1$ for alle $k < n$. Trinn: $T(n) = T(n/2) + n = \\bigl(2 \\cdot \\tfrac{n}{2} - 1\\bigr) + n = 2n - 1$. Den fullstendige analysen (CLRS 9.2) bruker forventningsverdier og gir det samme: $E[T(n)] = \\Theta(n)$." },
        ] },
        { type: "table", head: ["Tilfelle", "Kjøretid", "Hvorfor"], rows: [
          ["Verste, $T_w$", "$\\Theta(n^2)$", "uflaks: pivoten er hver gang et ytterpunkt, så bare ett element forsvinner, som i Quicksort"],
          ["Forventet, $T_a$", "$\\Theta(n)$", "$n + n/2 + n/4 + \\dots + 1$ operasjoner"],
          ["Beste, $T_b$", "$\\Theta(n)$", "første Partition må uansett se på alle $n$"],
        ] },
        { type: "box", variant: "pitfall", title: "Forventet tid er ikke gjennomsnittlig tilfelle", blocks: [
          { type: "text", text: "Randomized-Select er $\\Theta(n)$ i **forventning over algoritmens egne tilfeldige valg**, for **enhver** input. Ingen kjenning kan velge en input som alltid er dårlig. Bucket-Sort senere er $\\Theta(n)$ i **gjennomsnitt over tilfeldige input**: der er det input som må være tilfeldig." },
        ] },
      ],
    },
    {
      id: "select",
      title: "Select: lineær tid også i verste tilfelle",
      blocks: [
        { type: "text", text: "Randomized-Select kan være uheldig med pivoten. **Select** (Blum, Floyd, Pratt, Rivest og Tarjan, 1973) **konstruerer** en pivot som garantert ligger nær midten: **median av medianer**. Resten er som i Randomized-Select. Du trenger bare å **kjenne til** algoritmen (D7), ikke kunne detaljene." },
        { type: "figure", component: MedianOfMediansFigure, caption: "Hver kolonne er en sortert gruppe på 5 med medianen i midten. Pivoten $x$ er medianen av gruppemedianene. Halvparten av gruppene har median $\\le x$, og i hver av dem er 3 elementer $\\le x$: til sammen omtrent $3n/10$." },
        { type: "pseudocode", title: "Select(A, p, r, i)", lines: [
          "while (r − p + 1) mod 5 ≠ 0",
          "    for j = p + 1 to r",
          "        if A[p] > A[j]",
          "            exchange A[p] with A[j]",
          "    if i == 1",
          "        return A[p]",
          "    p = p + 1",
          "    i = i − 1",
          "g = (r − p + 1)/5",
          "for j = p to p + g − 1",
          "    sort ⟨A[j], A[j + g], A[j + 2g], A[j + 3g], A[j + 4g]⟩ in place",
          "x = Select(A, p + 2g, p + 3g − 1, ⌈g/2⌉)",
          "q = Partition-Around(A, p, r, x)",
          "k = q − p + 1",
          "if i == k",
          "    return A[q]",
          "elseif i < k",
          "    return Select(A, p, q − 1, i)",
          "else return Select(A, q + 1, r, i − k)",
        ], caption: "Linje 1–8: går ikke antallet opp i 5, flytt minimum til $A[p]$ og krymp (høyst 4 ganger). Linje 9–11: $g$ grupper, «flettet» med avstand $g$, så medianene havner samlet i $A[p + 2g : p + 3g - 1]$. Linje 12: medianen av dem (her den **øvre** medianen, $\\lceil g/2 \\rceil$). Linje 13–19: som Randomized-Select, men Partition-Around bruker den oppgitte pivoten $x$." },
        { type: "formula", latex: "T(n) \\le \\underbrace{T(n/5)}_{\\text{finn } x} + \\underbrace{T(7n/10)}_{\\text{største side}} + \\underbrace{O(n)}_{\\text{grupper og Partition}} = O(n)", name: "Select: rekurrens i verste tilfelle", caption: "Minst ca. $3n/10$ elementer er på hver side av $x$, så den siden vi fortsetter på har høyst ca. $7n/10$." },
        { type: "figure", component: SelectTreeFigure, caption: "Nøkkelen er at $\\tfrac15 + \\tfrac{7}{10} = \\tfrac{9}{10} < 1$. Arbeidet krymper med en fast faktor per nivå, så summen domineres av roten." },
        { type: "box", variant: "theorem", title: "De k minste i lineær tid (eksplisitt i D7)", blocks: [
          { type: "text", text: "Kjør Select for å finne elementet $x$ med rang $k$, og partisjoner rundt $x$. Da ligger de $k$ minste i $A[1 : k]$, men **ikke sortert**. Totalt $O(n)$ i verste tilfelle. Trenger du dem sortert, legg til $O(k \\lg k)$. Medianen (øving 4, spm. 12) finnes også i $O(n)$, for partall med to kall." },
        ] },
        { type: "table", head: ["", "Randomized-Select", "Select"], rows: [
          ["Pivot", "tilfeldig element", "median av medianer"],
          ["Forventet", "$\\Theta(n)$", "$\\Theta(n)$"],
          ["Verste tilfelle", "$\\Theta(n^2)$", "$\\Theta(n)$"],
          ["I praksis", "enkel og rask", "høy konstantfaktor"],
        ], caption: "Øving 4, spm. 18: forskjellen i verste tilfelle skyldes bare **hvordan pivoten velges**." },
      ],
    },
    {
      id: "counting-sort",
      title: "Stabil sortering og Counting-Sort",
      blocks: [
        { type: "box", variant: "definition", title: "Stabil sortering (D2)", blocks: [
          { type: "text", text: "En sortering er **stabil** hvis like nøkler opptrer i samme rekkefølge i output som i input. Det betyr noe når elementene har mer data enn nøkkelen, for eksempel par $(x, y)$ sortert bare på $x$." },
        ] },
        { type: "figure", component: StabilityFigure, caption: "Øving 4, spm. 3: sortert stabilt på $x$ blir svaret $\\langle (1,5), (3,4), (3,2), (3,3), (5,1), (8,3) \\rangle$. Den nederste raden er sortert på $y$ blant like $x$, og det er feil." },
        { type: "table", head: ["Stabil", "Ikke stabil"], rows: [
          ["Insertion-Sort, Merge-Sort, Counting-Sort", "Quicksort (Partition bytter over lange avstander), Heapsort"],
          ["Radix-Sort og Bucket-Sort med stabil subrutine", "Radix-Sort og Bucket-Sort med Quicksort som subrutine"],
        ], caption: "Øving 4, spm. 4. Prøv Quicksort på $\\langle 2, 2', 1 \\rangle$: resultatet er $\\langle 1, 2', 2 \\rangle$." },
        { type: "text", text: "**Counting-Sort** antar at hver $A[j]$ er et **heltall i $0..k$**. Da kan verdien brukes direkte som indeks i en tabell $C[0 : k]$. Idéen: riktig plass for den siste $v$-en i sortert rekkefølge er **antall elementer $\\le v$**." },
        { type: "pseudocode", title: "Counting-Sort(A, n, k)", lines: [
          "new: B[1 : n], C[0 : k]",
          "for i = 0 to k",
          "    C[i] = 0",
          "for j = 1 to n",
          "    C[A[j]] = C[A[j]] + 1",
          "for i = 1 to k",
          "    C[i] = C[i] + C[i − 1]",
          "for j = n downto 1",
          "    B[C[A[j]]] = A[j]",
          "    C[A[j]] = C[A[j]] − 1",
          "return B",
        ], caption: "$A$ input, $n$ lengde, $0..k$ verdiområdet, $B$ resultatet og $C$ tellingene. Linje 4–5: $C[v]$ = antall $v$-er. Linje 6–7: $C[v]$ = antall $\\le v$ = plassen til **siste** $v$. Linje 8–10: plasser baklengs; neste like $v$ havner ett hakk til venstre." },
        { type: "figure", component: CountingSortFigure, caption: "Lysarkenes eksempel $\\langle 2, 5, 3, 0, 2, 3, 0, 3 \\rangle$ med $k = 5$. Fargen viser verdien (0 grønn, 2 gul, 3 lilla), og merkene $'$ og $''$ skiller like verdier, slik at vi ser at rekkefølgen beholdes. Indeksen i $C$ er selve verdien $v$." },
        { type: "example", title: "Siste løkke steg for steg", blocks: [
          { type: "table", head: ["$j$", "$A[j]$", "$C[A[j]]$ før", "legges i", "$C[A[j]]$ etter"], rows: [
            ["8", "$3''$", "7", "$B[7]$", "6"],
            ["7", "$0'$", "2", "$B[2]$", "1"],
            ["6", "$3'$", "6", "$B[6]$", "5"],
            ["5", "$2'$", "4", "$B[4]$", "3"],
            ["4", "$0$", "1", "$B[1]$", "0"],
            ["3", "$3$", "5", "$B[5]$", "4"],
            ["2", "$5$", "8", "$B[8]$", "7"],
            ["1", "$2$", "3", "$B[3]$", "2"],
          ], caption: "Start med kumulativ $C = [2, 2, 4, 7, 7, 8]$. Den **siste** 3-eren i $A$ tas først og får den **siste** 3-plassen, $B[7]$. Derfor står $3, 3', 3''$ i samme rekkefølge som i $A$." },
        ] },
        { type: "box", variant: "theorem", title: "Hvorfor er Counting-Sort stabil? (D3)", blocks: [
          { type: "text", text: "$C[v]$ peker på den **bakerste** ledige plassen for $v$. Vi går gjennom $A$ **bakfra**, så den bakerste $v$-en i input får den bakerste plassen, den nest bakerste den neste, og så videre. Å gå forfra ville gitt samme kjøretid og en sortert tabell, men like verdier i **omvendt** rekkefølge (øving 4, spm. 10)." },
        ] },
        { type: "formula", latex: "T(n, k) = \\underbrace{\\Theta(k)}_{\\text{nullstill}} + \\underbrace{\\Theta(n)}_{\\text{tell}} + \\underbrace{\\Theta(k)}_{\\text{kumulativ}} + \\underbrace{\\Theta(n)}_{\\text{plasser}} = \\Theta(n + k)", name: "Kjøretid for Counting-Sort", caption: "Lineær når $k = O(n)$. Er $k \\gg n$ ($k$ mye større enn $n$), domineres det av $k$: $\\Theta(k)$ (øving 4, spm. 8)." },
        { type: "box", variant: "tip", title: "Hvorfor motsier ikke dette sorteringsgrensen?", blocks: [
          { type: "text", text: "Counting-Sort sammenligner aldri to elementer. Den bruker verdien som **indeks**, $C[A[j]]$, og det er informasjon en sammenligningsbasert algoritme ikke har. Prisen er antagelsen: med $\\langle 2, 1\\,000\\,000, 7 \\rangle$ er $n = 3$, men $C$ må ha en million plasser." },
        ] },
        { type: "box", variant: "pitfall", title: "Ny i 4. utgave", blocks: [
          { type: "text", text: "Counting-Sort tar ikke lenger $B$ som argument, men lager og returnerer den. Brukt i Radix-Sort må resultatet kopieres tilbake til $A$ (CLRS s. 213). Prinsippet er det samme." },
        ] },
      ],
    },
    {
      id: "radix-sort",
      title: "Radix-Sort",
      blocks: [
        { type: "text", text: "Hva om tallene er store, for eksempel firesifrede? Da blir $C$ i Counting-Sort stor. **Radix-Sort** (Hollerith, hullkort 1890) sorterer i stedet **ett siffer om gangen**, fra det **minst signifikante** (enerne) til det mest signifikante. Hvert siffer har bare $k + 1$ mulige verdier (10 i titallssystemet)." },
        { type: "pseudocode", title: "Radix-Sort(A, n, d)", lines: [
          "for i = 1 to d",
          "    use a stable sort to sort A[1 : n] on digit i",
        ], caption: "$d$ er antall siffer, og siffer 1 er det **minst** signifikante. Subrutinen **må være stabil**: den må ikke bytte om elementer med likt siffer. Bruk for eksempel Counting-Sort." },
        { type: "figure", component: RadixSortFigure, caption: "Lysarkenes eksempel. Etter pass $i$ er tallene sortert på de $i$ siste sifrene. Etter fire pass er alt sortert." },
        { type: "box", variant: "theorem", title: "Hvorfor må subrutinen være stabil? (D4, !)", blocks: [
          { type: "text", text: "**Invariant:** etter pass $i$ er tallene sortert på sine $i$ siste sifre. Se på to tall $a$ og $b$ i pass $i + 1$. Har de **ulikt** siffer $i + 1$, legger passet dem riktig. Har de **likt** siffer, avgjøres rekkefølgen av de $i$ siste sifrene. Den var riktig etter forrige pass, og en **stabil** sortering endrer den ikke. Med en ustabil sortering kan den gode rekkefølgen ødelegges (CLRS lemma 8.3)." },
        ] },
        { type: "figure", component: RadixPitfallsFigure, caption: "Samme fire tall tre ganger. Går vi fra mest signifikant siffer først (lysarkenes «Xidar-Non-Sort»), blir resultatet sortert bare på siste siffer. Det finnes varianter som går den veien, men de gjør mer enn denne løkka." },
        { type: "formula", latex: "T(n) = d \\cdot \\Theta(n + k) = \\Theta\\bigl(d(n + k)\\bigr)", name: "Kjøretid for Radix-Sort", caption: "$n$ tall, $d$ siffer per tall, hvert siffer i $0..k$. Er $d$ konstant og $k = O(n)$, blir det $\\Theta(n)$." },
        { type: "box", variant: "tip", title: "Hvor store er «sifrene»? (CLRS lemma 8.4)", blocks: [
          { type: "text", text: "Vi velger selv. Del $b$-bits tall i siffer på $r$ bits: da er $d = \\lceil b/r \\rceil$ og $k = 2^r - 1$, og tiden blir $\\Theta\\bigl(\\tfrac{b}{r}(n + 2^r)\\bigr)$. Valget $r \\approx \\lg n$ gir $\\Theta(bn / \\lg n)$. Eksempel: $n = 2^{16}$ tall på $b = 32$ bits med $r = 16$ gir to pass med Counting-Sort." },
        ] },
        { type: "table", head: ["Situasjon", "Velg", "Hvorfor"], rows: [
          ["$k$ liten, $k = O(n)$", "Counting-Sort", "$\\Theta(n + k) = \\Theta(n)$, ett pass"],
          ["$k \\gg n$ (mye større)", "Radix-Sort", "$\\Theta(d(n + k_0))$ med små siffer $k_0$ slår $\\Theta(k)$ (øving 4, spm. 16)"],
          ["$0 \\le a_i \\le n^3 - 1$", "Radix-Sort i base $n$", "høyst 3 siffer i $0..n-1$: $\\Theta(3(n + n)) = \\Theta(n)$ (øving 4, spm. 20)"],
        ] },
      ],
    },
    {
      id: "bucket-sort",
      title: "Bucket-Sort",
      blocks: [
        { type: "text", text: "**Bucket-Sort** antar at input er $n$ tall **uniformt fordelt** i $[0, 1)$: alle verdier er like sannsynlige, og tallene er uavhengige. Del intervallet i $n$ like store **bøtter**. Da havner det i snitt **ett** tall i hver bøtte. Det er en ordnet form for hashing: vi regner ut riktig bøtte direkte." },
        { type: "pseudocode", title: "Bucket-Sort(A, n)", lines: [
          "new: B[0 : n − 1]",
          "for i = 0 to n − 1",
          "    make B[i] an empty list",
          "for i = 1 to n",
          "    add A[i] to B[⌊n · A[i]⌋]",
          "for i = 0 to n − 1",
          "    sort list B[i]",
          "concatenate B[0], B[1], …, B[n − 1]",
          "return the resulting list",
        ], caption: "Bøtte $b$ dekker $[b/n, (b+1)/n)$, så alt i $B[1]$ er mindre enn alt i $B[2]$. Bare innholdet i hver bøtte må sorteres, med Insertion-Sort. Lenkede lister bør sette inn foran (eller ha halepeker) for $O(1)$ innsetting." },
        { type: "figure", component: BucketSortFigure, caption: "Lysarkenes eksempel med $n = 10$: $0{,}72$ går i bøtte $\\lfloor 10 \\cdot 0{,}72 \\rfloor = \\lfloor 7{,}2 \\rfloor = 7$. Ingen bøtte får mer enn tre tall." },
        { type: "formula", latex: "T(n) = \\Theta(n) + \\sum_{i=0}^{n-1} O(n_i^2), \\qquad E[n_i^2] = 2 - \\tfrac{1}{n} \\;\\Longrightarrow\\; E[T(n)] = \\Theta(n)", name: "Bucket-Sort: gjennomsnittlig kjøretid", caption: "$n_i$ er antall tall i bøtte $i$, og Insertion-Sort på bøtta koster $O(n_i^2)$. $E[\\cdot]$ er forventningsverdi over tilfeldig input (CLRS 8.4)." },
        { type: "table", head: ["Tilfelle", "Kjøretid", "Når"], rows: [
          ["Gjennomsnitt, $T_a$", "$\\Theta(n)$", "uniform input: forventet $O(1)$ per bøtte"],
          ["Verste, $T_w$", "$\\Theta(n^2)$", "alle i samme bøtte, så Insertion-Sort på $n$ tall"],
          ["Beste, $T_b$", "$\\Theta(n)$", "ett tall per bøtte"],
        ], caption: "Med Merge-Sort i bøttene blir verste tilfelle $O(n \\lg n)$, og snittet er fortsatt $\\Theta(n)$." },
        { type: "box", variant: "pitfall", title: "Antall bøtter må vokse med n (øving 4, spm. 9)", blocks: [
          { type: "text", text: "Med et **fast** antall bøtter, for eksempel 512, får hver bøtte i snitt $n/512 = \\Theta(n)$ tall. Insertion-Sort på dem gir $O(n^2)$ i snitt. Konstanten 512 hjelper ikke asymptotisk. Ligger alle tallene i $[0{,}50; 0{,}51)$, er antagelsen brutt, og vi får også $\\Theta(n^2)$." },
        ] },
      ],
    },
    {
      id: "oving",
      title: "Øv på øvings- og eksamensoppgaver",
      blocks: [
        { type: "table", head: ["Algoritme", "Antagelse", "Kjøretid", "Stabil"], rows: [
          ["Sammenligningssortering", "bare $x \\le y$", "$\\Omega(n \\lg n)$ verste", "varierer"],
          ["Randomized-Select", "finner bare rang $i$", "$\\Theta(n)$ forventet, $\\Theta(n^2)$ verste", "–"],
          ["Select", "finner bare rang $i$", "$\\Theta(n)$ verste", "–"],
          ["Counting-Sort", "heltall i $0..k$", "$\\Theta(n + k)$", "ja"],
          ["Radix-Sort", "$d$ siffer i $0..k$", "$\\Theta(d(n + k))$", "ja, med stabil subrutine"],
          ["Bucket-Sort", "uniform i $[0, 1)$", "$\\Theta(n)$ snitt, $\\Theta(n^2)$ verste", "ja, med stabil subrutine"],
        ], caption: "Hele forelesningen på én tabell." },
        { type: "example", title: "Velg sorteringsalgoritme (øving 4, spm. 13–15)", blocks: [
          { type: "list", items: [
            "**100 000 terningkast:** Counting-Sort med $k = 6$. Radix-Sort har bare ett siffer og gir ingenting ekstra, og Bucket-Sort gjør mer arbeid med $n$ bøtter.",
            "**Sortert, bortsett fra at to elementer har byttet plass:** Insertion-Sort. Vi vet ingenting om verdiene, men tabellen har bare $O(n)$ inversjoner (par i feil rekkefølge), så det blir $O(n)$.",
            "**1 000 000 brukernavn med 5–8 bokstaver:** Radix-Sort med Counting-Sort ($d = 8$, $k = 26$). Counting-Sort direkte trenger over $26^8 \\approx 2 \\cdot 10^{11}$ plasser, og navnene er neppe uniformt fordelt.",
          ] },
        ] },
        { type: "example", title: "De $k$ største poengsummene (øving 4, spm. 17)", blocks: [
          { type: "text", text: "Bruk Randomized-Select med rang $n - k + 1$ (0-indeksert: $n - k$). Etter siste Partition er alt til høyre for pivoten større, så svaret er pivoten og alt til høyre. Ingen sortering trengs, og forventet tid er $O(n)$ for unike verdier." },
        ] },
        { type: "example", title: "Strenger med ulik lengde (øving 4, spm. 19)", blocks: [
          { type: "text", text: "Lineær tid i **total** lengde krever at vi ikke fyller ut korte strenger (det gir $\\Theta(nd)$). Del strengene etter lengde, sorter de lengste på siste tegn først, og legg til kortere strenger **foran** etter hvert som vi kommer til deres siste tegn. Hvert pass fordeler i 26 bøtter, stabilt." },
        ] },
        { type: "example", title: "Hvorfor finnes ingen $O(1)$-prioritetskø? (øving 4, spm. 22)", blocks: [
          { type: "text", text: "Med $O(1)$ innsetting og $O(1)$ «ta ut største» kunne vi sette inn alle $n$ elementene og ta dem ut i rekkefølge i $O(n)$. Det ville vært sammenligningsbasert sortering i $O(n)$, som sorteringsgrensen forbyr. Dette er en reduksjon fra sortering. En haug (forelesning 5) gir $O(\\lg n)$." },
        ] },
        { type: "quiz", items: [
          { question: "Hvor mange blader har et beslutningstre for 4 elementer minst, og hva er minste høyde?", answer: "$4! = 24$ blader. $2^h \\ge 24$ gir $h \\ge \\lceil \\lg 24 \\rceil = 5$." },
          { question: "Kan en sammenligningsbasert sortering ha $\\Theta(n)$ i beste tilfelle? Og $\\Theta(n^3)$ i verste?", answer: "**Ja og ja.** Beste tilfelle kan være $\\Theta(n)$ (Insertion-Sort), og verste tilfelle må bare være $\\Omega(n \\lg n)$, så $\\Theta(n^3)$ er lov. Men verste tilfelle kan **ikke** være $\\Theta(n)$ (øving 4, spm. 6)." },
          { question: "Kjør Counting-Sort på $\\langle 1, 0, 3, 1, 3 \\rangle$ med $k = 3$. Hva er $C$ etter den kumulative løkka?", answer: "Tellinger $C = [1, 2, 0, 2]$, kumulativ $C = [1, 3, 3, 5]$. Resultat $\\langle 0, 1, 1, 3, 3 \\rangle$." },
          { question: "Hvorfor går siste løkke i Counting-Sort fra $n$ ned til 1?", answer: "For å gjøre den **stabil**. Kjøretiden og at resultatet blir sortert, er det samme begge veier (øving 4, spm. 10)." },
          { question: "Virker Radix-Sort med Quicksort som subrutine?", answer: "**Nei.** Quicksort er ikke stabil, så like sifre kan bytte plass og ødelegge rekkefølgen fra tidligere pass." },
          { question: "Randomized-Select har $p = 3$ og får $q = 7$ fra Partition. Vi leter etter $i = 6$. Hva skjer?", answer: "$k = 7 - 3 + 1 = 5 < 6$, så vi går til høyre: Randomized-Select$(A, 8, r, 1)$." },
          { question: "Hvorfor bruker Select grupper på 5 og ikke 3?", answer: "Med 5 blir rekurrensen $T(n/5) + T(7n/10) + O(n)$, og $\\tfrac15 + \\tfrac{7}{10} < 1$ gir $O(n)$. Med 3 blir det $T(n/3) + T(2n/3) + O(n)$, som summerer til $n$ per nivå: $\\Theta(n \\lg n)$." },
          { question: "Er Bucket-Sort $\\Theta(n)$ i forventning for enhver input?", answer: "**Nei.** Den er $\\Theta(n)$ i **gjennomsnitt** når input er uniformt fordelt. For en dårlig input (alt i én bøtte) er den $\\Theta(n^2)$. Det er Randomized-Select som er $\\Theta(n)$ forventet for enhver input." },
          { question: "Finn de 100 minste av $10^6$ tall. Sortere alt eller Select + Partition?", answer: "**Select + Partition:** $O(n)$ i verste tilfelle, mot $\\Theta(n \\lg n)$ for å sortere alt." },
        ] },
      ],
    },
  ],
};
