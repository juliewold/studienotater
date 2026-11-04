import { useMemo } from "react";
import type { AnimationViewProps } from ".";
import { bellmanFordEdges, bellmanFordNodes, clothesGraph, clothesPositions, dagEdges, dagOrder, dagPositions, sccGraph, sccPositions, shortestPathEdges, shortestPathNodes, shortestPathPositions, traversalGraph, traversalPositions } from "../../../../../data/curriculum/lessons/exampleGraphs";
import { AlgorithmLayout, GraphCanvas, type GraphEdge, type GraphNode } from "./graphCanvas";
import { traceBfs } from "./bfs";
import { kindName, traceDfs } from "./dfs";
import { traceDijkstra } from "./dijkstra";
import { traceBellmanFord } from "./bellmanFord";
import { traceTopo } from "./topo";
import { traceScc } from "./scc";
import { traceDag } from "./dag";

// Views for the traversal, shortest-path and ordering algorithms. Each one draws the frame for the
// current step: the graph with the state of its nodes and edges, the variables, and the pseudocode.

const show = (value: number) => (value === Infinity ? "∞" : String(value));
const same = (edge: [string, string] | null, u: string, v: string) => edge !== null && edge[0] === u && edge[1] === v;

export function BfsView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceBfs(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const nodes = Object.keys(traversalGraph);
  const edges = nodes.flatMap(u => traversalGraph[u].map((v): GraphEdge => ({
    from: u, to: v, tone: same(frame.edge, u, v) ? "active" : frame.pi[v] === u ? "tree" : "plain",
  })));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={traversalPositions} label="BFS på eksempelgrafen" edges={edges} nodes={nodes.map((u): GraphNode => ({
      id: u, tone: frame.current === u ? "current" : frame.color[u], text: `d = ${show(frame.d[u])}`,
    }))} />
    <div className="lp-anim-vars" aria-live="off">
      <span>u = {frame.current ?? "–"}</span>
      <span className="is-key">Kø Q = ⟨{frame.queue.join(", ")}⟩</span>
    </div>
  </AlgorithmLayout>;
}

export function DfsView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceDfs(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const nodes = Object.keys(traversalGraph);
  const edges = nodes.flatMap(u => traversalGraph[u].map((v): GraphEdge => ({
    from: u, to: v, tone: same(frame.edge, u, v) ? "active" : frame.pi[v] === u ? "tree" : "plain",
  })));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={traversalPositions} label="DFS på eksempelgrafen" edges={edges} nodes={nodes.map((u): GraphNode => ({
      id: u,
      tone: frame.current === u ? "current" : frame.color[u],
      text: frame.d[u] === undefined ? undefined : frame.f[u] === undefined ? `${frame.d[u]}` : `${frame.d[u]}/${frame.f[u]}`,
    }))} />
    <div className="lp-anim-vars" aria-live="off">
      <span>tid = {frame.time}</span>
      <span className="is-key">Kallstakk: {frame.stack.length ? frame.stack.join(" → ") : "tom"}</span>
      {frame.kind && frame.edge && <span>{frame.edge[0]} → {frame.edge[1]}: {kindName[frame.kind]}</span>}
    </div>
  </AlgorithmLayout>;
}

// The dressing graph has long names in large circles, so it is drawn with room around the edges.
const clothesAt = Object.fromEntries(Object.entries(clothesPositions).map(([name, p]) => [name, { x: 45 + p.x * 0.92, y: 50 + p.y * 0.9 }]));

export function TopoView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceTopo(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const nodes = Object.keys(clothesGraph);
  const edges = nodes.flatMap(u => clothesGraph[u].map((v): GraphEdge => ({
    from: u, to: v, tone: same(frame.edge, u, v) ? "active" : frame.pi[v] === u ? "tree" : "plain",
  })));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={clothesAt} width={560} label="Topologisk sortering av påkledning" edges={edges} nodes={nodes.map((u): GraphNode => ({
      id: u,
      tone: frame.current === u ? "current" : frame.color[u],
      text: frame.d[u] === undefined ? undefined : frame.f[u] === undefined ? `${frame.d[u]}` : `${frame.d[u]}/${frame.f[u]}`,
    }))} />
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">Lenket liste: ⟨{frame.list.join(", ")}⟩</span>
      {frame.kind && frame.edge && <span>{frame.edge[0]} → {frame.edge[1]}: {kindName[frame.kind]}</span>}
    </div>
  </AlgorithmLayout>;
}

export function DijkstraView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceDijkstra(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const nodes = shortestPathNodes;
  const edges = shortestPathEdges.map(([a, b, w]): GraphEdge => ({
    from: a, to: b, weight: w,
    tone: same(frame.edge, a, b) ? "active" : frame.pi[b] === a ? "tree" : "plain",
  }));
  const open = nodes.filter(v => !frame.done.includes(v));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={shortestPathPositions} label="Dijkstra på eksempelgrafen" edges={edges} nodes={nodes.map((v): GraphNode => ({
      id: v,
      tone: frame.current === v ? "current" : frame.done.includes(v) ? "black" : frame.d[v] < Infinity ? "gray" : "white",
      text: `d = ${show(frame.d[v])}`,
    }))} />
    <table className="lp-anim-table" aria-label="Estimater v.d">
      <thead><tr><th scope="col">Node</th>{nodes.map(v => <th key={v} scope="col">{v}</th>)}</tr></thead>
      <tbody><tr>
        <th scope="row">v.d</th>
        {nodes.map(v => <td key={v} className={frame.lowered && frame.edge?.[1] === v ? "is-changed" : undefined}>{show(frame.d[v])}</td>)}
      </tr></tbody>
    </table>
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">S = {"{"}{frame.done.join(", ")}{"}"}</span>
      <span>Q = {"{"}{open.join(", ")}{"}"}</span>
    </div>
  </AlgorithmLayout>;
}

export function BellmanFordView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceBellmanFord(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const nodes = bellmanFordNodes;
  const edges = bellmanFordEdges.map(([a, b, w]): GraphEdge => ({ from: a, to: b, weight: w, tone: same(frame.edge, a, b) ? "active" : "plain" }));
  const checking = frame.pass > bellmanFordNodes.length - 1;
  // One row per finished pass, and a live row for the current estimates.
  const rows = [...frame.rows, { label: checking ? "Kontroll" : "Nå", d: frame.d }];
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={shortestPathPositions} label="Bellman-Ford på eksempelgrafen" edges={edges} nodes={nodes.map((v): GraphNode => ({
      id: v,
      tone: frame.edge && frame.edge[1] === v && frame.lowered ? "current" : frame.d[v] < Infinity ? "black" : "white",
      text: `d = ${show(frame.d[v])}`,
    }))} />
    <table className="lp-anim-table" aria-label="Estimater v.d for hvert pass">
      <thead><tr><th scope="col">Steg</th>{nodes.map(v => <th key={v} scope="col">{v}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => {
        const before = rows[index - 1]?.d;
        return <tr key={`${row.label}${index}`}>
          <th scope="row">{row.label}</th>
          {nodes.map(v => <td key={v} className={before && before[v] !== row.d[v] ? "is-changed" : undefined}>{show(row.d[v])}</td>)}
        </tr>;
      })}</tbody>
    </table>
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">{checking ? "Kontrollrunde" : frame.pass === 0 ? "Start" : `Pass ${frame.pass} av ${bellmanFordNodes.length - 1}`}</span>
    </div>
  </AlgorithmLayout>;
}

const sccComponentName = (members: string[]) => `{${members.join(", ")}}`;

export function SccView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceScc(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const nodes = Object.keys(sccGraph);
  const member = new Set(frame.components.flat());
  const edges: GraphEdge[] = nodes.flatMap(u => frame.edges[u].map((v): GraphEdge => ({
    from: u, to: v, tone: same(frame.edge, u, v) ? "active" : frame.pi[v] === u ? "tree" : "plain",
  })));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={sccPositions} label={frame.phase === 1 ? "Første DFS på grafen" : "Andre DFS på den omvendte grafen"} edges={edges} nodes={nodes.map((u): GraphNode => ({
      id: u,
      tone: frame.current === u ? "current" : member.has(u) ? "black" : frame.color[u] === "gray" ? "gray" : "white",
      text: frame.d[u] === undefined ? undefined : frame.f[u] === undefined ? `${frame.d[u]}` : `${frame.d[u]}/${frame.f[u]}`,
    }))} />
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">{frame.phase === 1 ? "Steg 1: DFS på G" : "Steg 2: DFS på Gᵀ"}</span>
      {frame.components.length > 0 && <span>Komponenter: {frame.components.map(sccComponentName).join(" ")}</span>}
    </div>
  </AlgorithmLayout>;
}

export function DagView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceDag(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const edges = dagEdges.map(([a, b, w]): GraphEdge => ({
    from: a, to: b, weight: w, tone: same(frame.edge, a, b) ? "active" : frame.pi[b] === a ? "tree" : "plain",
  }));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={dagPositions} label="DAG-Shortest-Paths på eksempelgrafen" edges={edges} nodes={dagOrder.map((v): GraphNode => ({
      id: v,
      tone: frame.current === v ? "current" : frame.processed.includes(v) ? "black" : "white",
      text: `d = ${show(frame.d[v])}`,
    }))} />
    <table className="lp-anim-table" aria-label="Estimater v.d">
      <thead><tr><th scope="col">Node</th>{dagOrder.map(v => <th key={v} scope="col">{v}</th>)}</tr></thead>
      <tbody><tr>
        <th scope="row">v.d</th>
        {dagOrder.map(v => <td key={v} className={frame.lowered && frame.edge?.[1] === v ? "is-changed" : undefined}>{show(frame.d[v])}</td>)}
      </tr></tbody>
    </table>
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">Behandlet: {frame.processed.length ? frame.processed.join(", ") : "ingen"}</span>
    </div>
  </AlgorithmLayout>;
}
