import type { ComponentType } from "react";
import type { LessonBlock } from "../../../../../data/curriculum/lessons/types";
import { InsertionSortView } from "./InsertionSortView";
import { insertionSortSteps } from "./insertionSort";
import { traceBfs } from "./bfs";
import { traceDfs } from "./dfs";
import { traceDijkstra } from "./dijkstra";
import { BfsView, DfsView, DijkstraView, TopoView } from "./GraphViews";
import { traceBellmanFord } from "./bellmanFord";
import { traceKruskal } from "./kruskal";
import { tracePrim } from "./prim";
import { traceHuffman } from "./huffman";
import { traceTopo } from "./topo";
import { KruskalView, PrimView } from "./MstViews";
import { HuffmanView } from "./HuffmanView";
import { HeapsortView, MergeSortView, PartitionView } from "./ArrayViews";
import { CountingSortView, KnapsackView, LcsView } from "./TableViews";
import { ActivityView, DisjointSetsView, GaleShapleyView } from "./StructureViews";
import { RodView } from "./TableViews";
import { TreeInsertView } from "./TreeViews";
import { ChainingView, DoublingView, FractionalView, HeapInsertView, IncreaseKeyView, RadixView, BucketView, RandomizedSelectView, SelectView } from "./DataViews";
import { traceChaining, traceDoubling } from "./hashing";
import { traceRadix, traceBucket } from "./radixBucket";
import { traceRandomizedSelect, traceSelect } from "./select";
import { traceHeapInsert, traceIncreaseKey } from "./heapInsert";
import { traceFractional } from "./fractional";
import { traceScc } from "./scc";
import { traceDag } from "./dag";
import { BellmanFordView, DagView, SccView } from "./GraphViews";
import { HashChainingFigure } from "../../../../../data/curriculum/lessons/tdt4120/figures02a";
import { traceRodCutting } from "./rodCutting";
import { traceTreeInsert } from "./bst";
import { traceLcs } from "./lcs";
import { traceKnapsack } from "./knapsack";
import { traceCountingSort } from "./countingSort";
import { traceDisjointSets } from "./disjointSets";
import { traceGaleShapley } from "./galeShapley";
import { traceActivities } from "./activitySelection";
import { traceMergeSort } from "./mergeSort";
import { tracePartition } from "./partition";
import { traceHeapsort } from "./heapsort";

// Algorithm animations for the lecture player. An animation is attached automatically after
// the pseudocode block it matches, so lessons need no changes. To add one: write a step
// function (pure data, one caption per step) and a view that draws a step, then register it here.

export type AnimationStep = { caption: string };
export type AnimationViewProps = { block: LessonBlock; step: number };

export type LectureAnimation = {
  id: string;
  title: string;
  matches: (block: LessonBlock) => boolean;
  steps: (block: LessonBlock) => AnimationStep[];
  View: ComponentType<AnimationViewProps>;
};

const pseudocodeTitled = (pattern: RegExp) => (block: LessonBlock) => block.type === "pseudocode" && pattern.test(block.title);

export const lectureAnimations: LectureAnimation[] = [
  { id: "insertion-sort", title: "Insertion-Sort steg for steg", matches: pseudocodeTitled(/^insertion-sort\b/i), steps: () => insertionSortSteps(), View: InsertionSortView },
  { id: "bfs", title: "BFS steg for steg", matches: pseudocodeTitled(/^BFS\(/), steps: () => traceBfs().map(({ caption }) => ({ caption })), View: BfsView },
  // DFS-Visit holds the recursive work; the outer loop of DFS(G) is explained in the first steps.
  { id: "dfs", title: "DFS steg for steg", matches: pseudocodeTitled(/^DFS-Visit\(/), steps: () => traceDfs().map(({ caption }) => ({ caption })), View: DfsView },
  { id: "dijkstra", title: "Dijkstra steg for steg", matches: pseudocodeTitled(/^Dijkstra\(/), steps: () => traceDijkstra().map(({ caption }) => ({ caption })), View: DijkstraView },
  { id: "kruskal", title: "MST-Kruskal steg for steg", matches: pseudocodeTitled(/^MST-Kruskal\(/), steps: () => traceKruskal().map(({ caption }) => ({ caption })), View: KruskalView },
  { id: "prim", title: "MST-Prim steg for steg", matches: pseudocodeTitled(/^MST-Prim\(/), steps: () => tracePrim().map(({ caption }) => ({ caption })), View: PrimView },
  { id: "bellman-ford", title: "Bellman-Ford steg for steg", matches: pseudocodeTitled(/^Bellman-Ford\(/), steps: () => traceBellmanFord().map(({ caption }) => ({ caption })), View: BellmanFordView },
  { id: "huffman", title: "Huffman-koding steg for steg", matches: pseudocodeTitled(/^Huffman\(/), steps: () => traceHuffman().map(({ caption }) => ({ caption })), View: HuffmanView },
  { id: "merge-sort", title: "Merge-Sort steg for steg", matches: pseudocodeTitled(/^Merge-Sort\(/), steps: () => traceMergeSort().map(({ caption }) => ({ caption })), View: MergeSortView },
  { id: "partition", title: "Partition steg for steg", matches: pseudocodeTitled(/^Partition\(/), steps: () => tracePartition().map(({ caption }) => ({ caption })), View: PartitionView },
  { id: "heapsort", title: "Heapsort steg for steg", matches: pseudocodeTitled(/^Heapsort\(/), steps: () => traceHeapsort().map(({ caption }) => ({ caption })), View: HeapsortView },
  { id: "lcs", title: "LCS steg for steg", matches: pseudocodeTitled(/^LCS-Length\(/), steps: () => traceLcs().map(({ caption }) => ({ caption })), View: LcsView },
  { id: "knapsack", title: "Ryggsekkproblemet steg for steg", matches: pseudocodeTitled(/^Knapsack\u2032\(/), steps: () => traceKnapsack().map(({ caption }) => ({ caption })), View: KnapsackView },
  { id: "counting-sort", title: "Counting-Sort steg for steg", matches: pseudocodeTitled(/^Counting-Sort\(/), steps: () => traceCountingSort().map(({ caption }) => ({ caption })), View: CountingSortView },
  { id: "disjoint-sets", title: "Disjunkte mengder steg for steg", matches: pseudocodeTitled(/^Skog-implementasjonen\b/), steps: () => traceDisjointSets().map(({ caption }) => ({ caption })), View: DisjointSetsView },
  { id: "gale-shapley", title: "Gale-Shapley steg for steg", matches: pseudocodeTitled(/^Gale-Shapley\(/), steps: () => traceGaleShapley().map(({ caption }) => ({ caption })), View: GaleShapleyView },
  { id: "activity-selection", title: "Aktivitetsutvalg steg for steg", matches: pseudocodeTitled(/^Greedy-Activity-Selector\(/), steps: () => traceActivities().map(({ caption }) => ({ caption })), View: ActivityView },
  { id: "rod-cutting", title: "Stangkutting steg for steg", matches: pseudocodeTitled(/^Extended-Bottom-Up-Cut-Rod\(/), steps: () => traceRodCutting().map(({ caption }) => ({ caption })), View: RodView },
  { id: "tree-insert", title: "Innsetting i binært søketre steg for steg", matches: pseudocodeTitled(/^Tree-Insert\(/), steps: () => traceTreeInsert().map(({ caption }) => ({ caption })), View: TreeInsertView },
  // Chaining has no pseudocode in the lesson, so its animation follows the figure of the hash table.
  { id: "hash-chaining", title: "Hashtabell med kjeding steg for steg", matches: block => block.type === "figure" && block.component === HashChainingFigure, steps: () => traceChaining().map(({ caption }) => ({ caption })), View: ChainingView },
  { id: "table-doubling", title: "Tabelldobling steg for steg", matches: pseudocodeTitled(/^Table-Insert\(/), steps: () => traceDoubling().map(({ caption }) => ({ caption })), View: DoublingView },
  { id: "radix-sort", title: "Radix-Sort steg for steg", matches: pseudocodeTitled(/^Radix-Sort\(/), steps: () => traceRadix().map(({ caption }) => ({ caption })), View: RadixView },
  { id: "bucket-sort", title: "Bucket-Sort steg for steg", matches: pseudocodeTitled(/^Bucket-Sort\(/), steps: () => traceBucket().map(({ caption }) => ({ caption })), View: BucketView },
  { id: "randomized-select", title: "Randomized-Select steg for steg", matches: pseudocodeTitled(/^Randomized-Select\(/), steps: () => traceRandomizedSelect().map(({ caption }) => ({ caption })), View: RandomizedSelectView },
  { id: "select", title: "Select steg for steg", matches: pseudocodeTitled(/^Select\(/), steps: () => traceSelect().map(({ caption }) => ({ caption })), View: SelectView },
  { id: "max-heap-increase-key", title: "Max-Heap-Increase-Key steg for steg", matches: pseudocodeTitled(/^Max-Heap-Increase-Key\(/), steps: () => traceIncreaseKey().map(({ caption }) => ({ caption })), View: IncreaseKeyView },
  { id: "max-heap-insert", title: "Max-Heap-Insert steg for steg", matches: pseudocodeTitled(/^Max-Heap-Insert\(/), steps: () => traceHeapInsert().map(({ caption }) => ({ caption })), View: HeapInsertView },
  { id: "fractional-knapsack", title: "Fractional Knapsack steg for steg", matches: pseudocodeTitled(/^Fractional-Knapsack\(/), steps: () => traceFractional().map(({ caption }) => ({ caption })), View: FractionalView },
  { id: "scc", title: "Sterke komponenter steg for steg", matches: pseudocodeTitled(/^Strongly-Connected-Components\(/), steps: () => traceScc().map(({ caption }) => ({ caption })), View: SccView },
  { id: "dag-shortest-paths", title: "DAG-Shortest-Paths steg for steg", matches: pseudocodeTitled(/^DAG-Shortest-Paths\(/), steps: () => traceDag().map(({ caption }) => ({ caption })), View: DagView },
  // The DFS steps of the ordering, with the list growing each time a vertex is finished.
  { id: "topological-sort", title: "Topologisk sortering steg for steg", matches: pseudocodeTitled(/^Topological-Sort\(/), steps: () => traceTopo().map(({ caption }) => ({ caption })), View: TopoView },
];

export const findAnimation = (block: LessonBlock) => lectureAnimations.find(animation => animation.matches(block));
export const animationById = (id: string) => lectureAnimations.find(animation => animation.id === id);
