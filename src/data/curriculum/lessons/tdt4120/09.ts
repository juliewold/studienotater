import type { Lesson } from "../types";
import { ArbitraryOrderFigure, DisjointSetFigure, KruskalFigure, PrimFigure, SafeEdgeFigure } from "./figures09";

const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view`, kind: "drive" as const });

// Based on the pensum booklet (lecture 9, goals I1–I6, chapters 19.1, 19.3 and 21), the lecture slides, CLRS chapter 21 and
// exercise 9 with its solution, and the exams from December 2023 to August 2026 (with solutions). Earlier exams are
// used as referenced in the solution to exercise 9. The existing lecture 9 note in Studienotater was not used as support.
export const lesson: Lesson = {
  subjectId: "tdt4120",
  unitId: "09",
  reviewed: "2026-11-03",
  summary: "Vi har en sammenhengende, urettet graf med vekter på kantene, og vil koble sammen alle nodene med den billigste mengden kanter. Svaret er et **minimalt spenntre**: et tre som dekker alle nodene med lavest mulig vektsum. Vi bygger det grådig, én kant om gangen, og bare **trygge kanter** er lov: en kant er trygg hvis den er den letteste over et snitt som respekterer kantene vi har valgt så langt. **Kruskal** sorterer kantene og legger til den letteste som ikke lager en sykel, og sjekker det med **disjunkte mengder**. **Prim** vokser ett tre fra en startnode og legger til den letteste kanten ut fra treet. Begge tar $O(E \\lg V)$ med binærhaug.",
  overview: [
    "**Spenntrær og minimale spenntrær (I2):** et spenntre er en sammenhengende, asyklisk spenngraf, og har alltid $|V| - 1$ kanter. Et **minimalt** spenntre har lavest $w(T)$. Med unike vekter er det ett minimalt spenntre.",
    "**Generic-MST (I3):** vi holder en mengde $A$ som alltid er en del av et minimalt spenntre, og legger til en **trygg** kant om gangen til $A$ er et spenntre.",
    "**Trygge kanter (I4):** er $A$ en del av et minimalt spenntre, og $(S, V − S)$ er et snitt som respekterer $A$, så er en **lett kant** over snittet trygg (teorem 21.1).",
    "**Disjunkte mengder (I1):** en skog med foreldrepekere der roten er representanten. **Make-Set**, **Find-Set** (med stikomprimering) og **Union** (med rang). $m$ operasjoner tar $O(m\\,\\alpha(n))$.",
    "**MST-Kruskal (I5):** sorter kantene etter vekt, og legg til kanten $(u, v)$ hvis $\\textit{Find-Set}(u) \\ne \\textit{Find-Set}(v)$. $O(E \\lg V)$.",
    "**MST-Prim (I6):** en min-prioritetskø med nøkkel $v.\\mathit{key}$ = lettest kant fra treet. Med binærhaug $O(E \\lg V)$, med Fibonacci-haug $O(E + V \\lg V)$.",
  ],
  keyFormulas: [
    { latex: "w(T) = \\sum_{(u, v) \\in T} w(u, v)", label: "Vekten av et spenntre $T$. Et minimalt spenntre har lavest $w(T)$" },
    { latex: "|T| = |V| - 1", label: "Et spenntre har alltid $|V| - 1$ kanter" },
    { latex: "(u, v) \\text{ lett over } (S, V - S) \\implies (u, v) \\text{ trygg}", label: "Trygg kant, når snittet respekterer $A$ (CLRS teorem 21.1)" },
    { latex: "O(m\\,\\alpha(n))", label: "$m$ operasjoner på disjunkte mengder med union by rank og stikomprimering. $\\alpha$ er den inverse Ackermann-funksjonen" },
    { latex: "\\alpha(n) \\le 4 \\quad \\text{for alle } n \\le 16\\,512", label: "I praksis er $\\alpha(n)$ aldri større enn 4 (lysarkene)" },
    { latex: "T_{\\text{Kruskal}} = O(E \\lg E) = O(E \\lg V)", label: "Sortering dominerer. Med $|E| < |V|^2$ er $\\lg E < 2 \\lg V$" },
    { latex: "T_{\\text{Prim}} = O(E \\lg V)", label: "Kjøretid for MST-Prim med binærhaug" },
    { latex: "T_{\\text{Prim}} = O(E + V \\lg V)", label: "Kjøretid for MST-Prim med Fibonacci-haug" },
  ],
  goals: [
    "Forstå skog-implementasjonen av disjunkte mengder, inkludert Connected-Components **(I1)**",
    "Vite hva spenntrær og minimale spenntrær er **(I2)**",
    "Forstå Generic-MST **(I3)**",
    "Forstå når og hvorfor lette kanter er trygge kanter **(I4, !)**",
    "Forstå MST-Kruskal **(I5)**",
    "Forstå MST-Prim, inkludert kjøretid med Fibonacci-haug **(I6)**",
  ],
  concepts: [
    "tree", "rooted-tree", "spanning-tree", "minimum-spanning-tree", "greedy-algorithm", "greedy-choice-property", "optimal-substructure",
    "exchange-argument", "priority-queue", "disjoint-set-forest", "union-find", "safe-edge", "kruskal-algorithm", "prim-algorithm",
  ],
  notes: [{ slug: "forelesning-9-minimale-spenntre", label: "Forelesning 9 - Minimale spenntrær" }],
  sources: [
    drive("Pensumhefte 2026, forelesning 9", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
    drive("Forelesning 9 (lysark)", "1eNDqTQ8ERWHBvQtuNGV1J1sjc7DhhVah"),
    drive("Øving 9: Minimale spenntrær", "1VWjZwHR8sM0aZHTgCDOKNqRl6Nwa-ZZw"),
    drive("Løsningsforslag øving 9", "1TsPVhXVyVgxk96o-pzMJTev4DuEpKlIv"),
    drive("Eksamen august 2026 med løsningsforslag", "1MhSk2qelJNYMKZjaj2O7mqzzYtryB9vr"),
    drive("Eksamen desember 2025 med løsningsforslag", "1NdJNYFLTh20uLDmtG1W2oUa_3HVZllir"),
    drive("Eksamen august 2025 med løsningsforslag", "1B5E6tItKtjigNSfNEwm9GIBC3pdbWlDC"),
    drive("Eksamen desember 2024 med løsningsforslag", "1Ffv3IAteloAL1jjcu0k2MQKfJ9nVtgrb"),
    drive("Eksamen august 2024 med løsningsforslag", "10gHedZOudM9XBcB8WuEw-agDlCQKdVC4"),
    drive("Eksamen desember 2023 med løsningsforslag", "1R6BvBaHHIm2BfMmp1XHh-Xg8QQpdM0cN"),
    { label: "Forelesning 9 - Minimale spenntrær", url: "forelesning-9-minimale-spenntre", kind: "note" },
  ],
  sections: [
    {
      id: "spenntrær",
      title: "Spenntrær og minimale spenntrær",
      blocks: [
        { type: "box", variant: "definition", title: "Spenntre og minimalt spenntre (I2)", blocks: [
          { type: "list", items: [
            "**Spenngraf** (spanning subgraph): en delgraf med **samme nodesett** som $G$.",
            "**Spennskog** (spanning forest): en **asyklisk** spenngraf.",
            "**Spenntre** (spanning tree): en **sammenhengende** spennskog. Et spenntre på $|V|$ noder har $|V| - 1$ kanter.",
            "**Minimalt spenntre:** et spenntre $T$ med minst mulig vektsum $w(T) = \\sum_{(u, v) \\in T} w(u, v)$. Vekter kalles også lengder eller kostnader.",
          ] },
        ] },
        { type: "text", text: "Vi antar at $G$ er **sammenhengende** og **urettet**. Ellers finnes det ikke noe spenntre, og Kruskal gir i stedet en minimal spennskog. Lysarkene: med positive vekter blir en løsning $T$ alltid asyklisk, så vi trenger bare minimere vekten. Generelt tillates negative vekter, men da må $T$ være asyklisk." },
        { type: "formula", latex: "w(T) = \\sum_{(u, v) \\in T} w(u, v), \\qquad |T| = |V| - 1", name: "Vekt og antall kanter i et spenntre", caption: "Et minimalt spenntre er det spenntreet med lavest $w(T)$. Antall kanter følger av at et spenntre er et tre på alle nodene." },
        { type: "example", title: "Hvor mange minimale spenntrær? (øving 9, spm. 3–6)", blocks: [
          { type: "list", items: [
            "**Unike vekter (spm. 3):** har alle kantene ulik vekt, finnes **nøyaktig ett** minimalt spenntre. Beviset: anta to ulike, $T_1$ og $T_2$, og la $e_j$ og $e'_j$ være den første kanten, sortert etter vekt, der de skiller seg, med $w(e_j) < w(e'_j)$. Legger vi $e_j$ til i $T_2$, får vi en sykel. Å fjerne en tyngre kant på sykelen gir et lettere spenntre enn $T_2$, en motsigelse.",
            "**Noen ganger ett, andre ganger flere (spm. 4):** en enkelt kant $A$–$B$ har bare ett spenntre, nemlig seg selv. En trekant med like vekter har tre minimale spenntrær. Med like vekter kan det altså være mange.",
            "**Lett kant i en sykel (spm. 5):** er $(u, v)$ **strengt** lettere enn alle andre kanter i en sykel, må den være med i **alle** minimale spenntrær. Hvis den ikke er med i et spenntre $T$, legger vi den til, sletter den tyngste kanten på sykelen, og får et lettere spenntre.",
            "**Tyngste kant (spm. 6):** den tyngste kanten er noen ganger med i et minimalt spenntre og noen ganger ikke. Den er ikke med i ett eksempel, men er med i alle minimale spenntrær i et annet.",
          ] },
        ] },
      ],
    },
    {
      id: "disjunkte",
      title: "Disjunkte mengder: skog-implementasjonen",
      blocks: [
        { type: "text", text: "Kruskal må vite om to noder allerede er i samme delvise løsning, og slå sammen to slike mengder. Vi bruker en **skog av disjunkte mengder** (disjoint-set forest): hver mengde er et tre, roten er representanten, og hver node har en foreldrepeker $x.p$. Hver rot har dessuten en **rang**, som er en øvre grense for høyden til noden." },
        { type: "pseudocode", title: "Skog-implementasjonen (CLRS 19.3)", lines: [
          "Make-Set(x)",
          "    x.p = x",
          "    x.rank = 0",
          "Find-Set(x)",
          "    if x ≠ x.p",
          "        x.p = Find-Set(x.p)",
          "    return x.p",
          "Link(x, y)",
          "    if x.rank > y.rank",
          "        y.p = x",
          "    else x.p = y",
          "        if x.rank == y.rank",
          "            y.rank = y.rank + 1",
          "Union(x, y)",
          "    Link(Find-Set(x), Find-Set(y))",
        ], caption: "Make-Set lager en mengde med én node. Find-Set går opp til roten og setter alle nodene på stien til å peke direkte på den: **stikomprimering** (path compression). Link tar to røtter, og den med høyest rang blir forelder, så trærne holder seg lave (**union by rank**). Union kobler sammen representantene. Rangen oppdateres bare i Link, ikke i Find-Set." },
        { type: "figure", component: DisjointSetFigure, caption: "Union(1, 2), Union(3, 4) og Union(1, 3) gir treet til venstre. Find-Set(1) går 1 → 2 → 4 og setter 1 direkte under 4 til høyre. Roten 4 har fortsatt rang 2, men høyden er nå 1. Det er nettopp derfor rang bare er en øvre grense for høyden." },
        { type: "box", variant: "theorem", title: "Kjøretid: O(m α(n))", blocks: [
          { type: "text", text: "Med union by rank og stikomprimering tar $m$ operasjoner på $n$ elementer $O(m\\,\\alpha(n))$, der $\\alpha$ er den inverse Ackermann-funksjonen. Lysarkene viser verdiene: $\\alpha(n) = 0$ for $n \\le 2$, $1$ for $n = 3$, $2$ for $4 \\le n \\le 7$, $3$ for $8 \\le n \\le 2047$ og $4$ for $2048 \\le n \\le 16\\,512$. Kruskal og Prim bruker altså praktisk talt konstant tid per operasjon." },
        ] },
        { type: "formula", latex: "O(m\\,\\alpha(n))", name: "Disjunkte mengder med union by rank og stikomprimering", caption: "$m$ operasjoner på $n$ elementer. Den inverse Ackermann-funksjonen $\\alpha$ er i praksis konstant." },
        { type: "box", variant: "pitfall", title: "Rang er ikke det samme som høyde", blocks: [
          { type: "text", text: "Rangen er en **øvre grense** for høyden til noden, men ikke alltid lik den. Find-Set oppdaterer foreldrepekerne, men ikke rangen (øving 9, spm. 2). Stikomprimering endrer også ikke trestrukturen utenom stien: andre noder i treet kan ha en annen forelder enn $x.p$ etter et kall. Eksamen desember 2025, oppgave 7, spør nettopp hva som skjer med foreldrepekerne: alle på stien opp til roten peker etterpå direkte på roten." },
        ] },
        { type: "list", items: [
          "**Connected-Components(G):** gjør hver node til en egen mengde med Make-Set, og slå sammen to noder med Union for hver kant $(u, v)$ der $\\textit{Find-Set}(u) \\ne \\textit{Find-Set}(v)$. Etterpå er nodene i samme komponent nøyaktig de med samme representant.",
          "**Same-Component(u, v):** returner sann hvis $\\textit{Find-Set}(u) = \\textit{Find-Set}(v)$. Brukes bare etter Connected-Components, og er et alternativ til DFS når nye kanter kan dukke opp underveis (lysarkene).",
        ] },
        { type: "example", title: "Disjunkte mengder i øvingen (øving 9, spm. 9 og 10)", blocks: [
          { type: "list", items: [
            "**Institusjoner (spm. 9):** å slå sammen institusjoner er en Union av to mengder, og oppslag av institusjonens navn er en Find-Set. Løsningsforslaget viser også en ordbokversjon som lagrer en peker per institusjon.",
            "**Klynger (spm. 10):** kjør Kruskal, og stopp når vi har $k$ disjunkte mengder. Hvert union reduserer antallet mengder med én, så etter $n - k$ union har vi $k$ klynger. Her er Kruskal ikke nødvendig: andre minimale-spenntre-algoritmer gir det samme.",
          ] },
        ] },
      ],
    },
    {
      id: "generisk",
      title: "Generisk MST og trygge kanter",
      blocks: [
        { type: "text", text: "Grådighet fungerer her: vi utvider en partiell løsning gradvis. Invariant: $A$ er en delmengde av et minimalt spenntre. Hver steg legger vi til en **trygg** kant, og når $A$ er et spenntre, er vi ferdige. Det er akkurat grådighetsegenskapen fra forelesning 7, nå for et snitt." },
        { type: "pseudocode", title: "Generic-MST(G, w)", lines: [
          "A = ∅",
          "while A does not form a spanning tree",
          "    find an edge (u, v) that is safe for A",
          "    A = A ∪ {(u, v)}",
          "return A",
        ], caption: "Linje 1: den tomme mengden oppfyller invarianten. Linje 3: det grådige valget, der vi må vise at kanten er trygg. Linje 4: etter hvert steg er $A$ fortsatt en del av et minimalt spenntre. Når $A$ er et spenntre, er den et minimalt spenntre." },
        { type: "box", variant: "definition", title: "Snitt, respekterer, lett og trygg (I4)", blocks: [
          { type: "list", items: [
            "**Snitt** $(S, V − S)$: en oppdeling av nodene i to mengder.",
            "**Respekterer** $A$: ingen kant i $A$ krysser snittet. Alle kanter i $A$ har begge endene på samme side.",
            "**Lett kant over snittet:** en kant med lavest vekt blant kantene som krysser snittet. Den trenger ikke være lettest blant **alle** kanter i grafen.",
            "**Trygg kant for $A$:** en kant som kan legges til $A$ uten at invarianten brytes, altså er med i et minimalt spenntre som inneholder $A$.",
          ] },
        ] },
        { type: "box", variant: "theorem", title: "En lett kant over et respektert snitt er trygg (CLRS teorem 21.1)", blocks: [
          { type: "text", text: "La $G$ være sammenhengende med vekter, $A$ en delmengde av et minimalt spenntre, $(S, V − S)$ et snitt som respekterer $A$, og $(u, v)$ en lett kant over snittet. Da er $(u, v)$ trygg for $A$." },
          { type: "text", text: "**Bevis:** la $T$ være et minimalt spenntre som inneholder $A$. Hvis $(u, v) \\in T$, er vi ferdige. Ellers legger vi $(u, v)$ til $T$. Det lager en sykel, og sykelen krysser snittet minst to ganger. Det finnes altså en annen kant $(x, y) \\in T$ over snittet. Den er ikke i $A$, siden $A$ respekterer snittet. Fordi $(u, v)$ er lett, er $w(u, v) \\le w(x, y)$. Da er $T' = T − \\{(x, y)\\} \\cup \\{(u, v)\\}$ et spenntre med $w(T') \\le w(T)$, altså også minimalt, og $T'$ inneholder $A \\cup \\{(u, v)\\}$." },
          { type: "text", text: "**Korollar 21.2:** er $C$ et tre i skogen $(V, A)$, og $(u, v)$ er en lett kant som forbinder $C$ med et annet tre, er $(u, v)$ trygg. Det er dette Kruskal og Prim bruker, med henholdsvis snitt rundt treet og snitt rundt én komponent." },
        ] },
        { type: "figure", component: SafeEdgeFigure, caption: "CLRS-grafen (figur 21.1, med vektene på kantene). Snittet respekterer A, og c–d er den letteste kanten over snittet. Den er derfor trygg. Kanten a–h krysser også snittet, men er tyngre enn c–d, og teorem 21.1 garanterer bare den letteste." },
        { type: "example", title: "Hva er riktig om trygge kanter? (øving 9, spm. 8 og 20)", blocks: [
          { type: "list", items: [
            "**Spm. 8:** kanten som legges til, må ikke lage en sykel med $A$, og den må binde sammen to noder på ulike sider av et snitt som respekterer $A$.",
            "**Spm. 20:** en trygg kant kan finnes på to måter. Vi kan dele komponentene i to mengder, og velge den letteste kanten mellom dem. Eller vi kan velge en vilkårlig komponent $C$, og den letteste kanten ut av $C$.",
          ] },
        ] },
        { type: "formula", latex: "(u, v) \\text{ lett over } (S, V - S), \\; A \\text{ respekterer snittet} \\implies (u, v) \\text{ trygg for } A", name: "Trygg kant", caption: "Teorem 21.1 i CLRS. Beviset bytter ut en tyngre kant over snittet i et minimalt spenntre som inneholder $A$." },
        { type: "box", variant: "pitfall", title: "Lett over snittet, ikke lettest av alle", blocks: [
          { type: "list", items: [
            "**Kanten må ikke være lettest blant alle kanter som ikke er i $A$.** Noen av dem lager sykler med $A$, og det holder at kanten er lettest over det valgte snittet.",
            "**Snittet må respektere $A$,** med mindre kanten er **strengt** lettere enn alle andre over snittet. Eksamen desember 2024, oppgave 12, spør om dette.",
          ] },
        ] },
      ],
    },
    {
      id: "kruskal",
      title: "Kruskals algoritme",
      blocks: [
        { type: "text", text: "Kruskal velger den letteste kanten som ikke lager en sykel. Hver komponent i $A$ er et partielt spenntre. En kant som forbinder to ulike komponenter er den letteste over snittet rundt en komponent, og er derfor trygg (korollar 21.2). En kant mellom to noder i samme komponent lager en sykel, og hoppes over. Lysarkenes formulering: «en kant med minimal vekt blant de gjenværende er trygg så lenge den ikke danner sykler»." },
        { type: "pseudocode", title: "MST-Kruskal(G, w)", lines: [
          "A = ∅",
          "for each vertex v ∈ G.V",
          "    Make-Set(v)",
          "sort the edges of G.E by weight w",
          "for each edge (u, v) ∈ G.E, in order of weight",
          "    if Find-Set(u) ≠ Find-Set(v)",
          "        A = A ∪ {(u, v)}",
          "        Union(u, v)",
          "return A",
        ], caption: "Linje 1–3: hver node er et eget partielt spenntre. Linje 4: sorteringen gir den grådige rekkefølgen. Linje 5–8: ulike komponenter betyr at kanten kan legges til uten sykel, og de to komponentene slås sammen. Linje 9: resultatet er en minimal spennskog, og er et spenntre når grafen er sammenhengende. Ved en usammenhengende graf vokser ikke Prim over flere komponenter, mens Kruskal finner en minimal spennskog." },
        { type: "figure", component: KruskalFigure, caption: "Kruskal på CLRS-grafen: kantene i stigende vekt. Den første kanten som lager en sykel er g–i (6), fordi g og i da allerede er i samme komponent. Totalvekten blir 37, med 8 kanter (|V| − 1 = 8)." },
        { type: "table", head: ["Operasjon", "Antall", "Kjøretid"], rows: [
          ["Make-Set", "$V$", "$O(1)$"],
          ["Sortering", "1", "$O(E \\lg E) = O(E \\lg V)$"],
          ["Find-Set", "$O(E)$", "$O(E\\,\\alpha(V))$ samlet, med disjunkte mengder"],
          ["Union", "$O(V)$", "$O(V\\,\\alpha(V))$ samlet"],
        ], caption: "Lysarkene: Union utføres egentlig bare $|V| − 1$ ganger, men vi bruker grovt anslag. Med $|E| < |V|^2$ er $\\lg E < 2 \\lg V$, så $O(E \\lg E) = O(E \\lg V)$. Totalt $O(E \\lg V)$." },
        { type: "formula", latex: "T_{\\text{Kruskal}} = O(E \\lg V)", name: "Kjøretid for MST-Kruskal", caption: "Sorteringen dominerer. Med $|E| < |V|^2$ er $\\lg E < 2 \\lg V$, så vi kan skrive $O(E \\lg V)$." },
        { type: "example", title: "Den femte kanten i Kruskal (øving 9, spm. 1)", blocks: [
          { type: "text", text: "Oppgaven spør hvilken kant som blir den femte som legges til i MST-Kruskal, på en graf i figuren (eksamen 2016H, oppgave 14). Løsningsforslaget svarer kanten (1, 5). Metoden er den samme for enhver graf: sorter kantene, og tell de som legges til. Hopp over dem som lager en sykel, og den femte som legges til, er svaret." },
        ] },
        { type: "example", title: "Minimal spennskog og teleportasjon (eksamen august 2024, oppgave 2, og august 2025, oppgave 8)", blocks: [
          { type: "list", items: [
            "**Usammenhengende graf (aug. 2024, oppg. 2):** MST-Kruskal velger alltid den billigste gjenværende kanten som ikke lager sykel, uansett hvor den ligger. Den finner derfor en minimal spennskog med ett tre per komponent. MST-Prim vokser ett tre fra én startnode og kommer aldri over til en annen komponent.",
            "**Teleportasjon (aug. 2025, oppg. 8):** å koble sammen alle landsbyene billigst mulig er et minimalt spenntre, løst i $O(E \\lg V)$ med Prim eller Kruskal. Å alltid teleportere til nærmeste ubesøkte landsby tilsvarer Prim gjort manuelt.",
          ] },
        ] },
        { type: "example", title: "Maksimalt spenntre (øving 9, spm. 11 og 12)", blocks: [
          { type: "list", items: [
            "**Skift fortegn:** et minimalt spenntre med vektene $-w$ er et maksimalt spenntre med $w$. Kjør derfor Kruskal eller Prim på $-w$.",
            "**Sorter synkende:** en Kruskal som sorterer kantene synkende gir et maksimalt spenntre direkte. Løsningsforslaget viser at algoritmen bare bruker rekkefølgen, ikke verdiene, så resultatet blir det samme.",
          ] },
        ] },
        { type: "example", title: "Minimal kantsum fra én node (eksamen desember 2023, oppgave 10)", blocks: [
          { type: "text", text: "Vi vil velge stier fra startnoden $s$ til alle andre, så overlappende deler telles bare én gang, og summen blir minst mulig. Det er å finne en delgraf som kobler $s$ til alle andre med minst mulig kantsum. Det er et minimalt spenntre, og kan finnes med Prim eller Kruskal." },
        ] },
      ],
    },
    {
      id: "prim",
      title: "Prims algoritme",
      blocks: [
        { type: "text", text: "Prim vokser ett tre fra startnoden $r$. Hvert steg legger vi til den letteste kanten fra treet til en node utenfor. Snittet er (treet, resten av grafen), og treet respekterer $A$ hele tiden. Den letteste kanten over snittet er trygg. Prims algoritme ble først beskrevet av Jarník i 1930, og Prim publiserte den i 1957." },
        { type: "pseudocode", title: "MST-Prim(G, w, r)", lines: [
          "for each u ∈ G.V",
          "    u.key = ∞",
          "    u.π = nil",
          "r.key = 0",
          "Q = ∅",
          "for each u ∈ G.V",
          "    Insert(Q, u)",
          "while Q ≠ ∅",
          "    u = Extract-Min(Q)",
          "    for each v ∈ G.Adj[u]",
          "        if v ∈ Q and w(u, v) < v.key",
          "            v.π = u",
          "            v.key = w(u, v)",
          "            Decrease-Key(Q, v, w(u, v))",
        ], caption: "Linje 1–4: nøkkel $\\infty$ overalt, og startnoden $r$ får nøkkel 0. Linje 5–7: alle nodene legges i køen fra starten, slik boka gjør det. Linje 9: den noden nærmest treet tas ut. Linje 10–14: naboene som fortsatt er i køen, får bedre nøkkel hvis kanten fra $u$ er lettere, og forgjengeren peker til $u$. Forgjengerne danner det minimale spenntreet til slutt." },
        { type: "figure", component: PrimFigure, caption: "MST-Prim fra node a på CLRS-grafen. Hver node er nummerert i den rekkefølgen den tas ut av køen. Nøkkelen er den letteste kanten fra treet, og når den oppdateres, endres forgjengeren. Totalvekten er 37, som for Kruskal." },
        { type: "table", head: ["Operasjon", "Antall", "Binærhaug", "Fibonacci-haug"], rows: [
          ["Insert", "$V$", "$O(\\lg V)$", "$O(1)$ amortisert"],
          ["Extract-Min", "$V$", "$O(\\lg V)$", "$O(\\lg V)$ amortisert"],
          ["Decrease-Key", "$E$", "$O(\\lg V)$", "$O(1)$ amortisert"],
          ["Totalt", "", "$O(E \\lg V)$", "$O(E + V \\lg V)$"],
        ], caption: "Lysarkene: med binærhaug er totalen $O(E \\lg V)$. Med Fibonacci-haug får vi $O(E + V \\lg V)$. Pensum krever ikke at dere vet hvordan Fibonacci-hauger fungerer, bare kjøretiden." },
        { type: "formula", latex: "T_{\\text{Prim}} = O(E \\lg V)", name: "Kjøretid for MST-Prim med binærhaug", caption: "Med Fibonacci-haug blir det $O(E + V \\lg V)$. Pensum krever bare kjøretiden, ikke hvordan haugen fungerer." },
        { type: "box", variant: "tip", title: "Prim og traversering (forelesning 8)", blocks: [
          { type: "text", text: "Prim er en traversering med en min-prioritetskø, slik forelesning 8 viste (H9). Det som prioriteres, er den letteste kanten til treet, og ikke den eldste eller nyeste noden. Boka setter alle nodene inn i køen fra starten, så oppdagelsesdelen forsvinner, nøyaktig som for Dijkstra." },
        ] },
        { type: "example", title: "Den femte kanten i Prim (øving 9, spm. 1, eksamen 2017S, oppgave 6)", blocks: [
          { type: "text", text: "Hvilken kant er den femte som legges til i MST-Prim fra node 2? Svaret i løsningsforslaget er kanten (3, 6). Vi kjører algoritmen og teller kantene som legges til, til vi kommer til den femte. Hver gang en node tas ut, oppdateres nøklene til naboene som fortsatt er i køen." },
        ] },
        { type: "example", title: "Prim med en modifisert nøkkel (eksamen august 2026, oppgave 16)", blocks: [
          { type: "text", text: "Visdal skriver $u.\\mathit{key} + w(u, v)$ der Prim skriver $w(u, v)$. Det er da Dijkstras algoritme. Den gir et spenntre, men ikke nødvendigvis et minimalt. Svaret er altså nei: kanter $(v, v.\\pi)$ danner et spenntre, men ikke alltid et minimalt." },
        ] },
        { type: "box", variant: "pitfall", title: "Prim og flere komponenter", blocks: [
          { type: "text", text: "Prim finner et minimalt spenntre bare for komponenten som inneholder startnoden. Vil vi ha en minimal spennskog av en usammenhengende graf, må vi kjøre Prim fra én node i hver komponent, eller bruke Kruskal (eksamen august 2024, oppgave 2)." },
        ] },
      ],
    },
    {
      id: "sammenligning",
      title: "Kruskal og Prim sammenlignet, og MST-A og MST-B",
      blocks: [
        { type: "table", head: ["", "Kruskal", "Prim"], rows: [
          ["Velger", "lettest kant i hele grafen, som ikke lager sykel", "lettest kant ut fra treet som vokser"],
          ["Huskeliste", "sortert kantliste, og disjunkte mengder", "min-prioritetskø på $v.\\mathit{key}$"],
          ["Kjøretid", "$O(E \\lg V)$", "$O(E \\lg V)$ med binærhaug"],
          ["Usammenhengende graf", "minimal spennskog", "bare startnodens komponent"],
          ["Passer best til", "tynne grafer, og når kantene er sortert fra før", "tette grafer, og når vi vil bygge fra én node"],
        ], caption: "Begge er grådige og trygge, men med ulike snitt: Kruskal velger snittet som kommer fra komponentene, Prim velger snittet rundt treet som vokser." },
        { type: "example", title: "Hva er riktig: MST-A eller MST-B? (CLRS 21-3, øving 9, spm. 5)", blocks: [
          { type: "list", items: [
            "**MST-A:** legg til kanter i **vilkårlig** rekkefølge, så lenge det ikke lager en sykel. Den gir **ikke alltid** et minimalt spenntre: i en trekant med vekter 1, 1 og 2 kan den velge 2 først, og så en 1, og ende med vekt 3 i stedet for 2.",
            "**MST-B:** sorter kantene **synkende**, og fjern en kant hvis den ikke koblede grafen blir usammenhengende. Den gir **alltid** et minimalt spenntre. Beviset: vi får ingen sykler, siden en kant på en sykel alltid kunne fjernes. Hvis resultatet ikke var minimalt, fantes en tyngre kant på en sykel som MST-B ville ha fjernet først, en motsigelse.",
          ] },
        ] },
        { type: "figure", component: ArbitraryOrderFigure, caption: "Trekanten med vektene 1, 1 og 2. MST-A legger til kanter i vilkårlig rekkefølge, og får 3 hvis a–c kommer først. MST-B fjerner den tyngste kanten, a–c, først, og får det minimale spenntreet med vekt 2. Å velge letteste kant først gir også det minimale spenntreet." },
        { type: "example", title: "Lurviks algoritme (eksamen 2016S, oppgave 17)", blocks: [
          { type: "text", text: "Lurvik vil lage spenntrær i en uvektet, urettet graf ved å legge til kanter som har nøyaktig én nabokant i treet, i rundevis. Algoritmen finner ikke alltid et spenntre: den siste kanten kan ha to nabokanter og kan ikke legges til. Verste tilfelle er $O(nm)$, siden det er $O(n)$ runder med $\\Theta(m)$ arbeid hver." },
        ] },
      ],
    },
    {
      id: "oving",
      title: "Øv på øvings- og eksamensoppgaver",
      blocks: [
        { type: "box", variant: "tip", title: "Oppskrift for en MST-oppgave på eksamen", blocks: [
          { type: "list", ordered: true, items: [
            "**Modeller som graf:** hva er nodene og kantene, og hva er vekten? Er grafen sammenhengende?",
            "**Velg mål:** minimalt spenntre med $w$, maksimalt med $-w$ eller synkende sortering, eller spennskog for usammenhengende grafer. $k$ klynger: stopp Kruskal etter $n − k$ union.",
            "**Velg algoritme:** Kruskal når kantene er lette å sortere eller grafen er tynn. Prim når vi bygger fra én node, eller vi ser etter den letteste kanten fra et tre.",
            "**Argumenter for korrekthet:** finn snittet som respekterer $A$, og vis at kanten er lettest over det.",
            "**Kjøretid:** $O(E \\lg V)$ med binærhaug og disjunkte mengder. Husk tiden for å bygge grafen og sortere kantene.",
          ] },
        ] },
        { type: "example", title: "Slette blå noder, mens de røde forblir koblet (eksamen 2016S, oppgave 20)", blocks: [
          { type: "text", text: "Grafen har røde og blå noder uten kanter mellom noder av samme farge. Hver blå node har 0, 1 eller 2 naboer, og en positiv vekt. Vi vil slette blå noder med størst mulig total vekt, men alle røde noder må fortsatt være koblet. Blå noder med færre enn to naboer kan fjernes uten å endre forbindelsene. De blå nodene med to naboer er som kanter mellom to røde noder, med nodevekten som kantvekt. Vi beholder de blå nodene som utgjør et **minimalt** spenntre i denne hjelpegrafen, og sletter resten." },
        ] },
        { type: "example", title: "Trygg kant og snittet (eksamen desember 2024, oppgave 12)", blocks: [
          { type: "text", text: "Før vi legger til en lett kant over et snitt, må snittet respektere den nåværende $A$: ingen kant i $A$ krysser snittet. Strengt talt er det ikke nødvendig å stille krav, dersom kanten er strengt lettere enn alle andre over snittet. Det er altså teorem 21.1 som gjelder." },
        ] },
        { type: "quiz", items: [
          { question: "Hvor mange kanter har et spenntre på $|V|$ noder?", answer: "$|V| - 1$, og det er både sammenhengende og asyklisk." },
          { question: "Når er et minimalt spenntre entydig?", answer: "Hvis alle kantvektene er ulike (øving 9, spm. 3). Det er et tilstrekkelig, men ikke nødvendig, krav." },
          { question: "Hva er en trygg kant for en mengde $A$?", answer: "En kant som kan legges til $A$ uten å bryte invarianten, altså som er med i et minimalt spenntre som inneholder $A$. Det holder at den er en lett kant over et snitt som respekterer $A$." },
          { question: "Hva sier teorem 21.1?", answer: "Er $A$ en del av et minimalt spenntre, og $(S, V − S)$ et snitt som respekterer $A$, er en lett kant over snittet trygg for $A$." },
          { question: "Hvordan sjekker Kruskal om en kant lager en sykel?", answer: "Den sjekker om $\\textit{Find-Set}(u) = \\textit{Find-Set}(v)$. Er de like, er $u$ og $v$ allerede koblet sammen, og kanten hoppes over." },
          { question: "Hva er forskjellen på rang og høyde?", answer: "Rangen er en øvre grense for høyden. Find-Set endrer ikke rangen, så den kan være større enn høyden." },
          { question: "Hvordan oppdaterer Prim nøklene?", answer: "For hver nabo $v$ i køen med $w(u, v) < v.\\mathit{key}$ settes $v.\\pi = u$ og $v.\\mathit{key} = w(u, v)$." },
          { question: "Hva er kjøretiden til Kruskal og Prim med binærhaug?", answer: "$O(E \\lg V)$ for begge. Med Fibonacci-haug er Prim $O(E + V \\lg V)$." },
          { question: "Hvordan finner vi et maksimalt spenntre?", answer: "Kjør Kruskal eller Prim med vektene $-w$, eller sorter kantene synkende i Kruskal (øving 9, spm. 11 og 12)." },
          { question: "Gir Prim en minimal spennskog av en usammenhengende graf?", answer: "Nei. Prim vokser bare i komponenten til startnoden. Kruskal finner en minimal spennskog (eksamen august 2024, oppgave 2)." },
        ] },
      ],
    },
  ],
};
