import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { Node } from "@tiptap/pm/model";

export function getNoteHeadings(doc: Node, outlineId: string) {
  const headings: { id: string; text: string; level: number; position: number }[] = [];
  doc.descendants((node, position) => {
    if (node.type.name === "heading" && node.textContent.trim()) {
      headings.push({
        id: `${outlineId}-heading-${headings.length}`,
        text: node.textContent,
        level: node.attrs.level,
        position,
      });
    }
  });
  return headings;
}

// Decorations stay out of saved HTML/JSON and follow every editor transaction.
export function createHeadingAnchors(outlineId: string) {
  return Extension.create({
    name: "noteHeadingAnchors",
    addProseMirrorPlugins: () => [new Plugin({
      props: {
        decorations: ({ doc }) => DecorationSet.create(doc,
          getNoteHeadings(doc, outlineId).map(heading => Decoration.node(
            heading.position,
            heading.position + doc.nodeAt(heading.position)!.nodeSize,
            { id: heading.id, tabindex: "-1" },
          )),
        ),
      },
    })],
  });
}
