import type { Lesson } from "../types";
import { CliqueFigure, DecompositionFigure, HardnessFigure, KeepManyFigure, ReductionTypesFigure, RelationFigure } from "./figures02b";

const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view`, kind: "drive" as const });

// Based on the pensum booklet (lecture 2b, goals B6–B7, appendix B.1), the lecture slides,
// the exercise 2b solution and the reviewed note "Forelesning 2b - Problemer og reduksjoner".
export const lesson: Lesson = {
  subjectId: "tdt4120",
  unitId: "02b",
  reviewed: "2026-11-02",
  summary: "Forelesningen gir språket resten av faget bygger på: hva et **problem** er, forskjellen på å **finne**, **verifisere** og **avgjøre**, hvordan **reduksjoner** lar oss løse ett problem med et annet, og hvordan **dekomponering** og induksjon henger sammen. Stoffet er støttelitteratur (appendiks B.1), men ideene kommer igjen hele semesteret.",
  overview: [
    "**Problem** = relasjon $R$ mellom input og riktige output. **Instans** = én input. Noen input har ingen løsning.",
    "**Søkeproblem:** finn $y$ med $(x, y) \\in R$. **Verifisering:** sjekk en gitt $y$ (et sertifikat). **Beslutningsproblem:** finnes en $y$? (ja/nei)",
    "**Optimeringsproblem:** finn den beste løsningen. Tilhørende **terskling:** finnes en løsning med verdi høyst (eller minst) $k$?",
    "Å **verifisere** kan være mye lettere enn å **finne**: Sorts tar $\\Theta(n)$, mens å finne permutasjonen krever $\\Omega(n \\lg n)$.",
    "**Reduksjon** $X \\le Y$: løs $X$ med litt arbeid og et orakel for $Y$. Turing: vilkårlig mange kall. Cook: polynomisk tid. Levin: ett kall, $f$ fram og $g$ tilbake. Karp: ett kall til slutt, $x \\in X \\iff f(x) \\in Y$.",
    "**Vanskegrad:** $X \\le Y$ gir at $Y$ lett $\\Rightarrow$ $X$ lett, og $X$ vanskelig $\\Rightarrow$ $Y$ vanskelig. For å vise at $Y$ er vanskelig, reduser **fra** et vanskelig problem **til** $Y$.",
    "**Dekomponering:** del opp, anta at delinstansene er løst (induksjonshypotesen) og kombiner. Riktig hvis grunntilfelle, dekomponering og kombinasjon er riktige.",
  ],
  keyFormulas: [
    { latex: "R \\subseteq \\{0,1\\}^{*} \\times \\{0,1\\}^{*}", label: "Problem som relasjon" },
    { latex: "x \\in X \\iff f(x) \\in Y", label: "Karp-reduksjon" },
    { latex: "\\text{Karp, Levin} \\subset \\text{Cook} \\subset \\text{Turing}", label: "Forholdet mellom typene" },
  ],
  goals: [
    "Forstå definisjonene av søkeproblemer, beslutningsproblemer og optimeringsproblemer **(B6)**",
    "Forstå reduksjonstypene Turing, Cook, Levin og Karp, og forholdet mellom dem **(B7)**",
    "Støtter også induksjon og løkkeinvarianter **(A7)**, rekursiv dekomponering **(C1)** og reduserbarhet som relativ vanskegrad **(M6)**",
  ],
  concepts: [
    "problem-as-relation", "instans", "bitstring", "search-problem", "decision-problem", "optimization-problem",
    "reduction", "oracle", "turing-reduction", "cook-reduction", "levin-reduction", "karp-reduction",
    "decomposition", "recursive-decomposition", "incremental-method", "induksjon", "induction-hypothesis", "lokkeinvariant", "subrutine",
  ],
  notes: [{ slug: "forelesning-2b-problemer-og-reduksjoner", label: "Forelesning 2b - Problemer og reduksjoner" }],
  sources: [
    drive("Pensumhefte 2026, forelesning 2b og appendiks B.1", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
    drive("Forelesning 2b (lysark)", "1JJTfoI289vlg8xx3Jj__BHSCLMkCZhsN"),
    drive("Løsningsforslag øving 2b", "1b03de0NzBw2qWH36M1m1Hc_EGuHtX9cK"),
    { label: "Forelesning 2b - Problemer og reduksjoner", url: "forelesning-2b-problemer-og-reduksjoner", kind: "note" },
  ],
  sections: [
    {
      id: "problemer",
      title: "Problemer, instanser og problemtyper",
      blocks: [
        { type: "text", text: "Et **generelt problem** som «sortering» er en familie av **instanser**, som «sorter $\\langle 5, 2, 4, 6, 1, 3 \\rangle$». Hva som er riktig svar, beskrives som en binær **relasjon** $R$: $(x, y) \\in R$ betyr at $y$ er et riktig svar for input $x$. Input og output kodes som bitstrenger." },
        { type: "formula", latex: "R \\subseteq I \\times O, \\qquad (x, y) \\in R \\iff y \\text{ er et riktig svar for } x", name: "Problem som relasjon" },
        { type: "figure", component: RelationFigure, caption: "En input kan ha ett, flere eller ingen riktige svar. For ugyldig input kan en algoritme gjøre hva som helst." },
        { type: "table", head: ["Oppgave", "Spørsmål", "Svar"], rows: [
          ["Søkeproblem", "Finn en $y$ slik at $(x, y) \\in R$", "en løsning, eller beskjed om at ingen finnes"],
          ["Verifisering", "Er den gitte $y$ riktig?", "ja / nei"],
          ["Beslutningsproblem", "Finnes det en $y$ med $(x, y) \\in R$?", "ja / nei"],
        ], caption: "Den påståtte løsningen vi verifiserer, kalles et sertifikat eller vitne." },
        { type: "box", variant: "definition", title: "Beslutnings- og optimeringsproblem", blocks: [
          { type: "list", items: [
            "Et **beslutningsproblem** defineres ofte som mengden av ja-instanser. Oppgaven er å avgjøre om $x$ er med i mengden.",
            "Et **optimeringsproblem** er et søkeproblem der hver løsning har en verdi, og vi vil ha den beste. Det har et tilhørende **tersklingsproblem**: finnes en løsning med verdi høyst (eller minst) $k$?",
          ] },
        ] },
        { type: "text", text: "**Verifisere kontra finne.** `Is-Sorted` sjekker bare at output er sortert. En ekte verifisering må sjekke output mot input, for eksempel med en permutasjon $\\pi$ som sorterer $A$:" },
        { type: "pseudocode", title: "Sorts(A, π, n)", lines: [
          "for i = 1 to n - 1",
          "    if A[π[i]] > A[π[i + 1]]",
          "        return false",
          "return true",
        ], caption: "$\\Theta(n)$. At $\\pi$ er en permutasjon, kan også sjekkes i lineær tid. Å finne $\\pi$ krever $\\Omega(n \\lg n)$ i verste tilfelle (forelesning 4)." },
        { type: "figure", component: CliqueFigure, caption: "CLIQUE: instansen er en urettet graf $G$ og et tall $k$, og en løsning er en komplett delgraf med $k$ noder. Lett å sjekke, men vanskelig å finne i praksis." },
        { type: "box", variant: "tip", title: "P mot NP", blocks: [
          { type: "text", text: "Om det finnes problemer som kan verifiseres i polynomisk tid, men ikke løses i polynomisk tid, er det åpne spørsmålet P = NP. Det kommer i forelesning 13." },
        ] },
      ],
    },
    {
      id: "reduksjoner",
      title: "Reduksjoner",
      blocks: [
        { type: "text", text: "En **reduksjon** fra $X$ til $Y$ løser $X$ ved å gjøre litt arbeid og overlate resten til en tenkt løsning på $Y$, et **orakel**. Vi markerer det som gjenstår med en `TODO`. Kjøretiden regnes med orakelkall som $O(1)$, og reduksjonen er riktig hvis vi får rett svar når orakelet svarer rett." },
        { type: "pseudocode", title: "Unique(A, n)", lines: [
          "Insertion-Sort(A, n)",
          "// TODO: Er naboverdier forskjellige?",
        ], caption: "Etter sortering ligger like verdier ved siden av hverandre, så det holder å sjekke naboer. Med Merge-Sort i stedet blir hele algoritmen $\\Theta(n \\lg n)$." },
        { type: "table", head: ["Type", "Orakelkall", "Tid", "Svaret fra $Y$"], rows: [
          ["Turing", "vilkårlig mange", "ingen krav", "brukes fritt"],
          ["Cook", "vilkårlig mange", "polynomisk", "brukes fritt, kan kastes"],
          ["Levin", "nøyaktig ett", "polynomisk", "oversettes tilbake med $g(x, y)$; hver $Y$-løsning må gi en $X$-løsning"],
          ["Karp", "nøyaktig ett, til slutt", "polynomisk", "returneres direkte (ja/nei)"],
        ] },
        { type: "figure", component: ReductionTypesFigure, caption: "Figur B.1 i pensumheftet, tegnet på nytt. Levin og Karp er spesialtilfeller av Cook." },
        { type: "formula", latex: "x \\in X \\iff f(x) \\in Y", name: "Karp-reduksjon", caption: "Karp-reduksjoner brukes til å definere NP-kompletthet (boka, figur 34.1). Unique er en Karp-reduksjon." },
        { type: "box", variant: "tip", title: "Slik avgjør du typen", blocks: [
          { type: "list", ordered: true, items: [
            "Polynomisk tid? Hvis ikke: Turing.",
            "Mer enn ett orakelkall, eller kastes svaret? Da er det Cook.",
            "Ett kall, og hver $Y$-løsning gir en $X$-løsning via $g$? Levin.",
            "Ett kall helt til slutt, og ja/nei returneres uendret? Karp.",
          ] },
        ] },
        { type: "text", text: "En Levin-reduksjon $(f, g)$ mellom to søkeproblemer gir en Karp-reduksjon for beslutningsproblemene, med samme $f$: har $f(x)$ en løsning $y$, gir $g(x, y)$ en løsning på $x$, og omvendt kan ikke $f(x)$ mangle løsning når $x$ har en." },
      ],
    },
    {
      id: "vanskegrad",
      title: "Reduksjoner og vanskegrad",
      blocks: [
        { type: "text", text: "Lysarkene bruker en skattekiste med lås: å åpne kista reduseres til å åpne låsen. Låsen kan ikke være lettere å åpne enn kista. Generelt leser vi $X \\le Y$ som «$X$ er høyst like vanskelig som $Y$»." },
        { type: "formula", latex: "X \\le Y: \\quad Y \\text{ lett} \\Rightarrow X \\text{ lett}, \\qquad X \\text{ vanskelig} \\Rightarrow Y \\text{ vanskelig}", name: "Reduksjoner og vanskegrad" },
        { type: "figure", component: HardnessFigure, caption: "Bare to av de fire slutningene holder. De to nederste er de vanlige feilene." },
        { type: "box", variant: "pitfall", title: "Feil retning", blocks: [
          { type: "text", text: "Å redusere **til** et vanskelig problem sier ingenting. Pensumheftets eksempel: å knuse laptopen med en hammer og så gjøre øvingen beviser ikke at øvingen er umulig. For å vise at $Y$ er vanskelig, reduser **fra** et kjent vanskelig problem **til** $Y$." },
        ] },
        { type: "text", text: "**Optimering og terskling.** Terskling kan løses med optimering: finn optimum og sammenlign med $k$. Optimering kan også løses med terskling, ved å prøve $k = 0, 1, 2, \\ldots$ eller ved binærsøk på $k$. Når verdiene er heltall vi kan regne med i konstant tid, blir begge veier polynomiske Cook-reduksjoner, og da er problemene like vanskelige." },
        { type: "pseudocode", title: "Find-Shortest-Path(G, s, t)", lines: [
          "for k = 0 to |G.V| - 1",
          "    // TODO: Find a path p with length ≤ k from s to t",
          "    if p ≠ NIL",
          "        return p",
        ], caption: "Uvektet graf: den korteste stien har høyst $|V| - 1$ kanter. Opptil $|V|$ orakelkall, så dette er en Cook-reduksjon." },
      ],
    },
    {
      id: "dekomponering",
      title: "Dekomponering og induksjon",
      blocks: [
        { type: "text", text: "Dekomponering bruker reduksjonstanken inni ett problem: reduser en instans til mindre instanser av **samme** problem. Fokuser på ett representativt trinn." },
        { type: "list", ordered: true, items: [
          "**Del opp** instansen i én eller flere delinstanser.",
          "**Induksjonshypotese:** anta at delinstansene er løst riktig.",
          "**Kombiner** delsvarene til et svar.",
          "**Grunntilfelle:** sørg for at det stopper, og at de minste tilfellene blir riktige.",
        ] },
        { type: "figure", component: DecompositionFigure, caption: "Insertion-Sort som dekomponering (den inkrementelle metoden): kutt av siste element, sorter resten, og sett elementet inn. Alt arbeidet ligger i kombinasjonen." },
        { type: "formula", latex: "P(1) \\;\\land\\; \\forall n > 1\\,\\bigl(P(n-1) \\Rightarrow P(n)\\bigr) \\;\\Longrightarrow\\; \\forall n\\; P(n)", name: "Induksjonsprinsippet" },
        { type: "text", text: "En **løkkeinvariant** er samme bevis for løkker: initialisering tilsvarer grunntilfellet, vedlikehold induksjonstrinnet, og terminering gir konklusjonen. Selection-Sort gjør det motsatt av Insertion-Sort: arbeidet ligger i delingen (finn og flytt ut det største), og kombinasjonen er gratis. Begge er $\\Theta(n^2)$ i verste tilfelle." },
        { type: "box", variant: "tip", title: "Kommer igjen i forelesning 3", blocks: [
          { type: "text", text: "Merge-Sort deler gratis og jobber i kombinasjonen. Quicksort jobber i delingen og kombinerer gratis." },
        ] },
      ],
    },
    {
      id: "oving",
      title: "Øv på eksamensoppgaver",
      blocks: [
        { type: "example", title: "Flest mulig blant $n$ personer slik at alle kjenner minst $k$ av de andre (eksamen august 2010)", blocks: [
          { type: "text", text: "En person som kjenner færre enn $k$ av de gjenværende, kan aldri være med. Fjern den og løs den mindre instansen på samme måte. Når ingen kan fjernes, er alle de gjenværende med. Hver fjerning er tvunget, så vi fjerner aldri noen som kunne vært med." },
          { type: "figure", component: KeepManyFigure, caption: "Med $k = 2$: F kjenner bare 1 og fjernes. Da kjenner E bare 1, og så D. Igjen er $\\{A, B, C\\}$." },
          { type: "text", text: "Varianten «færrest mulig, men minst én» ser nesten lik ut, men er vanskelig: en gruppe der alle kjenner minst $k$ andre, har minst $k + 1$ personer, og en slik gruppe med nøyaktig $k + 1$ personer er en klikk. Altså kan CLIQUE reduseres til den." },
        ] },
        { type: "example", title: "Hvilken reduksjonstype er det?", blocks: [
          { type: "pseudocode", title: "Has-Clique(G, k)", lines: [
            "// TODO: finn en klikk H med k noder (søkeorakel)",
            "if H == NIL",
            "    return false",
            "else return true",
          ] },
          { type: "text", text: "Ett kall, men orakelet løser et søkeproblem, og svaret gjøres om til ja/nei. Ikke Karp (orakelet er ikke et beslutningsproblem) og ikke Levin (vi produserer ingen løsning). Polynomisk, så **Cook**." },
        ] },
        { type: "example", title: "Binærsøk på terskelen", blocks: [
          { type: "text", text: "Vi har en sti med vekt 20, og den korteste har vekt 13. Med `lo, hi = 0, 20` spør vi om $k = 10$ (nei, $lo = 11$), $k = 15$ (ja, $hi = 15$), $k = 13$ (ja, $hi = 13$) og $k = 12$ (nei, $lo = 13$). Da er $lo = hi = 13$. Antall kall er $O(\\lg w)$, altså polynomisk i antall bits." },
        ] },
        { type: "quiz", items: [
          { question: "«Finnes en sti fra $s$ til $t$ med lengde høyst 10?» Hvilken problemtype?", answer: "**Beslutningsproblem** (terskling for korteste sti)." },
          { question: "«Er $\\langle s, a, b, t \\rangle$ en sti i grafen?» Hvilken problemtype?", answer: "**Verifisering:** vi får en påstått løsning og sjekker den." },
          { question: "$A \\le B$ og $A$ er lett. Er $B$ lett?", answer: "**Nei, ikke nødvendigvis.** Kista kan være lett å åpne selv om låsen er solid." },
          { question: "$A \\le B$ og $A$ er vanskelig. Er $B$ vanskelig?", answer: "**Ja.** Ellers kunne vi løst $A$ via reduksjonen og en rask algoritme for $B$." },
          { question: "Max via sortering: «TODO: sorter $A$», så returner $A[n]$. Hvilken type?", answer: "**Levin:** instansen sendes uendret fram, ett kall, og enhver sortert utgave gir riktig svar tilbake med $g$ = «ta siste element»." },
        ] },
      ],
    },
  ],
};
