import { traversalGraph } from "../../../../../data/curriculum/lessons/exampleGraphs";

// Step-by-step trace of DFS(G) with DFS-Visit from lecture 8, on the example graph of the figures.
// The call stack is shown, so the student sees the algorithm go deep, come back, and go deep again.

export type DfsColor = "white" | "gray" | "black";
export type DfsEdgeKind = "tre" | "tilbake" | "fremover" | "kryss";

export type DfsFrame = {
  caption: string;
  /** Index into the lines of DFS-Visit(G, u), or null for the outer loop of DFS(G). */
  line: number | null;
  color: Record<string, DfsColor>;
  d: Record<string, number>;
  f: Record<string, number>;
  pi: Record<string, string | undefined>;
  time: number;
  /** Nodes whose call has not returned yet, outermost first. */
  stack: string[];
  current: string | null;
  edge: [string, string] | null;
  /** Kind of the edge being looked at, once it is known. */
  kind: DfsEdgeKind | null;
};

export const kindName: Record<DfsEdgeKind, string> = {
  tre: "trekant", tilbake: "tilbakekant", fremover: "fremoverkant", kryss: "kryssende kant",
};

export function traceDfs(adj: Record<string, string[]> = traversalGraph): DfsFrame[] {
  const order = Object.keys(adj);
  const color: Record<string, DfsColor> = {};
  const d: Record<string, number> = {};
  const f: Record<string, number> = {};
  const pi: Record<string, string | undefined> = {};
  const stack: string[] = [];
  const frames: DfsFrame[] = [];
  let time = 0;
  let trees = 0;
  const snap = (frame: Pick<DfsFrame, "caption" | "line" | "current" | "edge" | "kind">) =>
    frames.push({ ...frame, color: { ...color }, d: { ...d }, f: { ...f }, pi: { ...pi }, time, stack: [...stack] });

  for (const u of order) color[u] = "white";
  snap({ line: null, current: null, edge: null, kind: null, caption: `Vi kjører DFS. Alle noder er hvite og klokken står på 0. Den ytre løkka prøver nodene i rekkefølgen ${order.join(", ")}.` });

  const visit = (u: string) => {
    time++;
    d[u] = time;
    color[u] = "gray";
    stack.push(u);
    snap({ line: 2, current: u, edge: null, kind: null, caption: `Vi besøker ${u}, som er hvit. Den får tidspunkt ${time} og blir grå. Den står nå øverst på kallstakken.` });
    for (const v of adj[u]) {
      if (color[v] === "white") {
        pi[v] = u;
        snap({ line: 5, current: u, edge: [u, v], kind: "tre", caption: `Kanten fra ${u} til ${v} går til en hvit node. Det er en trekant, så vi går dypt inn i ${v} med en gang.` });
        visit(v);
        snap({ line: 3, current: u, edge: null, kind: null, caption: `Kallet på ${v} er ferdig, så vi er tilbake i ${u}. Vi ser på neste nabo til ${u}.` });
        continue;
      }
      const kind: DfsEdgeKind = color[v] === "gray" ? "tilbake" : d[u] < d[v] ? "fremover" : "kryss";
      const why = kind === "tilbake" ? `${v} er grå, og ligger på kallstakken, så kanten lukker en sykel.`
        : kind === "fremover" ? `${v} er svart og ble besøkt etter ${u}, så kanten er en snarvei nedover.`
          : `${v} er svart og ble ferdig før ${u} ble oppdaget, så kanten krysser mellom to grener.`;
      snap({ line: 3, current: u, edge: [u, v], kind, caption: `Kanten fra ${u} til ${v} er en ${kindName[kind]}. ${why} Den endrer ingen forgjengere.` });
    }
    time++;
    f[u] = time;
    color[u] = "black";
    stack.pop();
    snap({ line: 9, current: u, edge: null, kind: null, caption: `Alle naboene til ${u} er ferdige, så ${u} blir svart med sluttidspunkt ${time}. Vi går tilbake til kallet før.` });
  };

  for (const u of order) {
    if (color[u] !== "white") continue;
    trees++;
    snap({ line: null, current: u, edge: null, kind: null, caption: `${u} er fortsatt hvit, så DFS-Visit starter et nytt tre fra ${u}.` });
    visit(u);
  }

  snap({ line: null, current: null, edge: null, kind: null, caption: `Alle noder er svarte, så DFS er ferdig. Hver node har nå et tidspunkt for oppdagelse og et for ferdigstilling, og skogen har ${trees} ${trees === 1 ? "tre" : "trær"}.` });
  return frames;
}
