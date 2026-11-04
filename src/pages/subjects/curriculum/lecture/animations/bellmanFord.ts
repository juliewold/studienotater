import { bellmanFordEdges, bellmanFordNodes } from "../../../../../data/curriculum/lessons/exampleGraphs";

// Step-by-step trace of Bellman-Ford(G, w, s) from lecture 10, on the example of the figure. Every
// edge is relaxed once per pass, in list order, so the table of estimates fills in pass by pass.

export type BellmanFordFrame = {
  caption: string;
  /** Index into the lines of Bellman-Ford(G, w, s). */
  line: number | null;
  /** 0 before the passes, 1 to |V| − 1 for the passes, and |V| for the check. */
  pass: number;
  d: Record<string, number>;
  /** The estimates at the end of each finished pass, starting with the initial state. */
  rows: { label: string; d: Record<string, number> }[];
  edge: [string, string] | null;
  lowered: boolean;
};

export function traceBellmanFord(
  nodes: string[] = bellmanFordNodes,
  edges: [string, string, number][] = bellmanFordEdges,
  s = "s",
): BellmanFordFrame[] {
  const d: Record<string, number> = Object.fromEntries(nodes.map(v => [v, Infinity]));
  d[s] = 0;
  const rows: BellmanFordFrame["rows"] = [{ label: "Start", d: { ...d } }];
  const frames: BellmanFordFrame[] = [];
  const shown = (value: number) => (value === Infinity ? "∞" : String(value));
  // Spoken weights: a negative weight is read as «minus», so the caption can be heard.
  const op = (w: number) => (w < 0 ? `minus ${-w}` : `pluss ${w}`);
  const snap = (frame: Pick<BellmanFordFrame, "caption" | "line" | "pass" | "edge" | "lowered">) =>
    frames.push({ ...frame, d: { ...d }, rows: rows.map(row => ({ label: row.label, d: { ...row.d } })) });

  snap({ line: 0, pass: 0, edge: null, lowered: false, caption: `Vi setter estimatet til ${s} til 0, og alle andre noder får estimat uendelig.` });

  const passes = nodes.length - 1;
  for (let pass = 1; pass <= passes; pass++) {
    edges.forEach(([u, v, w], index) => {
      const candidate = d[u] + w;
      const lead = index === 0 ? `Pass ${pass}: vi går gjennom alle kantene. ` : "";
      if (candidate < d[v]) {
        d[v] = candidate;
        snap({ line: 3, pass, edge: [u, v], lowered: true, caption: `${lead}Kanten ${u}–${v} har vekt ${w}. ${shown(candidate - w)} ${op(w)} = ${candidate}, som er mindre enn estimatet til ${v}, så estimatet til ${v} blir ${candidate}.` });
      } else {
        snap({ line: 3, pass, edge: [u, v], lowered: false, caption: `${lead}Kanten ${u}–${v} har vekt ${w}. ${shown(d[u])} ${op(w)} = ${shown(candidate)} er ikke mindre enn ${shown(d[v])}, så ingenting endres.` });
      }
    });
    rows.push({ label: `Pass ${pass}`, d: { ...d } });
    snap({
      line: 1, pass, edge: null, lowered: false,
      caption: `Pass ${pass} er ferdig: ${nodes.filter(v => v !== s).map(v => `estimatet til ${v} er ${shown(d[v])}`).join(", ")}.`,
    });
  }

  edges.forEach(([u, v, w], index) => {
    const stable = d[u] + w >= d[v];
    snap({
      line: 5, pass: passes + 1, edge: [u, v], lowered: false,
      caption: `${index === 0 ? `Kontrollrunden: vi sjekker om noen kant kan slakkes ennå. ` : ""}For ${u}–${v} er ${shown(d[u])} ${op(w)} = ${shown(d[u] + w)}, og ${stable ? `det er ikke mindre enn estimatet til ${v}, ${shown(d[v])}.` : `det er mindre enn estimatet til ${v}, ${shown(d[v])}.`}`,
    });
  });
  const slack = edges.some(([u, v, w]) => d[u] + w < d[v]);
  snap({
    line: slack ? 6 : 7, pass: passes + 1, edge: null, lowered: false,
    caption: slack
      ? "En kant kan fortsatt slakkes, så det finnes en negativ sykel som kan nåes fra s. Algoritmen returnerer false."
      : "Ingen kant kan slakkes, så det finnes ingen negativ sykel som kan nåes fra s. Estimatene er korteste avstander, og algoritmen returnerer true.",
  });
  return frames;
}
