import { Fragment, useMemo } from "react";
import type { AnimationViewProps } from ".";
import { AlgorithmLayout, GraphCanvas, type GraphEdge, type GraphNode } from "./graphCanvas";
import { Cells } from "./ArrayViews";
import { traceChaining, traceDoubling } from "./hashing";
import { heapPositions, traceHeapInsert, traceIncreaseKey, type HeapFrame } from "./heapInsert";
import { traceRadix, traceBucket } from "./radixBucket";
import { traceRandomizedSelect, traceSelect, type SelectFrame } from "./select";
import { traceFractional } from "./fractional";
import { treeLayout, huffmanRoot, traceDecode, type DecodeFrame } from "./decode";
import { traceQuicksort } from "./quicksort";
import { traceExtractMax } from "./heapExtract";

// Views for the data-structure algorithms: hash tables, heaps, the radix and bucket sorts, selection, and the
// fractional knapsack. Each draws the structure in the state of the frame being explained.

export function ChainingView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceChaining(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  return <AlgorithmLayout block={block} line={null} caption={frame.caption}>
    <div className="lp-chain" role="list" aria-label="Hashtabell med kjeding">
      {frame.slots.map((chain, slot) => <div key={slot} role="listitem" className={`lp-chain-row${frame.slot === slot ? " is-current" : ""}`}>
        <span className="lp-chain-slot">plass {slot}</span>
        <div className="lp-chain-keys">
          {chain.length === 0 && <span className="lp-chain-arrow">tom</span>}
          {chain.map((key, index) => <Fragment key={`${key}-${index}`}>
            <span className={`lp-chain-key${frame.key === key && frame.visiting === null ? " is-new" : ""}${frame.visiting === key ? (frame.found ? " is-found" : " is-visiting") : ""}`}>{key}</span>
            {index < chain.length - 1 && <span className="lp-chain-arrow" aria-hidden="true">→</span>}
          </Fragment>)}
        </div>
      </div>)}
    </div>
    <div className="lp-anim-vars" aria-live="off">
      {frame.key !== null && <span className="is-key">k = {frame.key}{frame.slot !== null ? `, h(k) = ${frame.slot}` : ""}</span>}
    </div>
  </AlgorithmLayout>;
}

export function DoublingView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceDoubling(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const values = frame.table.length ? frame.table : [null];
  const tones = values.map((value, index) => (frame.written === index ? "current" : value !== null ? "range" : "plain")) as ("current" | "range" | "plain")[];
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <Cells values={values} tones={tones} marks={values.map((_, index) => (index === frame.num && frame.num < frame.size ? "neste" : undefined))} />
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">størrelse = {frame.size}</span>
      <span>elementer = {frame.num}</span>
      {frame.copied > 0 && <span>kopierer {frame.copied} elementer</span>}
      <span>kopieringer totalt: {frame.copies}</span>
    </div>
  </AlgorithmLayout>;
}

/** A heap as its array and as the tree it stands for, with the element being moved and its parent marked. */
export function HeapFrameView({ block, frame }: { block: AnimationViewProps["block"]; frame: HeapFrame }) {
  const n = frame.array.length;
  const at = useMemo(() => heapPositions(n), [n]);
  const heap = Array.from({ length: n }, (_, index) => String(index + 1));
  const swapped = frame.swapped ? [String(frame.swapped[0]), String(frame.swapped[1])] : [];
  const edges: GraphEdge[] = heap.slice(1).map(child => {
    const parent = String(Math.floor(Number(child) / 2));
    return { from: parent, to: child, tone: swapped.includes(child) && swapped.includes(parent) ? "active" : "tree" };
  });
  const nodes: GraphNode[] = heap.map((id): GraphNode => {
    const index = Number(id);
    const value = frame.array[index - 1];
    return {
      id,
      label: value === null ? "−∞" : String(value),
      tone: frame.i === index ? "current" : frame.parent === index ? "gray" : "white",
    };
  });
  const values = frame.array;
  const tones = values.map((_, index) => (frame.i === index + 1 ? "current" : frame.parent === index + 1 ? "compare" : "plain")) as ("current" | "compare" | "plain")[];
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <GraphCanvas at={at} directed={false} width={500} height={262} label="Haugen som binært tre" edges={edges} nodes={nodes} />
    <Cells values={values} tones={tones} />
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">heap-size = {frame.heapSize}</span>
      {frame.i !== null && <span>i = {frame.i}</span>}
    </div>
  </AlgorithmLayout>;
}

export function IncreaseKeyView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceIncreaseKey(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  return <HeapFrameView block={block} frame={frame} />;
}

export function HeapInsertView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceHeapInsert(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  return <HeapFrameView block={block} frame={frame} />;
}

export function RadixView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceRadix(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const digits = frame.before[0]?.length ?? 0;
  const column = digits - frame.pass;
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <p className="lp-count-label">Før passet</p>
    <div className="lp-radix-row">
      {frame.before.map(value => <span key={value} className={`lp-radix-num${frame.placed === value ? " is-placed" : ""}`}>
        {[...value].map((char, index) => <span key={index} className={frame.pass > 0 && index === column ? "lp-radix-digit" : undefined}>{char}</span>)}
      </span>)}
    </div>
    {frame.output.length > 0 && <>
      <p className="lp-count-label">Utdata i dette passet</p>
      <div className="lp-radix-row">
        {frame.output.map(value => <span key={value} className={`lp-radix-num${frame.placed === value ? " is-placed" : ""}`}>{value}</span>)}
      </div>
    </>}
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">pass {frame.pass}: siffer {frame.pass === 0 ? "–" : frame.pass}, fra høyre</span>
    </div>
  </AlgorithmLayout>;
}

export function BucketView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceBucket(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const decimal = (value: number) => value.toFixed(2).replace(".", ",");
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <div className="lp-buckets" role="list" aria-label="Bøttene">
      {frame.buckets.map((bucket, index) => <div key={index} role="listitem" className={`lp-bucket${frame.sorting === index ? " is-sorting" : ""}`}>
        <span className="lp-bucket-index">{index}</span>
        {bucket.map((value, position) => <span key={`${value}-${position}`} className={`lp-bucket-value${frame.placed === value ? " is-placed" : ""}`}>{decimal(value)}</span>)}
      </div>)}
    </div>
    {frame.output && <div className="lp-radix-row">
      {frame.output.map(value => <span key={value} className="lp-radix-num">{decimal(value)}</span>)}
    </div>}
    {frame.remaining.length > 0 && <div className="lp-anim-vars" aria-live="off">
      <span>igjen å legge i bøtter: {frame.remaining.map(decimal).join(", ")}</span>
    </div>}
  </AlgorithmLayout>;
}

export function SelectFramesView({ block, frame }: { block: AnimationViewProps["block"]; frame: SelectFrame }) {
  const tones = frame.array.map((_, index) => {
    if (frame.found === index) return "current";
    if (frame.pivot === index) return "pivot";
    if (frame.range && index >= frame.range[0] && index <= frame.range[1]) return "range";
    return "plain";
  }) as ("current" | "pivot" | "range" | "plain")[];
  const marks = frame.array.map((_, index) => {
    if (frame.pivot === index && frame.found === null) return "x";
    if (frame.i === index) return "i";
    if (frame.j === index) return "j";
    return undefined;
  });
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <Cells values={frame.array} tones={tones} marks={marks} />
    <div className="lp-anim-vars" aria-live="off">
      {frame.rank !== null && <span className="is-key">søker etter rang {frame.rank}</span>}
      {frame.range && <span>A[{frame.range[0] + 1} : {frame.range[1] + 1}]</span>}
      {frame.found !== null && <span>svar: {frame.array[frame.found]}</span>}
    </div>
  </AlgorithmLayout>;
}

export function RandomizedSelectView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceRandomizedSelect(), []);
  return <SelectFramesView block={block} frame={frames[Math.min(step, frames.length - 1)]} />;
}

export function SelectView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceSelect(), []);
  return <SelectFramesView block={block} frame={frames[Math.min(step, frames.length - 1)]} />;
}

export function FractionalView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceFractional(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const fraction = frame.capacity / 50;
  const money = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ","));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <table className="lp-anim-table" aria-label="Gjenstander sortert etter verdi per kilo">
      <thead><tr><th scope="col">Gjenstand</th><th scope="col">Verdi</th><th scope="col">Vekt</th><th scope="col">Per kilo</th><th scope="col">Tatt</th></tr></thead>
      <tbody>{frame.items.map((item, index) => <tr key={item.name} className={frame.current === index ? "is-changed" : undefined}>
        <th scope="row">{item.name}</th>
        <td>{item.value}</td>
        <td>{item.weight}</td>
        <td>{money(item.ratio)}</td>
        <td>{item.taken > 0 ? `${money(item.taken)} av ${item.weight}` : "–"}</td>
      </tr>)}</tbody>
    </table>
    <div className="lp-capacity" role="img" aria-label={`${frame.capacity} kilo igjen av 50`}>
      <div className="lp-capacity-fill" style={{ width: `${fraction * 100}%` }} />
    </div>
    <div className="lp-anim-vars" aria-live="off">
      <span>igjen i sekken: {frame.capacity} kilo</span>
      <span className="is-key">verdi: {money(frame.total)}</span>
    </div>
  </AlgorithmLayout>;
}

export function DecodeView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceDecode(), []);
  const frame: DecodeFrame = frames[Math.min(step, frames.length - 1)];
  const root = useMemo(() => huffmanRoot(), []);
  const placed = useMemo(() => treeLayout(root, 500, 56, 30), [root]);
  const edges: [string, string][] = [];
  const walk = (node: typeof root) => {
    if (node.left) { edges.push([node.id, node.left.id]); walk(node.left); }
    if (node.right) { edges.push([node.id, node.right.id]); walk(node.right); }
  };
  walk(root);
  const onPath = new Set<string>();
  let cursor = root;
  for (const bit of frame.path) { onPath.add(cursor.id); cursor = (bit === "0" ? cursor.left : cursor.right) ?? cursor; }
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <svg className="lp-graph" viewBox="0 0 500 262" role="img" aria-label="Huffman-treet, med stien som er lest">
      <title>Huffman-treet, med stien som er lest</title>
      {edges.map(([from, to]) => {
        const a = placed.get(from)!, b = placed.get(to)!;
        const active = onPath.has(from) && frame.path.length > 0 && (frame.node.id === to || onPath.has(to));
        return <line key={`${from}-${to}`} x1={a.x} y1={a.y + 12} x2={b.x} y2={b.y - 12} className={`lp-graph-edge ${active ? "is-active" : "is-plain"}`} />;
      })}
      {[...placed.entries()].map(([id, { x, y }]) => {
        const node = (function find(n: typeof root): typeof root | undefined { if (n.id === id) return n; return (n.left && find(n.left)) || (n.right && find(n.right)) || undefined; })(root)!;
        const text = node.label ? `${node.label}` : `${node.freq}`;
        const w = Math.max(30, text.length * 8 + 14);
        return <g key={id}>
          <rect x={x - w / 2} y={y - 12} width={w} height={24} rx={8} className={`lp-graph-node ${frame.node.id === id ? "is-current" : node.label ? "is-white" : "is-black"}`} />
          <text x={x} y={y + 4.5} textAnchor="middle" className="lp-graph-text is-strong">{text}</text>
        </g>;
      })}
    </svg>
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">Tekst: {frame.output || "–"}</span>
      <span>Bit: {[...frame.bits].map((bit, index) => (index === frame.bit ? `[${bit}]` : bit)).join("")}</span>
    </div>
  </AlgorithmLayout>;
}

export function QuicksortView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceQuicksort(), []);
  return <SelectFramesView block={block} frame={frames[Math.min(step, frames.length - 1)]} />;
}

export function ExtractMaxView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceExtractMax(), []);
  return <HeapFrameView block={block} frame={frames[Math.min(step, frames.length - 1)]} />;
}
