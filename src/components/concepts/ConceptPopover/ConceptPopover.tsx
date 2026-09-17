import "./ConceptPopover.css";

import type { Concept } from "../../../data/concepts/types";
import { getRelatedConcepts } from "../../../services/concepts/conceptService";

const conceptTypeLabels = {
  definition: "Definisjon",
  theorem: "Teorem",
  formula: "Formel",
  method: "Metode",
};

type ConceptPopoverProps = {
  concept: Concept;
  left: number;
  top: number;
  onClose: () => void;
  onSelectConcept: (concept: Concept) => void;
};

export const ConceptPopover = ({
  concept,
  left,
  top,
  onClose,
  onSelectConcept,
}: ConceptPopoverProps) => {
  const relatedConcepts = getRelatedConcepts(concept);
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
        <span className="concept-popover-type">
          {conceptTypeLabels[concept.type]}
        </span>

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
      {relatedConcepts.length > 0 && (
        <div className="concept-popover-related">
          <span className="concept-popover-related-label">
            Relaterte begreper
          </span>

          <div className="concept-popover-related-list">
            {relatedConcepts.map((relatedConcept) => (
              <button
                key={relatedConcept.id}
                type="button"
                className="concept-popover-related-item"
                onClick={() => onSelectConcept(relatedConcept)}
              >
                {relatedConcept.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
