import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { getConcepts } from "../../../services/concepts/conceptService";
import { findConceptsInText } from "../../../services/concepts/conceptRecognitionService";

const automaticConceptLinksPluginKey = new PluginKey("automaticConceptLinks");

export const AutomaticConceptLinks = Extension.create({
  name: "automaticConceptLinks",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: automaticConceptLinksPluginKey,

        props: {
          decorations(state) {
            const concepts = getConcepts();
            const decorations: Decoration[] = [];

            state.doc.descendants((node, position) => {
              if (!node.isText || !node.text) {
                return;
              }

              const alreadyHasConceptLink = node.marks.some(
                (mark) => mark.type.name === "conceptLink",
              );

              if (alreadyHasConceptLink) {
                return;
              }

              const matches = findConceptsInText(node.text, concepts);

              matches.forEach((match) => {
                decorations.push(
                  Decoration.inline(
                    position + match.from,
                    position + match.to,
                    {
                      class: "concept-link",
                      "data-concept-id": match.concept.id,
                    },
                  ),
                );
              });
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
