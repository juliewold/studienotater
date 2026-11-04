import { useMemo } from "react";
import type { AnimationViewProps } from ".";
import { AlgorithmLayout } from "./graphCanvas";
import { Cells } from "./ArrayViews";
import { traceCountingSort } from "./countingSort";
import { knapsackValues, knapsackWeights, traceKnapsack } from "./knapsack";
import { traceLcs } from "./lcs";
import { traceRodCutting } from "./rodCutting";

// Views for the dynamic programming tables and the counting array. A table is drawn cell by cell:
// the cell being filled, the cells it depends on, and the cells on the traceback path are marked.

type Mark = "current" | "from" | "path" | "done" | "empty";

export function DpTable({ rowLabels, colLabels, cells, marks, notes }: {
  rowLabels: string[]; colLabels: string[]; cells: (string | null)[][]; marks: Mark[][]; notes?: (string | null)[][];
}) {
  return <table className="lp-dp-table" aria-label="Dynamisk programmering-tabell">
    <thead><tr><th scope="col" aria-label="rad" /><th scope="col" aria-label="tom" />{colLabels.map((label, j) => <th key={j} scope="col">{label}</th>)}</tr></thead>
    <tbody>{cells.map((row, i) => <tr key={i}>
      <th scope="row">{rowLabels[i]}</th>
      <th scope="row" className="lp-dp-rowlabel" aria-hidden="true">{i}</th>
      {row.map((value, j) => <td key={j} className={`is-${marks[i][j]}`}>
        {value ?? ""}
        {notes?.[i][j] && <span className="lp-dp-note" aria-hidden="true">{notes[i][j]}</span>}
      </td>)}
    </tr>)}</tbody>
  </table>;
}

export function LcsView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceLcs(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const X = "ABCBDAB", Y = "BDCABA";
  const cells = frame.c.map(row => row.map(value => (value === null ? null : String(value))));
  const marks: Mark[][] = frame.c.map((row, i) => row.map((value, j): Mark => {
    if (frame.cell && frame.cell[0] === i && frame.cell[1] === j) return "current";
    if (frame.neighbours.some(([a, b]) => a === i && b === j)) return "from";
    if (frame.path.some(([a, b]) => a === i && b === j)) return "path";
    return value === null ? "empty" : "done";
  }));
  const arrows = frame.b.map(row => row.map(arrow => arrow ?? ""));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <DpTable rowLabels={["", ...X.split("")]} colLabels={Y.split("")} cells={cells} marks={marks} notes={frame.b} />
    <div className="lp-anim-vars" aria-live="off">
      {frame.cell && <span>celle ({frame.cell[0]}, {frame.cell[1]}): pil {arrows[frame.cell[0]][frame.cell[1]] || "–"}</span>}
      <span className="is-key">Delsekvens: {frame.output || "–"}</span>
    </div>
  </AlgorithmLayout>;
}

export function KnapsackView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceKnapsack(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const rowLabels = ["Ingen", ...knapsackWeights.map((weight, i) => `${i + 1}: (${weight}, ${knapsackValues[i]})`)];
  const colLabels = Array.from({ length: frame.K[0].length }, (_, j) => String(j));
  const cells = frame.K.map(row => row.map(value => (value === null ? null : String(value))));
  const marks: Mark[][] = frame.K.map((row, i) => row.map((value, j): Mark => {
    if (frame.cell && frame.cell[0] === i && frame.cell[1] === j) return "current";
    if (frame.from.some(([a, b]) => a === i && b === j)) return "from";
    return value === null ? "empty" : "done";
  }));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <DpTable rowLabels={rowLabels} colLabels={colLabels} cells={cells} marks={marks} />
    <div className="lp-anim-vars" aria-live="off">
      <span>kapasitet = kolonnen, gjenstander = raden</span>
      <span className="is-key">Valgt: {frame.taken.length ? frame.taken.join(", ") : "–"}</span>
    </div>
  </AlgorithmLayout>;
}

export function CountingSortView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceCountingSort(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const k = frame.C.length - 1;
  const aTones = frame.A.map((_, index) => (frame.j === index ? "current" : "plain")) as ("current" | "plain")[];
  const cTones = frame.C.map((_, index) => (frame.j !== null && frame.A[frame.j] === index ? "current" : "plain")) as ("current" | "plain")[];
  const bTones = frame.B.map((_, index) => (frame.slot === index + 1 ? "current" : frame.B[index] !== null ? "sorted" : "plain")) as ("current" | "plain" | "sorted")[];
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <div className="lp-count-rows">
      <p className="lp-count-label">A (inndata), posisjon under</p>
      <Cells values={frame.A} tones={aTones} />
      <p className="lp-count-label">C, tellinger for verdiene 0 til {k}{frame.phase === "prefix" || frame.phase === "place" ? ", deretter summer" : ""}</p>
      <Cells values={frame.C} tones={cTones} marks={frame.C.map((_, index) => String(index))} />
      <p className="lp-count-label">B (resultat), plass 1 til {frame.B.length}</p>
      <Cells values={frame.B} tones={bTones} marks={frame.B.map((_, index) => String(index + 1))} />
    </div>
    <div className="lp-anim-vars" aria-live="off">
      <span className="is-key">fase: {frame.phase === "count" ? "telling" : frame.phase === "prefix" ? "summer" : "plassering"}</span>
      {frame.j !== null && <span>j = {frame.j + 1}</span>}
    </div>
  </AlgorithmLayout>;
}

export function RodView({ block, step }: AnimationViewProps) {
  const frames = useMemo(() => traceRodCutting(), []);
  const frame = frames[Math.min(step, frames.length - 1)];
  const n = frame.r.length - 1;
  const colLabels = Array.from({ length: n + 1 }, (_, j) => String(j));
  const cells: (string | null)[][] = [frame.r.map(value => (value === null ? null : String(value))), frame.s.map(value => (value === null ? null : String(value)))];
  // Column j is the one being filled; the r-cells it compares with are r[j − i].
  const marks: Mark[][] = cells.map((row, rowIndex) => row.map((value, j): Mark => {
    if (frame.j === j) return "current";
    if (frame.j !== null && frame.i !== null && rowIndex === 0 && j === frame.j - frame.i) return "from";
    if (frame.remaining !== null && rowIndex === 1 && j === frame.remaining) return "path";
    return value === null ? "empty" : "done";
  }));
  return <AlgorithmLayout block={block} line={frame.line} caption={frame.caption}>
    <DpTable rowLabels={["r[j]", "s[j]"]} colLabels={colLabels} cells={cells} marks={marks} />
    <div className="lp-anim-vars" aria-live="off">
      {frame.j !== null && <span>j = {frame.j}{frame.i !== null ? `, i = ${frame.i}` : ""}</span>}
      <span className="is-key">Stykker: {frame.pieces.length ? frame.pieces.join(" + ") : "–"}</span>
      {frame.remaining !== null && <span>igjen: {frame.remaining}</span>}
    </div>
  </AlgorithmLayout>;
}
