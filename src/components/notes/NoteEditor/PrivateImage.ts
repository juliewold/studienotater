import Image from "@tiptap/extension-image";
import { mergeAttributes, ResizableNodeView } from "@tiptap/core";
import { bindPrivateNoteImage, getNoteImagePath } from "../../../services/media/privateStorage";

/** Keep the document's permanent src intact; credentials exist only in the view. */
export const PrivateImage = Image.extend({
  addNodeView() {
    return ({ node, editor, getPos, HTMLAttributes }) => {
      const image = document.createElement("img");
      image.draggable = false;
      let release = () => {};
      let source = "";
      const sync = (attrs: Record<string, unknown>) => {
        for (const name of ["alt", "title", "width", "height"]) {
          if (attrs[name] == null) image.removeAttribute(name);
          else image.setAttribute(name, String(attrs[name]));
        }
        const next = typeof attrs.src === "string" ? attrs.src : "";
        if (source === next) return;
        release(); source = next;
        if (getNoteImagePath(next)) release = bindPrivateNoteImage(image, next);
        else {
          image.removeAttribute("src");
          // Retain existing non-Storage HTTP images, but never fall back for a
          // malformed Storage reference or an old URL whose authorization failed.
          if (/^https?:\/\//i.test(next) && !next.includes("/storage/v1/object/")) image.src = next;
          release = () => {};
        }
      };
      const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
      sync({ ...node.attrs, ...attrs });
      const resize = this.options.resize;
      if (resize && resize.enabled) {
        const view = new ResizableNodeView({
          element: image, editor, node, getPos,
          onResize: (width, height) => { image.style.width = `${width}px`; image.style.height = `${height}px`; },
          onCommit: (width, height) => {
            const pos = getPos();
            if (pos !== undefined) editor.chain().setNodeSelection(pos).updateAttributes(this.name, { width, height }).run();
          },
          onUpdate: updated => {
            if (updated.type !== node.type) return false;
            sync(updated.attrs); return true;
          },
          options: { directions: resize.directions, min: { width: resize.minWidth, height: resize.minHeight }, preserveAspectRatio: resize.alwaysPreserveAspectRatio === true },
        });
        const destroy = view.destroy.bind(view);
        view.destroy = () => { release(); destroy(); };
        return view;
      }
      return { dom: image, update: updated => {
        if (updated.type !== node.type) return false;
        sync(updated.attrs); return true;
      }, destroy: () => release(), ignoreMutation: () => true };
    };
  },
});
