import { sccGraph } from "../../../../../data/curriculum/lessons/exampleGraphs";
import { traceDfs, type DfsFrame } from "./dfs";

// Step-by-step trace of Strongly-Connected-Components(G) from lecture 8 (Kosaraju, CLRS 20.5), on the
// example of the figure. First a DFS on G gives finish times. Then the edges are reversed, and a DFS on the
// reversed graph starts from the vertices with the largest finish time first. Each tree of that second DFS
// is one strongly connected component.

export type SccFrame = DfsFrame & {
  /** 1 for the DFS on G, 2 for the DFS on the reversed graph. */
  phase: 1 | 2;
  /** The graph the frame is drawn on: G, or the reversed graph in phase 2. */
  edges: Record<string, string[]>;
  /** Components found so far, each a list of vertices. */
  components: string[][];
};

const spell = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} og ${items.at(-1)}`);

/** The graph with every edge reversed, as in line 2 of the algorithm. */
export function reverseGraph(adj: Record<string, string[]>): Record<string, string[]> {
  const result: Record<string, string[]> = Object.fromEntries(Object.keys(adj).map(u => [u, []]));
  for (const [u, vs] of Object.entries(adj)) for (const v of vs) result[v].push(u);
  return result;
}

export function traceScc(adj: Record<string, string[]> = sccGraph): SccFrame[] {
  const first = traceDfs(adj);
  const finish = first.at(-1)!.f;
  const byFinish = Object.keys(adj).sort((a, b) => finish[b] - finish[a]);
  const reversed = reverseGraph(adj);
  const second = traceDfs(reversed, byFinish);
  const frames: SccFrame[] = [];
  const components: string[][] = [];

  first.forEach((frame, index) => {
    frames.push({ ...frame, line: 0, phase: 1, edges: adj, components: [], caption: index === 0 ? `Første DFS, på den opprinnelige grafen, finner ferdigtidene. ${frame.caption}` : frame.caption });
  });
  frames.push({ ...second[0], line: 1, phase: 2, edges: reversed, components: [], current: null, edge: null, kind: null, caption: `Vi snur alle kantene, så vi får den omvendte grafen. Den andre DFS-en starter i nodene med størst ferdigtid først: ${byFinish.join(", ")}.`, color: Object.fromEntries(Object.keys(adj).map(u => [u, "white"])), d: {}, f: {}, pi: {}, time: 0, stack: [] });

  second.forEach(frame => {
    frames.push({ ...frame, line: 2, phase: 2, edges: reversed, components: [...components], caption: frame.caption });
    // A tree of the second DFS ends when its root finishes with nothing else on the stack: that is one component.
    const root = frame.current;
    if (frame.line === 9 && root !== null && frame.stack.length === 0) {
      const members = Object.keys(adj).filter(v => frame.d[v] !== undefined && frame.d[v] >= frame.d[root] && frame.d[v] <= frame.f[root]
        && !components.some(component => component.includes(v)));
      components.push(members);
      frames.push({ ...frame, line: 3, phase: 2, edges: reversed, components: [...components], current: null, edge: null, kind: null,
        caption: `Alle nodene som ble besøkt fra ${root} i denne DFS-en, er en sterk komponent: ${spell(members)}. Vi har nå ${components.length} komponent${components.length === 1 ? "" : "er"}.` });
    }
  });
  const last = second.at(-1)!;
  frames.push({ ...last, line: null, phase: 2, edges: reversed, components: [...components], current: null, edge: null, kind: null,
    caption: `Alle nodene er med i en komponent. Komponentene er ${components.map(component => spell(component)).join("; ")}.` });
  return frames;
}
