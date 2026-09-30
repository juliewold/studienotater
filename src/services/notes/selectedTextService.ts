export async function explainSelectedText(text: string, signal?: AbortSignal): Promise<string> {
  const selected = text.trim();
  if (!selected) throw new Error("Marker tekst i notatet først.");
  if (selected.length > 10000) throw new Error("Velg et kortere utdrag (maks. 10 000 tegn).");
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) throw new Error("AI-tjenesten er ikke konfigurert.");
  const response = await fetch(`${apiUrl}/api/concepts/explain-selection/`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: selected }), signal,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof data?.error === "string" ? data.error : "Kunne ikke forklare teksten. Prøv igjen.");
  if (typeof data?.explanation !== "string" || !data.explanation.trim()
    || data.explanation.length > 5000 || data.explanation.trim().split(/\s+/).length > 200) {
    throw new Error("AI-tjenesten returnerte en ugyldig forklaring.");
  }
  return data.explanation.trim();
}

/** Only a selection entirely within the rendered note is eligible. */
export function getSelectedNoteText(root: HTMLElement, selection: Selection | null): string {
  if (!selection || selection.isCollapsed || selection.rangeCount !== 1) return "";
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return "";
  return selection.toString().trim();
}
