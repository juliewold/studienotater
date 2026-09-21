import "./ConceptPopover.css";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Concept } from "../../../data/concepts/types";
import { getRelatedConcepts } from "../../../services/concepts/conceptService";
import {
  getConceptContent,
  type ConceptContentSource,
} from "../../../services/concepts/conceptContentService";

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
  const [conceptContent, setConceptContent] = useState<ConceptContentSource[]>(
    [],
  );

  const [isConceptContentLoading, setIsConceptContentLoading] = useState(false);

  const relatedConcepts = getRelatedConcepts(concept);

  const textContent = conceptContent.filter(
    (item) => item.type === "definition" || item.type === "theorem",
  );

  useEffect(() => {
    let isCancelled = false;

    const loadConceptContent = async () => {
      setIsConceptContentLoading(true);

      try {
        const content = await getConceptContent(concept.id);

        if (!isCancelled) {
          setConceptContent(content);
        }
      } catch (error) {
        console.error("Kunne ikke hente konseptinnhold:", error);

        if (!isCancelled) {
          setConceptContent([]);
        }
      } finally {
        if (!isCancelled) {
          setIsConceptContentLoading(false);
        }
      }
    };

    void loadConceptContent();

    return () => {
      isCancelled = true;
    };
  }, [concept.id]);
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

      {!isConceptContentLoading && conceptContent.length === 0 && (
        <p>{concept.shortDefinition}</p>
      )}
      {isConceptContentLoading && (
        <p className="concept-popover-content-status">Henter innhold...</p>
      )}

      {!isConceptContentLoading && conceptContent.length > 0 && (
        <div className="concept-popover-note-content">
          {textContent.map((item, index) => (
            <div
              key={`${item.noteId}-${item.type}-${index}`}
              className="concept-popover-note-item"
            >
              <span className="concept-popover-note-type">
                {item.type === "definition" ? "Definisjon" : "Teorem"}
              </span>

              {item.type !== "formula" && (
                <div
                  className="concept-popover-note-html"
                  dangerouslySetInnerHTML={{
                    __html: item.html,
                  }}
                />
              )}

              <Link
                to={`/fag/${item.subjectId}/notater/${item.noteSlug}`}
                className="concept-popover-note-source"
                onClick={onClose}
              >
                Fra {item.noteTitle} →
              </Link>
            </div>
          ))}
        </div>
      )}
      {concept.explanation &&
        !isConceptContentLoading &&
        conceptContent.length === 0 && (
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
