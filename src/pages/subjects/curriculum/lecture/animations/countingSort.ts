// Step-by-step trace of Counting-Sort(A, n, k) from lecture 4, on the example of the figure. The counting
// array C is shown as it is counted, turned into running totals, and used to place each element. The
// elements are tagged with their position, so it is visible that equal values keep their order.

export type CountingFrame = {
  caption: string;
  /** Index into the lines of Counting-Sort(A, n, k). */
  line: number | null;
  /** The input with the position of each element, 1-based, as the book numbers them. */
  A: number[];
  /** Counts C[0..k]: first the number of each value, then running totals. */
  C: number[];
  /** Output B[1..n]; null for slots not filled yet. */
  B: (number | null)[];
  /** Position j in A being processed, if any. */
  j: number | null;
  /** The output slot the current element goes to. */
  slot: number | null;
  phase: "count" | "prefix" | "place";
};

export function traceCountingSort(input: number[] = [2, 5, 3, 0, 2, 3, 0, 3], k = 5): CountingFrame[] {
  const A = input, n = A.length;
  const C = Array(k + 1).fill(0);
  const B: (number | null)[] = Array(n).fill(null);
  const frames: CountingFrame[] = [];
  let phase: CountingFrame["phase"] = "count";
  const snap = (frame: Pick<CountingFrame, "caption" | "line" | "j" | "slot">) =>
    frames.push({ ...frame, A: [...A], C: [...C], B: [...B], phase });

  snap({ line: 1, j: null, slot: null, caption: `Vi sorterer ${n} tall med verdier fra 0 til ${k}. Vi lager et telle-array C med ${k + 1} plasser, og alle er 0 til å begynne med.` });

  for (let j = 0; j < n; j++) {
    C[A[j]]++;
    snap({ line: 4, j, slot: null, caption: `Vi teller A[${j + 1}] = ${A[j]}. C[${A[j]}] går opp til ${C[A[j]]}.` });
  }
  snap({ line: 5, j: null, slot: null, caption: `Nå vet vi hvor mange av hver verdi det er. C[v] er antall ganger v står i A.` });

  phase = "prefix";
  for (let i = 1; i <= k; i++) {
    C[i] += C[i - 1];
    snap({ line: 6, j: null, slot: null, caption: `C[${i}] legges til C[${i - 1}], så C[${i}] = ${C[i]}. Det er antall elementer som er mindre enn eller lik ${i}.` });
  }

  phase = "place";
  for (let j = n - 1; j >= 0; j--) {
    const slot = C[A[j]];
    B[slot - 1] = A[j];
    snap({ line: 8, j, slot, caption: `Vi går bakfra og tar A[${j + 1}] = ${A[j]}. C[${A[j]}] = ${slot}, så det skal inn i B[${slot}].` });
    C[A[j]]--;
    snap({ line: 9, j, slot: null, caption: `Vi har plassert A[${j + 1}], så C[${A[j]}] går ned til ${C[A[j]]}. Neste ${A[j]} som kommer, havner en plass lenger foran.` });
  }
  snap({ line: 10, j: null, slot: null, caption: `Resultatet B er ${B.join(", ")}. Like verdier er i samme rekkefølge som i A, så sorteringen er stabil.` });
  return frames;
}
