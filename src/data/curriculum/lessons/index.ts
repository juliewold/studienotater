import type { Lesson, LessonBlock } from "./types";

// Lessons are separate chunks, loaded only when a topic page or the formula collection needs them.
const modules = import.meta.glob<{ lesson: Lesson }>("./*/*.ts");
const path = (subjectId: string, unitId: string) => `./${subjectId}/${unitId}.ts`;

export const hasLesson = (subjectId: string, unitId: string) => path(subjectId, unitId) in modules;

export async function loadLesson(subjectId: string, unitId: string): Promise<Lesson | undefined> {
  const load = modules[path(subjectId, unitId)];
  return load ? (await load()).lesson : undefined;
}

export async function loadSubjectLessons(subjectId: string): Promise<Lesson[]> {
  const loaders = Object.entries(modules).filter(([key]) => key.startsWith(`./${subjectId}/`));
  return Promise.all(loaders.map(async ([, load]) => (await load()).lesson));
}

export type LessonFormula = { key: string; latex: string; name: string; caption?: string; sectionId: string; sectionTitle: string };

/** Named formulas in reading order, including those inside boxes and examples. */
export function lessonFormulas(lesson: Lesson): LessonFormula[] {
  const result: LessonFormula[] = [];
  const visit = (blocks: LessonBlock[], sectionId: string, sectionTitle: string) => {
    for (const block of blocks) {
      if (block.type === "formula" && block.name) result.push({
        key: block.latex.replace(/\s+/g, ""), latex: block.latex, name: block.name, caption: block.caption, sectionId, sectionTitle,
      });
      if (block.type === "box" || block.type === "example") visit(block.blocks, sectionId, sectionTitle);
    }
  };
  lesson.sections.forEach(section => visit(section.blocks, section.id, section.title));
  return result;
}
