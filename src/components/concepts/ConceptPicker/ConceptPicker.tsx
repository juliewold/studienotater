import "./ConceptPicker.css";

import { useEffect, useState } from "react";

import { getConceptsFromDatabase } from "../../../services/concepts/conceptService";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadConcepts = async () => {
      setIsLoading(true);

      try {
        const loadedConcepts = await getConceptsFromDatabase();

        if (!isCancelled) {
          setConcepts(loadedConcepts);
        }
      } catch (error) {
        console.error("Kunne ikke hente konsepter:", error);

        if (!isCancelled) {
          setConcepts([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadConcepts();

    return () => {
      isCancelled = true;
    };
  }, []);

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
        {isLoading ? (
          <p className="concept-picker-empty">Henter begreper...</p>
        ) : filteredConcepts.length === 0 ? (
          <p className="concept-picker-empty">Ingen begreper funnet</p>
        ) : (
          filteredConcepts.map((concept) => (
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
          ))
        )}
      </div>
    </div>
  );
};
