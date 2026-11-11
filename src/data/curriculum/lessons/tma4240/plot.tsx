// The TMA4240 plot component: axes, curves, stems, shaded areas, bands and legend.

import { useId } from "react";
import { Svg } from "../figureKit";
import { grid, type Pt } from "../../plotmath";

export type Tone = "ink" | "accent" | "warn" | "muted";
export type Curve = { name: string; tone: Tone; dashed?: boolean; points: Pt[] };
export type Stems = { name: string; tone: Tone; values: Pt[] };
export type Scatter = { name: string; tone: Tone; points: Pt[] };
export type Shade = { from: number; to: number; fn: (x: number) => number; tone: Tone };
export type VLine = { x: number; label: string; tone: Tone };
export type Band = { name: string; tone: Tone; lower: (x: number) => number; upper: (x: number) => number; from: number; to: number };


const toneLine: Record<Tone, string> = { ink: "lf-curve", accent: "lf-curve lf-stroke-accent", warn: "lf-curve lf-stroke-warn", muted: "lf-curve lf-muted-stroke" };
const toneFill: Record<Tone, string> = { ink: "lf-region", accent: "lf-fill-accent", warn: "lf-fill-warn", muted: "lf-region" };
const toneDot: Record<Tone, string> = { ink: "lf-fill-ink", accent: "lf-fill-accent", warn: "lf-fill-warn", muted: "lf-fill-ink" };
const toneStem: Record<Tone, string> = { ink: "lf-axis", accent: "lf-stroke-accent", warn: "lf-stroke-warn", muted: "lf-muted-stroke" };

export function Plot({ label, x, y, xTicks, yTicks, xTitle, curves = [], stems = [], shades = [], scatter = [], vlines = [], bands = [], width = 640, height = 250 }: {
  label: string; x: [number, number]; y: [number, number]; xTicks: number[]; yTicks: number[]; xTitle?: string;
  curves?: Curve[]; stems?: Stems[]; shades?: Shade[]; scatter?: Scatter[]; vlines?: VLine[]; bands?: Band[]; width?: number; height?: number;
}) {
  const padL = 44, padR = 16, padT = 14, padB = 56;
  const iw = width - padL - padR, ih = height - padT - padB;
  const clipId = `plot-clip-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [x0, x1] = x, [y0, y1] = y;
  const sx = (v: number) => padL + ((v - x0) / (x1 - x0)) * iw;
  const sy = (v: number) => padT + ih - ((v - y0) / (y1 - y0)) * ih;
  const base = padT + ih;
  const path = (pts: Pt[]) => pts.map(([a, b]) => `${sx(a).toFixed(1)},${sy(b).toFixed(1)}`).join(" ");
  const legend: { name: string; tone: Tone; dashed?: boolean }[] = [...bands.map(b => ({ name: b.name, tone: b.tone, dashed: false })), ...curves.map(c => ({ name: c.name, tone: c.tone, dashed: c.dashed })),
    ...stems.map(s => ({ name: s.name, tone: s.tone })), ...scatter.map(s => ({ name: s.name, tone: s.tone }))];
  // Place legend entries after each other, using an estimated text width, so long names do not overlap.
  const legendPositions = legend.reduce<{ item: (typeof legend)[number]; lx: number }[]>((acc, item) => {
    const previous = acc[acc.length - 1];
    const lx = previous ? previous.lx + 24 + previous.item.name.length * 6.6 + 18 : padL;
    return [...acc, { item, lx }];
  }, []);
  // Curves, shading and bands are clipped to the plot frame, so parts outside the y-range are not drawn over the axes.
  return <Svg label={label} width={width} height={height}>
    <clipPath id={clipId}><rect x={padL} y={padT} width={iw} height={ih} /></clipPath>
    <g clipPath={`url(#${clipId})`}>
    {shades.map((s, i) => {
      const pts = grid(s.from, s.to, 120).map(v => [v, s.fn(v)] as Pt);
      return <polygon key={i} className={`${toneFill[s.tone]}`} style={{ fillOpacity: 0.28 }}
        points={`${sx(s.from).toFixed(1)},${base} ${path(pts)} ${sx(s.to).toFixed(1)},${base}`} />;
    })}
    {bands.map((b, i) => {
      const xs = grid(b.from, b.to, 60);
      const top = xs.map(v => `${sx(v).toFixed(1)},${sy(b.upper(v)).toFixed(1)}`).join(" ");
      const bot = [...xs].reverse().map(v => `${sx(v).toFixed(1)},${sy(b.lower(v)).toFixed(1)}`).join(" ");
      return <polygon key={`band${i}`} className={toneFill[b.tone]} style={{ fillOpacity: 0.16 }} points={`${top} ${bot}`} />;
    })}
    </g>
    <line x1={padL} y1={base} x2={padL + iw} y2={base} className="lf-axis" />
    <line x1={padL} y1={padT} x2={padL} y2={base} className="lf-axis" />
    {xTicks.map(v => <g key={`x${v}`}>
      <line x1={sx(v)} y1={base} x2={sx(v)} y2={base + 4} className="lf-axis" />
      <text x={sx(v)} y={base + 15} textAnchor="middle" className="lf-text lf-small lf-muted">{v}</text>
    </g>)}
    {yTicks.map(v => <g key={`y${v}`}>
      <line x1={padL - 4} y1={sy(v)} x2={padL} y2={sy(v)} className="lf-axis" />
      <text x={padL - 7} y={sy(v) + 4} textAnchor="end" className="lf-text lf-small lf-muted">{v}</text>
    </g>)}
    {vlines.map(v => <g key={v.label}>
      <line x1={sx(v.x)} y1={padT} x2={sx(v.x)} y2={base} className={`lf-dashed ${toneStem[v.tone]}`} />
      <text x={sx(v.x) + 4} y={padT + 12} className="lf-text lf-small">{v.label}</text>
    </g>)}
    <g clipPath={`url(#${clipId})`}>
      {curves.map(c => <polyline key={c.name} points={path(c.points)} className={`${toneLine[c.tone]}${c.dashed ? " lf-dashed" : ""}`} fill="none" />)}
    </g>
    {stems.map(s => <g key={s.name}>
      {s.values.map(([a, b]) => <g key={a}>
        <line x1={sx(a)} y1={base} x2={sx(a)} y2={sy(b)} className={toneStem[s.tone]} />
        <circle cx={sx(a)} cy={sy(b)} r={3.2} className={toneDot[s.tone]} />
      </g>)}
    </g>)}
    {scatter.map(s => <g key={s.name}>{s.points.map(([a, b], i) => <circle key={i} cx={sx(a)} cy={sy(b)} r={3.2} className={toneDot[s.tone]} />)}</g>)}
    {xTitle && <text x={padL + iw / 2} y={base + 31} textAnchor="middle" className="lf-text lf-small lf-muted">{xTitle}</text>}
    {legendPositions.map(({ item, lx }) => <g key={item.name}>
      <line x1={lx} y1={height - 8} x2={lx + 18} y2={height - 8} className={`${toneLine[item.tone]}${item.dashed ? " lf-dashed" : ""}`} />
      <text x={lx + 24} y={height - 4} className="lf-text lf-small">{item.name}</text>
    </g>)}
  </Svg>;
}
