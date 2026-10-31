import type { ReactNode } from "react";
import { usePrivateStorageUrl } from "../../hooks/usePrivateStorageUrl";

export function PrivateFileLink({ path, children }: { path: string | null; children: ReactNode }) {
  const { url, loading, error } = usePrivateStorageUrl("pdfs", path);
  if (!path) return null;
  if (!url) return <span role="status">{loading ? "Laster filtilgang…" : error}</span>;
  return <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>;
}
