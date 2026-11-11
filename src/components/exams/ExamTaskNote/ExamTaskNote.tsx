import "./ExamTaskNote.css";
import { useMemo, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { ReadOnlyNote } from "../../notes/ReadOnlyNote/ReadOnlyNote";
import { MathText } from "../../common/MathText/MathText";
import { learningItemsFromHtml, type ExamNoteSplit } from "../splitExamNote";

type ExamTaskNoteProps = {
  split: ExamNoteSplit;
  header?: ReactNode;
};

// Hovedområdet viser oppgaveteksten og besvarelsen. Støtten ligger i kort ved siden av.
// Innholdet kommer fra notatet, så alt kan redigeres i den vanlige editoren.
export const ExamTaskNote = ({ split, header }: ExamTaskNoteProps) => {
  const learningItems = useMemo(() => learningItemsFromHtml(split.learning), [split.learning]);

  return (
    <div className="exam-task-note">
      {header}

      <div className="exam-task-layout">
        <div className="exam-task-main">
          <section className="exam-task-section" aria-label="Oppgavetekst">
            <ReadOnlyNote content={split.task} />
          </section>

          <section className="exam-answer-section" aria-labelledby="exam-answer-heading">
            <div className="exam-answer-heading">
              <h2 id="exam-answer-heading" className="exam-answer-title">
                <Check size={16} aria-hidden="true" />
                Eksamensbesvarelse – fullstendig løsning
              </h2>
              <span className="exam-pill exam-pill-answer">Dette kan du skrive på eksamen</span>
            </div>
            <div className="exam-answer-body">
              <ReadOnlyNote content={split.answer} />
            </div>
          </section>
        </div>

        <aside className="exam-task-support" aria-label="Støtte til oppgaven">
          {split.support.trim() && <ReadOnlyNote content={split.support} />}

          {learningItems.length > 0 && (
            <details className="exam-learning">
              <summary className="exam-learning-summary">
                <ChevronDown size={15} aria-hidden="true" className="exam-learning-chevron" />
                <span className="exam-learning-title">Læringshjelp – hvorfor dette fungerer</span>
                <span className="exam-pill exam-pill-learning">Til forståelse, ikke nødvendig på eksamen</span>
              </summary>
              <div className="exam-learning-items">
                {learningItems.map((item, index) => (
                  <p key={index} className="exam-learning-item">
                    {item.title && <strong><MathText>{item.title}</MathText></strong>}{item.title && " "}
                    <MathText>{item.text}</MathText>
                  </p>
                ))}
              </div>
            </details>
          )}
        </aside>
      </div>
    </div>
  );
};
