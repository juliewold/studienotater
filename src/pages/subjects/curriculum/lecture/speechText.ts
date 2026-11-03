// Turns lesson text and LaTeX into Norwegian text for speech synthesis, so the
// narrator says «n i andre» instead of reading raw LaTeX.

const symbols: Record<string, string> = {
  le: "er mindre enn eller lik", leq: "er mindre enn eller lik", ge: "er større enn eller lik", geq: "er større enn eller lik",
  ne: "er ulik", neq: "er ulik", lt: "er mindre enn", gt: "er større enn", ll: "er mye mindre enn", gg: "er mye større enn",
  approx: "omtrent lik", sim: "omtrent", equiv: "ekvivalent med", iff: "hvis og bare hvis",
  implies: "som gir", Rightarrow: "som gir", Longrightarrow: "som gir", rightarrow: "går mot", to: "går mot",
  leftarrow: "settes til", gets: "settes til", rightleftarrows: "fram og tilbake", mapsto: "går til",
  exists: "det finnes", forall: "for alle", in: "i", notin: "ikke i", subset: "delmengde av", subseteq: "delmengde av",
  cup: "union", cap: "snitt", emptyset: "den tomme mengden", varnothing: "den tomme mengden", setminus: "minus",
  cdot: "ganger", times: "ganger", div: "delt på", pm: "pluss minus", mid: "slik at",
  prec: "vokser saktere enn", preceq: "vokser ikke fortere enn", succ: "vokser fortere enn",
  infty: "uendelig", ldots: "og så videre", cdots: "og så videre", dots: "og så videre", vdots: "og så videre",
  land: "og", wedge: "og", lor: "eller", vee: "eller", neg: "ikke", lnot: "ikke",
  lg: "log", log: "log", ln: "l n", exp: "e opphøyd i", bmod: "modulo", mod: "modulo", pmod: "modulo",
  lceil: "taket av", rceil: "", lfloor: "gulvet av", rfloor: "", langle: "sekvensen", rangle: "",
  lvert: "", rvert: "", vert: "", ell: "l", star: "stjerne", circ: "sammensatt med", prime: "merket",
  alpha: "alfa", beta: "beta", gamma: "gamma", delta: "delta", Delta: "delta", epsilon: "epsilon", varepsilon: "epsilon",
  theta: "theta", Theta: "theta", lambda: "lambda", mu: "my", pi: "pi", sigma: "sigma", Sigma: "sigma", phi: "fi",
  varphi: "fi", Phi: "fi", omega: "lille omega", Omega: "omega", tau: "tau", rho: "rho", kappa: "kappa", chi: "chi", psi: "psi",
};

// Spacing, sizing and styling commands that carry no meaning when spoken.
const silent = new Set(["left", "right", "bigl", "bigr", "Bigl", "Bigr", "big", "Big", "bigg", "Bigg", "displaystyle", "limits", "nolimits", "quad", "qquad", "colon"]);
const textual = new Set(["text", "textbf", "textit", "mathrm", "mathbf", "mathit", "mathsf", "mathcal", "mathbb", "operatorname", "boldsymbol", "mbox"]);
const powers: Record<string, string> = { "2": "i andre", "3": "i tredje" };

class Reader {
  private index = 0;
  private readonly source: string;
  constructor(source: string) { this.source = source; }

  read(stop?: string): string {
    const out: string[] = [];
    // Stack of open | signs so that |I| is read as «størrelsen av I».
    let bars = 0;
    while (this.index < this.source.length) {
      const char = this.source[this.index];
      if (stop && char === stop) { this.index++; break; }
      this.index++;
      if (char === "\\") out.push(this.command());
      else if (char === "{") out.push(this.read("}"));
      else if (char === "}") continue;
      else if (char === "^") out.push(this.power());
      else if (char === "_") out.push(this.group());
      else if (char === "(") out.push(/[\p{L}\p{N}]$/u.test(out.join("").trimEnd()) ? " av " : " ");
      else if (char === "[") out.push(/[\p{L}]$/u.test(out.join("").trimEnd()) ? this.indexWord() : " ");
      else if (char === ")" || char === "]") out.push(" ");
      else if (char === ":") out.push(this.insideBrackets() ? " til " : this.mapping() ? " fra " : " slik at ");
      else if (char === "|") { out.push(bars % 2 === 0 ? " størrelsen av " : " "); bars++; }
      else if (char === "+") out.push(" pluss ");
      else if (char === "-") out.push(" minus ");
      else if (char === "=") out.push(" er lik ");
      else if (char === "<") out.push(" er mindre enn ");
      else if (char === ">") out.push(" er større enn ");
      else if (char === "*") out.push(" ganger ");
      else if (char === "/") out.push(" delt på ");
      else if (char === "!") out.push(" fakultet ");
      else if (char === "'") out.push(" merket ");
      else if (char === "&" || char === "~") out.push(" ");
      else if (char === ",") out.push(", ");
      else if (char === ";") out.push(", ");
      else if (/[OoΘΩ]/.test(char) && this.source[this.index] === "(") out.push(char === "O" ? " stor O" : char === "o" ? " lille o" : char === "Θ" ? " theta" : " omega");
      else out.push(char);
    }
    return out.join("");
  }

  /** A[i] is read «A på plass i», and A[p : r] «A fra p til r» (the colon then reads «til»). */
  private indexWord() {
    const end = this.source.indexOf("]", this.index);
    return this.source.slice(this.index, end < 0 ? undefined : end).includes(":") ? " fra " : " på plass ";
  }

  /** Whether a colon starts a function type such as h : U \to V, read «h fra U til V». */
  private mapping() {
    return /^\s*[\p{L}\s{}\\]*?\\(to|rightarrow)\b/u.test(this.source.slice(this.index)) && !/[=<>]/.test(this.source.slice(this.index).split(/\\(?:to|rightarrow)/)[0]);
  }

  /** Whether the reader is inside A[...], where a colon means a range. */
  private insideBrackets() {
    const before = this.source.slice(0, this.index);
    return before.lastIndexOf("[") > before.lastIndexOf("]");
  }

  /** An arrow after a mapping colon (h : U \to V) means «til», not «går mot». */
  private mappingArrow() {
    const before = this.source.slice(0, this.index);
    return /:\s*[\p{L}\s{}\\]*?\\(to|rightarrow)$/u.test(before) && !/[=<>]/.test(before.slice(before.lastIndexOf(":")));
  }

  private group(): string {
    while (this.source[this.index] === " ") this.index++;
    const char = this.source[this.index];
    if (char === undefined) return "";
    this.index++;
    if (char === "{") return ` ${this.read("}")} `;
    if (char === "\\") return ` ${this.command()} `;
    return ` ${char} `;
  }

  /** The literal content of a {group}, for \text{…} and similar. */
  private rawGroup(): string {
    while (this.source[this.index] === " ") this.index++;
    if (this.source[this.index] !== "{") return this.group().trim();
    let depth = 0;
    const start = this.index;
    do {
      if (this.source[this.index] === "{") depth++;
      else if (this.source[this.index] === "}") depth--;
      this.index++;
    } while (depth > 0 && this.index < this.source.length);
    return this.source.slice(start + 1, this.index - 1).replace(/\\[a-zA-Z]+|[{}\\]/g, " ").trim();
  }

  private power(): string {
    const exponent = this.group().trim();
    return ` ${powers[exponent] ?? `opphøyd i ${exponent}`} `;
  }

  private command(): string {
    const match = /^[a-zA-Z]+/.exec(this.source.slice(this.index));
    if (!match) {
      // Escaped character or spacing such as \, \; \! \{ \\.
      const char = this.source[this.index++] ?? "";
      return char === "\\" ? ", " : char === "{" ? " mengden " : /[%$#&]/.test(char) ? ` ${char} ` : " ";
    }
    const name = match[0];
    this.index += name.length;
    if (silent.has(name)) return name === "qquad" ? ", " : " ";
    if ((name === "to" || name === "rightarrow") && this.mappingArrow()) return " til ";
    if (textual.has(name)) return ` ${this.rawGroup()} `;
    if (name === "frac" || name === "tfrac" || name === "dfrac") return ` ${this.group().trim()} delt på ${this.group().trim()} `;
    if (name === "binom") return ` ${this.group().trim()} over ${this.group().trim()} `;
    if (name === "sqrt") return ` kvadratroten av ${this.group().trim()} `;
    if (name === "underbrace" || name === "overbrace") {
      const body = this.group();
      if (this.source[this.index] === "_" || this.source[this.index] === "^") { this.index++; this.group(); }
      return body;
    }
    if (name === "begin" || name === "end") { this.group(); return name === "end" ? ". " : " "; }
    if (name === "sum" || name === "prod" || name === "min" || name === "max" || name === "lim") return this.bigOperator(name);
    if (name === "Theta" || name === "Omega" || name === "omega") {
      const spoken = symbols[name];
      return this.source[this.index] === "(" ? ` ${spoken}` : ` ${spoken} `;
    }
    return ` ${symbols[name] ?? name} `;
  }

  private bigOperator(name: string): string {
    const words: Record<string, string> = { sum: "summen", prod: "produktet", min: "minimum", max: "maksimum", lim: "grensen" };
    let below = "";
    let above = "";
    for (let pass = 0; pass < 2; pass++) {
      while (this.source[this.index] === " ") this.index++;
      const char = this.source[this.index];
      if (char === "_") { this.index++; below = this.group().trim(); }
      else if (char === "^") { this.index++; above = this.group().trim(); }
    }
    if (name === "sum" || name === "prod") {
      return below && above ? ` ${words[name]} fra ${below} til ${above} av ` : ` ${words[name]} ${below ? `over ${below} ` : ""}av `;
    }
    return below ? ` ${words[name]} over ${below} av ` : ` ${words[name]} av `;
  }
}

const tidy = (text: string) => text.replace(/\s+/g, " ").replace(/\s+([,.:;?!])/g, "$1").replace(/(, )+/g, ", ").replace(/^[,\s]+|[,\s]+$/g, "").trim();

/** Speakable Norwegian for a LaTeX expression. */
export function latexToSpeech(latex: string): string {
  return tidy(new Reader(latex).read());
}

const unicode: [RegExp, string][] = [
  [/Θ/g, " theta "], [/Ω/g, " omega "], [/ω/g, " lille omega "], [/≤/g, " er mindre enn eller lik "], [/≥/g, " er større enn eller lik "],
  [/≠/g, " er ulik "], [/[⟨⟩]/g, " "], [/→|⇒/g, " gir "], [/[∎✓✗]/g, ""], [/·/g, " ganger "], [/≈/g, " omtrent "],
  [/²/g, " i andre"], [/³/g, " i tredje"], [/ⁿ/g, " opphøyd i n"], [/µs/g, " mikrosekunder"], [/∞/g, " uendelig "],
  [/(\d)\s*[–-]\s*(\d)/g, "$1 til $2"], [/[«»]/g, ""], [/…/g, "."], [/ – /g, ", "],
];

const expansions: [RegExp, string][] = [
  [/\bf\.eks\./gi, "for eksempel"], [/\bbl\.a\./gi, "blant annet"], [/\bdvs\./gi, "det vil si"], [/\bosv\./gi, "og så videre"],
  [/\bca\./gi, "cirka"], [/\bevt\./gi, "eventuelt"], [/\bnr\./gi, "nummer"], [/\bjf\./gi, "jamfør"], [/\bmht\./gi, "med hensyn til"],
  [/\bmaks\./gi, "maksimalt"], [/\bforts\./gi, "fortsatt"],
];

/** Pseudocode read the way a lecturer says it: «så lenge j er større enn 0 og A på plass j …». */
export function codeToSpeech(code: string): string {
  return ` ${code} `
    .replace(/\{\s*\}/g, " krøllparenteser ")
    .replace(/(\w)\[([^\]:]+):([^\]]+)\]/g, "$1 fra $2 til $3")
    .replace(/(\w)\[([^\]]+)\]/g, "$1 på plass $2")
    .replace(/\bfor (\w+) = (.+?) (down)?to\b/g, (_, variable: string, start: string, down?: string) => `for ${variable} fra ${start} ${down ? "ned " : ""}til`)
    .replace(/==/g, " er lik ").replace(/!=|≠/g, " er ulik ").replace(/<=|≤/g, " er mindre enn eller lik ").replace(/>=|≥/g, " er større enn eller lik ")
    .replace(/([\w\]])\s*=\s*/g, "$1 settes til ")
    .replace(/</g, " er mindre enn ").replace(/>/g, " er større enn ").replace(/\+/g, " pluss ").replace(/\s-\s|(?<=\w)-(?=\d)/g, " minus ").replace(/\*/g, " ganger ")
    .replace(/\bwhile\b/g, "så lenge").replace(/\band\b/g, "og").replace(/\bor\b/g, "eller").replace(/\bnot\b/g, "ikke")
    .replace(/\bif\b/g, "hvis").replace(/\belse\b/g, "ellers").replace(/\bthen\b/g, "").replace(/\breturn\b/g, "returner")
    .replace(/[{}()_]/g, " ")
    .replace(/\s+/g, " ").trim();
}

/** Speakable text for inline lesson text with $math$, **bold** and `code`. */
export function toSpeech(text: string): string {
  let spoken = text
    // Learning-goal codes such as (A7) or (Z1–Z6) are for reading, not listening.
    .replace(/\*{0,2}\(([A-Z]\d+(?:[–-][A-Z]?\d+)?(?:,\s*[A-Z]\d+)*)\)\*{0,2}/g, "")
    .replace(/\$([^$]+)\$/g, (_, latex: string) => ` ${latexToSpeech(latex)} `)
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, (_, code: string) => ` ${codeToSpeech(code)} `)
    // Algorithm names: «Insertion-Sort» is said as two words.
    .replace(/([A-Za-zÆØÅæøå])-(?=[A-ZÆØÅ])/g, "$1 ");
  for (const [pattern, replacement] of expansions) spoken = spoken.replace(pattern, match => match[0] === match[0].toUpperCase() ? replacement[0].toUpperCase() + replacement.slice(1) : replacement);
  for (const [pattern, replacement] of unicode) spoken = spoken.replace(pattern, replacement);
  return tidy(spoken);
}

/**
 * How the free browser voices should say English words they otherwise mangle. Only applied
 * when a browser voice speaks; AI voices get the text unchanged. Add words here as needed.
 */
const browserLexicon: [RegExp, string][] = [
  [/\bkey\b/g, "ki"], [/\bHeapsort\b/gi, "hipsort"], [/\bheap(s?)\b/gi, "hip$1"], [/\bQuicksort\b/gi, "kvikksort"],
  [/\bMerge Sort\b/gi, "mørsj sort"], [/\bInsertion Sort\b/gi, "insersjon sort"], [/\bBubble Sort\b/gi, "babbel sort"],
  [/\bbrute force\b/gi, "brut fors"], [/\bin-place\b/gi, "in pleis"], [/\bworst\b/g, "wørst"], [/\bbest\b/g, "best"],
  [/\bavg\b/g, "gjennomsnitt"], [/\bBFS\b/g, "B F S"], [/\bDFS\b/g, "D F S"], [/\bRAM\b/g, "ram"],
];

export function browserPronunciation(text: string): string {
  return browserLexicon.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
}

/** A phrase to speak and the pause after it, in milliseconds. */
export type Phrase = { text: string; pause: number };

/**
 * Splits narration into phrases with natural pauses: a full stop after each sentence, a
 * shorter break at a colon or semicolon, and a breath at a comma in very long sentences.
 */
export function phrases(spoken: string): Phrase[] {
  const result: Phrase[] = [];
  for (const sentence of splitSentences(spoken)) {
    const end = /[?]$/.test(sentence) ? 450 : 340;
    const clauses = sentence.length > 140 ? sentence.split(/(?<=[:;])\s+/) : [sentence];
    clauses.forEach((clause, index) => {
      const last = index === clauses.length - 1;
      const pieces = clause.length > 180 ? breathe(clause) : [clause];
      pieces.forEach((piece, pieceIndex) => result.push({
        text: piece, pause: pieceIndex < pieces.length - 1 ? 140 : last ? end : 220,
      }));
    });
  }
  return result;
}

/** Splits a long clause at commas into pieces of at least 70 characters. */
function breathe(clause: string): string[] {
  const pieces: string[] = [];
  let current = "";
  for (const part of clause.split(/(?<=,)\s+/)) {
    current = current ? `${current} ${part}` : part;
    if (current.length >= 70) { pieces.push(current); current = ""; }
  }
  // A short tail joins the previous piece instead of being said on its own.
  if (current && pieces.length && current.length < 40) pieces[pieces.length - 1] += ` ${current}`;
  else if (current) pieces.push(current);
  return pieces;
}

/** A short, stable key for a narration text, used to name and look up pre-generated audio. */
export function narrationKey(text: string): string {
  // cyrb53: a fast 53-bit string hash, identical in the browser and in Node.
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

const abbreviations = /(?:\b(?:ca|f\.eks|bl\.a|osv|dvs|nr|s|jf|evt|mht|etc|vs|maks|forts))\.$/i;

/**
 * Splits lesson text into sentences without breaking inside $math$ or **bold**,
 * so a long paragraph can be shown and read one sentence at a time.
 */
export function splitSentences(text: string): string[] {
  const sentences: string[] = [];
  let current = "";
  for (const segment of text.split(/(\$[^$]+\$)/)) {
    if (segment.startsWith("$")) { current += segment; continue; }
    const pieces = segment.split(/(?<=[.!?])\s+/);
    pieces.forEach((piece, index) => {
      current += piece;
      const last = index === pieces.length - 1;
      if (last) return;
      const balanced = (current.match(/\*\*/g)?.length ?? 0) % 2 === 0;
      if (balanced && !abbreviations.test(current)) { sentences.push(current.trim()); current = ""; }
      else current += " ";
    });
  }
  if (current.trim()) sentences.push(current.trim());
  return sentences;
}

/** Groups sentences into short chunks of at most `limit` characters (but at least one sentence each). */
export function chunkText(text: string, limit = 240): string[] {
  const chunks: string[] = [];
  for (const sentence of splitSentences(text)) {
    const last = chunks.at(-1);
    if (last !== undefined && last.length + sentence.length + 1 <= limit) chunks[chunks.length - 1] = `${last} ${sentence}`;
    else chunks.push(sentence);
  }
  return chunks;
}
