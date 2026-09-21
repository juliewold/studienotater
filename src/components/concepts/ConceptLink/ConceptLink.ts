import "./ConceptLink.css";

import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    conceptLink: {
      setConceptLink: (conceptId: string) => ReturnType;
      unsetConceptLink: () => ReturnType;
    };
  }
}

export const ConceptLink = Mark.create({
  name: "conceptLink",

  addAttributes() {
    return {
      conceptId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-concept-id"),
        renderHTML: (attributes) => ({
          "data-concept-id": attributes.conceptId,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-concept-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "concept-link",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setConceptLink:
        (conceptId) =>
        ({ commands }) =>
          commands.setMark(this.name, {
            conceptId,
          }),

      unsetConceptLink:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
