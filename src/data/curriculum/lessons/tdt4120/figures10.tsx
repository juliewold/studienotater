// Figures for lecture 10, drawn from the examples in the lecture slides, CLRS chapter 22 and exercise 10.
// Every estimate, pass, extraction order and tree is computed by the algorithm it illustrates.
import { Svg } from "../figureKit";
import { shortestPathEdges, shortestPathNodes, shortestPathPositions } from "../exampleGraphs";

type Point = { x: number; y: number };
type Edge = [string, string, number];

const R = 15;
const INF = Infinity;

const show = (d: number) => (d === INF ? "∞" : String(d));
const sign = (w: number) => (w < 0 ? "−" : "") + Math.abs(w);

function Node({ x, y, label, tone = "lf-box" }: Point & { label: string; tone?: string }) {
  return <g>
    <circle cx={x} cy={y} r={R + 1} className={tone} />
    <text x={x} y={y + 4.5} textAnchor="middle" className="lf-text lf-strong lf-small">{label}</text>
  </g>;
}

/** The current estimate v.d, written above the node, or below it when an edge comes in from above. */
function DValue({ x, y, d, below = false }: Point & { d: number; below?: boolean }) {
  return <text x={x} y={below ? y + R + 22 : y - 24} textAnchor="middle" className="lf-text lf-small lf-fill-accent lf-strong">{`d = ${show(d)}`}</text>;
}

/** A directed edge from the border of one node to the border of another, with its weight written on it. */
function Arrow({ from, to, className = "lf-line", label, dx = 0, dy = -7 }: { from: Point; to: Point; className?: string; label?: string; dx?: number; dy?: number }) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const ux = (to.x - from.x) / length, uy = (to.y - from.y) / length;
  const m = { x: (from.x + to.x) / 2 + dx, y: (from.y + to.y) / 2 + dy };
  return <g>
    <line x1={from.x + ux * R} y1={from.y + uy * R} x2={to.x - ux * (R + 4)} y2={to.y - uy * (R + 4)} className={className} markerEnd="url(#lf-arrow)" />
    {label && <text x={m.x} y={m.y} textAnchor="middle" className="lf-text lf-small lf-strong">{label}</text>}
  </g>;
}

function Lines({ x, y, lines, step = 19 }: { x: number; y: number; lines: [string, boolean?][]; step?: number }) {
  return <g>{lines.map(([text, strong], index) =>
    <text key={index} x={x} y={y + index * step} className={`lf-text lf-small${strong ? " lf-strong" : ""}`}>{text}</text>)}</g>;
}

/** Initial estimates: 0 for the source, infinity for every other node. */
const initial = (nodes: string[], s: string): Record<string, number> => Object.fromEntries(nodes.map(v => [v, v === s ? 0 : INF]));

/** Dijkstra with a plain array as the queue. Each step records the extracted node and all estimates after its relaxations. */
function dijkstra(nodes: string[], edges: Edge[], s: string) {
  const d = initial(nodes, s);
  const done = new Set<string>();
  const steps: { u: string; d: Record<string, number> }[] = [];
  while (done.size < nodes.length) {
    const open = nodes.filter(v => !done.has(v) && d[v] < INF);
    if (open.length === 0) break;
    const u = open.reduce((a, b) => (d[b] < d[a] ? b : a));
    done.add(u);
    for (const [a, b, w] of edges) if (a === u && d[u] + w < d[b]) d[b] = d[u] + w;
    steps.push({ u, d: { ...d } });
  }
  return { steps, d };
}

/** Bellman-Ford's passes: every edge is relaxed in list order, once per pass. */
function bellmanFordPasses(nodes: string[], edges: Edge[], s: string, passes: number) {
  const d = initial(nodes, s);
  const snapshots: { label: string; d: Record<string, number> }[] = [{ label: "Start", d: { ...d } }];
  for (let i = 1; i <= passes; i++) {
    for (const [u, v, w] of edges) if (d[u] + w < d[v]) d[v] = d[u] + w;
    snapshots.push({ label: `Pass ${i}`, d: { ...d } });
  }
  return snapshots;
}

/** DAG-Shortest-Paths: one pass over the vertices in topological order, relaxing the outgoing edges of each vertex. */
function dagShortestPaths(order: string[], edges: Edge[], s: string) {
  const d = initial(order, s);
  const parent: Record<string, string> = {};
  for (const u of order) for (const [a, b, w] of edges) if (a === u && d[u] + w < d[b]) {
    d[b] = d[u] + w;
    parent[b] = u;
  }
  return { d, parent };
}

// Own example of a DAG with a negative edge. The topological order is a, b, c, d, e.
const dagOrder = ["a", "b", "c", "d", "e"];
const dagEdges: Edge[] = [["a", "b", 3], ["a", "c", 6], ["b", "c", -2], ["b", "d", 1], ["c", "d", 4], ["c", "e", 2], ["d", "e", -3]];
const dagPos: Record<string, Point> = { a: { x: 60, y: 130 }, b: { x: 190, y: 60 }, c: { x: 190, y: 200 }, d: { x: 330, y: 60 }, e: { x: 330, y: 200 } };

export function RelaxFigure() {
  const u = { x: 70, y: 110 }, v = { x: 230, y: 110 };
  const panel = (vd: number, dx: number, title: string, after: number) => <g transform={`translate(${dx},0)`}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">{title}</text>
    <Arrow from={u} to={v} label="3" />
    <Node {...u} label="u" />
    <Node {...v} label="v" />
    <DValue {...u} d={4} />
    <DValue {...v} d={vd} />
    <text x="8" y="196" className="lf-text lf-small">{`u.d + w = 4 + 3 = 7, og v.d blir ${show(after)}`}</text>
  </g>;
  return <Svg label="Relax på kanten (u, v) med vekt 3: v.d senkes til 7 når den er større, og står når den allerede er lavere" width={700} height={230}>
    {panel(10, 0, "Relax senker: 7 < 10", 7)}
    <line x1="350" y1="8" x2="350" y2="210" className="lf-axis" />
    {panel(5, 360, "Relax endrer ikke: 7 > 5", 5)}
  </Svg>;
}

export function DagFigure() {
  const { d, parent } = dagShortestPaths(dagOrder, dagEdges, "a");
  const onTree = (a: string, b: string) => parent[b] === a;
  return <Svg label="DAG-Shortest-Paths på en DAG med en negativ kant: a, b, c, d, e følger topologisk orden, og den korteste veien til hver node er fremhevet" width={700} height={262}>
    {dagEdges.map(([a, b, w]) => <Arrow key={`${a}${b}`} from={dagPos[a]} to={dagPos[b]}
      className={onTree(a, b) ? "lf-line lf-stroke-accent" : "lf-line lf-dashed lf-muted-stroke"} label={sign(w)}
      dx={a === "b" && b === "c" ? 16 : a === "d" && b === "e" ? 16 : 0}
      dy={a === "b" && b === "c" ? 0 : a === "d" && b === "e" ? 0 : -7} />)}
    {dagOrder.map(v => <g key={v}>
      <Node {...dagPos[v]} label={v} tone={v === "a" ? "lf-box-accent" : "lf-box"} />
      <DValue {...dagPos[v]} d={d[v]} below={v === "c" || v === "e"} />
    </g>)}
    <line x1="410" y1="8" x2="410" y2="250" className="lf-axis" />
    <Lines x={428} y={22} lines={[
      ["Topologisk orden: a, b, c, d, e", true],
      ["Én gjennomgang i den ordenen,", false],
      ["relaksjon av ut-kantene. Når u", false],
      ["behandles, er u.d allerede riktig.", false],
      ["", false],
      ["b.d = 0 + 3 = 3", false],
      ["c.d = min(0 + 6, 3 − 2) = 1", false],
      ["d.d = min(3 + 1, 1 + 4) = 4", false],
      ["e.d = min(1 + 2, 4 − 3) = 1", true],
      ["", false],
      ["Fremhevede kanter er forgjengerne.", false],
      ["De danner et korteste-vei-tre.", false],
    ]} step={20} />
  </Svg>;
}

export function BellmanFordPassFigure() {
  const nodes = ["s", "a", "b", "c"];
  // The list order of the edges decides how fast the estimates settle.
  const edges: Edge[] = [["s", "a", 4], ["a", "c", 2], ["s", "b", 5], ["b", "a", -3], ["b", "c", 6]];
  const snapshots = bellmanFordPasses(nodes, edges, "s", 3);
  const cell = 100, left = 150, top = 52, row = 32;
  return <Svg label="Bellman-Ford på fire noder: estimatene for a, b og c når riktige verdier etter to gjennomganger" width={700} height={262}>
    <text x="8" y="18" className="lf-text lf-small lf-strong">Kantrekkefølge i hver pass: (s, a), (a, c), (s, b), (b, a), (b, c)</text>
    {nodes.map((v, k) => <text key={v} x={left + k * cell + cell / 2} y={top - 10} textAnchor="middle" className="lf-text lf-small lf-strong">{v}</text>)}
    {snapshots.map((snap, r) => <g key={snap.label}>
      <text x="8" y={top + r * row + 20} className="lf-text lf-small lf-strong">{snap.label}</text>
      {nodes.map((v, k) => {
        const changed = r > 0 && snap.d[v] !== snapshots[r - 1].d[v];
        return <g key={v}>
          <rect x={left + k * cell + 10} y={top + r * row + 2} width={cell - 20} height={row - 6} rx="6" className={changed ? "lf-box-accent" : "lf-box"} />
          <text x={left + k * cell + cell / 2} y={top + r * row + 20} textAnchor="middle" className="lf-text lf-small lf-strong">{show(snap.d[v])}</text>
        </g>;
      })}
    </g>)}
    <Lines x={8} y={236} lines={[
      ["Markerte felt endres. Etter pass 2 er a = 2, b = 5 og c = 4, som er riktige avstander.", false],
      ["Pass 3 endrer ingenting. Med |V| − 1 = 3 gjennomganger er alt garantert riktig.", false],
    ]} step={18} />
  </Svg>;
}

export function NegativeCycleFigure() {
  const nodes = ["s", "a", "b"];
  // The cycle a → b → a has weight 1 − 3 = −2.
  const edges: Edge[] = [["s", "a", 2], ["a", "b", 1], ["b", "a", -3]];
  const snapshots = bellmanFordPasses(nodes, edges, "s", nodes.length - 1);
  const last = snapshots[snapshots.length - 1].d;
  const violated = edges.find(([u, v, w]) => last[v] > last[u] + w);
  const cell = 100, left = 150, top = 52, row = 32;
  return <Svg label="Bellman-Ford med negativ sykel: etter |V| − 1 passer er estimatene fortsatt for lave, og kontrollen finner en kant som kan slakkes" width={700} height={262}>
    <text x="8" y="18" className="lf-text lf-small lf-strong">Sykel: a → b → a, vekt 1 − 3 = −2</text>
    {nodes.map((v, k) => <text key={v} x={left + k * cell + cell / 2} y={top - 10} textAnchor="middle" className="lf-text lf-small lf-strong">{v}</text>)}
    {snapshots.map((snap, r) => <g key={snap.label}>
      <text x="8" y={top + r * row + 20} className="lf-text lf-small lf-strong">{snap.label}</text>
      {nodes.map((v, k) => {
        const changed = r > 0 && snap.d[v] !== snapshots[r - 1].d[v];
        return <g key={v}>
          <rect x={left + k * cell + 10} y={top + r * row + 2} width={cell - 20} height={row - 6} rx="6" className={changed ? "lf-box-accent" : "lf-box"} />
          <text x={left + k * cell + cell / 2} y={top + r * row + 20} textAnchor="middle" className="lf-text lf-small lf-strong">{show(snap.d[v])}</text>
        </g>;
      })}
    </g>)}
    <text x="8" y={top + snapshots.length * row + 20} className="lf-text lf-small lf-strong">Kontroll</text>
    <text x={left + cell / 2} y={top + snapshots.length * row + 20} textAnchor="middle" className="lf-text lf-small lf-strong">{violated ? `(${violated[0]}, ${violated[1]}) slakkes` : "ingen"}</text>
    <Lines x={8} y={236} lines={[
      ["Etter pass 2: a = −2, b = 1. Kanten (a, b) kan slakkes: 1 > −2 + 1 = −1.", false],
      ["Bellman-Ford returnerer false: hver runde rundt sykelen senker estimatet med 2.", false],
    ]} step={18} />
  </Svg>;
}

export function DijkstraTraceFigure() {
  const nodes = shortestPathNodes;
  const edges = shortestPathEdges;
  const at = shortestPathPositions;
  const { steps } = dijkstra(nodes, edges, "s");
  const start = initial(nodes, "s");
  const rows = [{ label: "Start", u: "", d: start }, ...steps.map((step, k) => ({ label: `${k + 1}.`, u: step.u, d: step.d }))];
  const col = (k: number) => 420 + k * 52;
  return <Svg label="Dijkstra på fem noder med positive kanter: estimatene etter hver uttaking, og kantene som er med i det korteste-vei-treet" width={700} height={300}>
    {edges.map(([a, b, w]) => <Arrow key={`${a}${b}`} from={at[a]} to={at[b]} className="lf-line" label={String(w)}
      dx={(a === "b" && b === "a") || (a === "c" && b === "d") ? 16 : 0} dy={(a === "b" && b === "a") || (a === "c" && b === "d") ? 0 : -7} />)}
    {nodes.map(v => <Node key={v} {...at[v]} label={v} />)}
    <line x1="296" y1="8" x2="296" y2="290" className="lf-axis" />
    <text x="310" y="20" className="lf-text lf-small lf-strong">Steg</text>
    <text x="340" y="20" className="lf-text lf-small lf-strong">Tatt ut</text>
    {nodes.map((v, k) => <text key={v} x={col(k)} y="20" textAnchor="middle" className="lf-text lf-small lf-strong">{`${v}.d`}</text>)}
    {rows.map((row, r) => <g key={row.label + r}>
      <text x="310" y={46 + r * 30} className="lf-text lf-small">{row.label}</text>
      {row.u && <text x="340" y={46 + r * 30} className="lf-text lf-small lf-strong">{row.u}</text>}
      {nodes.map((v, k) => <text key={v} x={col(k)} y={46 + r * 30} textAnchor="middle" className="lf-text lf-small">{show(row.d[v])}</text>)}
    </g>)}
    <Lines x={310} y={236} lines={[
      ["Ta ut lavest estimat, og slakk utkantene.", false],
      ["Resultat: s 0, b 5, c 7, a 8, d 11.", true],
      ["Treet bruker kantene s–b, b–a, b–c og c–d.", false],
    ]} step={18} />
  </Svg>;
}

export function DijkstraNegativeFigure() {
  const nodes = ["s", "x", "y", "z"];
  const edges: Edge[] = [["s", "x", 2], ["s", "y", 5], ["y", "x", -4], ["x", "z", 1]];
  const at: Record<string, Point> = { s: { x: 50, y: 130 }, x: { x: 190, y: 60 }, y: { x: 190, y: 200 }, z: { x: 330, y: 130 } };
  const { steps, d } = dijkstra(nodes, edges, "s");
  const order = steps.map(step => step.u).join(", ");
  return <Svg label="Dijkstra med en negativ kant: z får 3, men den korteste veien s, y, x, z har lengde 2" width={700} height={262}>
    {edges.map(([a, b, w]) => <Arrow key={`${a}${b}`} from={at[a]} to={at[b]}
      className={a === "y" && b === "x" ? "lf-line lf-stroke-accent" : "lf-line"} label={sign(w)}
      dx={a === "y" && b === "x" ? 16 : 0} dy={a === "y" && b === "x" ? 0 : -7} />)}
    {nodes.map(v => <g key={v}>
      <Node {...at[v]} label={v} tone={v === "z" ? "lf-box-accent" : "lf-box"} />
      <text x={at[v].x} y={v === "y" ? at[v].y + R + 22 : at[v].y - 24} textAnchor="middle" className="lf-text lf-small lf-fill-accent lf-strong">{`${d[v]}`}</text>
    </g>)}
    <line x1="400" y1="8" x2="400" y2="250" className="lf-axis" />
    <Lines x={418} y={24} lines={[
      ["Rekkefølge: " + order + ".", true],
      ["Da z tas ut, er x.d = 2, så z.d = 3.", false],
      ["Senere gir y en kortere vei til x:", false],
      ["5 − 4 = 1. Men z er allerede ferdig,", false],
      ["og får ikke ny verdi.", false],
      ["", false],
      ["Korteste vei til z: s → y → x → z,", true],
      ["lengde 5 − 4 + 1 = 2.", true],
      ["Negative kanter bryter Dijkstra.", false],
    ]} step={20} />
  </Svg>;
}
