import type { SelectFrame } from "./select";

// Step-by-step trace of Quicksort(A, p, r) from lecture 3, on the example of the Partition figure. Each call
// partitions its subarray around the last element, then sorts the two sides. The subarray being worked on is
// shown, so the recursion can be followed in the array itself.

export function traceQuicksort(input = [2, 8, 7, 1, 3, 5, 6, 4]): SelectFrame[] {
  const A = [...input];
  const frames: SelectFrame[] = [];
  const snap = (depth: number) => (frame: Omit<SelectFrame, "array" | "depth">) => frames.push({ ...frame, array: [...A], depth });

  const sort = (p: number, r: number, depth: number) => {
    const at = snap(depth);
    if (p >= r) {
      at({ caption: p === r ? `A[${p + 1}] alene er allerede sortert.` : `Det er ingen elementer i A[${p + 1} : ${r + 1}], så det er ingenting å gjøre.`, line: 0, range: p <= r ? [p, r] : null, rank: null, pivot: null, i: null, j: null, found: null });
      return;
    }
    at({ caption: `Quicksort på A[${p + 1} : ${r + 1}] = ${A.slice(p, r + 1).join(", ")}. Siden p < r deler vi.`, line: 0, range: [p, r], rank: null, pivot: null, i: null, j: null, found: null });
    // Partition(A, p, r): the pivot is the last element, and the smaller ones are moved to the front.
    const x = A[r];
    let i = p - 1;
    at({ caption: `Pivoten er x = A[${r + 1}] = ${x}, det siste elementet.`, line: 1, range: [p, r], rank: null, pivot: r, i: null, j: null, found: null });
    for (let j = p; j < r; j++) {
      if (A[j] <= x) {
        i++;
        [A[i], A[j]] = [A[j], A[i]];
        at({ caption: `${A[i]} er mindre enn eller lik ${x}, så den bytter plass inn i den lille sonen.`, line: 1, range: [p, r], rank: null, pivot: r, i, j, found: null });
      } else {
        at({ caption: `${A[j]} er større enn ${x}, så den blir i den store sonen.`, line: 1, range: [p, r], rank: null, pivot: r, i, j, found: null });
      }
    }
    [A[i + 1], A[r]] = [A[r], A[i + 1]];
    const q = i + 1;
    at({ caption: `Pivoten ${x} står nå på sin endelige plass ${q + 1}. Til venstre er det mindre, og til høyre er det større.`, line: 1, range: [p, r], rank: null, pivot: q, i: q, j: null, found: q });
    sort(p, q - 1, depth + 1);
    sort(q + 1, r, depth + 1);
  };
  sort(0, A.length - 1, 0);
  frames.push({ caption: `Hele A er sortert: ${A.join(", ")}. Hver pivot står nå på sin endelige plass, og hver rekursjon har gjort ett arbeid mer til.`, line: null, array: [...A], depth: 0, range: null, rank: null, pivot: null, i: null, j: null, found: null });
  return frames;
}
