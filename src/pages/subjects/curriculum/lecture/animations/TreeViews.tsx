import { useMemo } from "react";
import type { AnimationViewProps } from ".";
import type { Point } from "../../../../../data/curriculum/lessons/exampleGraphs";
import { AlgorithmLayout, GraphCanvas, type GraphEdge, type GraphNode } from "./graphCanvas";
import { traceTreeInsert, type BstFrame } from "./bst";

// The binary search tree: keys are placed from left to right in order, and each level sits one row lower.
function treePositions(frame: BstFrame, width: number): Record<string, Point> {
  const at: Record<string, Point> = {};
  const order: number[] = [];
  const walk = (key: number | undefined) => {
    if (key === undefined) return;
    walk(frame.nodes[key]?.left);
    order.push(key);
    walk(frame.nodes[key]?.right);
  };
  walk(frame.root ?? undefined);
  const depth: Record<number, number> = {};
  const deepen = (key: number | undefined, level: number) => {
    if (key === undefined) return;
    depth[key] = level;
    deepen(frame.nodes[key]?.left, level + 1);
    deepen(frame.nodes[key]?.right, level + 1);
  };
  deepen(frame.root ?? undefined, 0);
  order.forEach((key, index) => {
    at[String(key)] = { x: (index + 0.5) * (width / Math.max(order.length, 1)), y: 34 + depth[key] * 66 };
  });
  return at;
}

export function TreeInsertView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceTreeInsert(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const at = useMemo(() => treePositions(frame, 500), [frame]);
  const keys = Object.keys(frame.nodes).map(Number);
  const edges: GraphEdge[] = keys.flatMap(key => {
    const node = frame.nodes[key];
    return [node.left, node.right].filter((child): child is number => child !== undefined)
      .map((child): GraphEdge => ({ from: String(key), to: String(child), tone: frame.y === key && frame.attached === child ? "active" : "tree" }));
  });
  const nodes: GraphNode[] = keys.map((key): GraphNode => ({
    id: String(key),
    tone: frame.x === key || frame.attached === key ? "current" : frame.y === key ? "gray" : "white",
    text: frame.x === key ? "x" : frame.y === key ? "y" : undefined,
  }));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={at} directed label="Binært søketre" edges={edges} nodes={nodes} height={262} />
    <div className="lp-anim-vars" aria-live="off">
      {frame.z !== null && <span className="is-key">z = {frame.z}</span>}
      {frame.x !== null && <span>x = {frame.x}</span>}
      {frame.y !== null && <span>y = {frame.y}</span>}
    </div>
  </AlgorithmLayout>;
}
