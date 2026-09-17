import "./ConceptPopover.css";

import type { Concept } from "../../../data/concepts/types";

type ConceptPopoverProps = {
  concept: Concept;
  left: number;
  top: number;
  onClose: () => void;
};

export const ConceptPopover = ({
  concept,
  left,
  top,
  onClose,
}: ConceptPopoverProps) => {
  return (
    <div
      className="concept-popover"
      style={{
        position: "fixed",
        left,
        top,
        zIndex: 1000,
      }}
    >
      <div className="concept-popover-header">
        <span className="concept-popover-type">{concept.type}</span>

        <button
          type="button"
          className="concept-popover-close"
          onClick={onClose}
          aria-label="Lukk"
        >
          ×
        </button>
      </div>

      <h3>{concept.name}</h3>

      <p>{concept.shortDefinition}</p>
    </div>
  );
};
