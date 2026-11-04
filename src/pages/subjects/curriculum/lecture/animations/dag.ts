import { dagEdges, dagOrder } from "../../../../../data/curriculum/lessons/exampleGraphs";

// Step-by-step trace of DAG-Shortest-Paths(G, w, s) from lecture 10, on the example of the figure. The
// vertices are processed in topological order, so every edge into a vertex has been relaxed before the
// vertex itself is processed. Negative edges are fine here, because the graph has no cycles.

export type DagFrame = {
  caption: string;
  /** Index into the lines of DAG-Shortest-Paths(G, w, s). */
  line: number | null;
  /** The vertices in topological order, and the ones processed so far. */
  order: string[];
  processed: string[];
  /** The current estimate v.d per vertex, Infinity before it is reached. */
  d: Record<string, number>;
  pi: Record<string, string | undefined>;
  current: string | null;
  edge: [string, string] | null;
  lowered: boolean;
};

export function traceDag(order = dagOrder, edges = dagEdges, s = "a"): DagFrame[] {
  const d: Record<string, number> = Object.fromEntries(order.map(v => [v, Infinity]));
  const pi: Record<string, string | undefined> = {};
  const processed: string[] = [];
  const frames: DagFrame[] = [];
  const snap = (frame: Pick<DagFrame, "caption" | "line" | "current" | "edge" | "lowered">) =>
    frames.push({ ...frame, order: [...order], processed: [...processed], d: { ...d }, pi: { ...pi } });
  const shown = (value: number) => (value === Infinity ? "∞" : String(value));
  const op = (w: number) => (w < 0 ? `minus ${-w}` : `pluss ${w}`);

  snap({ line: 0, current: null, edge: null, lowered: false, caption: `Først sorterer vi nodene topologisk: ${order.join(", ")}. Da ligger alle kanter fremover, så når en node behandles, er alle kantene inn til den allerede slakket.` });
  d[s] = 0;
  snap({ line: 1, current: null, edge: null, lowered: false, caption: `Vi setter estimatet til ${s} til 0, og alle andre får estimat uendelig.` });

  for (const u of order) {
    snap({ line: 2, current: u, edge: null, lowered: false, caption: d[u] === Infinity
      ? `Vi behandler ${u}. Estimatet er uendelig, så ingen kant ut av ${u} kan gi noe.`
      : `Vi behandler ${u}, med estimat ${d[u]}. Nå slakker vi kantene ut av ${u}.` });
    for (const [a, b, w] of edges) {
      if (a !== u) continue;
      const candidate = d[u] + w;
      if (candidate < d[b]) {
        d[b] = candidate;
        pi[b] = u;
        snap({ line: 4, current: u, edge: [a, b], lowered: true, caption: `Kanten ${a}–${b} har vekt ${w}. ${shown(d[u])} ${op(w)} = ${shown(candidate)}, som er mindre enn estimatet til ${b}, så estimatet til ${b} blir ${candidate}.` });
      } else {
        snap({ line: 4, current: u, edge: [a, b], lowered: false, caption: `Kanten ${a}–${b} har vekt ${w}. ${shown(d[u])} ${op(w)} = ${shown(candidate)} er ikke mindre enn ${shown(d[b])}, så ingenting endres.` });
      }
    }
    processed.push(u);
  }
  const result = order.map(v => `${v} ${shown(d[v])}`).join(", ");
  snap({ line: null, current: null, edge: null, lowered: false, caption: `Alle nodene er behandlet. Korteste avstander fra ${s}: ${result}. Negative kanter er ikke noe problem her, fordi grafen er en DAG.` });
  return frames;
}
