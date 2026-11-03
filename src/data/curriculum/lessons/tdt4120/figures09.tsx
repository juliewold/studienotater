// Figures for lecture 9, drawn from the examples in the lecture slides, CLRS chapters 19 and 21 and exercise 9.
// Every forest, cut, sorted edge list, decision and key value is computed by the algorithm it illustrates.
import { Svg } from "../figureKit";

type Point = { x: number; y: number };

const R = 15;

function Node({ x, y, label, tone = "lf-box" }: Point & { label: string; tone?: string }) {
  return <g>
    <circle cx={x} cy={y} r={R + 1} className={tone} />
    <text x={x} y={y + 4.5} textAnchor="middle" className="lf-text lf-strong lf-small">{label}</text>
  </g>;
}

/** An undirected edge drawn as a straight line between the borders of two nodes, with an optional weight. */
function WEdge({ from, to, className = "lf-line", label }: { from: Point; to: Point; className?: string; label?: string }) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const ux = (to.x - from.x) / length, uy = (to.y - from.y) / length;
  const m = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  return <g>
    <line x1={from.x + ux * R} y1={from.y + uy * R} x2={to.x - ux * R} y2={to.y - uy * R} className={className} />
    {label && <g>
      <circle cx={m.x} cy={m.y} r="8" className="lf-box" />
      <text x={m.x} y={m.y + 4} textAnchor="middle" className="lf-text lf-small lf-strong">{label}</text>
    </g>}
  </g>;
}

function Lines({ x, y, lines, step = 19 }: { x: number; y: number; lines: [string, boolean?][]; step?: number }) {
  return <g>{lines.map(([text, strong], index) =>
    <text key={index} x={x} y={y + index * step} className={`lf-text lf-small${strong ? " lf-strong" : ""}`}>{text}</text>)}</g>;
}

/** Disjoint-set forest as in CLRS 19.3: Make-Set, Link (union by rank), Union and Find-Set with path compression. */
type Forest = { p: Record<string, string>; rank: Record<string, number> };

const makeForest = (nodes: string[]): Forest => ({ p: Object.fromEntries(nodes.map(x => [x, x])), rank: Object.fromEntries(nodes.map(x => [x, 0])) });

function findSet(f: Forest, x: string): string {
  const path = [x];
  let root = x;
  while (f.p[root] !== root) { root = f.p[root]; path.push(root); }
  for (const u of path.slice(0, -1)) f.p[u] = root;
  return root;
}

/** Link(x, y) for two roots, as on the slides: the root with the higher rank becomes the parent. */
function link(f: Forest, x: string, y: string) {
  if (f.rank[x] > f.rank[y]) f.p[y] = x;
  else { f.p[x] = y; if (f.rank[x] === f.rank[y]) f.rank[y] += 1; }
}

const union = (f: Forest, x: string, y: string) => link(f, findSet(f, x), findSet(f, y));

// Union(1, 2), Union(3, 4), Union(1, 3): 4 becomes the root with rank 2, and 1 lies two steps below it.
const before = makeForest(["1", "2", "3", "4"]);
union(before, "1", "2"); union(before, "3", "4"); union(before, "1", "3");
const after = structuredClone(before);
findSet(after, "1");

/** Places the nodes of a forest by depth, one row per depth, centred under the origin. */
function treePositions(f: Forest, nodes: string[], origin: Point, dx: number, dy: number): Record<string, Point> {
  const depth = (u: string): number => f.p[u] === u ? 0 : 1 + depth(f.p[u]);
  const rows: Record<number, string[]> = {};
  for (const u of nodes) (rows[depth(u)] ??= []).push(u);
  const at: Record<string, Point> = {};
  for (const [d, row] of Object.entries(rows)) {
    const sorted = [...row].sort((a, b) => Number(a) - Number(b));
    sorted.forEach((u, k) => { at[u] = { x: origin.x + (k - (sorted.length - 1) / 2) * dx, y: origin.y + Number(d) * dy }; });
  }
  return at;
}

export function DisjointSetFigure() {
  const nodes = ["1", "2", "3", "4"];
  const left = treePositions(before, nodes, { x: 120, y: 44 }, 80, 68);
  const right = treePositions(after, nodes, { x: 120, y: 44 }, 80, 68);
  const panel = (f: Forest, at: Record<string, Point>, dx: number, highlight: (u: string) => boolean) => <g transform={`translate(${dx},0)`}>
    {nodes.filter(u => f.p[u] !== u).map(u => <WEdge key={u} from={at[f.p[u]]} to={at[u]} className={highlight(u) ? "lf-line lf-stroke-accent" : "lf-line"} />)}
    {nodes.map(u => <Node key={u} {...at[u]} label={u} tone={f.p[u] === u ? "lf-box-accent" : "lf-box"} />)}
    {nodes.filter(u => f.p[u] === u).map(u => <text key={`r${u}`} x={at[u].x + 22} y={at[u].y - 12} className="lf-text lf-small lf-muted">{`rang ${f.rank[u]}`}</text>)}
  </g>;
  return <Svg label="Skog-implementasjonen av disjunkte mengder: Find-Set(1) før og etter stikomprimering" width={700} height={262}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">Før Find-Set(1): 1 → 2 → 4</text>
    {panel(before, left, 0, u => u === "1" || u === "2")}
    <line x1="300" y1="8" x2="300" y2="200" className="lf-axis" />
    <text x="316" y="16" className="lf-text lf-small lf-strong">Etter: 1 peker direkte på roten</text>
    {panel(after, right, 300, u => u === "1")}
    <Lines x={8} y={226} lines={[
      ["Make-Set(1..4), så Union(1, 2), Union(3, 4) og Union(1, 3). Roten 4 får rang 2."],
      ["Find-Set(1) henger 1 direkte under roten. Rangen endres ikke, så rang er bare en øvre grense for høyden."],
    ]} step={20} />
  </Svg>;
}

// Graph from CLRS figure 21.1, with the weights on the edges.
const edges: [string, string, number][] = [["a", "b", 4], ["a", "h", 8], ["b", "c", 8], ["b", "h", 11], ["c", "d", 7], ["c", "f", 4], ["c", "i", 2],
  ["d", "e", 9], ["d", "f", 14], ["e", "f", 10], ["f", "g", 2], ["g", "h", 1], ["g", "i", 6], ["h", "i", 7]];
const at: Record<string, Point> = { a: { x: 50, y: 70 }, b: { x: 150, y: 50 }, c: { x: 270, y: 60 }, d: { x: 400, y: 50 }, e: { x: 530, y: 50 },
  f: { x: 400, y: 170 }, g: { x: 270, y: 200 }, h: { x: 120, y: 190 }, i: { x: 270, y: 120 } };
const pairKey = (u: string, v: string) => [u, v].sort().join("");

/** Draws the weighted graph; `classOf` picks the style of each edge and `labelOf` what is written on it. */
function WeightedGraph({ classOf, labelOf = (_u, _v, w) => String(w) }: { classOf: (u: string, v: string) => string; labelOf?: (u: string, v: string, w: number) => string | undefined }) {
  return <g>
    {edges.map(([u, v, w]) => <WEdge key={pairKey(u, v)} from={at[u]} to={at[v]} className={classOf(u, v)} label={labelOf(u, v, w)} />)}
    {Object.keys(at).map(u => <Node key={u} {...at[u]} label={u} />)}
  </g>;
}

export function SafeEdgeFigure() {
  // A holds the edges g–h, c–i and f–g from the first Kruskal steps. S is the side of the cut that holds c, f, g, h and i.
  const A = new Set(["gh", "ci", "fg"]);
  const S = new Set(["c", "f", "g", "h", "i"]);
  const crossing = edges.filter(([u, v]) => S.has(u) !== S.has(v));
  const [lu, lv, lw] = crossing.reduce((best, edge) => edge[2] < best[2] ? edge : best);
  const light = pairKey(lu, lv);
  return <Svg label="Trygg kant: en lett kant over et snitt som respekterer A" width={700} height={330}>
    <path d="M250,40 L300,40 L425,150 L420,195 L300,225 L240,225 L95,200 L95,165 Z" className="lf-region lf-dashed" />
    <WeightedGraph
      classOf={(u, v) => {
        if (A.has(pairKey(u, v))) return "lf-line lf-stroke-accent";
        if (pairKey(u, v) === light) return "lf-line lf-stroke-warn";
        if (S.has(u) !== S.has(v)) return "lf-line lf-dashed lf-muted-stroke";
        return "lf-line";
      }} />
    <Lines x={8} y={252} lines={[
      ["Tykke kanter er A (g–h, c–i og f–g). Snittet, den stiplede linjen, krysser ingen av dem."],
      [`Kantene over snittet er ${crossing.map(([u, v, w]) => `${u}–${v} (${w})`).join(", ")}.`],
      [`Den letteste, ${lu}–${lv} med vekt ${lw}, er trygg for A.`, true],
      [`Er T et minimalt spenntre med A, men uten ${lu}–${lv}, byttes en tyngre kant over snittet ut.`],
    ]} step={20} />
  </Svg>;
}

/** Kruskal with the disjoint-set forest as a black box: every edge in sorted order, with its decision. */
function kruskal() {
  const forest = makeForest(Object.keys(at));
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  return sorted.map(([u, v, w]) => {
    const ru = findSet(forest, u), rv = findSet(forest, v);
    const accepted = ru !== rv;
    if (accepted) link(forest, ru, rv);
    return { u, v, w, accepted };
  });
}

export function KruskalFigure() {
  const steps = kruskal();
  const accepted = steps.filter(step => step.accepted);
  const acceptedKeys = new Set(accepted.map(step => pairKey(step.u, step.v)));
  const total = accepted.reduce((sum, step) => sum + step.w, 0);
  return <Svg label="MST-Kruskal på CLRS-grafen: kantene i stigende vekt, med beslutningene, og det ferdige spenntreet" width={700} height={300}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">Kantene i stigende vekt</text>
    {steps.map((step, k) => <g key={pairKey(step.u, step.v)}>
      <rect x="8" y={26 + k * 17} width="262" height="15" rx="3" className={step.accepted ? "lf-box-accent" : "lf-box"} />
      <text x="14" y={37 + k * 17} className="lf-text lf-small lf-strong">{`${step.u}–${step.v}  (${step.w})`}</text>
      <text x="110" y={37 + k * 17} className="lf-text lf-small">{step.accepted ? "legg til" : "sykel: hopp over"}</text>
    </g>)}
    <line x1="290" y1="8" x2="290" y2="290" className="lf-axis" />
    <text x="304" y="16" className="lf-text lf-small lf-strong">Spenntreet</text>
    <g transform="translate(305,30) scale(0.7)">
      <WeightedGraph
        classOf={(u, v) => acceptedKeys.has(pairKey(u, v)) ? "lf-line lf-stroke-accent" : "lf-line lf-dashed lf-muted-stroke"}
        labelOf={(u, v, w) => acceptedKeys.has(pairKey(u, v)) ? String(w) : undefined} />
    </g>
    <Lines x={304} y={236} lines={[[`Vekt ${total}, med ${accepted.length} kanter = |V| − 1.`, true], ["Stiplede kanter ble hoppet over: de ville laget en sykel."]]} step={18} />
  </Svg>;
}

/** MST-Prim from `start`, with ties broken alphabetically. Returns the extraction order and the parent of each node. */
function prim(start: string) {
  const nodes = Object.keys(at);
  const key: Record<string, number> = Object.fromEntries(nodes.map(u => [u, Infinity]));
  const parent: Record<string, string | undefined> = {};
  const inQueue = new Set(nodes);
  key[start] = 0;
  const steps: { u: string; key: number; from?: string }[] = [];
  while (inQueue.size) {
    const u = [...inQueue].sort((a, b) => key[a] - key[b] || (a < b ? -1 : 1))[0];
    inQueue.delete(u);
    steps.push({ u, key: key[u], from: parent[u] });
    for (const [x, y, w] of edges) {
      const v = x === u ? y : y === u ? x : undefined;
      if (v && inQueue.has(v) && w < key[v]) { key[v] = w; parent[v] = u; }
    }
  }
  return steps;
}

export function PrimFigure() {
  const steps = prim("a");
  const treeKeys = new Set(steps.filter(step => step.from).map(step => pairKey(step.from!, step.u)));
  const order = Object.fromEntries(steps.map((step, k) => [step.u, k + 1]));
  return <Svg label="MST-Prim fra node a på CLRS-grafen: rekkefølgen nodene tas ut av køen, og det ferdige spenntreet" width={700} height={300}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">Ut av køen (nøkkel, kant fra treet)</text>
    {steps.map((step, k) => <g key={step.u}>
      <rect x="8" y={26 + k * 24} width="262" height="20" rx="4" className={k === 0 ? "lf-box-accent" : "lf-box-sorted"} />
      <text x="14" y={40 + k * 24} className="lf-text lf-small lf-strong">{`${k + 1}. ${step.u} (${step.key === Infinity ? "∞" : step.key})`}</text>
      <text x="110" y={40 + k * 24} className="lf-text lf-small">{step.from ? `via ${step.from}–${step.u}` : "startnoden"}</text>
    </g>)}
    <line x1="290" y1="8" x2="290" y2="290" className="lf-axis" />
    <text x="304" y="16" className="lf-text lf-small lf-strong">Spenntreet, nummerert i uttaksrekkefølge</text>
    <g transform="translate(305,30) scale(0.7)">
      <WeightedGraph
        classOf={(u, v) => treeKeys.has(pairKey(u, v)) ? "lf-line lf-stroke-accent" : "lf-line lf-dashed lf-muted-stroke"}
        labelOf={(u, v, w) => treeKeys.has(pairKey(u, v)) ? String(w) : undefined} />
      {Object.keys(at).map(u => <text key={`o${u}`} x={at[u].x} y={at[u].y - 24} textAnchor="middle" className="lf-text lf-small lf-fill-accent lf-strong">{order[u]}</text>)}
    </g>
    <Lines x={304} y={236} lines={[["Nøkkelen er den letteste kanten fra treet til noden.", true], ["Stiplede kanter er ikke med i spenntreet."]]} step={18} />
  </Svg>;
}

// A triangle where MST-A can go wrong: taking the heavy edge first blocks the light edge b–c.
const triangle: [string, string, number][] = [["a", "b", 1], ["b", "c", 1], ["a", "c", 2]];
const trianglePos: Record<string, Point> = { a: { x: 60, y: 60 }, b: { x: 200, y: 60 }, c: { x: 130, y: 170 } };

/** Adds the edges in the given order, skipping those that would form a cycle. */
function addInOrder(order: [string, string, number][]) {
  const forest = makeForest(Object.keys(trianglePos));
  const chosen: [string, string, number][] = [];
  for (const edge of order) {
    const ru = findSet(forest, edge[0]), rv = findSet(forest, edge[1]);
    if (ru !== rv) { link(forest, ru, rv); chosen.push(edge); }
  }
  return chosen;
}

export function ArbitraryOrderFigure() {
  const heavyFirst = addInOrder([triangle[2], triangle[0], triangle[1]]);
  const lightFirst = addInOrder(triangle);
  const weight = (chosen: [string, string, number][]) => chosen.reduce((sum, edge) => sum + edge[2], 0);
  const panel = (chosen: [string, string, number][], dx: number, title: string) => <g transform={`translate(${dx},0)`}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">{title}</text>
    {triangle.map(([u, v, w]) => {
      const on = chosen.some(edge => pairKey(edge[0], edge[1]) === pairKey(u, v));
      return <WEdge key={pairKey(u, v)} from={trianglePos[u]} to={trianglePos[v]} className={on ? "lf-line lf-stroke-accent" : "lf-line lf-dashed lf-muted-stroke"} label={String(w)} />;
    })}
    {Object.keys(trianglePos).map(u => <Node key={u} {...trianglePos[u]} label={u} />)}
    <text x="8" y="210" className="lf-text lf-small lf-strong">{`Vektsum ${weight(chosen)}`}</text>
  </g>;
  return <Svg label="MST-A i en trekant: å ta den tyngste kanten først gir vektsum 3, mens den letteste gir 2" width={700} height={230}>
    {panel(heavyFirst, 0, "MST-A: a–c først, så a–b (b–c blir en sykel)")}
    <line x1="350" y1="8" x2="350" y2="220" className="lf-axis" />
    {panel(lightFirst, 370, "Letteste først: a–b, b–c (a–c blir en sykel)")}
  </Svg>;
}
