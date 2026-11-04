// Step-by-step trace of disjoint sets in the forest implementation of lecture 9 (union by rank and path
// compression), on the example of the figure: Make-Set on 1 to 4, Union(1, 2), Union(3, 4), Union(1, 3),
// then Find-Set(1). Every pointer change is shown, so the structure can be followed.

export type DisjointFrame = {
  caption: string;
  /** Index into the lines of the forest implementation (Make-Set, Find-Set, Link, Union). */
  line: number | null;
  /** The parent pointer x.p and the rank of every node. */
  parent: Record<number, number>;
  rank: Record<number, number>;
  /** The node being worked on, the nodes on the Find-Set path, and the nodes whose pointer changed. */
  current: number | null;
  path: number[];
  changed: number[];
};

export function traceDisjointSets(nodes = [1, 2, 3, 4]): DisjointFrame[] {
  const parent: Record<number, number> = {};
  const rank: Record<number, number> = {};
  const frames: DisjointFrame[] = [];
  const snap = (frame: Pick<DisjointFrame, "caption" | "line" | "current" | "path" | "changed">) =>
    frames.push({ ...frame, parent: { ...parent }, rank: { ...rank } });

  // Find-Set(x), with path compression. Returns the root, and shows the path before it is compressed.
  const find = (x: number): number => {
    const path: number[] = [];
    let y = x;
    while (parent[y] !== y) { path.push(y); y = parent[y]; }
    const root = y;
    // Captions are read aloud, so the path is written with commas rather than arrows.
    const route = [...path, root].join(", ");
    snap({ line: 3, current: x, path: [...path, root], changed: [], caption: path.length
      ? `Find-Set(${x}) følger pekerne ${route}. Roten er ${root}.`
      : `Find-Set(${x}): ${x} peker på seg selv, så ${x} er roten.` });
    const changed = path.filter(v => parent[v] !== root);
    for (const v of path) parent[v] = root;
    if (changed.length) {
      snap({ line: 5, current: x, path: [...path, root], changed, caption: `Stikomprimering: alle nodene på stien får root ${root} som forgjenger, så ${changed.join(" og ")} peker nå direkte på roten.` });
    }
    return root;
  };

  // Link(x, y) for two roots: union by rank, so the root of the smaller tree goes under the other.
  const link = (x: number, y: number) => {
    if (rank[x] > rank[y]) {
      parent[y] = x;
      snap({ line: 9, current: y, path: [], changed: [y], caption: `Rangen til ${x} er ${rank[x]}, og rangen til ${y} er ${rank[y]}. Den lavere roten ${y} blir barn av ${x}.` });
    } else {
      parent[x] = y;
      const equal = rank[x] === rank[y];
      if (equal) rank[y]++;
      snap({ line: 10, current: x, path: [], changed: [x], caption: equal
        ? `Rangene er like, så ${x} blir barn av ${y}, og rangen til ${y} øker til ${rank[y]}.`
        : `Rangen til ${x} er lavere enn til ${y}, så ${x} blir barn av ${y}.` });
    }
  };

  const union = (x: number, y: number) => {
    const rx = find(x), ry = find(y);
    snap({ line: 14, current: x, path: [], changed: [], caption: `Union(${x}, ${y}): de to rotene er ${rx} og ${ry}. Nå kobler vi dem sammen.` });
    if (rx !== ry) link(rx, ry);
    else snap({ line: 14, current: x, path: [], changed: [], caption: `${x} og ${y} er allerede i samme mengde, så det skjer ingenting.` });
  };

  for (const x of nodes) {
    parent[x] = x;
    rank[x] = 0;
    snap({ line: 0, current: x, path: [], changed: [], caption: `Make-Set(${x}): ${x} blir en egen mengde med seg selv som rot og rang 0.` });
  }
  union(1, 2);
  union(3, 4);
  union(1, 3);
  find(1);
  let root = 1;
  while (parent[root] !== root) root = parent[root];
  snap({ line: null, current: null, path: [], changed: [], caption: `Alle nodene er nå i én mengde med rot ${root}. Rangen til roten er ${rank[root]}, og den er en øvre grense for høyden.` });
  return frames;
}
