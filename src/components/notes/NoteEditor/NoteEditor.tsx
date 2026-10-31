import { getMathTarget, applyMathEdit, type MathTarget } from "./mathEditing";
import "./NoteEditor.css";
import "katex/dist/katex.min.css";
import { Callout, type CalloutType } from "./Callout";
import { ConceptLink } from "../../concepts/ConceptLink/ConceptLink";
import { ConceptPicker } from "../../concepts/ConceptPicker/ConceptPicker";

import { useEffect, useRef, useState, useId, useCallback, type ReactNode, type ChangeEvent } from "react";
import {
  Bold,
  Braces,
  Code2,
  Columns3,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  LoaderCircle,
  Quote,
  Redo2,
  Rows3,
  Sigma,
  Table2,
  Trash2,
  Undo2,
  BadgeCheck,
  BookOpen,
  Lightbulb,
  Puzzle,
} from "lucide-react";

import { useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { PrivateImage } from "./PrivateImage";
import { TableKit } from "@tiptap/extension-table";
import { common, createLowlight } from "lowlight";
import { importIntoEditor, readImportFile } from "./noteImport";
import { MathDialog } from "./MathDialog/MathDialog";
import { SlashMenu } from "./SlashMenu";
import { filterSlashCommands, type SlashCommandItem } from "./slashCommands";
import { FormulaConceptLink } from "../../concepts/FormulaConceptLink/FormulaConceptLink";
import { getConceptByIdFromDatabase } from "../../../services/concepts/conceptService";
import type { Concept } from "../../../data/concepts/types";
import type { NoteContentJson } from "../../../services/notes/notesService";

import { NoteDocument } from "../NoteDocument/NoteDocument";
import { createHeadingAnchors } from "../NoteDocument/headingAnchors";

const lowlight = createLowlight(common);



type NoteEditorProps = {
  value: string;
  header?: ReactNode;
  onChange: (value: string, contentJson: NoteContentJson) => void;
};

type SlashMenuState = {
  query: string;
  from: number;
  to: number;
  left: number;
  top: number;
};

type ConceptSelection =
  | {
      type: "text";
      from: number;
      to: number;
    }
  | {
      type: "formula";
      from: number;
    };

type FormulaControlsPosition = {
  left: number;
  top: number;
};

export const NoteEditor = ({ value, onChange, header }: NoteEditorProps) => {
  const outlineId = useId();
  const importInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const slashMenuRef = useRef<SlashMenuState | null>(null);
  const slashSelectedIndexRef = useRef(0);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isConceptPickerOpen, setIsConceptPickerOpen] = useState(false);
  const [conceptSelection, setConceptSelection] =
    useState<ConceptSelection | null>(null);
  const [selectedFormulaConceptId, setSelectedFormulaConceptId] = useState<
    string | null
  >(null);
  const [selectedFormulaConcept, setSelectedFormulaConcept] =
    useState<Concept | null>(null);
  const [formulaControlsPosition, setFormulaControlsPosition] =
    useState<FormulaControlsPosition | null>(null);
  const [slashMenu, setSlashMenu] = useState<SlashMenuState | null>(null);
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);
  const [mathDialogType, setMathDialogType] = useState<
    "inline" | "block" | null
  >(null);

  const [mathTarget, setMathTarget] = useState<MathTarget | null>(null);
  const [mathError, setMathError] = useState("");
  const openMath = (type: "inline" | "block", position?: number) => {
    const current = editorRef.current;
    if (!current) return;
    if (position !== undefined) current.commands.setNodeSelection(position);
    setMathTarget(getMathTarget(current, position));
    if (position !== undefined && current.state.doc.nodeAt(position)?.type.name === "blockMath") {
      const node = current.state.doc.nodeAt(position)!;
      setConceptSelection({ type: "formula", from: position });
      setSelectedFormulaConceptId(node.attrs.conceptId as string | null);
      const dom = current.view.nodeDOM(position);
      if (dom instanceof HTMLElement) {
        const rect = dom.getBoundingClientRect();
        setFormulaControlsPosition({ left: rect.left + rect.width / 2, top: rect.bottom + 12 });
      }
    }
    setMathError(""); setIsConceptPickerOpen(false); setMathDialogType(type);
  };

  useEffect(() => {
    let isCancelled = false;

    const loadFormulaConcept = async () => {
      if (!selectedFormulaConceptId) {
        setSelectedFormulaConcept(null);
        return;
      }

      try {
        const concept = await getConceptByIdFromDatabase(
          selectedFormulaConceptId,
        );

        if (!isCancelled) {
          setSelectedFormulaConcept(concept ?? null);
        }
      } catch (error) {
        console.error("Kunne ikke hente formelkonsept:", error);

        if (!isCancelled) {
          setSelectedFormulaConcept(null);
        }
      }
    };

    void loadFormulaConcept();

    return () => {
      isCancelled = true;
    };
  }, [selectedFormulaConceptId]);

  const editor = useEditor({
    extensions: [
      createHeadingAnchors(outlineId),
      StarterKit.configure({
        codeBlock: false,
      }),

      CodeBlockLowlight.configure({
        lowlight,
      }),

      // Callbacks run on node clicks, never during extension configuration.
      // eslint-disable-next-line react-hooks/refs
      Mathematics.configure({
        inlineOptions: { onClick: (_node, pos) => openMath("inline", pos) },
        blockOptions: { onClick: (_node, pos) => openMath("block", pos) },
        katexOptions: {
          throwOnError: false,
        },
      }),

      PrivateImage.configure({
        inline: false,
        allowBase64: false,
        resize: {
          enabled: true,
          directions: ["top-left", "top-right", "bottom-left", "bottom-right"],
          minWidth: 100,
          minHeight: 60,
          alwaysPreserveAspectRatio: true,
        },
      }),

      TableKit.configure({
        table: {
          resizable: true,
          HTMLAttributes: {
            class: "note-table",
          },
        },
      }),

      Callout,
      ConceptLink,
      FormulaConceptLink,
    ],

    content: value,

    editorProps: {
      attributes: {
        class: "note-editor-content",
      },

      handleKeyDown: (_view, event) => {
        const currentEditor = editorRef.current;
        const currentSlashMenu = slashMenuRef.current;

        if (!currentEditor) {
          return false;
        }

        if (currentSlashMenu) {
          const items = filterSlashCommands(currentSlashMenu.query);

          if (event.key === "ArrowDown") {
            event.preventDefault();

            setSlashSelectedIndex((currentIndex) =>
              items.length > 0 ? (currentIndex + 1) % items.length : 0,
            );

            return true;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();

            setSlashSelectedIndex((currentIndex) =>
              items.length > 0
                ? (currentIndex - 1 + items.length) % items.length
                : 0,
            );

            return true;
          }

          if (event.key === "Enter") {
            event.preventDefault();

            const selectedItem = items[slashSelectedIndexRef.current];

            if (!selectedItem) {
              return true;
            }

            slashMenuRef.current = null;
            setSlashMenu(null);

            if (selectedItem.calloutType) {
              currentEditor
                .chain()
                .focus()
                .deleteRange({
                  from: currentSlashMenu.from,
                  to: currentSlashMenu.to,
                })
                .insertCallout(selectedItem.calloutType)
                .run();

              requestAnimationFrame(() => {
                const maximumPosition = Math.max(
                  1,
                  currentEditor.state.doc.content.size - 1,
                );

                const positionInsideCallout = Math.min(
                  currentSlashMenu.from + 1,
                  maximumPosition,
                );

                currentEditor
                  .chain()
                  .focus()
                  .setTextSelection(positionInsideCallout)
                  .run();
              });

              return true;
            }

            currentEditor
              .chain()
              .focus()
              .deleteRange({
                from: currentSlashMenu.from,
                to: currentSlashMenu.to,
              })
              .run();

            selectedItem.command(currentEditor, {
              openMathDialog: (type) => openMath(type),

              insertCallout: (type) => {
                currentEditor.chain().focus().insertCallout(type).run();
              },

              chooseImage: () => {
                fileInputRef.current?.click();
              },
            });

            return true;
          }

          if (event.key === "Escape") {
            event.preventDefault();
            setSlashMenu(null);
            return true;
          }
        }

        const usesCommandKey = event.metaKey || event.ctrlKey;

        if (!usesCommandKey) {
          return false;
        }

        const key = event.key.toLowerCase();

        if (event.altKey && key === "1") {
          event.preventDefault();

          currentEditor.chain().focus().toggleHeading({ level: 1 }).run();

          return true;
        }

        if (event.altKey && key === "2") {
          event.preventDefault();

          currentEditor.chain().focus().toggleHeading({ level: 2 }).run();

          return true;
        }

        if (event.altKey && key === "m") {
          event.preventDefault();
          openMath("inline");
          return true;
        }

        if (event.shiftKey && key === "m") {
          event.preventDefault();
          openMath("block");
          return true;
        }

        if (event.altKey && key === "d") {
          event.preventDefault();

          currentEditor.chain().focus().insertCallout("definition").run();

          return true;
        }

        if (event.altKey && key === "t") {
          event.preventDefault();

          currentEditor.chain().focus().insertCallout("theorem").run();

          return true;
        }

        if (event.altKey && key === "e") {
          event.preventDefault();

          currentEditor.chain().focus().insertCallout("example").run();

          return true;
        }

        if (event.altKey && key === "x") {
          event.preventDefault();

          currentEditor.chain().focus().insertCallout("exam").run();

          return true;
        }

        return false;
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
  });

  // React StrictMode can tear down/reuse the editor before onCreate runs.
  // Bind to the live hook instance, not asynchronous lifecycle callbacks.
  useEffect(() => {
    editorRef.current = editor;
    return () => {
      if (editorRef.current === editor) editorRef.current = null;
    };
  }, [editor]);

  // Refresh formatting and contextual controls when the cursor/selection changes.
  useEditorState({
    editor,
    selector: ({ editor: current }) => current ? {
      active: ["bold", "italic", "heading", "bulletList", "orderedList", "blockquote", "codeBlock", "callout", "table", "conceptLink", "blockMath"].map(type => current.isActive(type)),
      heading: current.getAttributes("heading").level,
      concept: current.getAttributes("blockMath").conceptId,
      undo: current.can().undo(),
      redo: current.can().redo(),
    } : null,
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentContent = editor.getHTML();

    if (currentContent !== value) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  useEffect(() => {
    slashMenuRef.current = slashMenu;
  }, [slashMenu]);

  useEffect(() => {
    slashSelectedIndexRef.current = slashSelectedIndex;
  }, [slashSelectedIndex]);

  useEffect(() => {
    setSlashSelectedIndex(0);
  }, [slashMenu?.query]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updateSlashMenu = () => {
      const { selection } = editor.state;

      if (!selection.empty || editor.isActive("codeBlock")) {
        setSlashMenu(null);
        return;
      }

      const { $from } = selection;

      if (!$from.parent.isTextblock) {
        setSlashMenu(null);
        return;
      }

      const textBeforeCursor = $from.parent.textBetween(
        0,
        $from.parentOffset,
        undefined,
        "\ufffc",
      );

      const match = textBeforeCursor.match(/(?:^|\s)\/([^\s/]*)$/);

      if (!match) {
        setSlashMenu(null);
        return;
      }

      const query = match[1] ?? "";
      const from = $from.pos - query.length - 1;
      const coordinates = editor.view.coordsAtPos($from.pos);

      setSlashMenu({
        query,
        from,
        to: $from.pos,
        left: coordinates.left,
        top: coordinates.bottom + 8,
      });
    };

    editor.on("update", updateSlashMenu);
    editor.on("selectionUpdate", updateSlashMenu);
    editor.on("focus", updateSlashMenu);

    return () => {
      editor.off("update", updateSlashMenu);
      editor.off("selectionUpdate", updateSlashMenu);
      editor.off("focus", updateSlashMenu);
    };
  }, [editor]);

  const handleInsertInlineMath = () => {
    openMath("inline");
  };

  const handleInsertBlockMath = () => {
    openMath("block");
  };

  const handleChooseImage = () => {
    if (isUploadingImage) {
      return;
    }

    fileInputRef.current?.click();
  };

  const runImport = useCallback(async (load: () => Promise<string>, files: File[] = []) => {
    if (!editor) return;
    setIsUploadingImage(true);
    try { await importIntoEditor(editor, load, files); }
    catch (error) { window.alert(error instanceof Error ? error.message : "Importen mislyktes."); }
    finally { setIsUploadingImage(false); }
  }, [editor, setIsUploadingImage]);
  const uploadImage = (file: File) => runImport(async () => "", [file]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    await uploadImage(file);
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    const editorElement = editor.view.dom;

    const handlePasteImage = (event: ClipboardEvent) => {
      const data = event.clipboardData;
      if (!data) return;
      let html = data.getData("text/html");
      const plain = data.getData("text/plain");
      const files = Array.from(data.files).filter(file => file.type.startsWith("image/"));
      if (!html && !files.length && !/\\[([]|\$\$/.test(plain)) return;
      if (!html && plain) {
        const container = document.createElement("div");
        for (const line of plain.split("\n")) {
          const paragraph = document.createElement("p"); paragraph.textContent = line; container.append(paragraph);
        }
        html = container.innerHTML;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      void runImport(async () => html, files);
    };
    editorElement.addEventListener("paste", handlePasteImage, true);
    return () => editorElement.removeEventListener("paste", handlePasteImage, true);
  }, [editor, runImport]);

  const handleInsertTable = () => {
    if (!editor) {
      return;
    }

    editor
      .chain()
      .focus()
      .insertTable({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  };

  const focusInsideInsertedCallout = (
    targetEditor: Editor,
    insertionFrom: number,
  ) => {
    requestAnimationFrame(() => {
      const maximumPosition = Math.max(
        1,
        targetEditor.state.doc.content.size - 1,
      );

      const positionInsideCallout = Math.min(
        insertionFrom + 1,
        maximumPosition,
      );

      targetEditor
        .chain()
        .focus()
        .setTextSelection(positionInsideCallout)
        .run();
    });
  };

  const handleInsertCallout = (type: CalloutType) => {
    if (!editor) {
      return;
    }

    const insertionFrom = editor.state.selection.from;

    editor.chain().focus().insertCallout(type).run();

    focusInsideInsertedCallout(editor, insertionFrom);
  };

  const handleSlashCommand = (item: SlashCommandItem) => {
    if (!editor || !slashMenu) {
      return;
    }

    const currentSlashMenu = slashMenu;

    slashMenuRef.current = null;
    setSlashMenu(null);

    if (item.calloutType) {
      editor
        .chain()
        .focus()
        .deleteRange({
          from: currentSlashMenu.from,
          to: currentSlashMenu.to,
        })
        .insertCallout(item.calloutType)
        .run();

      focusInsideInsertedCallout(editor, currentSlashMenu.from);

      return;
    }

    editor
      .chain()
      .focus()
      .deleteRange({
        from: currentSlashMenu.from,
        to: currentSlashMenu.to,
      })
      .run();

    item.command(editor, {
      openMathDialog: (type) => openMath(type),
      insertCallout: handleInsertCallout,
      chooseImage: handleChooseImage,
    });
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    const editorElement = editor.view.dom;

    const handleSlashMenuKeyDown = (event: KeyboardEvent) => {
      const currentSlashMenu = slashMenuRef.current;

      if (!currentSlashMenu) {
        return;
      }

      const items = filterSlashCommands(currentSlashMenu.query);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        setSlashSelectedIndex((currentIndex) => {
          const nextIndex =
            items.length > 0 ? (currentIndex + 1) % items.length : 0;

          slashSelectedIndexRef.current = nextIndex;

          return nextIndex;
        });

        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        setSlashSelectedIndex((currentIndex) => {
          const nextIndex =
            items.length > 0
              ? (currentIndex - 1 + items.length) % items.length
              : 0;

          slashSelectedIndexRef.current = nextIndex;

          return nextIndex;
        });

        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const selectedItem = items[slashSelectedIndexRef.current];

        if (!selectedItem) {
          return;
        }

        slashMenuRef.current = null;
        setSlashMenu(null);

        if (selectedItem.calloutType) {
          editor
            .chain()
            .focus()
            .deleteRange({
              from: currentSlashMenu.from,
              to: currentSlashMenu.to,
            })
            .insertCallout(selectedItem.calloutType)
            .run();

          focusInsideInsertedCallout(editor, currentSlashMenu.from);

          return;
        }

        editor
          .chain()
          .focus()
          .deleteRange({
            from: currentSlashMenu.from,
            to: currentSlashMenu.to,
          })
          .run();

        selectedItem.command(editor, {
          openMathDialog: (type) => openMath(type),

          insertCallout: handleInsertCallout,

          chooseImage: () => {
            fileInputRef.current?.click();
          },
        });

        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        slashMenuRef.current = null;
        setSlashMenu(null);
      }
    };

    editorElement.addEventListener("keydown", handleSlashMenuKeyDown, true);

    return () => {
      editorElement.removeEventListener(
        "keydown",
        handleSlashMenuKeyDown,
        true,
      );
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const isInsideTable = editor.isActive("table");
  const slashItems = filterSlashCommands(slashMenu?.query ?? "");

  const slashMenuLeft = slashMenu
    ? Math.max(12, Math.min(slashMenu.left, window.innerWidth - 344))
    : 0;

  const slashMenuTop = slashMenu
    ? Math.max(12, Math.min(slashMenu.top, window.innerHeight - 356))
    : 0;

  const toolbar = (
      <div className="note-editor-toolbar" role="group" aria-label="Formatering og innsetting">
        <div className="note-toolbar-group" role="group" aria-label="Tekst og overskrifter">
        <button
          type="button"
          aria-pressed={editor.isActive("bold")}
          className={editor.isActive("bold") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Fet"
          aria-label="Fet"
        >
          <Bold size={18} />
        </button>

        <button
          type="button"
          aria-pressed={editor.isActive("italic")}
          className={editor.isActive("italic") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Kursiv"
          aria-label="Kursiv"
        >
          <Italic size={18} />
        </button>

        <button
          type="button"
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          aria-pressed={editor.isActive("heading", { level: 1 })}
          title="Overskrift 1 (Ctrl/Cmd + Alt + 1)"
          aria-label="Overskrift 1 (Ctrl/Cmd + Alt + 1)"
        >
          <Heading1 size={18} />
          <span>Overskrift 1</span>
        </button>

        <button
          type="button"
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-pressed={editor.isActive("heading", { level: 2 })}
          title="Overskrift 2 (Ctrl/Cmd + Alt + 2)"
          aria-label="Overskrift 2 (Ctrl/Cmd + Alt + 2)"
        >
          <Heading2 size={18} />
          <span>Overskrift 2</span>
        </button>

        </div>
        <div className="note-toolbar-group" role="group" aria-label="Lister og sitat">
        <button
          type="button"
          aria-pressed={editor.isActive("bulletList")}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Punktliste"
          aria-label="Punktliste"
        >
          <List size={18} />
        </button>

        <button
          type="button"
          aria-pressed={editor.isActive("orderedList")}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Nummerert liste"
          aria-label="Nummerert liste"
        >
          <ListOrdered size={18} />
        </button>

        <button
          type="button"
          aria-pressed={editor.isActive("blockquote")}
          className={editor.isActive("blockquote") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Sitat"
          aria-label="Sitat"
        >
          <Quote size={18} />
        </button>

        <button
          type="button"
          aria-pressed={editor.isActive("codeBlock")}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Kodeblokk"
          aria-label="Kodeblokk"
        >
          <Code2 size={18} />
        </button>

        </div>
        <div className="note-toolbar-group note-toolbar-history" role="group" aria-label="Historikk">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Angre"
          aria-label="Angre"
        >
          <Undo2 size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Gjør om"
          aria-label="Gjør om"
        >
          <Redo2 size={18} />
        </button>
        </div>
        <details className="note-toolbar-menu">
          {/* Keep the editor selection when opening the menu with the mouse. */}
          <summary onMouseDown={event => event.preventDefault()}>Sett inn</summary>
          <div className="note-toolbar-options">
        <button
          type="button"
          onMouseDown={event => event.preventDefault()}
          onClick={handleInsertInlineMath}
          title="Sett inn formel i tekst (Ctrl/Cmd + Alt + M)"
          aria-label="Sett inn formel i tekst (Ctrl/Cmd + Alt + M)"
        >
          <Sigma size={18} />
          <span>Formel i tekst</span>
        </button>

        <button
          type="button"
          onMouseDown={event => event.preventDefault()}
          onClick={handleInsertBlockMath}
          title="Sett inn formelblokk (Ctrl/Cmd + Shift + M)"
          aria-label="Sett inn formelblokk (Ctrl/Cmd + Shift + M)"
        >
          <Braces size={18} />
          <span>Formelblokk</span>
        </button>

        <button type="button" disabled={isUploadingImage}
          onMouseDown={event => event.preventDefault()}
          onClick={() => importInputRef.current?.click()}
          title="Importer HTML/DOCX med innebygde bilder. Settes inn ved markøren.">
          {isUploadingImage ? "Importerer…" : "Importer"}
        </button>
        <button
          type="button"
          onClick={handleChooseImage}
          disabled={isUploadingImage}
          title={isUploadingImage ? "Laster opp bilde..." : "Last opp bilde"}
          aria-label="Last opp bilde"
        >
          {isUploadingImage ? (
            <LoaderCircle size={18} className="image-upload-spinner" />
          ) : (
            <ImagePlus size={18} />
          )}
          <span>Bilde</span>
        </button>

        <button
          type="button"
          onClick={handleInsertTable}
          title="Sett inn tabell"
          aria-label="Sett inn tabell"
        >
          <Table2 size={18} />
          <span>Tabell</span>
        </button>

        <div className="concept-picker-wrapper">
          <button
            type="button"
            className={
              editor.isActive("conceptLink") ||
              (editor.isActive("blockMath") &&
                Boolean(editor.getAttributes("blockMath").conceptId))
                ? "is-active"
                : ""
            }
            onClick={() => {
              if (editor.isActive("blockMath")) {
                const formulaAttributes = editor.getAttributes("blockMath");

                if (formulaAttributes.conceptId) {
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("blockMath", {
                      conceptId: null,
                    })
                    .run();

                  return;
                }

                setConceptSelection({
                  type: "formula",
                  from: editor.state.selection.from,
                });

                setIsConceptPickerOpen(true);
                return;
              }

              if (editor.isActive("conceptLink")) {
                editor.chain().focus().unsetConceptLink().run();
                return;
              }

              const { from, to, empty } = editor.state.selection;

              if (empty) {
                return;
              }

              setConceptSelection({
                type: "text",
                from,
                to,
              });

              setIsConceptPickerOpen(true);
            }}
            title="Koble markert tekst eller formel til begrep"
          aria-label="Koble markert tekst eller formel til begrep"
          >
            <BookOpen size={18} />
            <span>Begrepskobling</span>
          </button>

          {isConceptPickerOpen && (
            <ConceptPicker
              onSelect={(concept) => {
                if (!conceptSelection) {
                  return;
                }
                if (conceptSelection.type === "formula") {
                  editor
                    .chain()
                    .focus()
                    .setNodeSelection(conceptSelection.from)
                    .updateAttributes("blockMath", {
                      conceptId: concept.id,
                    })
                    .run();

                  setSelectedFormulaConceptId(concept.id);
                } else {
                  editor
                    .chain()
                    .focus()
                    .setTextSelection({
                      from: conceptSelection.from,
                      to: conceptSelection.to,
                    })
                    .setConceptLink(concept.id)
                    .run();
                }

                if (conceptSelection.type !== "formula") {
                  setConceptSelection(null);
                }

                setIsConceptPickerOpen(false);
              }}
              onClose={() => {
                setConceptSelection(null);
                setIsConceptPickerOpen(false);
              }}
            />
          )}
        </div>
          </div>
        </details>
        <details className="note-toolbar-menu">
          <summary onMouseDown={event => event.preventDefault()}>Innholdsbokser</summary>
          <div className="note-toolbar-options">
        <button
          type="button"
          onMouseDown={event => event.preventDefault()}
          onClick={() => handleInsertCallout("definition")}
          title="Sett inn definisjon (Ctrl/Cmd + Alt + D)"
          aria-label="Sett inn definisjon (Ctrl/Cmd + Alt + D)"
        >
          <BookOpen size={18} />
          <span>Definisjon</span>
        </button>

        <button
          type="button"
          onMouseDown={event => event.preventDefault()}
          onClick={() => handleInsertCallout("tip")}
          title="Sett inn tips"
          aria-label="Sett inn tips"
        >
          <Lightbulb size={18} />
          <span>Tips</span>
        </button>

        <button
          type="button"
          onMouseDown={event => event.preventDefault()}
          onClick={() => handleInsertCallout("theorem")}
          title="Sett inn teorem (Ctrl/Cmd + Alt + T)"
          aria-label="Sett inn teorem (Ctrl/Cmd + Alt + T)"
        >
          <Sigma size={18} />
          <span>Teorem</span>
        </button>

        <button
          type="button"
          onMouseDown={event => event.preventDefault()}
          onClick={() => handleInsertCallout("example")}
          title="Sett inn eksempel (Ctrl/Cmd + Alt + E)"
          aria-label="Sett inn eksempel (Ctrl/Cmd + Alt + E)"
        >
          <Puzzle size={18} />
          <span>Eksempel</span>
        </button>

        <button
          type="button"
          onMouseDown={event => event.preventDefault()}
          onClick={() => handleInsertCallout("exam")}
          title="Dette må du kunne til eksamen (Ctrl/Cmd + Alt + X)"
          aria-label="Dette må du kunne til eksamen (Ctrl/Cmd + Alt + X)"
        >
          <BadgeCheck size={18} />
          <span>Eksamen</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteCallout().run()}
          disabled={!editor.isActive("callout")}
          title="Slett callout"
          aria-label="Slett callout"
        >
          <Trash2 size={18} />
          <span>Slett callout</span>
        </button>

          </div>
        </details>
        {isInsideTable && <div className="note-toolbar-table" role="group" aria-label="Rediger tabell">
          <span>Tabell</span>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!isInsideTable}
          title="Legg til rad"
          aria-label="Legg til rad"
        >
          <Rows3 size={18} />
          <span>Legg til rad</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!isInsideTable}
          title="Legg til kolonne"
          aria-label="Legg til kolonne"
        >
          <Columns3 size={18} />
          <span>Legg til kolonne</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!isInsideTable}
          title="Slett rad"
          aria-label="Slett rad"
        >
          <Rows3 size={18} />
          <span>Slett rad</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!isInsideTable}
          title="Slett kolonne"
          aria-label="Slett kolonne"
        >
          <Columns3 size={18} />
          <span>Slett kolonne</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!isInsideTable}
          title="Slett hele tabellen"
          aria-label="Slett hele tabellen"
        >
          <Trash2 size={18} />
          <span>Slett hele tabellen</span>
        </button>

        </div>}
      </div>
  );

  return (
    <div className="note-editor">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleImageUpload}
        hidden
      />

      <input ref={importInputRef} type="file" accept=".html,.htm,.docx" hidden
        onChange={event => {
          const file = event.target.files?.[0]; event.target.value = "";
          if (file) void runImport(() => readImportFile(file));
        }} />
      <NoteDocument editor={editor} outlineId={outlineId} header={header} toolbar={toolbar} />



      {conceptSelection?.type === "formula" &&
        selectedFormulaConcept &&
        formulaControlsPosition &&
        (() => {
          const concept = selectedFormulaConcept;

          return (
            <div
              className="formula-concept-controls"
              style={{
                position: "fixed",
                left: formulaControlsPosition.left,
                top: formulaControlsPosition.top,
                transform: "translateX(-50%)",
                zIndex: 1000,
              }}
            >
              <div className="formula-concept-name">
                <BookOpen size={15} />
                <span>{concept.name}</span>
              </div>

              <div className="formula-concept-actions">
                <button
                  type="button"
                  onClick={() => setIsConceptPickerOpen(true)}
                >
                  Endre
                </button>

                <button
                  type="button"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .setNodeSelection(conceptSelection.from)
                      .updateAttributes("blockMath", {
                        conceptId: null,
                      })
                      .run();

                    setSelectedFormulaConceptId(null);
                    setConceptSelection(null);
                  }}
                >
                  Fjern kobling
                </button>
              </div>
            </div>
          );
        })()}

      {slashMenu && (
        <div
          className="slash-menu-popover"
          style={{
            left: slashMenuLeft,
            top: slashMenuTop,
          }}
        >
          <SlashMenu
            items={slashItems}
            selectedIndex={slashSelectedIndex}
            onSelect={handleSlashCommand}
          />
        </div>
      )}

      {mathError && <p role="alert">{mathError}</p>}
      <MathDialog
        open={mathDialogType !== null}
        title={`${mathTarget && mathTarget.to > mathTarget.from ? "Rediger / konverter" : "Sett inn"} ${mathDialogType === "block" ? "formelblokk" : "formel i tekst"}`}
        submitLabel={mathTarget && mathTarget.to > mathTarget.from ? "Bruk endring" : "Sett inn"}
        onClose={() => setMathDialogType(null)}
        initialValue={mathTarget?.latex ?? ""}
        onInsert={(latex) => {
          if (!mathTarget || !mathDialogType) return;
          if (!applyMathEdit(editor, mathTarget, mathDialogType, latex)) {
            setMathError("Notatet er endret mens dialogen var åpen. Lukk dialogen og velg formelen på nytt.");
            return;
          }
          setMathDialogType(null); setMathTarget(null);
        }}
      />
    </div>
  );
};
