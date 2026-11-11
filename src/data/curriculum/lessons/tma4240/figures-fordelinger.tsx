// Distribution figures for the TMA4240 topic pages. Every curve is computed from the density or mass function.
// Parameter conventions follow the formula book: Gamma and exponential use scale β, Weibull uses α and β as on side 28.

import { Plot } from "./plot";
import { binomPmf, chi2Pdf, curveOf, expPdf, fPdf, gammaPdf, grid, normPdf, poissonPmf, tPdf, weibullPdf } from "../../plotmath";

export function BinomialFigure() {
  const n = 10;
  const a = Array.from({ length: n + 1 }, (_, k) => k - 0.12).map((x, k) => [x, binomPmf(k, n, 0.3)] as [number, number]);
  const b = Array.from({ length: n + 1 }, (_, k) => k + 0.12).map((x, k) => [x, binomPmf(k, n, 0.6)] as [number, number]);
  return <Plot label="Binomisk fordeling for n = 10 med p = 0,3 og p = 0,6" x={[-0.6, 10.6]} y={[0, 0.3]}
    xTicks={[0, 2, 4, 6, 8, 10]} yTicks={[0, 0.1, 0.2, 0.3]} xTitle="x (antall suksesser)"
    stems={[{ name: "n = 10, p = 0,3", tone: "accent", values: a }, { name: "n = 10, p = 0,6", tone: "warn", values: b }]} />;
}

export function PoissonFigure() {
  const a = Array.from({ length: 13 }, (_, k) => [k - 0.12, poissonPmf(k, 1)] as [number, number]);
  const b = Array.from({ length: 13 }, (_, k) => [k + 0.12, poissonPmf(k, 4)] as [number, number]);
  return <Plot label="Poissonfordeling med μ = 1 og μ = 4" x={[-0.6, 12.6]} y={[0, 0.4]}
    xTicks={[0, 2, 4, 6, 8, 10, 12]} yTicks={[0, 0.1, 0.2, 0.3, 0.4]} xTitle="x (antall hendelser)"
    stems={[{ name: "μ = 1", tone: "accent", values: a }, { name: "μ = 4", tone: "warn", values: b }]} />;
}

export function NormalFigure() {
  const xs = grid(-6, 6, 240);
  return <Plot label="Normaltettheter: μ styrer midten, σ styrer bredden" x={[-6, 6]} y={[0, 0.45]}
    xTicks={[-6, -4, -2, 0, 2, 4, 6]} yTicks={[0, 0.2, 0.4]} xTitle="x"
    curves={[
      { name: "μ = 0, σ = 1", tone: "accent", points: curveOf(xs, v => normPdf(v, 0, 1)) },
      { name: "μ = 0, σ = 2", tone: "warn", points: curveOf(xs, v => normPdf(v, 0, 2)) },
      { name: "μ = 2, σ = 1", tone: "ink", dashed: true, points: curveOf(xs, v => normPdf(v, 2, 1)) },
    ]} />;
}

export function ExponentialFigure() {
  const xs = grid(0, 6, 240);
  return <Plot label="Eksponensialtettheter for β = 0,5, 1 og 2" x={[0, 6]} y={[0, 2.2]}
    xTicks={[0, 1, 2, 3, 4, 5, 6]} yTicks={[0, 0.5, 1, 1.5, 2]} xTitle="x (tid)"
    curves={[
      { name: "β = 0,5", tone: "warn", points: curveOf(xs, v => expPdf(v, 0.5)) },
      { name: "β = 1", tone: "accent", points: curveOf(xs, v => expPdf(v, 1)) },
      { name: "β = 2", tone: "ink", dashed: true, points: curveOf(xs, v => expPdf(v, 2)) },
    ]} />;
}

export function GammaFigure() {
  const xs = grid(0.001, 16, 300);
  return <Plot label="Gammatettheter med β = 1 og α = 1, 2, 5" x={[0, 16]} y={[0, 1.05]}
    xTicks={[0, 4, 8, 12, 16]} yTicks={[0, 0.25, 0.5, 0.75, 1]} xTitle="x"
    curves={[
      { name: "α = 1 (eksponensial)", tone: "muted", points: curveOf(xs, v => gammaPdf(v, 1, 1)) },
      { name: "α = 2", tone: "accent", points: curveOf(xs, v => gammaPdf(v, 2, 1)) },
      { name: "α = 5", tone: "warn", points: curveOf(xs, v => gammaPdf(v, 5, 1)) },
    ]} />;
}

export function Chi2Figure() {
  const xs = grid(0.001, 20, 300);
  return <Plot label="χ²-tettheter for ν = 2, 4 og 8 frihetsgrader" x={[0, 20]} y={[0, 0.55]}
    xTicks={[0, 4, 8, 12, 16, 20]} yTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]} xTitle="x"
    curves={[
      { name: "ν = 2", tone: "muted", points: curveOf(xs, v => chi2Pdf(v, 2)) },
      { name: "ν = 4", tone: "accent", points: curveOf(xs, v => chi2Pdf(v, 4)) },
      { name: "ν = 8", tone: "warn", points: curveOf(xs, v => chi2Pdf(v, 8)) },
    ]} />;
}

export function TFigure() {
  const xs = grid(-4, 4, 240);
  return <Plot label="t-tettheter for 1, 3 og 10 frihetsgrader, sammenlignet med normalfordelingen" x={[-4, 4]} y={[0, 0.42]}
    xTicks={[-4, -2, 0, 2, 4]} yTicks={[0, 0.1, 0.2, 0.3, 0.4]} xTitle="x"
    curves={[
      { name: "t, ν = 1", tone: "muted", points: curveOf(xs, v => tPdf(v, 1)) },
      { name: "t, ν = 3", tone: "accent", points: curveOf(xs, v => tPdf(v, 3)) },
      { name: "t, ν = 10", tone: "warn", points: curveOf(xs, v => tPdf(v, 10)) },
      { name: "N(0, 1)", tone: "ink", dashed: true, points: curveOf(xs, v => normPdf(v, 0, 1)) },
    ]} />;
}

export function FFigure() {
  const xs = grid(0.01, 5, 300);
  return <Plot label="F-tettheter for (ν₁, ν₂) = (3, 10) og (10, 20)" x={[0, 5]} y={[0, 1.1]}
    xTicks={[0, 1, 2, 3, 4, 5]} yTicks={[0, 0.25, 0.5, 0.75, 1]} xTitle="x (F-verdi)"
    curves={[
      { name: "(3, 10)", tone: "accent", points: curveOf(xs, v => fPdf(v, 3, 10)) },
      { name: "(10, 20)", tone: "warn", points: curveOf(xs, v => fPdf(v, 10, 20)) },
    ]} />;
}

export function WeibullFigure() {
  // For β < 1 the density tends to infinity at x = 0. The grid starts close to 0, and the top of that part is clipped.
  const xs = grid(0.01, 4, 300);
  return <Plot label="Weibull-tettheter med α = 1 og β = 0,5, 1, 2 og 3" x={[0, 4]} y={[0, 2.2]}
    xTicks={[0, 1, 2, 3, 4]} yTicks={[0, 0.5, 1, 1.5, 2]} xTitle="x"
    curves={[
      { name: "β = 0,5", tone: "muted", points: curveOf(xs, v => weibullPdf(v, 1, 0.5)) },
      { name: "β = 1 (eksponensial)", tone: "accent", points: curveOf(xs, v => weibullPdf(v, 1, 1)) },
      { name: "β = 2", tone: "warn", points: curveOf(xs, v => weibullPdf(v, 1, 2)) },
      { name: "β = 3", tone: "ink", dashed: true, points: curveOf(xs, v => weibullPdf(v, 1, 3)) },
    ]} />;
}

