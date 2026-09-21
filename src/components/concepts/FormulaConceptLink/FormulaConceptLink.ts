import { Extension } from "@tiptap/core";

export const FormulaConceptLink = Extension.create({
  name: "formulaConceptLink",

  addGlobalAttributes() {
    return [
      {
        types: ["blockMath"],

        attributes: {
          conceptId: {
            default: null,

            parseHTML: (element) =>
              element.getAttribute("data-formula-concept-id"),

            renderHTML: (attributes) => {
              if (!attributes.conceptId) {
                return {};
              }

              return {
                "data-formula-concept-id": attributes.conceptId,
              };
            },
          },
        },
      },
    ];
  },
});
