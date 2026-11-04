// Figures for lecture 8, drawn from the examples in the lecture slides, CLRS chapter 20 and exercise 8.
// Every traversal order, time stamp, tree, edge type and component is computed by the algorithm it illustrates.
import { Svg } from "../figureKit";
import { sccGraph as scc, sccPositions as sccAt, clothesGraph as clothes, clothesPositions as clothesAt, traversalGraph as graph, traversalPositions as at } from "../exampleGraphs";

type Point = { x: number; y: number };
type Adj = Record<string, string[]>;

function Node({ x, y, label, tone = "lf-box", r = 16 }: Point & { label: string; tone?: string; r?: number }) {
  return <g>
    <circle cx={x} cy={y} r={r} className={tone} />
    <text x={x} y={y + 4.5} textAnchor="middle" className="lf-text lf-strong lf-small">{label}</text>
  </g>;
}

const unit = (dx: number, dy: number) => { const length = Math.hypot(dx, dy) || 1; return [dx / length, dy / length]; };

/** A directed edge, optionally bent so that antiparallel edges do not overlap. */
function Edge({ from, to, r = 16, className = "lf-line", bend = 0, both = false, label }: { from: Point; to: Point; r?: number; className?: string; bend?: number; both?: boolean; label?: string }) {
  const [nx, ny] = unit(to.y - from.y, from.x - to.x);
  const c = { x: (from.x + to.x) / 2 + nx * bend, y: (from.y + to.y) / 2 + ny * bend };
  const [ax, ay] = unit(c.x - from.x, c.y - from.y), [bx, by] = unit(to.x - c.x, to.y - c.y);
  const start = { x: from.x + ax * (r + (both ? 3 : 0)), y: from.y + ay * (r + (both ? 3 : 0)) }, end = { x: to.x - bx * (r + 3), y: to.y - by * (r + 3) };
  const mid = { x: (start.x + 2 * c.x + end.x) / 4, y: (start.y + 2 * c.y + end.y) / 4 };
  return <g>
    <path d={`M${start.x},${start.y} Q${c.x},${c.y} ${end.x},${end.y}`} className={className} style={className.includes("accent") ? { strokeWidth: 2 } : undefined} markerEnd="url(#lf-arrow)" markerStart={both ? "url(#lf-arrow)" : undefined} />
    {label && <g>
      <circle cx={mid.x} cy={mid.y} r="8" className="lf-box" />
      <text x={mid.x} y={mid.y + 4} textAnchor="middle" className="lf-text lf-small lf-strong">{label}</text>
    </g>}
  </g>;
}

function Lines({ x, y, lines, step = 19 }: { x: number; y: number; lines: [string, boolean?][]; step?: number }) {
  return <g>{lines.map(([text, strong], index) =>
    <text key={index} x={x} y={y + index * step} className={`lf-text lf-small${strong ? " lf-strong" : ""}`}>{text}</text>)}</g>;
}

function Legend({ items, x, y, step = 20 }: { items: [string, string][]; x: number; y: number; step?: number }) {
  return <g>{items.map(([tone, label], index) => <g key={label}>
    <rect x={x} y={y + index * step} width="14" height="14" rx="3" className={tone} />
    <text x={x + 21} y={y + 11 + index * step} className="lf-text lf-small">{label}</text>
  </g>)}</g>;
}

const edgesOf = (adj: Adj) => Object.entries(adj).flatMap(([u, vs]) => vs.map(v => [u, v] as const));

/** BFS(G, s) as in CLRS 20.2. Stops after `visits` dequeues, so a figure can show the state mid-run. */
function bfs(adj: Adj, s: string, visits = Infinity) {
  const color: Record<string, "white" | "gray" | "black"> = {}, d: Record<string, number> = {}, pi: Record<string, string | undefined> = {};
  for (const u of Object.keys(adj)) { color[u] = "white"; d[u] = Infinity; }
  color[s] = "gray"; d[s] = 0;
  const queue = [s], log: { u: string; found: string[]; queue: string[] }[] = [];
  while (queue.length && log.length < visits) {
    const u = queue.shift()!, found: string[] = [];
    for (const v of adj[u]) if (color[v] === "white") { color[v] = "gray"; d[v] = d[u] + 1; pi[v] = u; queue.push(v); found.push(v); }
    color[u] = "black";
    log.push({ u, found, queue: [...queue] });
  }
  return { color, d, pi, log };
}

type EdgeType = "tree" | "back" | "forward" | "cross";

/** DFS(G) as in CLRS 20.3, with the vertices tried in the given order, classifying every edge on the way. */
function dfs(adj: Adj, order = Object.keys(adj)) {
  const color: Record<string, "white" | "gray" | "black"> = {}, d: Record<string, number> = {}, f: Record<string, number> = {};
  const pi: Record<string, string | undefined> = {}, depth: Record<string, number> = {}, type: Record<string, EdgeType> = {}, trees: string[][] = [];
  for (const u of order) color[u] = "white";
  let time = 0;
  const visit = (u: string, tree: string[]) => {
    d[u] = ++time; color[u] = "gray"; tree.push(u);
    for (const v of adj[u]) {
      type[`${u}${v}`] = color[v] === "white" ? "tree" : color[v] === "gray" ? "back" : d[u] < d[v] ? "forward" : "cross";
      if (color[v] === "white") { pi[v] = u; depth[v] = depth[u] + 1; visit(v, tree); }
    }
    f[u] = ++time; color[u] = "black";
  };
  for (const u of order) if (color[u] === "white") { depth[u] = 0; trees.push([]); visit(u, trees.at(-1)!); }
  return { d, f, pi, depth, type, trees };
}

// The running example: a directed graph where 9 cannot be reached from 1, and 3 → 6 → 8 → 3 is a cycle.
const list = (items: string[]) => `⟨${items.join(", ")}⟩`;

export function AdjacencyFigure() {
  const adj: Adj = { 1: ["3", "4"], 2: ["6"], 3: ["1", "4"], 4: ["1", "5"], 5: ["2", "3", "6"], 6: ["3", "5"] };
  const pos: Record<string, Point> = { 1: { x: 50, y: 60 }, 4: { x: 170, y: 60 }, 5: { x: 290, y: 60 }, 3: { x: 110, y: 180 }, 6: { x: 230, y: 180 }, 2: { x: 350, y: 180 } };
  const nodes = Object.keys(adj), has = (u: string, v: string) => adj[u].includes(v);
  const drawn = edgesOf(adj).filter(([u, v]) => !(has(v, u) && v < u));
  const cell = 20, mx = 548, my = 52;
  return <Svg label="Samme rettede graf som nabolister og som nabomatrise (øving 8, spm. 2)" width={700} height={262}>
    <text x="8" y="18" className="lf-text lf-small lf-strong">Rettet graf G</text>
    {drawn.map(([u, v]) => <Edge key={u + v} from={pos[u]} to={pos[v]} both={has(v, u)} />)}
    {nodes.map(u => <Node key={u} {...pos[u]} label={u} />)}
    <Lines x={8} y={232} lines={[["Dobbel pil: kanten finnes begge veier."], [`|V| = ${nodes.length}, |E| = ${edgesOf(adj).length}`]]} step={17} />
    <line x1="392" y1="8" x2="392" y2="254" className="lf-axis" />
    <text x="404" y="18" className="lf-text lf-small lf-strong">Nabolister G.Adj</text>
    {nodes.map((u, k) => <g key={u}>
      <rect x="404" y={34 + k * 30} width="26" height="22" rx="4" className="lf-box-accent" />
      <text x="417" y={49 + k * 30} textAnchor="middle" className="lf-text lf-small lf-strong">{u}</text>
      {adj[u].map((v, j) => <g key={v}>
        <rect x={442 + j * 28} y={34 + k * 30} width="22" height="22" rx="4" className="lf-box" />
        <text x={453 + j * 28} y={49 + k * 30} textAnchor="middle" className="lf-text lf-small">{v}</text>
      </g>)}
    </g>)}
    <text x="404" y="234" className="lf-text lf-small">Plass Θ(V + E)</text>
    <line x1="528" y1="8" x2="528" y2="254" className="lf-axis" />
    <text x="540" y="18" className="lf-text lf-small lf-strong">Nabomatrise A</text>
    {nodes.map((u, i) => <g key={u}>
      <text x={mx - 8} y={my + i * cell + 14} textAnchor="end" className="lf-text lf-small lf-muted">{u}</text>
      <text x={mx + i * cell + cell / 2} y={my - 6} textAnchor="middle" className="lf-text lf-small lf-muted">{u}</text>
      {nodes.map((v, j) => <g key={v}>
        <rect x={mx + j * cell} y={my + i * cell} width={cell} height={cell} className={has(u, v) ? "lf-box-accent" : "lf-box"} />
        <text x={mx + j * cell + cell / 2} y={my + i * cell + 14} textAnchor="middle" className={`lf-text lf-small${has(u, v) ? " lf-strong" : " lf-muted"}`}>{has(u, v) ? 1 : 0}</text>
      </g>)}
    </g>)}
    <Lines x={540} y={194} lines={[["A[u, v] = 1 ⇔ (u, v) ∈ E"], ["rad u: ut-kanter fra u"], ["Plass Θ(V²)"]]} step={18} />
  </Svg>;
}

function GraphPanel({ tone, labels, edgeClass, dx = 0, scale = 1 }: { tone: (u: string) => string; labels?: (u: string) => string; edgeClass?: (u: string, v: string) => string; dx?: number; scale?: number }) {
  return <g transform={`translate(${dx},0) scale(${scale})`}>
    {edgesOf(graph).map(([u, v]) => <Edge key={u + v} from={at[u]} to={at[v]} className={edgeClass?.(u, v) ?? "lf-line"} />)}
    {Object.keys(graph).map(u => <g key={u}>
      <Node {...at[u]} label={u} tone={tone(u)} />
      {labels && <text x={at[u].x + (u === "9" ? -19 : 19)} y={at[u].y - 14} textAnchor={u === "9" ? "end" : "start"} className="lf-text lf-small lf-fill-accent lf-strong">{labels(u)}</text>}
    </g>)}
  </g>;
}

export function FrontierFigure() {
  const mid = bfs(graph, "1", 3), done = bfs(graph, "1");
  const tone = (color: string) => color === "black" ? "lf-box-sorted" : color === "gray" ? "lf-box-warn" : "lf-box";
  const scale = 0.66, gray = Object.keys(graph).filter(u => mid.color[u] === "gray");
  return <Svg label="Traversering: besøkte, oppdagede og uoppdagede noder, og snittet som viser at node 9 ikke kan nås fra node 1" width={700} height={262}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">Underveis: etter tre besøk</text>
    <g transform="translate(0,14)"><GraphPanel tone={u => tone(mid.color[u])} scale={scale} /></g>
    <line x1="342" y1="8" x2="342" y2="210" className="lf-axis" />
    <text x="356" y="16" className="lf-text lf-small lf-strong">Ferdig: S = alle som kan nås fra s = 1</text>
    <g transform="translate(352,14)">
      <rect x={24 * scale} y={14 * scale} width={(396 - 24) * scale} height={(250 - 14) * scale} rx="10" className="lf-region lf-dashed" />
      <GraphPanel tone={u => tone(done.color[u])} scale={scale} edgeClass={(u, v) => u === "9" && v === "6" ? "lf-line lf-stroke-warn" : "lf-line"} />
    </g>
    <Legend x={8} y={196} items={[["lf-box-sorted", "svart: besøkt"], ["lf-box-warn", `grå: oppdaget, ligger i huskelisten (${gray.join(", ")})`], ["lf-box", "hvit: ikke oppdaget ennå"]]} />
    <Lines x={356} y={206} lines={[["Ingen kant går ut av S. Kanten 9 → 6 krysser snittet,"], ["men inn mot s-siden: et bevis for at ingen sti 1 ⇝ 9 finnes."]]} step={18} />
  </Svg>;
}

export function BfsFigure() {
  const { d, pi, log } = bfs(graph, "1");
  const layerTone = (u: string) => d[u] === Infinity ? "lf-box" : ["lf-box-accent", "lf-box-sorted", "lf-box-warn", "lf-box-sorted"][d[u]] ?? "lf-box";
  return <Svg label="BFS fra node 1: avstander, bredde-først-treet og køen etter hvert besøk" width={700} height={300}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">Bredde-først-tre (lilla kanter) og v.d</text>
    <g transform="translate(0,14) scale(0.86)">
      {edgesOf(graph).map(([u, v]) => <Edge key={u + v} from={at[u]} to={at[v]} className={pi[v] === u ? "lf-line lf-stroke-accent" : "lf-line lf-dashed lf-muted-stroke"} />)}
      {Object.keys(graph).map(u => <g key={u}>
        <Node {...at[u]} label={u} tone={layerTone(u)} />
        <text x={at[u].x + (u === "9" ? -19 : 19)} y={at[u].y - 14} textAnchor={u === "9" ? "end" : "start"} className="lf-text lf-small lf-strong">{d[u] === Infinity ? "d = ∞" : `d = ${d[u]}`}</text>
      </g>)}
    </g>
    <line x1="436" y1="8" x2="436" y2="292" className="lf-axis" />
    <text x="450" y="16" className="lf-text lf-small lf-strong">u = Dequeue(Q)<tspan x="560">Q etterpå</tspan></text>
    {log.map((step, k) => <g key={step.u}>
      <rect x="450" y={28 + k * 25} width="102" height="21" rx="4" className={step.found.length ? "lf-box-accent" : "lf-box"} />
      <text x="458" y={43 + k * 25} className="lf-text lf-small lf-strong">{`${step.u} (d = ${d[step.u]})`}<tspan className="lf-muted">{step.found.length ? ` +${step.found.join(",")}` : ""}</tspan></text>
      <text x="560" y={43 + k * 25} className="lf-text lf-small">{list(step.queue)}</text>
    </g>)}
    <Lines x={450} y={238} lines={[[`Besøksrekkefølge: ${log.map(step => step.u).join(", ")}`, true], ["Lag for lag: alle med d = k før d = k + 1."], ["Node 9 nås ikke: 9.d = ∞, 9.π = nil."]]} step={18} />
  </Svg>;
}

const search = dfs(graph);

export function DfsFigure() {
  const { d, f, pi, depth, trees } = search;
  const treeAt: Record<string, Point> = {};
  trees.forEach((tree, t) => {
    const byDepth: Record<number, string[]> = {};
    for (const u of tree) (byDepth[depth[u]] ??= []).push(u);
    for (const u of tree) { const row = byDepth[depth[u]]; treeAt[u] = { x: 520 + t * 130 + (row.indexOf(u) - (row.length - 1) / 2) * 52, y: 34 + depth[u] * 36 }; }
  });
  return <Svg label="DFS på eksempelgrafen: oppdagelses- og ferdigtider, og dybde-først-skogen som forgjengerne danner" width={700} height={312}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">v.d / v.f, startnoder i rekkefølgen 1, 2, …, 9</text>
    <g transform="translate(0,14) scale(0.86)">
      <GraphPanel tone={u => depth[u] === 0 ? "lf-box-accent" : "lf-box"} labels={u => `${d[u]}/${f[u]}`} edgeClass={(u, v) => pi[v] === u ? "lf-line lf-stroke-accent" : "lf-line lf-dashed lf-muted-stroke"} />
    </g>
    <line x1="436" y1="8" x2="436" y2="304" className="lf-axis" />
    <text x="450" y="16" className="lf-text lf-small lf-strong">Dybde-først-skogen G_π</text>
    {Object.keys(graph).filter(u => pi[u]).map(u => <line key={u} x1={treeAt[pi[u]!].x} y1={treeAt[pi[u]!].y} x2={treeAt[u].x} y2={treeAt[u].y} className="lf-line lf-stroke-accent" />)}
    {Object.keys(graph).map(u => <g key={u}>
      <Node {...treeAt[u]} label={u} r={13} tone={depth[u] === 0 ? "lf-box-accent" : "lf-box"} />
      <text x={treeAt[u].x + 17} y={treeAt[u].y + 4} className="lf-text lf-small">{`${d[u]}/${f[u]}`}</text>
    </g>)}
    <Lines x={8} y={266} lines={[[`${trees.length} trær: DFS-Visit kalles fra 1 og deretter fra 9, den eneste som fortsatt er hvit.`, true], ["DFS går dypt før den går bredt: 1 → 2 → 4 → 7 → 8 → 3, og først da til 5 og 6."]]} />
  </Svg>;
}

export function ParenthesisFigure() {
  const { d, f, depth } = search;
  const nodes = Object.keys(graph).sort((a, b) => d[a] - d[b]);
  const x = (t: number) => 30 + t * 36, row = (u: string) => 34 + depth[u] * 26;
  const events = Array.from({ length: 2 * nodes.length }, (_, k) => k + 1).map(t => { const u = nodes.find(v => d[v] === t || f[v] === t)!; return d[u] === t ? `(${u}` : `${u})`; });
  return <Svg label="Parentesteoremet: intervallene [v.d, v.f] er enten disjunkte eller ligger inni hverandre" width={700} height={292}>
    {Array.from({ length: 18 }, (_, k) => k + 1).map(t => <g key={t}>
      <line x1={x(t)} y1="26" x2={x(t)} y2="214" className="lf-axis" />
      <text x={x(t)} y="20" textAnchor="middle" className="lf-text lf-small lf-muted">{t}</text>
    </g>)}
    {nodes.map(u => <g key={u}>
      <rect x={x(d[u]) - 4} y={row(u)} width={x(f[u]) - x(d[u]) + 8} height="20" rx="8" className={depth[u] === 0 ? "lf-box-accent" : "lf-box-sorted"} />
      <text x={x(d[u]) + 6} y={row(u) + 14} className="lf-text lf-small lf-strong">{u}</text>
    </g>)}
    <text x="8" y="240" className="lf-text lf-strong">{events.join(" ")}</text>
    <Lines x={8} y={262} lines={[["Hver rad er én dybde i DF-skogen. 5 og 6 er etterkommere av 3: begge ligger inni [6, 11], men ikke inni hverandre."], ["Skriv «(u» ved u.d og «u)» ved u.f: da blir parentesene alltid riktig nøstet (CLRS teorem 20.7)."]]} step={18} />
  </Svg>;
}

export function EdgeClassFigure() {
  const { type } = search;
  const style: Record<EdgeType, [string, string]> = { tree: ["lf-line lf-stroke-accent", "T"], back: ["lf-line lf-stroke-warn", "B"], forward: ["lf-line lf-dashed", "F"], cross: ["lf-line lf-dashed lf-muted-stroke", "C"] };
  const groups = (["tree", "back", "forward", "cross"] as EdgeType[]).map(kind => [kind, edgesOf(graph).filter(([u, v]) => type[u + v] === kind)] as const);
  const why: Record<EdgeType, string> = { tree: "v hvit", back: "v grå", forward: "v svart, u.d < v.d", cross: "v svart, u.d > v.d" };
  const names: Record<EdgeType, string> = { tree: "Trekanter", back: "Bakoverkanter", forward: "Foroverkanter", cross: "Krysskanter" };
  return <Svg label="Kantklassifisering under DFS: tre-, bakover-, forover- og krysskanter i eksempelgrafen" width={700} height={262}>
    <g transform="translate(0,8) scale(0.86)">
      {edgesOf(graph).map(([u, v]) => <Edge key={u + v} from={at[u]} to={at[v]} className={style[type[u + v]][0]} label={style[type[u + v]][1]} />)}
      {Object.keys(graph).map(u => <Node key={u} {...at[u]} label={u} />)}
    </g>
    <line x1="436" y1="8" x2="436" y2="254" className="lf-axis" />
    <text x="450" y="18" className="lf-text lf-small lf-strong">Når (u, v) undersøkes, er …</text>
    {groups.map(([kind, edges], k) => <g key={kind}>
      <text x="450" y={46 + k * 46} className="lf-text lf-small lf-strong">{`${style[kind][1]}: ${names[kind]}`}<tspan className="lf-muted">{` (${why[kind]})`}</tspan></text>
      <text x="450" y={64 + k * 46} className="lf-text lf-small">{edges.map(([u, v]) => `(${u}, ${v})`).join(", ")}</text>
    </g>)}
    <Lines x={450} y={226} lines={[["Hver bakoverkant lukker en sykel:"], ["7 → 8 → 3 → 5 → 7 og 8 → 3 → 6 → 8."]]} step={18} />
  </Svg>;
}


function Item({ x, y, label, sub, below = true, tone = "lf-box" }: Point & { label: string; sub?: string; below?: boolean; tone?: string }) {
  return <g>
    <rect x={x - 33} y={y - 13} width="66" height="26" rx="7" className={tone} />
    <text x={x} y={y + 4} textAnchor="middle" className="lf-text lf-small lf-strong">{label}</text>
    {sub && <text x={below ? x : x + 36} y={below ? y + 27 : y - 15} textAnchor={below ? "middle" : "start"} className="lf-text lf-small lf-fill-accent lf-strong">{sub}</text>}
  </g>;
}

/** Shortens a straight edge between two 66 × 26 boxes so that it starts and ends on their borders. */
function boxEdge(a: Point, b: Point) {
  const dx = b.x - a.x, dy = b.y - a.y, cut = (t: number) => Math.min(33 / Math.abs(dx || 1e-9), 13 / Math.abs(dy || 1e-9)) * t;
  return { x1: a.x + dx * cut(1), y1: a.y + dy * cut(1), x2: b.x - dx * cut(1.15), y2: b.y - dy * cut(1.15) };
}

export function TopoSortFigure() {
  // The DFS loop tries the garments in the order of the slides, so the times match them.
  const { d, f } = dfs(clothes, ["skjorte", "slips", "jakke", "belte", "klokke", "truse", "bukse", "sko", "sokker"]);
  const sorted = Object.keys(clothes).sort((a, b) => f[b] - f[a]);
  const rowX = (k: number) => 40 + k * 77, rowY = 290;
  return <Svg label="Topologisk sortering av påkledning: DFS gir ferdigtider, og nodene ordnet etter synkende ferdigtid har alle kanter pekende fremover" width={700} height={344}>
    <text x="580" y="20" className="lf-text lf-small lf-strong">1. DFS(G)</text>
    <Lines x={580} y={40} lines={[["Tallene er v.d/v.f."], ["«u → v»: u må på"], ["før v."]]} step={17} />
    {edgesOf(clothes).map(([u, v]) => <line key={u + v} {...boxEdge(clothesAt[u], clothesAt[v])} className="lf-line" markerEnd="url(#lf-arrow)" />)}
    {Object.keys(clothes).map(u => <Item key={u} {...clothesAt[u]} label={u} sub={`${d[u]}/${f[u]}`} below={u === "belte" || u === "jakke"} />)}
    <line x1="8" y1="216" x2="692" y2="216" className="lf-axis" />
    <text x="8" y="236" className="lf-text lf-small lf-strong">2. Sett hver node først i en lenket liste når den blir ferdig: synkende v.f, og alle kanter peker mot høyre</text>
    {edgesOf(clothes).map(([u, v]) => {
      const a = rowX(sorted.indexOf(u)), b = rowX(sorted.indexOf(v)), lift = 12 + (b - a) / 12;
      return <path key={u + v} d={`M${a + 8},${rowY - 13} Q${(a + b) / 2},${rowY - 13 - lift} ${b - 8},${rowY - 15}`} className="lf-line" markerEnd="url(#lf-arrow)" />;
    })}
    {sorted.map((u, k) => <Item key={u} x={rowX(k)} y={rowY} label={u} sub={`f = ${f[u]}`} tone="lf-box-sorted" />)}
  </Svg>;
}

function transpose(adj: Adj): Adj {
  const result: Adj = Object.fromEntries(Object.keys(adj).map(u => [u, []]));
  for (const [u, v] of edgesOf(adj)) result[v].push(u);
  return result;
}

function SccGraph({ adj, tone, labels }: { adj: Adj; tone: (u: string) => string; labels: (u: string) => string }) {
  return <g>
    {edgesOf(adj).map(([u, v]) => u === v
      ? <path key={u + v} d={`M${sccAt[u].x + 14},${sccAt[u].y - 8} C${sccAt[u].x + 52},${sccAt[u].y - 30} ${sccAt[u].x + 52},${sccAt[u].y + 30} ${sccAt[u].x + 18},${sccAt[u].y + 9}`} className="lf-line" markerEnd="url(#lf-arrow)" />
      : <Edge key={u + v} from={sccAt[u]} to={sccAt[v]} bend={adj[v].includes(u) ? 9 : 0} />)}
    {Object.keys(adj).map(u => <g key={u}>
      <Node {...sccAt[u]} label={u} tone={tone(u)} />
      <text x={sccAt[u].x} y={sccAt[u].y + (sccAt[u].y > 100 ? 32 : -22)} textAnchor="middle" className="lf-text lf-small lf-fill-accent lf-strong">{labels(u)}</text>
    </g>)}
  </g>;
}

export function SccFigure() {
  const first = dfs(scc);
  const byFinish = Object.keys(scc).sort((a, b) => first.f[b] - first.f[a]);
  const second = dfs(transpose(scc), byFinish);
  const comp = (u: string) => second.trees.findIndex(tree => tree.includes(u));
  const tones = ["lf-box-accent", "lf-box-sorted", "lf-box-warn", "lf-box"];
  const names = second.trees.map(tree => `{${[...tree].sort().join(", ")}}`);
  const dag = [...new Set(edgesOf(scc).filter(([u, v]) => comp(u) !== comp(v)).map(([u, v]) => `${comp(u)}-${comp(v)}`))].map(key => key.split("-").map(Number));
  const cx = (k: number) => 110 + k * 160;
  return <Svg label="Strongly-Connected-Components: DFS på G gir ferdigtider, DFS på den transponerte grafen i synkende ferdigtid gir én sterk komponent per tre" width={700} height={384}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">1. DFS(G): v.d/v.f</text>
    <g transform="translate(0,18) scale(0.82)"><SccGraph adj={scc} tone={() => "lf-box"} labels={u => `${first.d[u]}/${first.f[u]}`} /></g>
    <line x1="350" y1="8" x2="350" y2="214" className="lf-axis" />
    <text x="362" y="16" className="lf-text lf-small lf-strong">2.–3. DFS(Gᵀ) i synkende v.f fra steg 1</text>
    <g transform="translate(352,18) scale(0.82)"><SccGraph adj={transpose(scc)} tone={u => tones[comp(u)]} labels={u => `tre ${comp(u) + 1}`} /></g>
    <line x1="8" y1="222" x2="692" y2="222" className="lf-axis" />
    <text x="8" y="242" className="lf-text lf-small lf-strong">{`Startrekkefølge i steg 3: ${byFinish.join(", ")} (synkende v.f).`}</text>
    <text x="8" y="260" className="lf-text lf-small">Komponentgrafen G<tspan baselineShift="super" fontSize="8">SCC</tspan> er en DAG, og trærne kommer ut i topologisk sortert rekkefølge:</text>
    {dag.map(([a, b]) => b - a === 1
      ? <line key={`${a}${b}`} x1={cx(a) + 52} y1="290" x2={cx(b) - 55} y2="290" className="lf-line" markerEnd="url(#lf-arrow)" />
      : <path key={`${a}${b}`} d={`M${cx(a) + 24},306 Q${(cx(a) + cx(b)) / 2},${306 + 26 * (b - a)} ${cx(b) - 24},309`} className="lf-line" markerEnd="url(#lf-arrow)" />)}
    {names.map((name, k) => <g key={name}>
      <rect x={cx(k) - 52} y="274" width="104" height="32" rx="16" className={tones[k]} />
      <text x={cx(k)} y="294" textAnchor="middle" className="lf-text lf-small lf-strong">{name}</text>
    </g>)}
    <text x="8" y="374" className="lf-text lf-small">I Gᵀ går alle kanter mellom komponenter baklengs, så hvert DFS-Visit blir «fanget» i én komponent.</text>
  </Svg>;
}

/** Iterative DFS with an explicit stack. With `grayOnPush` it is BFS with the queue swapped for a stack. */
function stackSearch(adj: Adj, s: string, grayOnPush: boolean) {
  const seen = new Set<string>(grayOnPush ? [s] : []), stack = [s], order: string[] = [], log: { u: string; skip: boolean; pushed: string[]; stack: string[] }[] = [];
  while (stack.length) {
    const u = stack.pop()!;
    if (!grayOnPush && seen.has(u)) { log.push({ u, skip: true, pushed: [], stack: [...stack] }); continue; }
    if (!grayOnPush) seen.add(u);
    order.push(u);
    const pushed = (grayOnPush ? adj[u] : [...adj[u]].reverse()).filter(v => !seen.has(v));
    for (const v of pushed) { if (grayOnPush) seen.add(v); stack.push(v); }
    log.push({ u, skip: false, pushed, stack: [...stack] });
  }
  return { order, log };
}

export function StackDfsFigure() {
  const exact = stackSearch(graph, "1", false), loose = stackSearch(graph, "1", true);
  return <Svg label="DFS med eksplisitt stakk: nodene merkes når de tas ut, og naboene legges på i omvendt rekkefølge" width={700} height={354}>
    <text x="8" y="18" className="lf-text lf-small lf-strong">u = Pop(S)<tspan x="120">besøk?</tspan><tspan x="200">Push (omvendt nabo-rekkefølge)</tspan><tspan x="430">S etterpå (toppen til høyre)</tspan></text>
    {exact.log.map((step, k) => <g key={k}>
      <rect x="8" y={28 + k * 24} width="684" height="20" rx="4" className={step.skip ? "lf-box" : "lf-box-accent"} />
      <text x="16" y={42 + k * 24} className="lf-text lf-small lf-strong">{step.u}</text>
      <text x="120" y={42 + k * 24} className={`lf-text lf-small${step.skip ? " lf-muted" : ""}`}>{step.skip ? "nei, alt besøkt" : "ja"}</text>
      <text x="200" y={42 + k * 24} className="lf-text lf-small">{step.pushed.length ? step.pushed.join(", ") : "–"}</text>
      <text x="430" y={42 + k * 24} className="lf-text lf-small">{list(step.stack)}</text>
    </g>)}
    <Lines x={8} y={300} lines={[
      [`Besøksrekkefølge: ${exact.order.join(", ")}, akkurat som oppdagelsesrekkefølgen til rekursiv DFS-Visit(G, 1).`, true],
      [`BFS med stakk i stedet for kø (grå ved Push) gir ${loose.order.join(", ")}: også dybde-først, men ikke samme rekkefølge.`],
      ["Node 3 og 5 legges på to ganger. Stakken kan bli Θ(E) stor, men hver kant gir høyst én Push, så tiden er fortsatt O(V + E)."],
    ]} step={18} />
  </Svg>;
}
