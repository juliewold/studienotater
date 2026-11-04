// Step-by-step traces of Randomized-Select(A, p, r, i) and Select(A, p, r, i) from lecture 4: finding the
// i-th smallest element. Randomized-Select partitions around a random pivot. Select (median of medians) splits
// the elements into groups of 5, takes the median of the medians as its pivot, and so guarantees a good
// split. The indices are 1-based in the captions, as in the book.

export type SelectFrame = {
  caption: string;
  /** Index into the lines of the pseudocode being traced. */
  line: number | null;
  array: number[];
  /** The subarray A[p..r] the current call works on, 0-based inclusive, and the rank i searched for in it. */
  range: [number, number] | null;
  rank: number | null;
  /** The pivot position, and the scan pointers of the partition. */
  pivot: number | null;
  i: number | null;
  j: number | null;
  /** The position of the answer, once it is found. */
  found: number | null;
  depth: number;
};

/** Partition(A, p, r) around the value at r, with the scan pointers shown. */
function partitionFrames(
  A: number[], p: number, r: number, rank: number | null, line: number,
  snap: (frame: Omit<SelectFrame, "array" | "depth">) => void,
): number {
  const x = A[r];
  let i = p - 1;
  for (let j = p; j < r; j++) {
    if (A[j] <= x) {
      i++;
      [A[i], A[j]] = [A[j], A[i]];
      snap({ caption: `${A[i]} er mindre enn eller lik pivoten ${x}, så vi bytter det inn i den lille sonen. Elementene til venstre for i er nå mindre enn eller lik ${x}.`, line, range: [p, r], rank, pivot: r, i, j, found: null });
    } else {
      snap({ caption: `${A[j]} er større enn pivoten ${x}, så den blir liggende i den store sonen.`, line, range: [p, r], rank, pivot: r, i, j, found: null });
    }
  }
  [A[i + 1], A[r]] = [A[r], A[i + 1]];
  snap({ caption: `Vi bytter pivoten ${x} inn på plass ${i + 2}. Alt til venstre er mindre, og alt til høyre er større.`, line, range: [p, r], rank, pivot: i + 1, i: i + 1, j: null, found: null });
  return i + 1;
}

export function traceRandomizedSelect(input = [4, 6, 8, 3, 2, 5, 7, 1], rank = 4, pivotDraws: number[] = [6, 1, 3]): SelectFrame[] {
  const A = [...input];
  const frames: SelectFrame[] = [];
  let draw = 0;
  const snap = (depth: number) => (frame: Omit<SelectFrame, "array" | "depth">) => frames.push({ ...frame, array: [...A], depth });

  const select = (p: number, r: number, i: number, depth: number): number => {
    snap(depth)({ caption: `Randomized-Select leter etter rang ${i} i A[${p + 1} : ${r + 1}].`, line: null, range: [p, r], rank: i, pivot: null, i: null, j: null, found: null });
    if (p === r) {
      snap(depth)({ caption: `Det er bare ett element igjen, og det er svaret: ${A[p]}.`, line: 1, range: [p, r], rank: i, pivot: null, i: null, j: null, found: p });
      return A[p];
    }
    // The pivot is drawn at random. The draws are fixed here, so the animation is the same every time.
    const drawn = p + (pivotDraws[draw++ % pivotDraws.length] % (r - p + 1));
    [A[drawn], A[r]] = [A[r], A[drawn]];
    snap(depth)({ caption: `Den tilfeldige pivoten er A[${drawn + 1}] = ${A[r]}. Vi bytter den til slutten, og partisjonerer rundt den.`, line: 2, range: [p, r], rank: i, pivot: r, i: null, j: null, found: null });
    const q = partitionFrames(A, p, r, i, 2, snap(depth));
    const k = q - p + 1;
    snap(depth)({ caption: `Pivoten ${A[q]} har rang ${k} i A[${p + 1} : ${r + 1}]. Vi søker etter rang ${i}.`, line: 3, range: [p, r], rank: i, pivot: q, i: null, j: null, found: null });
    if (i === k) {
      snap(depth)({ caption: `Rangen er ${i}, og det er pivoten, ${A[q]}.`, line: 5, range: [p, r], rank: i, pivot: q, i: null, j: null, found: q });
      return A[q];
    }
    if (i < k) {
      snap(depth)({ caption: `${i} er mindre enn ${k}, så svaret ligger til venstre for pivoten. Vi søker videre i A[${p + 1} : ${q}].`, line: 7, range: [p, q - 1], rank: i, pivot: null, i: null, j: null, found: null });
      return select(p, q - 1, i, depth + 1);
    }
    snap(depth)({ caption: `${i} er større enn ${k}, så vi har ${k} mindre elementer til venstre, og søker etter rang ${i - k} til høyre for pivoten.`, line: 8, range: [q + 1, r], rank: i - k, pivot: null, i: null, j: null, found: null });
    return select(q + 1, r, i - k, depth + 1);
  };
  const answer = select(0, A.length - 1, rank, 0);
  const position = A.indexOf(answer);
  frames.push({ caption: `Svaret er ${answer}, som er det ${rank}. minste elementet. Hver runde forkastet minst en del av området, og forventet arbeid er lineært.`, line: null, array: [...A], depth: 0, range: null, rank: null, pivot: null, i: null, j: null, found: position });
  return frames;
}

export function traceSelect(input = [4, 6, 8, 3, 2, 5, 7, 1, 9, 10, 15, 12, 11, 14, 13], rank = 7): SelectFrame[] {
  const A = [...input];
  const frames: SelectFrame[] = [];
  const snap = (depth: number) => (frame: Omit<SelectFrame, "array" | "depth">) => frames.push({ ...frame, array: [...A], depth });

  const select = (p: number, r: number, i: number, depth: number): number => {
    snap(depth)({ caption: `Select leter etter rang ${i} i A[${p + 1} : ${r + 1}], som har ${r - p + 1} elementer.`, line: null, range: [p, r], rank: i, pivot: null, i: null, j: null, found: null });
    // Make the size a multiple of 5 by moving the smallest element to the front, as the first lines do.
    while ((r - p + 1) % 5 !== 0) {
      snap(depth)({ caption: `Størrelsen ${r - p + 1} er ikke delelig med 5. Vi finner minste element i A[${p + 1} : ${r + 1}] og flytter det til A[${p + 1}].`, line: 0, range: [p, r], rank: i, pivot: null, i: null, j: null, found: null });
      for (let j = p + 1; j <= r; j++) {
        if (A[p] > A[j]) {
          [A[p], A[j]] = [A[j], A[p]];
          snap(depth)({ caption: `A[${p + 1}] er større enn A[${j + 1}], så de bytter plass. Nå ligger den minste verdien så langt først.`, line: 3, range: [p, r], rank: i, pivot: null, i: p, j, found: null });
        }
      }
      if (i === 1) {
        snap(depth)({ caption: `Rangen er 1, og det er det minste elementet, ${A[p]}.`, line: 5, range: [p, r], rank: i, pivot: p, i: null, j: null, found: p });
        return A[p];
      }
      p++;
      i--;
      snap(depth)({ caption: `Vi ser bort fra det minste elementet, ${A[p - 1]}. Det er det minste i området, så søket etter rang ${i} fortsetter i resten.`, line: 7, range: [p, r], rank: i, pivot: null, i: null, j: null, found: null });
    }
    const g = (r - p + 1) / 5;
    snap(depth)({ caption: `Vi deler ${r - p + 1} elementer i ${g} grupper på 5. Hver gruppe er A[j], A[j + ${g}], A[j + ${2 * g}], A[j + ${3 * g}] og A[j + ${4 * g}].`, line: 8, range: [p, r], rank: i, pivot: null, i: null, j: null, found: null });
    for (let j = p; j < p + g; j++) {
      const positions = [0, 1, 2, 3, 4].map(step => j + step * g);
      const values = positions.map(pos => A[pos]).sort((a, b) => a - b);
      positions.forEach((pos, index) => { A[pos] = values[index]; });
      snap(depth)({ caption: `Gruppen med ${positions.map(pos => A[pos]).join(", ")} sorteres på plass. Medianen, ${values[2]}, står midt i gruppen.`, line: 10, range: [p, r], rank: i, pivot: null, i: null, j, found: null });
    }
    // The medians sit in the middle of each group, at A[p + 2g .. p + 3g − 1].
    const x = select(p + 2 * g, p + 3 * g - 1, Math.ceil(g / 2), depth + 1);
    const xPos = A.indexOf(x, p);
    [A[xPos], A[r]] = [A[r], A[xPos]];
    snap(depth)({ caption: `Medianen av medianene er x = ${x}. Vi flytter den til slutten, og partisjonerer rundt den.`, line: 11, range: [p, r], rank: i, pivot: r, i: null, j: null, found: null });
    const q = partitionFrames(A, p, r, i, 12, snap(depth));
    const k = q - p + 1;
    snap(depth)({ caption: `Pivoten ${A[q]} har rang ${k} i A[${p + 1} : ${r + 1}]. Vi søker etter rang ${i}.`, line: 13, range: [p, r], rank: i, pivot: q, i: null, j: null, found: null });
    if (i === k) {
      snap(depth)({ caption: `Rangen er ${i}, og det er pivoten, ${A[q]}.`, line: 15, range: [p, r], rank: i, pivot: q, i: null, j: null, found: q });
      return A[q];
    }
    if (i < k) {
      snap(depth)({ caption: `${i} er mindre enn ${k}, så svaret ligger til venstre. Vi søker videre i A[${p + 1} : ${q}].`, line: 17, range: [p, q - 1], rank: i, pivot: null, i: null, j: null, found: null });
      return select(p, q - 1, i, depth + 1);
    }
    snap(depth)({ caption: `${i} er større enn ${k}, så svaret ligger til høyre. Vi søker etter rang ${i - k} der.`, line: 18, range: [q + 1, r], rank: i - k, pivot: null, i: null, j: null, found: null });
    return select(q + 1, r, i - k, depth + 1);
  };
  const answer = select(0, A.length - 1, rank, 0);
  frames.push({ caption: `Svaret er ${answer}, som er det ${rank}. minste elementet. Medianen av medianene garanterer at minst 3 av hver 10 elementer er mindre enn pivoten, og størrelsen krymper nok til lineær tid.`, line: null, array: [...A], depth: 0, range: null, rank: null, pivot: null, i: null, j: null, found: A.indexOf(answer) });
  return frames;
}
