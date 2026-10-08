import { useEffect, useState, useCallback, type ReactNode } from "react";
import { EditorContent, useEditorState, type Editor } from "@tiptap/react";
import { getNoteHeadings } from "./headingAnchors";
import "../ReadOnlyNote/ReadOnlyNote.css";

// Notes can live in the page or in a scrollable PDF summary dialog.
function getScrollContainer(element: HTMLElement): HTMLElement | null {
  for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY)) return parent;
  }
  return null;
}

export function NoteDocument({ editor, outlineId, header, toolbar }: {
  editor: Editor;
  outlineId: string;
  header?: ReactNode;
  toolbar?: ReactNode;
}) {
  const headings = useEditorState({
    editor,
    selector: ({ editor: current }) => getNoteHeadings(current.state.doc, outlineId),
  });
  const [activeHeading, setActiveHeading] = useState("");
  const baseLevel = Math.min(...headings.map(heading => heading.level));

  const scrollOffset = useCallback(() => {
    const container = getScrollContainer(editor.view.dom);
    const navbar = container ? null : document.querySelector<HTMLElement>(".navbar");
    const tools = editor.view.dom.closest(".note-reading-body")?.querySelector<HTMLElement>(".note-editor-toolbar");
    const stickyBottom = (element: HTMLElement | null | undefined) => {
      if (!element) return 0;
      const style = getComputedStyle(element);
      return style.position === "sticky" ? (parseFloat(style.top) || 0) + element.offsetHeight : 0;
    };
    // A nested scrollport's sticky inset starts inside its padding box.
    const containerPadding = container ? parseFloat(getComputedStyle(container).paddingTop) || 0 : 0;
    return Math.max(container ? 16 : 88, stickyBottom(navbar) + 16, stickyBottom(tools) + containerPadding + 16);
  }, [editor]);

  useEffect(() => {
    const container = getScrollContainer(editor.view.dom);
    const scrollTarget = container ?? window;
    const updateActive = () => {
      const elements = Array.from(editor.view.dom.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"));
      const top = container ? container.getBoundingClientRect().top + container.clientTop : 0;
      const current = elements.filter(element => element.id && element.getBoundingClientRect().top <= top + scrollOffset() + 4).at(-1);
      setActiveHeading(current?.id ?? headings[0]?.id ?? "");
    };
    const frame = requestAnimationFrame(updateActive);
    scrollTarget.addEventListener("scroll", updateActive, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      scrollTarget.removeEventListener("scroll", updateActive);
    };
  }, [editor, headings, scrollOffset]);

  return <div className={`read-only-note${header ? " read-only-note-with-header" : ""}`}>
    {header && <div className="note-reading-header">{header}</div>}
    {headings.length > 0 && <nav className="note-outline" aria-label="Innhold i notatet">
      <details open>
        <summary>På denne siden</summary>
        <ol>{headings.map(heading => <li key={heading.id} style={{ paddingLeft: `${Math.max(0, heading.level - baseLevel) * 12}px` }}>
          <a href={`#${heading.id}`} aria-current={activeHeading === heading.id ? "location" : undefined}
            onClick={event => {
              event.preventDefault();
              const target = document.getElementById(heading.id);
              if (!target) return;
              if (editor.isEditable) {
                editor.chain().setTextSelection(heading.position + 1).focus(undefined, { scrollIntoView: false }).run();
              } else {
                target.focus({ preventScroll: true });
              }
              const container = getScrollContainer(editor.view.dom);
              const top = target.getBoundingClientRect().top - scrollOffset();
              if (container) {
                container.scrollTo({
                  top: container.scrollTop + top - container.getBoundingClientRect().top - container.clientTop,
                  behavior: "instant",
                });
              } else {
                window.scrollTo({ top: window.scrollY + top, behavior: "instant" });
              }
              setActiveHeading(heading.id);
            }}>{heading.text}</a>
        </li>)}</ol>
      </details>
    </nav>}
    <div className="note-reading-body">
      {toolbar}
      <EditorContent editor={editor} />
    </div>
  </div>;
}
