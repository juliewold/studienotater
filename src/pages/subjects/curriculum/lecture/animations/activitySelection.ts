// Step-by-step trace of Greedy-Activity-Selector(s, f, n) from lecture 7, on the eleven activities of CLRS
// 15.1 (sorted by finish time, as the algorithm needs). Every activity is compared with the last one
// chosen, and the frame says why it is chosen or left out.

export type ActivityFrame = {
  caption: string;
  /** Index into the lines of Greedy-Activity-Selector(s, f, n). */
  line: number | null;
  /** Activities chosen so far, 1-based, and the last chosen one, k. */
  chosen: number[];
  k: number;
  /** The activity being considered, 1-based, and whether it was chosen. */
  m: number | null;
  decision: "chosen" | "rejected" | null;
};

/** Start and finish times of a1 … a11, sorted by finish time. */
export const activityStarts = [1, 3, 0, 5, 3, 5, 6, 7, 8, 2, 12];
export const activityFinishes = [4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16];

export function traceActivities(s = activityStarts, f = activityFinishes): ActivityFrame[] {
  const n = s.length;
  const frames: ActivityFrame[] = [];
  const chosen = [1];
  let k = 1;
  const snap = (frame: Pick<ActivityFrame, "caption" | "line" | "m" | "decision">) =>
    frames.push({ ...frame, chosen: [...chosen], k });

  snap({ line: 0, m: 1, decision: "chosen", caption: `a1 har den tidligste sluttiden, ${f[0]}, så den velges først. Mengden A inneholder bare a1.` });
  for (let m = 2; m <= n; m++) {
    const start = s[m - 1], end = f[m - 1], last = f[k - 1];
    if (start >= last) {
      chosen.push(m);
      k = m;
      snap({ line: 4, m, decision: "chosen", caption: `a${m} starter ved ${start}, etter eller samtidig med sluttiden ${last} til den sist valgte aktiviteten a${chosen[chosen.length - 2]}. Da passer den inn, og a${m} velges. Den slutter ved ${end}.` });
    } else {
      snap({ line: 3, m, decision: "rejected", caption: `a${m} starter ved ${start}, som er før ${last}, sluttiden til a${k}. Da overlapper den a${k}, så a${m} forkastes.` });
    }
  }
  snap({ line: 6, m: null, decision: null, caption: `Ferdig. Vi valgte ${chosen.map(i => `a${i}`).join(", ")}: ${chosen.length} aktiviteter som ikke overlapper, og ingen annen løsning har flere.` });
  return frames;
}
