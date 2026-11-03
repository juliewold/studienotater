import type { Lesson, LessonBlock, LessonText } from "../../../../data/curriculum/lessons/types";
import { findAnimation } from "./animations";
import { chunkText, latexToSpeech, toSpeech } from "./speechText";

// Builds a lecture from a reviewed lesson: one concept per scene, revealed one part at a
// time, so the narration always matches what is on screen. Nothing is fetched; the
// lesson that the topic page has already loaded is the only input.

export type LecturePart =
  | { kind: "block"; block: LessonBlock; say: string; pause?: number }
  | { kind: "text"; text: LessonText; say: string; pause?: number }
  | { kind: "item"; text: LessonText; ordered: boolean; number: number; say: string; pause?: number }
  | { kind: "row"; cells: LessonText[]; say: string; pause?: number }
  | { kind: "frame"; step: number; say: string; pause?: number };

export type FrameVariant = "definition" | "theorem" | "tip" | "pitfall" | "example" | "quiz";

export type LectureScene = {
  id: string;
  kind: "title" | "chapter" | "content" | "figure" | "animation" | "summary";
  /** Index into `LectureScript.chapters`. */
  chapter: number;
  heading?: LessonText;
  frame?: { variant: FrameVariant; title?: LessonText };
  table?: { head: LessonText[]; caption?: LessonText };
  /** The pseudocode block an animation scene visualises, and the animation id. */
  animation?: { id: string; block: LessonBlock };
  parts: LecturePart[];
};

export type LectureScript = { title: string; chapters: string[]; scenes: LectureScene[] };

const frameNames: Record<FrameVariant, string> = {
  definition: "Definisjon", theorem: "Teorem", tip: "Tips", pitfall: "Felle", example: "Eksempel", quiz: "Test deg selv",
};

const sentence = (text: string) => (text && !/[.!?:]$/.test(text) ? `${text}.` : text);
const say = (...pieces: (string | undefined)[]) => pieces.filter(Boolean).map(piece => sentence(piece!.trim())).join(" ");

/** Narration for a block that is shown as a whole. */
export function narrate(block: LessonBlock): string {
  switch (block.type) {
    case "text": return toSpeech(block.text);
    case "list": return block.items.map(item => sentence(toSpeech(item))).join(" ");
    case "formula": return say(block.name, latexToSpeech(block.latex), block.caption && toSpeech(block.caption));
    case "pseudocode": return say(`Her er pseudokoden for ${block.title.replace(/\s*\(.*\)\s*$/, "")}`, block.caption && toSpeech(block.caption));
    case "figure": return toSpeech(block.caption);
    case "table": return say(block.caption && toSpeech(block.caption), ...block.rows.map(row => rowSpeech(block.head, row)));
    case "box": return say(frameNames[block.variant], block.title && toSpeech(block.title), ...block.blocks.map(narrate));
    case "example": return say(toSpeech(block.title), ...block.blocks.map(narrate));
    case "quiz": return say(...block.items.flatMap(item => [toSpeech(item.question), toSpeech(item.answer)]));
  }
}

const rowSpeech = (head: LessonText[], row: LessonText[]) =>
  row.map((cell, index) => index === 0 ? toSpeech(cell) : `${toSpeech(head[index] ?? "")}: ${toSpeech(cell)}`).join(", ");

/** Text parts are split into short chunks so a paragraph is shown and read a sentence or two at a time. */
const textParts = (text: LessonText): LecturePart[] => chunkText(text).map(chunk => ({ kind: "text", text: chunk, say: toSpeech(chunk) }));

const listParts = (block: Extract<LessonBlock, { type: "list" }>): LecturePart[] =>
  block.items.map((item, index) => ({ kind: "item", text: item, ordered: Boolean(block.ordered), number: index + 1, say: toSpeech(item) }));

// Blocks that need the whole stage get a scene of their own.
const isLarge = (block: LessonBlock) => block.type === "figure" || block.type === "table" || block.type === "pseudocode" || block.type === "quiz";
const leadsIn = (block: LessonBlock) => block.type === "text" && /:\s*$/.test(block.text);
const MAX_PARTS = 6;

export function buildLectureScript(lesson: Lesson, title: string): LectureScript {
  const chapters = ["Introduksjon", ...lesson.sections.map(section => section.title), "Oppsummering"];
  const scenes: LectureScene[] = [];
  let chapter = 0;
  const add = (scene: Omit<LectureScene, "id" | "chapter">) => {
    if (scene.parts.length) scenes.push({ ...scene, chapter, id: `s${scenes.length}` });
  };

  add({ kind: "title", heading: title, parts: textParts(lesson.summary) });
  // Long lists continue on a new scene, so no screen gets crowded.
  const addList = (kind: LectureScene["kind"], heading: string, parts: LecturePart[]) => {
    for (let start = 0; start < parts.length; start += MAX_PARTS) add({ kind, heading: start ? `${heading} (forts.)` : heading, parts: parts.slice(start, start + MAX_PARTS) });
  };
  addList("content", "Læringsmål", lesson.goals.map((goal, index) => ({
    kind: "item", text: goal, ordered: false, number: index + 1, say: index === 0 ? `Etter denne forelesningen skal du kunne: ${toSpeech(goal)}` : toSpeech(goal),
  })));

  lesson.sections.forEach((section, index) => {
    chapter = index + 1;
    add({ kind: "chapter", heading: section.title, parts: [{ kind: "text", text: `Del ${index + 1} av ${lesson.sections.length}`, say: `Del ${index + 1}: ${toSpeech(section.title)}.`, pause: 300 }] });
    emitBlocks(section.blocks, section.title, undefined, add);
  });

  chapter = chapters.length - 1;
  addList("summary", "Det viktigste", lesson.overview.map((point, index) => ({
    kind: "item", text: point, ordered: false, number: index + 1, say: index === 0 ? `La oss oppsummere. ${toSpeech(point)}` : toSpeech(point),
  })));
  addList("summary", "Formler å kunne", lesson.keyFormulas.map(formula => ({
    kind: "block", block: { type: "formula", latex: formula.latex, caption: formula.label }, say: say(toSpeech(formula.label), latexToSpeech(formula.latex)),
  })));
  return { title, chapters, scenes };
}

type Add = (scene: Omit<LectureScene, "id" | "chapter">) => void;

/** Emits the blocks of a section or of a box/example frame as scenes. */
function emitBlocks(blocks: LessonBlock[], heading: string, frame: LectureScene["frame"], add: Add) {
  let parts: LecturePart[] = [];
  let continued = false;
  const flush = () => {
    if (!parts.length) return;
    add({ kind: "content", heading, frame: frame && { ...frame, title: continued && frame.title ? `${frame.title} (forts.)` : frame.title }, parts });
    parts = [];
    if (frame) continued = true;
  };
  // A frame announces itself once, in the narration of its first part.
  let announce = frame ? say(frameNames[frame.variant], frame.title && toSpeech(frame.title)) : "";
  const push = (part: LecturePart) => {
    if (parts.length >= MAX_PARTS) flush();
    parts.push(announce ? { ...part, say: `${announce} ${part.say}` } : part);
    announce = "";
  };

  blocks.forEach((block, index) => {
    const previous = blocks[index - 1];
    // Inside a frame related blocks stay together; at section level each block is its own concept,
    // except a sentence ending in a colon, which introduces the block after it.
    if (!frame && !(previous && leadsIn(previous) && !isLarge(block))) flush();

    switch (block.type) {
      case "text": textParts(block.text).forEach(push); break;
      case "list": listParts(block).forEach(push); break;
      case "formula": push({ kind: "block", block, say: narrate(block) }); break;
      case "box":
      case "example": {
        flush();
        const variant = block.type === "box" ? block.variant : "example";
        // The frame label already says «Eksempel», so a title «Eksempel: …» keeps only the rest.
        const title = block.type === "example" ? block.title.replace(/^eksempel:\s*/i, "") : block.title;
        emitBlocks(block.blocks, heading, { variant, title: title && title[0].toUpperCase() + title.slice(1) }, add);
        announce = "";
        break;
      }
      case "figure":
        flush();
        add({ kind: "figure", heading, frame, parts: [{ kind: "block", block, say: `${announce ? `${announce} ` : ""}${narrate(block)}`, pause: 1200 }] });
        announce = "";
        break;
      case "pseudocode": {
        flush();
        add({ kind: "content", heading, frame, parts: [{ kind: "block", block, say: `${announce ? `${announce} ` : ""}${narrate(block)}`, pause: 800 }] });
        announce = "";
        const animation = findAnimation(block);
        if (animation) add({
          kind: "animation", heading: animation.title, animation: { id: animation.id, block },
          parts: animation.steps(block).map((step, stepIndex) => ({ kind: "frame", step: stepIndex, say: toSpeech(step.caption) })),
        });
        break;
      }
      case "table":
        flush();
        add({ kind: "content", heading, frame, table: { head: block.head, caption: block.caption },
          parts: block.rows.map((row, rowIndex) => ({ kind: "row", cells: row, say: `${rowIndex === 0 && announce ? `${announce} ` : ""}${rowSpeech(block.head, row)}` })) });
        announce = "";
        break;
      case "quiz":
        flush();
        block.items.forEach(item => add({ kind: "content", heading, frame: { variant: "quiz" }, parts: [
          { kind: "text", text: item.question, say: `Test deg selv. ${toSpeech(item.question)} Tenk deg om før svaret kommer.`, pause: 2500 },
          { kind: "text", text: item.answer, say: toSpeech(item.answer), pause: 600 },
        ] }));
        break;
    }
    if (isLarge(block) && frame) continued = true;
  });
  flush();
}

/** Number of narrated steps in the whole lecture. */
export const countSteps = (script: LectureScript) => script.scenes.reduce((sum, scene) => sum + scene.parts.length, 0);
