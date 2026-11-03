// Figures for lecture 5, drawn from the examples in the lecture slides, CLRS chapters 6, 10.3 and 12, and exercise 5.
// Heap and Heapsort traces were computed from the CLRS pseudocode.
import { Svg } from "../figureKit";

type Point = { x: number; y: number };

function Node({ x, y, label, tone = "lf-box", r = 17, dashed = false }: Point & { label: string | number; tone?: string; r?: number; dashed?: boolean }) {
  return <g>
    <circle cx={x} cy={y} r={r} className={`${tone}${dashed ? " lf-dashed" : ""}`} />
    <text x={x} y={y + 4.5} textAnchor="middle" className={`lf-text lf-strong${r < 15 ? " lf-small" : ""}`}>{label}</text>
  </g>;
}

function Edge({ from, to, accent = false, dashed = false }: { from: Point; to: Point; accent?: boolean; dashed?: boolean }) {
  return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`lf-line${accent ? " lf-stroke-accent" : ""}${dashed ? " lf-dashed" : ""}`} />;
}

/** A tree given as id → position and label, with edges as [parent, child] pairs. */
function Tree({ nodes, edges, tone = () => "lf-box", accentEdges = [], r = 17 }: {
  nodes: Record<string, Point & { label: string | number }>; edges: [string, string][]; tone?: (id: string) => string;
  accentEdges?: string[]; r?: number;
}) {
  return <g>
    {edges.map(([a, b]) => <Edge key={`${a}-${b}`} from={nodes[a]} to={nodes[b]} accent={accentEdges.includes(`${a}-${b}`)} />)}
    {Object.entries(nodes).map(([id, node]) => <Node key={id} {...node} tone={tone(id)} r={r} />)}
  </g>;
}

/** A binary heap A[1 : n] drawn as a tree: index i sits on level ⌊lg i⌋. */
function HeapTree({ values, x, y, width, gap = 52, r = 15, tone = () => "lf-box", showIndex = false }: {
  values: number[]; x: number; y: number; width: number; gap?: number; r?: number; tone?: (index: number) => string; showIndex?: boolean;
}) {
  const at = (i: number) => {
    const level = Math.floor(Math.log2(i)), slot = i - 2 ** level;
    return { x: x + (slot + 0.5) * width / 2 ** level, y: y + level * gap };
  };
  const indices = values.map((_, k) => k + 1);
  return <g>
    {indices.slice(1).map(i => <Edge key={i} from={at(Math.floor(i / 2))} to={at(i)} />)}
    {indices.map(i => <g key={i}>
      <Node {...at(i)} label={values[i - 1]} tone={tone(i)} r={r} />
      {showIndex && <text x={at(i).x + r + 2} y={at(i).y - r + 2} className="lf-text lf-small lf-muted">{i}</text>}
    </g>)}
  </g>;
}

function Cells({ values, x, y, w = 40, tone = () => "lf-box", index }: { values: (number | string)[]; x: number; y: number; w?: number; tone?: (k: number) => string; index?: boolean }) {
  return <g>{values.map((value, k) => <g key={k}>
    {index && <text x={x + k * (w + 4) + w / 2} y={y - 6} textAnchor="middle" className="lf-text lf-small lf-muted">{k + 1}</text>}
    <rect x={x + k * (w + 4)} y={y} width={w} height="34" rx="6" className={tone(k)} />
    <text x={x + k * (w + 4) + w / 2} y={y + 22} textAnchor="middle" className="lf-text lf-strong">{value}</text>
  </g>)}</g>;
}

function Legend({ items, x, y, step = 150 }: { items: [string, string][]; x: number; y: number; step?: number }) {
  return <g>{items.map(([tone, label], index) => <g key={label}>
    <rect x={x + index * step} y={y} width="15" height="15" rx="3" className={tone} />
    <text x={x + 21 + index * step} y={y + 12} className="lf-text lf-small">{label}</text>
  </g>)}</g>;
}

export function TreeTermsFigure() {
  const nodes = {
    a: { x: 230, y: 34, label: "a" }, b: { x: 140, y: 96, label: "b" }, c: { x: 320, y: 96, label: "c" },
    d: { x: 92, y: 158, label: "d" }, e: { x: 188, y: 158, label: "e" }, f: { x: 368, y: 158, label: "f" }, g: { x: 160, y: 220, label: "g" },
  };
  const tone = (id: string) => id === "a" ? "lf-box-accent" : ["d", "f", "g"].includes(id) ? "lf-box-sorted" : "lf-box";
  return <Svg label="Et rotfast binærtre med rot, interne noder, løvnoder, dybde og høyde" width={700} height={270}>
    <text x="8" y="14" className="lf-text lf-small lf-muted">dybde</text>
    {[0, 1, 2, 3].map(depth => <g key={depth}>
      <line x1="40" y1={34 + depth * 62} x2="420" y2={34 + depth * 62} className="lf-axis lf-dashed" />
      <text x="16" y={39 + depth * 62} className="lf-text lf-strong">{depth}</text>
    </g>)}
    <Tree nodes={nodes} edges={[["a", "b"], ["a", "c"], ["b", "d"], ["b", "e"], ["c", "f"], ["e", "g"]]} tone={tone} />
    <line x1="444" y1="10" x2="444" y2="258" className="lf-axis" />
    {[
      ["lf-box-accent", "rot: ingen forelder (a)"], ["lf-box", "interne noder: har barn (a, b, c, e)"], ["lf-box-sorted", "løvnoder: ingen barn (d, f, g)"],
    ].map(([style, text], index) => <g key={text}>
      <circle cx="464" cy={36 + index * 34} r="8" className={style} />
      <text x="478" y={41 + index * 34} className="lf-text lf-small">{text}</text>
    </g>)}
    <text x="458" y="150" className="lf-text lf-small lf-strong">dybde: kanter fra rota til noden</text>
    <text x="458" y="172" className="lf-text lf-small lf-strong lf-fill-accent">høyde h = største dybde = 3</text>
    <text x="458" y="206" className="lf-text lf-small">f er høyre barn av c, og c har</text>
    <text x="458" y="222" className="lf-text lf-small">ikke noe venstre barn. I et binærtre</text>
    <text x="458" y="238" className="lf-text lf-small">vet vi hvilket barn som mangler.</text>
  </Svg>;
}

export function SiblingFigure() {
  const left = {
    r: { x: 140, y: 36, label: 7 }, a: { x: 80, y: 110, label: 5 }, b: { x: 210, y: 110, label: 6 },
    c1: { x: 26, y: 190, label: 1 }, c2: { x: 70, y: 190, label: 2 }, c3: { x: 114, y: 190, label: 3 }, c4: { x: 158, y: 190, label: 4 },
  };
  const right = {
    r: { x: 380, y: 36, label: 7 }, a: { x: 380, y: 110, label: 5 }, b: { x: 470, y: 110, label: 6 },
    c1: { x: 380, y: 190, label: 1 }, c2: { x: 450, y: 190, label: 2 }, c3: { x: 520, y: 190, label: 3 }, c4: { x: 590, y: 190, label: 4 },
  };
  const down = [["r", "a"], ["a", "c1"]], across = [["a", "b"], ["c1", "c2"], ["c2", "c3"], ["c3", "c4"]];
  const r = 17;
  return <Svg label="Et flerveistre representert med to pekere per node: første barn og neste søsken" width={640} height={286}>
    <text x="110" y="14" textAnchor="middle" className="lf-text lf-small lf-muted">treet</text>
    <Tree nodes={left} edges={[["r", "a"], ["r", "b"], ["a", "c1"], ["a", "c2"], ["a", "c3"], ["a", "c4"]]} />
    <line x1="270" y1="10" x2="270" y2="256" className="lf-axis" />
    <text x="470" y="14" textAnchor="middle" className="lf-text lf-small lf-muted">samme tre med to pekere per node</text>
    {down.map(([from, to]) => <line key={from + to} x1={right[from as keyof typeof right].x} y1={right[from as keyof typeof right].y + r}
      x2={right[to as keyof typeof right].x} y2={right[to as keyof typeof right].y - r - 3} className="lf-line lf-stroke-accent" markerEnd="url(#lf-arrow)" />)}
    {across.map(([from, to]) => <line key={from + to} x1={right[from as keyof typeof right].x + r} y1={right[from as keyof typeof right].y}
      x2={right[to as keyof typeof right].x - r - 3} y2={right[to as keyof typeof right].y} className="lf-line lf-dashed" markerEnd="url(#lf-arrow)" />)}
    {Object.entries(right).map(([id, node]) => <Node key={id} {...node} />)}
    <line x1="300" y1="228" x2="330" y2="228" className="lf-line lf-stroke-accent" />
    <text x="338" y="232" className="lf-text lf-small">x.left-child: første barn</text>
    <line x1="300" y1="248" x2="330" y2="248" className="lf-line lf-dashed" />
    <text x="338" y="252" className="lf-text lf-small">x.right-sibling: neste søsken</text>
    <text x="320" y="276" textAnchor="middle" className="lf-text lf-small lf-muted">7 har to barn (5 og 6), 5 har fire og 6 har ingen. Hver node trenger bare to pekere, uansett antall barn.</text>
  </Svg>;
}

// The binary search tree from CLRS figure 12.2, used in several figures.
const bst = {
  n15: { x: 250, y: 30, label: 15 }, n6: { x: 140, y: 90, label: 6 }, n18: { x: 370, y: 90, label: 18 },
  n3: { x: 80, y: 150, label: 3 }, n7: { x: 200, y: 150, label: 7 }, n17: { x: 330, y: 150, label: 17 }, n20: { x: 410, y: 150, label: 20 },
  n2: { x: 50, y: 210, label: 2 }, n4: { x: 110, y: 210, label: 4 }, n13: { x: 240, y: 210, label: 13 }, n9: { x: 210, y: 270, label: 9 },
};
const bstEdges: [string, string][] = [
  ["n15", "n6"], ["n15", "n18"], ["n6", "n3"], ["n6", "n7"], ["n18", "n17"], ["n18", "n20"], ["n3", "n2"], ["n3", "n4"], ["n7", "n13"], ["n13", "n9"],
];

export function BstSearchFigure() {
  const path = ["n15", "n6", "n7", "n13"];
  const insert = { x: 270, y: 270 };
  return <Svg label="Tree-Search etter 13 følger én sti fra rota, og Tree-Insert av 14 følger den samme stien" width={700} height={300}>
    <Edge from={bst.n13} to={insert} dashed />
    <Tree nodes={bst} edges={bstEdges} accentEdges={["n15-n6", "n6-n7", "n7-n13"]} tone={id => id === "n13" ? "lf-box-sorted" : path.includes(id) ? "lf-box-accent" : "lf-box"} />
    <Node {...insert} label={14} tone="lf-box-warn" dashed />
    {[["13 < 15", 140, 52], ["13 > 6", 186, 116], ["13 > 7", 236, 176]].map(([text, x, y]) => <text key={text} x={x} y={y} className="lf-text lf-small lf-fill-accent lf-strong">{text}</text>)}
    <line x1="460" y1="10" x2="460" y2="290" className="lf-axis" />
    {[
      ["Tree-Search(rot, 13)", true], ["15 → 6 → 7 → 13: funnet", false], ["4 noder på én sti, altså O(h)", false], ["", false],
      ["Tree-Insert(T, 14)", true], ["samme sti, og 14 > 13 gir nil", false], ["y = 13 blir forelder: 14 er", false], ["høyre barn av 13 (stiplet)", false], ["", false],
      ["Inorder-Tree-Walk", true], ["2 3 4 6 7 9 13 15 17 18 20", false],
    ].map(([text, strong], index) => <text key={index} x="476" y={28 + index * 22} className={`lf-text lf-small${strong ? " lf-strong" : ""}`}>{text}</text>)}
  </Svg>;
}

export function SuccessorFigure() {
  const up = ["n13", "n7", "n6"], down = ["n18", "n17"];
  const tone = (id: string) => id === "n17" || id === "n15" ? "lf-box-sorted" : id === "n13" ? "lf-box-warn" : up.includes(id) || down.includes(id) ? "lf-box-accent" : "lf-box";
  return <Svg label="Tree-Successor har to tilfeller: minimum i høyre deltre, eller opp til første forelder vi kommer til fra venstre" width={700} height={300}>
    <Tree nodes={bst} edges={bstEdges} tone={tone} accentEdges={["n15-n18", "n18-n17", "n6-n7", "n7-n13", "n15-n6"]} />
    <text x="20" y="250" className="lf-text lf-small lf-strong">min</text>
    <text x="434" y="155" className="lf-text lf-small lf-strong">max</text>
    <line x1="460" y1="10" x2="460" y2="290" className="lf-axis" />
    {[
      ["1. x har høyre barn", true], ["succ(15) = Tree-Minimum(18) = 17", false], ["gå til høyre én gang, så venstre", false], ["så langt det går", false], ["", false],
      ["2. x har ikke høyre barn", true], ["succ(13): 13 → 7 → 6 → 15", false], ["gå opp så lenge vi kommer fra", false], ["høyre; stopp når vi kommer fra", false], ["venstre. Svaret er 15", false], ["", false],
      ["Tree-Minimum: følg left til nil (2)", false],
    ].map(([text, strong], index) => <text key={index} x="476" y={28 + index * 21} className={`lf-text lf-small${strong ? " lf-strong" : ""}`}>{text}</text>)}
  </Svg>;
}

type MiniTree = { nodes: Record<string, Point & { label: number }>; edges: [string, string][] };

export function TreeDeleteFigure() {
  const panels: { title: string; note: string; before: MiniTree; after: MiniTree; moved: string }[] = [
    {
      title: "z = 7 har ikke venstre barn", note: "Transplant(T, z, z.right)",
      before: { nodes: { p: { x: 70, y: 48, label: 6 }, a: { x: 30, y: 98, label: 3 }, z: { x: 110, y: 98, label: 7 }, b: { x: 150, y: 148, label: 13 }, c: { x: 120, y: 198, label: 9 } },
        edges: [["p", "a"], ["p", "z"], ["z", "b"], ["b", "c"]] },
      after: { nodes: { p: { x: 70, y: 248, label: 6 }, a: { x: 30, y: 298, label: 3 }, b: { x: 110, y: 298, label: 13 }, c: { x: 80, y: 348, label: 9 } },
        edges: [["p", "a"], ["p", "b"], ["b", "c"]] },
      moved: "b",
    },
    {
      title: "z = 6 har to barn, y = z.right", note: "y = 7 tar plassen og arver venstre barn",
      before: { nodes: { z: { x: 90, y: 48, label: 6 }, a: { x: 40, y: 98, label: 3 }, y: { x: 140, y: 98, label: 7 }, b: { x: 180, y: 148, label: 13 } },
        edges: [["z", "a"], ["z", "y"], ["y", "b"]] },
      after: { nodes: { y: { x: 90, y: 248, label: 7 }, a: { x: 40, y: 298, label: 3 }, b: { x: 140, y: 298, label: 13 } },
        edges: [["y", "a"], ["y", "b"]] },
      moved: "y",
    },
    {
      title: "z = 15 har to barn, y dypere", note: "y = 17 = Tree-Minimum(z.right) tar plassen",
      before: { nodes: { z: { x: 90, y: 48, label: 15 }, a: { x: 40, y: 98, label: 6 }, s: { x: 140, y: 98, label: 18 }, y: { x: 110, y: 148, label: 17 }, t: { x: 170, y: 148, label: 20 } },
        edges: [["z", "a"], ["z", "s"], ["s", "y"], ["s", "t"]] },
      after: { nodes: { y: { x: 90, y: 248, label: 17 }, a: { x: 40, y: 298, label: 6 }, s: { x: 140, y: 298, label: 18 }, t: { x: 170, y: 348, label: 20 } },
        edges: [["y", "a"], ["y", "s"], ["s", "t"]] },
      moved: "y",
    },
  ];
  return <Svg label="Tree-Delete i tre tilfeller: noden erstattes av barnet sitt eller av etterfølgeren" width={700} height={410}>
    {panels.map((panel, index) => {
      const dx = 10 + index * 235;
      const shift = (nodes: Record<string, Point & { label: number }>) => Object.fromEntries(Object.entries(nodes).map(([id, n]) => [id, { ...n, x: n.x + dx }]));
      return <g key={panel.title}>
        {index > 0 && <line x1={dx - 12} y1="10" x2={dx - 12} y2="400" className="lf-axis" />}
        <text x={dx} y="16" className="lf-text lf-small lf-strong">{panel.title}</text>
        <Tree nodes={shift(panel.before.nodes)} edges={panel.before.edges} tone={id => id === "z" ? "lf-box-warn" : id === panel.moved ? "lf-box-accent" : "lf-box"} />
        <text x={dx + 100} y="226" textAnchor="middle" className="lf-text lf-strong lf-muted">⇓</text>
        <Tree nodes={shift(panel.after.nodes)} edges={panel.after.edges} tone={id => id === panel.moved ? "lf-box-accent" : "lf-box"} />
        <text x={dx} y="392" className="lf-text lf-small">{panel.note}</text>
      </g>;
    })}
  </Svg>;
}

export function HeightFigure() {
  const chain = Array.from({ length: 7 }, (_, k) => ({ x: 30 + k * 40, y: 30 + k * 36 }));
  const balanced = [
    { x: 500, y: 60, label: 4 }, { x: 430, y: 130, label: 2 }, { x: 570, y: 130, label: 6 },
    { x: 395, y: 200, label: 1 }, { x: 465, y: 200, label: 3 }, { x: 535, y: 200, label: 5 }, { x: 605, y: 200, label: 7 },
  ];
  return <Svg label="Samme sju nøkler gir høyde 6 når de settes inn sortert, men høyde 2 i en god rekkefølge" width={640} height={300}>
    {chain.slice(1).map((point, k) => <Edge key={k} from={chain[k]} to={point} />)}
    {chain.map((point, k) => <Node key={k} {...point} label={k + 1} tone="lf-box-warn" />)}
    <text x="20" y="290" className="lf-text lf-small lf-strong">innsatt 1, 2, …, 7: h = n − 1 = 6</text>
    <text x="250" y="80" className="lf-text lf-small lf-muted">en lenket liste:</text>
    <text x="250" y="96" className="lf-text lf-small lf-muted">søk blir Θ(n)</text>
    <line x1="350" y1="10" x2="350" y2="290" className="lf-axis" />
    {[[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]].map(([a, b]) => <Edge key={b} from={balanced[a]} to={balanced[b]} />)}
    {balanced.map(node => <Node key={node.label} {...node} tone="lf-box-sorted" />)}
    <text x="370" y="20" className="lf-text lf-small lf-strong">innsatt 4, 2, 6, 1, 3, 5, 7:</text>
    <text x="370" y="38" className="lf-text lf-small lf-strong">h = ⌊lg 7⌋ = 2</text>
    <text x="370" y="250" className="lf-text lf-small">tilfeldig rekkefølge: forventet h = Θ(lg n)</text>
    <text x="370" y="268" className="lf-text lf-small">rød-svarte trær o.l.: garantert h = Θ(lg n)</text>
  </Svg>;
}

const clrsHeap = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1];

export function HeapArrayFigure() {
  const tone = (i: number) => i === 2 ? "lf-box-accent" : i === 1 ? "lf-box-warn" : i === 4 || i === 5 ? "lf-box-sorted" : "lf-box";
  return <Svg label="En maks-haug som tre og som tabell: barna til indeks i ligger på 2i og 2i + 1, forelderen på ⌊i/2⌋" width={640} height={330}>
    <HeapTree values={clrsHeap} x={20} y={30} width={400} tone={tone} showIndex />
    <line x1="440" y1="10" x2="440" y2="210" className="lf-axis" />
    {[
      ["i = 2 (lilla, verdi 14)", true], ["Parent(2) = ⌊2/2⌋ = 1", false], ["Left(2) = 2 · 2 = 4", false], ["Right(2) = 2 · 2 + 1 = 5", false], ["", false],
      ["haugegenskapen:", true], ["A[Parent(i)] ≥ A[i]", false], ["høyde ⌊lg 10⌋ = 3", false],
    ].map(([text, strong], index) => <text key={index} x="456" y={30 + index * 22} className={`lf-text lf-small${strong ? " lf-strong" : ""}`}>{text}</text>)}
    <text x="20" y="250" className="lf-text lf-small lf-muted">samme haug lagret i A[1 : 10], nivå for nivå fra venstre:</text>
    <Cells values={clrsHeap} x={20} y={276} w={52} tone={k => tone(k + 1)} index />
  </Svg>;
}

export function MaxHeapifyFigure() {
  const states = [
    { values: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1], bad: 2, child: 4, note: "4 < 14: bytt med største barn" },
    { values: [16, 14, 10, 4, 7, 9, 3, 2, 8, 1], bad: 4, child: 9, note: "4 < 8: bytt igjen" },
    { values: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], bad: 9, child: 0, note: "løvnode: ferdig" },
  ];
  return <Svg label="Max-Heapify(A, 2) lar verdien 4 synke ned til den står riktig" width={700} height={260}>
    {states.map((state, index) => {
      const x = 8 + index * 232;
      return <g key={index}>
        {index > 0 && <line x1={x - 6} y1="8" x2={x - 6} y2="250" className="lf-axis" />}
        <HeapTree values={state.values} x={x} y={30} width={220} gap={50} r={13}
          tone={i => i === state.bad ? (state.child ? "lf-box-warn" : "lf-box-sorted") : i === state.child ? "lf-box-accent" : "lf-box"} />
        <text x={x + 110} y="216" textAnchor="middle" className="lf-text lf-small lf-strong">{index === 0 ? "start: i = 2" : index === 1 ? "rekursivt kall, i = 4" : "i = 9"}</text>
        <text x={x + 110} y="236" textAnchor="middle" className="lf-text lf-small">{state.note}</text>
      </g>;
    })}
  </Svg>;
}

export function BuildHeapFigure() {
  const rows = [
    { label: "input", values: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7], i: 0, changed: [] as number[] },
    { label: "i = 5", values: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7], i: 5, changed: [] },
    { label: "i = 4", values: [4, 1, 3, 14, 16, 9, 10, 2, 8, 7], i: 4, changed: [4, 8] },
    { label: "i = 3", values: [4, 1, 10, 14, 16, 9, 3, 2, 8, 7], i: 3, changed: [3, 7] },
    { label: "i = 2", values: [4, 16, 10, 14, 7, 9, 3, 2, 8, 1], i: 2, changed: [2, 5, 10] },
    { label: "i = 1", values: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], i: 1, changed: [1, 2, 4, 9] },
  ];
  return <Svg label="Build-Max-Heap på ⟨4, 1, 3, 2, 16, 9, 10, 14, 8, 7⟩: Max-Heapify fra i = 5 ned til 1" width={640} height={322}>
    {rows.map((row, index) => {
      const y = 24 + index * 46;
      return <g key={row.label}>
        <text x="4" y={y + 22} className="lf-text lf-strong">{row.label}</text>
        <Cells values={row.values} x={80} y={y} w={44} index={index === 0}
          tone={k => k + 1 === row.i ? "lf-box-warn" : row.changed.includes(k + 1) ? "lf-box-accent" : index === 0 && k >= 5 ? "lf-box-sorted" : "lf-box"} />
      </g>;
    })}
    <Legend x={80} y={300} items={[["lf-box-sorted", "løvnoder: 6..10"], ["lf-box-warn", "Max-Heapify(A, i)"], ["lf-box-accent", "flyttet i dette kallet"]]} step={175} />
  </Svg>;
}

export function BuildCostFigure() {
  const values = Array.from({ length: 15 }, (_, k) => k + 1);
  const height = (i: number) => 3 - Math.floor(Math.log2(i)), depth = (i: number) => Math.floor(Math.log2(i));
  return <Svg label="Build-Max-Heap koster høyden per node, gjentatt innsetting koster dybden: de fleste noder er dype og lave" width={700} height={300}>
    {[{ x: 10, cost: height, title: "Build-Max-Heap: node synker høyst høyden", total: "0·8 + 1·4 + 2·2 + 3·1 = 11" },
      { x: 360, cost: depth, title: "n × Max-Heap-Insert: node stiger høyst dybden", total: "0·1 + 1·2 + 2·4 + 3·8 = 34" }].map(panel => <g key={panel.x}>
      <text x={panel.x} y="16" className="lf-text lf-small lf-strong">{panel.title}</text>
      <HeapTree values={values.map(panel.cost)} x={panel.x} y={44} width={330} gap={52} r={12}
        tone={i => panel.cost(i) === 3 ? "lf-box-warn" : panel.cost(i) === 0 ? "lf-box-sorted" : "lf-box"} />
      <text x={panel.x} y="250" className="lf-text lf-small">maks antall bytter, n = 15:</text>
      <text x={panel.x} y="270" className="lf-text lf-strong lf-fill-accent">{panel.total}</text>
    </g>)}
    <line x1="350" y1="8" x2="350" y2="280" className="lf-axis" />
    <text x="350" y="294" textAnchor="middle" className="lf-text lf-small lf-muted">tallene i nodene er hvor mange nivåer elementet kan måtte flyttes; halvparten av nodene er løvnoder</text>
  </Svg>;
}

export function IncreaseKeyFigure() {
  const states = [
    { values: [16, 14, 10, 8, 7, 9, 3, 2, 15, 1], at: 9, note: "A[9]: 4 økes til 15" },
    { values: [16, 14, 10, 15, 7, 9, 3, 2, 8, 1], at: 4, note: "15 > 8: bytt med forelder" },
    { values: [16, 15, 10, 14, 7, 9, 3, 2, 8, 1], at: 2, note: "15 > 14: bytt. 16 ≥ 15: stopp" },
  ];
  return <Svg label="Max-Heap-Increase-Key: den økte nøkkelen stiger mot rota til forelderen er minst like stor" width={700} height={250}>
    {states.map((state, index) => {
      const x = 8 + index * 232;
      return <g key={index}>
        {index > 0 && <line x1={x - 6} y1="8" x2={x - 6} y2="240" className="lf-axis" />}
        <HeapTree values={state.values} x={x} y={30} width={220} gap={50} r={13} tone={i => i === state.at ? (index === 2 ? "lf-box-sorted" : "lf-box-warn") : "lf-box"} />
        <text x={x + 110} y="222" textAnchor="middle" className="lf-text lf-small">{state.note}</text>
      </g>;
    })}
  </Svg>;
}

export function HeapsortFigure() {
  const rows = [
    { label: "input", heap: [4, 10, 3, 5, 1, 8], sorted: [] as number[] },
    { label: "Build-Max-Heap", heap: [10, 5, 8, 4, 1, 3], sorted: [] },
    { label: "i = 6", heap: [8, 5, 3, 4, 1], sorted: [10] },
    { label: "i = 5", heap: [5, 4, 3, 1], sorted: [8, 10] },
    { label: "i = 4", heap: [4, 1, 3], sorted: [5, 8, 10] },
    { label: "i = 3", heap: [3, 1], sorted: [4, 5, 8, 10] },
    { label: "i = 2", heap: [1], sorted: [3, 4, 5, 8, 10] },
  ];
  return <Svg label="Heapsort på ⟨4, 10, 3, 5, 1, 8⟩: haugen krymper fra høyre mens den sorterte delen vokser" width={640} height={378}>
    {rows.map((row, index) => {
      const y = 26 + index * 46;
      const values = [...row.heap, ...row.sorted];
      return <g key={row.label}>
        <text x="4" y={y + 22} className="lf-text lf-strong">{row.label}</text>
        <Cells values={values} x={124} y={y} w={46} index={index === 0}
          tone={k => index === 0 ? "lf-box" : k >= row.heap.length ? "lf-box-sorted" : k === 0 ? "lf-box-accent" : "lf-box"} />
        {index > 1 && <text x="430" y={y + 22} className="lf-text lf-small">{`A[1] ↔ A[${8 - index}], Max-Heapify(A, 1)`}</text>}
      </g>;
    })}
    <Legend x={124} y={356} items={[["lf-box-accent", "A[1] = maksimum i haugen"], ["lf-box-sorted", "ferdig sortert, utenfor haugen"]]} step={210} />
  </Svg>;
}
