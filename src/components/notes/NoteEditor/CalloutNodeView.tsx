import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  Lightbulb,
  Link2,
  Puzzle,
  Sigma,
  Trash2,
  Unlink,
} from "lucide-react";

import type { Concept } from "../../../data/concepts/types";
import { getConceptByIdFromDatabase } from "../../../services/concepts/conceptService";
import { ConceptPicker } from "../../concepts/ConceptPicker/ConceptPicker";
import type { CalloutType } from "./Callout";

const calloutInformation = {
  definition: {
    title: "Definisjon",
    icon: BookOpen,
  },

  tip: {
    title: "Tips",
    icon: Lightbulb,
  },

  theorem: {
    title: "Teorem",
    icon: Sigma,
  },

  example: {
    title: "Eksempel",
    icon: Puzzle,
  },

  exam: {
    title: "Dette må du kunne til eksamen",
    icon: BadgeCheck,
  },
} satisfies Record<
  CalloutType,
  {
    title: string;
    icon: typeof BookOpen;
  }
>;

export const CalloutNodeView = ({
  node,
  editor,
  updateAttributes,
  deleteNode,
}: NodeViewProps) => {
  const [isConceptPickerOpen, setIsConceptPickerOpen] = useState(false);
  const [concept, setConcept] = useState<Concept | undefined>();

  const storedType = node.attrs.type as string | undefined;

  const type: CalloutType =
    storedType && storedType in calloutInformation
      ? (storedType as CalloutType)
      : "definition";

  const conceptId = node.attrs.conceptId as string | null;
  const conceptName = node.attrs.conceptName as string | null;

  const callout = calloutInformation[type];
  const Icon = callout.icon;

  const canLinkConcept = type === "definition" || type === "theorem";

  useEffect(() => {
    let isCancelled = false;

    const loadConcept = async () => {
      if (!conceptId) {
        setConcept(undefined);
        return;
      }

      try {
        const loadedConcept = await getConceptByIdFromDatabase(conceptId);

        if (!isCancelled) {
          setConcept(loadedConcept);
        }
      } catch (error) {
        console.error("Kunne ikke hente konsept:", error);

        if (!isCancelled) {
          setConcept(undefined);
        }
      }
    };

    void loadConcept();

    return () => {
      isCancelled = true;
    };
  }, [conceptId]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value as CalloutType;

    updateAttributes({
      type: newType,

      conceptId:
        newType === "definition" || newType === "theorem" ? conceptId : null,
    });

    setIsConceptPickerOpen(false);
  };

  const handleDelete = () => {
    deleteNode();
  };

  return (
    <NodeViewWrapper
      className="note-callout"
      data-callout-type={type}
      data-concept-id={conceptId ?? undefined}
    >
      <div className="note-callout-header" contentEditable={false}>
        <div className="note-callout-heading">
          <Icon size={18} />

          <span>{callout.title}</span>
        </div>

        {editor.isEditable && (
          <div className="note-callout-actions">
            <select
              className="note-callout-type-select"
              value={type}
              onChange={handleTypeChange}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              aria-label="Endre callout-type"
            >
              <option value="definition">Definisjon</option>

              <option value="tip">Tips</option>

              <option value="theorem">Teorem</option>

              <option value="example">Eksempel</option>

              <option value="exam">Dette må du kunne til eksamen</option>
            </select>

            <button
              type="button"
              className="note-callout-delete-button"
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={handleDelete}
              title="Slett callout"
              aria-label="Slett callout"
            >
              <Trash2 size={17} />
            </button>
          </div>
        )}
      </div>

      {canLinkConcept && editor.isEditable && (
        <input
          type="text"
          className="note-callout-concept-name"
          value={conceptName ?? ""}
          onChange={(event) => {
            updateAttributes({
              conceptName: event.target.value,
            });
          }}
          placeholder={type === "theorem" ? "Navn på teorem" : "Navn på begrep"}
        />
      )}

      {canLinkConcept && (
        <div className="note-callout-concept" contentEditable={false}>
          {concept ? (
            <div className="note-callout-concept-selected">
              <span>{concept.name}</span>

              {editor.isEditable && (
                <button
                  type="button"
                  className="note-callout-concept-unlink"
                  onClick={() => {
                    updateAttributes({
                      conceptId: null,
                    });
                  }}
                  title="Fjern kobling til begrep"
                  aria-label="Fjern kobling til begrep"
                >
                  <Unlink size={15} />
                </button>
              )}
            </div>
          ) : (
            editor.isEditable && (
              <button
                type="button"
                className="note-callout-concept-button"
                onClick={() => {
                  setIsConceptPickerOpen((current) => !current);
                }}
              >
                <Link2 size={16} />
                Koble til begrep
              </button>
            )
          )}

          {editor.isEditable && concept && (
            <button
              type="button"
              className="note-callout-concept-change"
              onClick={() => {
                setIsConceptPickerOpen((current) => !current);
              }}
            >
              Endre
            </button>
          )}

          {isConceptPickerOpen && (
            <ConceptPicker
              onSelect={(selectedConcept) => {
                updateAttributes({
                  conceptId: selectedConcept.id,
                });

                setConcept(selectedConcept);
                setIsConceptPickerOpen(false);
              }}
              onClose={() => {
                setIsConceptPickerOpen(false);
              }}
            />
          )}
        </div>
      )}

      <NodeViewContent className="note-callout-body" />
    </NodeViewWrapper>
  );
};
