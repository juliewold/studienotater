import type { Concept } from "../../data/concepts/types";

export type RecognizedConcept = {
  concept: Concept;
  from: number;
  to: number;
};

export function findConceptsInText(
  text: string,
  concepts: Concept[],
): RecognizedConcept[] {
  if (!text.trim()) {
    return [];
  }

  const matches: RecognizedConcept[] = [];

  concepts.forEach((concept) => {
    const conceptName = concept.name.trim();

    if (!conceptName) {
      return;
    }

    const escapedName = conceptName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const expression = new RegExp(
      `(^|[^\\p{L}\\p{N}])(${escapedName})(?=$|[^\\p{L}\\p{N}])`,
      "giu",
    );

    let match: RegExpExecArray | null;

    while ((match = expression.exec(text)) !== null) {
      const prefix = match[1] ?? "";
      const matchedName = match[2];

      if (!matchedName) {
        continue;
      }

      const from = match.index + prefix.length;

      matches.push({
        concept,
        from,
        to: from + matchedName.length,
      });
    }
  });

  return matches.sort((first, second) => {
    if (first.from !== second.from) {
      return first.from - second.from;
    }

    return second.to - second.from - (first.to - first.from);
  });
}
