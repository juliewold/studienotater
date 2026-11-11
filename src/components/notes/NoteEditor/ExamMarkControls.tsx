import { useState } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  EXAM_MARK_KINDS,
  examMarkKindLabels,
  type ExamMarkKind,
} from "./ExamMark";

type ExamMarkControlsProps = {
  editor: Editor;
};

type MarkState = {
  active: boolean;
  kind: ExamMarkKind;
  explanation: string;
  hasSelection: boolean;
};

const readMarkState = (editor: Editor): MarkState => {
  const attributes = editor.getAttributes("examMark");
  const kind = EXAM_MARK_KINDS.includes(attributes.kind) ? (attributes.kind as ExamMarkKind) : "data";

  return {
    active: editor.isActive("examMark"),
    kind,
    explanation: typeof attributes.explanation === "string" ? attributes.explanation : "",
    hasSelection: !editor.state.selection.empty,
  };
};

// Markerer valgt tekst i besvarelsen og oppgaven. Forklaringen vises når leseren holder over markeringen.
export const ExamMarkControls = ({ editor }: ExamMarkControlsProps) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => JSON.stringify(readMarkState(current)),
  });
  const markState = JSON.parse(state) as MarkState;

  const [draftKind, setDraftKind] = useState<ExamMarkKind | null>(null);
  const [draftExplanation, setDraftExplanation] = useState<string | null>(null);

  const kind = draftKind ?? (markState.active ? markState.kind : "data");
  const explanation = draftExplanation ?? (markState.active ? markState.explanation : "");
  const canApply = markState.hasSelection && explanation.trim().length > 0;

  const applyMark = () => {
    if (!canApply) return;
    editor
      .chain()
      .focus()
      .setExamMark({ kind, explanation: explanation.trim() })
      .run();
    setDraftKind(null);
    setDraftExplanation(null);
  };

  const removeMark = () => {
    editor.chain().focus().unsetExamMark().run();
    setDraftKind(null);
    setDraftExplanation(null);
  };

  return (
    <div className="note-toolbar-group exam-mark-controls" role="group" aria-label="Eksamensmarkering">
      <select
        aria-label="Type markering"
        title="Type markering"
        value={kind}
        onChange={(event) => setDraftKind(event.target.value as ExamMarkKind)}
      >
        {EXAM_MARK_KINDS.map((option) => (
          <option key={option} value={option}>
            {examMarkKindLabels[option]}
          </option>
        ))}
      </select>

      <input
        type="text"
        aria-label="Hvorfor er dette viktig?"
        placeholder="Hvorfor er dette viktig?"
        maxLength={240}
        value={explanation}
        onChange={(event) => setDraftExplanation(event.target.value)}
        className="exam-mark-explanation-input"
      />

      <button type="button" onClick={applyMark} disabled={!canApply} title="Marker valgt tekst">
        Marker
      </button>

      <button type="button" onClick={removeMark} disabled={!markState.active} title="Fjern markering">
        Fjern
      </button>
    </div>
  );
};
