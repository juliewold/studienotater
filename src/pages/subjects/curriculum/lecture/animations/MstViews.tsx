import { useMemo } from "react";
import type { AnimationViewProps } from ".";
import { mstEdges, mstPositions } from "../../../../../data/curriculum/lessons/exampleGraphs";
import { AlgorithmLayout, GraphCanvas, type GraphEdge, type GraphNode } from "./graphCanvas";
import { traceKruskal } from "./kruskal";
import { tracePrim } from "./prim";

// Views for the minimum spanning tree algorithms, on the CLRS graph. The tree that is being built is
// drawn in the accent colour, and the edge being decided is highlighted.

const mstNodes = [...new Set(mstEdges.flatMap(([u, v]) => [u, v]))].sort();
const pairKey = (u: string, v: string) => [u, v].sort().join("");

export function KruskalView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceKruskal(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const state = new Map(frame.sorted.map(edge => [pairKey(edge.u, edge.v), edge.state]));
  const current = frame.current ? pairKey(frame.current[0], frame.current[1]) : null;
  const accepted = frame.sorted.filter(edge => edge.state === "accepted");
  const touched = new Set(accepted.flatMap(edge => [edge.u, edge.v]));
  const edges = mstEdges.map(([u, v, w]): GraphEdge => {
    const key = pairKey(u, v);
    const tone = key === current ? "active" : state.get(key) === "accepted" ? "tree" : state.get(key) === "rejected" ? "rejected" : "plain";
    return { from: u, to: v, weight: w, tone };
  });
  const sets = [...new Set(mstNodes.map(v => frame.set[v]))].map(rep => mstNodes.filter(v => frame.set[v] === rep));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={mstPositions} directed={false} width={560} height={250} label="Kruskal på CLRS-grafen"
      edges={edges}
      nodes={mstNodes.map((v): GraphNode => ({ id: v, tone: frame.current?.includes(v) ? "current" : touched.has(v) ? "black" : "white" }))} />
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">A: {accepted.length} kanter, vekt {frame.total}</span>
      <span>Mengder: {sets.map(members => `{${members.join(", ")}}`).join(" ")}</span>
    </div>
    <div className="lp-anim-vars" aria-label="Kanter i vektrekkefølge">
      {frame.sorted.map(edge => <span key={pairKey(edge.u, edge.v)} className={edge.state === "accepted" ? "is-key" : edge.state === "rejected" ? "is-rejected" : undefined}>
        {edge.u}–{edge.v} ({edge.w})
      </span>)}
    </div>
  </AlgorithmLayout>;
}

export function PrimView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => tracePrim(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const edges = mstEdges.map(([u, v, w]): GraphEdge => {
    const onEdge = (frame.edge && pairKey(frame.edge[0], frame.edge[1]) === pairKey(u, v));
    // A parent set for a node still in the queue is only a candidate edge, so it is not part of the tree yet.
    const inTree = (frame.parent[v] === u && frame.done.includes(v)) || (frame.parent[u] === v && frame.done.includes(u));
    return { from: u, to: v, weight: w, tone: onEdge ? "active" : inTree ? "tree" : "plain" };
  });
  const show = (value: number) => (value === Infinity ? "∞" : String(value));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={mstPositions} directed={false} width={560} height={250} label="Prim på CLRS-grafen"
      edges={edges}
      nodes={mstNodes.map((v): GraphNode => ({
        id: v,
        tone: frame.current === v ? "current" : frame.done.includes(v) ? "black" : "white",
        text: `nøkkel ${show(frame.key[v])}`,
      }))} />
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">S (i treet): {"{"}{frame.done.join(", ")}{"}"}</span>
      <span>Q = {"{"}{frame.queue.join(", ")}{"}"}</span>
    </div>
  </AlgorithmLayout>;
}
