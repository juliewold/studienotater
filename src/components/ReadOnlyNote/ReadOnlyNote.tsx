import "./ReadOnlyNote.css";
import "katex/dist/katex.min.css";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { common, createLowlight } from "lowlight";
import { TableKit } from "@tiptap/extension-table";
import { Callout } from "../NoteEditor/Callout";

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
