import "./MathDialog.css";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import katex from "katex";

const mathSymbolGroups = [
  {
    title: "Mengder",
    symbols: [
      { label: "∈", latex: String.raw`\in` },
      { label: "∉", latex: String.raw`\notin` },
      { label: "⊆", latex: String.raw`\subseteq` },
      { label: "⊂", latex: String.raw`\subset` },
      { label: "∪", latex: String.raw`\cup` },
      { label: "∩", latex: String.raw`\cap` },
      { label: "∅", latex: String.raw`\emptyset` },
      { label: "Aᶜ", latex: String.raw`A^c` },
      { label: "|A|", latex: String.raw`|A|` },
    ],
  },
  {
    title: "Logikk",
    symbols: [
      { label: "¬", latex: String.raw`\neg` },
      { label: "∧", latex: String.raw`\land` },
      { label: "∨", latex: String.raw`\lor` },
      { label: "→", latex: String.raw`\to` },
      { label: "↔", latex: String.raw`\leftrightarrow` },
      { label: "∀", latex: String.raw`\forall` },
      { label: "∃", latex: String.raw`\exists` },
    ],
  },
];

type MathDialogProps = {
  open: boolean;
  title: string;
  initialValue?: string;
  onClose: () => void;
  onInsert: (latex: string) => void;
};

export const MathDialog = ({
  open,
  title,
  initialValue = "",
  onClose,
  onInsert,
}: MathDialogProps) => {
  const [latex, setLatex] = useState(initialValue);
  const latexInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [latexError, setLatexError] = useState("");

  const handleInsertSymbol = (symbolLatex: string) => {
    const input = latexInputRef.current;

    if (!input) {
      return;
    }

    const selectionStart = input.selectionStart ?? latex.length;
    const selectionEnd = input.selectionEnd ?? latex.length;

    const beforeSelection = latex.slice(0, selectionStart);
    const afterSelection = latex.slice(selectionEnd);

    const nextLatex = `${beforeSelection}${symbolLatex}${afterSelection}`;

    const nextCursorPosition = selectionStart + symbolLatex.length;

    setLatex(nextLatex);

    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
  };

  useEffect(() => {
    if (open) {
      setLatex(initialValue);
    }
  }, [open, initialValue]);

  useEffect(() => {
    const previewElement = previewRef.current;

    if (!previewElement) {
      return;
    }

    if (!latex.trim()) {
      previewElement.innerHTML = "";
      setLatexError("");
      return;
    }

    try {
      katex.render(latex, previewElement, {
        throwOnError: true,
        displayMode: true,
      });

      setLatexError("");
    } catch {
      previewElement.innerHTML = "";
      setLatexError("Formelen inneholder ugyldig LaTeX.");
    }
  }, [latex]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Enter" && latex.trim() && !latexError) {
        event.preventDefault();
        handleInsert();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, latex, latexError, onClose]);

  const handleInsert = () => {
    const trimmedLatex = latex.trim();

    if (!trimmedLatex) {
      return;
    }

    onInsert(trimmedLatex);
  };

  const handleOverlayClick = () => {
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="math-dialog-overlay" onClick={handleOverlayClick}>
      <div
        className="math-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="math-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="math-dialog-header">
          <h2 id="math-dialog-title">{title}</h2>

          <button
            type="button"
            className="math-dialog-close-button"
            onClick={onClose}
            aria-label="Lukk"
            title="Lukk"
          >
            <X size={20} />
          </button>
        </div>

        <div className="math-dialog-content">
          <div className="math-symbol-groups">
            {mathSymbolGroups.map((group) => (
              <section key={group.title} className="math-symbol-group">
                <h3>{group.title}</h3>

                <div className="math-symbol-buttons">
                  {group.symbols.map((symbol) => (
                    <button
                      key={`${group.title}-${symbol.label}`}
                      type="button"
                      className="math-symbol-button"
                      onClick={() => handleInsertSymbol(symbol.latex)}
                      title={`Sett inn ${symbol.label}`}
                    >
                      {symbol.label}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <label htmlFor="math-dialog-latex">LaTeX</label>

          <input
            ref={latexInputRef}
            id="math-dialog-latex"
            type="text"
            value={latex}
            onChange={(event) => setLatex(event.target.value)}
            placeholder="For eksempel: x^2 + y^2 = z^2"
            autoFocus
          />

          <div className="math-preview-section">
            <span className="math-preview-label">Forhåndsvisning</span>

            <div ref={previewRef} className="math-preview" aria-live="polite" />

            {latexError && <p className="math-preview-error">{latexError}</p>}
          </div>
        </div>

        <div className="math-dialog-actions">
          <button
            type="button"
            className="math-dialog-cancel-button"
            onClick={onClose}
          >
            Avbryt
          </button>

          <button
            type="button"
            className="math-dialog-insert-button"
            onClick={handleInsert}
            disabled={!latex.trim() || Boolean(latexError)}
          >
            Sett inn
          </button>
        </div>
      </div>
    </div>
  );
};
