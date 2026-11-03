import { useMemo, type CSSProperties } from "react";
import { RichText } from "../../curriculumShared";
import type { AnimationViewProps } from ".";
import { traceInsertionSort } from "./insertionSort";

/** Array cells that slide between positions, with key lifted above the hole and the active pseudocode line. */
export function InsertionSortView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceInsertionSort(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const lines = block.type === "pseudocode" ? block.lines : [];
  const position = new Map<number, number>();
  frame.slots.forEach((id, slot) => { if (id !== null) position.set(id, slot); });

  return <div className="lp-anim">
    <div className="lp-anim-stage" style={{ "--n": frame.values.length } as CSSProperties}>
      <div className="lp-anim-vars" aria-live="off">
        <span>i = {frame.i ?? "–"}</span>
        <span>j = {frame.j ?? "–"}</span>
        <span className={frame.key !== null ? "is-key" : undefined}>key = {frame.key !== null ? frame.values[frame.key] : "–"}</span>
        <span>flyttinger = {frame.shifts}</span>
      </div>
      <div className="lp-array" role="img" aria-label={`Tabellen: ${frame.slots.map(id => (id === null ? "tom" : frame.values[id])).join(", ")}`}>
        {frame.slots.map((_, slot) => <div key={slot} className={slot < frame.sorted && frame.slots[slot] === null ? "lp-slot is-hole is-sorted" : frame.slots[slot] === null ? "lp-slot is-hole" : slot < frame.sorted ? "lp-slot is-sorted" : "lp-slot"}
          style={{ "--slot": slot } as CSSProperties}><span>{slot + 1}</span></div>)}
        {frame.values.map((value, id) => {
          const lifted = id === frame.key;
          const slot = lifted ? frame.keySlot! : position.get(id)!;
          const state = lifted ? "is-key" : slot === frame.compare ? "is-compare" : slot < frame.sorted ? "is-sorted" : "";
          return <div key={id} className={`lp-cell ${state}`} style={{ "--slot": slot, "--lift": lifted ? 1 : 0 } as CSSProperties}>{value}</div>;
        })}
      </div>
    </div>
    <ol className="lp-anim-code" aria-label="Pseudokode">
      {lines.map((line, index) => <li key={index} className={frame.line === index + 1 ? "is-active" : undefined}><code>{line}</code></li>)}
    </ol>
    <p className="lp-anim-caption" aria-live="polite"><RichText>{frame.caption}</RichText></p>
  </div>;
}
