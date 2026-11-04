// Step-by-step trace of Merge-Sort(A, p, r) from lecture 3, on the CLRS example of the figures.
// Each frame is one split or one written element, so the array changes exactly as it is explained.
// Indices are 1-based in the captions, as in the book.

export type MergeSortFrame = {
  caption: string;
  /** Index into the lines of Merge-Sort(A, p, r), 5 being the merge. */
  line: number | null;
  array: number[];
  /** The subarray A[p..r] the current call works on, as 0-based inclusive indices. */
  range: [number, number] | null;
  /** The two halves being merged, and the read positions in them. */
  left: number[] | null;
  right: number[] | null;
  i: number | null;
  j: number | null;
  /** Position of the element written in this step. */
  written: number | null;
};

export function traceMergeSort(input: number[] = [5, 2, 4, 7, 1, 3, 2, 6]): MergeSortFrame[] {
  const A = [...input];
  const frames: MergeSortFrame[] = [];
  const snap = (frame: Pick<MergeSortFrame, "caption" | "line" | "range" | "left" | "right" | "i" | "j" | "written">) =>
    frames.push({ ...frame, array: [...A] });
  const show = (values: number[]) => `⟨${values.join(", ")}⟩`;

  const sort = (p: number, r: number) => {
    snap({ line: 0, range: [p, r], left: null, right: null, i: null, j: null, written: null, caption: `Merge-Sort på A[${p + 1} : ${r + 1}] = ${show(A.slice(p, r + 1))}. Har vi bare ett element?` });
    if (p >= r) {
      snap({ line: 1, range: [p, r], left: null, right: null, i: null, j: null, written: null, caption: `Det er bare ett element, så det er allerede sortert.` });
      return;
    }
    const q = Math.floor((p + r) / 2);
    snap({ line: 2, range: [p, r], left: null, right: null, i: null, j: null, written: null, caption: `Vi deler i to ved q = ${q + 1}: venstre halvdel er A[${p + 1} : ${q + 1}] og høyre er A[${q + 2} : ${r + 1}].` });
    sort(p, q);
    sort(q + 1, r);
    merge(p, q, r);
  };

  const merge = (p: number, q: number, r: number) => {
    const left = A.slice(p, q + 1), right = A.slice(q + 1, r + 1);
    let i = 0, j = 0;
    snap({ line: 5, range: [p, r], left: [...left], right: [...right], i, j, written: null, caption: `Vi slår sammen to sorterte halvdeler: L = ${show(left)} og R = ${show(right)}. Vi skriver den minste først.` });
    for (let k = p; k <= r; k++) {
      const takeLeft = j >= right.length || (i < left.length && left[i] <= right[j]);
      const value = takeLeft ? left[i] : right[j];
      if (takeLeft) i++; else j++;
      A[k] = value;
      const other = takeLeft ? (j < right.length ? right[j] : null) : (i < left.length ? left[i] : null);
      const reason = takeLeft
        ? (other === null ? `R er brukt opp, så ${value} tas fra L.` : `${value} er mindre enn eller lik ${other}, så ${value} tas fra L.`)
        : (other === null ? `L er brukt opp, så ${value} tas fra R.` : `${value} er mindre enn ${other}, så ${value} tas fra R.`);
      snap({ line: 5, range: [p, r], left: [...left], right: [...right], i: i < left.length ? i : null, j: j < right.length ? j : null, written: k, caption: `A[${k + 1}] får ${value}. ${reason}` });
    }
    snap({ line: 5, range: [p, r], left: null, right: null, i: null, j: null, written: null, caption: `A[${p + 1} : ${r + 1}] er nå sortert: ${show(A.slice(p, r + 1))}.` });
  };

  sort(0, A.length - 1);
  snap({ line: null, range: null, left: null, right: null, i: null, j: null, written: null, caption: `Hele A er sortert: ${show(A)}. Hver flettning kopierer elementene til en hjelpetabell og tilbake, og det gir Θ(n lg n) arbeid i alt.` });
  return frames;
}
