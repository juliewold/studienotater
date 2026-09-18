import "./ConceptPopover.css";

import { Link } from "react-router-dom";
import { useState } from "react";
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
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

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
      {concept.explanation && (
        <div className="concept-popover-explanation">
          <button
            type="button"
            className="concept-popover-explanation-toggle"
            onClick={() => setIsExplanationOpen((current) => !current)}
          >
            {isExplanationOpen ? "Skjul forklaring" : "Mer forklaring"}
          </button>

          {isExplanationOpen && (
            <p className="concept-popover-explanation-text">
              {concept.explanation}
            </p>
          )}
        </div>
      )}
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
                onClick={() => {
                  setIsExplanationOpen(false);
                  onSelectConcept(relatedConcept);
                }}
              >
                {relatedConcept.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <Link
        to={`/concepts/${concept.slug}`}
        className="concept-popover-page-link"
      >
        Åpne konseptside →
      </Link>
    </div>
  );
};
