// Figures for lecture 2b, drawn from the lecture slides and appendix B.1 of the pensum booklet.
import { Box, Svg } from "../figureKit";

export function RelationFigure() {
  const inputs = ["⟨6, 3, 9⟩", "⟨2, 2⟩", "«hei»"];
  const outputs = ["⟨3, 6, 9⟩", "⟨2, 2⟩", "⟨9, 6, 3⟩"];
  return <Svg label="Et problem er en relasjon mellom input og riktige output" width={640} height={220}>
    <rect x="40" y="30" width="170" height="170" rx="16" className="lf-box" />
    <rect x="430" y="30" width="170" height="170" rx="16" className="lf-box" />
    <text x="125" y="22" textAnchor="middle" className="lf-text lf-strong">Input I</text>
    <text x="515" y="22" textAnchor="middle" className="lf-text lf-strong">Output O</text>
    {inputs.map((input, index) => <text key={input} x="125" y={72 + index * 50} textAnchor="middle" className="lf-text">{input}</text>)}
    {outputs.map((output, index) => <text key={output} x="515" y={72 + index * 50} textAnchor="middle" className="lf-text">{output}</text>)}
    <line x1="170" y1="68" x2="466" y2="68" className="lf-line lf-stroke-accent" markerEnd="url(#lf-arrow)" />
    <line x1="160" y1="118" x2="476" y2="118" className="lf-line lf-stroke-accent" markerEnd="url(#lf-arrow)" />
    <text x="320" y="60" textAnchor="middle" className="lf-text lf-small">(x, y) ∈ R</text>
    <text x="320" y="170" textAnchor="middle" className="lf-text lf-small lf-muted">«hei» har ingen løsning (ugyldig input)</text>
    <text x="320" y="214" textAnchor="middle" className="lf-text lf-small lf-strong lf-fill-accent">{"R ⊆ I × O, i praksis R ⊆ {0,1}* × {0,1}*"}</text>
  </Svg>;
}

const cliqueNodes: Record<number, [number, number]> = { 1: [90, 150], 2: [90, 50], 3: [210, 50], 4: [210, 150], 5: [330, 100], 6: [330, 190] };
const cliqueEdges: [number, number][] = [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5], [4, 6], [5, 6]];

export function CliqueFigure() {
  const inClique = (node: number) => node <= 4;
  return <Svg label="CLIQUE med k = 4: nodene 1, 2, 3 og 4 er en klikk" width={640} height={230}>
    {cliqueEdges.map(([a, b]) => <line key={`${a}-${b}`} x1={cliqueNodes[a][0]} y1={cliqueNodes[a][1]} x2={cliqueNodes[b][0]} y2={cliqueNodes[b][1]}
      className={inClique(a) && inClique(b) ? "lf-line lf-stroke-accent" : "lf-line lf-muted-stroke"} />)}
    {Object.entries(cliqueNodes).map(([node, [x, y]]) => <g key={node}>
      <circle cx={x} cy={y} r="18" className={inClique(Number(node)) ? "lf-box-accent" : "lf-box"} />
      <text x={x} y={y + 5} textAnchor="middle" className="lf-text lf-strong">{node}</text>
    </g>)}
    <Box x={400} y={20} w={230} h={56} title="Verifisering: lett" sub="sjekk de C(4, 2) = 6 parene" />
    <Box x={400} y={90} w={230} h={56} title="Søk: vanskelig" sub="opptil C(n, k) delmengder" />
    <Box x={400} y={160} w={230} h={56} title="Beslutning" sub="JA for k ≤ 4, NEI for k ≥ 5" accent />
  </Svg>;
}

function Step({ x, y, text, kind = "box" }: { x: number; y: number; text: string; kind?: "box" | "oracle" | "result" }) {
  return <g>
    <rect x={x} y={y} width="150" height="34" rx="8" className={kind === "oracle" ? "lf-box-warn" : kind === "result" ? "lf-box-sorted" : "lf-box"} />
    <text x={x + 75} y={y + 22} textAnchor="middle" className="lf-text lf-small lf-strong">{text}</text>
  </g>;
}

function Down({ x, y, label }: { x: number; y: number; label?: string }) {
  return <g>
    <line x1={x} y1={y} x2={x} y2={y + 18} className="lf-line" markerEnd="url(#lf-arrow)" />
    {label && <text x={x + 8} y={y + 13} className="lf-text lf-small lf-muted">{label}</text>}
  </g>;
}

export function ReductionTypesFigure() {
  const column = (x: number) => x + 75;
  return <Svg label="Cook-, Levin- og Karp-reduksjoner fra X til Y, med orakelet for Y" width={660} height={330}>
    <text x={column(10)} y="20" textAnchor="middle" className="lf-text lf-strong">Cook</text>
    <Step x={10} y={32} text="instans x av X" />
    <Down x={column(10)} y={66} />
    <Step x={10} y={86} text="polynomisk arbeid" />
    {[0, 1, 2].map(index => <g key={index}>
      <line x1="160" y1={96 + index * 50} x2="186" y2={96 + index * 50} className="lf-line" markerEnd="url(#lf-arrow)" />
      <line x1="186" y1={108 + index * 50} x2="160" y2={108 + index * 50} className="lf-line lf-stroke-warn" markerEnd="url(#lf-arrow)" />
    </g>)}
    <rect x="188" y="86" width="22" height="134" rx="6" className="lf-box-warn" />
    <text x="199" y="160" textAnchor="middle" className="lf-text lf-small lf-strong" transform="rotate(-90 199 156)">orakel Y</text>
    <rect x="10" y="120" width="150" height="100" rx="8" className="lf-box lf-dashed" />
    <text x={column(10)} y="166" textAnchor="middle" className="lf-text lf-small lf-muted">mange kall,</text>
    <text x={column(10)} y="182" textAnchor="middle" className="lf-text lf-small lf-muted">i løkker om vi vil</text>
    <Down x={column(10)} y={222} />
    <Step x={10} y={242} text="svar på x" kind="result" />
    <text x={column(10)} y="300" textAnchor="middle" className="lf-text lf-small">svarene kan brukes fritt</text>

    <text x={column(250)} y="20" textAnchor="middle" className="lf-text lf-strong">Levin</text>
    <Step x={250} y={32} text="instans x av X" />
    <Down x={column(250)} y={66} label="f" />
    <Step x={250} y={86} text="instans f(x) av Y" />
    <Down x={column(250)} y={120} />
    <Step x={250} y={140} text="orakel Y: løsning y" kind="oracle" />
    <Down x={column(250)} y={174} label="g" />
    <Step x={250} y={194} text="g(x, y) løser x" kind="result" />
    <text x={column(250)} y="248" textAnchor="middle" className="lf-text lf-small">nøyaktig ett kall</text>
    <text x={column(250)} y="266" textAnchor="middle" className="lf-text lf-small lf-muted">hver y må gi en løsning på x</text>

    <text x={column(490)} y="20" textAnchor="middle" className="lf-text lf-strong">Karp</text>
    <Step x={490} y={32} text="instans x av X" />
    <Down x={column(490)} y={66} label="f" />
    <Step x={490} y={86} text="instans f(x) av Y" />
    <Down x={column(490)} y={120} />
    <Step x={490} y={140} text="orakel Y: ja / nei" kind="oracle" />
    <Down x={column(490)} y={174} label="uendret" />
    <Step x={490} y={194} text="samme svar for x" kind="result" />
    <text x={column(490)} y="248" textAnchor="middle" className="lf-text lf-small">ett kall, helt til slutt</text>
    <text x={column(490)} y="266" textAnchor="middle" className="lf-text lf-small lf-muted">{"x ∈ X ⇔ f(x) ∈ Y"}</text>

    <text x="330" y="322" textAnchor="middle" className="lf-text lf-small lf-muted">oransje: orakelet for Y · grønn: svaret på X · alle tre bruker polynomisk tid</text>
  </Svg>;
}

export function HardnessFigure() {
  const row = (y: number, text: string, ok: boolean) => <g key={text}>
    <rect x="40" y={y} width="560" height="40" rx="10" className={ok ? "lf-box-sorted" : "lf-box lf-dashed"} />
    <text x="64" y={y + 26} className={ok ? "lf-text lf-strong" : "lf-text lf-muted"}>{ok ? "✓" : "✗"}</text>
    <text x="96" y={y + 26} className={ok ? "lf-text" : "lf-text lf-muted"}>{text}</text>
  </g>;
  return <Svg label="Hva vi kan slutte når X kan reduseres til Y" width={640} height={250}>
    <text x="320" y="24" textAnchor="middle" className="lf-text lf-strong lf-fill-accent">X ≤ Y: X er høyst like vanskelig som Y</text>
    {row(40, "Y er lett ⇒ X er lett (bruk reduksjonen og algoritmen for Y)", true)}
    {row(90, "X er vanskelig ⇒ Y er vanskelig (ellers ville X vært lett)", true)}
    {row(140, "Y er vanskelig ⇒ X er vanskelig? Nei, X kan løses på andre måter", false)}
    {row(190, "X er lett ⇒ Y er lett? Nei, Y kan være mye vanskeligere", false)}
  </Svg>;
}

export function DecompositionFigure() {
  const rows: [string, string][] = [["⟨4, 2, 1, 3⟩", "⟨1, 2, 3, 4⟩"], ["⟨4, 2, 1⟩", "⟨1, 2, 4⟩"], ["⟨4, 2⟩", "⟨2, 4⟩"], ["⟨4⟩", "⟨4⟩"]];
  return <Svg label="Insertion-Sort som dekomponering: kutt av siste element, sorter resten, sett inn" width={640} height={250}>
    <text x="150" y="20" textAnchor="middle" className="lf-text lf-strong">Dekomponer</text>
    <text x="490" y="20" textAnchor="middle" className="lf-text lf-strong">Kombiner (sett inn)</text>
    {rows.map(([instance, answer], index) => {
      const y = 36 + index * 52;
      return <g key={instance}>
        <rect x="70" y={y} width="160" height="36" rx="8" className={index === 3 ? "lf-box-accent" : "lf-box"} />
        <text x="150" y={y + 23} textAnchor="middle" className="lf-text lf-strong">{instance}</text>
        <rect x="410" y={y} width="160" height="36" rx="8" className="lf-box-sorted" />
        <text x="490" y={y + 23} textAnchor="middle" className="lf-text lf-strong">{answer}</text>
        {index < 3 && <line x1="150" y1={y + 38} x2="150" y2={y + 50} className="lf-line" markerEnd="url(#lf-arrow)" />}
        {index > 0 && <line x1="490" y1={y - 2} x2="490" y2={y - 14} className="lf-line" markerEnd="url(#lf-arrow)" />}
      </g>;
    })}
    <line x1="232" y1={36 + 3 * 52 + 18} x2="406" y2={36 + 3 * 52 + 18} className="lf-line lf-dashed" markerEnd="url(#lf-arrow)" />
    <text x="320" y={36 + 3 * 52 + 12} textAnchor="middle" className="lf-text lf-small">grunntilfelle</text>
    <text x="320" y="110" textAnchor="middle" className="lf-text lf-small lf-muted">IH: delinstansen</text>
    <text x="320" y="126" textAnchor="middle" className="lf-text lf-small lf-muted">er løst riktig</text>
  </Svg>;
}

const people: Record<string, [number, number]> = { A: [70, 60], B: [70, 170], C: [190, 115], D: [310, 115], E: [430, 115], F: [550, 115] };
const knows: [string, string][] = [["A", "B"], ["A", "C"], ["B", "C"], ["C", "D"], ["D", "E"], ["E", "F"]];

export function KeepManyFigure() {
  const removed: Record<string, number> = { F: 1, E: 2, D: 3 };
  return <Svg label="Flest mulig der alle kjenner minst k = 2: fjern F, så E, så D" width={640} height={230}>
    {knows.map(([a, b]) => <line key={a + b} x1={people[a][0]} y1={people[a][1]} x2={people[b][0]} y2={people[b][1]}
      className={removed[a] || removed[b] ? "lf-line lf-dashed lf-muted-stroke" : "lf-line lf-stroke-accent"} />)}
    {Object.entries(people).map(([name, [x, y]]) => <g key={name}>
      <circle cx={x} cy={y} r="20" className={removed[name] ? "lf-box lf-dashed" : "lf-box-sorted"} />
      <text x={x} y={y + 5} textAnchor="middle" className={removed[name] ? "lf-text lf-muted" : "lf-text lf-strong"}>{name}</text>
      {removed[name] && <text x={x} y={y + 40} textAnchor="middle" className="lf-text lf-small lf-fill-warn">fjernet som nr. {removed[name]}</text>}
    </g>)}
    <text x="320" y="218" textAnchor="middle" className="lf-text lf-small">Svar: {"{A, B, C}"}, der alle kjenner 2 av de andre</text>
  </Svg>;
}
