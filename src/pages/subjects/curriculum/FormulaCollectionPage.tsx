import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Info } from "lucide-react";
import { useCurriculum } from "../../../components/subjects/CurriculumLayout/curriculumContext";
import { MathText } from "../../../components/common/MathText/MathText";
import { matchesSearch, type FormulaEntry } from "../../../services/subjects/curriculumContent";
import { CurriculumPage, CurriculumStatus, Latex, SearchField } from "./curriculumShared";
import { unitLabel, useSubjectFormulas } from "./curriculumHelpers";

export function FormulaCollectionPage() {
  const { subjectId, workspace, errorMessage } = useCurriculum();
  const { groups, error } = useSubjectFormulas(workspace);
  const [query, setQuery] = useState("");
  const status = errorMessage || error;
  const filtered = (groups ?? []).map(group => ({ ...group, formulas: group.formulas.filter(formula =>
    matchesSearch(query, formula.latex, formula.title, formula.description, formula.note.title, group.unit?.title)) }))
    .filter(group => group.formulas.length > 0);
  const total = groups?.reduce((sum, group) => sum + group.formulas.length, 0) ?? 0;

  return <CurriculumPage label="Verktøy" title="Formelsamling" className="curriculum-formulas">
    <p className="curriculum-callout"><Info size={18} aria-hidden="true" />
      Formlene er hentet direkte fra notatene dine og sortert etter tema. Sjekk eksamensreglene for hvilke hjelpemidler som er tillatt.
    </p>
    <SearchField value={query} onChange={setQuery} label="Søk i formler" />
    {status ? <CurriculumStatus alert>{status}</CurriculumStatus>
      : !groups ? <CurriculumStatus>Henter formler fra notatene…</CurriculumStatus>
      : total === 0 ? <p className="curriculum-note">Ingen formler er skrevet inn som blokkformler i notatene ennå.</p>
      : filtered.length === 0 ? <p className="curriculum-note">Ingen formler passer søket.</p>
      : filtered.map(group => <section key={group.unit?.id ?? "rest"} className="curriculum-section">
        <h2 className="curriculum-numbered-heading">
          {group.unit?.number && <span className="curriculum-number">{group.unit.number}</span>}
          {group.unit ? <Link to={`/fag/${subjectId}/tema/pensum/${group.unit.id}`}>{group.unit.title}</Link> : "Andre notater"}
        </h2>
        {group.unit && <p className="curriculum-section-label">{unitLabel(group.unit, Boolean(workspace?.config))}</p>}
        <ul className="curriculum-formula-list">{group.formulas.map(formula => <FormulaCard key={formula.key} formula={formula} />)}</ul>
      </section>)}
  </CurriculumPage>;
}

function FormulaCard({ formula }: { formula: FormulaEntry }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formula.latex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  };
  return <li className="curriculum-formula-card">
    <div className="curriculum-formula-math"><Latex latex={formula.latex} /></div>
    <div className="curriculum-formula-text">
      {formula.title && <strong><MathText>{formula.title}</MathText></strong>}
      {formula.description && <p><MathText>{formula.description}</MathText></p>}
      <Link className="curriculum-source-link" to={`/fag/${formula.note.subjectId}/notater/${formula.note.slug}`}>Fra {formula.note.title} →</Link>
    </div>
    <button type="button" className="curriculum-icon-button" onClick={() => void copy()} aria-label={copied ? "LaTeX kopiert" : "Kopier LaTeX"} title="Kopier LaTeX">
      {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
    </button>
  </li>;
}
