import "./FlashcardPlot.css";

import type { ComponentType } from "react";

import { Svg } from "../../../data/curriculum/lessons/figureKit";
import {
  CLTFigure,
  ConfidenceIntervalsFigure,
  PValueFigure,
  QQFigure,
  RegressionIntervalsFigure,
  ResidualFigure,
  TypeIIPowerFigure,
} from "../../../data/curriculum/lessons/tma4240/figures-begreper";
import {
  BinomialFigure,
  Chi2Figure,
  ExponentialFigure,
  FFigure,
  GammaFigure,
  NormalFigure,
  PoissonFigure,
  TFigure,
  WeibullFigure,
} from "../../../data/curriculum/lessons/tma4240/figures-fordelinger";
import {
  DistributionChoiceFigure,
  IntervalChoiceFigure,
  RegressionMethodFigure,
} from "../../../data/curriculum/lessons/tma4240/figures-metode";
import {
  NormalRegionFigure,
  RegressionFigure,
  TestChoiceFigure,
} from "../../../data/curriculum/lessons/tma4240/figures";

function NormalTwoSidedFigure() {
  return (
    <NormalRegionFigure
      label="Tosidig test på 5 %-nivå: 2,5 % i hver hale"
      shaded={[[-4, -1.96], [1.96, 4]]}
      marks={[{ z: -1.96, text: "−1,96" }, { z: 1.96, text: "1,96" }]}
    />
  );
}

function NormalRightTailFigure() {
  return (
    <NormalRegionFigure
      label="Ensidig test på 5 %-nivå: 5 % i høyre hale"
      shaded={[[1.645, 4]]}
      marks={[{ z: 1.645, text: "1,645" }]}
    />
  );
}

/** Box plot of 2, 4, 6, 8, 4, 9, 9 (sorted 2, 4, 4, 6, 8, 9, 9): Q1 = 4, median = 6, Q3 = 9, min = 2, max = 9. */
function BoxplotFigure() {
  const sx = (value: number) => 60 + value * 50;
  const centerY = 56;
  const boxHeight = 40;
  const ticks = Array.from({ length: 11 }, (_, index) => index);

  return (
    <Svg label="Boksplott for datasettet 2, 4, 6, 8, 4, 9, 9" width={640} height={140}>
      <line x1={sx(2)} y1={centerY} x2={sx(4)} y2={centerY} className="lf-line" />
      <line x1={sx(2)} y1={centerY - 12} x2={sx(2)} y2={centerY + 12} className="lf-line" />
      <rect x={sx(4)} y={centerY - boxHeight / 2} width={sx(9) - sx(4)} height={boxHeight} className="lf-region lf-fill-accent" />
      <line x1={sx(6)} y1={centerY - boxHeight / 2} x2={sx(6)} y2={centerY + boxHeight / 2} className="lf-line" />
      <text x={sx(2)} y={centerY - 22} textAnchor="middle" className="lf-text lf-small">min 2</text>
      <text x={sx(4)} y={centerY - 26} textAnchor="middle" className="lf-text lf-small">Q₁ = 4</text>
      <text x={sx(6)} y={centerY - 26} textAnchor="middle" className="lf-text lf-small">median 6</text>
      <text x={sx(9)} y={centerY - 26} textAnchor="middle" className="lf-text lf-small">Q₃ og maks 9</text>
      <line x1={sx(0)} y1={110} x2={sx(10)} y2={110} className="lf-axis" />
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={sx(tick)} y1={110} x2={sx(tick)} y2={114} className="lf-axis" />
          <text x={sx(tick)} y={128} textAnchor="middle" className="lf-text lf-small lf-muted">{tick}</text>
        </g>
      ))}
    </Svg>
  );
}

/** Built-in figures that flashcards can show, by the key stored in flashcards.figure_key. */
const figures: Record<string, ComponentType> = {
  binomial: BinomialFigure,
  poisson: PoissonFigure,
  normal: NormalFigure,
  exponential: ExponentialFigure,
  gamma: GammaFigure,
  chi2: Chi2Figure,
  t: TFigure,
  f: FFigure,
  weibull: WeibullFigure,
  clt: CLTFigure,
  confidence: ConfidenceIntervalsFigure,
  pvalue: PValueFigure,
  typeii: TypeIIPowerFigure,
  residual: ResidualFigure,
  qq: QQFigure,
  "regression-intervals": RegressionIntervalsFigure,
  regression: RegressionFigure,
  "regression-method": RegressionMethodFigure,
  "distribution-choice": DistributionChoiceFigure,
  "interval-choice": IntervalChoiceFigure,
  "test-choice": TestChoiceFigure,
  "normal-two-sided": NormalTwoSidedFigure,
  "normal-right-tail": NormalRightTailFigure,
  boxplot: BoxplotFigure,
};

/** Shows the figure a card is linked to. Renders nothing for cards without a known figure. */
export function FlashcardPlot({ figureKey }: { figureKey: string | null }) {
  if (!figureKey) {
    return null;
  }

  const Figure = figures[figureKey];

  if (!Figure) {
    return null;
  }

  return (
    <div className="flashcard-plot">
      <Figure />
    </div>
  );
}
