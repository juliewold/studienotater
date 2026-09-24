import "./ConceptSuggestions.css";

import {
  updateConceptSuggestionStatus,
  type ConceptSuggestion,
} from "../../../services/concepts/conceptSuggestionsService";
import { createConcept } from "../../../services/concepts/conceptService";
import { addConceptSubtopic } from "../../../services/concepts/conceptSubtopicsService";

type ConceptSuggestionsProps = {
  suggestions: ConceptSuggestion[];
  subtopicId: string | null;
  onSuggestionUpdated: () => void;
};

export const ConceptSuggestions = ({
  suggestions,
  subtopicId,
  onSuggestionUpdated,
}: ConceptSuggestionsProps) => {
  const pendingSuggestions = suggestions.filter(
    (suggestion) => suggestion.status === "pending",
  );

  const handleAccept = async (suggestion: ConceptSuggestion) => {
    if (!suggestion.type || !suggestion.shortDefinition || !subtopicId) {
      return;
    }

    try {
      const concept = await createConcept(
        suggestion.name,
        suggestion.type,
        suggestion.shortDefinition,
      );

      await addConceptSubtopic(concept.id, subtopicId);

      await updateConceptSuggestionStatus(suggestion.id, "accepted");

      onSuggestionUpdated();
    } catch (error) {
      console.error("Kunne ikke godkjenne konseptforslag:", error);
    }
  };

  const handleReject = async (suggestionId: string) => {
    try {
      await updateConceptSuggestionStatus(suggestionId, "rejected");
      onSuggestionUpdated();
    } catch (error) {
      console.error("Kunne ikke avvise konseptforslag:", error);
    }
  };

  if (pendingSuggestions.length === 0) {
    return null;
  }

  return (
    <section className="concept-suggestions">
      <h2>Foreslåtte begreper</h2>

      <div className="concept-suggestions-list">
        {pendingSuggestions.map((suggestion) => (
          <div className="concept-suggestion" key={suggestion.id}>
            <span>{suggestion.name}</span>

            <div className="concept-suggestion-actions">
              <button
                type="button"
                onClick={() => void handleAccept(suggestion)}
                disabled={
                  !suggestion.type || !suggestion.shortDefinition || !subtopicId
                }
              >
                Godkjenn
              </button>

              <button
                type="button"
                onClick={() => void handleReject(suggestion.id)}
              >
                Avvis
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
