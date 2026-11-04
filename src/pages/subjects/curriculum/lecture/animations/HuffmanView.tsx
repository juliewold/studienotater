import { useMemo } from "react";
import type { AnimationViewProps } from ".";
import { AlgorithmLayout } from "./graphCanvas";
import { leafName, traceHuffman, type HuffmanNode } from "./huffman";

// The forest of partial Huffman trees: every root in the priority queue with its subtree. Leaves are
// spread from left to right in queue order, and each parent sits above the middle of its children.

const W = 500, H = 262, ROW = 44, TOP = 30;

type Placed = { node: HuffmanNode; x: number; y: number };

function layoutForest(roots: HuffmanNode[]): { placed: Map<string, Placed>; edges: [Placed, Placed][] } {
  const leaves: HuffmanNode[] = [];
  const collect = (node: HuffmanNode) => {
    if (!node.left && !node.right) leaves.push(node);
    if (node.left) collect(node.left);
    if (node.right) collect(node.right);
  };
  roots.forEach(collect);
  const placed = new Map<string, Placed>();
  const edges: [Placed, Placed][] = [];
  const place = (node: HuffmanNode, depth: number): number => {
    const children = [node.left, node.right].filter((child): child is HuffmanNode => Boolean(child));
    // Children are placed first, so a parent can sit above the middle of them.
    const childX = children.map(child => place(child, depth + 1));
    const x = children.length ? childX.reduce((sum, value) => sum + value, 0) / children.length : (leaves.indexOf(node) + 0.5) * (W / leaves.length);
    const entry = { node, x, y: TOP + depth * ROW };
    placed.set(node.id, entry);
    for (const child of children) edges.push([entry, placed.get(child.id)!]);
    return x;
  };
  roots.forEach(root => place(root, 0));
  return { placed, edges };
}

export function HuffmanView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceHuffman(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const { placed, edges } = layoutForest(frame.queue);
  const current = new Set(frame.current.map(node => node.id));
  const width = (text: string) => Math.max(40, text.length * 7 + 16);
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <svg className="lp-graph" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Huffman-treet: skogen av delvise trær i prioritetskøen">
      <title>Huffman-treet: skogen av delvise trær i prioritetskøen</title>
      {edges.map(([from, to]) => <line key={`${from.node.id}-${to.node.id}`} x1={from.x} y1={from.y + 13} x2={to.x} y2={to.y - 13} className="lp-graph-edge is-plain" />)}
      {[...placed.values()].map(({ node, x, y }) => {
        const text = leafName(node);
        const w = width(text);
        return <g key={node.id}>
          <rect x={x - w / 2} y={y - 13} width={w} height={26} rx={8} className={`lp-graph-node ${current.has(node.id) ? "is-current" : frame.queue.includes(node) ? "is-gray" : "is-black"}`} />
          <text x={x} y={y + 4.5} textAnchor="middle" className="lp-graph-text is-strong">{text}</text>
        </g>;
      })}
    </svg>
    {frame.codes && <table className="lp-anim-table" aria-label="Kodeord">
      <thead><tr><th scope="col">Tegn</th>{Object.keys(frame.codes).map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
      <tbody><tr><th scope="row">Kode</th>{Object.keys(frame.codes).map(label => <td key={label}>{frame.codes![label]}</td>)}</tr></tbody>
    </table>}
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">Q: {frame.queue.map(leafName).join(", ")}</span>
    </div>
  </AlgorithmLayout>;
}
