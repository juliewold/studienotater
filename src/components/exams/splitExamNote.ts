// Deler notatets HTML i oppgavetekst, besvarelse og støtte. Brukes bare når notatet har eksamensbokser.
// Boksene velges etter callout-type, ikke etter tekst. Rekkefølgen i støtten er den samme som i notatet.

export const EXAM_TASK_TYPE = "exam-task";
export const EXAM_LEARNING_TYPE = "exam-learning";
export const EXAM_SUPPORT_TYPES = [
  "exam-signal",
  "exam-book",
  "exam-missing",
  "exam-partial",
  "exam-given",
] as const;

export type ExamNoteSplit = {
  task: string;
  answer: string;
  support: string;
  learning: string;
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function splitExamNoteHtml(html: string): ExamNoteSplit | null {
  // Raskt hopp for vanlige notater, uten å lese HTML.
  if (!html.includes('data-callout-type="exam-')) return null;

  const doc = new DOMParser().parseFromString(html, "text/html");
  const parts = { task: [] as string[], answer: [] as string[], support: [] as string[], learning: [] as string[] };

  for (const node of Array.from(doc.body.childNodes)) {
    const serialized = node instanceof Element ? node.outerHTML : escapeHtml(node.textContent ?? "");
    if (!serialized.trim()) continue;

    const type = node instanceof Element ? node.getAttribute("data-callout-type") : null;

    if (type === EXAM_TASK_TYPE) parts.task.push(serialized);
    else if (type === EXAM_LEARNING_TYPE) parts.learning.push(serialized);
    else if (type && (EXAM_SUPPORT_TYPES as readonly string[]).includes(type)) parts.support.push(serialized);
    else parts.answer.push(serialized);
  }

  // Uten oppgavetekst er ikke notatet en eksamensoppgave, og vises som vanlig.
  if (parts.task.length === 0) return null;

  return {
    task: parts.task.join(""),
    answer: parts.answer.join(""),
    support: parts.support.join(""),
    learning: parts.learning.join(""),
  };
}

export type ExamLearningItem = {
  // Fet innledning i avsnittet, for eksempel «Hvorfor binomisk?». Mangler den, vises avsnittet som vanlig tekst.
  title: string | null;
  text: string;
};

// Teksten med matematikk som $...$, slik MathText viser den. Brukes bare i lesevisningen.
const nodeToMathText = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (!(node instanceof Element)) return "";

  const type = node.getAttribute("data-type");
  if (type === "inline-math" || type === "block-math") {
    const latex = node.getAttribute("data-latex") ?? "";
    return latex ? `$${latex}$` : "";
  }

  if (node.tagName === "BR") return " ";

  return Array.from(node.childNodes).map(nodeToMathText).join("");
};

// Gjør læringsboksen til sammenleggbare punkter. Redigering skjer fortsatt i boksen.
export function learningItemsFromHtml(html: string): ExamLearningItem[] {
  if (!html.trim()) return [];

  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.querySelector(".note-callout-body") ?? doc.body;
  const items: ExamLearningItem[] = [];

  for (const paragraph of Array.from(body.children)) {
    if (paragraph.tagName !== "P") continue;

    const first = paragraph.firstChild;
    const hasTitle = first instanceof Element && first.tagName === "STRONG";

    if (hasTitle) {
      const title = nodeToMathText(first).trim().replace(/:$/, "").trim();
      const rest = Array.from(paragraph.childNodes).slice(1).map(nodeToMathText).join("").trim();
      items.push({ title, text: rest.replace(/^:\s*/, "") });
    } else {
      const text = nodeToMathText(paragraph).trim();
      if (text) items.push({ title: null, text });
    }
  }

  return items;
}
