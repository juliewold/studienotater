import "./ReadOnlyNote.css";
import "katex/dist/katex.min.css";

import { useEffect, useState, useId, useMemo } from "react";
import type { Concept } from "../../../data/concepts/types";
import {
  getConceptByIdFromDatabase,
  getConceptsFromDatabase,
} from "../../../services/concepts/conceptService";
import { ConceptPopover } from "../../concepts/ConceptPopover/ConceptPopover";
import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
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
  const outlineId = useId();
  const [activeHeading, setActiveHeading] = useState("");
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
        Extension.create({
          name: "readingHeadingAnchors",
          addProseMirrorPlugins: () => [new Plugin({
            props: {
              decorations: state => {
                const decorations: Decoration[] = [];
                state.doc.descendants((node, position) => {
                  if (node.type.name === "heading" && node.textContent.trim()) {
                    decorations.push(Decoration.node(position, position + node.nodeSize, {
                      id: `${outlineId}-heading-${decorations.length}`, tabindex: "-1",
                    }));
                  }
                });
                return DecorationSet.create(state.doc, decorations);
              },
            },
          })],
        }),
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
    [concepts, content],
  );

  const headings = useMemo(() => {
    const outline: { id: string; text: string; level: number }[] = [];
    editor?.state.doc.descendants(node => {
      if (node.type.name === "heading" && node.textContent.trim()) {
        outline.push({ id: `${outlineId}-heading-${outline.length}`, text: node.textContent, level: node.attrs.level });
      }
    });
    return outline;
  }, [editor, outlineId]);

  useEffect(() => {
    if (!editor) return;
    const elements = Array.from(editor.view.dom.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")).filter(element => element.textContent?.trim());
    const updateActive = () => {
      const current = elements.filter(element => element.getBoundingClientRect().top <= 140).at(-1);
      setActiveHeading(current?.id ?? headings[0]?.id ?? "");
    };
    const frame = requestAnimationFrame(updateActive);
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", updateActive); };
  }, [editor, headings]);

  if (!editor) {
    return null;
  }

  return (
    <div className="read-only-note">
      {headings.length > 0 && <nav className="note-outline" aria-label="Innhold i notatet">
        <details open>
          <summary>På denne siden</summary>
          <ol>{headings.map(heading => <li key={heading.id} style={{ paddingLeft: `${Math.max(0, heading.level - Math.min(...headings.map(item => item.level))) * 12}px` }}>
            <a href={`#${heading.id}`} aria-current={activeHeading === heading.id ? "location" : undefined}
              onClick={event => {
                event.preventDefault();
                const target = document.getElementById(heading.id);
                target?.focus({ preventScroll: true });
                target?.scrollIntoView({ block: "start" });
                setActiveHeading(heading.id);
              }}>{heading.text}</a>
          </li>)}</ol>
        </details>
      </nav>}
      <div className="note-reading-body"><EditorContent editor={editor} /></div>

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
