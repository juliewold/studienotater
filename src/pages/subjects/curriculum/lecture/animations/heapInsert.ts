import type { Point } from "../../../../../data/curriculum/lessons/exampleGraphs";

// Step-by-step traces of Max-Heap-Increase-Key(A, x, k) and Max-Heap-Insert(A, x, n) from lecture 5, on the
// heap of the CLRS figures. Increasing a key moves the element up while its parent is smaller. Inserting
// puts the new element at the bottom with key −∞, and then increases that key to its value.

export type HeapFrame = {
  caption: string;
  /** Index into the lines of the pseudocode being traced. */
  line: number | null;
  /** The array, with null for −∞ (places that are not in use yet, or the element being inserted). */
  array: (number | null)[];
  heapSize: number;
  /** 1-based index of the element being moved, and of its parent. */
  i: number | null;
  parent: number | null;
  /** The positions exchanged in this step. */
  swapped: [number, number] | null;
};

const parentOf = (i: number) => Math.floor(i / 2);

// Node k has children 2k and 2k + 1. Each level is spread out evenly, so the tree fits the canvas.
export function heapPositions(n: number): Record<string, Point> {
  const at: Record<string, Point> = {};
  for (let k = 1; k <= n; k++) {
    const level = Math.floor(Math.log2(k));
    const count = 2 ** level;
    at[String(k)] = { x: ((k - count) + 0.5) * (500 / count), y: 34 + level * 72 };
  }
  return at;
}



/** Max-Heap-Increase-Key from line 2 on: the element at position i rises while its parent is smaller. */
function increaseKey(
  A: (number | null)[], i: number, k: number, lineOffset: number,
  snap: (frame: Omit<HeapFrame, "heapSize">) => void,
): void {
  const at = (index: number) => A[index - 1] ?? -Infinity;
  const old = at(i);
  A[i - 1] = k;
  snap({ caption: `Den nye nøkkelen ${k} er større enn den gamle, ${old === -Infinity ? "−∞" : old}, så den kan bare stige oppover.`, line: lineOffset + 2, array: [...A], i, parent: i > 1 ? parentOf(i) : null, swapped: null });
  while (i > 1 && at(parentOf(i)) < at(i)) {
    const p = parentOf(i);
    snap({ caption: `Forelderen ${p} har ${at(p)}, og det er mindre enn ${at(i)} på plass ${i}. Vi må bytte dem.`, line: lineOffset + 4, array: [...A], i, parent: p, swapped: null });
    [A[p - 1], A[i - 1]] = [A[i - 1], A[p - 1]];
    snap({ caption: `Vi bytter: ${at(p)} går ned til ${i}, og ${at(i)} stiger til ${p}. Nå sjekker vi om ${at(p)} må stige videre.`, line: lineOffset + 5, array: [...A], i: p, parent: p > 1 ? parentOf(p) : null, swapped: [p, i] });
    i = p;
  }
  const reason = i === 1
    ? `Elementet er nå i roten, så det er ingen forelder å sammenligne med. Haugegenskapen gjelder igjen.`
    : `Forelderen ${parentOf(i)} har ${at(parentOf(i))}, som er større enn eller lik ${at(i)}. Haugegenskapen gjelder igjen.`;
  snap({ caption: reason, line: lineOffset + 6, array: [...A], i: null, parent: null, swapped: null });
}

export function traceIncreaseKey(input = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], i = 9, k = 15): HeapFrame[] {
  const A: (number | null)[] = [...input];
  const frames: HeapFrame[] = [];
  const snap = (frame: Omit<HeapFrame, "heapSize">) => frames.push({ ...frame, heapSize: A.length });
  snap({ caption: `Vi øker nøkkelen på plass ${i} fra ${A[i - 1]} til ${k}. Vi kan bare øke, så det er nok å sjekke oppover.`, line: 0, array: [...A], i, parent: parentOf(i), swapped: null });
  increaseKey(A, i, k, 0, snap);
  return frames;
}

export function traceHeapInsert(input = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], x = 15): HeapFrame[] {
  const A: (number | null)[] = [...input, null];
  const frames: HeapFrame[] = [];
  const heapSize = () => input.length + 1;
  const snap = (frame: Omit<HeapFrame, "heapSize">) => frames.push({ ...frame, heapSize: heapSize() });
  snap({ caption: `Vi setter inn ${x} i en maks-haug med ${input.length} elementer. Først utvider vi haugen med én plass, nederst til høyre.`, line: 2, array: [...input, null], i: null, parent: null, swapped: null });
  snap({ caption: `Vi husker nøkkelen ${x} og setter elementet med nøkkel −∞ på den nye plassen. Da bryter det ingen haugegenskap.`, line: 4, array: [...A], i: input.length + 1, parent: null, swapped: null });
  increaseKey(A, input.length + 1, x, 6, snap);
  return frames;
}
