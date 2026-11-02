import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCurriculum } from "../../../components/subjects/CurriculumLayout/curriculumContext";
import { findSymbols, matchesSearch } from "../../../services/subjects/curriculumContent";
import { CurriculumPage, CurriculumStatus, Latex, NoteFormulaToggle, SearchField } from "./curriculumShared";
import { useSubjectFormulas } from "./curriculumHelpers";

const EXAMPLES = 4;

export function SymbolsPage() {
  const { subjectId, workspace, errorMessage } = useCurriculum();
  const [includeNotes, setIncludeNotes] = useState(false);
  const { groups, error } = useSubjectFormulas(workspace, includeNotes);
  const [query, setQuery] = useState("");
  const formulas = useMemo(() => (groups ?? []).flatMap(group => group.formulas.map(formula => ({ ...formula, unit: group.unit }))), [groups]);
  const symbols = useMemo(() => findSymbols(formulas), [formulas]);
  const visible = symbols.filter(({ definition }) => matchesSearch(query, definition.name, definition.command, definition.latex));
  const status = errorMessage || error;

  return <CurriculumPage label="Verktøy" title="Symboler" className="curriculum-symbols">
    <p className="curriculum-lead">Notasjon som brukes i formlene i læringsnotatene, med eksempler på hvor den forekommer.</p>
    <SearchField value={query} onChange={setQuery} label="Søk i symboler" />
    <NoteFormulaToggle checked={includeNotes} onChange={setIncludeNotes} />
    {status ? <CurriculumStatus alert>{status}</CurriculumStatus>
      : !groups ? <CurriculumStatus>Henter formler…</CurriculumStatus>
      : symbols.length === 0 ? <p className="curriculum-note">Fant ingen kjente symboler i formlene ennå.</p>
      : visible.length === 0 ? <p className="curriculum-note">Ingen symboler passer søket.</p>
      : <ul className="curriculum-symbol-grid">{visible.map(({ definition, formulas: uses }) => <li key={definition.id} className="curriculum-symbol-card">
        <div className="curriculum-symbol-head">
          <span className="curriculum-symbol-glyph"><Latex latex={definition.latex} display={false} /></span>
          <div><strong>{definition.name}</strong><code>{definition.command}</code></div>
        </div>
        <details>
          <summary>Brukt i {uses.length} {uses.length === 1 ? "formel" : "formler"}</summary>
          <ul className="curriculum-symbol-uses">{uses.slice(0, EXAMPLES).map(use => <li key={use.key}>
            <Latex latex={use.latex} display={false} />
            {use.unit ? <Link to={`/fag/${subjectId}/tema/pensum/${use.unit.id}`}>{use.unit.number ? `${use.unit.number} ` : ""}{use.unit.title}</Link>
              : <Link to={use.source.to}>{use.source.label}</Link>}
          </li>)}</ul>
          {uses.length > EXAMPLES && <p className="curriculum-source-link">og {uses.length - EXAMPLES} til</p>}
        </details>
      </li>)}</ul>}
  </CurriculumPage>;
}
