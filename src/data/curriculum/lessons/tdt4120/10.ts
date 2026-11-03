import type { Lesson } from "../types";
import { BellmanFordPassFigure, DagFigure, DijkstraNegativeFigure, DijkstraTraceFigure, NegativeCycleFigure, RelaxFigure } from "./figures10";

const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view`, kind: "drive" as const });

// Based on the pensum booklet (lecture 10, goals J1–J11, chapter 22 innledning og 22.1–22.3), the lecture slides, exercise 10
// and the exams from August 2023 to August 2026 (with solutions). Older tasks are taken from exercise 10, which refers to
// exams from 2015–2021. CLRS chapter 22 is used for the proofs. The existing lecture 10 note in Studienotater was not used as support.
export const lesson: Lesson = {
  subjectId: "tdt4120",
  unitId: "10",
  reviewed: "2026-11-03",
  summary: "Vi har en rettet graf med vekter og en startnode $s$, og vil finne korteste vei fra $s$ til alle andre noder. Metoden er felles for alle tre algoritmene: hver node har et estimat $v.d$ som er en øvre grense for avstanden, og vi senker det med **Relax** når vi finner en kortere vei. Algoritmene skiller seg i rekkefølgen de slakker kantene i. **DAG-Shortest-Paths** går i topologisk orden, tar negative kanter, og bruker $\\Theta(V + E)$, men krever en DAG. **Bellman-Ford** slakker alle kanter $|V| - 1$ ganger, tar negative kanter, og oppdager negative sykler, med $O(VE)$. **Dijkstra** tar alltid ut noden med lavest estimat, og er raskest, med $O(E \\lg V)$ med binærhaug, men krever at kantene ikke er negative.",
  overview: [
    "**Problemet (J1, J2):** input er en rettet graf $G$, vektfunksjonen $w$ og startnoden $s$. Output er $\\delta(s, v)$ for hver $v$ og et korteste-vei-tre. Varianter er single-source (fra én til alle), single-destination (fra alle til én, ved å snu kantene), single-pair og all-pairs.",
    "**Negative sykler (J3):** en negativ sykel som kan nås fra $s$ gjør $\\delta(s, v) = -\\infty$ for alle $v$ den kan nå. En korteste **enkel** vei finnes alltid når det finnes en vei, men den er NP-hard å finne i generelle grafer (J4).",
    "**Relax (J6, !):** hvis $v.d > u.d + w(u, v)$, sett $v.d = u.d + w(u, v)$ og $v.\\pi = u$. Estimatet blir aldri mindre enn $\\delta(s, v)$, og er riktig når en korteste vei er slakket i rekkefølge.",
    "**Bellman-Ford (J8):** slakk alle kanter $|V| - 1$ ganger. Kjør så én kontrollrunde: finnes det en kant som kan slakkes, er det en negativ sykel nåbar fra $s$. $O(VE)$.",
    "**DAG-Shortest-Paths (J9, J10, !):** topologisk sortering, og så én Relax-runde fra start til slutt. Det er dynamisk programmering der delinstansgrafen er grafen selv. $\\Theta(V + E)$.",
    "**Dijkstra (J11):** ikke-negative kanter. Ta ut noden med lavest $v.d$, og slakk ut-kantene. $O(V \\lg V + E \\lg V) = O(E \\lg V)$ med binærhaug, og $O(V \\lg V + E)$ med Fibonacci-haug.",
    "**Velge algoritme:** er grafen en DAG, bruk DAG-Shortest-Paths. Har den negative kanter eller sykler, bruk Bellman-Ford. Ellers, bruk Dijkstra.",
  ],
  keyFormulas: [
    { latex: "\\delta(s, v) = \\min\\{\\, w(p) : s \\overset{p}{\\leadsto} v \\,\\}", label: "Korteste-vei-avstanden. Er det ingen sti fra $s$ til $v$, er $\\delta(s, v) = \\infty$" },
    { latex: "v.d > u.d + w(u, v) \\implies v.d = u.d + w(u, v)", label: "Relax. Estimatet senkes, og aldri økes" },
    { latex: "\\delta(s, v) \\le \\delta(s, u) + w(u, v)", label: "Trekantulikheten for korteste veier. Gjelder når det ikke finnes negative sykler nåbare fra $s$" },
    { latex: "w(u, v) = -\\lg p(u, v)", label: "Sannsynligheter gjøres om til vekter: en størst mulig produkt blir en minst mulig sum (CLRS 22.3-7)" },
    { latex: "T_{\\text{DAG}} = \\Theta(V + E)", label: "DAG-Shortest-Paths: topologisk sortering og én relaksjon per kant" },
    { latex: "T_{\\text{Bellman-Ford}} = O(VE)", label: "Bellman-Ford: $|V| - 1$ gjennomganger av alle kanter, og en kontrollrunde" },
    { latex: "T_{\\text{Dijkstra}} = O(V \\lg V + E \\lg V) = O(E \\lg V)", label: "Dijkstra med binærhaug, for sammenhengende grafer" },
    { latex: "T_{\\text{Dijkstra}} = O(V \\lg V + E)", label: "Dijkstra med Fibonacci-haug (pensum krever bare kjøretiden)" },
  ],
  goals: [
    "Forstå ulike varianter av korteste-vei-problemet **(J1)**",
    "Forstå strukturen til problemet, og at delstier av korteste veier er korteste veier **(J2)**",
    "Forstå at negative sykler gjør korteste vei udefinert, og at korteste enkel vei likevel kan finnes **(J3)**",
    "Forstå reduksjonene mellom korteste og lengste enkle vei **(J4)**",
    "Forstå korteste-vei-trær **(J5)**",
    "Forstå kant-oppdatering (edge relaxation) og Relax **(J6, !)**",
    "Forstå egenskapene til korteste veier og oppdatering **(J7)**",
    "Forstå Bellman-Ford **(J8)**",
    "Forstå DAG-Shortest-Paths **(J9)**",
    "Forstå koblingen mellom DAG-Shortest-Paths og dynamisk programmering **(J10, !)**",
    "Forstå Dijkstra, inkludert kjøretid med Fibonacci-haug **(J11)**",
  ],
  concepts: [
    "shortest-path", "relaxation", "bellman-ford", "dijkstra-algorithm", "dag-shortest-paths", "negative-cycle", "topological-sort",
    "dynamisk-programmering", "delinstansgraf", "memoisering", "priority-queue", "tree", "rooted-tree", "breadth-first-search",
  ],
  notes: [{ slug: "forelesning-10-korteste-vei-fra-en-til-alle", label: "Forelesning 10 - Korteste vei fra én til alle" }],
  sources: [
    drive("Pensumhefte 2026, forelesning 10", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
    drive("Forelesning 10 (lysark)", "1I4VJv0qRWJ7XUBHw9o5ApMIj5EY98QIY"),
    drive("Øving 10: Korteste vei fra én til alle", "1lJYnbikTj6sFBy3Cp34S8BiEVWQE8z4L"),
    drive("Eksamen august 2026 med løsningsforslag", "1MhSk2qelJNYMKZjaj2O7mqzzYtryB9vr"),
    drive("Eksamen desember 2025 med løsningsforslag", "1NdJNYFLTh20uLDmtG1W2oUa_3HVZllir"),
    drive("Eksamen august 2025 med løsningsforslag", "1B5E6tItKtjigNSfNEwm9GIBC3pdbWlDC"),
    drive("Eksamen desember 2024 med løsningsforslag", "1Ffv3IAteloAL1jjcu0k2MQKfJ9nVtgrb"),
    drive("Eksamen august 2024 med løsningsforslag", "10gHedZOudM9XBcB8WuEw-agDlCQKdVC4"),
    drive("Eksamen desember 2023 med løsningsforslag", "1R6BvBaHHIm2BfMmp1XHh-Xg8QQpdM0cN"),
    drive("Eksamen august 2023 med løsningsforslag", "13cPZyB7QwYr5LEpzM6dkzMoN7NYcwdy1"),
    { label: "Forelesning 10 - Korteste vei fra én til alle", url: "forelesning-10-korteste-vei-fra-en-til-alle", kind: "note" },
  ],
  sections: [
    {
      id: "problemet",
      title: "Problemet og varianter",
      blocks: [
        { type: "text", text: "Vi har en rettet graf $G = (V, E)$ med en vektfunksjon $w$ og en startnode $s$. Lengden til en sti $p = \\langle v_0, \\ldots, v_k \\rangle$ er summen av kantvektene. Den **korteste-vei-avstanden** $\\delta(s, v)$ er den minste lengden av en sti fra $s$ til $v$, og er $\\infty$ hvis ingen sti finnes. En korteste vei er en sti som oppnår $\\delta(s, v)$." },
        { type: "formula", latex: "\\delta(s, v) = \\min\\{\\, w(p) : s \\overset{p}{\\leadsto} v \\,\\}", name: "Korteste-vei-avstanden", caption: "Minimum over alle stier fra $s$ til $v$. Er det ingen sti, er avstanden $\\infty$." },
        { type: "list", items: [
          "**Single-source (SSSP):** korteste vei fra én node $s$ til alle andre. Det er problemet i denne forelesningen.",
          "**Single-destination:** fra alle noder til én node $t$. Snu kantene i grafen, og løs SSSP fra $t$. Eksamen august 2024, oppgave 7: er grafen uvektet, er BFS nok.",
          "**Single-pair:** fra $s$ til $t$. Ingen kjent metode er bedre enn SSSP i verste tilfelle, så vi løser alltid SSSP.",
          "**All-pairs (APSP):** korteste vei fra alle til alle. Neste forelesning.",
        ] },
        { type: "box", variant: "definition", title: "Optimal delstruktur (J2)", blocks: [
          { type: "text", text: "Delstier av korteste veier er korteste veier. Hvis $\\langle s, \\ldots, x, \\ldots, v \\rangle$ er en korteste vei, er delstien fra $s$ til $x$ en korteste vei til $x$, og delstien fra $x$ til $v$ en korteste vei fra $x$ til $v$. Det er grunnen til at vi kan bygge løsningen fra korteste veier til mindre delproblemer, slik dynamisk programmering gjør." },
        ] },
        { type: "box", variant: "pitfall", title: "Negative sykler (J3)", blocks: [
          { type: "text", text: "Finnes det en negativ sykel som kan nås fra $s$, og som ligger på en sti til $v$, kan vi gå rundt sykelen uendelig mange ganger og få lengder som går mot $-\\infty$. Da er $\\delta(s, v) = -\\infty$. Men en **enkel** sti gjentar ingen noder, og den korteste enkle veien finnes alltid når en vei finnes. Vi kan ikke finne den effektivt med negative sykler (med mindre P = NP)." },
        ] },
        { type: "example", title: "Lengste enkle vei (eksamen august 2024, oppgave 8)", blocks: [
          { type: "text", text: "Vi vil finne lengste enkle vei fra $s$ til $t$. Gang alle kantvekter med $-1$, og finn korteste vei med Bellman-Ford. Det fungerer ikke hvis en **positiv** sykel kan brukes på en sti fra $s$ til $t$, for den blir negativ i den nye grafen. Det er bare hvis ingen sti fra $s$ til $t$ går innom en slik sykel at metoden gir riktig svar. Lengste enkle vei er NP-hardt, og det finnes ingen generelt effektiv metode." },
        ] },
        { type: "text", text: "**Korteste-vei-tre (J5):** etter at algoritmen er ferdig, peker $v.\\pi$ tilbake på forgjengeren på en korteste vei til $v$. Kantene $(v.\\pi, v)$ danner predecessor-subgrafen $G_\\pi$. Finnes ingen negativ sykel nåbar fra $s$, er $G_\\pi$ et tre med rot $s$, der stien fra $s$ til $v$ i treet er en korteste vei." },
      ],
    },
    {
      id: "relax",
      title: "Relax og egenskapene til korteste veier",
      blocks: [
        { type: "text", text: "Alle algoritmene begynner med det samme: $s.d = 0$, og $v.d = \\infty$ for alle andre noder. Estimatene kan bare senkes. Kanten $(u, v)$ slakkes ved at vi sjekker om en kortere vei til $v$ går via $u$." },
        { type: "pseudocode", title: "Initialize-Single-Source(G, s) og Relax(u, v, w)", lines: [
          "Initialize-Single-Source(G, s)",
          "    for each vertex v ∈ G.V",
          "        v.d = ∞",
          "        v.π = nil",
          "    s.d = 0",
          "Relax(u, v, w)",
          "    if v.d > u.d + w(u, v)",
          "        v.d = u.d + w(u, v)",
          "        v.π = u",
        ], caption: "Initialize-Single-Source setter estimatene. Relax er den eneste operasjonen som endrer dem: den senker $v.d$ hvis det finnes en kortere vei via $u$, og registrerer $u$ som forgjenger. Lysarkene kaller dette Relax(u, v, w) (J6)." },
        { type: "figure", component: RelaxFigure, caption: "Relax på kanten (u, v) med vekt 3, der $u.d = 4$. Til venstre er $v.d = 10$, så senkes den til 7. Til høyre er $v.d = 5$, og den står. Det er aldri nødvendig å øke estimatet." },
        { type: "box", variant: "definition", title: "Egenskaper ved korteste veier og oppdatering (J7)", blocks: [
          { type: "list", items: [
            "**Trekantulikhet:** $\\delta(s, v) \\le \\delta(s, u) + w(u, v)$ for hver kant $(u, v)$. Ruten til $u$ etterfulgt av $(u, v)$ er en vei til $v$, så lengden er minst $\\delta(s, v)$.",
            "**Øvre grense:** $v.d \\ge \\delta(s, v)$ til enhver tid. Estimatet kan ikke gå under den riktige avstanden, og det blir aldri økt.",
            "**Ingen sti:** er $v$ ikke nåbar fra $s$, er $v.d = \\infty$ hele tiden.",
            "**Konvergens:** hvis $u.d = \\delta(s, u)$ før vi slakker $(u, v)$, er $v.d = \\delta(s, v)$ etterpå, og det holder seg.",
            "**Path-relaxation:** slakk kantene på en korteste vei $\\langle v_0, \\ldots, v_k \\rangle$ i rekkefølge, også med andre kanter innimellom. Da er $v_k.d = \\delta(s, v_k)$ etterpå.",
            "**Predecessor-subgraf:** når alle estimatene er riktige, er $G_\\pi$ et korteste-vei-tre.",
          ] },
        ] },
        { type: "formula", latex: "\\delta(s, v) \\le \\delta(s, u) + w(u, v)", name: "Trekantulikheten for korteste veier", caption: "Gjelder for hver kant $(u, v)$ når det ikke finnes negative sykler nåbare fra $s$. Brukes i kontrollrunden til Bellman-Ford." },
        { type: "box", variant: "tip", title: "Hva Relax garanterer", blocks: [
          { type: "text", text: "Relax kan trygt kjøres når som helst, siden estimatet aldri blir feil. Men det blir bare riktig når $u.d$ allerede er riktig. Derfor handler alle algoritmene om **rekkefølgen** vi slakker kantene i." },
        ] },
      ],
    },
    {
      id: "dag",
      title: "DAG-Shortest-Paths",
      blocks: [
        { type: "text", text: "I en DAG kan vi løse problemet med dynamisk programmering. For $v \\ne s$ gjelder rekursjonen under, der minimum tas over alle inn-naboer $u$ av $v$. Delproblemene er $\\delta(s, u)$, og delinstansgrafen er grafen selv. Siden det ikke finnes sykler, terminerer rekursjonen." },
        { type: "formula", latex: "\\delta(s, v) = \\min_{(u, v) \\in E} \\{\\, \\delta(s, u) + w(u, v) \\,\\}, \\qquad \\delta(s, s) = 0", name: "Rekursjon for korteste vei i en DAG", caption: "Dette er dynamisk programmering. Bare de noder som kan nås fra $s$, får en endelig verdi. Resten har $\\delta = \\infty$." },
        { type: "pseudocode", title: "DAG-Shortest-Paths(G, w, s)", lines: [
          "topologically sort G",
          "Initialize-Single-Source(G, s)",
          "for each vertex u, in topologically sorted order",
          "    for each vertex v ∈ G.Adj[u]",
          "        Relax(u, v, w)",
        ], caption: "Den topologiske sorteringen sikrer at alle inn-kanter til $u$ er slakket før vi behandler $u$. Vi bruker ut-kanter (den som sprer informasjon, «reaching»), og ikke inn-kanter («pulling»). Det er ofte enklere å finne ut-naboer, og verdien $u.d$ er riktig når vi kommer til $u$." },
        { type: "figure", component: DagFigure, caption: "Egen DAG med én negativ kant (b–c) og én negativ kant (d–e). Den topologiske ordenen er a, b, c, d, e, og de fremhevede kantene er de som gir korteste vei til hver node. Verdiene er regnet ut av algoritmen." },
        { type: "box", variant: "theorem", title: "Korrekthet", blocks: [
          { type: "text", text: "**Påstand:** etter kjøringen er $v.d = \\delta(s, v)$ for alle $v$. **Bevis ved induksjon på den topologiske ordenen:** for $s$ er $s.d = 0 = \\delta(s, s)$. Noder som ikke kan nås fra $s$, får $\\infty$ og påvirker ingen andre. Anta at $x.d = \\delta(s, x)$ for alle noder før $u$. Alle inn-kanter $(x, u)$ er da slakket etter at $x$ er behandlet, og $u.d = \\min_x \\{x.d + w(x, u)\\}$. Med induksjonshypotesen er dette $\\min_x \\{\\delta(s, x) + w(x, u)\\} = \\delta(s, u)$ etter rekursjonen." },
        ] },
        { type: "table", head: ["Operasjon", "Antall", "Kjøretid"], rows: [
          ["Topologisk sortering", "1", "$\\Theta(V + E)$"],
          ["Initialize-Single-Source", "1", "$\\Theta(V)$"],
          ["Relax", "$E$ (én gang per kant)", "$\\Theta(E)$"],
          ["Totalt", "", "$\\Theta(V + E)$"],
        ], caption: "Hver kant relaxes nøyaktig én gang, så det er ingen kjøring som gjentas. Negative kanter spiller ingen rolle, fordi vi aldri trenger å gå tilbake." },
        { type: "formula", latex: "T_{\\text{DAG}} = \\Theta(V + E)", name: "Kjøretid for DAG-Shortest-Paths", caption: "Lineær i størrelsen på grafen, og den er den raskeste av de tre algoritmene." },
        { type: "example", title: "Dynamisk programmering i praksis (eksamen august 2023)", blocks: [
          { type: "text", text: "Oppgaven spør hvordan man finner avstanden fra $s$ til en node $v$ med rekursjon i en vektet rettet graf, og forventer eksponentiell tid. Svaret er at vi for hver inn-nabo $u$ finner avstanden rekursivt og legger til $w(u, v)$, og så velger minimum. Rekursjonen gjør samme delproblem mange ganger, så en memoisert versjon gir det samme som DAG-Shortest-Paths: hver node og hver kant er med én gang." },
        ] },
        { type: "example", title: "Hvordan øvingen bruker DAG-Shortest-Paths (øving 10, eksamen 2018H, oppgave 14)", blocks: [
          { type: "text", text: "Oppgaven gir en vektmatrise, og spør hvordan grafen ser ut, og hvilke $d$-verdier DAG-Shortest-Paths gir med node 1 som startnode. Løsningen tegner grafen fra matrisen, og fyller ut $d$-raden én kant om gangen i topologisk orden. Metoden er den samme som i figuren over, og vi kan kontrollere svaret ved å kjøre den for hånd." },
        ] },
      ],
    },
    {
      id: "bellman",
      title: "Bellman-Ford",
      blocks: [
        { type: "text", text: "En korteste enkel sti har høyst $|V| - 1$ kanter. Bellman-Ford slakker derfor alle kanter $|V| - 1$ ganger, i en fast rekkefølge. Etter $i$ gjennomganger er alle korteste veier med høyst $i$ kanter riktige. Hvis vi trenger flere gjennomganger, har vi en negativ sykel nåbar fra $s$." },
        { type: "pseudocode", title: "Bellman-Ford(G, w, s)", lines: [
          "Initialize-Single-Source(G, s)",
          "for i = 1 to |G.V| − 1",
          "    for each edge (u, v) ∈ G.E",
          "        Relax(u, v, w)",
          "for each edge (u, v) ∈ G.E",
          "    if v.d > u.d + w(u, v)",
          "        return false",
          "return true",
        ], caption: "Linje 2–4: $|V| - 1$ gjennomganger av alle kantene. Linje 5–7: én kontrollrunde. Finnes det en kant som kan slakkes, er det en negativ sykel nåbar fra $s$, og vi returnerer false. Ellers returnerer vi true, og estimatene er riktige." },
        { type: "figure", component: BellmanFordPassFigure, caption: "Fire noder, med kantene i en fast rekkefølge. I pass 1 får a en verdi via b, og c får riktig verdi i pass 2. Pass 3 endrer ingenting, men algoritmen gjør likevel alle |V| − 1 gjennomganger." },
        { type: "box", variant: "theorem", title: "Korrekthet, uten negative sykler", blocks: [
          { type: "text", text: "**Påstand:** hvis ingen negativ sykel er nåbar fra $s$, er $v.d = \\delta(s, v)$ for alle $v$ etter algoritmen, og den returnerer true. **Bevis:** ta en korteste vei $\\langle v_0, \\ldots, v_k \\rangle$ med $k \\le |V| - 1$. Ved induksjon på $i$ er $v_{i-1}.d = \\delta(s, v_{i-1})$ før pass $i$, så kanten $(v_{i-1}, v_i)$ gir $v_i.d = \\delta(s, v_i)$ i pass $i$, og den holder seg ved path-relaxation. Etter $|V| - 1$ pass er alle riktige. Da er trekantulikheten oppfylt for alle kanter, så kontrollrunden ikke finner noe, og returnerer true." },
        ] },
        { type: "box", variant: "theorem", title: "Korrekthet, med negativ sykel", blocks: [
          { type: "text", text: "Returnerer algoritmen false, finnes det en negativ sykel nåbar fra $s$. **Bevis:** anta at ingen negativ sykel er nåbar. Da er estimatene riktige etter $|V| - 1$ pass, og trekantulikheten holder for alle kanter. Kontrollrunden kan da ikke finne en kant som kan slakkes, så den ville ikke returnert false. Motsigelse." },
        ] },
        { type: "figure", component: NegativeCycleFigure, caption: "Sykelen a → b → a har vekt −2. Etter |V| − 1 = 2 pass synker a og b fortsatt, så kontrollrunden finner kanten (a, b) og returnerer false. Det finnes da ingen korteste vei til a og b." },
        { type: "table", head: ["Operasjon", "Antall", "Kjøretid"], rows: [
          ["Initialize-Single-Source", "1", "$\\Theta(V)$"],
          ["Gjennomgang av alle kanter", "$|V| - 1$", "$\\Theta(E)$ hver"],
          ["Kontrollrunde", "1", "$\\Theta(E)$"],
          ["Totalt", "", "$\\Theta(VE)$, $O(VE)$ i pensum"],
        ], caption: "Hele arbeidet er $|V| - 1$ runder med $E$ kanter, altså $O(VE)$. Å stoppe tidlig, når ingenting endres, forbedrer ikke verste tilfelle." },
        { type: "formula", latex: "T_{\\text{Bellman-Ford}} = O(VE)", name: "Kjøretid for Bellman-Ford", caption: "Bellman-Ford tåler negative kanter, men er langsommere enn Dijkstra og DAG-Shortest-Paths." },
        { type: "example", title: "Bellman-Ford med kø (eksamen desember 2024, oppgave 17)", blocks: [
          { type: "list", items: [
            "**Idé:** Klokland holder en prioritetskø med de nodene som har endret estimat. Hun henter ut den med lavest $v.d$, og slakker ut-kantene. Nye noder legges i køen.",
            "**Negative sykler:** algoritmen terminerer ikke. Hver runde rundt sykelen legger noder tilbake i køen, og estimatene synker uten slutt.",
            "**Uten negative kanter:** hver node tas ut én gang, akkurat som i Dijkstra. Da er kjøretiden $O(E \\lg V)$ med binærhaug, fordi hver kant gir én nedsettelsesoperasjon.",
            "**Generelt:** med negative sykler som ikke kan nås fra $s$, skader de ikke, men oppgaven antar at alle noder kan nås fra $s$.",
          ] },
        ] },
        { type: "example", title: "Hvor mange kanter må vi relaxe? (eksamen august 2024, oppgave 13)", blocks: [
          { type: "text", text: "Relax kjøres på alle kantene én gang, i en ukjent rekkefølge, og startestimatene er gitt i figuren. Oppgaven spør hva den minste og den største verdien for $5.d$ kan bli. Løsningsforslaget svarer $6$ og $7$. Det viser at én runde ikke gir riktige avstander når rekkefølgen er dårlig, men alle verdier er fortsatt øvre grenser for $\\delta$." },
        ] },
      ],
    },
    {
      id: "dijkstra",
      title: "Dijkstras algoritme",
      blocks: [
        { type: "text", text: "Dijkstra antar at alle kanter er ikke-negative. Ideen er at noden med lavest estimat er ferdig: den kan ikke bli kortere senere via en node som ikke er behandlet ennå, fordi kantene ikke er negative. Vi holder en mengde $S$ av ferdige noder, og en min-prioritetskø $Q$ med nøkkel $v.d$ for de gjenværende. Det er samme struktur som Prim, men nøkkelen er avstanden fra $s$, og ikke vekten på en enkelt kant." },
        { type: "pseudocode", title: "Dijkstra(G, w, s)", lines: [
          "Initialize-Single-Source(G, s)",
          "S = ∅",
          "Q = ∅",
          "for each vertex u ∈ G.V",
          "    Insert(Q, u)",
          "while Q ≠ ∅",
          "    u = Extract-Min(Q)",
          "    S = S ∪ {u}",
          "    for each vertex v ∈ G.Adj[u]",
          "        Relax(u, v, w)",
          "        if Relax decreased v.d",
          "            Decrease-Key(Q, v, v.d)",
        ], caption: "Linje 5–6: alle nodene settes inn i køen, og alle har nøkkel $\\infty$ bortsett fra $s$. Linje 7–8: noden med lavest estimat tas ut, og legges i $S$. Linje 9–12: ut-kantene slakkes, og naboene får ny nøkkel når estimatet synker. Lysarkene farger noden svart når den er ferdig behandlet, og ikke når den legges i $S$." },
        { type: "figure", component: DijkstraTraceFigure, caption: "Dijkstra på fem noder med positive kanter. Hver rad er et steg: noden med lavest estimat tas ut, og utkantene slakkes. Kolonnene er estimatene etter steget. Den siste raden er det endelige resultatet." },
        { type: "box", variant: "theorem", title: "Korrekthet (CLRS 22.6)", blocks: [
          { type: "text", text: "**Påstand:** ved hver start av løkken er $v.d = \\delta(s, v)$ for alle $v \\in S$. Når løkken er ferdig, er $S = V$, og da er alle estimatene riktige. **Initialisering:** $S$ er tom. **Vedlikehold:** la $u$ være noden med lavest $v.d$ i $Q$, og anta at $u.d \\ne \\delta(s, u)$. Ta en korteste vei fra $s$ til $u$, og la $y$ være den første noden på veien som ikke er i $S$, med forgjenger $x \\in S$. Da er $x.d = \\delta(s, x)$, så kanten $(x, y)$ ble slakket da $x$ ble behandlet, og $y.d = \\delta(s, y)$. Siden kantvektene er ikke-negative, er $\\delta(s, y) \\le \\delta(s, u)$. Da er $y.d = \\delta(s, y) \\le \\delta(s, u) \\le u.d \\le y.d$, og alt er likt. Det gir $u.d = \\delta(s, u)$, en motsigelse." },
        ] },
        { type: "figure", component: DijkstraNegativeFigure, caption: "Den negative kanten y → x bryter beviset: z tas ut med 3 før y er behandlet, og z får derfor en for høy verdi. Den korteste veien til z er 2." },
        { type: "box", variant: "pitfall", title: "Negative kanter", blocks: [
          { type: "text", text: "Med en negativ kant kan noden med lavest estimat få en lavere verdi senere, via en node som ikke er behandlet ennå. Det er akkurat det som skjer i figuren. Eksamen desember 2025, oppgave 11, ber om en presis forklaring på dette: det er ikke nok å si at valgene «blir gale», man må si at en node med lavest estimat fortsatt kan få et lavere estimat etter at andre noder er besøkt." },
        ] },
        { type: "table", head: ["Operasjon", "Antall", "Binærhaug", "Fibonacci-haug"], rows: [
          ["Initialisering", "1", "$O(V)$", "$O(V)$"],
          ["Insert", "$V$", "$O(\\lg V)$", "$O(1)$ amortisert"],
          ["Extract-Min", "$V$", "$O(\\lg V)$", "$O(\\lg V)$ amortisert"],
          ["Decrease-Key", "$\\le E$", "$O(\\lg V)$", "$O(1)$ amortisert"],
          ["Totalt", "", "$O(V \\lg V + E \\lg V)$", "$O(V \\lg V + E)$"],
        ], caption: "Hver node tas ut én gang, og hver kant gir høyst én Decrease-Key. Med binærhaug er totalen $O(V \\lg V + E \\lg V)$, som er $O(E \\lg V)$ for sammenhengende grafer. Pensum krever bare kjøretiden med Fibonacci-haug, ikke hvordan den fungerer." },
        { type: "formula", latex: "T_{\\text{Dijkstra}} = O(V \\lg V + E \\lg V) = O(E \\lg V)", name: "Kjøretid for Dijkstra med binærhaug", caption: "Med Fibonacci-haug blir det $O(V \\lg V + E)$." },
        { type: "example", title: "Rekkefølgen er avstandsrekkefølgen (øving 10, eksamen 2015H, oppgave 12)", blocks: [
          { type: "text", text: "Med positive kantvekter besøker Dijkstra nodene i stigende rekkefølge av avstand. Oppgaven gir avstandene $D = [0, 2, 3, 5, 8, 6, 9, 1, 7, 4]$, altså $D[7] = 1$, $D[1] = 2$, $D[2] = 3$ og så videre. Sorterer vi nodene etter $D$, får vi rekkefølgen $0, 7, 1, 2, 9, 3, 5, 8, 4, 6$, og det er svaret i løsningsforslaget." },
        ] },
        { type: "example", title: "Dijkstra med en ny prioritetskø (øving 10, eksamen 2018H, oppgave 13)", blocks: [
          { type: "list", items: [
            "**Oppgaven:** Lurvik har en kø som bygges i lineær tid, men Extract-Min koster $O(n^2)$ og Decrease-Key $O(n^3)$, der $n$ er antall elementer i køen. Hva er kjøretiden til Dijkstra?",
            "**Initialisering og bygging:** $O(V)$ hver. Linje 5 kjøres $V$ ganger, med $O(V^2)$ hver gang, og gir $O(V^3)$.",
            "**Relax:** linje 7–10 kjøres $O(E)$ ganger totalt, og hver Decrease-Key koster $O(V^3)$. Det gir $O(EV^3)$.",
            "**Totalt:** $O(V^3 + EV^3) = O(EV^3)$. Dijkstra er like riktig, og det er bare køen som er tregere.",
          ] },
        ] },
        { type: "example", title: "Korteste vei med sannsynligheter (CLRS 22.3-7, øving 10)", blocks: [
          { type: "text", text: "En pingvin vil reise mellom kolonier, og overleve hvert hopp med en sannsynlighet $p$. Vi vil maksimere produktet av sannsynlighetene. Siden $\\lg(x \\cdot y) = \\lg x + \\lg y$, og $-\\lg$ er minkende, setter vi $w(u, v) = -\\lg p(u, v)$. Maksimalt produkt blir da minimal sum, altså korteste vei. Vektene er ikke-negative når $p \\le 1$, så Dijkstra kan brukes." },
          { type: "table", head: ["Sannsynlighet $p$", "$0.2$", "$0.4$", "$0.8$", "$0.7$", "$0.9$", "$0.1$", "$0.3$"], rows: [
            ["$w = -\\lg p$", "2.32", "1.32", "0.32", "0.51", "0.15", "3.32", "1.74"],
          ], caption: "Vektene er regnet ut av $-\\lg p$. Eksempel: $-\\lg 0.2 = \\lg 5 \\approx 2.32$." },
        ] },
        { type: "example", title: "Lengste felles sti i to DAG-er (øving 10, eksamen 2021H, oppgave 10)", blocks: [
          { type: "text", text: "To rettede, asykliske grafer $G$ og $G'$ er gitt, og vi vil finne den lengste stien som finnes i begge. Bare noder og kanter som er i begge grafene er med. Den nye grafen er en DAG, og vi kan løse problemet med DAG-Shortest-Paths der vektene er negert, eller med dynamisk programmering. Det er den samme koblingen mellom DAG og dynamisk programmering som i J10." },
        ] },
      ],
    },
    {
      id: "sammenligning",
      title: "Sammenligning: når bruker vi hva?",
      blocks: [
        { type: "table", head: ["", "DAG-Shortest-Paths", "Bellman-Ford", "Dijkstra"], rows: [
          ["Krav", "Grafen er en DAG", "Ingen", "Ikke-negative kanter"],
          ["Negative kanter", "Ja", "Ja", "Nei: kan gi feil svar"],
          ["Negative sykler", "Finnes ikke", "Oppdages, nåbare fra $s$", "Oppdages ikke"],
          ["Rekkefølge", "Topologisk", "Alle kanter, $|V| - 1$ ganger", "Lavest estimat først"],
          ["Kjøretid", "$\\Theta(V + E)$", "$O(VE)$", "$O(E \\lg V)$ med binærhaug"],
        ], caption: "Alle tre slakker kanter med Relax. Forskjellen er rekkefølgen, og dermed hvor mange ganger hver kant behøver å bli slakket." },
        { type: "list", items: [
          "**Uvektet graf:** BFS gir korteste vei i $O(V + E)$. Det er Dijkstra med alle vekter lik 1.",
          "**Dijkstra og Bellman-Ford:** Dijkstra er et spesialtilfelle av Bellman-Ford når kantene er ikke-negative. Da trenger vi bare én relaksjon per kant, fordi noden med lavest estimat allerede er riktig.",
          "**Dijkstra og Prim:** de har samme struktur, med en min-prioritetskø og ferdige noder. Dijkstra prioriterer etter avstand fra $s$, og Prim etter den letteste kanten fra treet.",
        ] },
      ],
    },
    {
      id: "oving",
      title: "Øv på øvings- og eksamensoppgaver",
      blocks: [
        { type: "box", variant: "tip", title: "Oppskrift for en korteste-vei-oppgave på eksamen", blocks: [
          { type: "list", ordered: true, items: [
            "**Modeller:** hva er nodene, kantene og vektene? Hva er $s$ og $t$, og er det én til alle, alle til én, eller alle til alle?",
            "**Velg algoritme:** er grafen en DAG, bruk DAG-Shortest-Paths. Har den negative kanter eller sykler, bruk Bellman-Ford. Ellers, bruk Dijkstra.",
            "**Vis hvordan algoritmen virker:** skriv estimatene etter hvert steg, eller etter hver gjennomgang, og marker hva som endres.",
            "**Argumenter for korrekthet:** Dijkstra med ikke-negative kanter, Bellman-Ford med $|V| - 1$ gjennomganger, og DAG med topologisk orden.",
            "**Kjøretid:** $\\Theta(V + E)$, $O(VE)$ eller $O(E \\lg V)$. Husk tiden for å bygge grafen.",
          ] },
        ] },
        { type: "example", title: "Hvilken node velger Dijkstra? (eksamen august 2023, oppgave 4)", blocks: [
          { type: "text", text: "Dijkstra velger den gjenværende noden med lavest estimat $v.d$. Hvilken av dem som velges ved likhet, er en implementasjonsdetalj. Det er riktig å si at den velges blant de gjenværende nodene, og ikke de som er ferdige." },
        ] },
        { type: "example", title: "Dijkstra med sti-verdier (eksamen august 2026, oppgave 8)", blocks: [
          { type: "text", text: "Dijkstra kjøres på en graf med startnode $s$, og vi skal finne alle verdiene $c.d$ får. Løsningen er $\\infty$, $17$, $7$. Nodene tas ut i rekkefølgen $s$, $b$, $a$, $c$, med nøkler $0$, $1$, $3$, $7$. Først settes $c.d$ til $17$ fra $b$, og så til $7$ fra $a$, der $3 + 4 = 7$ er kortere." },
        ] },
        { type: "example", title: "Hvorfor Dijkstra svikter med negative kanter (eksamen desember 2025, oppgave 11)", blocks: [
          { type: "text", text: "Løsningen må forklare at noden med lavest estimat fortsatt kan få et lavere estimat senere, etter at andre noder er besøkt. Eksemplet i figuren over viser det: z får 3 før y er behandlet, men korteste vei er 2. En forklaring som bare sier «valgene blir gale» gir ikke full uttelling." },
        ] },
        { type: "example", title: "Hva er riktig om Bellman-Ford? (eksamen desember 2024, oppgave 17)", blocks: [
          { type: "text", text: "Med negative sykler terminerer kø-varianten ikke. Uten negative kanter får vi $O(E \\lg V)$, fordi hver node tas ut én gang. Svaret må begrunnes, og ikke bare nevne tallet." },
        ] },
        { type: "box", variant: "pitfall", title: "Ikke forveksle med minimalt spenntre", blocks: [
          { type: "text", text: "Eksamen desember 2023, oppgave 10, ser ut som en korteste-vei-oppgave, men svaret er et **minimalt spenntre**. Når vi skal minimere summen av stiene, og delene der de overlapper telles én gang, får vi et spenntre med minst mulig kantsum. Løses med Prim eller Kruskal (forelesning 9)." },
        ] },
        { type: "quiz", items: [
          { question: "Hva er forskjellen mellom korteste enkle vei og korteste vei?", answer: "En korteste vei kan ikke finnes når en negativ sykel nåbar fra $s$ ligger på veien. En korteste enkel vei finnes alltid når det finnes en vei, men den er NP-hard å finne generelt." },
          { question: "Hva er Relax?", answer: "Hvis $v.d > u.d + w(u, v)$, settes $v.d = u.d + w(u, v)$ og $v.\\pi = u$. Estimatet senkes, og aldri økes." },
          { question: "Hvorfor kan vi bruke en topologisk orden i DAG-Shortest-Paths?", answer: "Når vi behandler $u$, er alle inn-kanter til $u$ allerede slakket, og $u.d = \\delta(s, u)$ er riktig. Det er induksjon på ordenen, og dynamisk programmering." },
          { question: "Hvor mange gjennomganger gjør Bellman-Ford, og hvorfor?", answer: "$|V| - 1$ gjennomganger av alle kanter, fordi en korteste enkel sti har høyst $|V| - 1$ kanter. Deretter kontrollerer vi om noe fortsatt kan slakkes." },
          { question: "Hva betyr false fra Bellman-Ford?", answer: "Det finnes en negativ sykel nåbar fra $s$. Da er de korteste veiene ikke definert." },
          { question: "Hvorfor krever Dijkstra ikke-negative kanter?", answer: "Noden med lavest estimat antas å være riktig når den tas ut, men en negativ kant kan senke estimatet senere. Beviset bruker at $\\delta(s, y) \\le \\delta(s, u)$ for en node $y$ på veien." },
          { question: "Hva er kjøretiden til Dijkstra med binærhaug og med Fibonacci-haug?", answer: "$O(V \\lg V + E \\lg V) = O(E \\lg V)$ med binærhaug, og $O(V \\lg V + E)$ med Fibonacci-haug." },
          { question: "Hvordan finner vi korteste vei fra alle noder til én node?", answer: "Snu alle kantene, og løs single-source fra den noden. Er grafen uvektet, er BFS nok (eksamen august 2024, oppgave 7)." },
          { question: "Hvordan gjør vi om «størst mulig produkt av sannsynligheter» til et korteste-vei-problem?", answer: "Vi setter $w(u, v) = -\\lg p(u, v)$. Det er ikke-negativt når $p \\le 1$, og størst produkt blir minst sum." },
        ] },
      ],
    },
  ],
};
