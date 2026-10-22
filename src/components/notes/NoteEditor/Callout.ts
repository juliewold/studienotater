import { closeHistory } from "@tiptap/pm/history";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { CalloutNodeView } from "./CalloutNodeView";

export type CalloutType = "definition" | "tip" | "theorem" | "example" | "exam" | "method" | "formula";

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

      conceptId: {
        default: null,

        parseHTML: (element) => element.getAttribute("data-concept-id"),

        renderHTML: (attributes) => {
          if (!attributes.conceptId) {
            return {};
          }

          return {
            "data-concept-id": attributes.conceptId,
          };
        },
      },

      conceptName: {
        default: null,

        parseHTML: (element) => element.getAttribute("data-concept-name"),

        renderHTML: (attributes) => {
          if (!attributes.conceptName) {
            return {};
          }

          return {
            "data-concept-name": attributes.conceptName,
          };
        },
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
        ({ commands, tr, dispatch }) => {
          if (tr.selection.empty) {
            return commands.insertContent({
              type: this.name,
              attrs: { type, conceptId: null, conceptName: null },
              content: [{ type: "paragraph" }],
            });
          }

          // Capture the actual slice before replacing the selection. Do not
          // serialize/reparse it: retain node attributes, marks and math sources.
          const slice = tr.selection.content();
          const calloutType = tr.doc.type.schema.nodes[this.name];
          if (!calloutType.validContent(slice.content)) return false;
          const callout = calloutType.createChecked(
            { type, conceptId: null, conceptName: null },
            slice.content,
          );
          if (dispatch) {
            closeHistory(tr);
            tr.replaceSelectionWith(callout, false).scrollIntoView();
          }
          return true;
        },

      deleteCallout:
        () =>
        ({ commands }) =>
          commands.deleteNode(this.name),
    };
  },
});
