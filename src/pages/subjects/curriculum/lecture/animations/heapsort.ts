// Step-by-step trace of Heapsort(A, n) from lecture 5: Build-Max-Heap, then repeatedly moving the
// largest element to the end and sifting the new root down with Max-Heapify. The heap is shown both
// as an array and as the binary tree it stands for.

export type HeapsortFrame = {
  caption: string;
  /** Index into the lines of Heapsort(A, n). */
  line: number | null;
  array: number[];
  /** Number of elements in the heap; the elements after it are sorted and in their final place. */
  heapSize: number;
  /** 1-based index of the node being sifted, if any. */
  node: number | null;
  /** 1-based indices compared in this step, and the one that is currently largest. */
  compare: number[];
  largest: number | null;
  /** 1-based indices exchanged in this step. */
  swapped: [number, number] | null;
  phase: "build" | "sort";
};

export function traceHeapsort(input: number[] = [4, 10, 3, 5, 1, 8]): HeapsortFrame[] {
  const A = [...input];
  const n = A.length;
  let heapSize = n;
  const frames: HeapsortFrame[] = [];
  let phase: HeapsortFrame["phase"] = "build";
  const snap = (frame: Pick<HeapsortFrame, "caption" | "line" | "node" | "compare" | "largest" | "swapped">) =>
    frames.push({ ...frame, array: [...A], heapSize, phase });
  const show = (values: number[]) => `⟨${values.join(", ")}⟩`;
  const at = (k: number) => A[k - 1];
  const swap = (a: number, b: number) => { [A[a - 1], A[b - 1]] = [A[b - 1], A[a - 1]]; };

  // Max-Heapify(A, i), with 1-based indices as in the book.
  const heapify = (i: number) => {
    const l = 2 * i, r = 2 * i + 1;
    snap({ line: 4, node: i, compare: [], largest: null, swapped: null, caption: `Max-Heapify på node ${i} med verdi ${at(i)}. Barna er ${l <= heapSize ? `${l} med verdi ${at(l)}` : "ikke i haugen"} og ${r <= heapSize ? `${r} med verdi ${at(r)}` : "ikke i haugen"}.` });
    let largest = i;
    if (l <= heapSize && at(l) > at(i)) {
      largest = l;
      snap({ line: 4, node: i, compare: [i, l], largest: l, swapped: null, caption: `Venstre barn ${l} er ${at(l)}, og det er større enn ${at(i)}. Den største er nå ${l}.` });
    } else {
      snap({ line: 4, node: i, compare: [i, l <= heapSize ? l : i], largest: i, swapped: null, caption: `Venstre barn er ikke større enn ${at(i)}, så ${i} er største foreløpig.` });
    }
    if (r <= heapSize && at(r) > at(largest)) {
      const previous = at(largest);
      largest = r;
      snap({ line: 4, node: i, compare: [i, r], largest, swapped: null, caption: `Høyre barn ${r} er ${at(r)}, og det er større enn ${previous}. Den største er nå ${r}.` });
    } else if (r <= heapSize) {
      snap({ line: 4, node: i, compare: [largest, r], largest, swapped: null, caption: `Høyre barn ${r} er ${at(r)}, og det er ikke større enn ${at(largest)}.` });
    }
    if (largest !== i) {
      const rising = at(largest), sinking = at(i);
      swap(i, largest);
      snap({ line: 4, node: i, compare: [], largest, swapped: [i, largest], caption: `${rising} flyttes opp til ${i}, og ${sinking} synker ned til ${largest}. Vi fortsetter å sile ned fra ${largest}.` });
      heapify(largest);
    } else {
      snap({ line: 4, node: i, compare: [], largest: i, swapped: null, caption: `Ingen bytte: ${at(i)} på node ${i} er større enn barna, så haugegenskapen gjelder her.` });
    }
  };

  snap({ line: 0, node: null, compare: [], largest: null, swapped: null, caption: `Vi bygger en maks-haug av ${show(A)}. Løvnodene er allerede hauger, så vi starter med den siste interne noden, ${Math.floor(n / 2)}.` });
  for (let i = Math.floor(n / 2); i >= 1; i--) {
    heapify(i);
  }
  snap({ line: 0, node: null, compare: [], largest: null, swapped: null, caption: `Nå er ${show(A)} en maks-haug: hver node er større enn sine barn. Den største, ${at(1)}, står på toppen.` });

  phase = "sort";
  for (let i = n; i >= 2; i--) {
    snap({ line: 1, node: null, compare: [], largest: null, swapped: null, caption: `Vi bytter toppen ${at(1)} med A[${i}] = ${at(i)}. Da står ${at(1)} på sin endelige plass, ${i}.` });
    swap(1, i);
    heapSize--;
    snap({ line: 2, node: 1, compare: [], largest: null, swapped: [1, i], caption: `Haugen har nå ${heapSize} elementer, og ${at(i)} er ferdig på plass ${i}. Den nye roten må siles ned.` });
    heapify(1);
  }
  snap({ line: null, node: null, compare: [], largest: null, swapped: null, caption: `Haugen er tom, og A er sortert: ${show(A)}.` });
  return frames;
}
