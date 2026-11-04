// Step-by-step trace of Gale-Shapley(men, women, rankings) from lecture 7, with the women proposing, on the
// example of the figure. Every proposal is one step: the man is free and accepts, he trades up and
// dumps his old partner, or he rejects her. The rejected proposals are kept, so the history is visible.

export type GaleEvent = "free" | "swap" | "reject";

export type GaleFrame = {
  caption: string;
  /** Index into the lines of Gale-Shapley(men, women, rankings). */
  line: number | null;
  /** Current engagements: woman → man. */
  engaged: Record<string, string>;
  /** Women who are still free and have someone left to propose to. */
  free: string[];
  /** The proposal being decided, and what happened to it. */
  proposal: [string, string] | null;
  event: GaleEvent | null;
  /** Proposals that were rejected so far, as woman–man pairs. */
  rejected: [string, string][];
  /** The woman dumped by a man who traded up, if any. */
  dumped: string | null;
};

export const galeWomen: Record<string, string[]> = { w1: ["m1", "m2", "m3"], w2: ["m1", "m3", "m2"], w3: ["m2", "m1", "m3"] };
export const galeMen: Record<string, string[]> = { m1: ["w2", "w1", "w3"], m2: ["w1", "w3", "w2"], m3: ["w3", "w2", "w1"] };

export function traceGaleShapley(women = galeWomen, men = galeMen): GaleFrame[] {
  const next: Record<string, number> = Object.fromEntries(Object.keys(women).map(w => [w, 0]));
  const engaged: Record<string, string> = {};
  const partnerOf: Record<string, string> = {};
  const rejected: [string, string][] = [];
  const frames: GaleFrame[] = [];
  const freeWomen = () => Object.keys(women).filter(w => !engaged[w]);
  const snap = (frame: Pick<GaleFrame, "caption" | "line" | "proposal" | "event" | "dumped">) =>
    frames.push({ ...frame, engaged: { ...engaged }, free: freeWomen(), rejected: rejected.map(pair => [...pair] as [string, string]) });

  snap({ line: 0, proposal: null, event: null, dumped: null, caption: `Alle kvinnene er frie, og ingen menn er forlovet. Hver kvinne frir til den første på sin liste som hun ikke har prøvd ennå.` });
  let w = freeWomen()[0];
  while (w) {
    const m = women[w][next[w]++];
    const current = partnerOf[m];
    if (!current) {
      engaged[w] = m; partnerOf[m] = w;
      snap({ line: 3, proposal: [w, m], event: "free", dumped: null, caption: `${w} frir til ${m}. ${m} er fri, så de blir forlovet med hverandre.` });
    } else if (men[m].indexOf(w) < men[m].indexOf(current)) {
      delete engaged[current]; engaged[w] = m; partnerOf[m] = w;
      snap({ line: 6, proposal: [w, m], event: "swap", dumped: current, caption: `${w} frir til ${m}. ${m} er forlovet med ${current}, men han foretrekker ${w}. Han bryter med ${current}, som blir ledig, og forlover seg med ${w}.` });
    } else {
      rejected.push([w, m]);
      snap({ line: 8, proposal: [w, m], event: "reject", dumped: null, caption: `${w} frir til ${m}. ${m} er forlovet med ${current} og foretrekker henne. Han avslår ${w}, som fortsatt er ledig.` });
    }
    w = freeWomen()[0];
  }
  const pairs = Object.entries(engaged).map(([woman, man]) => `${woman}–${man}`).join(", ");
  snap({ line: 9, proposal: null, event: null, dumped: null, caption: `Ingen kvinner er ledige lenger. Matchingen er ${pairs}. Ingen par vil heller bytte: det er den stabile matchingen.` });
  return frames;
}
