import type { Concept } from "../../data/concepts/types";
import type { CurriculumConfig, CurriculumUnitConfig } from "../../data/curriculum/types";
import type { DatabaseSubtopic, DatabaseTopic } from "./subjectStructureService";
import type { NoteMetadata } from "../notes/notesService";
import type { NoteSubtopicLink } from "../notes/noteSubtopicsService";
import type { DatabasePdf } from "../media/pdfsService";

export type CurriculumTopic = DatabaseTopic & { subtopics: DatabaseSubtopic[] };
export type CurriculumUnit = CurriculumUnitConfig & { topics: CurriculumTopic[]; subtopicIds: string[] };
export type WorkspaceConcept = Concept & { subtopicIds: string[] };
export type NoteSource = Pick<NoteMetadata, "id" | "title" | "slug" | "subjectId"> & { content: string };
type NoteReference = Omit<NoteSource, "content">;

export const OTHER_UNIT_ID = "andre";

/** Group the existing topics and subtopics into pensum units. Topics that are
 * not part of the configuration are kept in a final group, never hidden. */
export function buildCurriculumUnits(config: CurriculumConfig | undefined, topics: CurriculumTopic[]): CurriculumUnit[] {
  if (!config) return topics.map((topic, index) => ({
    id: topic.id, number: String(index + 1).padStart(2, "0"), title: topic.name, topicIds: [topic.id],
    topics: [topic], subtopicIds: topic.subtopics.map(subtopic => subtopic.id),
  }));
  const unitOfTopic = new Map(config.units.flatMap(unit => unit.topicIds.map(id => [id, unit.id] as const)));
  const known = new Set(config.units.map(unit => unit.id));
  const unitOf = (subtopic: DatabaseSubtopic) => {
    const override = config.subtopicUnits?.[subtopic.id];
    return override && known.has(override) ? override : unitOfTopic.get(subtopic.topicId) ?? OTHER_UNIT_ID;
  };
  const unmapped = topics.filter(topic => !unitOfTopic.has(topic.id));
  const units: CurriculumUnitConfig[] = unmapped.length
    ? [...config.units, { id: OTHER_UNIT_ID, title: "Andre temaer", part: "Andre temaer", topicIds: unmapped.map(topic => topic.id) }]
    : config.units;
  return units.map(unit => {
    const unitTopics = topics.flatMap(topic => {
      const subtopics = topic.subtopics.filter(subtopic => unitOf(subtopic) === unit.id);
      const ownsEmptyTopic = topic.subtopics.length === 0 && (unitOfTopic.get(topic.id) ?? OTHER_UNIT_ID) === unit.id;
      return subtopics.length > 0 || ownsEmptyTopic ? [{ ...topic, subtopics }] : [];
    });
    return { ...unit, topics: unitTopics, subtopicIds: unitTopics.flatMap(topic => topic.subtopics.map(subtopic => subtopic.id)) };
  });
}

export function findUnitForTopic(units: CurriculumUnit[], topicId?: string, subtopicId?: string) {
  if (subtopicId) {
    const unit = units.find(item => item.subtopicIds.includes(subtopicId));
    if (unit) return unit;
  }
  return topicId ? units.find(item => item.topics.some(topic => topic.id === topicId)) : undefined;
}

export function notesForUnit(unit: CurriculumUnit, notes: NoteMetadata[], links: NoteSubtopicLink[]) {
  const ids = new Set(unit.subtopicIds);
  const linked = new Set(links.filter(link => ids.has(link.subtopicId)).map(link => link.noteId));
  return notes.filter(note => (note.subtopicId && ids.has(note.subtopicId)) || linked.has(note.id));
}

export const isBackupTitle = (title: string) => /sikkerhetskopi/i.test(title);

/** The lecture or exercise number a title declares, e.g. "Øving 2a …", "Forelesning 3 …" or "4. Rangering …". */
export function declaredNumber(title: string) {
  const match = title.match(/^\s*(?:forelesning|øving)\s*0*(\d+[ab]?)(?![\p{L}\p{N}])/iu) ?? title.match(/^\s*0*(\d+[ab]?)\.\s/u);
  return match?.[1].toLowerCase();
}

/** Linked notes without backups and without notes that declare another lecture's number. */
export function currentNotesForUnit(unit: CurriculumUnit, notes: NoteMetadata[], links: NoteSubtopicLink[]) {
  const own = unit.resourceNumber?.toLowerCase();
  return notesForUnit(unit, notes, links).filter(note => {
    if (isBackupTitle(note.title)) return false;
    const declared = declaredNumber(note.title);
    return !declared || !own || declared === own;
  });
}

const numberPattern = (prefix: string, number: string) =>
  new RegExp(`(?:^|[^\\p{L}])${prefix}[\\s_.-]*0?${number.replace(/^0+(?=\d)/, "")}(?![\\p{L}\\p{N}])`, "iu");

/** Existing lecture PDFs: placed in the unit, or titled with its lecture number. */
export function lectureNotesForUnit(unit: CurriculumUnit, pdfs: DatabasePdf[]) {
  const ids = new Set(unit.subtopicIds);
  const pattern = unit.resourceNumber ? numberPattern("forelesn(?:ing(?:er)?)?", unit.resourceNumber) : undefined;
  return pdfs.filter(pdf => !numberPattern("øving", "\\w+").test(pdf.title) &&
    ((pdf.subtopicId && ids.has(pdf.subtopicId)) || (pattern?.test(pdf.title) ?? false)));
}

export function exercisesForUnit(unit: CurriculumUnit, pdfs: DatabasePdf[], notes: NoteMetadata[]) {
  if (!unit.resourceNumber) return [];
  const pattern = numberPattern("øving", unit.resourceNumber);
  return [
    ...pdfs.filter(pdf => pattern.test(pdf.title) && !isBackupTitle(pdf.title)).map(pdf => ({ id: pdf.id, title: pdf.title, kind: "pdf" as const })),
    ...notes.filter(note => pattern.test(note.title) && !isBackupTitle(note.title)).map(note => ({ id: note.id, title: note.title, slug: note.slug, kind: "note" as const })),
  ];
}

// --- Note content ---------------------------------------------------------

const CALLOUT = '[data-type="callout"]';
const reference = ({ id, title, slug, subjectId }: NoteSource): NoteReference => ({ id, title, slug, subjectId });

/** Text with inline math kept as $…$ for MathText. */
export function textWithMath(element: Element, maxLength = 280) {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll('[data-type="block-math"]').forEach(node => node.remove());
  clone.querySelectorAll<HTMLElement>('[data-type="inline-math"]').forEach(node => {
    node.replaceWith(`$${node.dataset.latex ?? node.textContent ?? ""}$`);
  });
  const text = (clone.textContent ?? "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  // Do not cut inside a math expression.
  let cut = text.slice(0, maxLength);
  if ((cut.match(/\$/g)?.length ?? 0) % 2 === 1) cut = cut.slice(0, cut.lastIndexOf("$"));
  return `${cut.trimEnd()} …`;
}

export type FormulaEntry = { key: string; latex: string; description: string; title?: string; conceptId?: string; note: NoteReference };

export function extractFormulas(notes: NoteSource[], concepts: Pick<Concept, "id" | "name">[] = []): FormulaEntry[] {
  const names = new Map(concepts.map(concept => [concept.id, concept.name]));
  const seen = new Set<string>();
  return notes.flatMap(note => {
    const doc = new DOMParser().parseFromString(note.content, "text/html");
    return Array.from(doc.body.querySelectorAll<HTMLElement>('[data-type="block-math"]')).flatMap(element => {
      const latex = element.dataset.latex?.trim();
      if (!latex) return [];
      const key = latex.replace(/\s+/g, "");
      if (seen.has(key)) return [];
      seen.add(key);
      const callout = element.closest<HTMLElement>(CALLOUT);
      const conceptId = element.dataset.formulaConceptId ?? callout?.dataset.conceptId ?? undefined;
      const title = (conceptId && names.get(conceptId)) || element.dataset.conceptName || callout?.dataset.conceptName || undefined;
      let context: Element | null = null;
      for (let node = element.previousElementSibling; node && !context; node = node.previousElementSibling) {
        if (/^H[1-6]$/.test(node.tagName) || node.matches('[data-type="block-math"], pre')) break;
        if (node.matches("p, li, ul, ol") && node.textContent?.trim()) context = node;
      }
      if (!context && callout) context = callout.querySelector("p");
      return [{ key, latex, title, conceptId, description: context ? textWithMath(context) : "", note: reference(note) }];
    });
  });
}

// --- Symbols --------------------------------------------------------------

export type SymbolDefinition = { id: string; latex: string; name: string; command: string; pattern: RegExp };
const command = (name: string) => new RegExp(`\\\\${name}(?![a-zA-Z])`);
const symbol = (id: string, latex: string, name: string, pattern: RegExp, commandText = latex): SymbolDefinition =>
  ({ id, latex, name, command: commandText, pattern });

// Only notation names; the meaning in context is shown through the formulas that use it.
export const SYMBOLS: SymbolDefinition[] = [
  symbol("O", "O", "Stor O", /(?:^|[^\\a-zA-Z])O\s*\(/),
  symbol("Omega", "\\Omega", "Stor omega", command("Omega")),
  symbol("Theta", "\\Theta", "Stor theta", command("Theta")),
  symbol("o", "o", "Liten o", /(?:^|[^\\a-zA-Z])o\s*\(/),
  symbol("omega", "\\omega", "Liten omega", command("omega")),
  symbol("lg", "\\lg", "lg (logaritme)", command("lg")),
  symbol("log", "\\log", "log (logaritme)", command("log")),
  symbol("ln", "\\ln", "ln (naturlig logaritme)", command("ln")),
  symbol("ceil", "\\lceil x \\rceil", "Takfunksjon", command("lceil"), "\\lceil … \\rceil"),
  symbol("floor", "\\lfloor x \\rfloor", "Gulvfunksjon", command("lfloor"), "\\lfloor … \\rfloor"),
  symbol("sum", "\\sum", "Sum", command("sum")),
  symbol("prod", "\\prod", "Produkt", command("prod")),
  symbol("binom", "\\binom{n}{k}", "Binomialkoeffisient", command("binom"), "\\binom"),
  symbol("factorial", "n!", "Fakultet", /[a-zA-Z0-9})]\s*!/, "!"),
  symbol("mod", "\\bmod", "Modulo", /\\(?:bmod|pmod|mod)(?![a-zA-Z])/),
  symbol("infty", "\\infty", "Uendelig", command("infty")),
  symbol("lim", "\\lim", "Grenseverdi", command("lim")),
  symbol("le", "\\le", "Mindre enn eller lik", /\\(?:le|leq)(?![a-zA-Z])/),
  symbol("ge", "\\ge", "Større enn eller lik", /\\(?:ge|geq)(?![a-zA-Z])/),
  symbol("ne", "\\ne", "Ulik", /\\(?:ne|neq)(?![a-zA-Z])/),
  symbol("approx", "\\approx", "Omtrent lik", command("approx")),
  symbol("in", "\\in", "Element i", command("in")),
  symbol("subseteq", "\\subseteq", "Delmengde", /\\(?:subseteq|subset)(?![a-zA-Z])/),
  symbol("cup", "\\cup", "Union", command("cup")),
  symbol("cap", "\\cap", "Snitt", command("cap")),
  symbol("emptyset", "\\emptyset", "Tom mengde", /\\(?:emptyset|varnothing)(?![a-zA-Z])/),
  symbol("forall", "\\forall", "For alle", command("forall")),
  symbol("exists", "\\exists", "Det finnes", command("exists")),
  symbol("implies", "\\Rightarrow", "Implikasjon", /\\(?:Rightarrow|implies)(?![a-zA-Z])/),
  symbol("to", "\\to", "Pil", /\\(?:to|rightarrow)(?![a-zA-Z])/),
  symbol("leftarrow", "\\leftarrow", "Tilordning (venstrepil)", command("leftarrow")),
  symbol("cdot", "\\cdot", "Multiplikasjon (prikk)", command("cdot")),
  symbol("sqrt", "\\sqrt{x}", "Kvadratrot", command("sqrt"), "\\sqrt"),
  symbol("alpha", "\\alpha", "Alfa", command("alpha")),
  symbol("epsilon", "\\epsilon", "Epsilon", /\\(?:epsilon|varepsilon)(?![a-zA-Z])/),
  symbol("lambda", "\\lambda", "Lambda", command("lambda")),
  symbol("delta", "\\delta", "Delta", command("delta")),
  symbol("pi", "\\pi", "Pi", command("pi")),
];

export function findSymbols<T extends { latex: string }>(formulas: T[]) {
  return SYMBOLS.map(definition => ({ definition, formulas: formulas.filter(formula => definition.pattern.test(formula.latex)) }))
    .filter(entry => entry.formulas.length > 0);
}

export const normalizeSearch = (text: string) => text.toLocaleLowerCase("nb").normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();
export const matchesSearch = (query: string, ...fields: (string | undefined)[]) => {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const haystack = normalizeSearch(fields.filter(Boolean).join(" "));
  return terms.every(term => haystack.includes(term));
};
