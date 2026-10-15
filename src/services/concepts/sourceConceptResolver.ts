import type { Concept } from "../../data/concepts/types";
import { normalizeConceptName } from "./conceptService";

const headingSelector = "h1,h2,h3,h4,h5,h6";
const blockSelector = '[data-type="callout"], [data-type="block-math"]';

/** Resolve legacy source ownership at read time. Never mutate persisted note data.
 * Names must resolve uniquely; explicit IDs/names take precedence over context.
 * A heading's scope ends at the next heading of equal or higher rank.
 */
export function resolveSourceConcepts(content: string, concepts: Concept[]): string {
  const doc = new DOMParser().parseFromString(content, "text/html");
  const names = new Map<string, Set<string>>();
  for (const concept of concepts) {
    const name = normalizeConceptName(concept.name);
    names.set(name, new Set([...(names.get(name) ?? []), concept.id]));
  }
  const match = (label: string | null | undefined) => {
    const text = normalizeConceptName(label ?? "").replace(/^\d+(?:\.\d+)*[.)]?\s+/, "");
    // Accept a title followed by an explanatory subtitle, never a substring mention.
    const candidates = [text, text.split(/\s+[–—-]\s+|:\s+/u)[0]];
    const ids = new Set(candidates.flatMap(name => [...(names.get(name) ?? [])]));
    return ids.size === 1 ? [...ids][0] : undefined;
  };
  const headings: { level: number; id?: string }[] = [];
  for (const element of doc.querySelectorAll<HTMLElement>(`${headingSelector}, ${blockSelector}`)) {
    if (element.matches(headingSelector)) {
      // Headings inside a box describe that box, not the following note sections.
      if (element.closest(blockSelector)) continue;
      const level = Number(element.tagName[1]);
      while (headings.length && headings.at(-1)!.level >= level) headings.pop();
      headings.push({ level, id: match(element.textContent) });
      continue;
    }
    const math = element.dataset.type === "block-math";
    const key = math ? "formulaConceptId" : "conceptId";
    if (element.dataset[key]?.trim()) continue;
    const explicitName = element.dataset.conceptName?.trim();
    let id = explicitName ? match(explicitName) : undefined;
    // An unmatched explicit name must not inherit an unrelated section's concept.
    if (explicitName && !id) continue;
    if (!id && !math) {
      const body = element.querySelector(":scope > .note-callout-body");
      const title = body?.firstElementChild;
      if (title?.matches(headingSelector)) id = match(title.textContent);
      const term = title?.querySelector("strong, b");
      if (!id && title?.tagName === "P" && term?.parentElement === title) {
        const before = doc.createRange();
        before.setStart(title, 0); before.setEndBefore(term);
        const after = doc.createRange();
        after.setStartAfter(term); after.setEnd(title, title.childNodes.length);
        const defining = element.dataset.calloutType === "definition" && /^\s*(?:er|is|means|betyr)(?:\s|$)/iu.test(after.toString());
        const titleOnly = !after.toString().trim() || /^\s*[:–—-]\s/u.test(after.toString());
        if (/^\s*(?:(?:en|ei|et|a|an)\s+)?$/iu.test(before.toString()) && (defining || titleOnly)) id = match(term.textContent);
      }
    }
    const parent = element.parentElement?.closest<HTMLElement>('[data-type="callout"]');
    // Nested math stays inside its source box; don't assign a competing heading owner.
    if (!id && parent) id = parent.dataset.conceptId;
    if (!id && !parent) id = [...headings].reverse().find(heading => heading.id)?.id;
    if (id) {
      element.dataset[key] = id;
      if (math && !parent) element.dataset.sourceContext = "heading";
    }
  }
  return doc.body.innerHTML;
}
