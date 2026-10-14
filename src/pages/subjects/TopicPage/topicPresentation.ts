import type { Concept } from "../../../data/concepts/types";
import type { TopicBlock } from "../../../services/subjects/topicLearningService";

// Use explicit semantic links, not guesses about the meaning of arbitrary math.
// Unlabelled expressions remain available in the original source notes.
export function selectTopicRules(blocks: TopicBlock[], concepts: Concept[]) {
  const byId = new Map(concepts.map(concept => [concept.id, concept]));
  const seen = new Set<string>();
  return blocks.flatMap(block => {
    if (block.kind !== "rule") return [];
    const element = new DOMParser().parseFromString(block.html, "text/html").body.firstElementChild;
    if (!element) return [];
    const conceptId = element.getAttribute("data-formula-concept-id") ?? element.getAttribute("data-concept-id");
    const concept = conceptId ? byId.get(conceptId) : undefined;
    const name = concept?.name ?? element.getAttribute("data-concept-name") ?? "";
    const theorem = element.getAttribute("data-callout-type") === "theorem";
    if (!theorem && !name) return [];
    const key = block.latex?.trim() ?? element.textContent?.replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) return [];
    seen.add(key);
    return [{ ...block, name, description: concept?.shortDefinition ?? "" }];
  });
}

export function exampleTitle(block: TopicBlock, index: number) {
  const doc = new DOMParser().parseFromString(block.html, "text/html");
  const name = doc.querySelector("[data-concept-name]")?.getAttribute("data-concept-name");
  const text = name || doc.querySelector(".note-callout-body h2, .note-callout-body h3, .note-callout-body p")?.textContent?.trim();
  return text ? `${text.slice(0, 90)}${text.length > 90 ? "…" : ""}` : `Eksempel ${index + 1}`;
}
