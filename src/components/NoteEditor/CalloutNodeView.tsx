import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import {
  BadgeCheck,
  BookOpen,
  Lightbulb,
  Puzzle,
  Sigma,
  Trash2,
} from "lucide-react";

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
  const type = (node.attrs.type as CalloutType) ?? "definition";

  const callout = calloutInformation[type];
  const Icon = callout.icon;

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateAttributes({
      type: event.target.value as CalloutType,
    });
  };

  const handleDelete = () => {
    deleteNode();
  };

  return (
    <NodeViewWrapper className="note-callout" data-callout-type={type}>
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

      <NodeViewContent className="note-callout-body" />
    </NodeViewWrapper>
  );
};
