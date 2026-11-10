// Figures for the TMA4240 topic pages. Colours come from lf-* classes in Curriculum.css,
// so every figure follows the light and dark themes.

import { Box, Svg } from "../figureKit";

const pdf = (z: number) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
const X0 = 50, X1 = 590, BASE = 190, TOP = 30;
const toX = (z: number) => X0 + ((z + 4) / 8) * (X1 - X0);
const toY = (z: number) => BASE - (pdf(z) / pdf(0)) * (BASE - TOP);
const clamp = (z: number) => Math.max(-4, Math.min(4, z));

function points(from: number, to: number, steps: number) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const z = from + ((to - from) * index) / steps;
    return `${toX(z).toFixed(1)},${toY(z).toFixed(1)}`;
  }).join(" ");
}

/** Standard normal curve with shaded regions and marked values (z-scale). */
export function NormalRegionFigure({ label, shaded, marks }: { label: string; shaded: [number, number][]; marks: { z: number; text: string }[] }) {
  return <Svg label={label} width={640} height={230}>
    {shaded.map(([from, to]) => <polygon key={`${from}-${to}`} className="lf-region lf-fill-accent"
      points={`${toX(clamp(from)).toFixed(1)},${BASE} ${points(clamp(from), clamp(to), 80)} ${toX(clamp(to)).toFixed(1)},${BASE}`} />)}
    <polyline points={points(-4, 4, 160)} className="lf-curve" />
    <line x1={X0} y1={BASE} x2={X1} y2={BASE} className="lf-axis" />
    {marks.map(mark => <g key={mark.z}>
      <line x1={toX(mark.z)} y1={BASE} x2={toX(mark.z)} y2={BASE + 8} className="lf-axis" />
      <text x={toX(mark.z)} y={BASE + 22} textAnchor="middle" className="lf-text lf-strong">{mark.z}</text>
      <text x={toX(mark.z)} y={BASE + 40} textAnchor="middle" className="lf-text lf-small lf-muted">{mark.text}</text>
    </g>)}
  </Svg>;
}

/** Bayes' rule: the first branches are P(M_i), the second P(D | M_i). */
export function BayesTreeFigure() {
  return <Svg label="Tretdiagram for tre maskiner med P(M), P(D | M) og P(M | D)" width={640} height={250}>
    <Box x={6} y={100} w={90} h={44} title="Start" />
    <Box x={170} y={22} w={130} h={44} title="Maskin 1" sub="P(M₁) = 0,5" />
    <Box x={170} y={100} w={130} h={44} title="Maskin 2" sub="P(M₂) = 0,3" />
    <Box x={170} y={178} w={130} h={44} title="Maskin 3" sub="P(M₃) = 0,2" accent />
    <line x1="96" y1="122" x2="166" y2="44" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="96" y1="122" x2="166" y2="122" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="96" y1="122" x2="166" y2="200" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="300" y1="44" x2="416" y2="44" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="300" y1="122" x2="416" y2="122" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="300" y1="200" x2="416" y2="200" className="lf-line" markerEnd="url(#lf-arrow)" />
    <text x="356" y="36" textAnchor="middle" className="lf-text lf-small lf-muted">P(D | M₁) = 0,01</text>
    <text x="356" y="114" textAnchor="middle" className="lf-text lf-small lf-muted">P(D | M₂) = 0,02</text>
    <text x="356" y="192" textAnchor="middle" className="lf-text lf-small lf-muted">P(D | M₃) = 0,03</text>
    <Box x={420} y={22} w={200} h={44} title="Defekt, M₁" sub="0,5 · 0,01 = 0,005" />
    <Box x={420} y={100} w={200} h={44} title="Defekt, M₂" sub="0,3 · 0,02 = 0,006" />
    <Box x={420} y={178} w={200} h={44} title="Defekt, M₃" sub="0,2 · 0,03 = 0,006" accent />
    <text x="320" y="246" textAnchor="middle" className="lf-text lf-muted">Summer over de defekte grenene: P(D) = 0,017. Bayes: P(M₃ | D) = 0,006 / 0,017 ≈ 0,353.</text>
  </Svg>;
}

/** Choosing the test: first ask what the parameter is, then what is known. */
export function TestChoiceFigure() {
  return <Svg label="Beslutningstre for valg av test" width={640} height={300}>
    <Box x={6} y={128} w={120} h={44} title="Hva testes?" accent />
    <Box x={176} y={10} w={150} h={40} title="Gjennomsnitt μ" sub="ett utvalg" />
    <Box x={176} y={80} w={150} h={40} title="Varians σ²" sub="ett utvalg" />
    <Box x={176} y={150} w={150} h={40} title="Andel p" sub="stor n" />
    <Box x={176} y={220} w={150} h={40} title="μ₁ − μ₂" sub="to utvalg" />
    <line x1="126" y1="150" x2="172" y2="30" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="126" y1="150" x2="172" y2="100" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="126" y1="150" x2="172" y2="170" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="126" y1="150" x2="172" y2="240" className="lf-line" markerEnd="url(#lf-arrow)" />
    <Box x={370} y={4} w={262} h={40} title="σ kjent: Z-test" sub="Z = (X̄ − μ₀)/(σ/√n)" />
    <Box x={370} y={50} w={262} h={40} title="σ ukjent: t-test" sub="T = (X̄ − μ₀)/(S/√n), df = n − 1" accent />
    <Box x={370} y={96} w={262} h={40} title="χ²-test" sub="(n − 1)S²/σ₀² ~ χ²(n − 1)" />
    <Box x={370} y={150} w={262} h={40} title="z-test for p" sub="Z = (p̂ − p₀)/√(p₀(1 − p₀)/n)" />
    <Box x={370} y={220} w={262} h={40} title="Varianser: F-test" sub="S₁²/S₂² ~ F(n₁ − 1, n₂ − 1)" />
    <line x1="326" y1="30" x2="366" y2="24" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="326" y1="30" x2="366" y2="70" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="326" y1="100" x2="366" y2="116" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="326" y1="170" x2="366" y2="170" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="326" y1="240" x2="366" y2="240" className="lf-line" markerEnd="url(#lf-arrow)" />
    <text x="320" y="290" textAnchor="middle" className="lf-text lf-muted">Gjennomsnitt med ukjent σ bruker t, aldri z. Two-utvalg med felles varians er ikke pensum.</text>
  </Svg>;
}

/** Simple linear regression: data points, fitted line and residuals. */
export function RegressionFigure() {
  const data = [[1, 2], [2, 4], [3, 5], [4, 4], [5, 5]];
  const sx = (x: number) => 60 + x * 100;
  const sy = (y: number) => 220 - y * 32;
  const line = (x: number) => 2.2 + 0.6 * x;
  return <Svg label="Spredningsplott med fitted linje ŷ = 2,2 + 0,6x og residualer" width={640} height={250}>
    <line x1={50} y1={220} x2={600} y2={220} className="lf-axis" />
    <line x1={60} y1={20} x2={60} y2={220} className="lf-axis" />
    <line x1={sx(0.5)} y1={sy(line(0.5))} x2={sx(5.5)} y2={sy(line(5.5))} className="lf-stroke-accent" />
    {data.map(([x, y]) => <g key={x}>
      <line x1={sx(x)} y1={sy(y)} x2={sx(x)} y2={sy(line(x))} className="lf-dashed lf-stroke-warn" />
      <circle cx={sx(x)} cy={sy(y)} r={5} className="lf-fill-ink" />
    </g>)}
    <text x={sx(5.5)} y={sy(line(5.5)) - 8} textAnchor="end" className="lf-text lf-small lf-muted">ŷ = 2,2 + 0,6x</text>
    <text x={320} y={246} textAnchor="middle" className="lf-text lf-muted">Stiplede linjer er residualer eᵢ = yᵢ − ŷᵢ. Summen av kvadrerte residualer er 2,4.</text>
  </Svg>;
}
