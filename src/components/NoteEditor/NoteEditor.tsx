import "./NoteEditor.css";
import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type NoteEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const NoteEditor = ({ value, onChange }: NoteEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
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

  return (
    <div className="note-editor">
      <div className="note-editor-toolbar">
        <button
          type="button"
          className={editor.isActive("bold") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Fet
        </button>

        <button
          type="button"
          className={editor.isActive("italic") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Kursiv
        </button>

        <button
          type="button"
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          Overskrift
        </button>

        <button
          type="button"
          className={editor.isActive("bulletList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Punktliste
        </button>

        <button
          type="button"
          className={editor.isActive("orderedList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Nummerert liste
        </button>

        <button
          type="button"
          className={editor.isActive("blockquote") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Sitat
        </button>

        <button
          type="button"
          className={editor.isActive("codeBlock") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Kode
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Angre
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Gjør om
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};
