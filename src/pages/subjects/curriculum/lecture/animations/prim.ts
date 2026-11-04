import { mstEdges } from "../../../../../data/curriculum/lessons/exampleGraphs";

// Step-by-step trace of MST-Prim(G, w, r) from lecture 9, on the CLRS graph of the figures. The
// queue, the keys and the parents change one event at a time, so the tree grows as it is explained.

export type PrimFrame = {
  caption: string;
  /** Index into the lines of MST-Prim(G, w, r). */
  line: number | null;
  key: Record<string, number>;
  parent: Record<string, string | undefined>;
  /** Nodes taken out of the queue, in order. */
  done: string[];
  /** Nodes still in the queue Q. */
  queue: string[];
  current: string | null;
  /** The edge being looked at from `current`, and whether it lowered the key of its other end. */
  edge: [string, string] | null;
  lowered: boolean;
};

export function tracePrim(start = "a", edges: [string, string, number][] = mstEdges): PrimFrame[] {
  const nodes = [...new Set(edges.flatMap(([u, v]) => [u, v]))].sort();
  const key: Record<string, number> = Object.fromEntries(nodes.map(v => [v, Infinity]));
  const parent: Record<string, string | undefined> = {};
  const done: string[] = [];
  const queue = new Set(nodes);
  const frames: PrimFrame[] = [];
  const snap = (frame: Pick<PrimFrame, "caption" | "line" | "current" | "edge" | "lowered">) =>
    frames.push({ ...frame, key: { ...key }, parent: { ...parent }, done: [...done], queue: nodes.filter(v => queue.has(v)) });
  const shown = (value: number) => (value === Infinity ? "∞" : String(value));

  key[start] = 0;
  snap({ line: 3, current: null, edge: null, lowered: false, caption: `Startnoden ${start} får nøkkel 0, og alle andre får nøkkel ∞. Alle nodene legges i køen Q.` });

  while (queue.size) {
    const u = [...queue].sort((a, b) => key[a] - key[b] || (a < b ? -1 : 1))[0];
    queue.delete(u);
    done.push(u);
    snap({
      line: 8, current: u, edge: null, lowered: false,
      caption: `Extract-Min tar ut ${u}, som har lavest nøkkel, ${shown(key[u])}. ${u} legges i treet${parent[u] ? `, og kanten ${parent[u]}–${u} er med` : ""}.`,
    });
    for (const [x, y, w] of edges) {
      const v = x === u ? y : y === u ? x : undefined;
      if (!v || !queue.has(v)) continue;
      if (w < key[v]) {
        key[v] = w;
        parent[v] = u;
        snap({ line: 12, current: u, edge: [u, v], lowered: true, caption: `Kanten ${u}–${v} har vekt ${w}, som er lavere enn ${v} sin nøkkel. Nøkkelen til ${v} blir ${w}, og forgjengeren blir ${u}.` });
      } else {
        snap({ line: 10, current: u, edge: [u, v], lowered: false, caption: `Kanten ${u}–${v} har vekt ${w}, som ikke er lavere enn nøkkelen ${shown(key[v])} til ${v}. Ingenting endres.` });
      }
    }
  }

  const weight = nodes.filter(v => parent[v]).reduce((sum, v) => sum + key[v], 0);
  snap({
    line: null, current: null, edge: null, lowered: false,
    caption: `Køen er tom. Treet har ${nodes.length - 1} kanter med total vekt ${weight}. Hver node fikk den letteste kanten til treet da den ble tatt ut.`,
  });
  return frames;
}
