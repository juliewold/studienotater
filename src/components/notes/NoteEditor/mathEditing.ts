import { closeHistory } from "@tiptap/pm/history";
import type { Editor, JSONContent } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import { NodeSelection } from "@tiptap/pm/state";
export type MathTarget = { from: number; to: number; latex: string; block: boolean; attrs: Record<string, unknown>; doc: Node };
export function getMathTarget(editor: Editor, position?: number): MathTarget {
  const { doc, selection } = editor.state;
  let from = position ?? selection.from;
  let node = position !== undefined ? doc.nodeAt(position) : selection instanceof NodeSelection ? selection.node : null;
  if (!node && selection.$from.parent.type.name === "codeBlock" && selection.$from.sameParent(selection.$to)) {
    from = selection.$from.before(); node = selection.$from.parent;
  }
  if (node && ["codeBlock", "inlineMath", "blockMath"].includes(node.type.name)) {
    return { from, to: from + node.nodeSize, latex: node.type.name === "codeBlock" ? node.textContent : node.attrs.latex,
      block: node.isBlock, attrs: node.type.name === "codeBlock" ? {} : { ...node.attrs }, doc };
  }
  return { from: selection.from, to: selection.to, latex: doc.textBetween(selection.from, selection.to, "\n"), block: false, attrs: {}, doc };
}
export function applyMathEdit(editor: Editor, target: MathTarget, type: "inline" | "block", latex: string): boolean {
  // The dialog must never replace unrelated content after an external update.
  if (!editor.state.doc.eq(target.doc)) return false;
  const math: JSONContent = { type: type === "block" ? "blockMath" : "inlineMath", attrs: { ...target.attrs, latex } };
  const content = type === "inline" && target.block ? { type: "paragraph", content: [math] } : math;
  editor.view.dispatch(closeHistory(editor.state.tr));
  return editor.chain().focus().insertContentAt({ from: target.from, to: target.to }, content).run();
}
