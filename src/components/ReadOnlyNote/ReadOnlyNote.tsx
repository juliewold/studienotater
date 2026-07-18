import "./ReadOnlyNote.css";
import "katex/dist/katex.min.css";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

type ReadOnlyNoteProps = {
  content: string;
};

export const ReadOnlyNote = ({ content }: ReadOnlyNoteProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),

      CodeBlockLowlight.configure({
        lowlight,
        enableTabIndentation: true,
        tabSize: 2,
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
    ],

    content,
    editable: false,

    editorProps: {
      attributes: {
        class: "read-only-note-content",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="read-only-note">
      <EditorContent editor={editor} />
    </div>
  );
};