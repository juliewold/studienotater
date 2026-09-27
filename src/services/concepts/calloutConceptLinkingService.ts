import type { Concept } from "../../data/concepts/types";
import type { NoteContentJson } from "../notes/notesService";

type TiptapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  text?: string;
  content?: TiptapNode[];
};

export type CalloutConceptLinkingResult = {
  content: string;
  contentJson: NoteContentJson;
  linkedCallouts: number;
};

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase("nb-NO").normalize("NFC");
}

function getNodeText(node: TiptapNode): string {
  if (typeof node.text === "string") return node.text;
  return (node.content ?? []).map(getNodeText).join(" ").replace(/\s+/g, " ").trim();
}

function getCallouts(node: TiptapNode): TiptapNode[] {
  return [
    ...(node.type === "callout" ? [node] : []),
    ...(node.content ?? []).flatMap(getCallouts),
  ];
}

function findConcept(node: TiptapNode, concepts: Concept[]): Concept | undefined {
  const name = node.attrs?.conceptName;
  const hasName = typeof name === "string" && name.trim().length > 0;
  const text = normalizeText(hasName ? name : getNodeText(node));
  if (!text) return undefined;

  const matches = concepts.filter((concept) => {
    const candidate = normalizeText(concept.name);
    if (!candidate) return false;
    return text === candidate || (!hasName &&
      [" ", ":", "–", "-"].some((separator) => text.startsWith(candidate + separator)));
  }).sort((a, b) => b.name.length - a.name.length);

  // Ambiguous names should be linked manually instead of choosing an arbitrary ID.
  if (matches[1] && normalizeText(matches[0].name) === normalizeText(matches[1].name)
    && matches[0].id !== matches[1].id) return undefined;
  return matches[0];
}

export function linkCalloutsToConcepts(
  content: string,
  contentJson: NoteContentJson,
  concepts: Concept[],
): CalloutConceptLinkingResult {
  const unchanged = { content, contentJson, linkedCallouts: 0 };
  if (!contentJson || !concepts.length) return unchanged;

  const cloned = structuredClone(contentJson) as TiptapNode;
  const nodes = getCallouts(cloned);
  const document = new DOMParser().parseFromString(content, "text/html");
  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-type='callout']"));

  // Match every box by position, including unmatched and already linked boxes.
  // Refuse stale representations rather than saving different links in HTML and JSON.
  if (nodes.length !== elements.length) return unchanged;
  const compact = (text: string) => text.replace(/\s+/g, "");
  const aligned = nodes.every((node, index) => {
    const element = elements[index];
    const body = element.querySelector(":scope > .note-callout-body");
    return body && node.attrs?.type === element.dataset.calloutType
      && (node.attrs?.conceptId || "") === (element.dataset.conceptId || "")
      && (node.attrs?.conceptName || "") === (element.dataset.conceptName || "")
      && compact(getNodeText(node)) === compact(body.textContent ?? "");
  });
  if (!aligned) return unchanged;

  let linkedCallouts = 0;
  nodes.forEach((node, index) => {
    if (node.attrs?.conceptId ||
      (node.attrs?.type !== "definition" && node.attrs?.type !== "theorem")) return;
    const concept = findConcept(node, concepts);
    if (!concept) return;

    node.attrs = { ...node.attrs, conceptId: concept.id };
    elements[index].dataset.conceptId = concept.id;
    linkedCallouts += 1;
  });

  return linkedCallouts ? {
    content: document.body.innerHTML,
    contentJson: cloned,
    linkedCallouts,
  } : unchanged;
}
