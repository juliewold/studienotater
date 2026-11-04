// Step-by-step traces of Radix-Sort(A, n, d) and Bucket-Sort(A, n) from lecture 4, on the examples of the
// figures. Radix sort moves elements one digit at a time with a stable sort; bucket sort distributes
// uniform numbers into buckets, sorts each bucket, and concatenates them.

export type RadixFrame = {
  caption: string;
  /** Index into the lines of Radix-Sort(A, n, d). */
  line: number | null;
  /** The pass (1 is the least significant digit), and the digit column it sorts on. */
  pass: number;
  /** The order of the numbers before this pass, and the output written so far in this pass. */
  before: string[];
  output: string[];
  /** The number placed in this step, if any. */
  placed: string | null;
};

export function traceRadix(input = ["1736", "0529", "1938", "1223", "0531", "2007", "2016"]): RadixFrame[] {
  const d = input[0].length;
  let current = [...input];
  const frames: RadixFrame[] = [];
  frames.push({ caption: `Vi sorterer ${input.length} tall med ${d} siffer hver. Vi går fra minst til mest signifikante siffer, og hvert pass bruker en stabil sortering.`, line: null, pass: 0, before: current, output: [], placed: null });
  for (let pass = 1; pass <= d; pass++) {
    const column = d - pass;
    const digitOf = (value: string) => value[column];
    frames.push({ caption: `Pass ${pass}: vi sorterer på siffer ${pass} fra høyre, som er ${pass === 1 ? "det minst signifikante" : pass === d ? "det mest signifikante" : "et mellomsiffer"}.`, line: 0, pass, before: current, output: [], placed: null });
    const output: string[] = [];
    for (let digit = 0; digit <= 9; digit++) {
      for (const value of current) {
        if (digitOf(value) !== String(digit)) continue;
        output.push(value);
        frames.push({ caption: `${value} har ${digit} på siffer ${pass}. Den legges etter de som allerede har ${digit}, så den kommer i samme rekkefølge som før. Det er stabiliteten.`, line: 1, pass, before: current, output: [...output], placed: value });
      }
    }
    current = output;
    frames.push({ caption: `Etter pass ${pass} er tallene sortert på ${pass === 1 ? "det siste sifferet" : `de ${pass} siste sifrene`}: ${current.join(", ")}.`, line: 1, pass, before: current, output: [...current], placed: null });
  }
  frames.push({ caption: `Alle ${d} pass er ferdige, og tallene er sortert: ${current.join(", ")}.`, line: null, pass: d, before: current, output: [...current], placed: null });
  return frames;
}

export type BucketFrame = {
  caption: string;
  /** Index into the lines of Bucket-Sort(A, n). */
  line: number | null;
  /** The buckets B[0..n−1], each a list of values. */
  buckets: number[][];
  /** The input values not yet placed in a bucket, and the value being placed. */
  remaining: number[];
  placed: number | null;
  /** The bucket being sorted, if any. */
  sorting: number | null;
  /** The concatenated output, once it exists. */
  output: number[] | null;
};

const decimal = (value: number) => value.toFixed(2).replace(".", ",");

export function traceBucket(input = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]): BucketFrame[] {
  const n = input.length;
  const buckets: number[][] = Array.from({ length: n }, () => []);
  const frames: BucketFrame[] = [];
  const snap = (frame: Pick<BucketFrame, "caption" | "line" | "remaining" | "placed" | "sorting" | "output">) =>
    frames.push({ ...frame, buckets: buckets.map(bucket => [...bucket]) });

  snap({ line: 1, remaining: [...input], placed: null, sorting: null, output: null, caption: `Vi har ${n} tall i [0, 1), og vi lager ${n} tomme bøtter. Bøtte b dekker intervallet [b/${n}, (b+1)/${n}).` });
  for (const value of input) {
    const bucket = Math.floor(n * value);
    buckets[bucket].push(value);
    snap({ line: 4, remaining: input.slice(input.indexOf(value) + 1), placed: value, sorting: null, output: null,
      caption: `${decimal(value)} er med i intervallet [${bucket}/${n}, ${bucket + 1}/${n}), så det går i bøtte ${bucket}, siden ⌊${n} · ${decimal(value)}⌋ = ${bucket}.` });
  }
  const sorted = buckets.map(bucket => [...bucket].sort((a, b) => a - b));
  sorted.forEach((bucket, index) => {
    if (bucket.length < 2) return;
    buckets[index] = bucket;
    snap({ line: 6, remaining: [], placed: null, sorting: index, output: null,
      caption: `Bøtte ${index} har ${bucket.length} tall, så vi sorterer dem: ${bucket.map(decimal).join(", ")}. Det er bare innholdet i bøtta som må sorteres.` });
  });
  const output = sorted.flat();
  snap({ line: 7, remaining: [], placed: null, sorting: null, output,
    caption: `Vi setter bøttene etter hverandre. Bøtte 0 kommer først, og så videre. Resultatet er ${output.map(decimal).join(", ")}.` });
  return frames;
}
