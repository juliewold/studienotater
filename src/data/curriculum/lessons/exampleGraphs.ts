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

/** The CLRS graph of lecture 9 (figure 21.1), with its weights. Both MST algorithms run on it. */
export const mstEdges: [string, string, number][] = [
  ["a", "b", 4], ["a", "h", 8], ["b", "c", 8], ["b", "h", 11], ["c", "d", 7], ["c", "f", 4], ["c", "i", 2],
  ["d", "e", 9], ["d", "f", 14], ["e", "f", 10], ["f", "g", 2], ["g", "h", 1], ["g", "i", 6], ["h", "i", 7],
];
export const mstPositions: Record<string, Point> = {
  a: { x: 50, y: 70 }, b: { x: 150, y: 50 }, c: { x: 270, y: 60 }, d: { x: 400, y: 50 }, e: { x: 530, y: 50 },
  f: { x: 400, y: 170 }, g: { x: 270, y: 200 }, h: { x: 120, y: 190 }, i: { x: 270, y: 120 },
};

/** Bellman-Ford example of lecture 10. The edges are in the order they are relaxed in each pass. */
export const bellmanFordNodes = ["s", "a", "b", "c"];
export const bellmanFordEdges: [string, string, number][] = [["s", "a", 4], ["a", "c", 2], ["s", "b", 5], ["b", "a", -3], ["b", "c", 6]];

/** Huffman example of lecture 7 (frequencies in thousands), in the order the figure lists them. */
export const huffmanFrequencies: [string, number][] = [["a", 45], ["b", 13], ["c", 12], ["d", 16], ["e", 9], ["f", 5]];

/** Dressing example of lecture 8, a DAG: u → v means u must be put on before v. */
export const clothesGraph: Record<string, string[]> = {
  skjorte: ["slips", "belte"], slips: ["jakke"], jakke: [], belte: ["jakke"], klokke: [], truse: ["bukse", "sko"],
  bukse: ["sko", "belte"], sko: [], sokker: ["sko"],
};
export const clothesPositions: Record<string, Point> = {
  truse: { x: 60, y: 34 }, sokker: { x: 200, y: 34 }, skjorte: { x: 370, y: 34 }, klokke: { x: 500, y: 34 },
  bukse: { x: 60, y: 104 }, sko: { x: 200, y: 104 }, slips: { x: 350, y: 104 }, belte: { x: 130, y: 172 }, jakke: { x: 280, y: 172 },
};
