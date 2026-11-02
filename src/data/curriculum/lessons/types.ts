import type { ComponentType } from "react";
import type { CurriculumLink } from "../types";

/** Inline text supports $math$, **bold** and `code`. */
export type LessonText = string;

export type LessonBlock =
  | { type: "text"; text: LessonText }
  | { type: "list"; items: LessonText[]; ordered?: boolean }
  | { type: "box"; variant: "definition" | "theorem" | "tip" | "pitfall"; title?: string; blocks: LessonBlock[] }
  /** Display formula. A `name` adds it to the formula collection. */
  | { type: "formula"; latex: string; name?: string; caption?: LessonText }
  | { type: "pseudocode"; title: string; lines: string[]; caption?: LessonText }
  | { type: "table"; head: LessonText[]; rows: LessonText[][]; caption?: LessonText }
  /** Figures are drawn as inline SVG so they follow the theme and need no storage. */
  | { type: "figure"; component: ComponentType; caption: LessonText }
  | { type: "example"; title: LessonText; blocks: LessonBlock[]; open?: boolean }
  /** A question with a hidden answer, for self-testing. */
  | { type: "quiz"; items: { question: LessonText; answer: LessonText }[] };

export type LessonSection = { id: string; title: string; blocks: LessonBlock[] };

export type LessonSource = CurriculumLink & { kind: "drive" | "note" };

/** A reviewed, self-contained learning note for one pensum unit. */
export type Lesson = {
  subjectId: string;
  unitId: string;
  /** Date the content was last reviewed against the sources (YYYY-MM-DD). */
  reviewed: string;
  summary: LessonText;
  /** The essentials for exam revision, shown first. */
  overview: LessonText[];
  /** The few formulas to know by heart, shown with the overview. */
  keyFormulas: { latex: string; label: LessonText }[];
  goals: LessonText[];
  /** Slugs of existing concept pages that belong to this unit. */
  concepts: string[];
  /** Current notes for this unit (slug and title), instead of every linked note. */
  notes: { slug: string; label: string }[];
  sources: LessonSource[];
  sections: LessonSection[];
};
