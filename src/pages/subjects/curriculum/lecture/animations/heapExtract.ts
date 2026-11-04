import type { HeapFrame } from "./heapInsert";

// Step-by-step trace of Max-Heap-Extract-Max(A) from lecture 5, on the heap of the figures. The largest element
// is taken from the root, the last element takes its place, the heap shrinks by one, and Max-Heapify sifts the
// new root down. The array shown is always the heap itself.

export function traceExtractMax(input = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1]): HeapFrame[] {
  const A: number[] = [...input];
  let heapSize = A.length;
  const frames: HeapFrame[] = [];
  const shown = () => A.slice(0, heapSize);
  const snap = (frame: Pick<HeapFrame, "caption" | "line" | "i" | "parent" | "swapped">) =>
    frames.push({ ...frame, array: shown(), heapSize });
  const at = (k: number) => A[k - 1];

  const max = at(1);
  snap({ line: 0, i: 1, parent: null, swapped: null, caption: `Max-Heap-Maximum gir ${max}, som står på roten. Den skal tas ut, men haugen må holdes i orden etterpå.` });
  A[0] = at(heapSize);
  snap({ line: 1, i: 1, parent: null, swapped: null, caption: `Det siste elementet, ${at(heapSize)}, flyttes til roten. Plassen ${heapSize} er nå ledig, siden den er flyttet opp.` });
  heapSize--;
  snap({ line: 2, i: 1, parent: null, swapped: null, caption: `Haugen krymper til ${heapSize} elementer. Roten er ${at(1)}, og den kan være mindre enn barna. Vi siler den nedover.` });

  const heapify = (i: number) => {
    const l = 2 * i, r = 2 * i + 1;
    let largest = i;
    if (l <= heapSize && at(l) > at(i)) largest = l;
    if (r <= heapSize && at(r) > at(largest)) largest = r;
    if (largest === i) {
      snap({ line: 3, i, parent: null, swapped: null, caption: `${at(i)} på plass ${i} er større enn barna eller har ingen barn i haugen. Haugegenskapen gjelder her, så vi stopper.` });
      return;
    }
    snap({ line: 3, i, parent: largest, swapped: null, caption: `${at(largest)} på plass ${largest} er den største av ${at(i)} og barna. Vi bytter.` });
    [A[i - 1], A[largest - 1]] = [A[largest - 1], A[i - 1]];
    snap({ line: 3, i: largest, parent: i, swapped: [i, largest], caption: `${at(i)} ligger nå på plass ${i}, og ${at(largest)} er nederst i det bytte. Vi siler fortsatt nedover fra ${largest}.` });
    heapify(largest);
  };
  heapify(1);
  snap({ line: 4, i: null, parent: null, swapped: null, caption: `Vi returnerer ${max}, det største elementet. Haugen har nå ${heapSize} elementer, og den er gyldig.` });
  return frames;
}
