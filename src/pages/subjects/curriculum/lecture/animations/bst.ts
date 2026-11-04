// Step-by-step trace of Tree-Insert(T, z) from lecture 5, inserting a sequence of keys into a binary search
// tree. Every comparison is a step: the pointer x walks down the tree, y is the node it came from, and the
// new node is attached at the end. The tree is shown as it grows.

export type BstNode = { key: number; left?: number; right?: number };

export type BstFrame = {
  caption: string;
  /** Index into the lines of Tree-Insert(T, z). */
  line: number | null;
  /** The tree, as a map from key to the node's children (keys). */
  nodes: Record<number, BstNode>;
  root: number | null;
  /** The pointer x and the parent y while walking down, and the key being inserted. */
  x: number | null;
  y: number | null;
  z: number | null;
  /** The key that was attached in this step, if any. */
  attached: number | null;
};

export function traceTreeInsert(keys: number[] = [15, 6, 18, 3, 7, 13, 17]): BstFrame[] {
  const nodes: Record<number, BstNode> = {};
  let root: number | null = null;
  const frames: BstFrame[] = [];
  const snap = (frame: Pick<BstFrame, "caption" | "line" | "x" | "y" | "z" | "attached">) =>
    frames.push({ ...frame, nodes: JSON.parse(JSON.stringify(nodes)), root });

  for (const z of keys) {
    snap({ line: 0, x: root, y: null, z, attached: null, caption: root === null
      ? `Vi setter inn ${z}. Treet er tomt, så ${z} blir roten.`
      : `Vi setter inn ${z}. Vi starter i roten ${root} og går nedover.` });
    let x = root, y: number | null = null;
    while (x !== null) {
      y = x;
      const goLeft = z < x;
      snap({ line: goLeft ? 4 : 6, x, y, z, attached: null, caption: goLeft
        ? `${z} er mindre enn ${x}, så vi går til venstre barn av ${x}.`
        : `${z} er større enn eller lik ${x}, så vi går til høyre barn av ${x}.` });
      const next: number | undefined = goLeft ? nodes[x].left : nodes[x].right;
      x = next ?? null;
      if (x === null) {
        // The pointer falls off the tree: the new node will be attached to y.
        snap({ line: 7, x: null, y, z, attached: null, caption: `Vi kommer til en tom plass under ${y}. ${z} skal inn der.` });
      }
    }
    nodes[z] = { key: z };
    if (y === null) {
      root = z;
      snap({ line: 9, x: null, y: null, z, attached: z, caption: `Treet var tomt, så ${z} er nå roten.` });
    } else if (z < y) {
      nodes[y].left = z;
      snap({ line: 11, x: null, y, z, attached: z, caption: `${z} er mindre enn ${y}, så den settes som venstre barn av ${y}.` });
    } else {
      nodes[y].right = z;
      snap({ line: 12, x: null, y, z, attached: z, caption: `${z} er større enn eller lik ${y}, så den settes som høyre barn av ${y}.` });
    }
  }
  const inorder: number[] = [];
  const walk = (key: number | undefined | null) => { if (key === undefined || key === null) return; walk(nodes[key].left); inorder.push(key); walk(nodes[key].right); };
  walk(root);
  frames.push({ caption: `Alle ${keys.length} nøklene er satt inn. Inorder-gjennomgangen gir ${inorder.join(", ")}, sortert, som en binært søketre skal.`, line: null, nodes: JSON.parse(JSON.stringify(nodes)), root, x: null, y: null, z: null, attached: null });
  return frames;
}
