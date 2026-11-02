// Figures for lecture 2a, drawn from the examples in the lecture slides and the lesson text.
import { Box, Svg } from "../figureKit";

const addresses = ["f40ce3de", "f40ce3e2", "f40ce3e6", "f40ce3ea", "f40ce3ee", "f40ce3f2", "f40ce3f6", "f40ce3fa"];

export function ArrayMemoryFigure() {
  const values = ["", 14, 25, 32, 48, 57, 63, ""];
  return <Svg label="En tabell ligger i en sammenhengende minneblokk, så adressen til A[i] kan regnes ut" width={640} height={190}>
    {addresses.map((address, index) => {
      const inside = index >= 1 && index <= 6;
      return <g key={address}>
        <rect x={8 + index * 78} y={40} width={72} height={46} rx="6" className={inside ? "lf-box-sorted" : "lf-box lf-dashed"} />
        <text x={44 + index * 78} y={69} textAnchor="middle" className="lf-text lf-strong">{values[index]}</text>
        <text x={44 + index * 78} y={104} textAnchor="middle" className="lf-text lf-small lf-muted">{address}</text>
        {inside && <text x={44 + index * 78} y={30} textAnchor="middle" className="lf-text lf-small lf-strong">A[{index}]</text>}
      </g>;
    })}
    <line x1={44 + 78} y1="120" x2={44 + 5 * 78} y2="120" className="lf-line" markerEnd="url(#lf-arrow)" />
    <text x={44 + 3 * 78} y="140" textAnchor="middle" className="lf-text lf-small">b(i − s) = 4 · (5 − 1) = 16 bytes forbi starten a</text>
    <text x="320" y="176" textAnchor="middle" className="lf-text lf-strong lf-fill-accent">adressen til A[i] = a + b(i − s)</text>
  </Svg>;
}

export function MatrixLayoutFigure() {
  const cellAt = (x: number, y: number, value: number, highlight: boolean) => <g key={`${x}-${y}`}>
    <rect x={x} y={y} width="40" height="36" rx="5" className={highlight ? "lf-box-accent" : "lf-box"} />
    <text x={x + 20} y={y + 23} textAnchor="middle" className="lf-text lf-strong">{value}</text>
  </g>;
  const rowMajor = [1, 2, 3, 4, 5, 6];
  const columnMajor = [1, 4, 2, 5, 3, 6];
  return <Svg label="Matrisen 2 × 3 lagret radvis og kolonnevis i én tabell" width={640} height={210}>
    <text x="70" y="22" textAnchor="middle" className="lf-text lf-small lf-strong">M (r = 2, c = 3)</text>
    {[0, 1].flatMap(row => [0, 1, 2].map(col => cellAt(10 + col * 42, 36 + row * 40, row * 3 + col + 1, row === 0)))}
    <text x="200" y="40" className="lf-text lf-small lf-strong">Radvis (row-major)</text>
    {rowMajor.map((value, index) => cellAt(200 + index * 44, 50, value, index < 3))}
    <text x="474" y="74" className="lf-text lf-small lf-muted">M[i, j] = A[c(i − 1) + (j − 1) + 1]</text>
    <text x="200" y="128" className="lf-text lf-small lf-strong">Kolonnevis (column-major)</text>
    {columnMajor.map((value, index) => cellAt(200 + index * 44, 138, value, value <= 3))}
    <text x="474" y="162" className="lf-text lf-small lf-muted">M[i, j] = A[r(j − 1) + (i − 1) + 1]</text>
    <text x="70" y="140" textAnchor="middle" className="lf-text lf-small lf-muted">rad 1 er markert</text>
  </Svg>;
}

export function StackQueueFigure() {
  const stack = [15, 6, 2, 9, 17];
  const queue: (number | string)[] = ["", "", "", "", "", "", 15, 6, 9, 8, 4, ""];
  return <Svg label="Stakk med top, og kø som ringbuffer med head og tail" width={640} height={260}>
    <text x="80" y="20" textAnchor="middle" className="lf-text lf-strong">Stakk (LIFO)</text>
    {Array.from({ length: 6 }, (_, index) => {
      const y = 214 - index * 34;
      const value = stack[index];
      return <g key={index}>
        <rect x="40" y={y} width="80" height="30" rx="5" className={value !== undefined ? "lf-box-sorted" : "lf-box lf-dashed"} />
        <text x="80" y={y + 20} textAnchor="middle" className="lf-text lf-strong">{value ?? ""}</text>
        <text x="30" y={y + 20} textAnchor="end" className="lf-text lf-small lf-muted">{index + 1}</text>
      </g>;
    })}
    <line x1="170" y1={214 - 4 * 34 + 15} x2="126" y2={214 - 4 * 34 + 15} className="lf-line" markerEnd="url(#lf-arrow)" />
    <text x="176" y={214 - 4 * 34 + 19} className="lf-text lf-small">S.top = 5</text>
    <text x="80" y="254" textAnchor="middle" className="lf-text lf-small lf-muted">Push og Pop bare i toppen</text>
    <text x="430" y="20" textAnchor="middle" className="lf-text lf-strong">Kø (FIFO) som ringbuffer</text>
    {queue.map((value, index) => <g key={index}>
      <rect x={240 + index * 32} y="96" width="28" height="36" rx="4" className={value !== "" ? "lf-box-sorted" : "lf-box"} />
      <text x={254 + index * 32} y="119" textAnchor="middle" className="lf-text lf-small lf-strong">{value}</text>
      <text x={254 + index * 32} y="148" textAnchor="middle" className="lf-text lf-small lf-muted">{index + 1}</text>
    </g>)}
    <line x1={254 + 6 * 32} y1="70" x2={254 + 6 * 32} y2="92" className="lf-line" markerEnd="url(#lf-arrow)" />
    <text x={254 + 6 * 32} y="62" textAnchor="middle" className="lf-text lf-small">head = 7</text>
    <line x1={254 + 11 * 32} y1="70" x2={254 + 11 * 32} y2="92" className="lf-line" markerEnd="url(#lf-arrow)" />
    <text x={254 + 11 * 32} y="62" textAnchor="middle" className="lf-text lf-small">tail = 12</text>
    <path d={`M${254 + 11 * 32},170 Q430,220 254,170`} className="lf-line lf-dashed" markerEnd="url(#lf-arrow)" />
    <text x="430" y="226" textAnchor="middle" className="lf-text lf-small lf-muted">etter plass 12 fortsetter tail og head på plass 1</text>
  </Svg>;
}

export function LinkedListDeleteFigure() {
  const node = (x: number, y: number, key: number, removed = false) => <g key={`${x}-${y}`}>
    <rect x={x} y={y} width="96" height="40" rx="8" className={removed ? "lf-box lf-dashed" : "lf-box-sorted"} />
    <line x1={x + 28} y1={y} x2={x + 28} y2={y + 40} className="lf-axis" />
    <line x1={x + 68} y1={y} x2={x + 68} y2={y + 40} className="lf-axis" />
    <text x={x + 14} y={y + 25} textAnchor="middle" className="lf-text lf-small lf-muted">prev</text>
    <text x={x + 48} y={y + 26} textAnchor="middle" className="lf-text lf-strong">{key}</text>
    <text x={x + 82} y={y + 25} textAnchor="middle" className="lf-text lf-small lf-muted">next</text>
  </g>;
  const xs = [70, 210, 350, 490];
  return <Svg label="List-Delete: naboene peker forbi noden som fjernes" width={640} height={250}>
    <text x="10" y="56" className="lf-text lf-small lf-muted">før</text>
    <text x="10" y="40" className="lf-text lf-small">L.head</text>
    {[9, 16, 7, 4].map((key, index) => node(xs[index], 30, key, false))}
    {xs.slice(0, 3).map(x => <g key={x}>
      <line x1={x + 96} y1="42" x2={x + 140} y2="42" className="lf-line" markerEnd="url(#lf-arrow)" />
      <line x1={x + 140} y1="58" x2={x + 96} y2="58" className="lf-line" markerEnd="url(#lf-arrow)" />
    </g>)}
    <text x="10" y="166" className="lf-text lf-small lf-muted">etter</text>
    {[9, 16, 7, 4].map((key, index) => node(xs[index], index === 1 ? 192 : 140, key, index === 1))}
    <path d={`M${xs[0] + 96},152 C${xs[1] + 20},112 ${xs[1] + 76},112 ${xs[2]},152`} className="lf-line lf-stroke-accent" markerEnd="url(#lf-arrow)" />
    <path d={`M${xs[2]},168 C${xs[1] + 76},208 ${xs[1] + 20},208 ${xs[0] + 96},168`} className="lf-line lf-stroke-accent" markerEnd="url(#lf-arrow)" />
    <line x1={xs[2] + 96} y1="152" x2={xs[3]} y2="152" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1={xs[3]} y1="168" x2={xs[2] + 96} y2="168" className="lf-line" markerEnd="url(#lf-arrow)" />
    <text x={xs[1] + 48} y="248" textAnchor="middle" className="lf-text lf-small lf-muted">ingen peker lenger på 16</text>
  </Svg>;
}

export function HashChainingFigure() {
  // Keys 5, 28, 19, 15, 20, 33, 12, 17, 10 inserted with h(k) = k mod 9 and List-Prepend.
  const chains: number[][] = [[], [10, 19, 28], [20], [12], [], [5], [33, 15], [], [17]];
  return <Svg label="Hashtabell med kjeding, m = 9 og h(k) = k mod 9" width={640} height={340}>
    {chains.map((chain, slot) => {
      const y = 12 + slot * 36;
      return <g key={slot}>
        <text x="24" y={y + 20} textAnchor="end" className="lf-text lf-small lf-muted">{slot}</text>
        <rect x="32" y={y} width="44" height="28" rx="4" className={chain.length ? "lf-box-accent" : "lf-box"} />
        {chain.length === 0 && <text x="54" y={y + 19} textAnchor="middle" className="lf-text lf-small lf-muted">NIL</text>}
        {chain.map((key, index) => <g key={key}>
          <line x1={index === 0 ? 70 : 132 + (index - 1) * 74} y1={y + 14} x2={96 + index * 74} y2={y + 14} className="lf-line" markerEnd="url(#lf-arrow)" />
          <rect x={98 + index * 74} y={y} width="34" height="28" rx="6" className="lf-box-sorted" />
          <text x={115 + index * 74} y={y + 19} textAnchor="middle" className="lf-text lf-small lf-strong">{key}</text>
        </g>)}
      </g>;
    })}
    <Box x={360} y={40} w={260} h={70} title="Lastfaktor α = n / m = 9 / 9 = 1" sub="men plass 0, 4 og 7 er tomme" />
    <Box x={360} y={140} w={260} h={70} title="Søk etter 28" sub="må gå forbi 10 og 19 først" />
    <Box x={360} y={240} w={260} h={70} title="Forventet Θ(1 + α)" sub="verste tilfelle Θ(n): alt i én kjede" accent />
  </Svg>;
}

// Insertion i costs 1, plus i - 1 copies when the table of size i - 1 is full (i - 1 a power of two).
const cost = (i: number) => 1 + (i > 1 && ((i - 1) & (i - 2)) === 0 ? i - 1 : 0);
const n = 17;
const totals = Array.from({ length: n }, (_, k) => Array.from({ length: k + 1 }, (_, j) => cost(j + 1)).reduce((sum, value) => sum + value, 0));

export function TableDoublingFigure() {
  const x = (i: number) => 60 + (i - 1) * 32;
  const y = (v: number) => 230 - v * 3.6;
  return <Svg label="Tabelldobling: kostnad per innsetting og totalt arbeid" width={640} height={270}>
    <line x1="50" y1="230" x2="610" y2="230" className="lf-axis" />
    <line x1="50" y1="20" x2="50" y2="230" className="lf-axis" />
    {Array.from({ length: n }, (_, k) => {
      const i = k + 1;
      const copy = cost(i) > 1;
      return <g key={i}>
        <rect x={x(i) - 9} y={y(cost(i))} width="18" height={cost(i) * 3.6} rx="2" className={copy ? "lf-box-warn" : "lf-box-sorted"} />
        <text x={x(i)} y="246" textAnchor="middle" className="lf-text lf-small lf-muted">{i}</text>
        {copy && <text x={x(i)} y={y(cost(i)) - 5} textAnchor="middle" className="lf-text lf-small lf-strong">{cost(i)}</text>}
      </g>;
    })}
    <path d={`M${totals.map((value, k) => `${x(k + 1)},${y(value)}`).join(" L")}`} className="lf-curve lf-stroke-accent" />
    <path d={`M${x(1)},${y(3)} L${x(n)},${y(3 * n)}`} className="lf-line lf-dashed" />
    <text x={x(n) - 4} y={y(3 * n) - 6} textAnchor="end" className="lf-text lf-small">3i</text>
    <text x={x(n) + 6} y={y(totals[n - 1]) + 4} className="lf-text lf-small lf-strong lf-fill-accent">totalt</text>
    <text x="330" y="264" textAnchor="middle" className="lf-text lf-small lf-muted">innsetting nr. i</text>
  </Svg>;
}
