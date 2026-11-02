// Figures for lecture 3, drawn from the examples in the lecture slides, CLRS and exercise 3.
import { Svg } from "../figureKit";

export function DivideConquerFigure() {
  const columns = [
    { name: "Bisect", rows: [["Del", "se på midten, Θ(1)"], ["Hersk", "bare én halvdel"], ["Kombiner", "ingenting"]], work: 1, recurrence: "T(n/2) + 1" },
    { name: "Merge-Sort", rows: [["Del", "midten, gratis"], ["Hersk", "begge halvdeler"], ["Kombiner", "Merge, Θ(n)"]], work: 2, recurrence: "2T(n/2) + n" },
    { name: "Quicksort", rows: [["Del", "Partition, Θ(n)"], ["Hersk", "begge sider"], ["Kombiner", "gratis"]], work: 0, recurrence: "2T(n/2) + n til T(n − 1) + n" },
  ];
  return <Svg label="Del, hersk og kombiner i Bisect, Merge-Sort og Quicksort, med arbeidet markert" width={640} height={270}>
    {["Del", "Hersk", "Kombiner"].map((row, index) => <text key={row} x="10" y={80 + index * 62} className="lf-text lf-strong">{row}</text>)}
    {columns.map((column, col) => {
      const x = 110 + col * 178;
      return <g key={column.name}>
        <text x={x + 81} y="30" textAnchor="middle" className="lf-text lf-strong">{column.name}</text>
        {column.rows.map(([, body], row) => <g key={row}>
          <rect x={x} y={52 + row * 62} width="162" height="44" rx="10" className={row === column.work ? "lf-box-accent" : "lf-box"} />
          <text x={x + 81} y={79 + row * 62} textAnchor="middle" className={`lf-text${row === column.work ? " lf-strong" : ""}`}>{body}</text>
        </g>)}
        <text x={x + 81} y="256" textAnchor="middle" className="lf-text lf-small lf-muted">{column.recurrence}</text>
      </g>;
    })}
    <text x="10" y="256" className="lf-text lf-small lf-muted">T(n) =</text>
  </Svg>;
}

export function RecursionTreeFigure() {
  const levels = [
    { y: 18, label: "n", xs: [240], w: 72 },
    { y: 78, label: "n/2", xs: [130, 350], w: 64 },
    { y: 138, label: "n/4", xs: [75, 185, 295, 405], w: 56 },
    { y: 214, label: "1", xs: Array.from({ length: 8 }, (_, k) => 47 + k * 55), w: 40 },
  ];
  const sums = ["n", "2 · n/2 = n", "4 · n/4 = n", "n · 1 = n"];
  return <Svg label="Rekursjonstreet til T(n) = 2T(n/2) + n: hvert nivå koster n" width={640} height={290}>
    {levels.slice(0, 2).map((level, index) => level.xs.flatMap(x => [x - (levels[index + 1].xs[1] - levels[index + 1].xs[0]) / 2, x + (levels[index + 1].xs[1] - levels[index + 1].xs[0]) / 2]
      .map(child => <line key={`${x}-${child}`} x1={x} y1={level.y + 34} x2={child} y2={levels[index + 1].y} className="lf-line" />)))}
    {levels.map((level, index) => level.xs.map(x => <g key={`${index}-${x}`}>
      <rect x={x - level.w / 2} y={level.y} width={level.w} height="34" rx="8" className={index === 3 ? "lf-box-sorted" : "lf-box"} />
      <text x={x} y={level.y + 22} textAnchor="middle" className="lf-text lf-strong">{level.label}</text>
    </g>))}
    <text x="240" y="196" textAnchor="middle" className="lf-text lf-strong lf-muted">⋮</text>
    <line x1="480" y1="10" x2="480" y2="250" className="lf-axis" />
    <text x="560" y="12" textAnchor="middle" className="lf-text lf-small lf-muted">sum per nivå</text>
    {levels.map((level, index) => <text key={index} x="560" y={level.y + 22} textAnchor="middle" className="lf-text lf-strong lf-fill-accent">{sums[index]}</text>)}
    <text x="240" y="276" textAnchor="middle" className="lf-text">lg n + 1 nivåer à n gir n lg n + n = Θ(n lg n)</text>
  </Svg>;
}

export function BisectFigure() {
  const values = [1, 3, 4, 6, 8, 9, 11, 14];
  const steps = [
    { p: 1, r: 8, q: 4, text: ["7 > A[4] = 6", "p = 5"] },
    { p: 5, r: 8, q: 6, text: ["7 < A[6] = 9", "r = 5"] },
    { p: 5, r: 5, q: 5, text: ["7 < A[5] = 8", "r = 4"] },
    { p: 5, r: 4, q: 0, text: ["p > r: tomt", "return nil"] },
  ];
  const x = (index: number) => 150 + (index - 1) * 60;
  return <Svg label="Bisect leter etter v = 7 i en sortert tabell med åtte tall og ender med nil" width={640} height={282}>
    {values.map((_, k) => <text key={k} x={x(k + 1) + 26} y="16" textAnchor="middle" className="lf-text lf-small lf-muted">{k + 1}</text>)}
    {steps.map((step, row) => {
      const y = 26 + row * 62;
      return <g key={row}>
        <text x="8" y={y + 16} className="lf-text lf-small lf-strong">{`p = ${step.p}, r = ${step.r}`}</text>
        <text x="8" y={y + 34} className="lf-text lf-small">{step.text[0]}</text>
        <text x="8" y={y + 50} className="lf-text lf-small lf-fill-accent lf-strong">{step.text[1]}</text>
        {values.map((value, k) => {
          const index = k + 1;
          const inside = index >= step.p && index <= step.r;
          return <g key={k}>
            <rect x={x(index)} y={y} width="52" height="40" rx="7" className={index === step.q ? "lf-box-warn" : inside ? "lf-box-accent" : "lf-box"} />
            <text x={x(index) + 26} y={y + 25} textAnchor="middle" className={`lf-text${inside ? " lf-strong" : " lf-muted"}`}>{value}</text>
          </g>;
        })}
      </g>;
    })}
    <text x="390" y="276" textAnchor="middle" className="lf-text lf-small lf-muted">segmentet A[p : r] halveres hver runde; gult er midten q = ⌊(p + r)/2⌋</text>
  </Svg>;
}

export function MergeSortFigure() {
  const rows = [[5, 2, 4, 7, 1, 3, 2, 6], [2, 5, 4, 7, 1, 3, 2, 6], [2, 4, 5, 7, 1, 2, 3, 6], [1, 2, 2, 3, 4, 5, 6, 7]];
  const cell = 36, step = 40, gap = 14;
  const layout = (level: number) => {
    const size = 2 ** level;
    const width = 7 * step + (8 / size - 1) * gap + cell;
    const start = 255 - width / 2;
    return (k: number) => start + k * step + Math.floor(k / size) * gap;
  };
  const y = (level: number) => 24 + level * 72;
  return <Svg label="Merge-Sort på ⟨5, 2, 4, 7, 1, 3, 2, 6⟩: enkeltelementer flettes nivå for nivå" width={640} height={318}>
    {rows.slice(1).map((_, index) => {
      const level = index + 1, size = 2 ** level, child = layout(level - 1), parent = layout(level);
      return Array.from({ length: 8 / size }, (_, group) => [0, 1].map(half => {
        const first = group * size + half * (size / 2);
        const from = child(first) + ((size / 2 - 1) * step) / 2 + cell / 2;
        const to = parent(group * size) + ((size - 1) * step) / 2 + cell / 2;
        return <line key={`${level}-${group}-${half}`} x1={from} y1={y(level - 1) + 34} x2={to} y2={y(level)} className="lf-line" markerEnd="url(#lf-arrow)" />;
      }));
    })}
    {rows.map((row, level) => {
      const at = layout(level);
      return <g key={level}>
        {row.map((value, k) => <g key={k}>
          <rect x={at(k)} y={y(level)} width={cell} height="34" rx="6" className={level === 0 ? "lf-box" : "lf-box-sorted"} />
          <text x={at(k) + cell / 2} y={y(level) + 22} textAnchor="middle" className="lf-text lf-strong">{value}</text>
        </g>)}
        <text x="480" y={y(level) + 22} className="lf-text lf-small lf-muted">{level === 0 ? "delt ned (gratis)" : "flett: 8 flyttinger"}</text>
      </g>;
    })}
    <text x="255" y="310" textAnchor="middle" className="lf-text">lg 8 = 3 flettenivåer à n = 8 gir 24 = n lg n flyttinger</text>
  </Svg>;
}

export function PartitionFigure() {
  // G: ≤ pivot, W: > pivot, U: not seen yet, P: the pivot.
  const rows: { label: string; values: number[]; zones: string }[] = [
    { label: "start, i = 0", values: [2, 8, 7, 1, 3, 5, 6, 4], zones: "UUUUUUUP" },
    { label: "etter j = 3, i = 1", values: [2, 8, 7, 1, 3, 5, 6, 4], zones: "GWWUUUUP" },
    { label: "etter j = 5, i = 3", values: [2, 1, 3, 8, 7, 5, 6, 4], zones: "GGGWWUUP" },
    { label: "etter j = 7, i = 3", values: [2, 1, 3, 8, 7, 5, 6, 4], zones: "GGGWWWWP" },
    { label: "bytt A[4] og A[8]", values: [2, 1, 3, 4, 7, 5, 6, 8], zones: "GGGPWWWW" },
  ];
  const classes: Record<string, string> = { G: "lf-box-sorted", W: "lf-box-warn", U: "lf-box", P: "lf-box-accent" };
  const x = (k: number) => 186 + k * 54;
  return <Svg label="Partition på ⟨2, 8, 7, 1, 3, 5, 6, 4⟩ med pivot 4: små til venstre, store til høyre" width={640} height={330}>
    {rows[0].values.map((_, k) => <text key={k} x={x(k) + 24} y="14" textAnchor="middle" className="lf-text lf-small lf-muted">{k + 1}</text>)}
    {rows.map((row, index) => {
      const y = 22 + index * 52;
      return <g key={index}>
        <text x="8" y={y + 25} className={`lf-text lf-small${index === 4 ? " lf-strong" : ""}`}>{row.label}</text>
        {row.values.map((value, k) => <g key={k}>
          <rect x={x(k)} y={y} width="48" height="38" rx="7" className={classes[row.zones[k]]} />
          <text x={x(k) + 24} y={y + 24} textAnchor="middle" className="lf-text lf-strong">{value}</text>
        </g>)}
      </g>;
    })}
    <text x={x(3) + 24} y="290" textAnchor="middle" className="lf-text lf-small lf-strong lf-fill-accent">q = 4</text>
    {[["lf-box-sorted", "≤ x (A[p : i])"], ["lf-box-warn", "> x (A[i + 1 : j − 1])"], ["lf-box", "ikke sett"], ["lf-box-accent", "pivot x = 4"]].map(([style, label], index) => <g key={label}>
      <rect x={20 + index * 156} y="304" width="16" height="16" rx="3" className={style} />
      <text x={42 + index * 156} y="317" className="lf-text lf-small">{label}</text>
    </g>)}
  </Svg>;
}

export function QuicksortShapesFigure() {
  const width = 250;
  return <Svg label="Arbeid per nivå i Quicksort: balansert deling gir n lg n, sortert input gir en kjede og n²" width={640} height={300}>
    <text x="150" y="20" textAnchor="middle" className="lf-text lf-strong">Beste: pivot i midten</text>
    {[0, 1, 2, 3].map(level => Array.from({ length: 2 ** level }, (_, k) => {
      const part = width / 2 ** level;
      return <g key={`${level}-${k}`}>
        <rect x={25 + k * part + 1.5} y={40 + level * 36} width={part - 3} height="26" rx="4" className="lf-box-sorted" />
        <text x={25 + (k + 0.5) * part} y={58 + level * 36} textAnchor="middle" className="lf-text lf-small lf-strong">{level === 0 ? "n" : `n/${2 ** level}`}</text>
      </g>;
    }))}
    <text x="150" y="196" textAnchor="middle" className="lf-text lf-strong lf-muted">⋮</text>
    <text x="150" y="232" textAnchor="middle" className="lf-text">lg n nivåer, n per nivå</text>
    <text x="150" y="254" textAnchor="middle" className="lf-text lf-strong lf-fill-accent">Θ(n lg n)</text>
    <line x1="320" y1="10" x2="320" y2="270" className="lf-axis" />
    <text x="490" y="20" textAnchor="middle" className="lf-text lf-strong">Verste: sortert input</text>
    {Array.from({ length: 8 }, (_, level) => {
      const bar = (width * (8 - level)) / 8;
      return <g key={level}>
        <rect x="365" y={36 + level * 22} width={bar - 14} height="18" rx="3" className="lf-box-sorted" />
        <rect x={365 + bar - 12} y={36 + level * 22} width="12" height="18" rx="3" className="lf-box-accent" />
      </g>;
    })}
    {["n", "n − 1", "n − 2"].map((label, level) => <text key={label} x="372" y={49 + level * 22} className="lf-text lf-small lf-strong">{label}</text>)}
    <text x="490" y="232" textAnchor="middle" className="lf-text">n nivåer: n + (n − 1) + ⋯ + 1</text>
    <text x="490" y="254" textAnchor="middle" className="lf-text lf-strong lf-fill-accent">Θ(n²)</text>
    <text x="320" y="290" textAnchor="middle" className="lf-text lf-small lf-muted">bredde = arbeid på nivået, lilla = pivoten, som havner på endelig plass</text>
  </Svg>;
}

export function MasterCasesFigure() {
  const panels = [
    { title: "Tilfelle 1: bladene", recurrence: "4T(n/2) + n", answer: "Θ(n²)", bars: [[22, "n"], [44, "2n"], [88, "4n"], [176, "8n"]] },
    { title: "Tilfelle 2: like", recurrence: "2T(n/2) + n", answer: "Θ(n lg n)", bars: [[110, "n"], [110, "n"], [110, "n"], [110, "n"]] },
    { title: "Tilfelle 3: roten", recurrence: "2T(n/2) + n²", answer: "Θ(n²)", bars: [[176, "n²"], [88, "n²/2"], [44, "n²/4"], [22, "n²/8"]] },
  ] as const;
  return <Svg label="Masterteoremets tre tilfeller: arbeidet per nivå vokser, er likt eller avtar nedover i treet" width={640} height={250}>
    {panels.map((panel, index) => {
      const center = 107 + index * 213;
      return <g key={panel.title}>
        <text x={center} y="20" textAnchor="middle" className="lf-text lf-strong">{panel.title}</text>
        <text x={center} y="40" textAnchor="middle" className="lf-text lf-small lf-muted">T(n) = {panel.recurrence}</text>
        {panel.bars.map(([bar, label], level) => <g key={level}>
          <rect x={center - bar / 2} y={56 + level * 34} width={bar} height="24" rx="4" className={(index === 0 && level === 3) || (index === 2 && level === 0) ? "lf-box-accent" : "lf-box-sorted"} />
          <text x={center} y={73 + level * 34} textAnchor="middle" className="lf-text lf-small lf-strong">{label}</text>
        </g>)}
        <text x={center} y="218" textAnchor="middle" className="lf-text lf-strong lf-fill-accent">{panel.answer}</text>
        {index > 0 && <line x1={center - 107} y1="10" x2={center - 107} y2="226" className="lf-axis" />}
      </g>;
    })}
    <text x="320" y="244" textAnchor="middle" className="lf-text lf-small lf-muted">nivå 0 (roten) øverst; bredde = summen av arbeidet på nivået</text>
  </Svg>;
}
