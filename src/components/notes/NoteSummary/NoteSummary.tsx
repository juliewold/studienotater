import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { generateNoteSummary } from "../../../services/notes/noteSummaryService";
import "../../flashcards/FlashcardGenerator/FlashcardGenerator.css";
import "./NoteSummary.css";

export function NoteSummary({ content }: { content: string }) {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function generate() {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");
    try {
      const result = await generateNoteSummary(content, controller.signal);
      if (!controller.signal.aborted) setSummary(result);
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof Error
        ? failure.message : "Kunne ikke oppsummere notatet. Prøv igjen.");
    } finally {
      if (!controller.signal.aborted) {
        request.current = null;
        setLoading(false);
      }
    }
  }

  return <section className="flashcard-generator note-summary" aria-label="AI-oppsummering">
    <div className="flashcard-generator-header">
      <div><h2>Oppsummering</h2><p>Kort repetisjon basert på det lagrede notatet. Oppsummeringen lagres ikke.</p></div>
      <button type="button" className="flashcard-generate-button" disabled={loading} onClick={generate}>
        {loading ? <LoaderCircle size={17} className="flashcard-generator-spinner" /> : <Sparkles size={17} />}
        {loading ? "Oppsummerer …" : "Oppsummer notatet"}
      </button>
    </div>
    {loading && <p role="status">Lager oppsummering …</p>}
    {error && <p role="alert" className="flashcard-generator-error">{error}</p>}
    {summary && <div className="note-summary-result" aria-live="polite"><p>AI-generert oppsummering</p><div>{summary}</div></div>}
  </section>;
}
