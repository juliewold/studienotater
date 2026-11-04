import { huffmanFrequencies } from "../../../../../data/curriculum/lessons/exampleGraphs";

// Step-by-step trace of Huffman(C) from lecture 7, on the example of the figures. The priority queue
// and the forest of partial trees change at each merge, so both are shown.

export type HuffmanNode = {
  id: string;
  /** The character of a leaf; internal nodes have none. */
  label?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
};

export type HuffmanFrame = {
  caption: string;
  /** Index into the lines of Huffman(C). */
  line: number | null;
  /** The priority queue Q, sorted by frequency. Each entry is the root of a tree in the forest. */
  queue: HuffmanNode[];
  /** Nodes taken out of Q or just created, to be highlighted. */
  current: HuffmanNode[];
  /** Codewords per character, once the tree is complete. */
  codes?: Record<string, string>;
};

export const leafName = (node: HuffmanNode) => (node.label ? `${node.label}:${node.freq}` : `${node.freq}`);

/** How a node is named in the captions: a character, or a merged node with its frequency. */
const describe = (node: HuffmanNode) => (node.label ? `${node.label} med frekvens ${node.freq}` : `en sammenslått node med frekvens ${node.freq}`);

/** Codewords by walking the tree: left is 0, right is 1. */
export function huffmanCodes(root: HuffmanNode): Record<string, string> {
  const codes: Record<string, string> = {};
  const walk = (node: HuffmanNode, code: string) => {
    if (node.label) codes[node.label] = code || "0";
    if (node.left) walk(node.left, `${code}0`);
    if (node.right) walk(node.right, `${code}1`);
  };
  walk(root, "");
  return codes;
}

export function traceHuffman(chars: [string, number][] = huffmanFrequencies): HuffmanFrame[] {
  let order = 0;
  const byKey = (a: HuffmanNode, b: HuffmanNode) => a.freq - b.freq || Number(a.id.slice(1)) - Number(b.id.slice(1));
  const queue: HuffmanNode[] = chars.map(([label, freq]) => ({ id: `n${order++}`, label, freq }));
  const frames: HuffmanFrame[] = [];
  const snap = (frame: Pick<HuffmanFrame, "caption" | "line" | "current" | "codes">) =>
    frames.push({ ...frame, queue: [...queue].sort(byKey) });

  snap({ line: 1, current: [], caption: `Hver bokstav er en node i prioritetskøen Q, med frekvensen som nøkkel. Vi merger de to minst hyppige, ${chars.length - 1} ganger.` });

  for (let i = 1; i < chars.length; i++) {
    queue.sort(byKey);
    const x = queue.shift()!;
    snap({ line: 4, current: [x], caption: `Extract-Min tar ut ${describe(x)}, den minst hyppige noden. Den blir venstre barn i den nye noden.` });
    queue.sort(byKey);
    const y = queue.shift()!;
    snap({ line: 5, current: [x, y], caption: `Så tar vi ut ${describe(y)}, og den blir høyre barn.` });
    const z: HuffmanNode = { id: `n${order++}`, freq: x.freq + y.freq, left: x, right: y };
    queue.push(z);
    snap({ line: 9, current: [z], caption: `Ny node z får frekvens ${x.freq} + ${y.freq} = ${z.freq}, og settes inn i Q. Køen har nå ${queue.length} noder.` });
  }

  const root = queue[0];
  const codes = huffmanCodes(root);
  const cost = chars.reduce((sum, [label, freq]) => sum + freq * codes[label].length, 0);
  snap({
    line: 10, current: [root], codes,
    caption: `Det siste treet er igjen i Q. Vi går fra roten: venstre gir 0 og høyre gir 1. Den totale kostnaden er ${cost}, altså ${chars.map(([label]) => `${label} ${codes[label]}`).join(", ")}.`,
  });
  return frames;
}
