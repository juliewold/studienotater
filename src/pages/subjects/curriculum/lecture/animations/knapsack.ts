// Step-by-step trace of the bottom-up 0-1 knapsack, Knapsack′(n, W), from lecture 6, on the example of
// the figure. Every cell K[i][j] is the best value with the first i items and capacity j. The table is
// filled one cell at a time, and at the end the choices are read back to see which items were taken.

export type KnapsackFrame = {
  caption: string;
  /** Index into the lines of Knapsack′(n, W). */
  line: number | null;
  /** K[i][j]; null for cells not filled yet. */
  K: (number | null)[][];
  /** The cell being filled, or the cell the traceback is standing in. */
  cell: [number, number] | null;
  /** The cells the value came from: K[i − 1][j] and, when the item fits, K[i − 1][j − w]. */
  from: [number, number][];
  /** Items chosen so far by the traceback, as 1-based item numbers. */
  taken: number[];
};

/** The example of the figure: weights, values and capacity. */
export const knapsackWeights = [1, 2, 3];
export const knapsackValues = [60, 100, 120];
export const knapsackCapacity = 5;

export function traceKnapsack(w = knapsackWeights, v = knapsackValues, W = knapsackCapacity): KnapsackFrame[] {
  const n = w.length;
  const K: (number | null)[][] = Array.from({ length: n + 1 }, () => Array(W + 1).fill(null));
  const frames: KnapsackFrame[] = [];
  const snap = (frame: Pick<KnapsackFrame, "caption" | "line" | "cell" | "from" | "taken">) =>
    frames.push({ ...frame, K: K.map(row => [...row]) });

  snap({ line: 0, cell: null, from: [], taken: [], caption: `Vi lager tabellen K med ${n + 1} rader og ${W + 1} kolonner. Rad i betyr de første i gjenstandene, og kolonne j betyr kapasitet j. Med ingen gjenstander er verdien 0 overalt.` });
  for (let j = 0; j <= W; j++) K[0][j] = 0;
  snap({ line: 2, cell: null, from: [], taken: [], caption: `Rad 0 er fylt med 0.` });

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= W; j++) {
      const skip = K[i - 1][j]!;
      if (j < w[i - 1]) {
        K[i][j] = skip;
        snap({ line: 7, cell: [i, j], from: [[i - 1, j]], taken: [], caption: `Gjenstand ${i} har vekt ${w[i - 1]}, som er mer enn kapasiteten ${j}, så den får ikke plass. K[${i}, ${j}] = ${skip}, som i raden over.` });
      } else {
        const take = K[i - 1][j - w[i - 1]]! + v[i - 1];
        K[i][j] = Math.max(skip, take);
        const takeWins = take > skip;
        snap({
          line: 9, cell: [i, j], from: [[i - 1, j], [i - 1, j - w[i - 1]]], taken: [],
          caption: `Gjenstand ${i} (vekt ${w[i - 1]}, verdi ${v[i - 1]}) passer i kapasitet ${j}. Uten den: ${skip}. Med den: ${K[i - 1][j - w[i - 1]]} + ${v[i - 1]} = ${take}. K[${i}, ${j}] = ${K[i][j]}${takeWins ? ", så vi tar med gjenstanden" : ", så vi lar den ligge"}.`,
        });
      }
    }
  }
  snap({ line: 10, cell: [n, W], from: [], taken: [], caption: `Tabellen er ferdig. Den største verdien for kapasitet ${W} er K[${n}, ${W}] = ${K[n][W]}.` });

  // Read the choices back: if K[i][j] differs from the row above, item i was taken.
  const taken: number[] = [];
  let j = W;
  for (let i = n; i >= 1; i--) {
    if (K[i][j] !== K[i - 1][j]) {
      taken.unshift(i);
      snap({ line: null, cell: [i, j], from: [[i - 1, j - w[i - 1]]], taken: [...taken], caption: `K[${i}, ${j}] = ${K[i][j]} er ikke lik ${K[i - 1][j]} over den, så gjenstand ${i} er med. Vi går til rad ${i - 1} og kapasitet ${j - w[i - 1]}.` });
      j -= w[i - 1];
    } else {
      snap({ line: null, cell: [i, j], from: [[i - 1, j]], taken: [...taken], caption: `K[${i}, ${j}] = ${K[i - 1][j]} er lik verdien over, så gjenstand ${i} er ikke med. Vi går opp til rad ${i - 1}.` });
    }
  }
  snap({ line: null, cell: null, from: [], taken: [...taken], caption: `Gjenstandene ${taken.join(" og ")} er valgt. De har til sammen vekt ${taken.reduce((sum, item) => sum + w[item - 1], 0)} og verdi ${K[n][W]}.` });
  return frames;
}
