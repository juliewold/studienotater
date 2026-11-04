import type { HuffmanNode } from "./huffman";
import { traceHuffman } from "./huffman";

// Step-by-step trace of Decode(T, C, n) from lecture 7: the Huffman tree is followed bit by bit, 0 to the left and
// 1 to the right, and each time a leaf is reached the character is written out and the walk starts again at the
// root. The tree is the one from the Huffman animation.

export type DecodeFrame = {
  caption: string;
  /** Index into the lines of Decode(T, C, n). */
  line: number | null;
  /** The node the walk is standing in, and the path from the root to it. */
  node: HuffmanNode;
  path: string[];
  /** The bits read so far, the index of the current bit (or null before and after), and the text written out. */
  bits: string;
  bit: number | null;
  output: string;
};

export const huffmanRoot = (): HuffmanNode => traceHuffman().at(-1)!.queue[0];

/** Positions of the tree: leaves from left to right, every parent above the middle of its children. */
export function treeLayout(root: HuffmanNode, width: number, row: number, top: number): Map<string, { x: number; y: number }> {
  const leaves: HuffmanNode[] = [];
  const collect = (node: HuffmanNode) => {
    if (!node.left && !node.right) leaves.push(node);
    if (node.left) collect(node.left);
    if (node.right) collect(node.right);
  };
  collect(root);
  const at = new Map<string, { x: number; y: number }>();
  const place = (node: HuffmanNode, depth: number): number => {
    const children = [node.left, node.right].filter((child): child is HuffmanNode => Boolean(child));
    const x = children.length
      ? children.map(child => place(child, depth + 1)).reduce((sum, value) => sum + value, 0) / children.length
      : (leaves.indexOf(node) + 0.5) * (width / leaves.length);
    at.set(node.id, { x, y: top + depth * row });
    return x;
  };
  place(root, 0);
  return at;
}

/** Codes from the example: a 0, b 101, c 100, d 111, e 1101, f 1100. The message is abcedf. */
export function traceDecode(bits = "0101100" + "1101" + "111" + "1100"): DecodeFrame[] {
  const root = huffmanRoot();
  const frames: DecodeFrame[] = [];
  let node = root, path: string[] = [], output = "";
  const snap = (frame: Pick<DecodeFrame, "caption" | "line" | "bit">) =>
    frames.push({ ...frame, node, path: [...path], bits, output });

  snap({ line: 0, bit: null, caption: `Vi dekoder ${bits.length} bit. Vi starter i roten. Et 0 betyr gå til venstre, og et 1 betyr gå til høyre.` });
  for (let index = 0; index < bits.length; index++) {
    const bit = bits[index];
    const next = bit === "0" ? node.left : node.right;
    if (!next) break;
    path = [...path, bit];
    node = next;
    snap({ line: bit === "0" ? 3 : 4, bit: index, caption: `Bit nummer ${index + 1} er ${bit}, så vi går til ${bit === "0" ? "venstre" : "høyre"}.` });
    if (!node.left && !node.right) {
      output += node.label ?? "";
      snap({ line: 6, bit: index, caption: `Vi har nådd et løv: ${node.label}. Det skrives ut, og vi starter igjen i roten.` });
      node = root;
      path = [];
    }
  }
  snap({ line: null, bit: null, caption: `Hele meldingen er lest. Teksten er ${output}.` });
  return frames;
}
