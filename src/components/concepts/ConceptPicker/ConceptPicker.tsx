import "./ConceptPicker.css";

import { getConcepts } from "../../../services/concepts/conceptService";
import type { Concept } from "../../../data/concepts/types";
import { useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");

  const concepts = getConcepts();

  const filteredConcepts = concepts.filter((concept) => {
    const query = searchQuery.toLowerCase();

    return (
      concept.name.toLowerCase().includes(query) ||
      concept.shortDefinition.toLowerCase().includes(query)
    );
  });

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

      <input
        type="text"
        className="concept-picker-search"
        placeholder="Søk etter begrep..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        autoFocus
      />

      <div className="concept-picker-list">
        {filteredConcepts.length === 0 && (
          <p className="concept-picker-empty">Ingen begreper funnet</p>
        )}
        {filteredConcepts.map((concept) => (
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
