import { useEffect, useMemo, useRef } from "react";
import { bindPrivateNoteImage, getNoteImagePath } from "../../services/media/privateStorage";

export function PrivateNoteHtml({ html, className }: { html: string; className: string }) {
  const root = useRef<HTMLDivElement>(null);
  const prepared = useMemo(() => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("img").forEach(image => {
      const src = image.getAttribute("src") ?? "";
      if (getNoteImagePath(src) || src.includes("/storage/v1/object/") || src.startsWith("supabase-storage:")) {
        image.dataset.storageSource = src;
        image.removeAttribute("src");
      }
    });
    return doc.body.innerHTML;
  }, [html]);
  useEffect(() => {
    const release = Array.from(root.current?.querySelectorAll<HTMLImageElement>("img[data-storage-source]") ?? [])
      .map(image => bindPrivateNoteImage(image, image.dataset.storageSource!));
    return () => release.forEach(dispose => dispose());
  }, [prepared]);
  return <div ref={root} className={className} dangerouslySetInnerHTML={{ __html: prepared }} />;
}
