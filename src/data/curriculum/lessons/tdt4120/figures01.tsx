// Figures for lecture 1, drawn from the definitions in the lesson text.
// Colours come from CSS classes (lf-*) so they follow the light and dark themes.

function Svg({ label, width, height, children }: { label: string; width: number; height: number; children: React.ReactNode }) {
  return <svg className="lesson-figure-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
    <title>{label}</title>
    <defs>
      <marker id="lf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" className="lf-fill-ink" />
      </marker>
    </defs>
    {children}
  </svg>;
}

function Box({ x, y, w, h, title, sub, accent = false }: { x: number; y: number; w: number; h: number; title: string; sub?: string; accent?: boolean }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" className={accent ? "lf-box-accent" : "lf-box"} />
    <text x={x + w / 2} y={y + (sub ? h / 2 - 4 : h / 2 + 5)} textAnchor="middle" className="lf-text lf-strong">{title}</text>
    {sub && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" className="lf-text lf-muted">{sub}</text>}
  </g>;
}

export function ProblemInstanceFigure() {
  return <Svg label="Et problem beskriver riktig svar; algoritmen gjør en instans om til et svar" width={640} height={210}>
    <Box x={170} y={8} w={300} h={50} title="Problem: sortering" sub="sier hva som er riktig svar for hvert input" />
    <Box x={8} y={110} w={180} h={56} title="Instans" sub="⟨5, 2, 4, 6, 1, 3⟩,  n = 6" />
    <Box x={240} y={110} w={160} h={56} title="Algoritme" sub="Insertion-Sort" accent />
    <Box x={452} y={110} w={180} h={56} title="Svar" sub="⟨1, 2, 3, 4, 5, 6⟩" />
    <line x1="190" y1="138" x2="236" y2="138" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="402" y1="138" x2="448" y2="138" className="lf-line" markerEnd="url(#lf-arrow)" />
    <path d="M220,58 L98,108" className="lf-line lf-dashed" />
    <path d="M420,58 L542,108" className="lf-line lf-dashed" />
    <text x="320" y="196" textAnchor="middle" className="lf-text lf-muted">Korrekt for alle instanser? Hvor fort vokser kjøretiden T(n)?</text>
  </Svg>;
}

const growth = (() => {
  const log10 = Math.log10;
  const fact = (n: number) => { let sum = 0; for (let k = 2; k <= n; k++) sum += log10(k); return sum; };
  const series: { name: string; f: (n: number) => number }[] = [
    { name: "n", f: n => log10(n) },
    { name: "n lg n", f: n => log10(n * Math.log2(n)) },
    { name: "n²", f: n => 2 * log10(n) },
    { name: "n³", f: n => 3 * log10(n) },
    { name: "2ⁿ", f: n => n * log10(2) },
    { name: "n!", f: fact },
  ];
  const x = (n: number) => 60 + ((n - 2) / 58) * 520;
  const y = (v: number) => 250 - (Math.min(v, 20) / 20) * 230;
  const curves = series.map(item => {
    const points: string[] = [];
    let last = { n: 2, v: 0 };
    for (let n = 2; n <= 60; n++) {
      const v = item.f(n);
      points.push(`${x(n).toFixed(1)},${y(v).toFixed(1)}`);
      last = { n, v };
      if (v >= 20) break;
    }
    return { name: item.name, path: `M${points.join(" L")}`, labelX: x(last.n) + 6, labelY: y(last.v) + 4 };
  });
  // Keep the labels at the right edge at least one text line apart.
  const right = curves.filter(curve => curve.labelX > 560).sort((a, b) => b.labelY - a.labelY);
  for (let index = 1; index < right.length; index++) right[index].labelY = Math.min(right[index].labelY, right[index - 1].labelY - 13);
  return curves;
})();

export function GrowthFigure() {
  const limit = 250 - (Math.log10(3.16e15) / 20) * 230;
  return <Svg label="Antall steg for vanlige kjøretider, logaritmisk skala" width={640} height={290}>
    <line x1="60" y1="250" x2="590" y2="250" className="lf-axis" />
    <line x1="60" y1="20" x2="60" y2="250" className="lf-axis" />
    {[0, 5, 10, 15, 20].map(v => <g key={v}>
      <text x="52" y={250 - (v / 20) * 230 + 4} textAnchor="end" className="lf-text lf-small lf-muted">10{v === 0 ? "⁰" : v === 5 ? "⁵" : v === 10 ? "¹⁰" : v === 15 ? "¹⁵" : "²⁰"}</text>
    </g>)}
    {[10, 20, 30, 40, 50, 60].map(n => <text key={n} x={60 + ((n - 2) / 58) * 520} y="268" textAnchor="middle" className="lf-text lf-small lf-muted">{n}</text>)}
    <text x="325" y="286" textAnchor="middle" className="lf-text lf-small lf-muted">n</text>
    <line x1="60" y1={limit} x2="590" y2={limit} className="lf-line lf-dashed lf-stroke-warn" />
    <text x="232" y={limit - 6} className="lf-text lf-small lf-fill-warn">100 år med 1 µs per steg</text>
    {growth.map(item => <g key={item.name}>
      <path d={item.path} className={item.name === "n!" || item.name === "2ⁿ" ? "lf-curve lf-stroke-warn" : "lf-curve"} />
      <text x={Math.min(item.labelX, 600)} y={item.labelY} className="lf-text lf-small lf-strong">{item.name}</text>
    </g>)}
  </Svg>;
}

const cell = 64;
function Cells({ values, x, y, highlight, label }: { values: (number | string)[]; x: number; y: number; highlight: (index: number) => string; label?: (index: number) => string }) {
  return <g>{values.map((value, index) => <g key={index}>
    <rect x={x + index * (cell + 8)} y={y} width={cell} height={cell - 14} rx="8" className={highlight(index)} />
    <text x={x + index * (cell + 8) + cell / 2} y={y + 31} textAnchor="middle" className="lf-text lf-strong">{value}</text>
    {label && <text x={x + index * (cell + 8) + cell / 2} y={y + cell + 4} textAnchor="middle" className="lf-text lf-small lf-muted">{label(index)}</text>}
  </g>)}</g>;
}

export function InsertionStepFigure() {
  const left = 96;
  const at = (index: number) => left + index * (cell + 8) + cell / 2;
  return <Svg label="Ett innsettingssteg: key løftes ut, større elementer skyves til høyre, key settes inn i hullet" width={640} height={300}>
    <text x="12" y="26" className="lf-text lf-small lf-muted">i = 5</text>
    <rect x={at(4) - cell / 2} y="6" width={cell} height={cell - 14} rx="8" className="lf-box-accent" />
    <text x={at(4)} y="37" textAnchor="middle" className="lf-text lf-strong">1</text>
    <text x={at(4) + cell / 2 + 10} y="36" className="lf-text lf-small lf-muted">key = A[i] (linje 2)</text>
    <line x1={at(4)} y1="80" x2={at(4)} y2="60" className="lf-line" markerEnd="url(#lf-arrow)" />
    <Cells values={[2, 4, 5, 6, "", 3]} x={left} y={84}
      highlight={index => index < 4 ? "lf-box-sorted" : index === 4 ? "lf-box lf-dashed" : "lf-box"} label={index => `${index + 1}`} />
    {[0, 1, 2, 3].map(index => <path key={index} d={`M${at(index) + 10},${80} Q${at(index) + 36},${62} ${at(index) + 62},${80}`} className="lf-line" markerEnd="url(#lf-arrow)" />)}
    <text x="12" y="116" className="lf-text lf-small lf-muted">før</text>
    <text x={at(1.5)} y="168" textAnchor="middle" className="lf-text lf-small">6, 5, 4 og 2 er større enn key: skyves ett hakk til høyre (linje 4–6)</text>
    <Cells values={[1, 2, 4, 5, 6, 3]} x={left} y={196} highlight={index => index < 5 ? "lf-box-sorted" : "lf-box"} />
    <text x="12" y="228" className="lf-text lf-small lf-muted">etter</text>
    <text x={at(0)} y="276" textAnchor="middle" className="lf-text lf-small">A[j + 1] = key (linje 7)</text>
    <text x={at(2.5)} y="276" textAnchor="middle" className="lf-text lf-small lf-muted">Nå er A[1 : i] sortert</text>
  </Svg>;
}

export function InvariantFigure() {
  const values = [2, 4, 5, 6, 1, 3, 9, 7];
  return <Svg label="Løkkeinvarianten til Insertion-Sort: A[1:i−1] er sortert ved starten av hver runde" width={640} height={230}>
    <Cells values={values} x={28} y={30}
      highlight={index => index < 4 ? "lf-box-sorted" : index === 4 ? "lf-box-accent" : "lf-box"} label={index => `${index + 1}`} />
    <path d="M28,22 L308,22" className="lf-line" />
    <text x="168" y="16" textAnchor="middle" className="lf-text lf-small lf-strong">A[1 : i − 1]: sortert, samme elementer som før</text>
    <text x={28 + 4 * 72 + 32} y="16" textAnchor="middle" className="lf-text lf-small lf-strong">A[i]</text>
    <text x={28 + 6 * 72 + 32} y="16" textAnchor="middle" className="lf-text lf-small lf-muted">ikke behandlet ennå</text>
    <Box x={8} y={128} w={198} h={84} title="Initialisering" sub="i = 2: A[1 : 1] er ett element" />
    <Box x={221} y={128} w={198} h={84} title="Vedlikehold" sub="sett inn A[i] ⇒ A[1 : i] sortert" />
    <Box x={434} y={128} w={198} h={84} title="Terminering" sub="i = n + 1 ⇒ A[1 : n] sortert" accent />
    <line x1="206" y1="170" x2="219" y2="170" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="419" y1="170" x2="432" y2="170" className="lf-line" markerEnd="url(#lf-arrow)" />
  </Svg>;
}

export function BestWorstFigure() {
  const n = 7;
  const size = 22;
  return <Svg label="Sortert input gir ingen flyttinger; baklengs input gir 1 + 2 + … + (n − 1) flyttinger" width={640} height={250}>
    <text x="150" y="22" textAnchor="middle" className="lf-text lf-strong">Sortert input: beste tilfelle</text>
    {Array.from({ length: n }, (_, index) => <rect key={index} x={40 + index * 32} y={150 - (index + 1) * 14} width="24" height={(index + 1) * 14} rx="3" className="lf-box-sorted" />)}
    <text x="150" y="178" textAnchor="middle" className="lf-text lf-small">Én sammenligning per runde, 0 flyttinger</text>
    <text x="150" y="200" textAnchor="middle" className="lf-text lf-strong lf-fill-accent">T(n) = Θ(n)</text>
    <text x="470" y="22" textAnchor="middle" className="lf-text lf-strong">Baklengs input: verste tilfelle</text>
    {Array.from({ length: n - 1 }, (_, row) => Array.from({ length: row + 1 }, (_, col) =>
      <rect key={`${row}-${col}`} x={380 + col * size} y={40 + row * size} width={size - 3} height={size - 3} rx="3" className="lf-box-warn" />))}
    {Array.from({ length: n - 1 }, (_, row) => <text key={row} x="372" y={40 + row * size + 15} textAnchor="end" className="lf-text lf-small lf-muted">i = {row + 2}</text>)}
    <text x="470" y="200" textAnchor="middle" className="lf-text lf-small">1 + 2 + ⋯ + (n − 1) = n(n − 1)/2 flyttinger</text>
    <text x="470" y="222" textAnchor="middle" className="lf-text lf-strong lf-fill-accent">T(n) = Θ(n²)</text>
  </Svg>;
}

export function ThetaSandwichFigure() {
  const x = (n: number) => 60 + (n / 200) * 520;
  const y = (v: number) => 240 - (v / 200000) * 220;
  const curve = (f: (n: number) => number) => `M${Array.from({ length: 41 }, (_, k) => k * 5).map(n => `${x(n).toFixed(1)},${y(f(n)).toFixed(1)}`).join(" L")}`;
  return <Svg label="For n ≥ 100 ligger 4n² + 100n mellom 4n² og 5n²" width={760} height={280}>
    <rect x={x(100)} y="14" width={x(200) - x(100)} height="226" className="lf-region" />
    <line x1="60" y1="240" x2="586" y2="240" className="lf-axis" />
    <line x1="60" y1="14" x2="60" y2="240" className="lf-axis" />
    <line x1={x(100)} y1="14" x2={x(100)} y2="240" className="lf-line lf-dashed" />
    <text x={x(100)} y="258" textAnchor="middle" className="lf-text lf-small lf-strong">n₀ = 100</text>
    {[0, 50, 150, 200].map(n => <text key={n} x={x(n)} y="258" textAnchor="middle" className="lf-text lf-small lf-muted">{n}</text>)}
    <path d={curve(n => 5 * n * n)} className="lf-curve lf-muted-stroke" />
    <path d={curve(n => 4 * n * n + 100 * n)} className="lf-curve lf-stroke-accent" />
    <path d={curve(n => 4 * n * n)} className="lf-curve lf-muted-stroke" />
    <text x="590" y={y(200000) + 4} className="lf-text lf-small">c₂·g(n) = 5n²</text>
    <text x="590" y={y(180000) + 4} className="lf-text lf-small lf-strong lf-fill-accent">f(n) = 4n² + 100n</text>
    <text x="590" y={y(160000) + 4} className="lf-text lf-small">c₁·g(n) = 4n²</text>
    <text x={x(150)} y="226" textAnchor="middle" className="lf-text lf-small lf-muted">bare n ≥ n₀ teller</text>
  </Svg>;
}
