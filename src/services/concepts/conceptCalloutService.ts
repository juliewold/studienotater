import type { NoteContentJson } from "../notes/notesService";

export type ConceptCallout = {
  name: string;
  type: "definition" | "theorem";
  explanation: string;
};

type TipTapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
};

function getNodeText(node: TipTapNode): string {
  if (node.text) {
    return node.text;
  }

  return (node.content ?? [])
    .map(getNodeText)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getConceptCallouts(
  contentJson: NoteContentJson | undefined,
): ConceptCallout[] {
  if (!contentJson) {
    return [];
  }

  const concepts: ConceptCallout[] = [];

  const visitNode = (node: TipTapNode) => {
    if (node.type === "callout") {
      const type = node.attrs?.type;
      const conceptName = node.attrs?.conceptName;

      if (
        (type === "definition" || type === "theorem") &&
        typeof conceptName === "string" &&
        conceptName.trim()
      ) {
        concepts.push({
          name: conceptName.trim(),
          type,
          explanation: getNodeText(node),
        });
      }
    }

    node.content?.forEach(visitNode);
  };

  visitNode(contentJson as TipTapNode);

  return concepts;
}
