import "./ConceptPicker.css";

import { concepts } from "../../../data/concepts/concepts";
import type { Concept } from "../../../data/concepts/types";

const conceptTypeLabels = {
  definition: "Definisjon",
  theorem: "Teorem",
  formula: "Formel",
  method: "Metode",
};

type ConceptPickerProps = {
  onSelect: (concept: Concept) => void;
  onClose: () => void;
};

export const ConceptPicker = ({ onSelect, onClose }: ConceptPickerProps) => {
  return (
    <div className="concept-picker">
      <div className="concept-picker-header">
        <span>Velg begrep</span>

        <button
          type="button"
          className="concept-picker-close"
          onClick={onClose}
          aria-label="Lukk"
        >
          ×
        </button>
      </div>

      <div className="concept-picker-list">
        {concepts.map((concept) => (
          <button
            key={concept.id}
            type="button"
            className="concept-picker-item"
            onClick={() => onSelect(concept)}
          >
            <span className="concept-picker-name">{concept.name}</span>
            <span className="concept-picker-type">
              {conceptTypeLabels[concept.type]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
