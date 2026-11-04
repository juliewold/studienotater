import { Children, useContext, type ReactNode } from "react";
import { RevealContext } from "./reveal";

// Shared drawing helpers for lesson figures. Colours come from CSS classes (lf-*)
// in Curriculum.css, so every figure follows the light and dark themes.

/** Each child of the figure is one part; the lecture player reveals them in order. */
export function Svg({ label, width, height, children }: { label: string; width: number; height: number; children: ReactNode }) {
  const reveal = useContext(RevealContext);
  return <svg className="lesson-figure-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
    <title>{label}</title>
    <defs>
      <marker id="lf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" className="lf-fill-ink" />
      </marker>
    </defs>
    {Children.toArray(children).map((child, index) => <g key={index} className={index < reveal ? "lf-step" : "lf-step is-hidden"}>{child}</g>)}
  </svg>;
}

export function Box({ x, y, w, h, title, sub, accent = false }: { x: number; y: number; w: number; h: number; title: string; sub?: string; accent?: boolean }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" className={accent ? "lf-box-accent" : "lf-box"} />
    <text x={x + w / 2} y={y + (sub ? h / 2 - 4 : h / 2 + 5)} textAnchor="middle" className="lf-text lf-strong">{title}</text>
    {sub && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" className="lf-text lf-muted">{sub}</text>}
  </g>;
}


const cell = 64;

/** A row of array cells with optional index labels below. */
export function Cells({ values, x, y, highlight, label }: { values: (number | string)[]; x: number; y: number; highlight: (index: number) => string; label?: (index: number) => string }) {
  return <g>{values.map((value, index) => <g key={index}>
    <rect x={x + index * (cell + 8)} y={y} width={cell} height={cell - 14} rx="8" className={highlight(index)} />
    <text x={x + index * (cell + 8) + cell / 2} y={y + 31} textAnchor="middle" className="lf-text lf-strong">{value}</text>
    {label && <text x={x + index * (cell + 8) + cell / 2} y={y + cell + 4} textAnchor="middle" className="lf-text lf-small lf-muted">{label(index)}</text>}
  </g>)}</g>;
}
