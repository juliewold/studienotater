// Step-by-step trace of Partition(A, p, r) from lecture 3, which Quicksort is built on. The array is
// split into three zones, and every step moves the boundaries, so the invariant can be followed.

export type PartitionFrame = {
  caption: string;
  /** Index into the lines of Partition(A, p, r). */
  line: number | null;
  array: number[];
  /** The pivot x = A[r], 0-based position r. */
  pivot: number;
  /** The index i: A[p..i] are at most x, and the zone after i holds values greater than x. */
  i: number;
  /** The index j being looked at, or null when the loop is over. */
  j: number | null;
  /** The positions swapped in this step, if any. */
  swapped: [number, number] | null;
};

export function tracePartition(input: number[] = [2, 8, 7, 1, 3, 5, 6, 4]): PartitionFrame[] {
  const A = [...input];
  const p = 0, r = A.length - 1;
  const x = A[r];
  let i = p - 1;
  const frames: PartitionFrame[] = [];
  const snap = (frame: Pick<PartitionFrame, "caption" | "line" | "j" | "swapped">) =>
    frames.push({ ...frame, array: [...A], pivot: r, i });
  const show = (values: number[]) => `⟨${values.join(", ")}⟩`;
  const swap = (a: number, b: number) => { [A[a], A[b]] = [A[b], A[a]]; };

  snap({ line: 0, j: null, swapped: null, caption: `Pivoten er x = A[${r + 1}] = ${x}, som er det siste elementet. Vi starter med i = ${i + 1}, altså før det første elementet.` });
  for (let j = p; j < r; j++) {
    if (A[j] <= x) {
      snap({ line: 3, j, swapped: null, caption: `A[${j + 1}] = ${A[j]} er mindre enn eller lik x = ${x}, så i flyttes ett steg til høyre.` });
      i++;
      if (i !== j) swap(i, j);
      snap({ line: 5, j, swapped: i !== j ? [i, j] : null, caption: i === j ? `Elementet står allerede rett etter de små verdiene, så ingenting flyttes.` : `Vi bytter A[${i + 1}] og A[${j + 1}]. Nå ligger de små verdiene foran i.` });
    } else {
      snap({ line: 3, j, swapped: null, caption: `A[${j + 1}] = ${A[j]} er større enn x = ${x}, så den blir liggende der den er, etter i.` });
    }
  }
  swap(i + 1, r);
  snap({ line: 6, j: null, swapped: [i + 1, r], caption: `Løkken er ferdig. Vi bytter pivoten x inn på plass ${i + 2}, mellom de mindre og de større verdiene.` });
  snap({ line: 7, j: null, swapped: null, caption: `Partition returnerer ${i + 2}. Alt til venstre er mindre enn eller lik ${x}, og alt til høyre er større: ${show(A)}.` });
  return frames;
}
