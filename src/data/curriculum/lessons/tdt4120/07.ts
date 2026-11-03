import type { Lesson } from "../types";
import { ActivityFigure, ExchangeFigure, GaleShapleyFigure, GreedyVsDpFigure, HuffmanStepsFigure, HuffmanTreeFigure, KnapsackGreedyFigure, WellsFigure } from "./figures07";

const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view`, kind: "drive" as const });

// Based on the pensum booklet (lecture 7, goals G1–G4), the lecture slides (which also cover Gale-Shapley),
// CLRS chapter 15 (introduction and 15.1–15.3) and 25.2, exercise 7 with its solution, the exams from December 2023,
// December 2024, August 2025 and August 2026 (with solutions), and the existing lecture 7 note.
export const lesson: Lesson = {
  subjectId: "tdt4120",
  unitId: "07",
  reviewed: "2026-11-03",
  summary: "En **grådig algoritme** bygger løsningen gjennom en serie **bindende valg**, og hvert valg tas lokalt: den gjør det som ser best ut her og nå, uten å angre. Der dynamisk programmering løser alle delinstansene **før** den velger, velger grådighet **først** og løser bare den ene delinstansen som står igjen. Algoritmene er ofte enkle. Det vanskelige er å vise at de gir rett svar. Det krever **grådighetsegenskapen** (det finnes en optimal løsning som starter med det grådige valget) og **optimal delstruktur** (resten må løses optimalt). Pensumeksemplene er det kontinuerlige ryggsekkproblemet, aktivitetsutvelgelse og Huffman-koder. Lysarkene tar også med Gale–Shapley for stabil matching.",
  overview: [
    "**Designmetoden (G1, !):** gjør et grådig valg $c$, krymp instansen til **én** delinstans $y$, løs $y$ (grådig, rekursivt) og kombiner. Ingen tabell, ingen angring. Grunntilfellet må også håndteres.",
    "**Grådighetsegenskapen (G2, !):** det finnes en optimal løsning der **første** valg er det grådige. Den sier bare at det første valget er trygt, ikke at vi kan fortsette grådig. Det følger først når vi også har **optimal delstruktur** (ukens snubletråd).",
    "**Slik bevises korrekthet:** vis grådighetsegenskapen med et **utvekslingsargument** (bytt et valg i en vilkårlig optimal løsning med det grådige uten å tape) eller **«greedy stays ahead»**. Vis optimal delstruktur med klipp og lim. Sett sammen med **induksjon**.",
    "**Kontinuerlig ryggsekk (G3):** sorter etter **kilopris** $v_i / w_i$ og ta mest mulig av det dyreste først. Bare én gjenstand deles. $\\Theta(n \\lg n)$. Samme strategi feiler for den **binære** ryggsekken (den løses med DP, forelesning 6).",
    "**Aktivitetsutvelgelse (G3):** velg alltid den kompatible aktiviteten som **slutter først**. Greedy-Activity-Selector tar $\\Theta(n)$ når aktivitetene er sortert etter sluttid, ellers $\\Theta(n \\lg n)$. Med vekter på aktivitetene virker det ikke lenger.",
    "**Huffman (G4):** prefiksfri kode med variabel lengde. Slå alltid sammen de **to minst hyppige** deltrærne. $n - 1$ sammenslåinger med en min-prioritetskø: $O(n \\lg n)$. Kostnaden $B(T) = \\sum_c c.\\mathit{freq} \\cdot d_T(c)$ er lik summen av de interne nodene.",
    "**Huffman er optimal:** de to sjeldneste kan alltid ligge som søsken nederst (lemma 15.2, utveksling), og å slå dem sammen til ett tegn gir et mindre problem av samme type (lemma 15.3, optimal delstruktur).",
    "**Gale–Shapley (lysarkene, CLRS 25.2):** hver ledig kvinne frir til neste mann på listen sin, og en mann bytter bare hvis han får en han liker bedre. Maks $n^2$ frierier, og resultatet er alltid en **stabil** matching, uten blokkerende par.",
    "**Når virker det ikke?** Myntveksling med myntene 1, 15, 30, 45, 50, 60 og 100, binær ryggsekk og vektet aktivitetsutvelgelse er klassiske moteksempler. Ett moteksempel er nok til å vise at en grådig algoritme er feil.",
  ],
  keyFormulas: [
    { latex: "\\frac{v_1}{w_1} \\ge \\frac{v_2}{w_2} \\ge \\dots \\ge \\frac{v_n}{w_n}", label: "Kontinuerlig ryggsekk: ta gjenstandene i denne rekkefølgen" },
    { latex: "a_m \\in S_k \\text{ med minst } f_m \\text{ er med i en optimal løsning for } S_k", label: "Aktivitetsutvelgelse: det grådige valget (CLRS teorem 15.1)" },
    { latex: "B(T) = \\sum_{c \\in C} c.\\mathit{freq} \\cdot d_T(c)", label: "Kostnaden til et kodetre (antall bit)" },
    { latex: "B(T) = B(T') + x.\\mathit{freq} + y.\\mathit{freq}", label: "Huffman: optimal delstruktur (lemma 15.3)" },
    { latex: "\\Theta(n \\lg n), \\qquad \\Theta(n) \\text{ sortert}, \\qquad O(n \\lg n), \\qquad O(n^2)", label: "Ryggsekk, aktivitetsutvelgelse, Huffman og Gale–Shapley" },
  ],
  goals: [
    "Forstå designmetoden grådighet **(G1, !)**",
    "Forstå grådighetsegenskapen (the greedy-choice property) **(G2, !)**",
    "Forstå eksemplene aktivitetsutvelgelse og det kontinuerlige ryggsekkproblemet **(G3)**",
    "Forstå Huffman og Huffman-koder **(G4)**",
  ],
  concepts: [
    "greedy-algorithm", "greedy-choice-property", "optimal-substructure", "optimal-delstruktur", "exchange-argument", "greedy-stays-ahead",
    "continuous-knapsack-problem", "0-1-ryggsekkproblem", "activity-selection-problem", "recursive-activity-selector", "iterative-activity-selector",
    "huffman-coding", "huffman-tree", "prefix-free-code", "priority-queue", "matching",
  ],
  notes: [{ slug: "forelesning-7-gradighet", label: "Forelesning 7 - Grådighet" }],
  sources: [
    drive("Pensumhefte 2026, forelesning 7", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
    drive("Forelesning 7 (lysark)", "1NIn0N5WVlmqRmDfPIDQCbc3AymqnMwwX"),
    drive("Øving 7: Grådighet", "1Kj6HfGppIc8jDov59sqYympJKU-yc9Cq"),
    drive("Løsningsforslag øving 7", "1ft9Ne2MkfQoovEbv6YEuVlJYEarsvaDa"),
    drive("Eksamen august 2026 med løsningsforslag", "1MhSk2qelJNYMKZjaj2O7mqzzYtryB9vr"),
    drive("Eksamen august 2025 med løsningsforslag", "1B5E6tItKtjigNSfNEwm9GIBC3pdbWlDC"),
    drive("Eksamen desember 2024 med løsningsforslag", "1Ffv3IAteloAL1jjcu0k2MQKfJ9nVtgrb"),
    drive("Eksamen desember 2023 med løsningsforslag", "1R6BvBaHHIm2BfMmp1XHh-Xg8QQpdM0cN"),
    { label: "Forelesning 7 - Grådighet", url: "forelesning-7-gradighet", kind: "note" },
  ],
  sections: [
    {
      id: "ide",
      title: "Designmetoden: velg først, løs etterpå",
      blocks: [
        { type: "text", text: "Alle designmetodene så langt bryter instansen ned i delinstanser. **Splitt og hersk** løser uavhengige delinstanser. **Dynamisk programmering** løser alle delinstansene (som kan overlappe) og bygger løsningen på den **beste** av dem. **Grådighet** snur rekkefølgen: før vi løser noe, spør vi hvilken delinstans som er **mest lovende**, og løser bare den. Valget er bindende, og vi ser aldri tilbake." },
        { type: "figure", component: GreedyVsDpFigure, caption: "Lysarkene: DP regner ut alle alternativene og velger etterpå. Grådighet velger med én gang, ut fra et lokalt kriterium (dyrest per kilo, slutter først, minst frekvens), og står igjen med én delinstans. Lysarkene viser også et annet perspektiv som er helt ekvivalent: se på «veien videre» i stedet for «veien hit» og bygg bare videre i den mest lovende retningen." },
        { type: "pseudocode", title: "Greedy(x)", lines: [
          "make a greedy choice c",
          "y = what remains of x",
          "s = Greedy(y)",
          "return c and s combined",
        ], caption: "Lysarkenes generelle mal (G1). Linje 1: det beste lovlige valget, helt lokalt. Linje 2: valget krymper instansen til **én** delinstans. Linje 3: at resten også kan løses grådig, følger av de to egenskapene i neste avsnitt. Grunntilfellet (ingenting igjen å velge) må naturligvis også håndteres. I praksis skrives algoritmen som regel som en løkke etter en sortering eller med en prioritetskø." },
        { type: "table", head: ["", "Splitt og hersk", "Dynamisk programmering", "Grådighet"], rows: [
          ["Delinstanser", "uavhengige", "overlappende", "bare **én** står igjen etter valget"],
          ["Når tas valget?", "ingen valg", "**etter** at delinstansene er løst", "**før** noe er løst"],
          ["Lagring", "ingen", "tabell eller memoisering", "ingen"],
          ["Krav for korrekthet", "riktig kombinering", "optimal delstruktur (og overlapp for å lønne seg)", "optimal delstruktur **og** grådighetsegenskapen"],
          ["Eksempler", "Merge-Sort, Quicksort", "stavkapping, LCS, binær ryggsekk", "kontinuerlig ryggsekk, aktiviteter, Huffman"],
        ], caption: "Lysarkene: DP vil fortsatt fungere når grådighet fungerer, akkurat som for splitt og hersk. Grådighet er bare mye raskere og enklere, fordi vi slipper å løse de andre delinstansene." },
      ],
    },
    {
      id: "korrekthet",
      title: "Grådighetsegenskapen og korrekthetsbevis",
      blocks: [
        { type: "box", variant: "definition", title: "Grådighetsegenskapen (G2, !)", blocks: [
          { type: "text", text: "Et problem har **grådighetsegenskapen** (the greedy-choice property) hvis det finnes en **optimal løsning der første valg er grådig**. Vi kan altså velge det som ser best ut her og nå uten å skyte oss selv i foten: et optimum er fortsatt innen rekkevidde (øving 7, spm. 3)." },
        ] },
        { type: "box", variant: "definition", title: "Optimal delstruktur, nå for grådighet", blocks: [
          { type: "text", text: "Etter det grådige valget står én delinstans igjen. **Optimal delstruktur** betyr at det grådige valget kombinert med en **optimal** løsning på denne delinstansen gir en optimal løsning på hele instansen. Da kan vi fortsette på samme måte." },
        ] },
        { type: "formula", latex: "\\text{grådig valg} \\;+\\; \\text{optimal delløsning} \\;\\Longrightarrow\\; \\text{optimal løsning}", name: "Grådig valg pluss optimal delløsning", caption: "Lysarkene. Begge egenskapene trengs (øving 7, spm. 2). Problemet trenger **ikke** ha én unik optimal løsning, og det trenger **ikke** ha overlappende delinstanser: hver delinstans løses bare én gang." },
        { type: "box", variant: "pitfall", title: "Ukens snubletråd: hva sier grådighetsegenskapen egentlig?", blocks: [
          { type: "text", text: "Det er lett å tro at grådighetsegenskapen betyr at vi trygt kan ta grådige valg hele veien og ende med et optimum. Det er **konklusjonen** vi får når vi **også** har optimal delstruktur. Grådighetsegenskapen sier bare at vi kan ta **ett** grådig valg og fortsatt ha mulighet til å nå en optimal løsning, om vi gjør resten riktig. Boka er litt misvisende her (s. 426), men lemma 15.2 og oppskriften i CLRS 15.2 formulerer det riktig. Derfor er «at vi kan sette sammen en globalt optimal løsning ved å gjøre lokalt optimale valg» **feil** svar i øving 7, spm. 3." },
        ] },
        { type: "list", ordered: true, items: [
          "**Formuler problemet** som et optimeringsproblem der vi tar ett valg, og der bare én delinstans står igjen.",
          "**Vis grådighetsegenskapen:** det finnes alltid en optimal løsning som tar det grådige valget.",
          "**Vis optimal delstruktur:** det grådige valget pluss en optimal løsning på delinstansen gir en optimal løsning.",
        ] },
        { type: "text", text: "Dette er oppskriften i lysarkene og CLRS 15.2. At vi kan **fortsette** å velge grådig, viser vi så med **induksjon** på antall valg: delinstansen har de samme egenskapene, så den kan også løses grådig. Selve egenskapene viser vi gjerne med bevis ved selvmotsigelse eller med en av teknikkene under. Mangler grådighetsegenskapen, kan et grådig valg ødelegge alt håp om optimum. Mangler optimal delstruktur, må vi kanskje løse resten på en helt annen måte." },
        { type: "table", head: ["Teknikk", "Idé", "Typisk bruk"], rows: [
          ["**Utvekslingsargument** (exchange argument)", "Start med en vilkårlig optimal løsning. Bytt gradvis ut valg med grådige valg, uten å gjøre løsningen dårligere. Da er den grådige løsningen også optimal.", "ryggsekk, aktiviteter (teorem 15.1), Huffman (lemma 15.2)"],
          ["**Greedy stays ahead**", "Bygg den grådige og en vilkårlig løsning samtidig. Vis med induksjon at den grådige etter hvert steg ligger minst like godt an. Den andre kan aldri ta igjen forspranget.", "aktiviteter (sluttidene), brønner og antenner"],
          ["**Klipp og lim**", "Anta at delløsningen i et optimum ikke er optimal. Bytt den ut med en bedre, og totalen blir bedre: selvmotsigelse.", "optimal delstruktur, som i forelesning 6"],
          ["**Moteksempel**", "Én instans der algoritmen gir feil svar.", "for å vise at en grådig idé **ikke** virker"],
        ], caption: "Lysarkene viser utvekslingsargumentet og greedy stays ahead med «Vilkårlig ≤ … ≤ Grådig» og «den ikke-grådige tar aldri igjen den grådige»." },
        { type: "example", title: "Myntveksling: når virker grådig? (øving 7, spm. 17 og 18)", blocks: [
          { type: "text", text: "Betal et beløp med færrest mulig mynter ved alltid å ta den største mynten som ikke er for stor." },
          { type: "list", items: [
            "**Myntene 1, 2, 5, 10, 20, 50 og 100: ja.** En optimal løsning har aldri to 50-ere (bytt mot 100), tre 20-ere (bytt mot 50 + 10), to 10-ere (bytt mot 20), eller 20 + 20 + 10 (bytt mot 50), og tilsvarende for 1, 2 og 5. Da kan de mindre myntene i et optimum aldri summere til en større mynt, så et optimum må inneholde den største mynten som passer. Det er grådighetsegenskapen, vist med et utvekslingsargument.",
            "**Myntene 1, 15, 30, 45, 50, 60 og 100: nei.** Moteksempel: 95. Grådig gir $60 + 30 + 1 + 1 + 1 + 1 + 1$, altså 7 mynter. Optimalt er $50 + 45$, altså 2 mynter. Generell myntveksling løses med DP (CLRS oppgave 15-1).",
          ] },
        ] },
      ],
    },
    {
      id: "ryggsekk",
      title: "Det kontinuerlige ryggsekkproblemet",
      blocks: [
        { type: "box", variant: "definition", title: "Problemet (G3)", blocks: [
          { type: "text", text: "**Input:** verdier $v_1, \\dots, v_n$, vekter $w_1, \\dots, w_n$ og en kapasitet $W$. **Output:** indekser $i_1, \\dots, i_k$ og en fraksjon $0 \\le \\ell \\le 1$ slik at $w_{i_1} + \\dots + w_{i_{k-1}} + \\ell \\cdot w_{i_k} \\le W$ og totalverdien $v_{i_1} + \\dots + v_{i_{k-1}} + \\ell \\cdot v_{i_k}$ er størst mulig. Lysarkenes definisjon har allerede et innebygd hint om løsningen: bare **én** gjenstand blir delt." },
        ] },
        { type: "text", text: "**Drinkproblemet** fra lysarkene gjør det intuitivt. Vi skal fylle et glass med en så dyr drink som mulig, og flaskene har ulik literpris. Har vi nok av den dyreste, fyller vi hele glasset med den. Har vi ikke det, tømmer vi den dyreste flasken og tenker på resten av glasset som et nytt, mindre glass, som igjen bør fylles med det dyreste som er igjen." },
        { type: "formula", latex: "\\frac{v_1}{w_1} \\ge \\frac{v_2}{w_2} \\ge \\dots \\ge \\frac{v_n}{w_n}", name: "Grådig rekkefølge for kontinuerlig ryggsekk", caption: "Sorter etter **kilopris** (verdi per vektenhet), og ta så mye som mulig av hver, i denne rekkefølgen, til sekken er full. Bare den siste gjenstanden blir delt." },
        { type: "pseudocode", title: "Fractional-Knapsack(v, w, n, W)", lines: [
          "sort the items so that v[1]/w[1] ≥ … ≥ v[n]/w[n]",
          "value = 0",
          "i = 1",
          "while W > 0 and i ≤ n",
          "    x = min(w[i], W)",
          "    value = value + x · v[i]/w[i]",
          "    W = W − x",
          "    i = i + 1",
          "return value",
        ], caption: "Vår skrivemåte, siden CLRS bare beskriver algoritmen med ord. Linje 5: $x$ er hvor mange kilo vi tar av gjenstand $i$, og bare i siste runde er $x < w[i]$. Sorteringen tar $\\Theta(n \\lg n)$ og løkka $O(n)$. Det går også i $O(n)$ med en variant av Select, men det er ikke pensum." },
        { type: "box", variant: "theorem", title: "Hvorfor er det optimalt?", blocks: [
          { type: "list", items: [
            "**Grådighetsegenskapen:** det finnes en optimal løsning som tar med **mest mulig** av gjenstanden med høyest kilopris. Utvekslingsargument: tar en løsning mindre enn mulig av den, finnes det ledig plass eller noe billigere i sekken. Bytt ut litt av det billigere med like mange kilo av det dyreste. Vekten er den samme, og verdien øker (eller er lik ved lik kilopris).",
            "**Optimal delstruktur:** når vi har tatt med det dyreste, må resten av sekken (kapasitet $W - x$, med de gjenværende gjenstandene) fortsatt fylles optimalt. Ellers kunne vi forbedret totalen ved å fylle resten bedre.",
          ] },
        ] },
        { type: "figure", component: KnapsackGreedyFigure, caption: "Eksemplet i CLRS 15.2. Kontinuerlig gir grådighet 240. Binært, der vi bare kan ta hele gjenstander, gir det samme grådige valget 160, mens optimum er 220. Problemet er at «ta det dyreste per kilo» kan etterlate tom plass, og tom plass har ingen verdi. Den binære ryggsekken mangler grådighetsegenskapen og løses med DP i $\\Theta(nW)$ (forelesning 6)." },
        { type: "example", title: "Kontinuerlig ryggsekk for hånd (eksamen august 2026, oppgave 9)", blocks: [
          { type: "text", text: "$v = \\langle 32, 30, 45 \\rangle$, $w = \\langle 8, 12, 15 \\rangle$ og $W = 20$. Hva er optimal totalverdi?" },
          { type: "list", items: [
            "**Kilopriser:** $32/8 = 4$, $30/12 = 2{,}5$ og $45/15 = 3$. Rekkefølgen blir gjenstand 1, 3, 2.",
            "**Gjenstand 1:** hele, 8 kg, verdi 32. Igjen: $20 - 8 = 12$ kg.",
            "**Gjenstand 3:** 12 av 15 kg, verdi $12 \\cdot 3 = 36$. Igjen: 0 kg, så gjenstand 2 er ikke med.",
            "**Svar:** $32 + 36 = 68$.",
          ] },
        ] },
      ],
    },
    {
      id: "aktivitetsutvelgelse",
      title: "Aktivitetsutvelgelse",
      blocks: [
        { type: "box", variant: "definition", title: "Problemet (G3)", blocks: [
          { type: "text", text: "**Input:** aktiviteter $a_1, \\dots, a_n$ med halvåpne intervaller $[s_i, f_i)$, der $s_i$ er starttid og $f_i$ er sluttid. To aktiviteter er **kompatible** hvis intervallene ikke overlapper, altså $s_i \\ge f_j$ eller $s_j \\ge f_i$. **Output:** en størst mulig mengde parvis kompatible aktiviteter. Vi antar at aktivitetene er sortert etter **sluttid**: $f_1 \\le f_2 \\le \\dots \\le f_n$." },
        ] },
        { type: "text", text: "**Først som DP (CLRS 15.1):** la $S_{ij}$ være aktivitetene som starter etter at $a_i$ slutter og slutter før $a_j$ starter. Velger vi en aktivitet $a_k$ i $S_{ij}$, står vi igjen med to delinstanser, $S_{ik}$ og $S_{kj}$. Vi løser begge og legger til 1. Det er riktig, men vi må prøve alle $a_k$:" },
        { type: "formula", latex: "c[i, j] = \\begin{cases} 0 & \\text{hvis } S_{ij} = \\emptyset \\\\ \\max_{a_k \\in S_{ij}} \\bigl( c[i, k] + c[k, j] + 1 \\bigr) & \\text{ellers} \\end{cases}", name: "DP-rekurrens for aktivitetsutvelgelse", caption: "$c[i, j]$ er størrelsen på en største kompatible delmengde av $S_{ij}$. Lysarkene: «Men vi trenger ikke alle delproblemene. Ta alltid med intervallet som slutter først!» Da er den ene delinstansen tom, og bare én står igjen." },
        { type: "box", variant: "theorem", title: "Det grådige valget er trygt (CLRS teorem 15.1)", blocks: [
          { type: "text", text: "La $S_k$ være aktivitetene som starter etter at $a_k$ slutter, og la $a_m$ være aktiviteten i $S_k$ som **slutter først**. Da er $a_m$ med i en største delmengde av parvis kompatible aktiviteter i $S_k$." },
          { type: "text", text: "**Bevis (utvekslingsargument):** la $A_k$ være en optimal løsning for $S_k$, og la $a_j$ være aktiviteten i $A_k$ som slutter først. Er $a_j = a_m$, er vi ferdige. Ellers lager vi $A'_k = A_k - \\{a_j\\} \\cup \\{a_m\\}$. Alle de andre aktivitetene i $A_k$ starter etter $f_j$, og $f_m \\le f_j$, så de er kompatible med $a_m$. $|A'_k| = |A_k|$, så $A'_k$ er også optimal, og den inneholder $a_m$." },
        ] },
        { type: "figure", component: ExchangeFigure, caption: "Utvekslingen i beviset. Aktiviteten som slutter først, gir mest mulig tid igjen til resten, så den kan aldri være et dårligere førstevalg enn noen annen. **Optimal delstruktur:** etter $a_m$ står bare $S_m$ igjen, og resten av en optimal løsning må være optimal for $S_m$." },
        { type: "pseudocode", title: "Recursive-Activity-Selector(s, f, k, n)", lines: [
          "m = k + 1",
          "while m ≤ n and s[m] < f[k]",
          "    m = m + 1",
          "if m ≤ n",
          "    return {aₘ} ∪ Recursive-Activity-Selector(s, f, m, n)",
          "else return ∅",
        ], caption: "Kalles med Recursive-Activity-Selector($s$, $f$, 0, $n$), med en fiktiv aktivitet $a_0$ med $f_0 = 0$. Linje 2–3 hopper over aktiviteter som overlapper den sist valgte, $a_k$. Den første som ikke gjør det, er den i $S_k$ som slutter først. Hver aktivitet undersøkes én gang totalt: $\\Theta(n)$." },
        { type: "pseudocode", title: "Greedy-Activity-Selector(s, f, n)", lines: [
          "A = {a₁}",
          "k = 1",
          "for m = 2 to n",
          "    if s[m] ≥ f[k]",
          "        A = A ∪ {aₘ}",
          "        k = m",
          "return A",
        ], caption: "Den iterative versjonen. $k$ er indeksen til sist valgte aktivitet, og $f_k$ er alltid den største sluttiden i $A$. Én gjennomgang: $\\Theta(n)$, pluss $\\Theta(n \\lg n)$ hvis aktivitetene ikke allerede er sortert etter sluttid." },
        { type: "figure", component: ActivityFigure, caption: "Eksemplet i CLRS 15.1, regnet ut med Greedy-Activity-Selector. Grønne aktiviteter velges. Hver av de andre forkastes fordi den starter før sluttiden til den sist valgte." },
        { type: "box", variant: "tip", title: "Alternativt bevis: greedy stays ahead", blocks: [
          { type: "text", text: "La den grådige løsningen ha sluttider $g_1 < g_2 < \\dots < g_k$ og en vilkårlig løsning $o_1 < o_2 < \\dots < o_\\ell$. **Påstand:** $g_i \\le o_i$ for alle $i \\le k$. For $i = 1$ er det slik fordi grådig tar den som slutter først. Hvis $g_{i-1} \\le o_{i-1}$, starter aktivitet nummer $i$ i den andre løsningen etter $o_{i-1} \\ge g_{i-1}$, så den var lovlig for grådig også, og grådig valgte en som slutter minst like tidlig. Hadde den andre løsningen hatt $\\ell > k$, kunne grådig tatt med aktivitet $k + 1$: selvmotsigelse. Altså er $k \\ge \\ell$." },
        ] },
        { type: "table", head: ["Grådig kriterium", "Optimal?", "Moteksempel"], rows: [
          ["Slutter først", "**ja**", "–"],
          ["Starter sist (speilvendt)", "**ja**", "samme argument med tidsaksen snudd"],
          ["Kortest varighet", "nei", "$[1, 10)$, $[9, 12)$, $[11, 20)$: grådig tar bare den korte"],
          ["Starter først", "nei", "$[0, 100)$, $[1, 2)$, $[3, 4)$: grådig tar bare den lange"],
          ["Færrest overlapp", "nei", "finnes, men er større (CLRS øvelse 15.1-3)"],
          ["Høyest verdi, eller slutter først med vekter", "nei", "$[1, 4)$ med verdi 3 og $[2, 5)$ med verdi 5 (øving 7, spm. 7)"],
        ], caption: "Det er ikke nok at et kriterium virker rimelig. Vektet aktivitetsutvelgelse (maksimer summen av verdiene) løses med DP i stedet, sortert etter sluttid, med «ta med $a_i$ eller ikke» (CLRS øvelse 15.1-5)." },
        { type: "example", title: "Utfør Recursive-Activity-Selector (øving 7, spm. 5 og 6)", blocks: [
          { type: "text", text: "Aktivitetene $(s_i, f_i)$ er 1: (2, 3), 2: (2, 4), 3: (5, 8), 4: (10, 12), 5: (8, 16), 6: (1, 5), 7: (4, 7) og 8: (5, 11)." },
          { type: "list", items: [
            "**Sorter etter sluttid:** $\\langle 1, 2, 6, 7, 3, 8, 4, 5 \\rangle$ med sluttider 3, 4, 5, 7, 8, 11, 12, 16.",
            "**Første valg:** aktivitet 1 (slutter ved 3).",
            "**Andre valg:** første med $s \\ge 3$ i rekkefølgen. 2 ($s = 2$) og 6 ($s = 1$) hoppes over, så aktivitet **7** velges (slutter ved 7).",
            "**Tredje valg:** første med $s \\ge 7$. 3 og 8 ($s = 5$) hoppes over, så aktivitet 4 velges (slutter ved 12). Aktivitet 5 starter ved 8 og hoppes over.",
            "**Svar:** nummer to er aktivitet 7, og maksimalt antall er **3**.",
          ] },
        ] },
      ],
    },
    {
      id: "huffman",
      title: "Huffman-koder",
      blocks: [
        { type: "box", variant: "definition", title: "Prefiksfrie koder (G4)", blocks: [
          { type: "text", text: "Vi skal kode en tekst over et alfabet $C$ binært, der tegnet $c$ forekommer $c.\\mathit{freq}$ ganger. Med **fast lengde** bruker hvert tegn $\\lceil \\lg |C| \\rceil$ bit. Med **variabel lengde** kan hyppige tegn få korte koder. For at dekodingen skal være entydig, bruker vi en **prefiksfri kode** (prefix-free code): ingen kode er et prefiks av en annen. Da vet vi alltid hvor ett tegn slutter og det neste begynner." },
        ] },
        { type: "text", text: "En prefiksfri kode er det samme som et binærtre med tegnene i **løvnodene**: 0 betyr venstre og 1 betyr høyre, og koden til $c$ er stien fra rota. Kodelengden er dybden $d_T(c)$. En optimal kode er alltid et **fullt** binærtre, der hver intern node har to barn (ellers kunne vi forkortet kodene under noden med ett barn). Med $|C|$ løvnoder har treet da $|C| - 1$ interne noder." },
        { type: "formula", latex: "B(T) = \\sum_{c \\in C} c.\\mathit{freq} \\cdot d_T(c)", name: "Kostnaden til et kodetre", caption: "Antall bit som trengs for å kode hele teksten med treet $T$. Nyttig regnetriks: $B(T)$ er lik **summen av frekvensene i de interne nodene**, fordi hver intern node legger én bit til alle tegnene under seg." },
        { type: "pseudocode", title: "Decode(T, C, n)", lines: [
          "x = T.root",
          "for i = 1 to n",
          "    if C[i] == 0",
          "        x = x.left",
          "    else x = x.right",
          "    if x is a leaf",
          "        print x.key",
          "        x = T.root",
        ], caption: "Dekoding av en bitstreng $C[1 : n]$ (lysarkene): følg bitene nedover fra rota, og når vi treffer en løvnode, skriv ut tegnet og start på nytt. $\\Theta(n)$. Det virker bare fordi koden er prefiksfri." },
        { type: "pseudocode", title: "Huffman(C)", lines: [
          "n = |C|",
          "Q = C",
          "for i = 1 to n − 1",
          "    allocate a new node z",
          "    x = Extract-Min(Q)",
          "    y = Extract-Min(Q)",
          "    z.left = x",
          "    z.right = y",
          "    z.freq = x.freq + y.freq",
          "    Insert(Q, z)",
          "return Extract-Min(Q)",
        ], caption: "$Q$ er en min-prioritetskø med frekvens som nøkkel. Det grådige valget: slå sammen de **to minst hyppige** deltrærne, fordi alle tegnene i dem får én bit til. Etter $n - 1$ sammenslåinger er bare rota igjen. Med en binær min-haug: Build-Min-Heap i $O(n)$ og $n - 1$ runder med $O(\\lg n)$ hver, altså $O(n \\lg n)$." },
        { type: "figure", component: HuffmanStepsFigure, caption: "Utførelse på CLRS-eksemplet (frekvenser i tusen): f:5, e:9, c:12, b:13, d:16, a:45. Hver rad viser køen før én iterasjon. De to minste (lilla) slås sammen til en ny intern node. Ved like frekvenser er valget vilkårlig, og flere trær kan være korrekte." },
        { type: "figure", component: HuffmanTreeFigure, caption: "Det ferdige treet. a, som er hyppigst, får koden 0, mens de sjeldneste, f og e, får fire bit. Bokas prosedyre legger det første uttatte deltreet ($x$) til venstre. Bytter vi 0 og 1, får vi en annen like god kode, så optimal kode er ikke unik." },
        { type: "box", variant: "theorem", title: "Grådighetsegenskapen (CLRS lemma 15.2)", blocks: [
          { type: "text", text: "La $x$ og $y$ være de to tegnene med lavest frekvens. Da finnes det en optimal prefiksfri kode der $x$ og $y$ har like lange koder som bare er ulike i siste bit, altså søsken nederst i treet." },
          { type: "text", text: "**Bevis (utveksling):** ta et optimalt tre $T$, og la $a$ og $b$ være søsken på størst dybde. Bytt $x$ med $a$ og $y$ med $b$. Siden $x.\\mathit{freq} \\le a.\\mathit{freq}$ og $d_T(x) \\le d_T(a)$, blir kostnaden ikke større:" },
          { type: "formula", latex: "B(T) - B(T') = \\bigl(a.\\mathit{freq} - x.\\mathit{freq}\\bigr)\\bigl(d_T(a) - d_T(x)\\bigr) \\ge 0", name: "Utveksling i Huffman-beviset", caption: "Begge faktorene er ikke-negative. Det samme gjelder byttet av $y$ og $b$. $T''$ er altså også optimal, og der er $x$ og $y$ søsken nederst." },
        ] },
        { type: "box", variant: "theorem", title: "Optimal delstruktur (CLRS lemma 15.3) og korrekthet (teorem 15.4)", blocks: [
          { type: "text", text: "Lag alfabetet $C' = C - \\{x, y\\} \\cup \\{z\\}$ med $z.\\mathit{freq} = x.\\mathit{freq} + y.\\mathit{freq}$. Hvis $T'$ er optimal for $C'$, får vi et optimalt tre $T$ for $C$ ved å erstatte løvnoden $z$ med en intern node som har $x$ og $y$ som barn. Det er nettopp det ene trinnet Huffman gjør." },
          { type: "formula", latex: "B(T) = B(T') + x.\\mathit{freq} + y.\\mathit{freq}", name: "Optimal delstruktur i Huffman", caption: "$x$ og $y$ ligger én dypere enn $z$ gjorde. Fantes et bedre tre for $C$, kunne vi (med lemma 15.2) slått sammen $x$ og $y$ i det og fått et bedre tre for $C'$: selvmotsigelse. Med begge lemmaene og induksjon følger teorem 15.4: **Huffman gir en optimal prefiksfri kode.**" },
        ] },
        { type: "table", head: ["Påstand om Huffman", "Sant?", "Begrunnelse"], rows: [
          ["Gir en optimal prefiksfri kode", "**ja**", "teorem 15.4"],
          ["Et tegn får aldri lengre kode enn et tegn med **strengt** lavere frekvens", "**ja**", "ellers kunne de byttet kode og fått kortere total"],
          ["Har ett tegn strengt større frekvens enn alle de andre til sammen, får det kodelengde 1", "**ja**", "det slås sammen helt til slutt, eller gi det «1» og legg «0» foran alle andre for å forbedre"],
          ["Like frekvenser gir like lange koder", "nei", "A:1, B:2, C:2 kan gi A og B på dybde 2 og C på dybde 1"],
          ["Treet har alltid høyde $\\Theta(\\lg n)$", "nei", "frekvenser $2^0, 2^1, \\dots, 2^{n-1}$ gir en «sti» med høyde $n - 1$"],
        ], caption: "Øving 7, spm. 15. Spesialtilfelle (lysarkene): med bare **ett** tegn blir koden tom, så lengden på originalen må lagres separat." },
        { type: "example", title: "Huffman for hånd (øving 7, spm. 13 og 14)", blocks: [
          { type: "list", items: [
            "**Spm. 13:** A:2, B:2, C:5, D:10. Sammenslåinger: $2 + 2 = 4$, $4 + 5 = 9$, $9 + 10 = 19$. Med bokas plassering (minste til venstre) ligger 9 til venstre for D, og C til høyre for 4. **Koden til C er 01.**",
            "**Spm. 14:** A:86, B:253, C:127, D:53, E:210, F:116. Sammenslåinger: $53 + 86 = 139$, $116 + 127 = 243$, $139 + 210 = 349$, $243 + 253 = 496$, $349 + 496 = 845$. B og E får 2 bit, resten 3 bit: $2 \\cdot (253 + 210) + 3 \\cdot (86 + 127 + 53 + 116) = 926 + 1146 = 2072$ bit.",
            "**Kontroll med regnetrikset:** summen av de interne nodene er $139 + 243 + 349 + 496 + 845 = 2072$. Stemmer.",
          ] },
        ] },
      ],
    },
    {
      id: "gale-shapley",
      title: "Gale–Shapley: stabil matching",
      blocks: [
        { type: "box", variant: "definition", title: "Stabil matching (lysarkene, CLRS 25.2)", blocks: [
          { type: "text", text: "Vi har $n$ kvinner og $n$ menn, og hver person rangerer alle på den andre siden. En **perfekt matching** parer alle. Et **blokkerende par** er en kvinne $w$ og en mann $m$ som ikke er paret med hverandre, men som **begge** heller vil ha hverandre enn partnerne sine. En matching er **stabil** hvis den ikke har noen blokkerende par. Allerede med to par kan en matching være ustabil: hvis A og B helst vil ha hverandre, men er paret med C og D (eksamen august 2025, oppgave 2)." },
        ] },
        { type: "pseudocode", title: "Gale-Shapley(men, women, rankings)", lines: [
          "assign each woman and man as free",
          "while some woman w is free",
          "    let m be the first man on w’s ranked list to whom she has not proposed",
          "    if m is free",
          "        w and m become engaged to each other",
          "    elseif m ranks w higher than the woman w′ he is engaged to",
          "        m breaks the engagement to w′, who becomes free",
          "        w and m become engaged to each other",
          "    else m rejects w, with w remaining free",
          "return the stable matching consisting of the engaged pairs",
        ], caption: "CLRS 25.2, der kvinnene frir. Grådig: hver kvinne frir alltid til den beste hun ikke har prøvd ennå, og hver mann sier ja til den beste som har fridd så langt. Ingen valg vurderes på nytt fra kvinnens side." },
        { type: "figure", component: GaleShapleyFigure, caption: "Et lite eksempel regnet ut med prosedyren. Kvinnenes partnere blir bare dårligere (de går nedover listen), mens mennenes partnere bare blir bedre: en forlovet mann forblir forlovet og bytter bare oppover." },
        { type: "box", variant: "theorem", title: "Hvorfor virker det?", blocks: [
          { type: "list", items: [
            "**Terminerer:** hver kvinne frir til hver mann høyst én gang, så det blir høyst $n^2$ frierier. Med en tabell over hver manns rangering sammenlignes to kvinner i $O(1)$, og kjøretiden blir $O(n^2)$.",
            "**Perfekt matching:** en mann som har fått et frieri, er forlovet resten av tiden. Om en kvinne var ledig etter å ha fridd til alle $n$ menn, ville alle menn vært forlovet, men da med $n$ ulike kvinner, og hun er ikke en av dem: selvmotsigelse.",
            "**Stabil:** anta at $w$ og $m$ blokkerer. $w$ foretrekker $m$ over partneren sin, så hun fridde til $m$ først. Han avslo henne den gang eller forlot henne senere, i begge tilfeller for en han liker bedre. Siden mannens partnere bare blir bedre, foretrekker han sin endelige partner over $w$: selvmotsigelse.",
          ] },
          { type: "formula", latex: "\\text{antall frierier} \\le n \\cdot n = n^2", name: "Antall frierier i Gale–Shapley", caption: "Derfor finnes det **alltid** en stabil matching. For spesielt interesserte: den Gale–Shapley finner, er den beste stabile matchingen for kvinnene og den dårligste for mennene, uansett hvilken ledig kvinne som frir først." },
        ] },
        { type: "example", title: "Uavgjort i rangeringene (eksamen desember 2023, oppgave 7)", blocks: [
          { type: "text", text: "Kan vi fortsatt garantert finne en stabil matching hvis noen er rangert likt? **Ja.** Bryt uavgjort vilkårlig, og kjør Gale–Shapley. Resultatet har ingen blokkerende par med de strenge rangeringene. Når vi går tilbake til de opprinnelige rangeringene, kan et par som ikke strengt foretrakk hverandre, heller ikke plutselig gjøre det. (Kalles en svakt stabil matching.)" },
        ] },
        { type: "text", text: "Matching i bipartitte grafer kommer igjen med maks-flyt i forelesning 12. Eksamen desember 2024, oppgave 20 kombinerer stabil matching med LCS. Den er forklart i læringsnotatet for forelesning 6." },
      ],
    },
    {
      id: "oving",
      title: "Øv på øvings- og eksamensoppgaver",
      blocks: [
        { type: "box", variant: "tip", title: "Oppskrift for en grådighetsoppgave på eksamen", blocks: [
          { type: "list", ordered: true, items: [
            "**Finn det grådige valget:** hva er «best her og nå»? Billigst, dyrest per enhet, slutter først, sjeldnest, lengst til venstre?",
            "**Sjekk det mot moteksempler** før du begynner å bevise. Små instanser med 2–3 elementer avslører de fleste feil.",
            "**Beskriv algoritmen:** som regel sortering etter kriteriet og én lineær gjennomgang, eller en prioritetskø.",
            "**Argumenter for korrekthet:** grådighetsegenskapen (utveksling eller greedy stays ahead) og optimal delstruktur.",
            "**Kjøretid:** ofte dominert av sorteringen, $\\Theta(n \\lg n)$.",
          ] },
          { type: "text", text: "Spørres det om **største** eller **minste** verdi som fortsatt gir en lovlig løsning, er et vanlig triks å lage en grådig **ja/nei-test** for én bestemt verdi og så **binærsøke** etter grensen." },
        ] },
        { type: "figure", component: WellsFigure, caption: "Øving 7, spm. 20: landsbyer langs en vei, og alle må ha en brønn innen avstand $r$. Sorter landsbyene. Sett en brønn i $x + r$, der $x$ er den første landsbyen som ikke er dekket, og gjenta. Grådighetsegenskapen: en brønn som dekker $x$ kan alltid flyttes til $x + r$ uten å miste noen landsby, for til venstre for $x$ er alt allerede dekket. $\\Theta(n \\lg n) = o(n^2)$." },
        { type: "example", title: "Antenner i en tunnel (eksamen august 2026, oppgave 19)", blocks: [
          { type: "text", text: "$n$ sorterte monteringspunkter $x_1, \\dots, x_n$ i en tunnel på $m$ meter. Velg $k$ av dem slik at den **minste** avstanden mellom to antenner blir **størst mulig**, i $\\Theta(n \\lg m)$." },
          { type: "list", items: [
            "**Ja/nei-versjon:** kan vi plassere $k$ antenner med minst $d$ meter mellom? Velg grådig: ta $x_1$ (vi taper aldri på det), og deretter hvert punkt som ligger minst $d$ fra forrige valgte. Svaret er ja hvis vi får minst $k$. $\\Theta(n)$.",
            "**Optimering:** testen er monoton (virker $d$, virker alle mindre $d$), så vi binærsøker etter største $d$ i $1, \\dots, m$. $\\Theta(\\lg m)$ tester med $\\Theta(n)$ hver: $\\Theta(n \\lg m)$.",
          ] },
        ] },
        { type: "example", title: "Brønner med bare k brønner (øving 7, spm. 21)", blocks: [
          { type: "text", text: "Finn minste $d$ slik at $k$ brønner dekker alle landsbyene med avstand $d$. Bruk algoritmen fra spm. 20 som ja/nei-test, og binærsøk. Med heltallige posisjoner ligger en brønn i et optimum midt mellom to landsbyer, så $d = t/2$ for et heltall $0 \\le t \\le 2\\ell$, der $\\ell$ er lengden på veien. Sorter én gang: $\\Theta(n \\lg n + n \\lg \\ell)$." },
        ] },
        { type: "example", title: "Huffman på eksamen (desember 2024, oppgave 8, og desember 2023, oppgave 4)", blocks: [
          { type: "list", items: [
            "**Des. 2024:** a:8, b:4, c:2, d:4. Hvilke trær er korrekte Huffman-trær? Først slås c (2) sammen med en av 4-erne, så resultatet (6) med den andre 4-eren (10), og til slutt med a (18). Altså ligger a på dybde 1, én 4-er på dybde 2, og c med den andre 4-eren på dybde 3. Av de fem trærne passet nummer 3 og 4. Å bare oppgi svaret uten forklaring ga ikke full uttelling.",
            "**Des. 2023:** frekvensene 1, 1, 2, 3, 5, 8, 13, 21 (Fibonacci) for a–h. Sammenslåingene $1 + 1 = 2$, $2 + 2 = 4$, $3 + 4 = 7$, $5 + 7 = 12$, $8 + 12 = 20$, $13 + 20 = 33$ og $21 + 33 = 54$ gir et skjevt tre der hvert nytt tegn henges på rett under rota. h får 1 bit, g 2, f 3 og **e får 4 bit**.",
          ] },
        ] },
        { type: "example", title: "Konserter på én scene (eksamen desember 2023, oppgave 11)", blocks: [
          { type: "text", text: "Klokland har starttidene til konsertene og en graf med kanter mellom konserter som kolliderer, og vil avlyse færrest mulig. Det ser ut som VERTEX-COVER (NP-hardt), men grafen er en **intervallgraf**. Færrest avlysninger er det samme som flest konserter uten kollisjon: **aktivitetsutvelgelse**. Snu tidsaksen: sorter etter synkende starttid, og velg hver konsert som ikke kolliderer med den forrige valgte. Det er «slutter først» speilvendt." },
        ] },
        { type: "example", title: "Når grådig ikke holder (øving 7, spm. 7–10)", blocks: [
          { type: "list", items: [
            "**Vektede aktiviteter (spm. 7 og 8):** $(s, f, v) = (1, 4, 3)$ og $(2, 5, 5)$ overlapper. Grådig tar den som slutter først (verdi 3), men 5 er best.",
            "**Frister og varigheter (spm. 9 og 10):** algoritmen sorterer synkende etter frist og legger hver aktivitet så sent som mulig. Med (frist, lengde) = (8, 3), (11, 8), (7, 2) og (4, 3) settes aktivitet 2 inn på tidspunkt 3, aktivitet 1 på tidspunkt 0, og så er det fullt: 2 aktiviteter. Optimalt er 4, 3, 1 (tre aktiviteter).",
          ] },
        ] },
        { type: "example", title: "Huffman i forkledning: beslutningstrær (øving 7, spm. 16)", blocks: [
          { type: "text", text: "Lag et binært ja/nei-tre som minimerer **forventet** antall spørsmål, gitt sannsynligheten for hver beslutning. Forventet antall spørsmål er $\\sum p_i \\cdot d(i)$, akkurat $B(T)$ med sannsynlighet i stedet for frekvens. Altså er det Huffman: slå sammen de to minst sannsynlige med en prioritetskø, og les ut stiene som i spm. 12. For $(a, 0{,}5)$, $(b, 0{,}25)$, $(c, 0{,}25)$ gir det a: «0», b: «10» og c: «11»." },
        ] },
        { type: "example", title: "Gjør grafen asyklisk med størst mulig kantsum (øving 7, spm. 19, frempek)", blocks: [
          { type: "text", text: "Sorter kantene **stigende** etter verdi, og fjern hver kant som ligger på en sykel i det som er igjen. Å fjerne en kant på en sykel deler aldri en komponent, så vi ender med $n - k$ kanter ($k$ komponenter), like mange som et optimum. Et utvekslingsargument viser at vi kan gå fra et optimum til den grådige løsningen uten å tape. Dette er reverse-delete, en speilvendt Kruskal (forelesning 9)." },
        ] },
        { type: "quiz", items: [
          { question: "Hvilke to egenskaper trenger et problem for at en grådig algoritme skal gi optimal løsning?", answer: "**Grådighetsegenskapen** og **optimal delstruktur** (øving 7, spm. 2). Overlappende delinstanser og en unik optimal løsning trengs ikke." },
          { question: "Hva betyr grådighetsegenskapen, helt presist?", answer: "At det finnes en optimal løsning der **første** valg er grådig (øving 7, spm. 3). At vi kan fortsette grådig hele veien, følger først sammen med optimal delstruktur, via induksjon." },
          { question: "Hvilke av disse kan løses grådig: kontinuerlig ryggsekk, stavkapping, binær ryggsekk, aktivitetsutvelgelse, LCS?", answer: "**Kontinuerlig ryggsekk** og **aktivitetsutvelgelse** (øving 7, spm. 4). De andre krever dynamisk programmering." },
          { question: "Hvorfor feiler grådig etter kilopris for den binære ryggsekken? Gi et eksempel.", answer: "Vi kan ikke dele gjenstander, så det grådige valget kan etterlate tom plass. $w = \\langle 10, 20, 30 \\rangle$, $v = \\langle 60, 100, 120 \\rangle$, $W = 50$: grådig gir 160, optimum er 220." },
          { question: "Hvilken aktivitet velger Greedy-Activity-Selector først, og hvorfor er det trygt?", answer: "Den som **slutter først**. Teorem 15.1: bytt ut den første aktiviteten i en optimal løsning med denne. Den slutter minst like tidlig, så resten passer fortsatt, og antallet er det samme." },
          { question: "Hva er kjøretiden til Greedy-Activity-Selector?", answer: "$\\Theta(n)$ hvis aktivitetene er sortert etter sluttid, ellers $\\Theta(n \\lg n)$ med sorteringen." },
          { question: "Hva er det grådige valget i Huffman, og hva er kjøretiden?", answer: "Slå sammen de **to deltrærne med lavest frekvens**. $n - 1$ runder med Extract-Min og Insert på en binær haug gir $O(n \\lg n)$." },
          { question: "Hvordan regner du raskt ut antall bit i en Huffman-kodet fil?", answer: "Summer frekvensene i alle de **interne nodene**, altså alle summene fra sammenslåingene. Det er lik $B(T) = \\sum c.\\mathit{freq} \\cdot d_T(c)$." },
          { question: "Hvorfor må en optimal prefiksfri kode være et fullt binærtre?", answer: "Har en intern node bare ett barn, kan vi fjerne noden og flytte deltreet opp. Da blir alle kodene under kortere, og koden er fortsatt prefiksfri." },
          { question: "Er det grådig å alltid ta største mynt for myntene 1, 15, 30, 45, 50, 60 og 100?", answer: "Nei. Beløpet 95 gir grådig $60 + 30 + 5 \\cdot 1$ (7 mynter), men $50 + 45$ (2 mynter) er optimalt." },
          { question: "Hvorfor gir Gale–Shapley alltid en stabil matching?", answer: "Hvis $w$ og $m$ blokkerte, ville $w$ ha fridd til $m$ før sin endelige partner. Da avslo eller forlot $m$ henne for en han liker bedre, og en manns partnere blir bare bedre. Han foretrekker altså sin partner over $w$: selvmotsigelse." },
          { question: "Hvordan finner du den største minsteavstanden når du skal plassere $k$ antenner (eksamen august 2026)?", answer: "Lag en grådig test for «minst $d$ mellom antennene»: ta første punkt, og deretter hvert punkt minst $d$ fra forrige. Binærsøk deretter på $d$. $\\Theta(n \\lg m)$." },
        ] },
      ],
    },
  ],
};
