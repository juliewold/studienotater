import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Info } from "lucide-react";
import { useCurriculum } from "../../../components/subjects/CurriculumLayout/curriculumContext";
import { MathText } from "../../../components/common/MathText/MathText";
import { matchesSearch } from "../../../services/subjects/curriculumContent";
import type { FormulaBookStatus } from "../../../data/curriculum/lessons/types";
import { CurriculumPage, CurriculumStatus, Latex, NoteFormulaToggle, SearchField } from "./curriculumShared";
import { unitLabel, useSubjectFormulas, type FormulaItem, type UnitFormulas } from "./curriculumHelpers";

type BookFilter = "all" | "must" | "book";
const bookFilters: { value: BookFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "must", label: "Må læres" },
  { value: "book", label: "I formelboka" },
];

/** «Må læres» shows formulas that are missing from the book, and partial ones that need learning. */
const matchesBookFilter = (book: FormulaBookStatus | undefined, filter: BookFilter) => {
  if (filter === "all") return true;
  if (!book) return false;
  if (filter === "must") return book.status === "missing" || book.status === "partial";
  return book.status === "book" || book.status === "partial";
};

const countWith = (groups: UnitFormulas[], filter: BookFilter) =>
  groups.reduce((sum, group) => sum + group.formulas.filter(formula => matchesBookFilter(formula.book, filter)).length, 0);

export function FormulaCollectionPage() {
  const { subjectId, workspace, errorMessage } = useCurriculum();
  const [includeNotes, setIncludeNotes] = useState(false);
  const { groups, error } = useSubjectFormulas(workspace, includeNotes);
  const [query, setQuery] = useState("");
  const [bookFilter, setBookFilter] = useState<BookFilter>("all");
  const status = errorMessage || error;
  const filtered = (groups ?? []).map(group => ({ ...group, formulas: group.formulas.filter(formula =>
    matchesSearch(query, formula.latex, formula.title, formula.description, formula.source.label, group.unit?.title)
    && matchesBookFilter(formula.book, bookFilter)) }))
    .filter(group => group.formulas.length > 0);
  const total = groups?.reduce((sum, group) => sum + group.formulas.length, 0) ?? 0;
  // Only subjects that have classified their formulas get the book filter.
  const classified = Boolean(groups?.some(group => group.formulas.some(formula => formula.book)));

  return <CurriculumPage label="Verktøy" title="Formelsamling" className="curriculum-formulas">
    <p className="curriculum-callout"><Info size={18} aria-hidden="true" />
      Formlene kommer fra de kvalitetssikrede læringsnotatene og er sortert etter tema. Sjekk eksamensreglene for hvilke hjelpemidler som er tillatt.
    </p>
    <SearchField value={query} onChange={setQuery} label="Søk i formler" />
    {classified && groups && <div className="curriculum-filters">
      <div role="group" aria-label="Formelboka">
        {bookFilters.map(item => <button key={item.value} type="button" aria-pressed={bookFilter === item.value} onClick={() => setBookFilter(item.value)}>
          {item.label} <span className="formula-count">{item.value === "all" ? total : countWith(groups, item.value)}</span>
        </button>)}
      </div>
    </div>}
    {classified && <p className="curriculum-note">«Må læres» betyr at formelen, eller deler av den, ikke står i den tillatte formelboka. Du må kunne innholdet, men ikke nødvendigvis utenat.</p>}
    <NoteFormulaToggle checked={includeNotes} onChange={setIncludeNotes} />
    {status ? <CurriculumStatus alert>{status}</CurriculumStatus>
      : !groups ? <CurriculumStatus>Henter formler…</CurriculumStatus>
      : total === 0 ? <p className="curriculum-note">Ingen formler ennå.</p>
      : filtered.length === 0 ? <p className="curriculum-note">Ingen formler passer søket eller filteret.</p>
      : filtered.map(group => <section key={group.unit?.id ?? "rest"} className="curriculum-section">
        <h2 className="curriculum-numbered-heading">
          {group.unit?.number && <span className="curriculum-number">{group.unit.number}</span>}
          {group.unit ? <Link to={`/fag/${subjectId}/tema/pensum/${group.unit.id}`}>{group.unit.title}</Link> : "Andre notater"}
        </h2>
        {group.unit && <p className="curriculum-section-label">{unitLabel(group.unit, Boolean(workspace?.config))}{!group.reviewed && " · fra notater, ikke kvalitetssikret"}</p>}
        <ul className="curriculum-formula-list">{group.formulas.map(formula => <FormulaCard key={formula.key} formula={formula} />)}</ul>
      </section>)}
  </CurriculumPage>;
}

/** Where a formula stands in the allowed formula book. Blue: in the book. Red: must be learned. */
function FormulaBookStatusLabel({ book }: { book: FormulaBookStatus }) {
  const pageWord = (pages: string) => (pages.includes("–") ? "sider" : "side");
  if (book.status === "book") return <span className="formula-book formula-book--book">I formelboka – {pageWord(book.pages)} {book.pages}</span>;
  if (book.status === "partial") return <>
    <span className="formula-book formula-book--book">Delvis i formelboka – {pageWord(book.pages)} {book.pages}</span>
    <span className="formula-missing">Må læres: {book.missing}</span>
  </>;
  return <span className="formula-book formula-book--missing">Ikke i formelboka – må læres</span>;
}

function FormulaCard({ formula }: { formula: FormulaItem }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formula.latex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  };
  const mustLearn = formula.book?.status === "missing";
  const cardClass = ["curriculum-formula-card", !formula.reviewed && "is-unreviewed", mustLearn && "is-must-learn"].filter(Boolean).join(" ");
  return <li className={cardClass}>
    <div className="curriculum-formula-math"><Latex latex={formula.latex} /></div>
    <div className="curriculum-formula-text">
      {formula.book && <FormulaBookStatusLabel book={formula.book} />}
      {formula.title && <strong><MathText>{formula.title}</MathText></strong>}
      {formula.description && <p><MathText>{formula.description}</MathText></p>}
      <Link className="curriculum-source-link" to={formula.source.to}>{formula.reviewed ? "Se" : "Fra"} {formula.source.label} →</Link>
    </div>
    <button type="button" className="curriculum-icon-button" onClick={() => void copy()} aria-label={copied ? "LaTeX kopiert" : "Kopier LaTeX"} title="Kopier LaTeX">
      {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
    </button>
  </li>;
}
