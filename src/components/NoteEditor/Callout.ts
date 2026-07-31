import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { CalloutNodeView } from "./CalloutNodeView";

export type CalloutType = "definition" | "tip" | "theorem" | "example" | "exam";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      insertCallout: (type: CalloutType) => ReturnType;
      deleteCallout: () => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: "callout",

  group: "block",

  content: "block+",

  defining: true,

  isolating: true,

  addAttributes() {
    return {
      type: {
        default: "definition",

        parseHTML: (element) =>
          element.getAttribute("data-callout-type") ?? "definition",

        renderHTML: (attributes) => ({
          "data-callout-type": attributes.type,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='callout']",
        contentElement: ".note-callout-body",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "callout",
        class: "note-callout",
      }),

      [
        "div",
        {
          class: "note-callout-body",
        },
        0,
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },

  addCommands() {
    return {
      insertCallout:
        (type) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,

            attrs: {
              type,
            },

            content: [
              {
                type: "paragraph",
              },
            ],
          }),

      deleteCallout:
        () =>
        ({ commands }) =>
          commands.deleteNode(this.name),
    };
  },
});
