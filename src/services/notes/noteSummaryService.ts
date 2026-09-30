import { getPlainTextFromNote } from "../concepts/conceptExtractionService";

export async function generateNoteSummary(content: string, signal?: AbortSignal): Promise<string> {
  const text = getPlainTextFromNote(content);
  if (!text) throw new Error("Notatet inneholder ingen tekst.");
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) throw new Error("AI-tjenesten er ikke konfigurert.");
  const response = await fetch(`${apiUrl}/api/concepts/summarize-note/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof data?.error === "string"
    ? data.error : "Kunne ikke oppsummere notatet. Prøv igjen senere.");
  if (typeof data?.summary !== "string" || !data.summary.trim()
    || data.summary.length > 5000 || data.summary.trim().split(/\s+/).length > 200) {
    throw new Error("AI-tjenesten returnerte en ugyldig oppsummering.");
  }
  return data.summary.trim();
}
