// Method-choice diagrams for the TMA4240 topic pages: which distribution, which confidence interval,
// and which regression steps. They are drawn in the same style as the other lesson figures.

import { Box, Svg } from "../figureKit";

const BOX_X = 190, BOX_W = 250, RIGHT_X = 472;

/** Rows of «situation → answer». The left box is the situation, the right text is what to use. */
function ChoiceRows({ rows, rowH, top, width }: { rows: { ask: string; use: string; accent?: boolean }[]; rowH: number; top: number; width: number }) {
  return <>
    {rows.map((row, i) => {
      const y = top + i * rowH;
      return <g key={row.ask}>
        <line x1={176} y1={y + 16} x2={BOX_X} y2={y + 16} className="lf-line" markerEnd="url(#lf-arrow)" />
        <Box x={BOX_X} y={y} w={BOX_W} h={32} title={row.ask} accent={row.accent} />
        <line x1={BOX_X + BOX_W + 2} y1={y + 16} x2={RIGHT_X - 6} y2={y + 16} className="lf-line" markerEnd="url(#lf-arrow)" />
        <text x={RIGHT_X} y={y + 21} className="lf-text lf-small lf-strong">{row.use}</text>
      </g>;
    })}
    <text x={width - 4} y={top - 4} textAnchor="end" className="lf-text lf-small lf-muted">Bruk</text>
  </>;
}

export function DistributionChoiceFigure() {
  const rows = [
    { ask: "Antall hendelser i tidsrom", use: "Poisson, μ = λt" },
    { ask: "Antall suksesser i n forsøk", use: "Binomisk, n og p" },
    { ask: "Forsøk til 1. / k-te suksess", use: "Geometrisk / neg. binomisk" },
    { ask: "Tid til neste hendelse", use: "Eksponensial, β" },
    { ask: "Gjennomsnitt, store n", use: "Normal (CLT)" },
    { ask: "Varians i normalt utvalg", use: "χ²(n − 1)", accent: true },
    { ask: "Gjennomsnitt, σ ukjent", use: "t(n − 1)", accent: true },
    { ask: "Forhold mellom varianser", use: "F(n₁ − 1, n₂ − 1)" },
  ];
  const width = 640, height = 330, top = 16, rowH = 36;
  const spineTop = top + 16, spineBottom = top + (rows.length - 1) * rowH + 16;
  return <Svg label="Valg av sannsynlighetsfordeling ut fra hva som måles" width={width} height={height}>
    <Box x={6} y={spineTop + (spineBottom - spineTop) / 2 - 22} w={150} h={44} title="Hva måler du?" accent />
    <line x1={156} y1={spineTop + (spineBottom - spineTop) / 2} x2={176} y2={spineTop + (spineBottom - spineTop) / 2} className="lf-line" />
    <line x1={176} y1={spineTop} x2={176} y2={spineBottom} className="lf-line" />
    <ChoiceRows rows={rows} rowH={rowH} top={top} width={width} />
    <text x={width / 2} y={height - 6} textAnchor="middle" className="lf-text lf-small lf-muted">Velg etter hva som telles eller måles. Sjekk deretter forutsetningene.</text>
  </Svg>;
}

export function IntervalChoiceFigure() {
  const rows = [
    { ask: "Gjennomsnitt, σ kjent", use: "z: x̄ ± z·σ/√n", accent: true },
    { ask: "Gjennomsnitt, σ ukjent", use: "t(n − 1): x̄ ± t·s/√n" },
    { ask: "Varians σ²", use: "χ²(n − 1)" },
    { ask: "Andel p, stor n", use: "z: p̂ ± z·√(p̂(1 − p̂)/n)" },
    { ask: "μ₁ − μ₂, ulik varians", use: "t, Welch-frihetsgrader" },
    { ask: "Ny observasjon", use: "Bredere: t·s·√(1 + 1/n)" },
  ];
  const width = 640, height = 270, top = 14, rowH = 36;
  const spineTop = top + 16, spineBottom = top + (rows.length - 1) * rowH + 16;
  return <Svg label="Valg av konfidensintervall ut fra hva parameteren er og hva som er kjent" width={width} height={height}>
    <Box x={6} y={spineTop + (spineBottom - spineTop) / 2 - 22} w={150} h={44} title="Hva vil du anslå?" accent />
    <line x1={156} y1={spineTop + (spineBottom - spineTop) / 2} x2={176} y2={spineTop + (spineBottom - spineTop) / 2} className="lf-line" />
    <line x1={176} y1={spineTop} x2={176} y2={spineBottom} className="lf-line" />
    <ChoiceRows rows={rows} rowH={rowH} top={top} width={width} />
    <text x={width / 2} y={height - 6} textAnchor="middle" className="lf-text lf-small lf-muted">Sjekk først om σ er kjent. Bruk aldri z når σ må estimeres fra et lite utvalg.</text>
  </Svg>;
}

export function RegressionMethodFigure() {
  const width = 640, height = 300;
  return <Svg label="Fremgangsmåte i enkel lineær regresjon" width={width} height={height}>
    <Box x={150} y={8} w={340} h={44} title="Enkel lineær regresjon" sub="Y = α + βx + ε, ε uavhengige N(0, σ²)" accent />
    <line x1={320} y1={52} x2={320} y2={76} className="lf-line" markerEnd="url(#lf-arrow)" />
    <Box x={150} y={78} w={340} h={44} title="Minste kvadrater: α̂ og β̂" sub="Ved normale feil er dette også SME" />
    <line x1={320} y1={122} x2={320} y2={146} className="lf-line" markerEnd="url(#lf-arrow)" />
    <Box x={150} y={148} w={340} h={44} title="Residualplott: e = y − ŷ mot x" sub="Tilfeldig band rundt null?" />
    <line x1={320} y1={192} x2={180} y2={222} className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1={320} y1={192} x2={460} y2={222} className="lf-line" markerEnd="url(#lf-arrow)" />
    <Box x={20} y={224} w={270} h={56} title="Ja: modellen passer" sub="Inferens om β, KI for E(Y), prediksjon" accent />
    <Box x={350} y={224} w={270} h={56} title="Nei: modellen passer ikke" sub="Beskriv avviket i modellen" />
    <text x={width / 2} y={height - 4} textAnchor="middle" className="lf-text lf-small lf-muted">Residualplottet avgjør om du kan bruke inferensen.</text>
  </Svg>;
}
