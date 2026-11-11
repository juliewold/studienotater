// Shared maths for the TMA4240 figures: special functions, densities and mass functions. Pure functions only.

export type Pt = [number, number];

// --- special functions ------------------------------------------------------

const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61503916999385,
  12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

/** ln Γ(z) for z > 0 (Lanczos approximation). */
export function lnGamma(z: number): number {
  const zz = z - 1;
  let x = LANCZOS[0];
  for (let i = 1; i < 9; i++) x += LANCZOS[i] / (zz + i);
  const t = zz + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (zz + 0.5) * Math.log(t) - t + Math.log(x);
}

/** Standard normal cdf (Abramowitz–Stegun 7.1.26 via erf, error below 1.5e-7). */
export function normCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

/** Inverse standard normal cdf by bisection. */
export function normInv(p: number): number {
  let lo = -10, hi = 10;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (normCdf(mid) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// --- densities and mass functions ------------------------------------------

export const normPdf = (x: number, mu = 0, sigma = 1) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
export const expPdf = (x: number, beta: number) => (x < 0 ? 0 : Math.exp(-x / beta) / beta);
/** Gamma(shape α, scale β) density: x^(α−1) e^(−x/β) / (Γ(α) β^α). */
export const gammaPdf = (x: number, shape: number, scale: number) =>
  x <= 0 ? 0 : Math.exp((shape - 1) * Math.log(x) - x / scale - lnGamma(shape) - shape * Math.log(scale));
export const chi2Pdf = (x: number, nu: number) => gammaPdf(x, nu / 2, 2);
export const tPdf = (x: number, nu: number) =>
  Math.exp(lnGamma((nu + 1) / 2) - lnGamma(nu / 2) - 0.5 * Math.log(nu * Math.PI) - ((nu + 1) / 2) * Math.log(1 + (x * x) / nu));
export const fPdf = (x: number, d1: number, d2: number) => (x <= 0 ? 0 :
  Math.exp(lnGamma((d1 + d2) / 2) - lnGamma(d1 / 2) - lnGamma(d2 / 2) + (d1 / 2) * Math.log(d1 / d2)
    + (d1 / 2 - 1) * Math.log(x) - ((d1 + d2) / 2) * Math.log(1 + (d1 * x) / d2)));
/** Weibull as in the formula book (side 28): f(x) = αβ x^(β−1) e^(−αx^β). */
export const weibullPdf = (x: number, alpha: number, beta: number) =>
  x <= 0 ? 0 : alpha * beta * Math.pow(x, beta - 1) * Math.exp(-alpha * Math.pow(x, beta));
export const binomPmf = (k: number, n: number, p: number) => {
  if (k < 0 || k > n) return 0;
  const lnC = lnGamma(n + 1) - lnGamma(k + 1) - lnGamma(n - k + 1);
  return Math.exp(lnC + k * Math.log(p) + (n - k) * Math.log(1 - p));
};
export const poissonPmf = (k: number, mu: number) => Math.exp(-mu + k * Math.log(mu) - lnGamma(k + 1));

/** Sample x-values from a to b. */
export function grid(a: number, b: number, n = 200): number[] {
  return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
}
export const curveOf = (xs: number[], f: (x: number) => number): Pt[] => xs.map(x => [x, f(x)]);

