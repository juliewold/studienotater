import "./NoteEditor.css";
import "katex/dist/katex.min.css";
import { Callout, type CalloutType } from "./Callout";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
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

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { common, createLowlight } from "lowlight";
import { supabase } from "../../../lib/supabase";
import { MathDialog } from "./MathDialog/MathDialog";
import { SlashMenu } from "./SlashMenu";
import { filterSlashCommands, type SlashCommandItem } from "./slashCommands";

const lowlight = createLowlight(common);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

type NoteEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type SlashMenuState = {
  query: string;
  from: number;
  to: number;
  left: number;
  top: number;
};

export const NoteEditor = ({ value, onChange }: NoteEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const slashMenuRef = useRef<SlashMenuState | null>(null);
  const slashSelectedIndexRef = useRef(0);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [slashMenu, setSlashMenu] = useState<SlashMenuState | null>(null);
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0);
  const [mathDialogType, setMathDialogType] = useState<
    "inline" | "block" | null
  >(null);

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
              openMathDialog: (type) => setMathDialogType(type),

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
          setMathDialogType("inline");
          return true;
        }

        if (event.shiftKey && key === "m") {
          event.preventDefault();
          setMathDialogType("block");
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

    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },

    onDestroy: () => {
      editorRef.current = null;
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
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
    setMathDialogType("inline");
  };

  const handleInsertBlockMath = () => {
    setMathDialogType("block");
  };

  const handleChooseImage = () => {
    if (isUploadingImage) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || !editor) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert("Du må velge en bildefil.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      window.alert("Bildet kan ikke være større enn 10 MB.");
      return;
    }

    setIsUploadingImage(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error("Du må være logget inn for å laste opp bilder.");
      }

      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("note-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("note-images")
        .getPublicUrl(filePath);

      editor
        .chain()
        .focus()
        .setImage({
          src: publicUrlData.publicUrl,
          alt: file.name,
          title: file.name,
        })
        .run();
    } catch (error) {
      console.error("Kunne ikke laste opp bildet:", error);

      const message =
        error instanceof Error ? error.message : "En ukjent feil oppstod.";

      window.alert(`Kunne ikke laste opp bildet: ${message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

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
      openMathDialog: (type) => setMathDialogType(type),
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
          openMathDialog: (type) => setMathDialogType(type),

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

  return (
    <div className="note-editor">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleImageUpload}
        hidden
      />

      <div className="note-editor-toolbar">
        <button
          type="button"
          className={editor.isActive("bold") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Fet"
        >
          <Bold size={18} />
        </button>

        <button
          type="button"
          className={editor.isActive("italic") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Kursiv"
        >
          <Italic size={18} />
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Overskrift 1 (Ctrl/Cmd + Alt + 1)"
        >
          <Heading1 size={18} />
        </button>

        <button
          type="button"
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Overskrift 2 (Ctrl/Cmd + Alt + 2)"
        >
          <Heading2 size={18} />
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className={editor.isActive("bulletList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Punktliste"
        >
          <List size={18} />
        </button>

        <button
          type="button"
          className={editor.isActive("orderedList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Nummerert liste"
        >
          <ListOrdered size={18} />
        </button>

        <button
          type="button"
          className={editor.isActive("blockquote") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Sitat"
        >
          <Quote size={18} />
        </button>

        <button
          type="button"
          className={editor.isActive("codeBlock") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Kodeblokk"
        >
          <Code2 size={18} />
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          onClick={handleInsertInlineMath}
          title="Sett inn formel i tekst (Ctrl/Cmd + Alt + M)"
        >
          <Sigma size={18} />
        </button>

        <button
          type="button"
          onClick={handleInsertBlockMath}
          title="Sett inn formelblokk (Ctrl/Cmd + Shift + M)"
        >
          <Braces size={18} />
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          onClick={() => handleInsertCallout("definition")}
          title="Sett inn definisjon (Ctrl/Cmd + Alt + D)"
        >
          <BookOpen size={18} />
        </button>

        <button
          type="button"
          onClick={() => handleInsertCallout("tip")}
          title="Sett inn tips"
        >
          <Lightbulb size={18} />
        </button>

        <button
          type="button"
          onClick={() => handleInsertCallout("theorem")}
          title="Sett inn teorem (Ctrl/Cmd + Alt + T)"
        >
          <Sigma size={18} />
        </button>

        <button
          type="button"
          onClick={() => handleInsertCallout("example")}
          title="Sett inn eksempel (Ctrl/Cmd + Alt + E)"
        >
          <Puzzle size={18} />
        </button>

        <button
          type="button"
          onClick={() => handleInsertCallout("exam")}
          title="Dette må du kunne til eksamen (Ctrl/Cmd + Alt + X)"
        >
          <BadgeCheck size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteCallout().run()}
          disabled={!editor.isActive("callout")}
          title="Slett callout"
        >
          <Trash2 size={18} />
        </button>

        <button
          type="button"
          onClick={handleChooseImage}
          disabled={isUploadingImage}
          title={isUploadingImage ? "Laster opp bilde..." : "Last opp bilde"}
        >
          {isUploadingImage ? (
            <LoaderCircle size={18} className="image-upload-spinner" />
          ) : (
            <ImagePlus size={18} />
          )}
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          onClick={handleInsertTable}
          title="Sett inn tabell"
        >
          <Table2 size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!isInsideTable}
          title="Legg til rad"
        >
          <Rows3 size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!isInsideTable}
          title="Legg til kolonne"
        >
          <Columns3 size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!isInsideTable}
          title="Slett rad"
        >
          <Rows3 size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!isInsideTable}
          title="Slett kolonne"
        >
          <Columns3 size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!isInsideTable}
          title="Slett hele tabellen"
        >
          <Trash2 size={18} />
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Angre"
        >
          <Undo2 size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Gjør om"
        >
          <Redo2 size={18} />
        </button>
      </div>

      <EditorContent editor={editor} />

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

      <MathDialog
        open={mathDialogType !== null}
        title={
          mathDialogType === "block"
            ? "Sett inn formelblokk"
            : "Sett inn formel i tekst"
        }
        onClose={() => setMathDialogType(null)}
        onInsert={(latex) => {
          if (mathDialogType === "block") {
            editor
              .chain()
              .focus()
              .insertBlockMath({
                latex,
              })
              .run();
          } else {
            editor
              .chain()
              .focus()
              .insertInlineMath({
                latex,
              })
              .run();
          }

          setMathDialogType(null);
        }}
      />
    </div>
  );
};
