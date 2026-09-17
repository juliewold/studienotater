import "./ReadOnlyNote.css";
import "katex/dist/katex.min.css";

import { useState } from "react";
import type { Concept } from "../../../data/concepts/types";
import { getConceptById } from "../../../services/concepts/conceptService";
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

const lowlight = createLowlight(common);

type ReadOnlyNoteProps = {
  content: string;
};

type PopoverPosition = {
  left: number;
  top: number;
};

export const ReadOnlyNote = ({ content }: ReadOnlyNoteProps) => {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

  const [popoverPosition, setPopoverPosition] =
    useState<PopoverPosition | null>(null);

  const editor = useEditor({
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

        const conceptElement = target.closest<HTMLElement>("[data-concept-id]");

        if (!conceptElement) {
          return false;
        }

        const conceptId = conceptElement.dataset.conceptId;

        if (!conceptId) {
          return false;
        }

        const concept = getConceptById(conceptId);

        if (!concept) {
          return false;
        }

        const rect = conceptElement.getBoundingClientRect();

        setPopoverPosition({
          left: rect.left,
          top: rect.bottom + 8,
        });

        setSelectedConcept(concept);

        return true;
      },
    },
  });

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
