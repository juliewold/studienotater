import { useMemo } from "react";
import type { AnimationViewProps } from ".";
import type { Point } from "../../../../../data/curriculum/lessons/exampleGraphs";
import { AlgorithmLayout, GraphCanvas, type GraphEdge, type GraphNode } from "./graphCanvas";
import { traceHeapsort } from "./heapsort";
import { traceMergeSort } from "./mergeSort";
import { tracePartition } from "./partition";

// Views for the sorting algorithms on arrays. The array is drawn as cells whose colours show the
// zone each element belongs to; the heap is also drawn as the binary tree it stands for.

type Tone = "plain" | "range" | "low" | "high" | "current" | "pivot" | "sorted" | "compare";

export function Cells({ values, tones, marks }: { values: (number | null)[]; tones: Tone[]; marks?: (string | undefined)[] }) {
  return <div className="lp-cells" role="img" aria-label={`Tabellen: ${values.join(", ")}`}>
    {values.map((value, index) => <div key={index} className="lp-cell-column">
      <span className="lp-cell-mark" aria-hidden="true">{marks?.[index] ?? ""}</span>
      <div className={`lp-cell-box is-${tones[index]}`}>{value ?? ""}</div>
      <span className="lp-cell-index" aria-hidden="true">{index + 1}</span>
    </div>)}
  </div>;
}

export function MergeSortView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceMergeSort(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const tones = frame.array.map((_, index): Tone => {
    if (frame.written === index) return "current";
    return frame.range && index >= frame.range[0] && index <= frame.range[1] ? "range" : "plain";
  });
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <Cells values={frame.array} tones={tones} />
    <div className="lp-anim-vars" aria-live="off">
      {frame.left && <span>L = ⟨{frame.left.map((value, index) => (index === frame.i ? `[${value}]` : value)).join(", ")}⟩</span>}
      {frame.right && <span>R = ⟨{frame.right.map((value, index) => (index === frame.j ? `[${value}]` : value)).join(", ")}⟩</span>}
      {!frame.left && frame.range && <span className="is-key">A[{frame.range[0] + 1} : {frame.range[1] + 1}]</span>}
    </div>
  </AlgorithmLayout>;
}

export function PartitionView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => tracePartition(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const last = frame.pivot;
  // The three zones: at most the pivot (up to i), greater than it (up to j), and not seen yet.
  const processedEnd = frame.j ?? last;
  const tones = frame.array.map((_, index): Tone => {
    if (index === last) return "pivot";
    if (frame.j !== null && index === frame.j) return "current";
    if (index <= frame.i) return "low";
    if (index < processedEnd) return "high";
    return "plain";
  });
  const marks = frame.array.map((_, index): string | undefined => {
    if (index === last) return "x";
    if (index === frame.i && frame.i >= 0) return "i";
    if (frame.j !== null && index === frame.j) return "j";
    return undefined;
  });
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <Cells values={frame.array} tones={tones} marks={marks} />
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">x = {frame.array[last]}</span>
      <span>i = {frame.i + 1}</span>
      <span>j = {frame.j === null ? "–" : frame.j + 1}</span>
    </div>
  </AlgorithmLayout>;
}

// Node k has children 2k and 2k + 1. Each level is spread out evenly, so the tree fits the canvas.
function heapPositions(n: number): Record<string, Point> {
  const at: Record<string, Point> = {};
  for (let k = 1; k <= n; k++) {
    const level = Math.floor(Math.log2(k));
    const count = 2 ** level;
    at[String(k)] = { x: ((k - count) + 0.5) * (500 / count), y: 34 + level * 72 };
  }
  return at;
}

export function HeapsortView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceHeapsort(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const n = frame.array.length;
  const positions = useMemo(() => heapPositions(n), [n]);
  const heap = Array.from({ length: frame.heapSize }, (_, index) => String(index + 1));
  const swapped = frame.swapped ? [String(frame.swapped[0]), String(frame.swapped[1])] : [];
  const edges: GraphEdge[] = heap.slice(1).map(child => ({
    from: String(Math.floor(Number(child) / 2)), to: child, tone: swapped.includes(child) && swapped.includes(String(Math.floor(Number(child) / 2))) ? "active" : "plain",
  }));
  const nodes: GraphNode[] = heap.map((id): GraphNode => ({
    id, label: String(frame.array[Number(id) - 1]),
    tone: frame.node !== null && Number(id) === frame.node ? "current" : frame.compare.includes(Number(id)) ? "gray" : "white",
  }));
  const tones = frame.array.map((_, index): Tone => {
    if (index >= frame.heapSize) return "sorted";
    if (frame.swapped && frame.swapped.includes(index + 1)) return "current";
    if (frame.node !== null && index + 1 === frame.node) return "current";
    if (frame.compare.includes(index + 1)) return "compare";
    return "plain";
  });
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={positions} directed={false} width={500} height={230} label="Haugen som binært tre" edges={edges} nodes={nodes} />
    <Cells values={frame.array} tones={tones} />
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">{frame.phase === "build" ? "Build-Max-Heap" : "Utvelging"}: heap-size = {frame.heapSize}</span>
    </div>
  </AlgorithmLayout>;
}
