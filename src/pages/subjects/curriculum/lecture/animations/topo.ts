import { clothesGraph } from "../../../../../data/curriculum/lessons/exampleGraphs";
import { traceDfs, type DfsFrame } from "./dfs";

// Step-by-step trace of Topological-Sort(G) from lecture 8: DFS runs as usual, and each vertex is
// put at the front of a linked list when it is finished. The list is shown growing.

export type TopoFrame = DfsFrame & { list: string[] };

export function traceTopo(adj: Record<string, string[]> = clothesGraph): TopoFrame[] {
  const list: string[] = [];
  return traceDfs(adj).map((frame): TopoFrame => {
    // Finishing a vertex is the DFS-Visit line that sets u.f; then u goes to the front of the list.
    if (frame.line === 9 && frame.current) {
      list.unshift(frame.current);
      return { ...frame, line: 1, list: [...list], caption: `${frame.caption} ${frame.current} settes først i listen.` };
    }
    // The last frame of DFS is the end of the loop: the list is what the algorithm returns.
    if (frame.line === null && frame.current === null && frame.time > 0) {
      return { ...frame, line: 2, list: [...list], caption: `DFS er ferdig, og listen er den topologiske sorteringen: ${list.join(", ")}. Hver kant peker mot høyre.` };
    }
    return { ...frame, line: 0, list: [...list] };
  });
}
