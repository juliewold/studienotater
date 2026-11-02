import type { Lesson } from "../types";
import { ArrayMemoryFigure, HashChainingFigure, LinkedListDeleteFigure, MatrixLayoutFigure, StackQueueFigure, TableDoublingFigure } from "./figures02a";

const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view`, kind: "drive" as const });

// Based on the pensum booklet (lecture 2a, goals B1–B5, appendix A), the lecture slides,
// the exercise 2a solution and the reviewed note "Forelesning 2a - Datastrukturer".
export const lesson: Lesson = {
  subjectId: "tdt4120",
  unitId: "02a",
  reviewed: "2026-11-02",
  summary: "Hvordan data er organisert avgjør hva hver operasjon koster. Forelesningen går gjennom tabeller, stakker, køer, lenkede lister, hashtabeller og dynamiske tabeller, og innfører **amortisert analyse**. Stoffet er støttelitteratur, men brukes gjennom hele faget.",
  overview: [
    "**Tabell:** sammenhengende minneblokk. Adressen til $A[i]$ er $a + b(i - s)$, så oppslag tar $\\Theta(1)$. Innsetting i midten tar $\\Theta(n)$.",
    "**Stakk (LIFO)** og **kø (FIFO, ringbuffer):** Push, Pop, Enqueue og Dequeue tar $\\Theta(1)$. En kø med $m$ plasser rommer høyst $m - 1$ elementer.",
    "**Dobbeltlenket liste:** søk $\\Theta(n)$. Innsetting og sletting $\\Theta(1)$ når vi har en peker til noden.",
    "**Hashing med kjeding:** Insert og Delete $\\Theta(1)$. Søk forventet $\\Theta(1 + \\alpha)$ med $\\alpha = n/m$, verste tilfelle $\\Theta(n)$.",
    "**Perfekt hashing:** for statiske data gir den $O(1)$ søk i verste tilfelle.",
    "**Tabelldobling:** én innsetting kan koste $\\Theta(n)$, men $n$ innsettinger koster totalt $\\Theta(n)$, altså amortisert $\\Theta(1)$.",
    "**Amortisert** = snitt over operasjonene i én sekvens, uten antagelser om input. **Gjennomsnittlig tilfelle** = snitt over instanser.",
  ],
  keyFormulas: [
    { latex: "\\sum_{i=0}^{n-1} i = \\frac{n(n-1)}{2} = \\Theta(n^2)", label: "Håndtrykksformelen" },
    { latex: "\\sum_{i=0}^{h-1} 2^i = 2^h - 1", label: "Toerpotenser" },
    { latex: "\\alpha = \\frac{n}{m}", label: "Lastfaktor" },
    { latex: "(n - 1) + n = 2n - 1 = \\Theta(n)", label: "Tabelldobling, $n = 2^h$" },
  ],
  goals: [
    "Forstå tabeller, matriser, stakker og køer **(B1)**",
    "Forstå lenkede lister **(B2)**",
    "Forstå hashtabeller **(B3)**",
    "Vite at perfekt hashing gir $O(1)$ søk i verste tilfelle for statiske data **(B4)**",
    "Forstå tabelldobling **(B5)**",
  ],
  concepts: [
    "pointer", "address-calculation", "array", "matrix", "row-major-order", "column-major-order", "jagged-array",
    "stack", "push", "pop", "queue", "enqueue", "dequeue", "linked-list", "hash-table", "hashing", "chaining",
    "perfect-hashing", "dynamic-table", "amortized-analysis", "multipop", "handshake-counting", "triangular-number",
    "arithmetic-series", "geometric-series",
  ],
  notes: [{ slug: "forelesning-2", label: "Forelesning 2a - Datastrukturer" }],
  sources: [
    drive("Pensumhefte 2026, forelesning 2a og appendiks A", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
    drive("Forelesning 2a (lysark)", "1WHfJHbqijXl37-vr5iq4aHqCQLE1gWZb"),
    drive("Løsningsforslag øving 2a", "18iw2D91PRz3fMoruJB9vhYng1XOgp3N7"),
    { label: "Forelesning 2a - Datastrukturer", url: "forelesning-2", kind: "note" },
  ],
  sections: [
    {
      id: "tabeller",
      title: "Tabeller og matriser",
      blocks: [
        { type: "text", text: "Hver byte (eller hvert ord på typisk 4 eller 8 bytes) i minnet har en **adresse**. En **peker** er et ord som inneholder en slik adresse. En tabell ligger i én sammenhengende blokk, så plassen til $A[i]$ kan regnes ut direkte:" },
        { type: "formula", latex: "\\text{adressen til } A[i] = a + b\\,(i - s)", name: "Adressen til et tabellelement", caption: "$a$ = adressen til første element, $b$ = bytes per element, $s$ = startindeks (1 i boka)." },
        { type: "figure", component: ArrayMemoryFigure, caption: "Med $a$ = f40ce3e2 og $b = 4$ ligger $A[5]$ på f40ce3e2 + 16 = f40ce3f2, uansett hvor stor tabellen er." },
        { type: "box", variant: "definition", title: "Direkte tilgang", blocks: [
          { type: "text", text: "Oppslag på en kjent indeks tar $\\Theta(1)$. Ulempen er at innsetting midt i tabellen tar $\\Theta(n)$, fordi alt bak må flyttes." },
        ] },
        { type: "text", text: "En **matrise** må flates ut til én tabell. Radvis lagring legger rad 1 først, kolonnevis lagring legger kolonne 1 først. Alternativt kan vi ha én tabell per rad og en tabell med pekere til radene. Da kan radene ha ulik lengde (jagged arrays)." },
        { type: "figure", component: MatrixLayoutFigure, caption: "Samme $2 \\times 3$-matrise lagret radvis og kolonnevis." },
        { type: "formula", latex: "\\text{radvis: } M[i,j] = A[c(i-1) + (j-1) + 1] \\qquad \\text{kolonnevis: } M[i,j] = A[r(j-1) + (i-1) + 1]", name: "Plassen til M[i, j] i radvis og kolonnevis lagring", caption: "$r$ = antall rader, $c$ = antall kolonner." },
      ],
    },
    {
      id: "stakk-ko",
      title: "Stakker og køer",
      blocks: [
        { type: "text", text: "En **stakk** er LIFO (sist inn, først ut). Den lagres i $S[1 : S.size]$, og $S.top$ er både øverste indeks og antall elementer. En **kø** er FIFO (først inn, først ut) og lagres som en **ringbuffer**: $Q.head$ er første element og $Q.tail$ er første ledige plass. Når en av dem passerer slutten, fortsetter den på plass 1." },
        { type: "figure", component: StackQueueFigure, caption: "Eksemplene fra lysarkene: stakken med $S.top = 5$, og køen med elementene på plass 7–11." },
        { type: "pseudocode", title: "Push(S, x)", lines: [
          "if S.top == S.size",
          "    error \"overflow\"",
          "else S.top = S.top + 1",
          "    S[S.top] = x",
        ] },
        { type: "pseudocode", title: "Pop(S)", lines: [
          "if Stack-Empty(S)",
          "    error \"underflow\"",
          "else S.top = S.top - 1",
          "    return S[S.top + 1]",
        ], caption: "$S.top$ er allerede redusert, så det gamle toppelementet ligger på $S.top + 1$." },
        { type: "pseudocode", title: "Enqueue(Q, x)", lines: [
          "Q[Q.tail] = x",
          "if Q.tail == Q.size",
          "    Q.tail = 1",
          "else Q.tail = Q.tail + 1",
        ], caption: "Dequeue er symmetrisk: les $Q[Q.head]$ og flytt $head$ ett steg, med samme omløp." },
        { type: "box", variant: "pitfall", title: "Tom og full kø", blocks: [
          { type: "text", text: "Køen er tom når $Q.head = Q.tail$ og full når $Q.head = Q.tail + 1$ (med omløp). Én plass står alltid ledig, ellers ville full og tom se like ut. Pseudokoden fra lysarkene sjekker ikke for overflow eller underflow." },
        ] },
        { type: "table", head: ["Operasjon", "Kjøretid"], rows: [
          ["Stack-Empty, Push, Pop", "$\\Theta(1)$"],
          ["Enqueue, Dequeue", "$\\Theta(1)$"],
        ] },
      ],
    },
    {
      id: "lister",
      title: "Dynamiske mengder og lenkede lister",
      blocks: [
        { type: "text", text: "En **dynamisk mengde** er et sett operasjoner, ikke én bestemt struktur: Search, Insert, Delete, og når nøklene kan sammenlignes også Minimum, Maximum, Successor og Predecessor. Med en tabell får vi:" },
        { type: "table", head: ["Operasjon", "Usortert tabell", "Sortert tabell"], rows: [
          ["Search", "$\\Theta(n)$", "$\\Theta(\\lg n)$ (binærsøk, forelesning 3)"],
          ["Insert, Delete", "$\\Theta(1)$", "$\\Theta(n)$"],
          ["Minimum, Maximum, Successor, Predecessor", "$\\Theta(n)$", "$\\Theta(1)$"],
        ] },
        { type: "text", text: "I en **dobbeltlenket liste** har hver node $x$ feltene $x.key$, $x.next$ og $x.prev$, og $L.head$ peker på første node. Nodene kan ligge hvor som helst i minnet." },
        { type: "pseudocode", title: "List-Search(L, k)", lines: [
          "x = L.head",
          "while x != NIL and x.key != k",
          "    x = x.next",
          "return x",
        ], caption: "Går node for node: $\\Theta(n)$ i verste tilfelle." },
        { type: "pseudocode", title: "List-Delete(L, x)", lines: [
          "if x.prev != NIL",
          "    x.prev.next = x.next",
          "else L.head = x.next",
          "if x.next != NIL",
          "    x.next.prev = x.prev",
        ], caption: "Bare naboenes pekere endres: $\\Theta(1)$ når vi har en peker til $x$." },
        { type: "figure", component: LinkedListDeleteFigure, caption: "Slett 16 fra $9 \\rightleftarrows 16 \\rightleftarrows 7 \\rightleftarrows 4$: 9 peker nå fram på 7, og 7 peker tilbake på 9." },
        { type: "box", variant: "tip", title: "Hvorfor dobbeltlenket?", blocks: [
          { type: "text", text: "Uten `prev` må vi først finne noden foran $x$ for å slette den, og det tar $\\Theta(n)$. Insert og Prepend tar $\\Theta(1)$ i begge varianter." },
        ] },
      ],
    },
    {
      id: "hashing",
      title: "Hashtabeller",
      blocks: [
        { type: "text", text: "**Direkte adressering** lagrer nøkkel $k$ i $T[k]$. Alle operasjoner tar $\\Theta(1)$, men tabellen trenger én plass per mulig nøkkel, altså plass $\\Theta(|U|)$. **Hashing** bruker i stedet en liten tabell $T[0 : m-1]$ og en hashfunksjon $h : U \\to \\{0, \\ldots, m-1\\}$. To nøkler med samme hashverdi gir en **kollisjon**." },
        { type: "table", head: ["Hashfunksjon", "Formel"], rows: [
          ["Divisjonsmetoden", "$h(k) = k \\bmod m$, gjerne med $m$ et primtall langt fra en toerpotens"],
          ["Multiplikasjonsmetoden", "$h(k) = \\lfloor m\\,(kA \\bmod 1) \\rfloor$ med $0 < A < 1$"],
          ["Multipliser-og-skift", "$h_a(k) = (ka \\bmod 2^w) \\gg (w - \\ell)$ med $m = 2^\\ell$"],
        ] },
        { type: "text", text: "Med **kjeding** inneholder hver plass en lenket liste med alle elementene som hasher dit. Nye elementer settes først i lista." },
        { type: "figure", component: HashChainingFigure, caption: "Nøklene 5, 28, 19, 15, 20, 33, 12, 17 og 10 satt inn med $h(k) = k \\bmod 9$. Kollisjoner er vanlige selv når $\\alpha = 1$." },
        { type: "formula", latex: "\\alpha = \\frac{n}{m} \\qquad E[\\text{søk}] = \\Theta(1 + \\alpha)", name: "Lastfaktor og forventet søk med kjeding", caption: "Under antagelsen om uniform hashing. Med $m = \\Theta(n)$ blir $\\alpha = O(1)$." },
        { type: "table", head: ["Operasjon (kjeding)", "Kjøretid"], rows: [
          ["Insert", "$\\Theta(1)$ (List-Prepend, uten duplikatsjekk)"],
          ["Delete", "$\\Theta(1)$ med peker til noden"],
          ["Search", "forventet $\\Theta(1 + \\alpha)$, verste tilfelle $\\Theta(n)$"],
        ] },
        { type: "box", variant: "definition", title: "Perfekt hashing (B4)", blocks: [
          { type: "text", text: "Er nøklene kjent på forhånd og endres ikke, kan hashfunksjonen velges slik at det ikke blir kollisjoner. Da tar søk $O(1)$ i verste tilfelle, ikke bare forventet. Detaljene er ikke pensum." },
        ] },
      ],
    },
    {
      id: "amortisert",
      title: "Tabelldobling og amortisert analyse",
      blocks: [
        { type: "text", text: "Når en tabell er full, lager vi en ny med dobbel størrelse og kopierer over. Én innsetting kan da koste $\\Theta(n)$, men kopieringen skjer sjeldnere og sjeldnere." },
        { type: "pseudocode", title: "Table-Insert(T, x)", lines: [
          "if T.size == 0",
          "    allocate T.table[1 : 1]",
          "    T.size = 1",
          "if T.num == T.size",
          "    allocate A[1 : 2 · T.size]",
          "    copy T.table into A",
          "    free T.table",
          "    T.table = A",
          "    T.size = 2 · T.size",
          "insert x into T.table",
          "T.num = T.num + 1",
        ] },
        { type: "figure", component: TableDoublingFigure, caption: "Kopiering skjer ved innsetting nr. 2, 3, 5, 9 og 17. Det totale arbeidet holder seg under $3i$." },
        { type: "box", variant: "definition", title: "Amortisert analyse (aggregert metode)", blocks: [
          { type: "formula", latex: "\\text{amortisert kostnad} = \\frac{\\text{totalt arbeid for } n \\text{ operasjoner}}{n}", name: "Amortisert kostnad (aggregert)" },
          { type: "text", text: "For $n = 2^h$ innsettinger koster kopieringene $1 + 2 + \\cdots + n/2 = n - 1$ og selve innsettingene $n$. Totalt $2n - 1$, altså amortisert $2 - 1/n = \\Theta(1)$." },
        ] },
        { type: "box", variant: "pitfall", title: "Øk med en faktor, ikke et fast antall", blocks: [
          { type: "text", text: "Vokser tabellen med $+k$ plasser i stedet for $\\times 2$, blir kopieringen en aritmetisk sum $k + 2k + 3k + \\cdots$, totalt $\\Theta(n^2/k)$. Det er den geometriske veksten som gjør dobling billig." },
        ] },
        { type: "text", text: "**Multipop** popper inntil $k$ elementer og kan koste $\\Theta(n)$ alene. Men hvert element kan bare poppes én gang etter at det er pushet, så $n$ Push- og Multipop-operasjoner koster totalt $O(n)$, altså amortisert $O(1)$." },
        { type: "table", head: ["", "Gjennomsnittlig tilfelle", "Amortisert"], rows: [
          ["Snitt over", "instanser", "operasjonene i én sekvens"],
          ["Krever", "en sannsynlighetsfordeling over input", "ingen antagelse om input"],
          ["Eksempel", "søk med kjeding: $\\Theta(1 + \\alpha)$", "tabelldobling: $\\Theta(1)$ per innsetting"],
        ] },
      ],
    },
    {
      id: "summer",
      title: "To summer du må kunne",
      blocks: [
        { type: "text", text: "Ukens snubletråd: disse to summene dukker opp gjennom hele faget (pensumheftet, appendiks A)." },
        { type: "formula", latex: "\\sum_{i=0}^{n-1} i = \\frac{n(n-1)}{2} \\qquad 1 + 2 + \\cdots + n = \\frac{n(n+1)}{2}", name: "Håndtrykksformelen (trekanttall)", caption: "$n$ personer som hilser på hverandre gir $n(n-1)/2$ håndtrykk." },
        { type: "formula", latex: "\\sum_{i=0}^{h-1} 2^i = 2^h - 1 \\qquad 1 + 2 + 4 + \\cdots + n = 2n - 1", name: "Sum av toerpotenser", caption: "En utslagsturnering med $n = 2^h$ deltakere har $n - 1$ kamper." },
        { type: "box", variant: "tip", title: "Forskjellen som betyr noe", blocks: [
          { type: "text", text: "I en geometrisk sum dominerer siste ledd: summen er under to ganger siste ledd. I en aritmetisk sum er summen omtrent $n/2$ ganger siste ledd, altså $\\Theta(n^2)$. Derfor er tabelldobling billig, mens Insertion-Sort er kvadratisk." },
        ] },
      ],
    },
    {
      id: "oving",
      title: "Øv på oppgaver",
      blocks: [
        { type: "example", title: "Hvor ligger $M[2, 3]$ i en $3 \\times 4$-matrise lagret kolonnevis?", blocks: [
          { type: "text", text: "$A[r(j-1) + (i-1) + 1] = A[3 \\cdot 2 + 1 + 1] = A[8]$. To hele kolonner (6 elementer) kommer først, og $M[2, 3]$ er nummer 2 i sin kolonne." },
        ] },
        { type: "example", title: "Tabelldobling med $n = 16$", blocks: [
          { type: "formula", latex: "\\underbrace{1 + 2 + 4 + 8}_{\\text{kopiering}} + \\underbrace{16}_{\\text{innsetting}} = 31 = 2 \\cdot 16 - 1" },
          { type: "text", text: "Amortisert $31/16 \\approx 1{,}94 = \\Theta(1)$. Er $n$ ikke en toerpotens, er kopieringen under $2n$, så totalt under $3n$." },
        ] },
        { type: "quiz", items: [
          { question: "Tabelldobling gir $\\Theta(1)$ per innsetting. Amortisert eller gjennomsnittlig tilfelle?", answer: "**Amortisert.** Det gjelder for alle sekvenser, uten antagelser om input." },
          { question: "Søk med kjeding tar $\\Theta(1 + \\alpha)$. Amortisert eller gjennomsnittlig tilfelle?", answer: "**Gjennomsnittlig (forventet).** Det krever antagelsen om uniform hashing." },
          { question: "Kan vi slette en node i en enkeltlenket liste i $\\Theta(1)$ når vi har en peker til den?", answer: "**Nei,** ikke direkte. Vi må finne noden foran for å endre dens `next`, og det tar $\\Theta(n)$." },
          { question: "Hvorfor er $m = 2^{10}$ et dårlig valg for $h(k) = k \\bmod m$ når alle nøklene er delelige med 8?", answer: "$k \\bmod 2^{10}$ er de 10 laveste bitene, og de 3 laveste er alltid 0. Bare 128 av de 1024 plassene blir brukt." },
          { question: "Hva er plassbruken til direkte adressering med 64-bits nøkler?", answer: "$\\Theta(|U|) = 2^{64}$ plasser, uavhengig av hvor mange elementer vi lagrer. Derfor trenger vi hashing." },
        ] },
      ],
    },
  ],
};
