// Step-by-step trace of LCS-Length(X, Y, m, n) from lecture 6, followed by Print-LCS. The table c is
// filled one cell at a time, row by row, and every cell shows which neighbour it came from. Then the
// arrows are followed back from the corner to read off the subsequence.

export type LcsArrow = "↖" | "↑" | "←";

export type LcsFrame = {
  caption: string;
  /** Index into the lines of LCS-Length(X, Y, m, n); null while tracing back with Print-LCS. */
  line: number | null;
  /** c[i][j]; null for cells not filled yet. */
  c: (number | null)[][];
  /** b[i][j], the arrow pointing to the cell the value came from. */
  b: (LcsArrow | null)[][];
  /** The cell being filled, or the cell the traceback is standing in. */
  cell: [number, number] | null;
  /** The cells the value of `cell` was compared with. */
  neighbours: [number, number][];
  /** Cells on the traceback path so far, and the subsequence written out so far. */
  path: [number, number][];
  output: string;
};

export function traceLcs(X = "ABCBDAB", Y = "BDCABA"): LcsFrame[] {
  const m = X.length, n = Y.length;
  const c: (number | null)[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));
  const b: (LcsArrow | null)[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));
  const frames: LcsFrame[] = [];
  const snap = (frame: Pick<LcsFrame, "caption" | "line" | "cell" | "neighbours" | "path" | "output">) =>
    frames.push({ ...frame, c: c.map(row => [...row]), b: b.map(row => [...row]) });

  snap({ line: 0, cell: null, neighbours: [], path: [], output: "", caption: `Vi bygger tabellene c og b for X = ${X} og Y = ${Y}. Første rad og første kolonne er 0, siden en tom streng ikke har noen felles delsekvens.` });
  for (let i = 0; i <= m; i++) c[i][0] = 0;
  for (let j = 0; j <= n; j++) c[0][j] = 0;
  snap({ line: 4, cell: null, neighbours: [], path: [], output: "", caption: `Første kolonne og første rad er fylt med 0.` });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const up = c[i - 1][j], left = c[i][j - 1], diag = c[i - 1][j - 1];
      if (X[i - 1] === Y[j - 1]) {
        c[i][j] = diag! + 1;
        b[i][j] = "↖";
        snap({ line: 8, cell: [i, j], neighbours: [[i - 1, j - 1]], path: [], output: "", caption: `Celle (${i}, ${j}): ${X[i - 1]} og ${Y[j - 1]} er like, så c = ${diag} + 1 = ${c[i][j]}, og pilen peker diagonalt, ↖.` });
      } else if (up! >= left!) {
        c[i][j] = up;
        b[i][j] = "↑";
        snap({ line: 11, cell: [i, j], neighbours: [[i - 1, j], [i, j - 1]], path: [], output: "", caption: `Celle (${i}, ${j}): ${X[i - 1]} og ${Y[j - 1]} er ulike. Over er ${up} og til venstre er ${left}, så vi tar det største, ${up}, og pilen peker opp, ↑.` });
      } else {
        c[i][j] = left;
        b[i][j] = "←";
        snap({ line: 14, cell: [i, j], neighbours: [[i - 1, j], [i, j - 1]], path: [], output: "", caption: `Celle (${i}, ${j}): ${X[i - 1]} og ${Y[j - 1]} er ulike. Over er ${up} og til venstre er ${left}, så vi tar ${left}, og pilen peker til venstre, ←.` });
      }
    }
  }
  snap({ line: 15, cell: [m, n], neighbours: [], path: [], output: "", caption: `Tabellen er ferdig. Verdien nederst til høyre, ${c[m][n]}, er lengden på den lengste felles delsekvensen.` });

  // Print-LCS: walk back from the corner. A diagonal arrow means the letter is part of the answer.
  const path: [number, number][] = [];
  let output = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    path.push([i, j]);
    const arrow = b[i][j];
    if (arrow === "↖") {
      output = X[i - 1] + output;
      snap({ line: null, cell: [i, j], neighbours: [], path: [...path], output, caption: `Print-LCS står i (${i}, ${j}), og pilen er ↖. ${X[i - 1]} er med i delsekvensen, så vi skriver den ut og går diagonalt.` });
      i--; j--;
    } else if (arrow === "↑") {
      snap({ line: null, cell: [i, j], neighbours: [], path: [...path], output, caption: `Pilen i (${i}, ${j}) er ↑, så ${X[i - 1]} er ikke med. Vi går opp.` });
      i--;
    } else {
      snap({ line: null, cell: [i, j], neighbours: [], path: [...path], output, caption: `Pilen i (${i}, ${j}) er ←, så ${Y[j - 1]} er ikke med. Vi går til venstre.` });
      j--;
    }
  }
  snap({ line: null, cell: null, neighbours: [], path: [...path], output, caption: `Vi er ved kanten av tabellen, og delsekvensen er ${output}. Den har lengde ${output.length}, som stemmer med c[${m}, ${n}].` });
  return frames;
}
