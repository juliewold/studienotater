import { mstEdges } from "../../../../../data/curriculum/lessons/exampleGraphs";

// Step-by-step trace of MST-Kruskal(G, w) from lecture 9, on the CLRS graph of the figures. The
// disjoint sets are shown as they change, and each edge is marked as accepted or rejected.
// A set is named after its smallest node, which is a valid representative for Find-Set.

export type KruskalEdgeState = "open" | "accepted" | "rejected";

export type KruskalFrame = {
  caption: string;
  /** Index into the lines of MST-Kruskal(G, w). */
  line: number | null;
  /** The edges in order of weight, each with the decision made so far. */
  sorted: { u: string; v: string; w: number; state: KruskalEdgeState }[];
  /** Representative of each node, that is its set's name. */
  set: Record<string, string>;
  /** The edge being decided, if any. */
  current: [string, string] | null;
  total: number;
};

export function traceKruskal(edges: [string, string, number][] = mstEdges): KruskalFrame[] {
  const nodes = [...new Set(edges.flatMap(([u, v]) => [u, v]))].sort();
  const set: Record<string, string> = Object.fromEntries(nodes.map(v => [v, v]));
  const sorted = [...edges].sort((a, b) => a[2] - b[2]).map(([u, v, w]) => ({ u, v, w, state: "open" as KruskalEdgeState }));
  const frames: KruskalFrame[] = [];
  let total = 0;
  const snap = (frame: Pick<KruskalFrame, "caption" | "line" | "current">) =>
    frames.push({ ...frame, sorted: sorted.map(edge => ({ ...edge })), set: { ...set }, total });
  // Captions are read aloud, so sets are written as words rather than with braces.
  const spell = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} og ${items.at(-1)}`);
  const names = (rep: string) => spell(nodes.filter(v => set[v] === rep));

  snap({ line: 2, current: null, caption: `A er tom, og hver av de ${nodes.length} nodene blir en egen mengde.` });
  snap({ line: 3, current: null, caption: `Vi sorterer de ${sorted.length} kantene etter vekt. Den letteste er ${sorted[0].u}–${sorted[0].v} med vekt ${sorted[0].w}.` });

  for (const edge of sorted) {
    const { u, v, w } = edge;
    const ru = set[u], rv = set[v];
    if (ru === rv) {
      edge.state = "rejected";
      snap({ line: 5, current: [u, v], caption: `Kanten ${u}–${v} med vekt ${w}: Find-Set(${u}) og Find-Set(${v}) er begge ${ru}. Kanten ville laget en sykel, så den hoppes over.` });
      continue;
    }
    snap({ line: 5, current: [u, v], caption: `Kanten ${u}–${v} med vekt ${w}: Find-Set(${u}) er ${ru} og Find-Set(${v}) er ${rv}. Mengdene er ulike, så kanten kan legges til uten sykel.` });
    edge.state = "accepted";
    total += w;
    const keep = ru < rv ? ru : rv, drop = ru < rv ? rv : ru;
    for (const x of nodes) if (set[x] === drop) set[x] = keep;
    snap({ line: 7, current: [u, v], caption: `Kanten legges til A, og mengdene ${ru} og ${rv} slås sammen til én mengde med ${names(keep)}.` });
  }

  const accepted = sorted.filter(edge => edge.state === "accepted").length;
  snap({
    line: 8, current: null,
    caption: `Ferdig: A har ${accepted} kanter med total vekt ${total}. Vi har alltid tatt den letteste kanten som ikke lager sykel, så A er et minimalt spenntre.`,
  });
  return frames;
}
