import { traversalGraph } from "../../../../../data/curriculum/lessons/exampleGraphs";

// Step-by-step trace of BFS(G, s) from lecture 8, on the example graph of the figures. Each frame
// is one event of the algorithm (a dequeue, one edge looked at, a discovery), so the view always
// shows the state that the caption talks about.

export type BfsColor = "white" | "gray" | "black";

export type BfsFrame = {
  caption: string;
  /** Index into the lines of BFS(G, s), or null before the loop. */
  line: number | null;
  color: Record<string, BfsColor>;
  d: Record<string, number>;
  pi: Record<string, string | undefined>;
  queue: string[];
  /** The node taken out of the queue, and the edge being looked at from it. */
  current: string | null;
  edge: [string, string] | null;
};

const colorName: Record<BfsColor, string> = { white: "hvit", gray: "grå", black: "svart" };

export function traceBfs(adj: Record<string, string[]> = traversalGraph, s = "1"): BfsFrame[] {
  const nodes = Object.keys(adj);
  const color: Record<string, BfsColor> = {};
  const d: Record<string, number> = {};
  const pi: Record<string, string | undefined> = {};
  const queue: string[] = [];
  const frames: BfsFrame[] = [];
  const snap = (frame: Pick<BfsFrame, "caption" | "line" | "current" | "edge">) =>
    frames.push({ ...frame, color: { ...color }, d: { ...d }, pi: { ...pi }, queue: [...queue] });

  for (const u of nodes) { color[u] = "white"; d[u] = Infinity; }
  snap({ line: 0, current: null, edge: null, caption: `Vi kjører BFS fra node ${s}. Alle andre noder er hvite, med avstand uendelig og ingen forgjenger.` });

  color[s] = "gray";
  d[s] = 0;
  queue.push(s);
  snap({ line: 8, current: null, edge: null, caption: `Startnoden ${s} blir grå med avstand 0, og legges alene i køen.` });

  while (queue.length) {
    const u = queue.shift()!;
    snap({ line: 10, current: u, edge: null, caption: `Vi tar ${u} ut av køen. Den har avstand ${d[u]}, så alle nabolagene den finner får ${d[u] + 1}.` });
    for (const v of adj[u]) {
      if (color[v] === "white") {
        color[v] = "gray";
        d[v] = d[u] + 1;
        pi[v] = u;
        queue.push(v);
        snap({ line: 16, current: u, edge: [u, v], caption: `${v} er hvit, så vi oppdager den nå. Den får avstand ${d[v]} og forgjenger ${u}, og legges bakerst i køen.` });
      } else {
        snap({ line: 12, current: u, edge: [u, v], caption: `${v} er allerede ${colorName[color[v]]}, så kanten fra ${u} til ${v} endrer ingenting.` });
      }
    }
    color[u] = "black";
    snap({ line: 17, current: u, edge: null, caption: `Alle naboene til ${u} er behandlet, så ${u} blir svart.` });
  }

  const unreachable = nodes.filter(u => d[u] === Infinity);
  snap({
    line: null, current: null, edge: null,
    caption: unreachable.length
      ? `Køen er tom, og BFS er ferdig. ${unreachable.join(", ")} ble aldri oppdaget, så de har avstand uendelig og ingen forgjenger.`
      : "Køen er tom, og BFS er ferdig. Alle noder kan nås fra startnoden.",
  });
  return frames;
}
