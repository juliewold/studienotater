import type { ComponentType } from "react";
import type { LessonBlock } from "../../../../../data/curriculum/lessons/types";
import { InsertionSortView } from "./InsertionSortView";
import { insertionSortSteps } from "./insertionSort";
import { traceBfs } from "./bfs";
import { traceDfs } from "./dfs";
import { traceDijkstra } from "./dijkstra";
import { BfsView, DfsView, DijkstraView } from "./GraphViews";

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
];

export const findAnimation = (block: LessonBlock) => lectureAnimations.find(animation => animation.matches(block));
export const animationById = (id: string) => lectureAnimations.find(animation => animation.id === id);
