import { Mark, mergeAttributes } from "@tiptap/core";
import "./examNoteStyles.css";
import type { ExamMarkKind } from "./examMarkKinds";
import { installExamMarkPopover } from "./examMarkPopover";

export { EXAM_MARK_KINDS, examMarkKindLabels, type ExamMarkKind } from "./examMarkKinds";

// Markering i Notater. Typen og forklaringen lagres i notatet, så den kan redigeres i editoren.
// Forklaringsbobla settes opp én gang for hele dokumentet.
if (typeof document !== "undefined") installExamMarkPopover();

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    examMark: {
      setExamMark: (attributes: { kind: ExamMarkKind; explanation: string }) => ReturnType;
      unsetExamMark: () => ReturnType;
    };
  }
}

export const ExamMark = Mark.create({
  name: "examMark",

  inclusive: false,

  addAttributes() {
    return {
      kind: {
        default: "data",
        parseHTML: (element) => element.getAttribute("data-exam-kind") ?? "data",
        renderHTML: (attributes) => ({ "data-exam-kind": attributes.kind }),
      },
      explanation: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-exam-explanation") ?? "",
        renderHTML: (attributes) => ({ "data-exam-explanation": attributes.explanation }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "mark[data-exam-kind]" }];
  },

  renderHTML({ HTMLAttributes, mark }) {
    const kind = (mark.attrs.kind as string) || "data";
    return [
      "mark",
      mergeAttributes(HTMLAttributes, { class: `exam-mark exam-mark-${kind}` }),
      0,
    ];
  },

  addCommands() {
    return {
      setExamMark:
        (attributes) =>
        ({ commands }) =>
          commands.setMark(this.name, attributes),
      unsetExamMark:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
