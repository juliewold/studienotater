// Figures for lecture 4, drawn from the examples in the lecture slides, CLRS and exercise 4.
import { Svg } from "../figureKit";

function Card({ x, y, w, h, lines, accent = false }: { x: number; y: number; w: number; h: number; lines: string[]; accent?: boolean }) {
  const top = y + h / 2 - (lines.length - 1) * 8 + 4;
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" className={accent ? "lf-box-accent" : "lf-box"} />
    {lines.map((line, index) => <text key={index} x={x + w / 2} y={top + index * 16} textAnchor="middle"
      className={`lf-text${index === 0 ? " lf-strong" : " lf-small"}${index === lines.length - 1 && index > 0 ? " lf-fill-accent lf-strong" : ""}`}>{line}</text>)}
  </g>;
}

export function StrategyFigure() {
  const left = [{ x: 10, lines: ["Randomized-Select", "tilfeldig pivot", "Θ(n) forventet"] }, { x: 175, lines: ["Select", "median av medianer", "Θ(n) verste"] }];
  const right = [
    { x: 370, lines: ["Counting-Sort", "heltall 0..k", "Θ(n + k)"] },
    { x: 480, lines: ["Radix-Sort", "d siffer", "Θ(d(n + k))"] },
    { x: 590, lines: ["Bucket-Sort", "uniform i [0, 1)", "Θ(n) i snitt"] },
  ];
  return <Svg label="To veier forbi sorteringsgrensen: svekk kravet til output eller styrk kravet til input" width={700} height={300}>
    <Card x={190} y={8} w={320} h={52} lines={["Sammenligningsbasert sortering", "Ω(n lg n) i verste tilfelle"]} />
    <line x1="350" y1="60" x2="170" y2="100" className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1="350" y1="60" x2="530" y2="100" className="lf-line" markerEnd="url(#lf-arrow)" />
    <Card x={10} y={100} w={320} h={46} lines={["Svekk kravet til output", "finn bare elementet med rang i"]} accent />
    <Card x={370} y={100} w={320} h={46} lines={["Styrk kravet til input", "anta noe om verdiene"]} accent />
    {left.map(card => <line key={card.x} x1="170" y1="146" x2={card.x + 77} y2="182" className="lf-line" markerEnd="url(#lf-arrow)" />)}
    {right.map(card => <line key={card.x} x1="530" y1="146" x2={card.x + 50} y2="182" className="lf-line" markerEnd="url(#lf-arrow)" />)}
    {left.map(card => <Card key={card.x} x={card.x} y={182} w={155} h={66} lines={card.lines} />)}
    {right.map(card => <Card key={card.x} x={card.x} y={182} w={100} h={66} lines={card.lines} />)}
    <text x="350" y="282" textAnchor="middle" className="lf-text lf-small lf-muted">Ingen av dem motsier grensen: de sorterer ikke alt, eller de bruker mer enn sammenligninger</text>
  </Svg>;
}

export function DecisionTreeFigure() {
  // Comparison nodes and leaves of the CLRS decision tree for three elements (fig. 8.1).
  const nodes = [
    { id: "r", x: 220, y: 24, label: "1 : 2" }, { id: "a", x: 110, y: 94, label: "2 : 3" }, { id: "b", x: 330, y: 94, label: "1 : 3" },
    { id: "c", x: 165, y: 164, label: "1 : 3" }, { id: "d", x: 385, y: 164, label: "2 : 3" },
  ];
  const leaves = [
    { x: 55, y: 164, label: "⟨1,2,3⟩" }, { x: 275, y: 164, label: "⟨2,1,3⟩" },
    { x: 120, y: 236, label: "⟨1,3,2⟩" }, { x: 210, y: 236, label: "⟨3,1,2⟩", path: true },
    { x: 340, y: 236, label: "⟨2,3,1⟩" }, { x: 430, y: 236, label: "⟨3,2,1⟩" },
  ];
  const edges = [
    { from: [220, 24], to: [110, 94], sign: "≤", path: true }, { from: [220, 24], to: [330, 94], sign: ">" },
    { from: [110, 94], to: [55, 164], sign: "≤" }, { from: [110, 94], to: [165, 164], sign: ">", path: true },
    { from: [330, 94], to: [275, 164], sign: "≤" }, { from: [330, 94], to: [385, 164], sign: ">" },
    { from: [165, 164], to: [120, 236], sign: "≤" }, { from: [165, 164], to: [210, 236], sign: ">", path: true },
    { from: [385, 164], to: [340, 236], sign: "≤" }, { from: [385, 164], to: [430, 236], sign: ">" },
  ];
  return <Svg label="Beslutningstreet for å sortere tre elementer: seks blader, ett for hver permutasjon, og høyde tre" width={640} height={300}>
    {edges.map(({ from, to, sign, path }, index) => <g key={index}>
      <line x1={from[0]} y1={from[1] + 30} x2={to[0]} y2={to[1]} className={path ? "lf-line lf-stroke-accent" : "lf-line"} />
      <text x={(from[0] + to[0]) / 2 + (to[0] < from[0] ? -12 : 12)} y={(from[1] + 30 + to[1]) / 2 + 4} textAnchor="middle" className="lf-text lf-small lf-strong">{sign}</text>
    </g>)}
    {nodes.map(node => <g key={node.id}>
      <rect x={node.x - 30} y={node.y} width="60" height="30" rx="15" className={["r", "a", "c"].includes(node.id) ? "lf-box-accent" : "lf-box"} />
      <text x={node.x} y={node.y + 20} textAnchor="middle" className="lf-text lf-strong">{node.label}</text>
    </g>)}
    {leaves.map(leaf => <g key={leaf.label}>
      <rect x={leaf.x - 34} y={leaf.y} width="68" height="30" rx="6" className={leaf.path ? "lf-box-warn" : "lf-box-sorted"} />
      <text x={leaf.x} y={leaf.y + 20} textAnchor="middle" className="lf-text lf-small lf-strong">{leaf.label}</text>
    </g>)}
    <line x1="478" y1="10" x2="478" y2="280" className="lf-axis" />
    {[
      ["i : j betyr «er aᵢ ≤ aⱼ?»", ""], ["Input ⟨6, 8, 5⟩:", "6 ≤ 8, 8 > 5, 6 > 5"], ["svaret ⟨3,1,2⟩:", "a₃ ≤ a₁ ≤ a₂"],
      ["3! = 6 blader", "én per permutasjon"], ["høyde h = 3:", "2³ = 8 ≥ 6 = 3!"],
    ].map(([main, sub], index) => <g key={main}>
      <text x="490" y={30 + index * 52} className={`lf-text lf-small lf-strong${index === 4 ? " lf-fill-accent" : ""}`}>{main}</text>
      <text x="490" y={47 + index * 52} className="lf-text lf-small">{sub}</text>
    </g>)}
    <text x="240" y="292" textAnchor="middle" className="lf-text lf-small lf-muted">én kjøring = én sti; verste tilfelle = lengste sti = høyden</text>
  </Svg>;
}

export function RandomizedSelectFigure() {
  // K: kept (we search on), D: discarded, P: pivot on its final place, C: chosen pivot before Partition, U: untouched input.
  const rows = [
    { lines: ["p = 1, r = 8, i = 4", "tilfeldig pivot: 6"], values: [4, 6, 8, 3, 2, 5, 7, 1], zones: "UCUUUUUU" },
    { lines: ["q = 6, så k = 6 − 1 + 1 = 6", "i < k: let til venstre, i = 4"], values: [4, 1, 3, 2, 5, 6, 7, 8], zones: "KKKKKPDD" },
    { lines: ["A[1 : 5], pivot 2: q = 2, k = 2", "i > k: til høyre, i = 4 − 2 = 2"], values: [1, 2, 3, 5, 4, 6, 7, 8], zones: "DPKKKDDD" },
    { lines: ["A[3 : 5], pivot 4: q = 4", "k = 4 − 3 + 1 = 2 = i: svar 4"], values: [1, 2, 3, 4, 5, 6, 7, 8], zones: "DDDPDDDD" },
  ];
  const classes: Record<string, string> = { K: "lf-box-sorted", D: "lf-box", P: "lf-box-accent", C: "lf-box-warn", U: "lf-box" };
  const x = (k: number) => 250 + k * 49;
  return <Svg label="Randomized-Select finner det fjerde minste elementet i åtte tall: etter hver Partition fortsetter den bare på én side" width={640} height={296}>
    {rows[0].values.map((_, k) => <text key={k} x={x(k) + 22} y="14" textAnchor="middle" className="lf-text lf-small lf-muted">{k + 1}</text>)}
    {rows.map((row, index) => {
      const y = 22 + index * 60;
      return <g key={index}>
        <text x="4" y={y + 16} className="lf-text lf-small lf-strong">{row.lines[0]}</text>
        <text x="4" y={y + 34} className={`lf-text lf-small${index === 3 ? " lf-strong lf-fill-accent" : ""}`}>{row.lines[1]}</text>
        {row.values.map((value, k) => <g key={k}>
          <rect x={x(k)} y={y} width="44" height="40" rx="7" className={classes[row.zones[k]]} />
          <text x={x(k) + 22} y={y + 25} textAnchor="middle" className={`lf-text${row.zones[k] === "D" ? " lf-muted" : " lf-strong"}`}>{value}</text>
        </g>)}
      </g>;
    })}
    {[["lf-box-warn", "valgt pivot"], ["lf-box-accent", "pivot på endelig plass"], ["lf-box-sorted", "her leter vi videre"], ["lf-box", "kastet (grå tekst)"]].map(([style, label], index) => <g key={label}>
      <rect x={6 + index * 160} y="270" width="16" height="16" rx="3" className={style} />
      <text x={28 + index * 160} y="283" className="lf-text lf-small">{label}</text>
    </g>)}
  </Svg>;
}

export function MedianOfMediansFigure() {
  const cx = (column: number) => 52 + column * 42, cy = (row: number) => 56 + row * 36;
  return <Svg label="Median av medianer: grupper på fem som kolonner, sortert etter median; minst omtrent 3n/10 elementer er garantert mindre og større enn pivoten x" width={640} height={290}>
    <rect x={cx(0) - 20} y={cy(0) - 18} width={cx(3) - cx(0) + 40} height={cy(2) - cy(0) + 36} rx="10" className="lf-box-sorted" />
    <rect x={cx(3) - 20} y={cy(2) - 18} width={cx(6) - cx(3) + 40} height={cy(4) - cy(2) + 36} rx="10" className="lf-box-warn" />
    {Array.from({ length: 7 }, (_, column) => <g key={column}>
      <line x1={cx(column)} y1={cy(0)} x2={cx(column)} y2={cy(4)} className="lf-axis" />
      {Array.from({ length: 5 }, (_, row) => <circle key={row} cx={cx(column)} cy={cy(row)} r={column === 3 && row === 2 ? 14 : 10}
        className={column === 3 && row === 2 ? "lf-box-accent" : row === 2 ? "lf-box lf-stroke-accent" : "lf-box"} />)}
    </g>)}
    <text x={cx(3)} y={cy(2) + 5} textAnchor="middle" className="lf-text lf-strong lf-fill-accent">x</text>
    <text x={cx(3)} y="18" textAnchor="middle" className="lf-text lf-small lf-muted">grupper på 5, ordnet etter gruppemedianen →</text>
    <text x="8" y={cy(0) + 4} className="lf-text lf-small lf-muted">små</text>
    <text x="8" y={cy(4) + 4} className="lf-text lf-small lf-muted">store</text>
    <text x={cx(0)} y={cy(4) + 44} className="lf-text lf-small"><tspan className="lf-strong">grønt</tspan> ≤ x og <tspan className="lf-strong">gult</tspan> ≥ x, uansett input</text>
    <text x={cx(0)} y={cy(4) + 62} className="lf-text lf-small">3 av 5 i halvparten av gruppene ≈ 3n/10 på hver side</text>
    <line x1="350" y1="10" x2="350" y2="280" className="lf-axis" />
    {[
      ["1", "Del A i n/5 grupper à 5"], ["2", "Sorter hver gruppe: Θ(1) per gruppe"], ["3", "x = medianen av de n/5 medianene"],
      ["", "(rekursivt kall: T(n/5))"], ["4", "Partition rundt x"], ["5", "Rekurser på én side: høyst 7n/10"],
    ].map(([step, body], index) => <g key={index}>
      {step && <circle cx="374" cy={36 + index * 40} r="11" className="lf-box-accent" />}
      {step && <text x="374" y={41 + index * 40} textAnchor="middle" className="lf-text lf-small lf-strong">{step}</text>}
      <text x="394" y={41 + index * 40} className={`lf-text${step ? "" : " lf-small lf-muted"}`}>{body}</text>
    </g>)}
    <text x="374" y="272" className="lf-text lf-small lf-strong lf-fill-accent">pivoten er aldri helt i kanten</text>
  </Svg>;
}

export function SelectTreeFigure() {
  const levels = [
    { y: 16, nodes: [[220, "n"]] },
    { y: 82, nodes: [[120, "n/5"], [320, "7n/10"]] },
    { y: 148, nodes: [[70, "n/25"], [170, "7n/50"], [270, "7n/50"], [370, "49n/100"]] },
  ] as const;
  const sums = ["n", "(1/5 + 7/10) n = 0,9 n", "0,9² n = 0,81 n"];
  return <Svg label="Rekursjonstreet til Select: hvert nivå koster 9/10 av nivået over, så totalen er en geometrisk sum" width={640} height={270}>
    {levels.slice(0, 2).map((level, index) => level.nodes.map(([x], parent) => [0, 1].map(child => {
      const [toX] = levels[index + 1].nodes[parent * 2 + child];
      return <line key={`${index}-${parent}-${child}`} x1={x} y1={level.y + 32} x2={toX} y2={levels[index + 1].y} className="lf-line" />;
    })))}
    {levels.map((level, index) => level.nodes.map(([x, label]) => <g key={`${index}-${x}`}>
      <rect x={x - 40} y={level.y} width="80" height="32" rx="8" className="lf-box" />
      <text x={x} y={level.y + 21} textAnchor="middle" className="lf-text lf-strong">{label}</text>
    </g>))}
    <text x="220" y="206" textAnchor="middle" className="lf-text lf-strong lf-muted">⋮</text>
    <line x1="440" y1="10" x2="440" y2="215" className="lf-axis" />
    <text x="540" y="10" textAnchor="middle" className="lf-text lf-small lf-muted">sum per nivå</text>
    {levels.map((level, index) => <text key={index} x="540" y={level.y + 21} textAnchor="middle" className="lf-text lf-strong lf-fill-accent">{sums[index]}</text>)}
    <text x="320" y="238" textAnchor="middle" className="lf-text">n (1 + 0,9 + 0,81 + ⋯) = n · 1/(1 − 0,9) = 10n = O(n)</text>
    <text x="320" y="260" textAnchor="middle" className="lf-text lf-small lf-muted">med grupper på 3 blir summen n/3 + 2n/3 = n på hvert nivå, og da får vi bare Θ(n lg n)</text>
  </Svg>;
}

export function StabilityFigure() {
  const tone = (pair: string) => pair === "(3,4)" ? "lf-box-accent" : pair === "(3,2)" ? "lf-box-warn" : pair === "(3,3)" ? "lf-box-sorted" : "lf-box";
  const rows = [
    { label: "Input", pairs: ["(8,3)", "(3,4)", "(3,2)", "(5,1)", "(1,5)", "(3,3)"], note: "" },
    { label: "Stabil", pairs: ["(1,5)", "(3,4)", "(3,2)", "(3,3)", "(5,1)", "(8,3)"], note: "✓ beholdt" },
    { label: "Ikke stabil", pairs: ["(1,5)", "(3,2)", "(3,3)", "(3,4)", "(5,1)", "(8,3)"], note: "✗ byttet" },
  ];
  return <Svg label="Stabil sortering på x-verdien: de tre parene med x = 3 beholder rekkefølgen fra input" width={640} height={226}>
    {rows.map((row, index) => {
      const y = 14 + index * 64;
      return <g key={row.label}>
        <text x="4" y={y + 26} className="lf-text lf-strong">{row.label}</text>
        {row.pairs.map((pair, k) => <g key={k}>
          <rect x={110 + k * 70} y={y} width="62" height="40" rx="7" className={tone(pair)} />
          <text x={141 + k * 70} y={y + 25} textAnchor="middle" className="lf-text lf-strong">{pair}</text>
        </g>)}
        <text x="536" y={y + 26} className={`lf-text lf-small lf-strong${index === 1 ? " lf-fill-accent" : ""}`}>{row.note}</text>
      </g>;
    })}
    <text x="320" y="214" textAnchor="middle" className="lf-text lf-small lf-muted">sorterer bare på x; parene med x = 3 skal stå i samme rekkefølge som før: lilla, gul, grønn</text>
  </Svg>;
}

export function CountingSortFigure() {
  const tone: Record<string, string> = { "0": "lf-box-sorted", "2": "lf-box-warn", "3": "lf-box-accent", "5": "lf-box" };
  const rows = [
    { label: ["A", "input"], start: 1, values: ["2", "5", "3", "0", "2′", "3′", "0′", "3″"] },
    { label: ["C etter", "telling"], start: 0, values: ["2", "0", "2", "3", "0", "1"], counts: true },
    { label: ["C kumulativ", "siste plass for v"], start: 0, values: ["2", "2", "4", "7", "7", "8"], counts: true },
    { label: ["B", "output"], start: 1, values: ["0", "0′", "2", "2′", "3", "3′", "3″", "5"] },
  ];
  const x = (k: number) => 160 + k * 52;
  return <Svg label="Counting-Sort på ⟨2, 5, 3, 0, 2, 3, 0, 3⟩ med k = 5: tell, gjør kumulativt og plasser baklengs" width={640} height={318}>
    {rows.map((row, index) => {
      const y = 22 + index * 72;
      return <g key={index}>
        <text x="4" y={y + 18} className="lf-text lf-strong">{row.label[0]}</text>
        <text x="4" y={y + 35} className="lf-text lf-small lf-muted">{row.label[1]}</text>
        {row.values.map((value, k) => <g key={k}>
          <text x={x(k) + 23} y={y - 6} textAnchor="middle" className="lf-text lf-small lf-muted">{row.start + k}</text>
          <rect x={x(k)} y={y} width="46" height="40" rx="7" className={row.counts ? tone[String(k)] ?? "lf-box" : tone[value[0]]} />
          <text x={x(k) + 23} y={y + 25} textAnchor="middle" className="lf-text lf-strong">{value}</text>
        </g>)}
      </g>;
    })}
    {["telles opp: C[A[j]] += 1", "C[i] = C[i] + C[i − 1]"].map((text, index) =>
      <text key={text} x="630" y={22 + (index + 1) * 72 + 25} textAnchor="end" className="lf-text lf-small lf-fill-accent lf-strong">{text}</text>)}
    <text x="320" y="306" textAnchor="middle" className="lf-text lf-small lf-fill-accent lf-strong">B: gå baklengs, B[C[A[j]]] = A[j] og så C[A[j]] −= 1</text>
  </Svg>;
}

function Number4({ x, y, value, digit, width = 86 }: { x: number; y: number; value: string; digit: number; width?: number }) {
  return <g>
    <rect x={x} y={y} width={width} height="26" rx="6" className="lf-box" />
    <text x={x + width / 2} y={y + 18} textAnchor="middle" className="lf-text">
      {value.split("").map((char, index) => <tspan key={index} className={index === digit ? "lf-strong lf-fill-accent" : "lf-muted"}>{char}</tspan>)}
    </text>
  </g>;
}

export function RadixSortFigure() {
  const columns = [
    { title: "start", values: ["1736", "0529", "1938", "1223", "0531", "2007", "2016"], digit: 3 },
    { title: "etter enere", values: ["0531", "1223", "1736", "2016", "2007", "1938", "0529"], digit: 2 },
    { title: "etter tiere", values: ["2007", "2016", "1223", "0529", "0531", "1736", "1938"], digit: 1 },
    { title: "etter hundrere", values: ["2007", "2016", "1223", "0529", "0531", "1736", "1938"], digit: 0 },
    { title: "etter tusener", values: ["0529", "0531", "1223", "1736", "1938", "2007", "2016"], digit: -1 },
  ];
  return <Svg label="Radix-Sort på sju firesifrede tall: fire stabile pass, fra siste siffer til første" width={640} height={300}>
    {columns.map((column, index) => {
      const x = 14 + index * 126;
      return <g key={column.title}>
        <text x={x + 43} y="16" textAnchor="middle" className="lf-text lf-small lf-strong">{column.title}</text>
        {index < 4 && <line x1={x + 92} y1="12" x2={x + 120} y2="12" className="lf-line" markerEnd="url(#lf-arrow)" />}
        {column.values.map((value, row) => <Number4 key={row} x={x} y={28 + row * 32} value={value} digit={column.digit} />)}
      </g>;
    })}
    <text x="320" y="270" textAnchor="middle" className="lf-text">lilla = sifferet neste pass sorterer på (stabilt, f.eks. Counting-Sort med k = 9)</text>
    <text x="320" y="290" textAnchor="middle" className="lf-text lf-small lf-muted">0529 og 0531 har likt første siffer; siste pass beholder rekkefølgen fra før</text>
  </Svg>;
}

export function RadixPitfallsFigure() {
  const panels = [
    { title: "Riktig: enere, så tiere", sub: "stabil subrutine", columns: [["21", "12", "22", "11"], ["21", "11", "12", "22"], ["11", "12", "21", "22"]], digits: [1, 0, -1], ok: true },
    { title: "Feil vei: tiere, så enere", sub: "siste pass ødelegger", columns: [["21", "12", "22", "11"], ["12", "11", "21", "22"], ["21", "11", "12", "22"]], digits: [0, 1, -1], ok: false },
    { title: "Ustabil subrutine", sub: "like tiere byttes om", columns: [["21", "12", "22", "11"], ["21", "11", "12", "22"], ["12", "11", "22", "21"]], digits: [1, 0, -1], ok: false },
  ];
  return <Svg label="Radix-Sort virker bare fra minst til mest signifikante siffer og med en stabil subrutine" width={640} height={250}>
    {panels.map((panel, index) => {
      const left = 8 + index * 214;
      return <g key={panel.title}>
        <text x={left + 98} y="16" textAnchor="middle" className="lf-text lf-small lf-strong">{panel.title}</text>
        <text x={left + 98} y="32" textAnchor="middle" className="lf-text lf-small lf-muted">{panel.sub}</text>
        {panel.columns.map((column, c) => column.map((value, row) =>
          <Number4 key={`${c}-${row}`} x={left + c * 68} y={44 + row * 32} value={value} digit={panel.digits[c]} width={50} />))}
        {[0, 1].map(c => <line key={c} x1={left + 52 + c * 68} y1={110} x2={left + 66 + c * 68} y2={110} className="lf-line" markerEnd="url(#lf-arrow)" />)}
        <text x={left + 161} y="196" textAnchor="middle" className={`lf-text lf-strong${panel.ok ? " lf-fill-accent" : " lf-fill-warn"}`}>{panel.ok ? "✓ sortert" : "✗ ikke sortert"}</text>
        {index > 0 && <line x1={left - 7} y1="8" x2={left - 7} y2="210" className="lf-axis" />}
      </g>;
    })}
    <text x="320" y="236" textAnchor="middle" className="lf-text lf-small lf-muted">lilla = sifferet neste pass sorterer på; 11 og 12 har lik tier og må ikke bytte plass</text>
  </Svg>;
}

export function BucketSortFigure() {
  const input = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68];
  const decimal = (value: number) => value.toFixed(2).replace(".", ",");
  const buckets = Array.from({ length: 10 }, (_, b) => input.filter(value => Math.floor(10 * value) === b).sort((a, c) => a - c));
  const y = (row: number) => 28 + row * 24;
  return <Svg label="Bucket-Sort på ti tall i [0, 1): hvert tall går i bøtte ⌊10 · A[i]⌋, bøttene sorteres hver for seg og settes sammen" width={640} height={318}>
    <text x="40" y="16" textAnchor="middle" className="lf-text lf-small lf-strong">A</text>
    <text x="150" y="16" textAnchor="middle" className="lf-text lf-small lf-strong">bøtte = ⌊10 · A[i]⌋</text>
    <text x="300" y="16" textAnchor="middle" className="lf-text lf-small lf-strong">B</text>
    <text x="470" y="16" textAnchor="middle" className="lf-text lf-small lf-strong">liste i bøtta (sortert med Insertion-Sort)</text>
    {input.map((value, row) => <g key={row}>
      <rect x="14" y={y(row)} width="52" height="20" rx="5" className="lf-box" />
      <text x="40" y={y(row) + 14} textAnchor="middle" className="lf-text lf-small lf-strong">{decimal(value)}</text>
      <text x="150" y={y(row) + 14} textAnchor="middle" className="lf-text lf-small">⌊{(10 * value).toFixed(1).replace(".", ",")}⌋ = <tspan className="lf-strong lf-fill-accent">{Math.floor(10 * value)}</tspan></text>
    </g>)}
    {buckets.map((bucket, b) => <g key={b}>
      <rect x="270" y={y(b)} width="60" height="20" rx="5" className={bucket.length ? "lf-box-accent" : "lf-box"} />
      <text x="300" y={y(b) + 14} textAnchor="middle" className="lf-text lf-small lf-strong">{`B[${b}]`}</text>
      {bucket.map((value, k) => <g key={k}>
        <line x1={k === 0 ? 330 : 350 + k * 68} y1={y(b) + 10} x2={358 + k * 68} y2={y(b) + 10} className="lf-line" markerEnd="url(#lf-arrow)" />
        <rect x={360 + k * 68} y={y(b)} width="52" height="20" rx="5" className="lf-box-sorted" />
        <text x={386 + k * 68} y={y(b) + 14} textAnchor="middle" className="lf-text lf-small lf-strong">{decimal(value)}</text>
      </g>)}
      {!bucket.length && <text x="345" y={y(b) + 14} className="lf-text lf-small lf-muted">tom</text>}
      <text x="636" y={y(b) + 14} textAnchor="end" className="lf-text lf-small lf-muted">{`[${(b / 10).toFixed(1).replace(".", ",")}; ${((b + 1) / 10).toFixed(1).replace(".", ",")})`}</text>
    </g>)}
    <text x="320" y="286" textAnchor="middle" className="lf-text lf-strong">sett sammen B[0], B[1], …, B[9]:</text>
    <text x="320" y="308" textAnchor="middle" className="lf-text lf-fill-accent lf-strong">{[...input].sort((a, c) => a - c).map(decimal).join("  ")}</text>
  </Svg>;
}
