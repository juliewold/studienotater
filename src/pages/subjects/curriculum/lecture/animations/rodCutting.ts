// Step-by-step trace of Extended-Bottom-Up-Cut-Rod(p, n) from lecture 6, on the price table of the figure.
// Each r[j] is the best revenue for a rod of length j, and s[j] remembers the first piece that gives it.
// Afterwards the pieces are read back from s, which is how the solution is reconstructed.

export type RodFrame = {
  caption: string;
  /** Index into the lines of Extended-Bottom-Up-Cut-Rod(p, n). */
  line: number | null;
  /** r[0..n], null for lengths not computed yet. */
  r: (number | null)[];
  /** s[1..n] (index 0 is unused), null where not computed. */
  s: (number | null)[];
  /** The length being computed, and the piece length i being tried for it. */
  j: number | null;
  i: number | null;
  /** The piece lengths chosen by the reconstruction so far, in the order they are cut. */
  pieces: number[];
  /** The remaining length during the reconstruction. */
  remaining: number | null;
};

export const rodPrices = [1, 5, 8, 9, 10, 17, 17, 20, 24, 30];

export function traceRodCutting(p = rodPrices, n = 7): RodFrame[] {
  const r: (number | null)[] = Array(n + 1).fill(null);
  const s: (number | null)[] = Array(n + 1).fill(null);
  const frames: RodFrame[] = [];
  const snap = (frame: Pick<RodFrame, "caption" | "line" | "j" | "i" | "pieces" | "remaining">) =>
    frames.push({ ...frame, r: [...r], s: [...s] });

  r[0] = 0;
  snap({ line: 1, j: null, i: null, pieces: [], remaining: null, caption: `Vi lager tabellene r og s for stenger opptil lengde ${n}. En stang av lengde 0 gir 0 i inntekt.` });
  for (let j = 1; j <= n; j++) {
    let q = -Infinity;
    for (let i = 1; i <= j; i++) {
      const candidate = p[i - 1] + (r[j - i] as number);
      if (q < candidate) {
        q = candidate;
        s[j] = i;
        snap({ line: 6, j, i, pieces: [], remaining: null, caption: `Lengde ${j}: vi prøver å kutte første bit på ${i}. Den gir ${p[i - 1]} + r[${j - i}] = ${p[i - 1]} + ${r[j - i]} = ${candidate}, som er den beste så langt. s[${j}] = ${i}.` });
      } else {
        snap({ line: 5, j, i, pieces: [], remaining: null, caption: `Lengde ${j}: første bit på ${i} gir ${p[i - 1]} + ${r[j - i]} = ${candidate}, som ikke er bedre enn ${q}.` });
      }
    }
    r[j] = q;
    snap({ line: 9, j, i: null, pieces: [], remaining: null, caption: `r[${j}] = ${q}. Den beste kuttingen av en stang på ${j} er ${s[j]} først, og resten er det beste for ${j - (s[j] as number)}.` });
  }

  // Reconstruction: the first piece for length n is s[n], and the rest is the same problem for n − s[n].
  const pieces: number[] = [];
  let remaining = n;
  snap({ line: null, j: null, i: null, pieces: [], remaining, caption: `Nå leser vi løsningen tilbake fra s. Vi starter med en stang på ${n}.` });
  while (remaining > 0) {
    const piece = s[remaining] as number;
    pieces.push(piece);
    remaining -= piece;
    snap({ line: null, j: null, i: null, pieces: [...pieces], remaining, caption: remaining > 0
      ? `s[${remaining + piece}] = ${piece}, så vi kutter av en bit på ${piece}. Det som er igjen, er en stang på ${remaining}.`
      : `s[${piece}] = ${piece}, så vi kutter av den siste biten på ${piece}. Ingenting er igjen.` });
  }
  snap({ line: null, j: null, i: null, pieces: [...pieces], remaining: 0, caption: `Stykkene er ${pieces.join(", ")}, og inntekten er ${r[n]}: ${pieces.map(piece => p[piece - 1]).join(" + ")} = ${r[n]}.` });
  return frames;
}
