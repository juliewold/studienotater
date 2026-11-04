import { useMemo, type ReactNode } from "react";
import type { LessonBlock } from "../../../../../data/curriculum/lessons/types";
import { shortestPathEdges, shortestPathNodes, shortestPathPositions, traversalGraph, traversalPositions, type Point } from "../../../../../data/curriculum/lessons/exampleGraphs";
import { RichText } from "../../curriculumShared";
import type { AnimationViewProps } from ".";
import { traceBfs } from "./bfs";
import { kindName, traceDfs } from "./dfs";
import { traceDijkstra } from "./dijkstra";

// Views for the graph algorithms. Each one draws the frame for the current step: the graph with
// the state of its nodes and edges, the variables of the algorithm, and the pseudocode line in use.

const R = 16;
const show = (value: number) => (value === Infinity ? "∞" : String(value));

type GraphEdge = { from: string; to: string; tone: "plain" | "tree" | "active"; weight?: number };
type GraphNode = { id: string; tone: "white" | "gray" | "black" | "current"; text?: string };

function Edge({ from, to, tone, weight }: { from: Point; to: Point; tone: GraphEdge["tone"]; weight?: number }) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const ux = (to.x - from.x) / length, uy = (to.y - from.y) / length;
  const start = { x: from.x + ux * R, y: from.y + uy * R };
  const end = { x: to.x - ux * (R + 5), y: to.y - uy * (R + 5) };
  const middle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  return <g>
    <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} className={`lp-graph-edge is-${tone}`} markerEnd="url(#lp-arrow)" />
    {weight !== undefined && <text x={middle.x - uy * 11} y={middle.y + ux * 11 + 4} textAnchor="middle" className="lp-graph-text is-small is-strong">{weight}</text>}
  </g>;
}

/** A small directed graph drawn at fixed positions, with node tones and optional labels. */
function GraphCanvas({ at, edges, nodes, label }: { at: Record<string, Point>; edges: GraphEdge[]; nodes: GraphNode[]; label: string }) {
  return <svg className="lp-graph" viewBox="0 0 500 262" role="img" aria-label={label}>
    <title>{label}</title>
    <defs>
      <marker id="lp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" className="lp-graph-arrow" />
      </marker>
    </defs>
    {edges.map(edge => <Edge key={`${edge.from}${edge.to}`} from={at[edge.from]} to={at[edge.to]} tone={edge.tone} weight={edge.weight} />)}
    {nodes.map(node => <g key={node.id}>
      <circle cx={at[node.id].x} cy={at[node.id].y} r={R} className={`lp-graph-node is-${node.tone}`} />
      <text x={at[node.id].x} y={at[node.id].y + 4.5} textAnchor="middle" className="lp-graph-text is-strong">{node.id}</text>
      {node.text && <text x={at[node.id].x} y={at[node.id].y - R - 7} textAnchor="middle" className="lp-graph-text is-label">{node.text}</text>}
    </g>)}
  </svg>;
}

/** The shared layout of the algorithm views: stage on the left, pseudocode and caption below. */
function AlgorithmLayout({ block, line, caption, children }: { block: LessonBlock; line: number | null; caption: string; children: ReactNode }) {
  const lines = block.type === "pseudocode" ? block.lines : [];
  return <div className="lp-anim">
    <div className="lp-anim-stage lp-graph-stage">{children}</div>
    <ol className="lp-anim-code" aria-label="Pseudokode">
      {lines.map((text, index) => <li key={index} className={line === index ? "is-active" : undefined}><code>{text}</code></li>)}
    </ol>
    <p className="lp-anim-caption" aria-live="polite"><RichText>{caption}</RichText></p>
  </div>;
}

export function BfsView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceBfs(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const nodes = Object.keys(traversalGraph);
  const edges = nodes.flatMap(u => traversalGraph[u].map((v): GraphEdge => ({
    from: u, to: v,
    tone: frame.edge?.[0] === u && frame.edge[1] === v ? "active" : frame.pi[v] === u ? "tree" : "plain",
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
    from: u, to: v,
    tone: frame.edge?.[0] === u && frame.edge[1] === v ? "active" : frame.pi[v] === u ? "tree" : "plain",
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

export function DijkstraView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceDijkstra(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const nodes = shortestPathNodes;
  const edges = shortestPathEdges.map(([a, b, w]): GraphEdge => ({
    from: a, to: b, weight: w,
    tone: frame.edge?.[0] === a && frame.edge[1] === b ? "active" : frame.pi[b] === a ? "tree" : "plain",
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
