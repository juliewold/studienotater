import "./NoteEditor.css";
import "katex/dist/katex.min.css";

import { useEffect } from "react";
import {
  Bold,
  Braces,
  Code2,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Sigma,
  Undo2,
} from "lucide-react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

type NoteEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const NoteEditor = ({ value, onChange }: NoteEditorProps) => {
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
    ],

    content: value,

    editorProps: {
      attributes: {
        class: "note-editor-content",
      },
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

  if (!editor) {
    return null;
  }

  const handleInsertInlineMath = () => {
    const latex = window.prompt(
      "Skriv inn LaTeX-formelen:",
      String.raw`x^2 + y^2 = z^2`,
    );

    if (!latex?.trim()) {
      return;
    }

    editor
      .chain()
      .focus()
      .insertInlineMath({
        latex: latex.trim(),
      })
      .run();
  };

  const handleInsertBlockMath = () => {
    const latex = window.prompt(
      "Skriv inn LaTeX-formelen:",
      String.raw`\sum_{i=1}^{n} i = \frac{n(n+1)}{2}`,
    );

    if (!latex?.trim()) {
      return;
    }

    editor
      .chain()
      .focus()
      .insertBlockMath({
        latex: latex.trim(),
      })
      .run();
  };

  return (
    <div className="note-editor">
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
          title="Overskrift 1"
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
          title="Overskrift 2"
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
          title="Sett inn formel i tekst"
        >
          <Sigma size={18} />
        </button>

        <button
          type="button"
          onClick={handleInsertBlockMath}
          title="Sett inn formelblokk"
        >
          <Braces size={18} />
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
    </div>
  );
};
