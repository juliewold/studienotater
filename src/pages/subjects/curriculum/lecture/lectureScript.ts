import type { Lesson, LessonBlock, LessonText } from "../../../../data/curriculum/lessons/types";
import { figureParts } from "../../../../data/curriculum/lessons/reveal";
import { findAnimation } from "./animations";
import { chunkText, latexToSpeech, splitSentences, toSpeech } from "./speechText";

// Builds a lecture from a reviewed lesson: one concept per scene, revealed one part at a
// time, so the narration always matches what is on screen. Nothing is fetched; the
// lesson that the topic page has already loaded is the only input.

export type LecturePart =
  | { kind: "block"; block: LessonBlock; say: string; pause?: number }
  | { kind: "text"; text: LessonText; say: string; pause?: number }
  | { kind: "item"; text: LessonText; ordered: boolean; number: number; say: string; pause?: number }
  | { kind: "row"; cells: LessonText[]; say: string; pause?: number }
  | { kind: "frame"; step: number; say: string; pause?: number }
  /**
   * One step of a figure, code block or formula that is built up. `source` is the whole
   * block, which ties its steps together; `block` is what is drawn at this step, and
   * `reveal` how many of the figure's parts or code lines are visible. Empty `say` means silent.
   */
  | { kind: "visual"; source: LessonBlock; block: LessonBlock; reveal: number; say: string; pause?: number };

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
// A figure or code block is built up in at most this many steps.
const MAX_BUILD_STEPS = 5;

/**
 * Builds a figure or code block step by step. Each step reveals the next share of it while the
 * matching sentences of the explanation are read, so what appears is what is being explained.
 * Steps without a sentence are silent.
 */
function buildSteps(source: LessonBlock, total: number, narration: string, pause: number): LecturePart[] {
  const sentences = splitSentences(narration);
  const steps = Math.max(1, Math.min(total, MAX_BUILD_STEPS, Math.max(2, sentences.length)));
  const perStep = Math.ceil(sentences.length / steps);
  // The caption under the figure is written out as it is explained, and in full at the last step.
  const caption = source.type === "figure" || source.type === "pseudocode" ? source.caption : undefined;
  const captionSentences = caption ? splitSentences(caption) : [];
  const withCaption = (text: string): LessonBlock => source.type === "figure" || source.type === "pseudocode" ? { ...source, caption: text } : source;
  return Array.from({ length: steps }, (_, step) => {
    const last = step === steps - 1;
    return {
      kind: "visual" as const,
      source,
      block: caption === undefined ? source : withCaption(last ? caption : captionSentences.slice(0, (step + 1) * perStep).join(" ")),
      reveal: Math.ceil(((step + 1) * total) / steps),
      say: sentences.slice(step * perStep, (step + 1) * perStep).join(" "),
      pause: last ? pause : undefined,
    };
  });
}

/**
 * A formula with an aligned derivation appears one line at a time, and each line is read as it
 * comes. Other formulas stay whole. `lead` is the frame announcement, spoken with the first line.
 */
function formulaParts(block: Extract<LessonBlock, { type: "formula" }>, lead: string): LecturePart[] {
  const body = block.latex.trim().match(/^\\begin\{aligned\}([\s\S]*)\\end\{aligned\}$/)?.[1];
  const lines = body?.split("\\\\").map(line => line.trim()).filter(Boolean) ?? [];
  if (lines.length < 2) return [{ kind: "block", block, say: say(lead, narrate(block)) }];
  return lines.map((line, index) => {
    const last = index === lines.length - 1;
    return {
      kind: "visual" as const,
      source: block,
      block: last ? block : { ...block, latex: `\\begin{aligned} ${lines.slice(0, index + 1).join(" \\\\ ")} \\end{aligned}`, caption: undefined },
      reveal: Infinity,
      say: say(index === 0 ? lead : undefined, index === 0 && block.name ? toSpeech(block.name) : undefined, latexToSpeech(line.replace(/&/g, " ")), last && block.caption ? toSpeech(block.caption) : undefined),
    };
  });
}

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

/** Adds the animation that matches a block, if there is one, with one narrated part per step. */
function addAnimation(block: LessonBlock, add: Add) {
  const animation = findAnimation(block);
  if (!animation) return;
  add({
    kind: "animation", heading: animation.title, animation: { id: animation.id, block },
    parts: animation.steps(block).map((step, stepIndex) => ({ kind: "frame", step: stepIndex, say: toSpeech(step.caption) })),
  });
}

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
      case "formula": {
        const steps = formulaParts(block, announce);
        // The lines of one derivation stay in one scene.
        if (parts.length + steps.length > MAX_PARTS) flush();
        parts.push(...steps);
        announce = "";
        break;
      }
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
        add({ kind: "figure", heading, frame, parts: buildSteps(block, figureParts(block.component), `${announce ? `${announce} ` : ""}${narrate(block)}`, 1200) });
        announce = "";
        // A figure can also have an animation of its own, for a process that has no pseudocode in the lesson.
        addAnimation(block, add);
        break;
      case "pseudocode": {
        flush();
        add({ kind: "content", heading, frame, parts: buildSteps(block, block.lines.length, `${announce ? `${announce} ` : ""}${narrate(block)}`, 800) });
        announce = "";
        addAnimation(block, add);
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
