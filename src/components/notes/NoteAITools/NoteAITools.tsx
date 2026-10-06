import { useEffect, useRef, useState, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { NoteSummary } from "../NoteSummary/NoteSummary";
import { FlashcardGenerator } from "../../flashcards/FlashcardGenerator/FlashcardGenerator";
import { explainSelectedText, getSelectedNoteText } from "../../../services/notes/selectedTextService";
import "./NoteAITools.css";

export function NoteAITools({ noteId, subjectId, content, children, toolbar }: {
  noteId: string; subjectId: string; content: string; children: ReactNode; toolbar?: ReactNode;
}) {
  const noteRoot = useRef<HTMLDivElement>(null);
  const toolsRoot = useRef<HTMLElement>(null);
  const request = useRef<AbortController | null>(null);
  const [selection, setSelection] = useState("");
  const [result, setResult] = useState<{ text: string; explanation: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const capture = () => {
      const current = window.getSelection();
      if (!noteRoot.current || current?.isCollapsed) return;
      const contentRoot = noteRoot.current.querySelector<HTMLElement>(".read-only-note-content") ?? noteRoot.current;
      setSelection(getSelectedNoteText(contentRoot, current));
    };
    const clearOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !noteRoot.current?.contains(event.target)
        && !toolsRoot.current?.contains(event.target)) setSelection("");
    };
    document.addEventListener("selectionchange", capture);
    document.addEventListener("pointerdown", clearOutside);
    return () => {
      document.removeEventListener("selectionchange", capture);
      document.removeEventListener("pointerdown", clearOutside);
      request.current?.abort();
    };
  }, []);

  async function explain() {
    if (!selection || request.current) return;
    const text = selection;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");
    try {
      const explanation = await explainSelectedText(text, controller.signal);
      if (!controller.signal.aborted) setResult({ text, explanation });
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Kunne ikke forklare teksten.");
    } finally {
      if (!controller.signal.aborted) { request.current = null; setLoading(false); }
    }
  }

  return <>
    <div className={toolbar ? "note-reading-tools" : undefined}>
    {toolbar}
    <aside className="note-ai-tools" aria-label="AI-verktøy" ref={toolsRoot}>
      <h2><Sparkles size={18} /> AI-verktøy</h2>
      <div className="note-ai-actions">
        <details><summary>Oppsummering</summary><NoteSummary content={content} /></details>
        <details><summary>Flashcards</summary><FlashcardGenerator noteId={noteId} subjectId={subjectId} content={content} /></details>
        <details><summary>Forklar markert tekst</summary>
          <p>Marker tekst i notatet. Bare det valgte utdraget sendes til AI-tjenesten.</p>
          {selection ? <><blockquote>{selection}</blockquote><button type="button" onClick={() => setSelection("")}>Fjern valgt tekst</button></> : <p>Ingen tekst valgt.</p>}
          <button type="button" className="flashcard-generate-button" disabled={!selection || loading} onClick={explain}>{loading ? "Forklarer …" : "Forklar markert tekst"}</button>
          {loading && <p role="status">Lager en enklere forklaring …</p>}
          {error && <p role="alert" className="flashcard-generator-error">{error}</p>}
          {result && <div className="note-ai-explanation" aria-live="polite"><h3>AI-forklaring</h3><blockquote>{result.text}</blockquote><p>{result.explanation}</p></div>}
        </details>
      </div>
    </aside>
    </div>
    <div ref={noteRoot}>{children}</div>
  </>;
}
