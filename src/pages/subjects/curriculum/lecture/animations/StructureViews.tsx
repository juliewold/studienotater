import { useMemo } from "react";
import type { AnimationViewProps } from ".";
import type { Point } from "../../../../../data/curriculum/lessons/exampleGraphs";
import { AlgorithmLayout, GraphCanvas, type GraphEdge, type GraphNode } from "./graphCanvas";
import { activityFinishes, activityStarts, traceActivities } from "./activitySelection";
import { traceDisjointSets } from "./disjointSets";
import { galeMen, galeWomen, traceGaleShapley } from "./galeShapley";

// Views for the algorithms whose state is a structure rather than a table: the forest of disjoint sets,
// the engagements of Gale-Shapley, and the timeline of the activity selection.

/** Places a forest so that every parent sits above the middle of its children, with leaves spread out. */
function forestPositions(parent: Record<number, number>, nodes: number[]): Record<string, Point> {
  const children: Record<number, number[]> = {};
  for (const v of nodes) if (parent[v] !== v) (children[parent[v]] ??= []).push(v);
  const at: Record<string, Point> = {};
  let leaf = 0;
  const place = (v: number, depth: number): number => {
    const kids = children[v] ?? [];
    const x = kids.length
      ? kids.map(kid => place(kid, depth + 1)).reduce((sum, value) => sum + value, 0) / kids.length
      : (leaf++ + 0.5) * (500 / nodes.length);
    at[String(v)] = { x, y: 44 + depth * 84 };
    return x;
  };
  nodes.filter(v => parent[v] === v).forEach(root => place(root, 0));
  return at;
}

const disjointNodes = [1, 2, 3, 4];

export function DisjointSetsView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceDisjointSets(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const at = useMemo(() => forestPositions(frame.parent, disjointNodes), [frame.parent]);
  const nodes = disjointNodes;
  const edges: GraphEdge[] = nodes.filter(v => frame.parent[v] !== v).map((v): GraphEdge => ({
    from: String(v), to: String(frame.parent[v]), tone: frame.changed.includes(v) ? "active" : "tree",
  }));
  const nodeList: GraphNode[] = nodes.map((v): GraphNode => ({
    id: String(v),
    tone: frame.current === v ? "current" : frame.parent[v] === v ? "black" : "white",
    text: frame.parent[v] === v ? `rang ${frame.rank[v]}` : undefined,
  }));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={at} directed label="Disjunkte mengder som skog" edges={edges} nodes={nodeList} />
    <div className="lp-anim-vars" aria-live="off">
      <span>x.p for alle: {nodes.map(v => `${v}→${frame.parent[v]}`).join(", ")}</span>
      {frame.path.length > 1 && <span className="is-key">Find-Set-sti: {frame.path.join(" → ")}</span>}
    </div>
  </AlgorithmLayout>;
}

const galePositions: Record<string, Point> = {
  w1: { x: 110, y: 46 }, w2: { x: 110, y: 131 }, w3: { x: 110, y: 216 },
  m1: { x: 390, y: 46 }, m2: { x: 390, y: 131 }, m3: { x: 390, y: 216 },
};

export function GaleShapleyView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceGaleShapley(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const women = Object.keys(galeWomen), men = Object.keys(galeMen);
  const engagedPairs = Object.entries(frame.engaged);
  const edges: GraphEdge[] = [
    ...engagedPairs.map(([w, m]): GraphEdge => ({ from: w, to: m, tone: "tree" })),
    ...frame.rejected.map(([w, m]): GraphEdge => ({ from: w, to: m, tone: "rejected" })),
    ...(frame.proposal ? [{ from: frame.proposal[0], to: frame.proposal[1], tone: "active" as const }] : []),
  ];
  const engagedMen = new Set(engagedPairs.map(([, m]) => m));
  const nodes: GraphNode[] = [
    ...women.map((w): GraphNode => ({ id: w, tone: frame.proposal?.[0] === w ? "current" : frame.free.includes(w) ? "gray" : "black" })),
    ...men.map((m): GraphNode => ({ id: m, tone: frame.proposal?.[1] === m ? "current" : engagedMen.has(m) ? "black" : "white" })),
  ];
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={galePositions} directed={false} label="Gale-Shapley: kvinner til venstre, menn til høyre" edges={edges} nodes={nodes} />
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">Forlovet: {engagedPairs.length ? engagedPairs.map(([w, m]) => `${w}–${m}`).join(", ") : "ingen"}</span>
      <span>Ledige kvinner: {frame.free.length ? frame.free.join(", ") : "ingen"}</span>
      {frame.dumped && <span>{frame.dumped} blir ledig</span>}
    </div>
  </AlgorithmLayout>;
}

const TIMELINE_END = 17;

export function ActivityView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceActivities(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const cut = activityFinishes[frame.k - 1];
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <div className="lp-timeline" role="img" aria-label="Aktivitetene som tidslinje">
      {activityStarts.map((start, index) => {
        const id = index + 1;
        const finish = activityFinishes[index];
        const state = frame.chosen.includes(id) ? "chosen" : frame.m === id && frame.decision === "rejected" ? "rejected" : "open";
        return <div key={id} className={`lp-timeline-row${frame.m === id ? " is-considered" : ""}`}>
          <span className="lp-timeline-label">a{id}</span>
          <div className="lp-timeline-track">
            <span className="lp-timeline-cut" style={{ left: `${(cut / TIMELINE_END) * 100}%` }} aria-hidden="true" />
            <div className={`lp-timeline-bar is-${state}`} style={{ left: `${(start / TIMELINE_END) * 100}%`, width: `${((finish - start) / TIMELINE_END) * 100}%` }}>
              {start}–{finish}
            </div>
          </div>
        </div>;
      })}
    </div>
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">A = {"{"}{frame.chosen.map(i => `a${i}`).join(", ")}{"}"}</span>
      <span>k = a{frame.k}, slutt {cut}</span>
    </div>
  </AlgorithmLayout>;
}
