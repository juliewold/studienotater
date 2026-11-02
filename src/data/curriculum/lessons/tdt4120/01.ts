import type { Lesson } from "../types";
import { BestWorstFigure, GrowthFigure, InsertionStepFigure, InvariantFigure, ProblemInstanceFigure, ThetaSandwichFigure } from "./figures01";

const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view`, kind: "drive" as const });

// Based on the pensum booklet (lecture 1, goals A1–A8), the lecture slides, exercise 1 with
// its solution and exercise lecture 1, and the reviewed note "Forelesning 1 - Algoritmer og kompleksitet".
export const lesson: Lesson = {
  subjectId: "tdt4120",
  unitId: "01",
  reviewed: "2026-11-02",
  summary: "Valg av algoritme betyr mer enn maskinvare, språk og kodekvalitet. For å sammenligne algoritmer trenger vi presise begreper (problem, instans, RAM-modellen), en måte å vise **korrekthet** på (induksjon og løkkeinvarianter) og et språk for **effektivitet** (asymptotisk notasjon). Insertion-Sort er gjennomgangseksempelet.",
  overview: [
    "**Problem** = hva som er riktig output for hvert input. **Instans** = ett konkret input. **Størrelse** $n$ = plass for å skrive input. For tall er $n$ antall bits, så $x$ steg er eksponentielt i $n$.",
    "**RAM-modellen:** én enkel instruksjon om gangen, hver tar $\\Theta(1)$, ord på høyst $c \\lg n$ bits, ingen cache.",
    "**Insertion-Sort:** invarianten «$A[1:i-1]$ er sortert». Beste tilfelle $\\Theta(n)$ (sortert), gjennomsnitt og verste $\\Theta(n^2)$ (baklengs). In-place og stabil.",
    "**Løkkeinvariant:** initialisering, vedlikehold og terminering, altså induksjon over antall runder.",
    "**Induksjon:** grunntilfelle, induksjonshypotese og induksjonstrinn. Sterk induksjon antar alle mindre tilfeller.",
    "**Notasjon:** $o \\sim <$, $O \\sim \\le$, $\\Theta \\sim =$, $\\Omega \\sim \\ge$, $\\omega \\sim >$. Behold største ledd og fjern konstanten.",
    "**Snubletråd:** $O$ er ikke verste tilfelle og $\\Omega$ er ikke beste tilfelle. Tilfellet velger funksjonen, notasjonen velger grensen.",
  ],
  keyFormulas: [
    { latex: "f = O(g) \\iff \\exists\\, c, n_0 > 0 : 0 \\le f(n) \\le c\\,g(n) \\;\\forall n \\ge n_0", label: "Øvre grense" },
    { latex: "f = \\Theta(g) \\iff f = O(g) \\text{ og } f = \\Omega(g)", label: "Tett grense" },
    { latex: "1 + 2 + \\cdots + (n-1) = \\frac{n(n-1)}{2} = \\Theta(n^2)", label: "Verste tilfelle for Insertion-Sort" },
    { latex: "1 \\prec \\lg n \\prec \\sqrt{n} \\prec n \\prec n \\lg n \\prec n^2 \\prec n^3 \\prec 2^n \\prec n!", label: "Vekstrater" },
  ],
  concepts: [
    "algoritme", "problem", "instans", "problemstorrelse", "problem-as-relation", "pseudopolynomisk-kjoretid", "pseudokode", "ram-model",
    "insertion-sort", "stable-sorting", "bogo-sort", "matching", "korrekthet", "induksjon", "base-case", "induction-hypothesis",
    "strong-induction", "lokkeinvariant", "kjoretid", "best-case", "average-case", "worst-case",
    "asymptotic-notation", "big-o", "big-omega", "big-theta", "lille-o", "lille-omega", "growth-classes",
  ],
  notes: [{ slug: "forelesning-1", label: "Forelesning 1 - Algoritmer og kompleksitet" }],
  goals: [
    "Lese bokas pseudokode **(A1)** og kjenne RAM-modellen **(A2)**",
    "Definere problem, instans og problemstørrelse **(A3)**",
    "Definere og bruke $O$, $\\Omega$, $\\Theta$, $o$ og $\\omega$ **(A4)**",
    "Definere beste, gjennomsnittlige og verste tilfelle **(A5)**, og forstå at alle notasjonene kan brukes om alle tilfellene **(A6)**",
    "Føre bevis med induksjon og løkkeinvarianter **(A7)**",
    "Utføre, bevise og analysere Insertion-Sort **(A8)**",
  ],
  sources: [
    drive("Pensumhefte 2026, forelesning 1", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
    drive("Forelesning 1 (lysark)", "18u_ZFsarcRplsHUZ_MZY-zIEUJZhBTN6"),
    drive("Løsningsforslag øving 1", "1KN2AxQBMG4h_chcGLFqfWPzlOakHcWUA"),
    drive("Øvingsforelesning 1", "1zfYZVHibIN1tPAYCQvU_2me8I9JSkVjs"),
    { label: "Forelesning 1 - Algoritmer og kompleksitet", url: "forelesning-1", kind: "note" },
  ],
  sections: [
    {
      id: "problem",
      title: "Problem, instans og algoritme",
      blocks: [
        { type: "box", variant: "definition", title: "Problem, instans og problemstørrelse", blocks: [
          { type: "list", items: [
            "**Problem:** en generell beskrivelse av hvilket output som er riktig for hvert mulig input (en relasjon mellom input og output).",
            "**Instans:** ett konkret input til problemet.",
            "**Problemstørrelse $n$:** hvor mye plass som trengs for å skrive ned instansen.",
          ] },
        ] },
        { type: "figure", component: ProblemInstanceFigure, caption: "Problemet bestemmer hva som er riktig svar. Algoritmen gjør hver instans om til et svar, og vi spør alltid om den er korrekt og effektiv." },
        { type: "text", text: "**Sorteringsproblemet.** Input er en sekvens $\\langle a_1, \\ldots, a_n \\rangle$. Output er en permutasjon $\\langle a'_1, \\ldots, a'_n \\rangle$ av input der $a'_1 \\le a'_2 \\le \\cdots \\le a'_n$. Instansen $\\langle 5, 2, 4, 6, 1, 3 \\rangle$ har størrelse $n = 6$." },
        { type: "text", text: "En **algoritme** er en presis, endelig fremgangsmåte. Den er **korrekt** hvis den stopper med riktig svar for alle gyldige instanser. Kjøretiden skrives som en funksjon $T(n)$ av problemstørrelsen." },
        { type: "box", variant: "pitfall", title: "Størrelsen til et tall er antall bits", blocks: [
          { type: "text", text: "For tallproblemer er $n \\approx \\lg x$, ikke verdien $x$. En algoritme som bruker $x$ steg, er derfor eksponentiell i $n$, fordi $x = 2^n$." },
        ] },
        { type: "text", text: "**Hvorfor ikke bare prøve alt?** Brute force for sortering prøver alle $n!$ rekkefølger (bogo-sort). Insertion-Sort utnytter at vi kan sortere litt etter litt og bruker rundt $n^2$ steg. Forskjellen blir fort enorm:" },
        { type: "figure", component: GrowthFigure, caption: "Antall steg på logaritmisk skala. Regnet med 1 µs per steg rekker $n!$ bare $n = 17$ på 100 år, $2^n$ rekker $n = 51$, mens $n^2$ rekker omtrent $6 \\cdot 10^7$." },
        { type: "text", text: "Det samme gjelder viktige problemer, som å matche organdonorer med mottakere. I forelesningens eksempel med $n = 4$ testet brute force $4! = 24$ matchinger, mens Ford-Fulkerson brukte 36 grovt telte operasjoner, så brute force ble ferdig først. Med $n = 8$ var det $8! = 40\\,320$ matchinger mot 70 operasjoner: når $n$ dobles, blir Ford-Fulkerson omtrent dobbelt så treg, mens brute force stopper helt opp. Matching kommer tilbake i forelesning 12." },
      ],
    },
    {
      id: "modell",
      title: "Pseudokode og RAM-modellen",
      blocks: [
        { type: "text", text: "Boka skriver algoritmer i pseudokode. Det du må kunne lese **(A1)**:" },
        { type: "list", items: [
          "Innrykk markerer blokker. Det finnes ingen `{ }` eller `end`.",
          "Tabeller starter på indeks 1, og $A[i:j]$ tar med begge ender. Er $i > j$, er delen tom.",
          "Løkketelleren lever videre etter løkka: etter `for i = 2 to n` er $i = n + 1$.",
          "`and` og `or` kortslutter. I `while j > 0 and A[j] > key` leses derfor aldri $A[0]$.",
        ] },
        { type: "box", variant: "definition", title: "RAM-modellen (A2)", blocks: [
          { type: "text", text: "Vi teller steg på en tenkt maskin i stedet for å måle sekunder:" },
          { type: "list", items: [
            "Én instruksjon om gangen, ingen parallellitet.",
            "Aritmetikk, dataflytting og kontroll tar hver konstant tid $\\Theta(1)$.",
            "Heltall og flyttall, med ord på høyst $c \\lg n$ bits for en konstant $c \\ge 1$.",
            "Ingen cache eller minnehierarki: all minnetilgang koster det samme.",
          ] },
        ] },
        { type: "box", variant: "pitfall", title: "Store tall koster", blocks: [
          { type: "text", text: "Vi kan regne med vilkårlig store heltall, for eksempel i kryptografi, men da kan vi ikke anta at hver operasjon tar konstant tid." },
        ] },
      ],
    },
    {
      id: "insertion-sort",
      title: "Insertion-Sort",
      blocks: [
        { type: "text", text: "Ideen er som å sortere kort på hånden: hold de første kortene sortert, ta opp ett nytt kort og skyv det inn på riktig plass." },
        { type: "pseudocode", title: "Insertion-Sort(A, n)", lines: [
          "for i = 2 to n",
          "    key = A[i]",
          "    j = i - 1",
          "    while j > 0 and A[j] > key",
          "        A[j + 1] = A[j]",
          "        j = j - 1",
          "    A[j + 1] = key",
        ], caption: "Linje 2 tar vare på elementet som skal inn. Linje 4–6 skyver større elementer mot høyre. Linje 7 setter $key$ inn i hullet." },
        { type: "figure", component: InsertionStepFigure, caption: "Runde $i = 5$ på $\\langle 2, 4, 5, 6, 1, 3 \\rangle$: alle fire elementene til venstre er større enn $key = 1$ og flyttes ett hakk." },
        { type: "example", title: "Eksempel: sorter $\\langle 5, 2, 4, 6, 1, 3 \\rangle$ for hånd", open: true, blocks: [
          { type: "table", head: ["$i$", "$key$", "Flyttinger", "Tabellen etter runden"], rows: [
            ["2", "2", "1", "$\\langle 2, 5, 4, 6, 1, 3 \\rangle$"],
            ["3", "4", "1", "$\\langle 2, 4, 5, 6, 1, 3 \\rangle$"],
            ["4", "6", "0", "$\\langle 2, 4, 5, 6, 1, 3 \\rangle$"],
            ["5", "1", "4", "$\\langle 1, 2, 4, 5, 6, 3 \\rangle$"],
            ["6", "3", "3", "$\\langle 1, 2, 3, 4, 5, 6 \\rangle$"],
          ] },
          { type: "text", text: "Totalt 9 flyttinger, som er antall **inversjoner** (par $i < j$ med $A[i] > A[j]$). Hver flytting i linje 5 fjerner nøyaktig én inversjon." },
          { type: "box", variant: "tip", title: "Slik gjør du det på eksamen", blocks: [
            { type: "text", text: "For hver $i$: skriv $key = A[i]$, flytt alle elementer til venstre som er **strengt** større, sett inn $key$ der du stoppet, og skriv hele tabellen." },
          ] },
        ] },
        { type: "table", head: ["Egenskap", "Insertion-Sort"], rows: [
          ["Krav", "Elementene må kunne sammenlignes med $\\le$"],
          ["Minne", "In-place, $O(1)$ ekstra"],
          ["Stabil", "Ja: linje 4 bruker $>$, så like elementer beholder rekkefølgen"],
          ["Adaptiv", "Ja: kjøretiden er $\\Theta(n + I)$, der $I$ er antall inversjoner"],
          ["Svakhet", "$\\Theta(n^2)$ i snitt og verste fall. Merge-Sort og Heapsort er $\\Theta(n \\lg n)$ i verste fall (forelesning 3 og 5)"],
        ], caption: "Egenskapene du skal kunne for hver algoritme (læringsmål Z1–Z6)." },
      ],
    },
    {
      id: "korrekthet",
      title: "Korrekthet: induksjon og løkkeinvarianter",
      blocks: [
        { type: "text", text: "Vi vil vise at algoritmen er riktig for **alle** inputstørrelser, ikke bare dem vi har testet. Verktøyet er matematisk induksjon **(A7)**." },
        { type: "box", variant: "tip", title: "Oppskrift: induksjon", blocks: [
          { type: "list", ordered: true, items: [
            "**Grunntilfelle:** vis $P(0)$ (eller $P(1)$).",
            "**Induksjonshypotese (IH):** anta $P(n-1)$ for en vilkårlig $n > 0$.",
            "**Induksjonstrinn:** bruk IH til å vise $P(n)$. Da gjelder $P(n)$ for alle $n \\ge 0$.",
          ] },
          { type: "text", text: "**Sterk induksjon** antar $P(k)$ for alle $k < n$. Den er ikke sterkere, men ofte mer praktisk. Svak induksjon passer for løkker, sterk for rekursjon (forelesning 2b og 3)." },
        ] },
        { type: "box", variant: "definition", title: "Løkkeinvariant", blocks: [
          { type: "text", text: "En påstand som er sann ved starten av hver runde i en løkke. Et invariantbevis er induksjon over antall runder:" },
          { type: "list", items: [
            "**Initialisering:** sann før første runde (grunntilfellet).",
            "**Vedlikehold:** er den sann før en runde, er den sann før neste (induksjonstrinnet).",
            "**Terminering:** løkka stopper, og invarianten gir riktig svar.",
          ] },
        ] },
        { type: "figure", component: InvariantFigure, caption: "Invarianten til Insertion-Sort: ved starten av hver runde består $A[1:i-1]$ av de opprinnelige elementene, i sortert rekkefølge." },
        { type: "example", title: "Bevis: Insertion-Sort sorterer $A[1:n]$", blocks: [
          { type: "list", items: [
            "**Initialisering.** Før første runde er $i = 2$, og $A[1:1]$ er ett element. Det er sortert. ✓",
            "**Vedlikehold.** Anta at $A[1:i-1]$ er sortert. Linje 4–6 skyver hvert element som er større enn $key$ ett hakk til høyre, og stopper når $j = 0$ eller $A[j] \\le key$. Linje 7 setter $key$ i posisjon $j + 1$. Alt til venstre er $\\le key$ og alt til høyre er $> key$, så $A[1:i]$ er sortert. ✓",
            "**Terminering.** Løkka stopper med $i = n + 1$. Da sier invarianten at $A[1:n]$ er sortert. ∎",
          ] },
        ] },
      ],
    },
    {
      id: "kjoretid",
      title: "Kjøretiden til Insertion-Sort",
      blocks: [
        { type: "box", variant: "definition", title: "Beste, verste og gjennomsnittlige tilfelle (A5)", blocks: [
          { type: "formula", latex: "T_{\\text{best}}(n) = \\min_{|I| = n} T(I) \\qquad T_{\\text{worst}}(n) = \\max_{|I| = n} T(I) \\qquad T_{\\text{avg}}(n) = E[T(I)]", name: "Beste, verste og forventet kjøretid", caption: "Gjennomsnittet tas over en gitt sannsynlighetsfordeling på instansene." },
        ] },
        { type: "figure", component: BestWorstFigure, caption: "Sortert input stopper while-løkka med en gang. Baklengs input må flytte element $i$ forbi alle de $i - 1$ foran." },
        { type: "formula", latex: "1 + 2 + \\cdots + (n-1) = \\frac{n(n-1)}{2} = \\Theta(n^2)", name: "Trekanttall (verste tilfelle for Insertion-Sort)" },
        { type: "table", head: ["Tilfelle", "Input", "Kjøretid"], rows: [
          ["Beste", "Allerede sortert", "$\\Theta(n)$"],
          ["Gjennomsnitt", "Alle rekkefølger like sannsynlige, ca. $n^2/4$ flyttinger", "$\\Theta(n^2)$"],
          ["Verste", "Baklengs", "$\\Theta(n^2)$"],
        ] },
        { type: "example", title: "Bevis med induksjon: $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$", blocks: [
          { type: "text", text: "**Grunntilfelle** $n = 1$: begge sider er 1. **IH:** anta formelen for $n - 1$. **Trinn:**" },
          { type: "formula", latex: "\\sum_{i=1}^{n} i = \\underbrace{\\sum_{i=1}^{n-1} i}_{\\text{IH}} + n = \\frac{(n-1)n}{2} + \\frac{2n}{2} = \\frac{n(n+1)}{2}" },
          { type: "text", text: "Samme sum gir antall håndtrykk når $n + 1$ personer hilser på alle: $1 + 2 + 3 + 4 = 10$ for fem personer." },
        ] },
      ],
    },
    {
      id: "asymptotisk",
      title: "Asymptotisk notasjon",
      blocks: [
        { type: "text", text: "Når $n$ blir stor, er det bare det raskest voksende leddet som teller. For $4n^2 + 100n$ går forholdet $100n / 4n^2 = 25/n$ mot 0, så vi skriver $\\Theta(n^2)$. Notasjonene sammenligner vekst slik $<, \\le, =, \\ge, >$ sammenligner tall **(A4)**:" },
        { type: "table", head: ["Notasjon", "Som", "Betydning for store $n$"], rows: [
          ["$f = O(g)$", "$\\le$", "$f$ vokser høyst like fort som $g$ (øvre grense)"],
          ["$f = \\Omega(g)$", "$\\ge$", "$f$ vokser minst like fort som $g$ (nedre grense)"],
          ["$f = \\Theta(g)$", "$=$", "$f$ vokser like fort som $g$ (tett grense)"],
          ["$f = o(g)$", "$<$", "$f$ vokser strengt saktere enn $g$"],
          ["$f = \\omega(g)$", "$>$", "$f$ vokser strengt fortere enn $g$"],
        ] },
        { type: "formula", latex: "f(n) = O(g(n)) \\iff \\exists\\, c, n_0 > 0 : 0 \\le f(n) \\le c\\,g(n) \\text{ for alle } n \\ge n_0", name: "Definisjon av O (øvre grense)" },
        { type: "formula", latex: "f(n) = \\Omega(g(n)) \\iff \\exists\\, c, n_0 > 0 : 0 \\le c\\,g(n) \\le f(n) \\text{ for alle } n \\ge n_0", name: "Definisjon av Ω (nedre grense)" },
        { type: "formula", latex: "f(n) = \\Theta(g(n)) \\iff \\exists\\, c_1, c_2, n_0 > 0 : 0 \\le c_1 g(n) \\le f(n) \\le c_2 g(n) \\text{ for alle } n \\ge n_0", name: "Definisjon av Θ (tett grense)", caption: "Teorem 3.1: $f = \\Theta(g)$ hvis og bare hvis $f = O(g)$ og $f = \\Omega(g)$." },
        { type: "formula", latex: "f(n) = o(g(n)) \\iff \\forall\\, c > 0\\; \\exists\\, n_0 > 0 : 0 \\le f(n) < c\\,g(n) \\text{ for alle } n \\ge n_0", name: "Definisjon av o (streng øvre grense)", caption: "Tilsvarende for $\\omega$, med $0 \\le c\\,g(n) < f(n)$. Forskjellen fra $O$: ulikheten må holde for **alle** $c$." },
        { type: "figure", component: ThetaSandwichFigure, caption: "$4n^2 + 100n = \\Theta(n^2)$ med $c_1 = 4$, $c_2 = 5$ og $n_0 = 100$. Det som skjer før $n_0$, spiller ingen rolle." },
        { type: "box", variant: "tip", title: "Tommelfingerregler", blocks: [
          { type: "list", items: [
            "Behold det største leddet og fjern konstanten: $n^2 + n \\lg n = \\Theta(n^2)$, $2^n + n^k = \\Theta(2^n)$.",
            "Grenseverdi: går $f(n)/g(n)$ mot 0, er $f = o(g)$. Mot en konstant $> 0$: $\\Theta(g)$. Mot $\\infty$: $\\omega(g)$.",
            "Logaritmer $\\prec$ polynomer $\\prec$ eksponentialer $\\prec$ fakultet, uansett grunntall og eksponent.",
          ] },
        ] },
        { type: "formula", latex: "1 \\prec \\lg n \\prec \\sqrt{n} \\prec n \\prec n \\lg n \\prec n^2 \\prec n^3 \\prec 2^n \\prec n!", name: "Vanlige vekstrater i stigende rekkefølge", caption: "$f \\prec g$ betyr $f = o(g)$, og $\\lg n = \\log_2 n$." },
        { type: "text", text: "Likhetstegnet betyr egentlig «er med i mengden», og det er **enveis**: $n^2 + O(n) = O(n^2)$ er sant, men $O(n^2) = n^2 + O(n)$ er usant. Inne i et uttrykk står notasjonen for en ukjent funksjon av den størrelsen." },
      ],
    },
    {
      id: "snubletrad",
      title: "O betyr ikke verste tilfelle (A6)",
      blocks: [
        { type: "text", text: "**Tilfellet** (beste, gjennomsnitt, verste) velger hvilken funksjon vi ser på. **Notasjonen** velger hva slags grense vi gir for den. Alle kombinasjoner er lov." },
        { type: "box", variant: "pitfall", title: "Ukens snubletråd", blocks: [
          { type: "text", text: "At verste tilfelle for Insertion-Sort er $\\Omega(n)$, er som å si at den høyeste i klassen er minst 1 meter: en nedre grense for et maksimum. Sant, men lite presist." },
          { type: "text", text: "Uten å vite tilfellet må grensen dekke alle input. For Insertion-Sort er det $O(n^2)$ og $\\Omega(n)$, men ingen $\\Theta$-grense for alle input." },
        ] },
      ],
    },
    {
      id: "oving",
      title: "Øv på eksamensoppgaver",
      blocks: [
        { type: "example", title: "Vis at $4n^2 + 100n = \\Theta(n^2)$", blocks: [
          { type: "text", text: "**Nedre:** $100n \\ge 0$, så $4n^2 + 100n \\ge 4n^2$. Velg $c_1 = 4$. **Øvre:** $4n^2 + 100n \\le 5n^2 \\iff 100 \\le n$. Velg $c_2 = 5$ og $n_0 = 100$." },
          { type: "text", text: "Triks: for $n \\ge 1$ er $n \\le n^2$, så $3n^2 + 10n + 5 \\le 18n^2$ gir $O(n^2)$ med $c = 18$ og $n_0 = 1$." },
        ] },
        { type: "example", title: "Motbevis: $n^2 \\neq O(n)$", blocks: [
          { type: "text", text: "Anta $n^2 \\le c\\,n$ for alle $n \\ge n_0$. Del på $n$: $n \\le c$. Men $n$ kan velges større enn den faste konstanten $c$, for eksempel $n = \\max(n_0, \\lceil c \\rceil + 1)$. Selvmotsigelse. ∎" },
        ] },
        { type: "example", title: "Forenkle blandede grenser", blocks: [
          { type: "text", text: "Summer nedre og øvre grenser hver for seg. Et $O$-ledd kan være 0, og et $\\Omega$-ledd har ingen øvre grense:" },
          { type: "formula", latex: "\\Theta(n^3) \\cdot \\Omega(\\lg n) + O(n) = \\Omega(n^3 \\lg n)" },
          { type: "formula", latex: "O(n^a) + \\Omega(n^b) + \\Theta(n^c) = \\Omega(n^b + n^c)" },
          { type: "text", text: "Den første er oppgave 2 fra øvingsforelesning 1. Samme regler brukes i øving 1, oppgave 12–17. Merk at $a$ ikke påvirker svaret i den andre." },
        ] },
        { type: "quiz", items: [
          { question: "Verste tilfelle for Insertion-Sort er $O(n^3)$.", answer: "**Sant.** $O$ er bare en øvre grense, og $n^2 \\le n^3$. Gyldig, men ikke tett." },
          { question: "Kjøretiden til Insertion-Sort er $\\Theta(n^2)$ for alle input.", answer: "**Usant.** Sortert input tar $\\Theta(n)$, som ikke er $\\Omega(n^2)$." },
          { question: "$2^{n+1} = O(2^n)$.", answer: "**Sant.** $2^{n+1} = 2 \\cdot 2^n$, så $c = 2$ holder." },
          { question: "$2^{2n} = O(2^n)$.", answer: "**Usant.** $2^{2n} = 2^n \\cdot 2^n$, og $2^n$ blir større enn enhver konstant $c$." },
          { question: "$n \\lg n = o(n^2)$.", answer: "**Sant.** $\\frac{n \\lg n}{n^2} = \\frac{\\lg n}{n} \\to 0$." },
          { question: "$\\lg n^{\\lg 5} = \\Theta(\\lg 5^{\\lg n})$.", answer: "**Sant** (øving 1). Begge er lik $\\lg 5 \\cdot \\lg n$, så de er til og med like." },
        ] },
      ],
    },
  ],
};
