// The example graphs of lectures 8 and 10. Figures and lecture animations both draw from here,
// so the traversal in the animation is the one the figure shows.

export type Point = { x: number; y: number };

/** Directed graph as adjacency lists, in the order the algorithms visit them. */
export const traversalGraph: Record<string, string[]> = {
  1: ["2", "3"], 2: ["4", "5"], 3: ["5", "6"], 4: ["7"], 5: ["7"], 6: ["8"], 7: ["8"], 8: ["3"], 9: ["6"],
};
export const traversalPositions: Record<string, Point> = {
  1: { x: 45, y: 130 }, 2: { x: 150, y: 65 }, 3: { x: 150, y: 195 }, 4: { x: 260, y: 35 }, 5: { x: 260, y: 130 },
  6: { x: 260, y: 230 }, 7: { x: 370, y: 80 }, 8: { x: 370, y: 190 }, 9: { x: 470, y: 230 },
};

/** Weighted directed graph for Dijkstra. Edges are listed in the order they are relaxed. */
export const shortestPathNodes = ["s", "a", "b", "c", "d"];
export const shortestPathEdges: [string, string, number][] = [
  ["s", "a", 10], ["s", "b", 5], ["b", "a", 3], ["b", "c", 2], ["a", "c", 1], ["c", "d", 4], ["b", "d", 9],
];
export const shortestPathPositions: Record<string, Point> = {
  s: { x: 40, y: 120 }, b: { x: 130, y: 50 }, a: { x: 130, y: 190 }, c: { x: 220, y: 120 }, d: { x: 220, y: 240 },
};
