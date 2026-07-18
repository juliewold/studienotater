import "./NoteEditor.css";
import "katex/dist/katex.min.css";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Bold,
  Braces,
  Code2,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  LoaderCircle,
  Quote,
  Redo2,
  Sigma,
  Undo2,
} from "lucide-react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { common, createLowlight } from "lowlight";

import { supabase } from "../../lib/supabase";

const lowlight = createLowlight(common);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

type NoteEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const NoteEditor = ({ value, onChange }: NoteEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  const handleInsertInlineMath = () => {
    if (!editor) {
      return;
    }

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
    if (!editor) {
      return;
    }

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

  if (!editor) {
    return null;
  }

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
