import type { ReactNode } from "react";
import type { LessonBlock } from "../../../../../data/curriculum/lessons/types";
import type { Point } from "../../../../../data/curriculum/lessons/exampleGraphs";
import { RichText } from "../../curriculumShared";

// Shared drawing for the graph animations. Nodes and edges take their state from the frame that
// is shown, so the picture always matches the caption being read.

export type GraphEdge = { from: string; to: string; tone: "plain" | "tree" | "active" | "rejected"; weight?: number };
export type GraphNode = { id: string; tone: "white" | "gray" | "black" | "current"; text?: string; /** Shown inside the node instead of the id, for example a value in a heap. */ label?: string };

/** Nodes with long names (for example «skjorte») get a larger circle, so the name fits inside. */
const nodeRadius = (id: string) => Math.max(16, Math.ceil(id.length * 4.8) + 8);

function Edge({ from, to, fromR, toR, tone, weight, directed }: { from: Point; to: Point; fromR: number; toR: number; tone: GraphEdge["tone"]; weight?: number; directed: boolean }) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const ux = (to.x - from.x) / length, uy = (to.y - from.y) / length;
  const start = { x: from.x + ux * fromR, y: from.y + uy * fromR };
  const end = { x: to.x - ux * (toR + (directed ? 5 : 0)), y: to.y - uy * (toR + (directed ? 5 : 0)) };
  const middle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  return <g>
    <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} className={`lp-graph-edge is-${tone}`} markerEnd={directed ? "url(#lp-arrow)" : undefined} />
    {weight !== undefined && <text x={middle.x - uy * 11} y={middle.y + ux * 11 + 4} textAnchor="middle" className="lp-graph-text is-small is-strong">{weight}</text>}
  </g>;
}

/** A small graph drawn at fixed positions, with node tones, optional labels, and directed or undirected edges. */
export function GraphCanvas({ at, edges, nodes, label, directed = true, width = 500, height = 262 }: {
  at: Record<string, Point>; edges: GraphEdge[]; nodes: GraphNode[]; label: string; directed?: boolean; width?: number; height?: number;
}) {
  return <svg className="lp-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
    <title>{label}</title>
    <defs>
      <marker id="lp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" className="lp-graph-arrow" />
      </marker>
    </defs>
    {/* The index is part of the key: one pair can appear twice, as a tree edge and as the active proposal. */}
    {edges.map((edge, index) => <Edge key={`${index}-${edge.from}-${edge.to}`} from={at[edge.from]} to={at[edge.to]} fromR={nodeRadius(edge.from)} toR={nodeRadius(edge.to)}
      tone={edge.tone} weight={edge.weight} directed={directed} />)}
    {nodes.map(node => <g key={node.id}>
      <circle cx={at[node.id].x} cy={at[node.id].y} r={nodeRadius(node.id)} className={`lp-graph-node is-${node.tone}`} />
      <text x={at[node.id].x} y={at[node.id].y + 4.5} textAnchor="middle" className="lp-graph-text is-strong">{node.label ?? node.id}</text>
      {node.text && <text x={at[node.id].x} y={at[node.id].y - nodeRadius(node.id) - 7} textAnchor="middle" className="lp-graph-text is-label">{node.text}</text>}
    </g>)}
  </svg>;
}

/** The shared layout of the algorithm views: stage on the left, pseudocode and caption below. */
export function AlgorithmLayout({ block, line, caption, children }: { block: LessonBlock; line: number | null; caption: string; children: ReactNode }) {
  const lines = block.type === "pseudocode" ? block.lines : [];
  return <div className="lp-anim">
    <div className="lp-anim-stage lp-graph-stage">{children}</div>
    <ol className="lp-anim-code" aria-label="Pseudokode">
      {lines.map((text, index) => <li key={index} className={line === index ? "is-active" : undefined}><code>{text}</code></li>)}
    </ol>
    <p className="lp-anim-caption" aria-live="polite"><RichText>{caption}</RichText></p>
  </div>;
}
