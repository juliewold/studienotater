import "./ConceptSuggestions.css";

import { useState } from "react";

import {
  updateConceptSuggestionStatus,
  type ConceptSuggestion,
} from "../../../services/concepts/conceptSuggestionsService";
import { createConcept } from "../../../services/concepts/conceptService";
import { addConceptSubtopic } from "../../../services/concepts/conceptSubtopicsService";

const conceptTypeLabels = {
  definition: "Definisjon",
  theorem: "Teorem",
  formula: "Formel",
  method: "Metode",
} as const;

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
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(
    null,
  );
  const [editedName, setEditedName] = useState("");
  const [editedType, setEditedType] = useState<ConceptSuggestion["type"]>(null);
  const [editedShortDefinition, setEditedShortDefinition] = useState("");

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

  const handleAcceptEdited = async (suggestion: ConceptSuggestion) => {
    const trimmedName = editedName.trim();
    const trimmedShortDefinition = editedShortDefinition.trim();

    if (!trimmedName || !editedType || !trimmedShortDefinition || !subtopicId) {
      return;
    }

    try {
      const concept = await createConcept(
        trimmedName,
        editedType,
        trimmedShortDefinition,
      );

      await addConceptSubtopic(concept.id, subtopicId);

      await updateConceptSuggestionStatus(suggestion.id, "accepted");

      setEditingSuggestionId(null);
      onSuggestionUpdated();
    } catch (error) {
      console.error("Kunne ikke godkjenne redigert konseptforslag:", error);
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
        {pendingSuggestions.map((suggestion) => {
          const isEditing = editingSuggestionId === suggestion.id;

          return (
            <div className="concept-suggestion" key={suggestion.id}>
              <div className="concept-suggestion-content">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(event) => setEditedName(event.target.value)}
                  />
                ) : (
                  <h3>{suggestion.name}</h3>
                )}

                {isEditing ? (
                  <select
                    value={editedType ?? ""}
                    onChange={(event) =>
                      setEditedType(
                        event.target.value as NonNullable<
                          ConceptSuggestion["type"]
                        >,
                      )
                    }
                  >
                    <option value="definition">Definisjon</option>
                    <option value="theorem">Teorem</option>
                    <option value="formula">Formel</option>
                    <option value="method">Metode</option>
                  </select>
                ) : (
                  suggestion.type && (
                    <span className="concept-suggestion-type">
                      {conceptTypeLabels[suggestion.type]}
                    </span>
                  )
                )}

                {isEditing ? (
                  <textarea
                    value={editedShortDefinition}
                    onChange={(event) =>
                      setEditedShortDefinition(event.target.value)
                    }
                  />
                ) : (
                  suggestion.shortDefinition && (
                    <p>{suggestion.shortDefinition}</p>
                  )
                )}
              </div>

              <div className="concept-suggestion-actions">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void handleAcceptEdited(suggestion)}
                      disabled={
                        !editedName.trim() ||
                        !editedType ||
                        !editedShortDefinition.trim() ||
                        !subtopicId
                      }
                    >
                      Lagre og godkjenn
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingSuggestionId(null)}
                    >
                      Avbryt
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSuggestionId(suggestion.id);
                        setEditedName(suggestion.name);
                        setEditedType(suggestion.type);
                        setEditedShortDefinition(
                          suggestion.shortDefinition ?? "",
                        );
                      }}
                      disabled={!suggestion.type || !suggestion.shortDefinition}
                    >
                      Rediger
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleAccept(suggestion)}
                      disabled={
                        !suggestion.type ||
                        !suggestion.shortDefinition ||
                        !subtopicId
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
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
