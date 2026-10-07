import "./MathDialog.css";
import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import katex from "katex";
import { insertMathTemplate, mathSymbolGroups, type MathTemplate } from "./mathTemplates";

type MathDialogProps = {
  open: boolean;
  title: string;
  initialValue?: string;
  onClose: () => void;
  onInsert: (latex: string) => void;
};

export const MathDialog = (props: MathDialogProps) => props.open
  ? <MathDialogContent key={props.initialValue ?? ""} {...props} />
  : null;

function MathDialogContent({ title, initialValue = "", onClose, onInsert }: MathDialogProps) {
  const [latex, setLatex] = useState(initialValue);
  const [category, setCategory] = useState(0);
  const latexInputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => {
    if (!latex.trim()) return { html: "", error: "" };
    try {
      return { html: katex.renderToString(latex, { throwOnError: true, displayMode: true, trust: false }), error: "" };
    } catch {
      return { html: "", error: "Formelen inneholder ugyldig LaTeX." };
    }
  }, [latex]);

  const handleInsertSymbol = (template: MathTemplate) => {
    const input = latexInputRef.current;
    if (!input) return;
    const next = insertMathTemplate(latex, input.selectionStart ?? latex.length, input.selectionEnd ?? latex.length, template);
    setLatex(next.value);
    requestAnimationFrame(() => {
      if (!input.isConnected) return;
      input.focus();
      input.setSelectionRange(next.selectionStart, next.selectionEnd);
    });
  };

  const handleInsert = () => {
    if (latex.trim() && !preview.error) onInsert(latex.trim());
  };

  return (
    <div className="math-dialog-overlay" onClick={onClose}>
      <div
        className="math-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="math-dialog-title"
        onClick={event => event.stopPropagation()}
        onKeyDown={event => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          } else if (event.key === "Enter" && event.target === latexInputRef.current && !event.nativeEvent.isComposing) {
            // Enter on a symbol/category control must not submit the formula.
            event.preventDefault();
            event.stopPropagation();
            handleInsert();
          }
        }}
      >
        <div className="math-dialog-header">
          <h2 id="math-dialog-title">{title}</h2>
          <button type="button" className="math-dialog-close-button" onClick={onClose} aria-label="Lukk" title="Lukk">
            <X size={20} />
          </button>
        </div>

        <div className="math-dialog-content">
          <div className="math-symbol-groups">
            <label htmlFor="math-dialog-category">Symboler og maler</label>
            <select id="math-dialog-category" value={category} onChange={event => setCategory(Number(event.target.value))}>
              {mathSymbolGroups.map((group, index) => <option key={group.title} value={index}>{group.title}</option>)}
            </select>
            <section className="math-symbol-group" aria-label={mathSymbolGroups[category].title}>
              <div className="math-symbol-buttons">
                {mathSymbolGroups[category].symbols.map(symbol => (
                  <button
                    key={symbol.name}
                    type="button"
                    className="math-symbol-button"
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => handleInsertSymbol(symbol)}
                    aria-label={`Sett inn ${symbol.name.toLowerCase()}`}
                    title={`${symbol.name}: ${symbol.latex.trim()}`}
                  >
                    {symbol.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <label htmlFor="math-dialog-latex">LaTeX</label>
          <input
            ref={latexInputRef}
            id="math-dialog-latex"
            type="text"
            value={latex}
            onChange={event => setLatex(event.target.value)}
            placeholder="For eksempel: x^2 + y^2 = z^2"
            aria-describedby="math-dialog-help"
            aria-invalid={Boolean(preview.error)}
            autoFocus
          />
          <p id="math-dialog-help" className="math-dialog-help">Malene settes inn ved markøren og erstatter markert tekst. Skriv videre i det markerte feltet.</p>

          <div className="math-preview-section">
            <span className="math-preview-label">Forhåndsvisning</span>
            <div className="math-preview" aria-live="polite" dangerouslySetInnerHTML={{ __html: preview.html }} />
            {preview.error && <p className="math-preview-error" role="status">{preview.error}</p>}
          </div>
        </div>

        <div className="math-dialog-actions">
          <button type="button" className="math-dialog-cancel-button" onClick={onClose}>Avbryt</button>
          <button type="button" className="math-dialog-insert-button" onClick={handleInsert} disabled={!latex.trim() || Boolean(preview.error)}>Sett inn</button>
        </div>
      </div>
    </div>
  );
}
