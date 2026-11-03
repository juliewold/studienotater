import type { Lesson } from "../types";
import { AdjacencyFigure, BfsFigure, DfsFigure, EdgeClassFigure, FrontierFigure, ParenthesisFigure, SccFigure, StackDfsFigure, TopoSortFigure } from "./figures08";

const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view`, kind: "drive" as const });

// Based on the pensum booklet (lecture 8, goals H1–H9, and appendix F), the lecture slides, CLRS chapter 20 and the
// introduction to part VI, exercise 8 with its solution, and the exams from December 2023 to August 2026 (with
// solutions). The existing lecture 8 note in Studienotater is still empty, so it could not be used as support.
export const lesson: Lesson = {
  subjectId: "tdt4120",
  unitId: "08",
  reviewed: "2026-11-03",
  summary: "Vi **traverserer** en graf ved å besøke noder vi vet om. Til å begynne med vet vi bare om startnoden, men hver gang vi besøker en node, oppdager vi naboene. Nodene vi har oppdaget, men ikke besøkt, ligger i en **huskeliste**, og hvilken node vi tar ut av den, bestemmer algoritmen: **BFS** tar den eldste (en FIFO-kø) og finner korteste veier uten vekter, mens **DFS** tar den nyeste (en stakk, eller kallstakken) og gir tidsstempler som avslører struktur. Med DFS klassifiserer vi kanter, finner sykler, sorterer en DAG **topologisk** og finner **sterke komponenter**. Alt går i lineær tid, $O(V + E)$, med nabolister. Traversering er også ryggraden i Prim, Dijkstra og flytalgoritmene senere i faget.",
  overview: [
    "**Representasjon (H1):** **nabolister** tar $\\Theta(V + E)$ plass og egner seg til traversering. En **nabomatrise** tar $\\Theta(V^2)$ plass og slår opp en kant i $\\Theta(1)$. Standardvalget er nabolister.",
    "**Traversering generelt (H9, !):** hvit = uoppdaget, grå = i huskelisten (oppdaget, ikke ferdig), svart = ferdig. Huskelisten avgjør algoritmen: FIFO-kø gir BFS, LIFO-kø gir DFS, prioritetskø gir Prim og Dijkstra.",
    "**BFS (H2):** utforsker lag for lag fra $s$. Etterpå er $v.d = \\delta(s, v)$, korteste vei målt i **antall kanter**, og Print-Path skriver ut stien via forgjengerne $v.\\pi$. $O(V + E)$.",
    "**DFS (H3):** går så dypt som mulig, og starter på nytt fra hver hvite node. Hver node får **oppdagelsestid** $v.d$ og **ferdigtid** $v.f$. $\\Theta(V + E)$.",
    "**Parentesteoremet og hvit-sti-teoremet (H3):** to intervaller $[u.d, u.f]$ og $[v.d, v.f]$ er enten disjunkte eller nøstet, og $v$ er etterkommer av $u$ hvis og bare hvis det fantes en hvit sti fra $u$ til $v$ da $u$ ble oppdaget.",
    "**Kantklassifisering (H4):** kanten $(u, v)$ er en **trekant** hvis $v$ er hvit, en **bakoverkant** hvis $v$ er grå, og ellers en **forover-** eller **krysskant** (svart $v$ med $u.d < v.d$ eller $u.d > v.d$). Bakoverkant $\\Leftrightarrow$ sykel.",
    "**Topologisk sortering (H5):** kjør DFS og sett hver node først i en lenket liste når den blir ferdig. **Synkende ferdigtid** gir en rekkefølge der alle kanter peker fremover. Krever en DAG.",
    "**Sterke komponenter (H6):** DFS på $G$, transponer, og DFS på $G^{\\mathsf{T}}$ med startnoder i synkende ferdigtid. Hvert dybde-først-tre i andre runde er én sterk komponent.",
    "**Stakk og traverseringstrær (H7, H8):** DFS kan skrives iterativt med en eksplisitt stakk. Forgjengerne $v.\\pi$ danner et **traverseringstre**: bredde-først-tre (korteste veier) eller dybde-først-skog.",
  ],
  keyFormulas: [
    { latex: "\\Theta(V + E) \\text{ med nabolister}, \\qquad \\Theta(V^2) \\text{ med nabomatrise}", label: "Plass, og kjøretid for BFS, DFS, topologisk sortering og sterke komponenter" },
    { latex: "v.d = \\delta(s, v) \\quad \\text{etter BFS}(G, s)", label: "BFS finner korteste vei målt i antall kanter (CLRS teorem 20.5)" },
    { latex: "v \\text{ er en ekte etterkommer av } u \\iff u.d < v.d < v.f < u.f", label: "Parentesteoremet, nøstet utgave (CLRS korollar 20.8)" },
    { latex: "(u, v) \\in E \\implies v.f < u.f \\quad \\text{i en DAG}", label: "Topologisk sortering: synkende ferdigtid" },
    { latex: "f(C) > f(C') \\text{ hvis en kant går fra } C \\text{ til } C'", label: "Sterke komponenter (CLRS lemma 20.14)" },
  ],
  goals: [
    "Forstå hvordan grafer kan implementeres **(H1)**",
    "Forstå BFS, også for å finne korteste vei uten vekter, inkludert Print-Path **(H2)**",
    "Forstå DFS, parentesteoremet og hvit-sti-teoremet **(H3)**",
    "Forstå hvordan DFS klassifiserer kanter **(H4)**",
    "Forstå Topological-Sort **(H5)**",
    "Forstå Strongly-Connected-Components **(H6)**",
    "Forstå hvordan DFS kan implementeres med en stakk **(H7)**",
    "Forstå hva traverseringstrær (som bredde-først- og dybde-først-trær) er **(H8, !)**",
    "Forstå traversering med vilkårlig prioritetskø **(H9)**",
  ],
  concepts: [
    "queue", "stack", "priority-queue", "enqueue", "dequeue", "linked-list", "dynamic-table", "node", "tree", "rooted-tree", "depth",
    "preorder-traversering", "postorder-traversering", "recursive-decomposition", "memoisering", "delinstansgraf", "subinstance-graph",
  ],
  notes: [{ slug: "forelesning-8-traversering-av-grafer", label: "Forelesning 8 - Traversering av grafer" }],
  sources: [
    drive("Pensumhefte 2026, forelesning 8 og appendiks F", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
    drive("Forelesning 8 (lysark)", "1rUEdUctrPWWEtcn8CqNJZiZ-bGS-hxZY"),
    drive("Øving 8: Traversering av grafer", "1atk1o59oLThH41l1qXF0wHEbx2SoJ1TR"),
    drive("Løsningsforslag øving 8", "1Hlg5MZHRkhpVculIThCH_bTwoxI5bXz1"),
    drive("Eksamen august 2026 med løsningsforslag", "1MhSk2qelJNYMKZjaj2O7mqzzYtryB9vr"),
    drive("Eksamen desember 2025 med løsningsforslag", "1NdJNYFLTh20uLDmtG1W2oUa_3HVZllir"),
    drive("Eksamen august 2025 med løsningsforslag", "1B5E6tItKtjigNSfNEwm9GIBC3pdbWlDC"),
    drive("Eksamen desember 2024 med løsningsforslag", "1Ffv3IAteloAL1jjcu0k2MQKfJ9nVtgrb"),
    drive("Eksamen august 2024 med løsningsforslag", "10gHedZOudM9XBcB8WuEw-agDlCQKdVC4"),
    drive("Eksamen desember 2023 med løsningsforslag", "1R6BvBaHHIm2BfMmp1XHh-Xg8QQpdM0cN"),
    { label: "Forelesning 8 - Traversering av grafer", url: "forelesning-8-traversering-av-grafer", kind: "note" },
  ],
  sections: [
    {
      id: "representasjon",
      title: "Grafrepresentasjoner",
      blocks: [
        { type: "box", variant: "definition", title: "Grafer (innledningen til del VI)", blocks: [
          { type: "text", text: "En graf $G = (V, E)$ har en mengde **noder** $V$ og en mengde **kanter** $E$. I en **rettet** graf er en kant et ordnet par $(u, v)$, fra $u$ til $v$. I en **urettet** graf går kanten begge veier. $v$ er en **nabo** av $u$ hvis $(u, v) \\in E$. I kjøretider skriver vi $V$ og $E$ for $|V|$ og $|E|$, så $O(V + E)$ betyr $O(|V| + |E|)$. Merk at $E = O(V^2)$." },
        ] },
        { type: "text", text: "**Nabolister** (adjacency lists): en tabell $G.\\mathit{Adj}$ med **én liste per node**, der $G.\\mathit{Adj}[u]$ inneholder ut-naboene til $u$. Lysarkene understreker at det er snakk om mange lister, ikke «en naboliste». I en urettet graf står hver kant i to lister. Vekter kan lagres sammen med naboen i listen." },
        { type: "formula", latex: "\\sum_{u \\in V} |G.\\mathit{Adj}[u]| = \\begin{cases} |E| & \\text{rettet graf} \\\\ 2|E| & \\text{urettet graf} \\end{cases}", name: "Total lengde av nabolistene", caption: "Derfor tar nabolister $\\Theta(V + E)$ plass: én liste per node og ett listeelement per kant (to i urettede grafer). Det er også grunnen til at en traversering som går gjennom hver liste én gang, bruker $O(V + E)$ tid." },
        { type: "text", text: "**Nabomatrise** (adjacency matrix): en $|V| \\times |V|$-matrise $A$ der $A[u, v] = 1$ hvis og bare hvis $(u, v) \\in E$. For en urettet graf er $A$ **symmetrisk**, $A[u, v] = A[v, u]$. Med vekter lagrer vi $w(u, v)$ i stedet for 1." },
        { type: "figure", component: AdjacencyFigure, caption: "Grafen fra øving 8, spm. 2, i begge representasjonene. Rad $u$ i matrisen er det samme som listen $G.\\mathit{Adj}[u]$, bare med en plass for hver mulige nabo. Løsningsforslagets tips: sjekk at hver kant i listene finnes i grafen, og at grafen ikke har kanter som mangler i listene." },
        { type: "table", head: ["Operasjon", "Nabolister", "Nabomatrise"], rows: [
          ["Plass", "$\\Theta(V + E)$", "$\\Theta(V^2)$"],
          ["Finnes kanten $(u, v)$?", "$O(V)$: let gjennom $G.\\mathit{Adj}[u]$", "$\\Theta(1)$: se på $A[u, v]$"],
          ["Gå gjennom naboene til $u$", "$\\Theta(\\text{antall naboer})$", "$\\Theta(V)$: hele raden"],
          ["Traversere hele grafen", "$\\Theta(V + E)$", "$\\Theta(V^2)$"],
        ], caption: "Øving 8, spm. 10 og 11. Lysarkene: å si at matriser er raskere, men tar mer plass, er en overforenkling. Det kommer an på problemet. Matriser egner seg til **direkte oppslag**, lister til **traversering**, og lister tar bare mindre plass når grafen har få kanter, ikke ellers. Vi bruker nabolister med mindre vi trenger raske kantoppslag, og kan godt blande inn hashtabeller." },
        { type: "example", title: "Fra graf til representasjon (øving 8, spm. 3 og 6, og eksamen august 2024, oppgave 10)", blocks: [
          { type: "list", items: [
            "**Nabomatrise for hånd:** start med en matrise fylt med nuller. For hver kant $(u, v)$ setter du $A[u, v] = 1$, og for en urettet graf også $A[v, u] = 1$. Til slutt kan du kontrollere at antall enere er $|E|$ (rettet) eller $2|E|$ (urettet).",
            "**Bygge nabolister fra data (spm. 6):** for kompatibilitet mellom donorer og mottakere går vi gjennom alle par og legger mottaker $m$ inn i listen til donor $d$ hvis de har minst $k$ like attributter. Med $D$ donorer, $R$ mottakere og $a$ attributter tar det $\\Theta(D R a)$. Grafen brukes til bipartitt matching i forelesning 12.",
          ] },
        ] },
      ],
    },
    {
      id: "traversering",
      title: "Traversering: besøk, oppdag og husk",
      blocks: [
        { type: "text", text: "Lysarkene bygger traversering som en **rekursiv dekomponering**: vi vil finne alle noder som kan nås fra en startnode $u$. Sletter vi $u$, får vi én delinstans for hver ut-nabo, og løsningen er **unionen** av det vi finner. Det fungerer likt i rettede og urettede grafer. Uten mer blir det svært mye dobbeltarbeid, fordi de samme nodene nås langs mange veier. Løsningen er den samme som i dynamisk programmering: **memoisering**. Vi merker nodene, og går aldri videre til en node vi allerede har sett." },
        { type: "pseudocode", title: "Traverse′(G, u)", lines: [
          "print u",
          "u.color = gray",
          "for each v ∈ G.Adj[u]",
          "    if v.color == white",
          "        Traverse′(G, v)",
          "u.color = black",
        ], caption: "Lysarkenes myke start, som ikke står i boka. Linje 1: her gjør vi det vi skal med noden. Linje 2: krymper instansen og hindrer uendelig rekursjon. Linje 4: «memoisering», gå bare videre om $v$ er «uløst». Linje 6: $u$ er nå «løst» (den kunne like gjerne ha forblitt grå). Dette er kjernen i DFS-Visit, bortsett fra tidsstemplene." },
        { type: "box", variant: "definition", title: "Fargene, og huskelisten", blocks: [
          { type: "list", items: [
            "**Hvit:** uoppdaget. Vi vet ikke om noden ennå.",
            "**Grå:** oppdaget, men ikke ferdigbehandlet. Noden ligger i **huskelisten**: køen $Q$ i BFS, eller kallstakken i DFS.",
            "**Svart:** besøkt og ferdig.",
          ] },
          { type: "text", text: "Pensumheftet (appendiks F): å traversere er å besøke noder, oppdage nye langs kantene og vedlikeholde en huskeliste over oppdagede noder som ikke er besøkt ennå. Vi kan egentlig velge **vilkårlige** noder fra huskelisten og likevel nå hele den delen av grafen som kan nås fra startnoden. Valget bestemmer bare **rekkefølgen**, og dermed hvilke egenskaper vi får." },
        ] },
        { type: "figure", component: FrontierFigure, caption: "Til venstre: BFS fra node 1 etter tre besøk. Svarte noder er ferdige, de grå ligger i huskelisten, og de hvite er ukjente. Til høyre: traverseringen er ferdig, og $S$ er mengden av noder som kan nås fra 1. Lysarkenes «forsmak på dualitet»: **enten** finnes en sti fra $s$ til $t$, **eller** så finnes et snitt der alle kryssende kanter går fra $t$-siden til $s$-siden. Traverseringen finner det ene av dem, og hvert av dem beviser at det andre ikke finnes. Ideen kommer igjen med maks-flyt og min-snitt i forelesning 12." },
        { type: "table", head: ["Huskeliste", "Prioriterer", "Algoritme"], rows: [
          ["FIFO-kø", "den **eldste**, først oppdaget", "**BFS**: lag for lag, korteste veier uten vekter"],
          ["LIFO-kø (stakk), eller kallstakken", "den **nyeste**, sist oppdaget", "**DFS-Visit**: så dypt som mulig"],
          ["min-prioritetskø med nøkkel $v.d$", "lavest avstandsestimat", "**Dijkstra** (forelesning 10)"],
          ["min-prioritetskø med nøkkel $v.\\mathit{key}$", "letteste kant til en besøkt node", "**MST-Prim** (forelesning 9)"],
          ["avstand pluss et estimat for resten", "mest lovende mot målet", "A* (ikke pensum, men nevnt i pensumheftet og øving 8)"],
        ], caption: "Traversering med vilkårlig prioritetskø (H9). Køer og stakker er bare spesialtilfeller av en prioritetskø, der prioriteten er innsettingstidspunktet. Prim og Dijkstra i boka setter alle noder inn i $Q$ fra starten, så oppdagelsesdelen blir borte. Eldre fremstillinger legger nodene inn når de oppdages, som i BFS." },
        { type: "formula", latex: "O(V \\lg V + E \\lg V) = O(E \\lg V)", name: "Traversering med binærhaug som huskeliste", caption: "Lysarkene: samme logikk som for BFS og DFS, men køen kan være dyrere. Med en binærhaug tar hver innsetting, uttak og nøkkelendring $O(\\lg V)$. Hver node tas ut én gang, og hver kant kan gi én oppdatering. Når alle noder kan nås, er $E \\ge V - 1$, og uttrykket forenkles til $O(E \\lg V)$." },
        { type: "box", variant: "definition", title: "Traverseringstrær (H8, !)", blocks: [
          { type: "text", text: "Når $v$ oppdages fra $u$, setter vi **forgjengeren** $v.\\pi = u$. Kantene $(v.\\pi, v)$ danner **forgjengerdelgrafen** $G_\\pi$, et **traverseringstre** med startnoden som rot, eller en skog hvis vi starter flere steder. BFS gir et **bredde-først-tre** som inneholder en korteste vei fra $s$ til hver node det når. DFS gir en **dybde-først-skog** med ett tre per kall til DFS-Visit fra DFS. Prim gir et minimalt spenntre og Dijkstra et korteste-vei-tre, med det samme feltet. Treet har $|V_\\pi| - 1$ kanter, og forgjengerne lagrer hele treet med $O(V)$ plass." },
        ] },
        { type: "example", title: "Hvilket felt har alle traverseringene? (eksamen desember 2025, oppgave 6)", blocks: [
          { type: "text", text: "DFS-Visit, BFS, Dag-Shortest-Paths, Dijkstra, Bellman-Ford og Prim har alle et felt $v.x$ som utgjør en del av løsningen. Hvilket? **Forgjengeren $v.\\pi$**, som angir foreldrenoden i treet som konstrueres: traverseringstre, korteste-vei-tre eller minimalt spenntre." },
        ] },
      ],
    },
    {
      id: "bfs",
      title: "Bredde-først-søk (BFS)",
      blocks: [
        { type: "text", text: "BFS (Zuse 1945, publisert 1972) besøker først alle naboene til $s$, så alle naboene deres, og så videre. Huskelisten er en **FIFO-kø**: oppdaget tidlig betyr besøkt tidlig. Hver node har avstandsestimatet $v.d$, forgjengeren $v.\\pi$ og en farge." },
        { type: "pseudocode", title: "BFS(G, s)", lines: [
          "for each vertex u ∈ G.V − {s}",
          "    u.color = white",
          "    u.d = ∞",
          "    u.π = nil",
          "s.color = gray",
          "s.d = 0",
          "s.π = nil",
          "Q = ∅",
          "Enqueue(Q, s)",
          "while Q ≠ ∅",
          "    u = Dequeue(Q)",
          "    for each v ∈ G.Adj[u]",
          "        if v.color == white",
          "            v.color = gray",
          "            v.d = u.d + 1",
          "            v.π = u",
          "            Enqueue(Q, v)",
          "    u.color = black",
        ], caption: "CLRS 20.2 og lysarkene. Linje 1–4: alle andre er uoppdaget, med avstand $\\infty$. Linje 5–9: startnoden er grå (oppdaget) med avstand 0, og ligger alene i køen. Linje 11: besøk den vi oppdaget **først**. Linje 13–17: hver hvit nabo oppdages nå, får avstand én mer enn $u$ og husker at den kom fra $u$. Linje 18: $u$ er ferdig. En node blir grå én gang og havner derfor i køen høyst én gang." },
        { type: "figure", component: BfsFigure, caption: "BFS fra node 1 på eksempelgrafen, med nabolistene i stigende rekkefølge. Lilla kanter er bredde-først-treet. Stiplede kanter går til noder som allerede var oppdaget, så de endrer ingenting. Køen inneholder aldri mer enn to ulike avstander, og de kommer i stigende rekkefølge. Med en annen rekkefølge i nabolistene kan besøksrekkefølgen og treet bli annerledes, men $v.d$ blir alltid den samme." },
        { type: "pseudocode", title: "Print-Path(G, s, v)", lines: [
          "if v == s",
          "    print s",
          "elseif v.π == nil",
          "    print “no path from” s “to” v",
          "else Print-Path(G, s, v.π)",
          "    print v",
        ], caption: "Skriver ut stien fra $s$ til $v$ i bredde-først-treet ved å gå baklengs langs forgjengerne. Linje 1–2: stien fra $s$ til $s$ er bare $s$. Linje 3–4: en annen node uten forgjenger kan ikke nås. Linje 5–6: skriv først stien til forgjengeren, og deretter $v$. Rekursjonen gjør at rekkefølgen blir fra $s$ og utover. Kjøretiden er lineær i antall noder på stien. I eksempelet gir Print-Path(G, 1, 8) stien 1, 3, 6, 8, og Print-Path(G, 1, 9) skriver «no path from 1 to 9»." },
        { type: "box", variant: "theorem", title: "BFS finner korteste vei (CLRS teorem 20.5)", blocks: [
          { type: "text", text: "La $\\delta(s, v)$ være **korteste-vei-avstanden**: minste antall kanter på en sti fra $s$ til $v$, eller $\\infty$ hvis ingen sti finnes. Etter BFS($G$, $s$) er $v.d = \\delta(s, v)$ for alle $v$, alle noder som kan nås, er oppdaget, og for $v \\ne s$ som kan nås, er en korteste sti fra $s$ til $v.\\pi$ fulgt av kanten $(v.\\pi, v)$ en korteste sti til $v$." },
          { type: "list", items: [
            "**Lemma 20.1:** for hver kant $(u, v)$ er $\\delta(s, v) \\le \\delta(s, u) + 1$. Kan vi nå $u$, kan vi nå $v$ med én kant til.",
            "**Lemma 20.2:** $v.d \\ge \\delta(s, v)$ hele tiden. Hver verdi $v.d = u.d + 1$ svarer til en faktisk sti (induksjon på antall Enqueue).",
            "**Lemma 20.3 og korollar 20.4:** hvis køen er $\\langle v_1, \\dots, v_r \\rangle$, er $v_1.d \\le v_2.d \\le \\dots \\le v_r.d \\le v_1.d + 1$. Noder oppdages altså i ikke-synkende avstand.",
            "**Beviset:** anta at $v$ er noden med minst $\\delta(s, v)$ som får feil verdi, og la $u$ være noden før $v$ på en korteste sti. Da er $u.d = \\delta(s, u)$. Når $u$ tas ut av køen, er $v$ enten hvit (og får $v.d = u.d + 1 = \\delta(s, v)$), svart eller grå (og har da allerede en $d$-verdi som er høyst $u.d + 1$, ifølge køegenskapen). I alle tilfeller er $v.d \\le \\delta(s, v)$, som sammen med lemma 20.2 gir likhet.",
          ] },
          { type: "formula", latex: "\\delta(s, v) \\le \\delta(s, u) + 1 \\quad \\text{for alle } (u, v) \\in E", name: "Trekantulikheten for avstander uten vekter", caption: "Lemma 20.1. Den samme ulikheten, med $w(u, v)$ i stedet for 1, er grunnlaget for Relax og korteste vei med vekter i forelesning 10." },
        ] },
        { type: "box", variant: "theorem", title: "Kjøretid: O(V + E)", blocks: [
          { type: "text", text: "Lysarkene: det er fristende å si $O(VE)$, fordi vi potensielt følger alle kanter fra hver node, men det er for pessimistisk. Vi må **amortisere**: hver node legges i køen og tas ut høyst én gang ($O(V)$ totalt), og nabolisten til en node gjennomgås bare når noden tas ut, så alle listene til sammen gir $O(E)$. Med initialiseringen blir det $O(V + E)$. I beste fall (startnoden har ingen ut-kanter) er det likevel $\\Theta(V)$, fordi alle nodene initialiseres." },
          { type: "formula", latex: "T_{\\text{BFS}} = O(V + E), \\qquad T_{\\text{DFS}} = \\Theta(V + E)", name: "Kjøretid for BFS og DFS med nabolister", caption: "Eksamen august 2026, oppgave 1, spurte nettopp etter BFS: $O(V + E)$. DFS besøker alle noder og undersøker alle kanter uansett, så den er $\\Theta(V + E)$ også i beste fall. Med nabomatrise blir begge $\\Theta(V^2)$, fordi en hel rad må leses for hver node." },
        ] },
        { type: "box", variant: "pitfall", title: "Hva BFS ikke gjør", blocks: [
          { type: "list", items: [
            "**Den besøker ikke nødvendigvis alle noder.** BFS starter bare i $s$, og noder som ikke kan nås, forblir hvite med $v.d = \\infty$ (øving 8, spm. 15). DFS har en ytre løkke og når alle.",
            "**Den gir korteste vei bare uten vekter**, eller når alle vekter er like og ikke-negative: da er vekten $k \\cdot w$ for en sti med $k$ kanter, og færrest kanter er best. Med ulike vekter trengs Dijkstra eller Bellman-Ford.",
            "**Det er køen som gir korteste vei.** Bytter vi den ut med noe annet, risikerer vi å finne noder via omveier (lysarkene). Sykler er derimot ikke noe problem for BFS.",
          ] },
        ] },
        { type: "example", title: "Mulige BFS-rekkefølger (øving 8, spm. 5)", blocks: [
          { type: "text", text: "Grafen har kantene fra 1 til 2, 3 og 5, og rekkefølgen i nabolistene er tilfeldig. Hvilke besøksrekkefølger er mulige?" },
          { type: "list", items: [
            "Etter 1 kommer en **permutasjon av 2, 3 og 5**, fordi alle tre oppdages fra 1 og legges i køen før noe annet.",
            "Rekkefølgen på 4 og 6 til slutt avhenger av hvem av 2, 3 og 5 som besøkes først: 2 oppdager både 4 og 6 (fri rekkefølge), 3 oppdager bare 6 (så 6 før 4), og 5 oppdager bare 4 (så 4 før 6).",
            "**Riktige svar:** $\\langle 1, 2, 5, 3, 4, 6 \\rangle$, $\\langle 1, 3, 2, 5, 6, 4 \\rangle$, $\\langle 1, 5, 3, 2, 4, 6 \\rangle$ og $\\langle 1, 2, 5, 3, 6, 4 \\rangle$.",
          ] },
        ] },
        { type: "example", title: "Korteste vei i en implisitt graf (øving 8, spm. 12 og 25)", blocks: [
          { type: "list", items: [
            "**3 × 3-spillet (spm. 12):** hver **tilstand** av brettet er en node, og det går en kant til hver tilstand vi når ved å flytte én brikke. Færrest flytt er korteste vei målt i antall kanter: **BFS**. Grafen trenger ikke bygges på forhånd; naboene genereres når en node besøkes.",
            "**Veibygging i et rutenett (spm. 25):** nodene er rutene der vi kan bygge, og kantene går til de fire naborutene. Kjør BFS fra start, stopp når vi tar ut målet, og bygg veien baklengs med forgjengerne, akkurat som Print-Path. Løsningsforslaget viser også A* (utenfor pensum), som retter søket mot målet med manhattanavstand.",
          ] },
        ] },
      ],
    },
    {
      id: "dfs",
      title: "Dybde-først-søk (DFS)",
      blocks: [
        { type: "text", text: "DFS besøker en node i det øyeblikket den oppdages. Kallstakken blir huskelisten, så den sist oppdagede behandles først, og vi går så dypt som mulig før vi rygger. I bokas versjon har DFS **ingen startnode**: den ytre løkka starter DFS-Visit fra hver node som fortsatt er hvit, til hele grafen er besøkt. Det trengs for topologisk sortering og sterke komponenter. Begrepet «dybde-først-søk» brukes om både DFS og DFS-Visit (pensumheftet, appendiks F). Idéen er gammel: lysarkene viser Trémaux' algoritme for å finne veien i en labyrint, en versjon av DFS beskrevet av Édouard Lucas i 1882." },
        { type: "pseudocode", title: "DFS(G)", lines: [
          "for each vertex u ∈ G.V",
          "    u.color = white",
          "    u.π = nil",
          "time = 0",
          "for each vertex u ∈ G.V",
          "    if u.color == white",
          "        DFS-Visit(G, u)",
        ], caption: "Linje 1–4: initialisering, og en **global** klokke. Linje 5–7: traverser fra alle noder etter tur, og hopp over dem vi allerede er ferdige med. Hvert kall i linje 7 lager ett nytt tre i dybde-først-skogen." },
        { type: "pseudocode", title: "DFS-Visit(G, u)", lines: [
          "time = time + 1",
          "u.d = time",
          "u.color = gray",
          "for each v ∈ G.Adj[u]",
          "    if v.color == white",
          "        v.π = u",
          "        DFS-Visit(G, v)",
          "time = time + 1",
          "u.f = time",
          "u.color = black",
        ], caption: "Linje 1–3: $u$ **oppdages** ved tid $u.d$ (discovery time) og blir grå. Linje 4–7: for hver hvite nabo, besøk den umiddelbart, rekursivt. Linje 8–10: $u$ er **ferdig** ved tid $u.f$ (finish time) og blir svart. Hver node får to tidsstempler, så $1 \\le u.d < u.f \\le 2|V|$. Mellom $u.d$ og $u.f$ er $u$ grå, altså på kallstakken." },
        { type: "figure", component: DfsFigure, caption: "DFS på eksempelgrafen. Tallene er $v.d / v.f$. Til høyre er dybde-først-skogen tegnet med dybde nedover: treet fra 1 inneholder alt som kan nås fra 1, og node 9 får sitt eget tre fordi ingen kant går inn til den. Kjøretiden er $\\Theta(V + E)$: hver node oppdages og blir ferdig én gang, og hver naboliste gjennomgås én gang." },
        { type: "box", variant: "theorem", title: "Parentesteoremet (CLRS teorem 20.7)", blocks: [
          { type: "text", text: "I et dybde-først-søk gjelder nøyaktig ett av disse for to noder $u$ og $v$:" },
          { type: "list", items: [
            "intervallene $[u.d, u.f]$ og $[v.d, v.f]$ er **disjunkte**, og ingen av dem er etterkommer av den andre i dybde-først-skogen,",
            "$[u.d, u.f]$ ligger helt **inni** $[v.d, v.f]$, og $u$ er en etterkommer av $v$,",
            "$[v.d, v.f]$ ligger helt inni $[u.d, u.f]$, og $v$ er en etterkommer av $u$.",
          ] },
          { type: "text", text: "**Hvorfor?** Anta $u.d < v.d$. Hvis $v.d < u.f$, ble $v$ oppdaget mens $u$ var grå, altså på kallstakken. Da er $v$ en etterkommer av $u$, og kallet for $v$ må bli ferdig før kallet for $u$: $v.f < u.f$. Hvis $u.f < v.d$, er intervallene disjunkte. Det er derfor tidsstemplene oppfører seg som parenteser." },
          { type: "formula", latex: "v \\text{ er en ekte etterkommer av } u \\iff u.d < v.d < v.f < u.f", name: "Etterkommere i dybde-først-skogen (korollar 20.8)", caption: "Med tidsstemplene kan vi avgjøre forfedre og etterkommere i $\\Theta(1)$ per spørsmål, etter én DFS." },
        ] },
        { type: "figure", component: ParenthesisFigure, caption: "Intervallene $[v.d, v.f]$ fra DFS-en over, én rad per dybde. Et intervall ligger inni et annet hvis og bare hvis noden er en etterkommer, og ellers overlapper de ikke i det hele tatt. Lysarkene oppgir parentesteoremet og hvit-sti-teoremet som **selvstudium**." },
        { type: "box", variant: "theorem", title: "Hvit-sti-teoremet (CLRS teorem 20.9)", blocks: [
          { type: "text", text: "I en dybde-først-skog er $v$ en etterkommer av $u$ **hvis og bare hvis** det ved tidspunktet $u.d$ (når $u$ oppdages) finnes en sti fra $u$ til $v$ som bare består av **hvite** noder." },
          { type: "text", text: "**Hvorfor?** Er $v$ en etterkommer, gir parentesteoremet $u.d < w.d$ for alle noder $w$ på trestien, så de var hvite da $u$ ble oppdaget. Motsatt: anta at $v$ er den første noden på den hvite stien som ikke blir en etterkommer, og la $w$ være noden før. Siden $w$ blir etterkommer, er $w.f \\le u.f$, og $v$ må oppdages før $w$ blir ferdig, altså etter $u.d$ og før $u.f$. Da ligger $[v.d, v.f]$ inni $[u.d, u.f]$, og $v$ er en etterkommer likevel. Teoremet er nøkkelen i bevisene for topologisk sortering og sterke komponenter." },
        ] },
        { type: "box", variant: "pitfall", title: "DFS finner ikke korteste vei", blocks: [
          { type: "text", text: "Lysarkene prøver å finne korteste vei med DFS på samme graf som BFS-eksempelet, og det går galt: DFS kan nå en node langs en lang omvei før den korte veien undersøkes, og den går aldri tilbake for å rette opp. I eksempelgrafen her har 3 dybde 5 i dybde-først-treet, men $\\delta(1, 3) = 1$. Generelt oppfører DFS og BFS seg svært forskjellig (øving 8, spm. 16)." },
        ] },
        { type: "example", title: "Tidsstempler for hånd (eksamen desember 2024, oppgave 6)", blocks: [
          { type: "text", text: "Utfør DFS på en graf med nodene $x$, $y$, $z$ og $w$, der første kall til DFS-Visit starter i $y$. Fra $y$ når vi $z$ og videre $w$, men ikke $x$. Svaret var $x.d, y.d, z.d, w.d = 7, 1, 2, 3$ og $x.f, y.f, z.f, w.f = 8, 6, 5, 4$." },
          { type: "list", items: [
            "**Kjeden:** $y$ oppdages ved 1, $z$ ved 2 og $w$ ved 3. $w$ har ingen hvite naboer og blir ferdig ved 4, så $z$ ved 5 og $y$ ved 6.",
            "**Hintet:** DFS starter en ny traversering fra **hver** node som fortsatt er hvit. $x$ får derfor $7/8$ i et eget tre. Å starte i $x$ ga bare delvis uttelling.",
            "**Kontroll:** alle tidspunktene 1–8 er brukt nøyaktig én gang, og intervallene $[3, 4] \\subset [2, 5] \\subset [1, 6]$ er nøstet, som parentesteoremet krever.",
          ] },
        ] },
        { type: "example", title: "Er A underordnet B, i konstant tid? (øving 8, spm. 14, fra eksamen 2011)", blocks: [
          { type: "text", text: "Et konsern er et rotfast tre der hver ansatt har én sjef, og kantene går fra sjef til underordnet. Vi vil kunne svare på «er $A$ underordnet $B$?» i $O(1)$, med $O(n)$ tid og plass til forberedelsene. **DFS** fra topplederen gir tidsstempler, og etter korollar 20.8 er $A$ underordnet $B$ hvis og bare hvis $b.d < a.d$ og $a.f < b.f$. Treet har $n$ noder og $n - 1$ kanter, så DFS tar $\\Theta(n + (n - 1)) = \\Theta(n)$." },
        ] },
      ],
    },
    {
      id: "kantklassifisering",
      title: "Kantklassifisering og sykler",
      blocks: [
        { type: "box", variant: "definition", title: "Fire typer kanter (CLRS 20.3, H4)", blocks: [
          { type: "list", items: [
            "**Trekant** (tree edge): en kant i dybde-først-skogen, altså $(v.\\pi, v)$. $v$ ble oppdaget langs denne kanten.",
            "**Bakoverkant** (back edge): fra $u$ til en **forfar** $v$ i samme dybde-først-tre. Løkker $(u, u)$ regnes som bakoverkanter.",
            "**Foroverkant** (forward edge): en kant som ikke er en trekant, fra $u$ til en **etterkommer** $v$.",
            "**Krysskant** (cross edge): alle andre. Den går mellom to noder der ingen er forfar til den andre, i samme tre eller mellom to trær.",
          ] },
        ] },
        { type: "table", head: ["Fargen til $v$ når $(u, v)$ undersøkes", "Type", "Hvorfor"], rows: [
          ["hvit", "**trekant**", "$v$ oppdages nå, fra $u$"],
          ["grå", "**bakoverkant**", "$v$ er på kallstakken, altså en forfar til $u$"],
          ["svart, og $u.d < v.d$", "**foroverkant**", "$v$ ble oppdaget og ferdig mens $u$ var grå, så den er en etterkommer"],
          ["svart, og $u.d > v.d$", "**krysskant**", "$v$ var ferdig før $u$ ble oppdaget: disjunkte intervaller"],
        ], caption: "Klassifiseringen kommer gratis i linje 5 i DFS-Visit, der fargen til $v$ undersøkes, og med tidsstemplene for å skille forover- fra krysskanter. Den avhenger av rekkefølgen nodene og nabolistene gjennomgås i." },
        { type: "figure", component: EdgeClassFigure, caption: "Kantene i eksempelgrafen klassifisert under DFS-en over. (2, 5) og (1, 3) er foroverkanter: 5 og 3 var allerede ferdige etterkommere da kantene ble undersøkt. (5, 7) og (6, 8) er bakoverkanter, fordi 7 og 8 fortsatt lå på kallstakken, og hver av dem lukker en sykel. Den eneste krysskanten er (9, 6), til en node som ble ferdig i et tidligere tre. Lysarkene viser det samme på en mindre graf: «Er v grå? Bakoverkant. Kallstakk: sykel.»" },
        { type: "box", variant: "theorem", title: "Sykler og urettede grafer (CLRS lemma 20.11 og teorem 20.10)", blocks: [
          { type: "list", items: [
            "**Lemma 20.11:** en rettet graf er **asyklisk** hvis og bare hvis DFS ikke gir noen bakoverkanter. En bakoverkant $(u, v)$ lukker sykelen $v \\rightsquigarrow u \\to v$ langs trekantene. Motsatt: har grafen en sykel, la $v$ være den første noden på sykelen som oppdages. Etter hvit-sti-teoremet blir resten av sykelen etterkommere av $v$, så kanten tilbake til $v$ er en bakoverkant.",
            "**Teorem 20.10:** i en **urettet** graf er hver kant enten en trekant eller en bakoverkant. Forover- og krysskanter kan ikke oppstå, fordi kanten ville blitt undersøkt fra den andre enden mens den noden fortsatt var grå.",
            "**Sykeldeteksjon** tar derfor $\\Theta(V + E)$: kjør DFS og se etter en grå nabo.",
          ] },
        ] },
        { type: "example", title: "Hvilke kanttyper kan oppstå? (øving 8, spm. 23 og 24)", blocks: [
          { type: "list", items: [
            "**I et tre (spm. 23):** bare **trekanter**. Det finnes bare én sti mellom to noder, så hver kant vi følger, går til en node vi ikke har sett før.",
            "**I en DAG (spm. 24):** trekanter, foroverkanter og krysskanter, men **ingen bakoverkanter** (lemma 20.11). Løsningsforslagets eksempel: kantene (1, 2), (1, 3), (3, 4), (3, 5), (4, 2) og (4, 5), med sorterte nabolister. Trekantene blir (1, 2), (1, 3), (3, 4) og (4, 5), (3, 5) blir en foroverkant og (4, 2) en krysskant.",
          ] },
        ] },
        { type: "example", title: "Finn en misunnelsessykel (øving 8, spm. 22)", blocks: [
          { type: "text", text: "Agent $i$ misunner $j$ hvis $\\mathit{values}[i][j] > \\mathit{values}[i][i]$. Lag en rettet graf med en kant fra $i$ til $j$ når $i$ misunner $j$. En misunnelsessykel er en rettet sykel, så kjør DFS og stopp ved første **bakoverkant** $(u, v)$, altså når naboen $v$ er grå. Sykelen er $v$, trenodene ned til $u$, og tilbake til $v$; den kan leses ut med forgjengerne eller ved å returnere nodene opp gjennom rekursjonen (og så reversere). Grafen er gitt som en matrise, så kjøretiden blir $\\Theta(n^2)$." },
        ] },
      ],
    },
    {
      id: "topologisk",
      title: "Topologisk sortering",
      blocks: [
        { type: "box", variant: "definition", title: "Topologisk sortering (H5)", blocks: [
          { type: "text", text: "En **topologisk sortering** av en rettet asyklisk graf (DAG) er en ordning av nodene der $u$ kommer før $v$ for **hver kant** $(u, v)$. Alle kanter peker altså fremover, eller: alt kommer etter det det avhenger av. Har grafen en sykel, finnes det ingen slik ordning. Det kan finnes mange topologiske sorteringer av samme graf (eksamen desember 2023, oppgave 1d)." },
        ] },
        { type: "text", text: "Det finnes flere algoritmer. Den **klassiske** bruker at hver ikke-tom nodemengde i en DAG har minst én node uten inn-kanter: velg og fjern én slik node om gangen, og rekkefølgen blir en topologisk sortering. Vi bruker heller en variant basert på DFS, trolig først beskrevet av Tarjan (lysarkene)." },
        { type: "pseudocode", title: "Topological-Sort(G)", lines: [
          "call DFS(G) to compute finish times v.f for each vertex v",
          "as each vertex is finished, insert it onto the front of a linked list",
          "return the linked list of vertices",
        ], caption: "Linje 1: vi trenger egentlig ikke $f$-verdiene, bare **rekkefølgen** nodene blir ferdige i. Linje 2: må flettes inn i DFS-Visit, rett etter at $u.f$ settes. Å sette inn først i en lenket liste tar $O(1)$, så hele algoritmen tar $\\Theta(V + E)$." },
        { type: "figure", component: TopoSortFigure, caption: "Lysarkenes påkledningseksempel (også i CLRS 20.4). Kanten $u \\to v$ betyr at $u$ må på før $v$. DFS-løkka prøver skjorte først, og deretter klokke, truse og sokker. Ordnet etter synkende ferdigtid går alle kantene mot høyre. Klokke har ingen kanter og kan stå hvor som helst. En annen rekkefølge i DFS-løkka gir en annen, like gyldig, sortering." },
        { type: "box", variant: "theorem", title: "Hvorfor synkende ferdigtid virker (CLRS teorem 20.12)", blocks: [
          { type: "text", text: "Vi må vise at $v.f < u.f$ for hver kant $(u, v)$. Se på tidspunktet da DFS undersøker kanten:" },
          { type: "list", items: [
            "**$v$ er hvit:** $v$ blir en etterkommer av $u$ og utforskes rekursivt, så $v.f < u.f$.",
            "**$v$ er svart:** $v$ er allerede ferdig, mens $u$ ikke er det, så $v.f < u.f$.",
            "**$v$ er grå:** da er $(u, v)$ en bakoverkant, og vi har en sykel. Umulig i en DAG.",
          ] },
          { type: "formula", latex: "(u, v) \\in E \\implies v.f < u.f", name: "Ferdigtider langs kantene i en DAG", caption: "Lysarkene: **stigende oppdagelsestid er ikke trygt**, men **synkende ferdigtid er trygt**. Med kanten $2 \\to 3$ kan DFS godt kalle DFS-Visit(G, 3) før DFS-Visit(G, 2), så 3 oppdages først, men 2 har likevel høyere ferdigtid." },
        ] },
        { type: "box", variant: "pitfall", title: "Ukens snubletråd: topologisk sortering og memoisering", blocks: [
          { type: "text", text: "Pensumheftet: prøv å forstå forholdet mellom topologisk sortering med DFS og rekursiv løsning av delinstanser i en memoisert algoritme. I DP med memoisering utfører vi **implisitt DFS** på delinstansgrafen: et kall blir ferdig først når alle delinstansene det trenger, er løst, og et memoisert svar svarer til en svart node. Hver delinstans løses derfor først etter alt den avhenger av. Det er en topologisk sortering av avhengighetene, oppnådd på nøyaktig samme måte som i Topological-Sort. Bottom-up DP må fylle tabellen i en slik rekkefølge, mens memoisering finner den automatisk." },
        ] },
        { type: "example", title: "Er dette en topologisk sortering? (øving 8, spm. 4)", blocks: [
          { type: "text", text: "Metoden fra løsningsforslaget: en sekvens er en topologisk sortering hvis **ingen kant** går fra en node til en node som står **tidligere** i sekvensen. Sjekk hver kant for hver sekvens. I oppgaven var $\\langle 3, 4, 5, 6, 1, 2 \\rangle$, $\\langle 4, 3, 5, 1, 6, 2 \\rangle$ og $\\langle 3, 4, 5, 1, 2, 6 \\rangle$ riktige." },
        ] },
        { type: "example", title: "Avhengigheter i praksis (øving 8, spm. 9, 13 og 26)", blocks: [
          { type: "list", items: [
            "**Emner med forkunnskapskrav (spm. 13):** én node per emne og en kant fra $a$ til $b$ hvis $a$ kreves før $b$. En gyldig rekkefølge er en topologisk sortering.",
            "**Pakkesystem (spm. 9):** før en pakke installeres, må alt den avhenger av være installert. Løsningsforslaget gjør en forenklet DFS: er pakken installert, returner; ellers installer avhengighetene rekursivt og så pakken. Flagget `is_installed` fungerer som farger: hvit eller svart. Pakkene installeres i stigende ferdigtid, akkurat som delinstansene i snubletråden.",
            "**Dynamisk tabell i stedet for lenket liste (spm. 26):** å sette inn **først** i en tabell flytter alle elementene og tar $\\Theta(n)$, så kjøretiden blir $\\Theta(V^2 + E)$. Løsning: sett inn **bakerst** (amortisert $O(1)$) og reverser til slutt, eller fyll en tabell av størrelse $|V|$ bakfra.",
          ] },
        ] },
        { type: "example", title: "Hamiltonsti gir én sortering (eksamen august 2026, oppgave 17)", blocks: [
          { type: "text", text: "Lurvik påstår at en DAG både (a) har minst to ulike topologiske sorteringer og (b) har en rettet hamiltonsti, en sti som besøker hver node nøyaktig én gang. **Det kan ikke stemme.** Hamiltonstien $v_1 \\to v_2 \\to \\dots \\to v_n$ har en kant mellom hvert påfølgende par, så $v_i$ må stå før $v_{i+1}$ i enhver topologisk sortering. Det gir en fullstendig ordning, og bare én mulig sortering." },
        ] },
        { type: "example", title: "Næringsinnhold i en DAG (eksamen august 2025, oppgave 11)", blocks: [
          { type: "text", text: "En kant $(u, v)$ med vekt $w(u, v)$ betyr at én enhet av $u$ inneholder $w(u, v)$ enheter av $v$, og grunnstoffene er nodene uten ut-kanter. Kjernen er en rekursiv traversering à la DFS som summerer mengder langs stiene. Uten mer følger vi alle stier, og det kan bli eksponentielt. Med **memoisering** (lagre næringsinnholdet per node når det er funnet) blir det lineært, og nodene blir ferdige i topologisk sortert rekkefølge. Løsningsforslaget legger vekt på hvordan delløsningene lagres og bygges videre på, ikke på å nevne topologisk sortering." },
        ] },
      ],
    },
    {
      id: "sterke-komponenter",
      title: "Sterke komponenter",
      blocks: [
        { type: "box", variant: "definition", title: "Sammenhengende og sterkt sammenhengende (H6)", blocks: [
          { type: "list", items: [
            "**Sammenhengende** (urettet graf): alle når alle. **Komponentene** er de maksimale sammenhengende delgrafene. Med DFS i en urettet graf er hvert dybde-først-tre én komponent (en bedre løsning kommer i forelesning 9).",
            "**Sterkt sammenhengende** (rettet graf): for alle par $u$, $v$ finnes både en sti $u \\rightsquigarrow v$ og en sti $v \\rightsquigarrow u$. De **sterke komponentene** er de maksimale sterkt sammenhengende delgrafene. Hver node er med i nøyaktig én.",
            "**Komponentgrafen** $G^{\\mathrm{SCC}}$: kollaps hver sterke komponent til én node. Den er en **DAG** (lemma 20.13): en sykel mellom komponenter ville gjort dem til én komponent.",
            "**Den transponerte grafen** $G^{\\mathsf{T}}$ har alle kantene snudd. Den har nøyaktig de samme sterke komponentene som $G$, og bygges i $\\Theta(V + E)$ med nabolister.",
          ] },
        ] },
        { type: "text", text: "Idéen fra lysarkene: i en urettet graf «blokkeres» DFS fordi det ikke finnes kanter videre ut av komponenten. Kan vi få til noe tilsvarende med sterke komponenter? Komponentgrafen er en DAG, så komponentene kan sorteres topologisk. Hvis vi snur alle kantene, peker alle kanter mellom komponenter **bakover**, mens innad i hver komponent spiller det ingen rolle. Starter vi en traversering i den første komponenten, blir den da fanget der, og hvert dybde-først-tre blir en sterk komponent. Spørsmålet er bare hvor vi skal starte, og svaret er noden med **høyest ferdigtid**: den må ligge i den første komponenten." },
        { type: "pseudocode", title: "Strongly-Connected-Components(G)", lines: [
          "call DFS(G) to compute finish times u.f for each vertex u",
          "create Gᵀ",
          "call DFS(Gᵀ), but in the main loop of DFS, consider the vertices in order of decreasing u.f (as computed in line 1)",
          "output the vertices of each tree in the depth-first forest formed in line 3 as a separate strongly connected component",
        ], caption: "CLRS 20.5. Linje 1: ferdigtider i den **opprinnelige** grafen. Linje 2: snu alle kantene. Linje 3: startnodene for DFS-Visit ordnes synkende etter $u.f$ fra linje 1. Linje 4: hver runde med traversering utforsker nøyaktig én sterk komponent. Alt tar $\\Theta(V + E)$." },
        { type: "figure", component: SccFigure, caption: "Strongly-Connected-Components på en klassisk eksempelgraf, med nodene i alfabetisk rekkefølge i første DFS. Andre DFS starter i $a$ (høyest ferdigtid) og når bare $a$, $e$ og $b$ i $G^{\\mathsf{T}}$. Deretter er $c$ den hvite noden med høyest ferdigtid, og så videre. Komponentene kommer ut i topologisk sortert rekkefølge for $G^{\\mathrm{SCC}}$. Lysarkene påpeker at det er usikkert hvor den **laveste** ferdigtiden havner, men den **høyeste** må ligge i en komponent uten inn-kanter fra andre komponenter." },
        { type: "box", variant: "theorem", title: "Hvorfor virker det? (CLRS lemma 20.14, korollar 20.15 og teorem 20.16)", blocks: [
          { type: "text", text: "For en mengde noder $C$ lar vi $d(C)$ være den tidligste oppdagelsestiden og $f(C)$ den seneste ferdigtiden i første DFS." },
          { type: "formula", latex: "(u, v) \\in E,\\ u \\in C,\\ v \\in C' \\implies f(C) > f(C')", name: "Ferdigtider mellom sterke komponenter (lemma 20.14)", caption: "**Bevis:** hvis $d(C) < d(C')$, la $x$ være den første noden i $C$ som oppdages. Da er alle nodene i $C$ og $C'$ hvite, og det går en hvit sti fra $x$ til alle. Etter hvit-sti-teoremet blir alle etterkommere av $x$, så $f(C) = x.f > f(C')$. Hvis $d(C) > d(C')$, blir hele $C'$ ferdig før noe i $C$ oppdages, fordi ingen sti kan gå tilbake fra $C'$ til $C$ (da ville de vært samme komponent)." },
          { type: "list", items: [
            "**Korollar 20.15:** i $G^{\\mathsf{T}}$ er det motsatt. En kant fra $C$ til $C'$ i $G^{\\mathsf{T}}$ betyr $f(C) < f(C')$.",
            "**Teorem 20.16 (induksjon på antall trær):** når andre DFS starter i den hvite noden $x$ med høyest ferdigtid, går alle kanter ut av komponenten til $x$ i $G^{\\mathsf{T}}$ til komponenter med **høyere** $f$, som allerede er besøkt. Traverseringen når derfor hele komponenten til $x$, men ingenting mer.",
          ] },
        ] },
        { type: "example", title: "Sterke komponenter i øving 8 (spm. 17–20)", blocks: [
          { type: "list", items: [
            "**Spm. 17:** besøkes $A$ først i første DFS, får $A$ høyest ferdigtid og er startnoden i andre DFS. Den første komponenten som oppdages, er derfor komponenten til $A$: nodene A, B, F og G.",
            "**Spm. 18:** komponentene var A, B, F og G sammen, og så C, D, E og H hver for seg: **5** sterke komponenter.",
            "**Spm. 19:** en graf med $n$ noder og $n$ komponenter får en ny kant. Antallet kan **minke med opptil $n - 1$**: er grafen en rettet sti, gjør den nye kanten den til én rettet sykel. Uten noen kanter fra før endrer én ny kant ingenting.",
            "**Spm. 20:** er $m < n - 1$, er det alltid mer enn én sterk komponent. Antallet er alltid mellom 1 og $n$, aldri 0 og aldri over $n$. **Pass på løsningsforslaget:** det sier at en sykel gjennom alle $n$ nodene kan lages med $n - 1$ kanter, men den krever $n$ kanter, siden hver node trenger en ut-kant. Svaret er riktig likevel, og påstanden om $m \\ge n - 1$ er feil fordi en rettet sti har $n - 1$ kanter og $n$ komponenter.",
          ] },
        ] },
        { type: "example", title: "Hvordan kan én ny kant endre antallet? (eksamen desember 2025, oppgave 10)", blocks: [
          { type: "text", text: "Med $n$ noder kan vi gå fra $n$ sterke komponenter til **1**. Det skjer for eksempel hvis grafen er en rettet sti, og vi legger til kanten fra siste til første node, så grafen blir en rettet sykel. Mindre endringer er også mulige, og antallet kan aldri **øke**: alle stier som fantes, finnes fortsatt. Dette er oppgave 20.5-1 i boka." },
        ] },
      ],
    },
    {
      id: "stakk",
      title: "DFS med stakk, og kjøretider",
      blocks: [
        { type: "text", text: "Pensumheftet (appendiks F): BFS og DFS fremstilles ganske ulikt i boka, men de er nært beslektet. Bytter vi ut FIFO-køen i BFS med en LIFO-kø, en **stakk**, oppfører den seg **omtrent** som DFS-Visit. Grunnen er at vi bare simulerer hvordan rekursjon er implementert: maskinen har en kallstakk der hvert kall legges øverst og hentes frem igjen når de rekursive kallene er ferdige. Lysarkene: «Så langt: rekursiv traversering. Kallstakken fungerer som en LIFO-kø. Vi kan bruke alle slags køer!»" },
        { type: "pseudocode", title: "DFS-Stack(G, s)", lines: [
          "for each vertex u ∈ G.V",
          "    u.color = white",
          "    u.π = nil",
          "S = ∅",
          "Push(S, s)",
          "while S ≠ ∅",
          "    u = Pop(S)",
          "    if u.color == white",
          "        u.color = black",
          "        for each v ∈ G.Adj[u], in reverse order",
          "            if v.color == white",
          "                v.π = u",
          "                Push(S, v)",
        ], caption: "Vår skrivemåte (H7), siden boka ikke har den. Linje 8: en node kan ligge flere ganger på stakken, så vi besøker den bare første gang den tas ut. Linje 10: naboene legges på i **omvendt** rekkefølge, slik at den første naboen havner øverst og besøkes først, som i DFS-Visit. Linje 12: hvis $v$ legges på flere ganger, vinner den siste, og det er den som tas ut først. Hver kant gir høyst én Push, så tiden er $O(V + E)$." },
        { type: "figure", component: StackDfsFigure, caption: "DFS-Stack(G, 1) på eksempelgrafen. Besøksrekkefølgen blir den samme som oppdagelsesrekkefølgen til den rekursive DFS-en. Den siste linjen viser poenget i pensumheftets «omtrent»: gjør vi BFS med en stakk og merker nodene grå når de legges på, får vi også et dybde-først-søk, men nodene merkes for tidlig, og rekkefølgen og treet kan bli annerledes enn med DFS-Visit." },
        { type: "box", variant: "tip", title: "Ferdigtider med stakk", blocks: [
          { type: "text", text: "Versjonen over gir oppdagelsesrekkefølgen, men ikke $u.f$. Trenger vi ferdigtider (topologisk sortering, sterke komponenter), kan vi legge $u$ på stakken **igjen**, med et merke om at den er ferdig, før naboene legges på. Når merket tas ut, er alle etterkommerne ferdige, og vi setter $u.f$. Et alternativ er å legge par av en node og en peker til neste nabo på stakken, slik maskinen gjør med lokale variabler i et rekursivt kall. Iterasjon slipper ekstrakostnaden ved funksjonskall og problemet med for dyp rekursjon i store grafer." },
        ] },
        { type: "table", head: ["Algoritme", "Kjøretid (nabolister)", "Huskeliste", "Merknad"], rows: [
          ["BFS", "$O(V + E)$, beste $\\Theta(V)$", "FIFO-kø", "bare fra $s$; korteste vei uten vekter"],
          ["DFS", "$\\Theta(V + E)$", "kallstakk", "fra alle noder; tidsstempler"],
          ["Topological-Sort", "$\\Theta(V + E)$", "kallstakk", "krever DAG; lenket liste"],
          ["Strongly-Connected-Components", "$\\Theta(V + E)$", "kallstakk", "to DFS og $G^{\\mathsf{T}}$"],
          ["Traversering med binærhaug", "$O(E \\lg V)$", "prioritetskø", "Prim, Dijkstra"],
        ], caption: "Lysarkene: alle noder farges grå og svarte og alle kanter undersøkes i DFS, så beste og verste tilfelle er like. Best-case er ikke $O(1)$ for BFS heller, fordi bokas versjon initialiserer alle nodene. Med en hashtabell for fargene, fylt etter behov, kunne vi fått det, men slik gjør ikke boka det." },
        { type: "example", title: "Hvilken kø bruker BFS og DFS? (øving 8, spm. 7 og 8)", blocks: [
          { type: "list", items: [
            "**Spm. 7:** BFS bruker en **kø**, DFS en **stakk**. I BFS vil vi besøke nodene i samme rekkefølge som de oppdages, og i DFS den sist oppdagede først.",
            "**Spm. 8:** bruker BFS en stakk, får vi et **dybde-først-søk av nodene som kan nås fra startnoden**. Ikke av alle nodene, for BFS har ingen ytre løkke over alle nodene.",
          ] },
        ] },
        { type: "example", title: "Prioritetskø på d: Dijkstra i forkledning (øving 8, spm. 27, frempek)", blocks: [
          { type: "text", text: "Traverser en vektet graf fra $s$ med en min-prioritetskø, der prioriteten er avstandsestimatet $v.d$, og oppdater $v.d = u.d + w(u, v)$ når det blir bedre. Er $u.d$ da korteste avstand når $u$ tas ut? **Ja, hvis alle kantvektene er ikke-negative.** Dette er Dijkstras algoritme, med korrekthetsbevis i CLRS 22.3 (forelesning 10). Med negative kanter kan noden med lavest estimat få et enda lavere estimat senere (eksamen desember 2025, oppgave 11)." },
        ] },
      ],
    },
    {
      id: "oving",
      title: "Øv på øvings- og eksamensoppgaver",
      blocks: [
        { type: "box", variant: "tip", title: "Oppskrift for en traverseringsoppgave på eksamen", blocks: [
          { type: "list", ordered: true, items: [
            "**Modeller som graf:** hva er nodene (tilstander, ruter, personer, pakker), og hva er kantene? Er grafen rettet, og er den gitt eksplisitt eller implisitt?",
            "**Velg verktøy:** korteste vei uten vekter gir BFS. Rekkefølge med avhengigheter gir topologisk sortering. Sykler gir DFS og bakoverkanter. Forfar og etterkommer gir tidsstempler. «Alle når alle» gir sterke komponenter. Bare nåbarhet gir hvilken som helst traversering.",
            "**Juster om nødvendig:** snu kantene, legg til en ekstra startnode med kanter til flere noder, eller start fra flere noder.",
            "**Kjøretid:** $O(V + E)$ med nabolister. Husk å regne med tiden det tar å bygge grafen.",
          ] },
        ] },
        { type: "example", title: "Korteste vei til én node (eksamen august 2024, oppgave 7)", blocks: [
          { type: "text", text: "Du har en rettet, uvektet graf og vil finne korteste vei fra **alle** noder til én node $t$. **Snu retningen på alle kantene og kjør BFS fra $t$.** En sti fra $v$ til $t$ i $G$ er en sti fra $t$ til $v$ i $G^{\\mathsf{T}}$, så $v.d$ i den snudde grafen er avstanden fra $v$ til $t$, og $v.\\pi$ er neste node på veien mot $t$." },
        ] },
        { type: "example", title: "Homomorfi til K3,3 er tofarging (eksamen desember 2025, oppgave 20)", blocks: [
          { type: "text", text: "Finnes en funksjon fra nodene i $G$ til nodene i den komplette bipartitte grafen $K_{3,3}$ som bevarer naboskap? Vi kan slå sammen nodene på hver side av $K_{3,3}$, så det holder å bruke to noder med en kant mellom, altså spørsmålet er om $G$ er **bipartitt**. Traverser $G$, og gi hver node motsatt farge av noden den ble oppdaget fra. Med BFS er det bare å bruke pariteten til $v.d$. Møter vi en kant mellom to noder med lik farge, har grafen en odde sykel, og ingen homomorfi finnes. Lineær tid, og generelt: er $H$ bipartitt, avgjøres problemet ved å sjekke om $G$ er tofargbar." },
        ] },
        { type: "example", title: "Søppeltømming er nåbarhet (øving 8, spm. 21)", blocks: [
          { type: "text", text: "Objektene i minnet er noder og referansene er kanter. Objektene i bruk er nøyaktig de som kan nås fra kjerneobjektene. Kjør BFS eller DFS med **alle kjerneobjektene som startnoder** (som om én ekstra node hadde kanter til dem), og marker alt som besøkes. Resten kan frigjøres. Dette er «mark»-fasen i mark-and-sweep." },
        ] },
        { type: "example", title: "Kontrollspørsmål fra øving 8 (spm. 15 og 16)", blocks: [
          { type: "list", items: [
            "**BFS:** kan finne korteste vei når alle kantvektene er like og ikke-negative. Den fungerer fint med sykler, men besøker ikke nødvendigvis alle nodene.",
            "**DFS:** kan brukes til kantklassifisering og besøker garantert alle nodene (den ytre løkka). Den fungerer med sykler, men finner ikke korteste vei.",
          ] },
        ] },
        { type: "quiz", items: [
          { question: "Hva er plassbehovet til nabolister og nabomatrise?", answer: "$\\Theta(V + E)$ for nabolister og $\\Theta(V^2)$ for nabomatrise (øving 8, spm. 10)." },
          { question: "Hvor lang tid tar det å sjekke om kanten $(u, v)$ finnes?", answer: "$O(V)$ med nabolister, siden vi kanskje må lete gjennom hele $G.\\mathit{Adj}[u]$, og $O(1)$ med nabomatrise (øving 8, spm. 11)." },
          { question: "Hva betyr de tre fargene i BFS og DFS?", answer: "Hvit: uoppdaget. Grå: oppdaget, men ikke ferdig, altså i køen (BFS) eller på kallstakken (DFS). Svart: ferdig." },
          { question: "Hvorfor finner BFS korteste vei, og hva må gjelde for grafen?", answer: "FIFO-køen gjør at nodene oppdages i ikke-synkende avstand fra $s$, lag for lag, så hver node oppdages første gang via en korteste vei (teorem 20.5). Det gjelder antall kanter, altså uten vekter eller med like vekter." },
          { question: "Hvordan skriver Print-Path ut stien fra $s$ til $v$?", answer: "Rekursivt langs forgjengerne: hvis $v = s$, skriv $s$; hvis $v.\\pi$ er nil, finnes ingen sti; ellers skriv stien til $v.\\pi$ og så $v$." },
          { question: "Hvorfor er kjøretiden til BFS $O(V + E)$ og ikke $O(VE)$?", answer: "Hver node legges i køen høyst én gang, og hver naboliste gjennomgås bare når noden tas ut. Totalt gir det $O(V)$ køoperasjoner og $O(E)$ kantundersøkelser, pluss $O(V)$ initialisering." },
          { question: "Hva sier parentesteoremet?", answer: "For to noder er intervallene $[u.d, u.f]$ og $[v.d, v.f]$ enten disjunkte (ingen er etterkommer av den andre) eller det ene ligger helt inni det andre (og den noden er en etterkommer)." },
          { question: "Hva sier hvit-sti-teoremet?", answer: "$v$ blir en etterkommer av $u$ i dybde-først-skogen hvis og bare hvis det, da $u$ ble oppdaget, fantes en sti fra $u$ til $v$ med bare hvite noder." },
          { question: "Hvordan klassifiseres kanten $(u, v)$ under DFS?", answer: "$v$ hvit: trekant. $v$ grå: bakoverkant. $v$ svart og $u.d < v.d$: foroverkant. $v$ svart og $u.d > v.d$: krysskant." },
          { question: "Hvilke kanttyper finnes i en urettet graf og i en DAG?", answer: "Urettet: bare tre- og bakoverkanter (teorem 20.10). DAG: tre-, forover- og krysskanter, men ingen bakoverkanter (lemma 20.11 og øving 8, spm. 24)." },
          { question: "Hvorfor gir synkende ferdigtid en topologisk sortering?", answer: "For hver kant $(u, v)$ er $v$ enten hvit (blir etterkommer og ferdig først) eller svart (allerede ferdig) når kanten undersøkes, så $v.f < u.f$. Grå $v$ ville betydd en bakoverkant og en sykel." },
          { question: "Beskriv Strongly-Connected-Components.", answer: "DFS på $G$ for å få ferdigtider, lag $G^{\\mathsf{T}}$, kjør DFS på $G^{\\mathsf{T}}$ med startnoder i synkende ferdigtid fra første runde, og skriv ut hvert dybde-først-tre som en sterk komponent. $\\Theta(V + E)$." },
          { question: "Hvorfor må andre runde av SCC starte i noden med høyest ferdigtid?", answer: "Den ligger i en komponent uten inn-kanter fra andre komponenter i $G$ (lemma 20.14). I $G^{\\mathsf{T}}$ har komponenten da ingen ut-kanter til uutforskede komponenter, så traverseringen blir fanget i den." },
          { question: "Hva skjer hvis BFS bruker en stakk i stedet for en kø?", answer: "Vi får et dybde-først-søk av nodene som kan nås fra startnoden (øving 8, spm. 8), men ikke nødvendigvis i samme rekkefølge som DFS-Visit, fordi nodene merkes når de legges på stakken." },
          { question: "Hvilken huskeliste gir Dijkstra og Prim?", answer: "En min-prioritetskø. Dijkstra prioriterer lavest avstandsestimat $v.d$, Prim noden med lettest kant til de besøkte nodene. Med binærhaug: $O(E \\lg V)$." },
          { question: "En DAG har en hamiltonsti. Hvor mange topologiske sorteringer har den?", answer: "Nøyaktig én: kantene langs hamiltonstien bestemmer rekkefølgen på alle nodene (eksamen august 2026, oppgave 17)." },
        ] },
      ],
    },
  ],
};
