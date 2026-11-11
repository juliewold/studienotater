// Figures for central concepts: CLT, confidence intervals, p-values, type I/II errors and power,
// residual and QQ plots, and confidence versus prediction intervals in regression.
// Curves are computed exactly from the formulas. Where a figure is illustrative, the caption says so.

import { Plot } from "./plot";
import { grid, gammaPdf, normCdf, normInv, normPdf, curveOf } from "../../plotmath";
import { Svg } from "../figureKit";

export function CLTFigure() {
  const xs = grid(0.001, 3, 300);
  // Mean of n Exp(β = 1) variables is Gamma(n, scale 1/n) exactly.
  return <Plot label="Fordelingen til gjennomsnittet av n eksponensialfordelte variable (μ = 1)" x={[0, 3]} y={[0, 2.2]}
    xTicks={[0, 0.5, 1, 1.5, 2, 2.5, 3]} yTicks={[0, 0.5, 1, 1.5, 2]} xTitle="gjennomsnitt x̄"
    curves={[
      { name: "n = 1", tone: "muted", points: curveOf(xs, v => gammaPdf(v, 1, 1)) },
      { name: "n = 4", tone: "accent", points: curveOf(xs, v => gammaPdf(v, 4, 0.25)) },
      { name: "n = 16", tone: "warn", points: curveOf(xs, v => gammaPdf(v, 16, 1 / 16)) },
      { name: "N(1, 1/16)", tone: "ink", dashed: true, points: curveOf(xs, v => normPdf(v, 1, 0.25)) },
    ]} />;
}

/** 20 intervals from repeated samples with known σ and μ = 0. One misses, as expected at 95 % coverage. */
export function ConfidenceIntervalsFigure() {
  const centers = [0.31, -0.42, 0.78, -0.15, 0.05, -0.67, 0.94, 0.22, -0.38, 0.61, -1.23, 0.12, -0.28, 0.55, -0.09, 0.83, -0.51, 0.18, 0.4, -0.05];
  const half = 1;
  const width = 640, height = 300, padL = 56, padR = 16, padT = 14, padB = 40;
  const iw = width - padL - padR, ih = height - padT - padB;
  const sx = (v: number) => padL + ((v + 2.5) / 5) * iw;
  // Rows start below the «μ = 0» label so the top interval does not cover it.
  const rowY = (i: number) => padT + 26 + (i * (ih - 36)) / (centers.length - 1);
  return <Svg label="Tjue konfidensintervaller fra gjentatte utvalg, der nesten alle dekker μ = 0" width={width} height={height}>
    <line x1={sx(0)} y1={padT} x2={sx(0)} y2={padT + ih} className="lf-dashed lf-stroke-accent" />
    <text x={sx(0) + 4} y={padT + 10} className="lf-text lf-small">μ = 0</text>
    {centers.map((c, i) => {
      const miss = Math.abs(c) > half;
      return <g key={i}>
        <line x1={sx(c - half)} y1={rowY(i)} x2={sx(c + half)} y2={rowY(i)} className={miss ? "lf-stroke-warn" : "lf-curve"} />
        <circle cx={sx(c)} cy={rowY(i)} r={2.6} className={miss ? "lf-fill-warn" : "lf-fill-ink"} />
      </g>;
    })}
    <line x1={padL} y1={padT + ih} x2={padL + iw} y2={padT + ih} className="lf-axis" />
    {[-2, -1, 0, 1, 2].map(v => <g key={v}>
      <line x1={sx(v)} y1={padT + ih} x2={sx(v)} y2={padT + ih + 4} className="lf-axis" />
      <text x={sx(v)} y={padT + ih + 16} textAnchor="middle" className="lf-text lf-small lf-muted">{v}</text>
    </g>)}
    <text x={padL + iw / 2} y={height - 6} textAnchor="middle" className="lf-text lf-small lf-muted">Intervallenes plassering (én linje per utvalg). Den oransje linjen er det intervallet som ikke dekker μ.</text>
  </Svg>;
}

export function PValueFigure() {
  const xs = grid(-4, 4, 240);
  // Under H0: Z ~ N(0,1). Observed z = 2 gives two-sided p = 2(1 − Φ(2)) ≈ 0,0455.
  return <Plot label="Tosidig p-verdi for z = 2 under H₀" x={[-4, 4]} y={[0, 0.45]}
    xTicks={[-4, -2, 0, 2, 4]} yTicks={[0, 0.1, 0.2, 0.3, 0.4]} xTitle="z (testobservator under H₀)"
    curves={[{ name: "N(0, 1) under H₀", tone: "ink", points: curveOf(xs, v => normPdf(v, 0, 1)) }]}
    shades={[{ from: 2, to: 4, fn: v => normPdf(v), tone: "accent" }, { from: -4, to: -2, fn: v => normPdf(v), tone: "accent" }]}
    vlines={[{ x: 2, label: "z = 2", tone: "warn" }, { x: -2, label: "−2", tone: "warn" }]} />;
}

/** Type I error α in the H0 tail, type II error β in the H1 tail, power 1 − β on the right of the boundary. */
export function TypeIIPowerFigure() {
  const c = 1.645; // one-sided test at α = 0,05, with σ_x̄ = 1 and μ0 = 0
  const mu1 = 2;
  const xs = grid(-4, 6, 320);
  return <Plot label="Type I-feil, type II-feil og styrke for en ensidig z-test" x={[-4, 6]} y={[0, 0.45]}
    xTicks={[-4, -2, 0, 2, 4, 6]} yTicks={[0, 0.1, 0.2, 0.3, 0.4]} xTitle="x̄ (standardisert til σ_x̄ = 1)"
    curves={[
      { name: "H₀: μ = 0", tone: "ink", points: curveOf(xs, v => normPdf(v, 0, 1)) },
      { name: "H₁: μ = 2", tone: "accent", dashed: true, points: curveOf(xs, v => normPdf(v, mu1, 1)) },
    ]}
    shades={[
      { from: c, to: 6, fn: v => normPdf(v, 0, 1), tone: "warn" },
      { from: -4, to: c, fn: v => normPdf(v, mu1, 1), tone: "muted" },
    ]}
    vlines={[{ x: c, label: "forkastningsgrense 1,645", tone: "ink" }]} />;
}

/** Residual plot with an even scatter (model fits) next to a curved pattern (model does not fit). */
export function ResidualFigure() {
  const xs = Array.from({ length: 30 }, (_, i) => i + 1);
  const ok = xs.map(i => [i, 0.8 * Math.sin(2.7 * i) * Math.cos(0.9 * i)] as [number, number]);
  const curved = xs.map(i => [i, 0.0075 * (i - 15) ** 2 - 1.7 + 0.08 * Math.sin(3 * i)] as [number, number]);
  const zero = [[0, 0], [31, 0]] as [number, number][];
  return <>
    <Plot label="Residualplott: tilfeldig spredning rundt null" x={[0, 31]} y={[-2.5, 2.5]} xTicks={[0, 10, 20, 30]} yTicks={[-2, -1, 0, 1, 2]}
      xTitle="x" width={320} height={230}
      curves={[{ name: "e = 0", tone: "muted", dashed: true, points: zero }]} scatter={[{ name: "residual", tone: "accent", points: ok }]} />
    <Plot label="Residualplott: buet mønster, modellen passer ikke" x={[0, 31]} y={[-2.5, 2.5]} xTicks={[0, 10, 20, 30]} yTicks={[-2, -1, 0, 1, 2]}
      xTitle="x" width={320} height={230}
      curves={[{ name: "e = 0", tone: "muted", dashed: true, points: zero }]} scatter={[{ name: "residual", tone: "warn", points: curved }]} />
  </>;
}

/** QQ plot: sample quantiles against normal quantiles, computed for a normal and for an exponential population. */
export function QQFigure() {
  const ps = Array.from({ length: 49 }, (_, i) => (i + 1) / 50);
  const z = ps.map(p => normInv(p));
  const normalQ = z.map(v => [v, v] as [number, number]);
  const expQ = z.map(v => [v, -Math.log(1 - normCdf(v))] as [number, number]);
  const diag = [[-2.5, -2.5], [2.5, 2.5]] as [number, number][];
  return <>
    <Plot label="Normalplott for normalfordelte data: punktene følger en rett linje" x={[-2.5, 2.5]} y={[-2.5, 2.5]} xTicks={[-2, -1, 0, 1, 2]} yTicks={[-2, -1, 0, 1, 2]}
      xTitle="normalkvantiler" width={320} height={230} curves={[{ name: "linje", tone: "muted", dashed: true, points: diag }]}
      scatter={[{ name: "data", tone: "accent", points: normalQ }]} />
    <Plot label="Normalplott for eksponensialfordelte data: punktene bøyer av" x={[-2.5, 2.5]} y={[0, 4]} xTicks={[-2, -1, 0, 1, 2]} yTicks={[0, 1, 2, 3, 4]}
      xTitle="normalkvantiler" width={320} height={230} curves={[{ name: "linje", tone: "muted", dashed: true, points: diag }]}
      scatter={[{ name: "data", tone: "warn", points: expQ }]} />
  </>;
}

/** Regression: fitted line with a confidence band for the mean and a wider prediction band for a new observation. */
export function RegressionIntervalsFigure() {
  const data: [number, number][] = [[1, 2], [2, 4], [3, 5], [4, 4], [5, 5]];
  const t = 3.182, s = 0.894, n = 5, xbar = 3, sxx = 10;
  const yhat = (x: number) => 2.2 + 0.6 * x;
  const ci = (x: number) => t * s * Math.sqrt(1 / n + ((x - xbar) ** 2) / sxx);
  const pi = (x: number) => t * s * Math.sqrt(1 + 1 / n + ((x - xbar) ** 2) / sxx);
  return <Plot label="Konfidensintervall for forventet verdi og prediksjonsintervall i enkel lineær regresjon" x={[1, 5]} y={[-1, 9.5]}
    xTicks={[1, 2, 3, 4, 5]} yTicks={[0, 2, 4, 6, 8]} xTitle="x"
    bands={[
      { name: "prediksjonsintervall", tone: "muted", from: 1, to: 5, lower: v => yhat(v) - pi(v), upper: v => yhat(v) + pi(v) },
      { name: "KI for forventet verdi", tone: "accent", from: 1, to: 5, lower: v => yhat(v) - ci(v), upper: v => yhat(v) + ci(v) },
    ]}
    curves={[{ name: "ŷ = 2,2 + 0,6x", tone: "ink", points: curveOf(grid(1, 5, 20), yhat) }]}
    scatter={[{ name: "data", tone: "warn", points: data }]} />;
}
