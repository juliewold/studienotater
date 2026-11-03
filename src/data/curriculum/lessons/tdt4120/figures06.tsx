// Figures for lecture 6, drawn from the examples in the lecture slides, CLRS chapter 14, appendix E of the
// pensum booklet and exercise 6. All tables were computed from the CLRS pseudocode.
import { Svg } from "../figureKit";

type Point = { x: number; y: number };

function Node({ x, y, label, tone = "lf-box", r = 15, dashed = false }: Point & { label: string | number; tone?: string; r?: number; dashed?: boolean }) {
  return <g>
    <circle cx={x} cy={y} r={r} className={`${tone}${dashed ? " lf-dashed" : ""}`} />
    <text x={x} y={y + 4.5} textAnchor="middle" className={`lf-text lf-strong${r < 14 ? " lf-small" : ""}`}>{label}</text>
  </g>;
}

function Arrow({ from, to, r = 15, accent = false, dashed = false }: { from: Point; to: Point; r?: number; accent?: boolean; dashed?: boolean }) {
  const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy);
  const ux = dx / length, uy = dy / length;
  return <line x1={from.x + ux * r} y1={from.y + uy * r} x2={to.x - ux * (r + 3)} y2={to.y - uy * (r + 3)}
    className={`lf-line${accent ? " lf-stroke-accent" : ""}${dashed ? " lf-dashed" : ""}`} markerEnd="url(#lf-arrow)" />;
}

function Cell({ x, y, w, h, value, tone = "lf-box", small = false }: Point & { w: number; h: number; value: string | number; tone?: string; small?: boolean }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="5" className={tone} />
    <text x={x + w / 2} y={y + h / 2 + 4.5} textAnchor="middle" className={`lf-text lf-strong${small ? " lf-small" : ""}`}>{value}</text>
  </g>;
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

type CallNode = Point & { n: number; parent?: CallNode; kind: "computed" | "lookup" | "skipped" };

/** The call tree of Cut-Rod(p, 4), laid out with one column per leaf, marking what memoization would do. */
function cutRodCalls(n: number, left: number, top: number, leafGap: number, levelGap: number) {
  const nodes: CallNode[] = [];
  const seen = new Set<number>();
  let leaf = 0;
  const visit = (size: number, depth: number, parent?: CallNode): CallNode => {
    const kind = parent && parent.kind !== "computed" ? "skipped" : seen.has(size) ? "lookup" : "computed";
    if (kind === "computed") seen.add(size);
    const node: CallNode = { x: 0, y: top + depth * levelGap, n: size, parent, kind };
    nodes.push(node);
    const children = Array.from({ length: size }, (_, i) => visit(size - 1 - i, depth + 1, node));
    node.x = children.length ? (children[0].x + children[children.length - 1].x) / 2 : left + leaf++ * leafGap;
    return node;
  };
  visit(n, 0);
  return nodes;
}

export function RecursionDagFigure() {
  const calls = cutRodCalls(4, 26, 34, 44, 54);
  const tone = { computed: "lf-box-accent", lookup: "lf-box-warn", skipped: "lf-box" } as const;
  const column = [4, 3, 2, 1, 0].map((n, index) => ({ n, x: 470, y: 44 + index * 52 }));
  const edges = column.flatMap(a => column.filter(b => b.n < a.n).map(b => [a, b] as const));
  return <Svg label="Rekursjonstreet til Cut-Rod(p, 4) har 16 kall, men delinstansgrafen har bare 5 noder og 10 kanter" width={700} height={346}>
    <text x="8" y="14" className="lf-text lf-small lf-strong">Rekursjonstreet til Cut-Rod(p, 4): 16 kall</text>
    {calls.filter(node => node.parent).map((node, index) => <line key={index} x1={node.parent!.x} y1={node.parent!.y} x2={node.x} y2={node.y}
      className={`lf-line${node.kind === "skipped" ? " lf-dashed lf-muted-stroke" : ""}`} />)}
    {calls.map((node, index) => <Node key={index} x={node.x} y={node.y} label={node.n} r={12} tone={tone[node.kind]} dashed={node.kind === "skipped"} />)}
    <Legend x={8} y={280} items={[["lf-box-accent", "løses første gang (5 kall)"], ["lf-box-warn", "med memoisering: bare oppslag (6 kall)"], ["lf-box", "med memoisering: aldri kalt (5 kall, stiplet)"]]} />
    <line x1="398" y1="10" x2="398" y2="336" className="lf-axis" />
    <text x="414" y="14" className="lf-text lf-small lf-strong">Delinstansgrafen: 5 noder, 10 kanter</text>
    {edges.map(([a, b]) => b.n === a.n - 1
      ? <Arrow key={`${a.n}-${b.n}`} from={a} to={b} r={15} />
      : <path key={`${a.n}-${b.n}`} d={`M ${a.x + 15} ${a.y} Q ${a.x + 15 + (a.n - b.n) * 30} ${(a.y + b.y) / 2} ${b.x + 18} ${b.y}`} className="lf-line" markerEnd="url(#lf-arrow)" />)}
    {column.map(node => <Node key={node.n} {...node} label={node.n} tone={node.n === 0 ? "lf-box-sorted" : "lf-box-accent"} />)}
    <Lines x={414} y={300} lines={[["Node j er delinstansen r[j], og kanten"], ["j → i betyr at r[j] bruker r[i]. Hver node"], ["løses én gang: Θ(n²), mot 2ⁿ kall uten lagring."]]} step={16} />
  </Svg>;
}

export function SubstructureFigure() {
  const base = { q: { x: 0, y: 0 }, r: { x: 120, y: 0 }, s: { x: 0, y: 92 }, t: { x: 120, y: 92 } };
  const edges: [keyof typeof base, keyof typeof base][] = [["q", "r"], ["q", "s"], ["r", "t"], ["s", "t"]];
  const panels: { dx: number; title: string; path: (keyof typeof base)[]; note: string[]; tone: string }[] = [
    { dx: 40, title: "Korteste vei q ⇝ t", path: ["q", "r", "t"], note: ["q → r og r → t er begge korteste.", "Satt sammen: korteste q ⇝ t."], tone: "lf-box-sorted" },
    { dx: 280, title: "Lengste enkle vei q ⇝ r", path: ["q", "s", "t", "r"], note: ["q → s → t → r (3 kanter)."], tone: "lf-box-accent" },
    { dx: 500, title: "Lengste enkle vei r ⇝ t", path: ["r", "q", "s", "t"], note: ["r → q → s → t (3 kanter)."], tone: "lf-box-warn" },
  ];
  return <Svg label="Korteste vei har optimal delstruktur, men lengste enkle vei har det ikke" width={700} height={250}>
    {panels.map((panel, index) => {
      const at = (id: keyof typeof base) => ({ x: base[id].x + panel.dx, y: base[id].y + 50 });
      const onPath = (a: string, b: string) => panel.path.some((id, k) => k > 0 && ((panel.path[k - 1] === a && id === b) || (panel.path[k - 1] === b && id === a)));
      return <g key={panel.title}>
        {index === 1 && <line x1="232" y1="10" x2="232" y2="190" className="lf-axis" />}
        <text x={panel.dx - 20} y="18" className="lf-text lf-small lf-strong">{panel.title}</text>
        {edges.filter(([a, b]) => !onPath(a, b)).map(([a, b]) => <line key={a + b} x1={at(a).x} y1={at(a).y} x2={at(b).x} y2={at(b).y} className="lf-line" />)}
        {panel.path.slice(1).map((id, k) => <Arrow key={id} from={at(panel.path[k])} to={at(id)} r={16} accent />)}
        {(Object.keys(base) as (keyof typeof base)[]).map(id => <Node key={id} {...at(id)} label={id} r={16} tone={panel.path.includes(id) ? panel.tone : "lf-box"} />)}
        <Lines x={panel.dx - 20} y={172} lines={panel.note.map(text => [text] as [string])} step={17} />
      </g>;
    })}
    <rect x="272" y="200" width="420" height="42" rx="8" className="lf-region" />
    <Lines x={284} y={217} lines={[["Satt sammen: q → s → t → r → q → s → t. Ikke en enkel vei!", true], ["Delveiene deler noder: de er ikke uavhengige (CLRS fig. 14.6)."]]} step={17} />
    <Lines x={20} y={217} lines={[["Alle kanter har lengde 1. Delveier av"], ["korteste veier er selv korteste."]]} step={17} />
  </Svg>;
}

export function RodTableFigure() {
  const p = [1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
  const r = [0, 1, 5, 8, 10, 13, 17, 18, 22, 25, 30];
  const s = [1, 2, 3, 2, 2, 6, 1, 2, 3, 10];
  const left = 92, w = 50, gap = 4, x = (j: number) => left + j * (w + gap);
  const path = [9, 6, 0];
  return <Svg label="Tabellene r og s fra Extended-Bottom-Up-Cut-Rod for prisene i CLRS, og rekonstruksjon for n = 9" width={700} height={318}>
    {r.map((_, j) => <text key={j} x={x(j) + w / 2} y="22" textAnchor="middle" className="lf-text lf-small lf-muted">{j}</text>)}
    {[["lengde", 22], ["pris p[i]", 52], ["r[j]", 100], ["s[j]", 148]].map(([label, y]) =>
      <text key={label} x="8" y={y} className="lf-text lf-small lf-strong">{label}</text>)}
    {p.map((value, k) => <Cell key={k} x={x(k + 1)} y={32} w={w} h={32} value={value} />)}
    {r.map((value, j) => <Cell key={j} x={x(j)} y={80} w={w} h={32} value={value} tone={path.includes(j) ? "lf-box-accent" : j === 0 ? "lf-box-sorted" : "lf-box"} />)}
    {s.map((value, k) => <Cell key={k} x={x(k + 1)} y={128} w={w} h={32} value={value} tone={k + 1 === 9 || k + 1 === 6 ? "lf-box-warn" : "lf-box"} />)}
    {path.slice(1).map((to, k) => {
      const from = path[k], x1 = x(from) + w / 2, x2 = x(to) + w / 2;
      return <g key={to}>
        <path d={`M ${x1} 162 Q ${(x1 + x2) / 2} ${214 + k * 10} ${x2} 162`} className="lf-line lf-stroke-accent" markerEnd="url(#lf-arrow)" />
        <text x={(x1 + x2) / 2} y={204 + k * 10} textAnchor="middle" className="lf-text lf-small lf-strong lf-fill-accent">kapp av s[{from}] = {from - to}</text>
      </g>;
    })}
    <Lines x={8} y={244} lines={[
      ["Print-Cut-Rod-Solution(p, 9): s[9] = 3 gir rest 6, og s[6] = 6 gir rest 0.", true],
      ["Biter 3 og 6, verdi p[3] + p[6] = 8 + 17 = 25 = r[9]."],
      ["Én celle: r[4] = max(1 + 8, 5 + 5, 8 + 1, 9 + 0) = 10, oppnådd med i = 2, så s[4] = 2."],
      ["Flere optimale løsninger er vanlig. s husker den første beste (streng ulikhet i linje 6)."],
    ]} step={19} />
  </Svg>;
}

export function LcsTableFigure() {
  const X = "ABCBDAB", Y = "BDCABA";
  const c: number[][] = [], b: string[][] = [];
  for (let i = 0; i <= X.length; i++) {
    c.push([]); b.push([]);
    for (let j = 0; j <= Y.length; j++) {
      if (i === 0 || j === 0) { c[i][j] = 0; b[i][j] = ""; }
      else if (X[i - 1] === Y[j - 1]) { c[i][j] = c[i - 1][j - 1] + 1; b[i][j] = "↖"; }
      else if (c[i - 1][j] >= c[i][j - 1]) { c[i][j] = c[i - 1][j]; b[i][j] = "↑"; }
      else { c[i][j] = c[i][j - 1]; b[i][j] = "←"; }
    }
  }
  const path = new Set<string>();
  for (let i = X.length, j = Y.length; i > 0 && j > 0;) {
    path.add(`${i},${j}`);
    if (b[i][j] === "↖") { i--; j--; } else if (b[i][j] === "↑") i--; else j--;
  }
  const left = 66, top = 46, w = 42, h = 34;
  const tone = (i: number, j: number) => !path.has(`${i},${j}`) ? "lf-box" : b[i][j] === "↖" ? "lf-box-sorted" : "lf-box-accent";
  return <Svg label="LCS-tabellen c med pilene b for X = ABCBDAB og Y = BDCABA. Stien fra hjørnet gir LCS-en BCBA" width={700} height={340}>
    {Y.split("").map((letter, k) => <g key={k}>
      <text x={left + (k + 1) * w + w / 2} y="18" textAnchor="middle" className="lf-text lf-small lf-muted">j = {k + 1}</text>
      <text x={left + (k + 1) * w + w / 2} y="36" textAnchor="middle" className="lf-text lf-strong">{letter}</text>
    </g>)}
    {X.split("").map((letter, k) => <g key={k}>
      <text x="10" y={top + (k + 1) * h + 22} className="lf-text lf-small lf-muted">{k + 1}</text>
      <text x="34" y={top + (k + 1) * h + 22} className="lf-text lf-strong">{letter}</text>
    </g>)}
    {c.map((row, i) => row.map((value, j) => <g key={`${i}-${j}`}>
      <rect x={left + j * w} y={top + i * h} width={w - 3} height={h - 3} rx="4" className={tone(i, j)} />
      {b[i][j] && <text x={left + j * w + 5} y={top + i * h + 13} className="lf-text lf-small lf-muted">{b[i][j]}</text>}
      <text x={left + j * w + 26} y={top + i * h + 22} textAnchor="middle" className="lf-text lf-strong">{value}</text>
    </g>))}
    <line x1="372" y1="10" x2="372" y2="330" className="lf-axis" />
    <Lines x={388} y={24} lines={[
      ["c[i, j] = lengden til en LCS av Xᵢ og Yⱼ", true],
      ["Rad 0 og kolonne 0: tomt prefiks gir 0."],
      ["Fylles rad for rad. Hver celle bruker tre"],
      ["naboer: over, til venstre og diagonalt."],
      [""],
      ["↖  xᵢ = yⱼ: c[i − 1, j − 1] + 1", true],
      ["↑   xᵢ ≠ yⱼ og c[i − 1, j] ≥ c[i, j − 1]", true],
      ["←  ellers: c[i, j − 1]", true],
      [""],
      ["Svaret er c[7, 6] = 4. Print-LCS følger"],
      ["pilene baklengs fra hjørnet. Grønt = ↖ på"],
      ["stien, og der er tegnet med i LCS-en:"],
      ["B, C, B, A gir BCBA.", true],
      [""],
      ["BDAB og BCAB er også LCS-er."],
      ["Θ(mn) celler, Θ(1) per celle (CLRS fig. 14.8)."],
    ]} />
  </Svg>;
}

export function KnapsackFigure() {
  const w = [1, 2, 3], v = [60, 100, 120], W = 5;
  const K = [[0, 0, 0, 0, 0, 0]];
  for (let i = 1; i <= 3; i++) K.push(Array.from({ length: W + 1 }, (_, j) => j < w[i - 1] ? K[i - 1][j] : Math.max(K[i - 1][j], K[i - 1][j - w[i - 1]] + v[i - 1])));
  const left = 360, top = 52, cw = 52, ch = 36;
  const cell = (i: number, j: number) => ({ x: left + j * cw, y: top + i * ch });
  const tone = (i: number, j: number) => i === 3 && j === 5 ? "lf-box-accent" : (i === 2 && (j === 5 || j === 2)) ? "lf-box-warn" : (i === 1 && j === 0) ? "lf-box-sorted" : "lf-box";
  const sketch = { top: { x: 150, y: 70 }, skip: { x: 150, y: 170 }, take: { x: 50, y: 170 } };
  return <Svg label="Dekomponeringen for det binære ryggsekkproblemet og tabellen K fra Knapsack′ for et lite eksempel" width={700} height={300}>
    <text x="8" y="16" className="lf-text lf-small lf-strong">Pensumheftet, figur E.1</text>
    {[[sketch.top, "i, j"], [sketch.skip, "i − 1, j"], [sketch.take, "i − 1, j − wᵢ"]].map(([at, label]) => {
      const point = at as Point;
      return <Cell key={label as string} x={point.x - 44} y={point.y - 17} w={88} h={34} value={label as string} small tone={point === sketch.top ? "lf-box-accent" : "lf-box"} />;
    })}
    <line x1={sketch.top.x} y1={sketch.top.y + 17} x2={sketch.skip.x} y2={sketch.skip.y - 20} className="lf-line" markerEnd="url(#lf-arrow)" />
    <line x1={sketch.top.x - 30} y1={sketch.top.y + 17} x2={sketch.take.x + 10} y2={sketch.take.y - 20} className="lf-line lf-stroke-accent" markerEnd="url(#lf-arrow)" />
    <text x="160" y="124" className="lf-text lf-small">nei: ekskluder i</text>
    <text x="8" y="112" className="lf-text lf-small lf-fill-accent lf-strong">ja: inkluder i,</text>
    <text x="8" y="128" className="lf-text lf-small lf-fill-accent lf-strong">+vᵢ</text>
    <Lines x={8} y={218} lines={[["«Tar vi med gjenstand i?»", true], ["K[i, j] = max(K[i − 1, j], K[i − 1, j − wᵢ] + vᵢ)"], ["Er wᵢ > j, er bare «nei» mulig."]]} step={19} />
    <line x1="252" y1="10" x2="252" y2="290" className="lf-axis" />
    <text x={left} y="16" className="lf-text lf-small lf-strong">K[i, j], W = 5</text>
    {Array.from({ length: W + 1 }, (_, j) => <text key={j} x={cell(0, j).x + cw / 2 - 2} y="40" textAnchor="middle" className="lf-text lf-small lf-muted">j = {j}</text>)}
    {["i = 0", "1: w 1, v 60", "2: w 2, v 100", "3: w 3, v 120"].map((label, i) =>
      <text key={label} x="266" y={top + i * ch + 22} className="lf-text lf-small lf-strong">{label}</text>)}
    {K.map((row, i) => row.map((value, j) => <Cell key={`${i}-${j}`} x={cell(i, j).x} y={cell(i, j).y} w={cw - 4} h={ch - 4} value={value} tone={tone(i, j)} />))}
    <Lines x={266} y={214} lines={[
      ["K[3, 5] = max(K[2, 5], K[2, 2] + 120) = max(160, 220) = 220", true],
      ["220 ≠ K[2, 5]: gjenstand 3 er med. Gå til j = 5 − 3 = 2."],
      ["K[2, 2] = 100 ≠ K[1, 2] = 60: gjenstand 2 er med, j = 0."],
      ["Svar {2, 3}. Grådig etter kilopris tar 1 og 2: bare 160."],
    ]} step={19} />
  </Svg>;
}

export function GridPathsFigure() {
  const size = 5, left = 40, top = 36, cw = 54, ch = 40;
  const f = (i: number, j: number): number => i === 1 || j === 1 ? 1 : f(i - 1, j) + f(i, j - 1);
  const tone = (i: number, j: number) => i === 3 && j === 3 ? "lf-box-accent" : (i === 2 && j === 3) || (i === 3 && j === 2) ? "lf-box-warn" : i === 1 || j === 1 ? "lf-box-sorted" : "lf-box";
  return <Svg label="Antall stier f(i, j) i et rutenett der vi bare går ned eller til høyre" width={700} height={260}>
    {Array.from({ length: size }, (_, k) => <g key={k}>
      <text x={left + k * cw + cw / 2 - 2} y="26" textAnchor="middle" className="lf-text lf-small lf-muted">j = {k + 1}</text>
      <text x="8" y={top + k * ch + 25} className="lf-text lf-small lf-muted">i = {k + 1}</text>
    </g>)}
    {Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) =>
      <Cell key={`${i}-${j}`} x={left + j * cw + 8} y={top + i * ch} w={cw - 6} h={ch - 6} value={f(i + 1, j + 1)} tone={tone(i + 1, j + 1)} />))}
    <line x1="330" y1="10" x2="330" y2="250" className="lf-axis" />
    <Lines x={346} y={28} lines={[
      ["Øving 6, spm. 13–15", true],
      ["Siste skritt inn i (i, j) kommer enten ovenfra fra"],
      ["(i − 1, j) eller fra venstre fra (i, j − 1). Stiene er"],
      ["forskjellige, så antallene legges sammen:"],
      ["f(i, j) = f(i − 1, j) + f(i, j − 1)", true],
      ["f(1, j) = f(i, 1) = 1 (bare én vei langs kanten)"],
      [""],
      ["f(3, 3) = f(2, 3) + f(3, 2) = 3 + 3 = 6", true],
      ["Blokkert rute: f = 0 (spm. 14 gir f(5, 7) = 35)."],
      [""],
      ["Fylles rad for rad: O(ij) tid, ett tall per rute."],
      ["Uten lagring gjør rekursjonen minst like mange"],
      ["kall som det finnes stier: eksponentielt mange."],
      ["Rotert 45° er tabellen Pascals trekant."],
    ]} step={17} />
  </Svg>;
}
