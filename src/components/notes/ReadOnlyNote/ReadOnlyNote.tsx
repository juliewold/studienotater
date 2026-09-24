import "./ReadOnlyNote.css";
import "katex/dist/katex.min.css";

import { useEffect, useState } from "react";
import type { Concept } from "../../../data/concepts/types";
import {
  getConceptByIdFromDatabase,
  getConceptsFromDatabase,
} from "../../../services/concepts/conceptService";
import { ConceptPopover } from "../../concepts/ConceptPopover/ConceptPopover";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { common, createLowlight } from "lowlight";
import { TableKit } from "@tiptap/extension-table";
import { Callout } from "../NoteEditor/Callout";
import { ConceptLink } from "../../concepts/ConceptLink/ConceptLink";
import { AutomaticConceptLinks } from "../../concepts/AutomaticConceptLinks/AutomaticConceptLinks";

const lowlight = createLowlight(common);

type ReadOnlyNoteProps = {
  content: string;
};

type PopoverPosition = {
  left: number;
  top: number;
};

export const ReadOnlyNote = ({ content }: ReadOnlyNoteProps) => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

  const [popoverPosition, setPopoverPosition] =
    useState<PopoverPosition | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadConcepts = async () => {
      try {
        const loadedConcepts = await getConceptsFromDatabase();

        if (!isCancelled) {
          setConcepts(loadedConcepts);
        }
      } catch (error) {
        console.error("Kunne ikke hente konsepter:", error);
      }
    };

    void loadConcepts();

    return () => {
      isCancelled = true;
    };
  }, []);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),

        CodeBlockLowlight.configure({
          lowlight,
        }),

        Mathematics.configure({
          katexOptions: {
            throwOnError: false,
          },
        }),

        Image.configure({
          inline: false,
          allowBase64: false,
        }),

        TableKit.configure({
          table: {
            resizable: false,
            HTMLAttributes: {
              class: "note-table",
            },
          },
        }),

        Callout,
        ConceptLink,

        AutomaticConceptLinks.configure({
          concepts,
        }),
      ],

      content,
      editable: false,

      editorProps: {
        attributes: {
          class: "read-only-note-content",
        },

        handleClick: (_view, _pos, event) => {
          const target = event.target;

          if (!(target instanceof HTMLElement)) {
            return false;
          }

          const conceptElement =
            target.closest<HTMLElement>("[data-concept-id]");

          if (!conceptElement) {
            return false;
          }

          const conceptId = conceptElement.dataset.conceptId;

          if (!conceptId) {
            return false;
          }

          const rect = conceptElement.getBoundingClientRect();

          void getConceptByIdFromDatabase(conceptId)
            .then((concept) => {
              if (!concept) {
                return;
              }

              setPopoverPosition({
                left: rect.left,
                top: rect.bottom + 8,
              });

              setSelectedConcept(concept);
            })
            .catch((error) => {
              console.error("Kunne ikke hente konsept:", error);
            });

          return true;
        },
      },
    },
    [concepts],
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="read-only-note">
      <EditorContent editor={editor} />

      {selectedConcept && popoverPosition && (
        <ConceptPopover
          concept={selectedConcept}
          left={popoverPosition.left}
          top={popoverPosition.top}
          onClose={() => {
            setSelectedConcept(null);
            setPopoverPosition(null);
          }}
        />
      )}
    </div>
  );
};
