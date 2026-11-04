import { shortestPathEdges, shortestPathNodes } from "../../../../../data/curriculum/lessons/exampleGraphs";

// Step-by-step trace of Dijkstra(G, w, s) from lecture 10, on the example graph of the figure.
// Each frame is one extraction or one relaxation, so the estimates change where the caption says.

export type DijkstraFrame = {
  caption: string;
  /** Index into the lines of Dijkstra(G, w, s), or null after the loop. */
  line: number | null;
  /** Current estimate v.d per node, Infinity before the node is reached. */
  d: Record<string, number>;
  /** Predecessor on the shortest path found so far. */
  pi: Record<string, string | undefined>;
  /** Nodes finished, in the order they were taken out of Q. */
  done: string[];
  current: string | null;
  /** The edge being relaxed, and whether it lowered the estimate of its head. */
  edge: [string, string] | null;
  lowered: boolean;
};

export function traceDijkstra(
  nodes: string[] = shortestPathNodes,
  edges: [string, string, number][] = shortestPathEdges,
  s = "s",
): DijkstraFrame[] {
  const d: Record<string, number> = {};
  const pi: Record<string, string | undefined> = {};
  const done: string[] = [];
  const frames: DijkstraFrame[] = [];
  const snap = (frame: Pick<DijkstraFrame, "caption" | "line" | "current" | "edge" | "lowered">) =>
    frames.push({ ...frame, d: { ...d }, pi: { ...pi }, done: [...done] });

  for (const v of nodes) d[v] = Infinity;
  d[s] = 0;
  snap({ line: 0, current: null, edge: null, lowered: false, caption: `Vi kjører Dijkstra fra ${s}. Startnoden får estimat 0, og alle andre får estimat uendelig. Alle nodene legges i køen Q.` });

  while (true) {
    const open = nodes.filter(v => !done.includes(v) && d[v] < Infinity);
    if (!open.length) break;
    const u = open.reduce((a, b) => (d[b] < d[a] ? b : a));
    done.push(u);
    snap({ line: 6, current: u, edge: null, lowered: false, caption: `Extract-Min tar ut ${u}, som har lavest estimat, ${d[u]}. Den er nå endelig, og legges i S.` });
    for (const [a, b, w] of edges) {
      if (a !== u) continue;
      const candidate = d[u] + w;
      if (candidate < d[b]) {
        d[b] = candidate;
        pi[b] = u;
        snap({ line: 10, current: u, edge: [a, b], lowered: true, caption: `Kanten fra ${a} til ${b} har vekt ${w}. ${d[u]} + ${w} = ${candidate}, og det er mindre enn ${b} sitt estimat, så estimatet til ${b} senkes til ${candidate}.` });
      } else {
        snap({ line: 9, current: u, edge: [a, b], lowered: false, caption: `Kanten fra ${a} til ${b} har vekt ${w}. ${d[u]} + ${w} = ${candidate} er ikke bedre enn ${d[b] === Infinity ? "uendelig" : d[b]}, så ingenting endres.` });
      }
    }
  }

  const unreached = nodes.filter(v => d[v] === Infinity);
  const result = nodes.filter(v => d[v] < Infinity).map(v => `${v} ${d[v]}`).join(", ");
  snap({
    line: null, current: null, edge: null, lowered: false,
    caption: `Q er tom, og alle estimatene er nå korteste avstander fra ${s}: ${result}.${unreached.length ? ` ${unreached.join(", ")} kan ikke nås.` : ""}`,
  });
  return frames;
}
