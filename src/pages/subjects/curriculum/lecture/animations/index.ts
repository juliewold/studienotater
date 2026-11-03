import type { ComponentType } from "react";
import type { LessonBlock } from "../../../../../data/curriculum/lessons/types";
import { InsertionSortView } from "./InsertionSortView";
import { insertionSortSteps } from "./insertionSort";

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
];

export const findAnimation = (block: LessonBlock) => lectureAnimations.find(animation => animation.matches(block));
export const animationById = (id: string) => lectureAnimations.find(animation => animation.id === id);
