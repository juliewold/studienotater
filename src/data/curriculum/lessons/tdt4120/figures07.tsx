// Figures for lecture 7, drawn from the examples in the lecture slides, CLRS chapter 15 (and 25.2 for
// Gale-Shapley) and exercise 7. Selections, Huffman trees and matchings are computed by the algorithms.
import { Svg } from "../figureKit";

type Point = { x: number; y: number };

function Node({ x, y, label, tone = "lf-box", r = 15, dashed = false }: Point & { label: string | number; tone?: string; r?: number; dashed?: boolean }) {
  return <g>
    <circle cx={x} cy={y} r={r} className={`${tone}${dashed ? " lf-dashed" : ""}`} />
    <text x={x} y={y + 4.5} textAnchor="middle" className={`lf-text lf-strong${r < 16 ? " lf-small" : ""}`}>{label}</text>
  </g>;
}

function Arrow({ from, to, r = 15, accent = false, dashed = false }: { from: Point; to: Point; r?: number; accent?: boolean; dashed?: boolean }) {
  const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy);
  const ux = dx / length, uy = dy / length;
  return <line x1={from.x + ux * r} y1={from.y + uy * r} x2={to.x - ux * (r + 3)} y2={to.y - uy * (r + 3)}
    className={`lf-line${accent ? " lf-stroke-accent" : ""}${dashed ? " lf-dashed lf-muted-stroke" : ""}`} markerEnd="url(#lf-arrow)" />;
}

function Lines({ x, y, lines, step = 20 }: { x: number; y: number; lines: [string, boolean?][]; step?: number }) {
  return <g>{lines.map(([text, strong], index) =>
    <text key={index} x={x} y={y + index * step} className={`lf-text lf-small${strong ? " lf-strong" : ""}`}>{text}</text>)}</g>;
}

function Legend({ items, x, y, step = 20 }: { items: [string, string][]; x: number; y: number; step?: number }) {
  return <g>{items.map(([tone, label], index) => <g key={label}>
    <rect x={x} y={y + index * step} width="14" height="14" rx="3" className={tone} />
    <text x={x + 21} y={y + 11 + index * step} className="lf-text lf-small">{label}</text>
  </g>)}</g>;
}

export function GreedyVsDpFigure() {
  const panels = [
    { dx: 0, title: "Dynamisk programmering", top: "løs alle delinstanser først …", bottom: "… og bygg på den beste etterpå", greedy: false },
    { dx: 360, title: "Grådighet", top: "velg den mest lovende først …", bottom: "… og løs bare den", greedy: true },
  ];
  return <Svg label="Dynamisk programmering løser alle delinstanser før valget. En grådig algoritme velger først og løser bare én delinstans" width={700} height={250}>
    {panels.map(panel => {
      const root = { x: panel.dx + 170, y: 62 };
      const kids = [0, 1, 2].map(k => ({ x: panel.dx + 80 + k * 90, y: 160 }));
      return <g key={panel.title}>
        <text x={panel.dx + 12} y="18" className="lf-text lf-small lf-strong">{panel.title}</text>
        <Node {...root} label="x" r={18} tone="lf-box-accent" />
        {kids.map((kid, k) => {
          const chosen = !panel.greedy || k === 1;
          return <g key={k}>
            <Arrow from={root} to={kid} r={18} accent={panel.greedy && k === 1} dashed={!chosen} />
            <Node {...kid} label={`y${k + 1}`} r={18} tone={panel.greedy ? (k === 1 ? "lf-box-sorted" : "lf-box") : k === 2 ? "lf-box-sorted" : "lf-box-warn"} dashed={!chosen} />
          </g>;
        })}
        <Lines x={panel.dx + 12} y={42} lines={[[panel.top]]} />
        <Lines x={panel.dx + 12} y={206} lines={[[panel.bottom, true], [panel.greedy ? "Ingen tabell, ingen delinstans løses forgjeves." : "Alle tre løses (og lagres), y3 viste seg best."]]} step={19} />
      </g>;
    })}
    <line x1="350" y1="8" x2="350" y2="242" className="lf-axis" />
  </Svg>;
}

export function KnapsackGreedyFigure() {
  const items = [{ w: 10, v: 60 }, { w: 20, v: 100 }, { w: 30, v: 120 }];
  const tones = ["lf-box-accent", "lf-box-warn", "lf-box-sorted"];
  const W = 50, scale = 4, bottom = 252;
  const sacks: { x: number; title: string[]; parts: [number, number][] }[] = [
    { x: 232, title: ["0-1, grådig etter kilopris", "1 + 2 = 160"], parts: [[0, 1], [1, 1]] },
    { x: 384, title: ["0-1, optimalt", "2 + 3 = 220"], parts: [[1, 1], [2, 1]] },
    { x: 536, title: ["Kontinuerlig, grådig", "1 + 2 + ⅔ av 3 = 240"], parts: [[0, 1], [1, 1], [2, 2 / 3]] },
  ];
  return <Svg label="Eksemplet i CLRS 15.2: grådig etter kilopris er optimalt for den kontinuerlige ryggsekken, men ikke for den binære" width={700} height={290}>
    <text x="8" y="18" className="lf-text lf-small lf-strong">Gjenstander, W = 50</text>
    {items.map((item, i) => <g key={i}>
      <rect x="8" y={34 + i * 58} width="40" height={item.w * 1.5} rx="4" className={tones[i]} />
      <text x="28" y={34 + i * 58 + item.w * 0.75 + 4} textAnchor="middle" className="lf-text lf-small lf-strong">{i + 1}</text>
      <Lines x={58} y={46 + i * 58} lines={[[`w = ${item.w} kg, v = ${item.v}`, true], [`kilopris ${item.v / item.w}`]]} step={17} />
    </g>)}
    <Lines x={8} y={226} lines={[["Grådig rekkefølge: 1, 2, 3"], ["(synkende verdi per kilo)"]]} step={17} />
    <line x1="210" y1="8" x2="210" y2="282" className="lf-axis" />
    {sacks.map(sack => {
      let level = bottom;
      const used = sack.parts.reduce((sum, [i, part]) => sum + items[i].w * part, 0);
      return <g key={sack.x}>
        <Lines x={sack.x - 10} y={18} lines={[[sack.title[0], true], [sack.title[1]]]} step={17} />
        <rect x={sack.x} y={bottom - W * scale} width="110" height={W * scale} rx="8" className="lf-region" />
        {sack.parts.map(([i, part]) => {
          const h = items[i].w * part * scale;
          level -= h;
          return <g key={i}>
            <rect x={sack.x + 6} y={level + 2} width="98" height={h - 4} rx="5" className={tones[i]} />
            <text x={sack.x + 55} y={level + h / 2 + 4} textAnchor="middle" className="lf-text lf-small lf-strong">
              {part === 1 ? `${i + 1}: ${items[i].v}` : `⅔ · ${items[i].v} = ${items[i].v * part}`}</text>
          </g>;
        })}
        {used < W && <text x={sack.x + 55} y={bottom - W * scale + (W - used) * scale / 2 + 4} textAnchor="middle" className="lf-text lf-small lf-muted">{W - used} kg ledig</text>}
      </g>;
    })}
    <text x="232" y="276" className="lf-text lf-small">Uten deling står 20 kg tomt, og det grådige valget av gjenstand 1 viser seg å være feil.</text>
  </Svg>;
}

const activities = { s: [1, 3, 0, 5, 3, 5, 6, 7, 8, 2, 12], f: [4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16] };

/** Greedy-Activity-Selector on activities sorted by finish time; returns the chosen indices (0-based). */
function selectActivities(s: number[], f: number[]) {
  const chosen = [0];
  for (let m = 1, k = 0; m < s.length; m++) if (s[m] >= f[k]) { chosen.push(m); k = m; }
  return chosen;
}

export function ActivityFigure() {
  const { s, f } = activities;
  const chosen = selectActivities(s, f);
  const left = 44, unit = 33, top = 40, row = 21, x = (t: number) => left + t * unit;
  const rejectedBy = (i: number) => chosen.filter(k => k < i).at(-1)!;
  return <Svg label="Eksemplet i CLRS 15.1: elleve aktiviteter sortert etter sluttid. Greedy-Activity-Selector velger a1, a4, a8 og a11" width={700} height={344}>
    {Array.from({ length: 17 }, (_, t) => <g key={t}>
      <line x1={x(t)} y1={top - 8} x2={x(t)} y2={top + 11 * row} className="lf-axis" />
      <text x={x(t)} y={top - 14} textAnchor="middle" className="lf-text lf-small lf-muted">{t}</text>
    </g>)}
    {chosen.map(k => <line key={k} x1={x(f[k])} y1={top - 8} x2={x(f[k])} y2={top + 11 * row} className="lf-line lf-stroke-accent lf-dashed" />)}
    {s.map((start, i) => {
      const picked = chosen.includes(i);
      return <g key={i}>
        <text x="8" y={top + i * row + 14} className={`lf-text lf-small${picked ? " lf-strong" : ""}`}>a{i + 1}</text>
        <rect x={x(start) + 1} y={top + i * row + 2} width={(f[i] - start) * unit - 2} height={row - 5} rx="4" className={picked ? "lf-box-sorted" : "lf-box"} />
        <text x={x(16) + 12} y={top + i * row + 14} className={`lf-text lf-small${picked ? " lf-strong" : ""}`}>{picked ? "valgt" : `s = ${start} < f${rejectedBy(i) + 1} = ${f[rejectedBy(i)]}`}</text>
      </g>;
    })}
    <Lines x={8} y={top + 11 * row + 26} lines={[
      [`Grådig: ${chosen.map(k => `a${k + 1}`).join(", ")} (${chosen.length} aktiviteter). Stiplet linje = sluttiden til siste valgte.`, true],
      ["Neste valgte er den første (i sluttidsrekkefølge) som starter ved eller etter denne linjen: s[m] ≥ f[k]."],
      ["Andre optimale løsninger finnes, f.eks. a2, a4, a9, a11. Grådig gir én av dem, i Θ(n) etter sortering."],
    ]} step={19} />
  </Svg>;
}

export function ExchangeFigure() {
  const left = 214, unit = 26, x = (t: number) => left + t * unit;
  const rows: { title: string; bars: { s: number; f: number; label: string; tone: string }[] }[] = [
    { title: "Optimal løsning A", bars: [{ s: 1, f: 7, label: "a(j): først ferdig i A", tone: "lf-box-warn" }, { s: 8, f: 12, label: "", tone: "lf-box" }, { s: 13, f: 17, label: "", tone: "lf-box" }] },
    { title: "A′ = A − {a(j)} ∪ {a(m)}", bars: [{ s: 0, f: 5, label: "a(m): først av alle", tone: "lf-box-accent" }, { s: 8, f: 12, label: "", tone: "lf-box" }, { s: 13, f: 17, label: "", tone: "lf-box" }] },
  ];
  return <Svg label="Utvekslingsargumentet for aktivitetsutvelgelse: bytt aⱼ med aₘ, som slutter tidligere, og løsningen er fortsatt lovlig og like stor" width={700} height={216}>
    {rows.map((row, r) => <g key={row.title}>
      <text x="8" y={52 + r * 64} className="lf-text lf-small lf-strong">{row.title}</text>
      {row.bars.map(bar => <g key={bar.s}>
        <rect x={x(bar.s)} y={34 + r * 64} width={(bar.f - bar.s) * unit - 3} height="26" rx="5" className={bar.tone} />
        <text x={x(bar.s) + 7} y={51 + r * 64} className="lf-text lf-small lf-strong">{bar.label}</text>
      </g>)}
    </g>)}
    <line x1={x(7)} y1="20" x2={x(7)} y2="164" className="lf-line lf-dashed" />
    <text x={x(7) + 4} y="18" className="lf-text lf-small">f(j)</text>
    <line x1={x(5)} y1="84" x2={x(5)} y2="164" className="lf-line lf-stroke-accent lf-dashed" />
    <text x={x(5) - 4} y="178" textAnchor="end" className="lf-text lf-small lf-fill-accent lf-strong">f(m) ≤ f(j)</text>
    <Lines x={8} y={196} lines={[["Resten av A starter etter f(j) ≥ f(m), så den passer fortsatt. |A′| = |A|, altså er A′ også optimal (CLRS teorem 15.1)."]]} />
  </Svg>;
}

type HuffNode = { freq: number; label?: string; left?: HuffNode; right?: HuffNode; order: number };

/** Huffman(C) with a stable priority queue: ties go to the node that was inserted first. */
function huffman(chars: [string, number][]) {
  let order = 0;
  const queue: HuffNode[] = chars.map(([label, freq]) => ({ label, freq, order: order++ }));
  const steps: { queue: HuffNode[]; merged: [HuffNode, HuffNode] }[] = [];
  const byKey = (a: HuffNode, b: HuffNode) => a.freq - b.freq || a.order - b.order;
  while (queue.length > 1) {
    queue.sort(byKey);
    const snapshot = [...queue];
    const x = queue.shift()!, y = queue.shift()!;
    steps.push({ queue: snapshot, merged: [x, y] });
    queue.push({ freq: x.freq + y.freq, left: x, right: y, order: order++ });
  }
  return { root: queue[0], steps };
}

const clrsChars: [string, number][] = [["a", 45], ["b", 13], ["c", 12], ["d", 16], ["e", 9], ["f", 5]];
const name = (node: HuffNode) => node.label ? `${node.label}:${node.freq}` : `${node.freq}`;

export function HuffmanStepsFigure() {
  const { steps } = huffman(clrsChars);
  const top = 44, row = 38;
  return <Svg label="Huffman på CLRS-eksemplet: køen før hver iterasjon, der de to minste hentes ut og slås sammen" width={700} height={top + (steps.length + 1) * row + 30}>
    <text x="8" y="18" className="lf-text lf-small lf-strong">Prioritetskøen Q før hver iterasjon (sortert for lesbarhet)</text>
    {[...steps.map(step => step.queue), [huffman(clrsChars).root]].map((queue, r) => {
      const merged = steps[r]?.merged ?? [];
      return <g key={r}>
        <text x="8" y={top + r * row + 18} className="lf-text lf-small lf-muted">{r < steps.length ? `i = ${r + 1}` : "ferdig"}</text>
        {queue.map((node, k) => {
          const tone = merged.includes(node) ? "lf-box-accent" : node.label ? "lf-box" : "lf-box-sorted";
          return <g key={k}>
            <rect x={70 + k * 74} y={top + r * row} width="66" height="28" rx="6" className={tone} />
            <text x={103 + k * 74} y={top + r * row + 18} textAnchor="middle" className="lf-text lf-small lf-strong">{name(node)}</text>
          </g>;
        })}
        {r < steps.length && <text x="530" y={top + r * row + 18} className="lf-text lf-small">
          {`${merged[0].freq} + ${merged[1].freq} = ${merged[0].freq + merged[1].freq}`}</text>}
      </g>;
    })}
    <Legend x={8} y={top + (steps.length + 1) * row - 6} items={[["lf-box-accent", "hentes ut med Extract-Min (x til venstre, y til høyre)"]]} />
    <Legend x={400} y={top + (steps.length + 1) * row - 6} items={[["lf-box-sorted", "ny intern node z, settes inn i Q"]]} />
  </Svg>;
}

export function HuffmanTreeFigure() {
  const { root } = huffman(clrsChars);
  const placed: { node: HuffNode; x: number; y: number; code: string; parent?: { x: number; y: number }; bit?: string }[] = [];
  let leaf = 0;
  const layout = (node: HuffNode, depth: number, code: string): { x: number; y: number } => {
    const y = 32 + depth * 60;
    if (node.label) { const at = { x: 34 + leaf++ * 62, y }; placed.push({ node, ...at, code }); return at; }
    const l = layout(node.left!, depth + 1, code + "0"), r = layout(node.right!, depth + 1, code + "1");
    const at = { x: (l.x + r.x) / 2, y };
    placed.filter(p => (p.x === l.x && p.y === l.y) || (p.x === r.x && p.y === r.y)).forEach(p => { p.parent = at; p.bit = p.x === l.x ? "0" : "1"; });
    placed.push({ node, ...at, code });
    return at;
  };
  layout(root, 0, "");
  const leaves = placed.filter(p => p.node.label).sort((a, b) => b.node.freq - a.node.freq);
  const cost = leaves.reduce((sum, p) => sum + p.node.freq * p.code.length, 0);
  const internal = placed.filter(p => !p.node.label).map(p => p.node.freq).sort((a, b) => a - b);
  return <Svg label="Huffman-treet for CLRS-eksemplet med kodeordene. Variabel lengde gir 224 000 bit mot 300 000 med fast lengde" width={700} height={300}>
    {placed.filter(p => p.parent).map((p, k) => <g key={k}>
      <line x1={p.parent!.x} y1={p.parent!.y} x2={p.x} y2={p.y} className="lf-line" />
      <text x={(p.parent!.x + p.x) / 2 + (p.bit === "0" ? -11 : 5)} y={(p.parent!.y + p.y) / 2} className="lf-text lf-small lf-strong lf-fill-accent">{p.bit}</text>
    </g>)}
    {placed.map((p, k) => p.node.label
      ? <g key={k}><rect x={p.x - 25} y={p.y - 14} width="50" height="28" rx="6" className="lf-box-accent" />
          <text x={p.x} y={p.y + 4.5} textAnchor="middle" className="lf-text lf-small lf-strong">{name(p.node)}</text></g>
      : <Node key={k} x={p.x} y={p.y} label={p.node.freq} r={17} tone="lf-box-sorted" />)}
    <line x1="410" y1="8" x2="410" y2="292" className="lf-axis" />
    <text x="426" y="22" className="lf-text lf-small lf-strong">Tegn<tspan x="474">frekv.</tspan><tspan x="530">kode</tspan><tspan x="600">bidrag</tspan></text>
    {leaves.map((p, k) => <text key={k} x="426" y={46 + k * 21} className="lf-text lf-small">
      <tspan className="lf-strong">{p.node.label}</tspan><tspan x="474">{p.node.freq}</tspan><tspan x="530">{p.code}</tspan><tspan x="600">{p.node.freq} · {p.code.length}</tspan>
    </text>)}
    <Lines x={426} y={186} lines={[
      [`B(T) = ${cost} (tusen bit)`, true],
      [`= sum av interne noder: ${internal.join(" + ")}`],
      ["Fast lengde: 3 bit · 100 = 300"],
      ["Høy frekvens gir kort kode. Ingen kode er"],
      ["prefiks av en annen: tegnene er løvnoder."],
    ]} step={20} />
  </Svg>;
}

type Pref = Record<string, string[]>;
const women: Pref = { w1: ["m1", "m2", "m3"], w2: ["m1", "m3", "m2"], w3: ["m2", "m1", "m3"] };
const men: Pref = { m1: ["w2", "w1", "w3"], m2: ["w1", "w3", "w2"], m3: ["w3", "w2", "w1"] };

/** Gale-Shapley as in CLRS 25.2, women proposing; the free woman with the lowest index proposes next. */
function galeShapley() {
  const next: Record<string, number> = { w1: 0, w2: 0, w3: 0 };
  const partnerOf: Record<string, string | undefined> = {};
  const log: { w: string; m: string; result: "free" | "swap" | "reject"; dumped?: string }[] = [];
  for (let w = Object.keys(women).find(v => !partnerOf[v]); w; w = Object.keys(women).find(v => !partnerOf[v])) {
    const m = women[w][next[w]++], current = partnerOf[m];
    if (!current) { partnerOf[m] = w; partnerOf[w] = m; log.push({ w, m, result: "free" }); }
    else if (men[m].indexOf(w) < men[m].indexOf(current)) { partnerOf[current] = undefined; partnerOf[m] = w; partnerOf[w] = m; log.push({ w, m, result: "swap", dumped: current }); }
    else log.push({ w, m, result: "reject" });
  }
  return { log, pairs: Object.keys(women).map(w => [w, partnerOf[w]!] as const) };
}

export function GaleShapleyFigure() {
  const { log, pairs } = galeShapley();
  const text = { free: "m ledig: forlovet", swap: "m bytter opp", reject: "m avslår" };
  return <Svg label="Gale-Shapley på et lite eksempel: kvinnene frir i rekkefølge etter egen liste, og mennene bytter bare oppover" width={700} height={276}>
    <text x="8" y="18" className="lf-text lf-small lf-strong">Rangeringer (best først)</text>
    {[...Object.entries(women), ...Object.entries(men)].map(([who, list], k) => <text key={who} x="8" y={44 + k * 22 + (k >= 3 ? 10 : 0)} className="lf-text lf-small">
      <tspan className="lf-strong">{who}:</tspan> {list.join(" > ")}</text>)}
    <line x1="200" y1="8" x2="200" y2="268" className="lf-axis" />
    <text x="216" y="18" className="lf-text lf-small lf-strong">Frierier, laveste ledige w frir først</text>
    {log.map((step, k) => <g key={k}>
      <rect x="216" y={30 + k * 30} width="256" height="24" rx="5" className={step.result === "reject" ? "lf-box" : step.result === "swap" ? "lf-box-warn" : "lf-box-accent"} />
      <text x="226" y={46 + k * 30} className="lf-text lf-small lf-strong">{k + 1}. {step.w} → {step.m}</text>
      <text x="310" y={46 + k * 30} className="lf-text lf-small">{text[step.result]}{step.dumped ? `, ${step.dumped} ledig` : ""}</text>
    </g>)}
    <line x1="482" y1="8" x2="482" y2="268" className="lf-axis" />
    <text x="498" y="18" className="lf-text lf-small lf-strong">Resultat: stabil matching</text>
    {pairs.map(([w, m], k) => <g key={w}>
      <Node x={526} y={56 + k * 52} label={w} r={17} tone="lf-box-sorted" />
      <Node x={646} y={56 + k * 52} label={m} r={17} tone="lf-box-sorted" />
      <line x1="543" y1={56 + k * 52} x2="629" y2={56 + k * 52} className="lf-line lf-stroke-accent" />
    </g>)}
    <Lines x={498} y={218} lines={[[`${log.length} frierier ≤ n² = 9.`], ["w3 fikk sitt tredjevalg, men"], ["m1 og m2 vil ikke ha henne."]]} step={17} />
  </Svg>;
}

export function WellsFigure() {
  const villages = [1, 2, 4.5, 6, 9, 10.5, 13], r = 1.5;
  const wells: number[] = [];
  for (const v of villages) if (!wells.length || v > wells.at(-1)! + r) wells.push(v + r);
  const left = 30, unit = 42, x = (t: number) => left + t * unit, axis = 120;
  return <Svg label="Øving 7, spm. 20: plasser hver brønn r lenger bort enn den første landsbyen som ikke er dekket" width={700} height={210}>
    <line x1={x(0)} y1={axis} x2={x(15.4)} y2={axis} className="lf-line" markerEnd="url(#lf-arrow)" />
    {Array.from({ length: 16 }, (_, t) => <g key={t}>
      <line x1={x(t)} y1={axis - 4} x2={x(t)} y2={axis + 4} className="lf-line" />
      <text x={x(t)} y={axis + 20} textAnchor="middle" className="lf-text lf-small lf-muted">{t}</text>
    </g>)}
    {wells.map((well, k) => <g key={well}>
      <rect x={x(well - r)} y={axis - 46} width={2 * r * unit} height="34" rx="8" className="lf-region" />
      <line x1={x(well)} y1={axis - 46} x2={x(well)} y2={axis} className="lf-line lf-stroke-accent" />
      <Node x={x(well)} y={axis - 64} label={`B${k + 1}`} r={14} tone="lf-box-accent" />
    </g>)}
    {villages.map(v => <g key={v}>
      <circle cx={x(v)} cy={axis} r="7" className={wells.some(w => w - r === v) ? "lf-box-warn" : "lf-box"} />
    </g>)}
    <Legend x={30} y={152} step={20} items={[["lf-box-warn", "første udekkede landsby: brønnen settes ved den + r"], ["lf-box", "dekket av en brønn som allerede står"]]} />
    <Lines x={430} y={164} lines={[[`r = ${String(r).replace(".", ",")}: ${wells.length} brønner, ved ${wells.join("; ").replaceAll(".", ",")}.`, true], ["Sortering Θ(n lg n), deretter én lineær skanning."]]} step={19} />
  </Svg>;
}
