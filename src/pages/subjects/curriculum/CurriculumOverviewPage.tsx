import { Link } from "react-router-dom";
import { BookOpen, Check, ExternalLink, Pi, Sigma } from "lucide-react";
import { subjects } from "../../../data/subjects";
import { groupUnitsByPart, useCurriculum } from "../../../components/subjects/CurriculumLayout/curriculumContext";
import { hasLesson } from "../../../data/curriculum/lessons";
import { CurriculumPage, CurriculumStatus } from "./curriculumShared";

export function CurriculumOverviewPage() {
  const { subjectId, workspace, errorMessage, progress } = useCurriculum();
  const subject = subjects.find(item => item.id === subjectId);
  const base = `/fag/${subjectId}/tema`;
  const title = subject ? `${subject.code} ${subject.name}` : "Pensumoversikt";
  if (errorMessage) return <CurriculumPage label="Pensum" title={title}><CurriculumStatus alert>{errorMessage}</CurriculumStatus></CurriculumPage>;
  if (!workspace) return <CurriculumPage label="Pensum" title={title}><CurriculumStatus>Laster pensumoversikt…</CurriculumStatus></CurriculumPage>;
  const { units, config } = workspace;
  const done = units.filter(unit => progress.completed.has(unit.id)).length;

  return <CurriculumPage label="Pensum" title={title} className="curriculum-overview">
    <p className="curriculum-lead">
      Velg et tema for å se teori, algoritmer, formler og begreper fra notatene dine, sammen med forelesningsnotater og øvinger.
      {config && <> Strukturen følger <a href={config.source.url} target="_blank" rel="noreferrer">{config.source.label}<ExternalLink size={13} aria-hidden="true" /></a>.</>}
    </p>
    {units.length > 0 && <div className="curriculum-overview-progress">
      <span><strong>{done} av {units.length}</strong> temaer gjennomgått</span>
      <span className="curriculum-progress-bar" aria-hidden="true"><span style={{ width: `${(done / units.length) * 100}%` }} /></span>
    </div>}
    {progress.errorMessage && <CurriculumStatus alert>{progress.errorMessage}</CurriculumStatus>}

    <section className="curriculum-section" aria-labelledby="curriculum-tools">
      <h2 id="curriculum-tools">Verktøy</h2>
      <div className="curriculum-tool-grid">
        <Link className="curriculum-tool-card" to={`${base}/formler`}><Sigma aria-hidden="true" /><strong>Formelsamling</strong><span>Søk i formler og kjøretider fra notatene</span></Link>
        <Link className="curriculum-tool-card" to={`${base}/symboler`}><Pi aria-hidden="true" /><strong>Symboler</strong><span>Notasjon som brukes i formlene</span></Link>
        <Link className="curriculum-tool-card" to={`${base}/begreper`}><BookOpen aria-hidden="true" /><strong>Begreper</strong><span>{workspace.concepts.length} begreper med korte definisjoner</span></Link>
      </div>
    </section>

    {units.length === 0 ? <p className="curriculum-section">Det er ikke lagt til temaer i dette faget ennå.</p>
      : groupUnitsByPart(units).map((part, index) => <section key={part.name ?? index} className="curriculum-section">
        {part.name && <h2>{part.name}</h2>}
        <ol className="curriculum-unit-grid">{part.units.map(unit => {
          const lesson = hasLesson(subjectId, unit.id);
          const completed = progress.completed.has(unit.id);
          return <li key={unit.id}>
            <Link className={`curriculum-unit-card${completed ? " is-done" : ""}`} to={`${base}/pensum/${unit.id}`}>
              <span className="curriculum-unit-card-top">
                {unit.number && <span className="curriculum-number">{unit.number}</span>}
                {completed && <span className="curriculum-done-badge"><Check size={13} aria-hidden="true" />Gjennomgått</span>}
              </span>
              <strong>{unit.title}</strong>
              {unit.readings && unit.readings.length > 0 && <span className="curriculum-unit-readings">{unit.readings.join(" · ")}</span>}
              <span className={lesson ? "curriculum-unit-meta has-lesson" : "curriculum-unit-meta"}>
                {lesson ? "Læringsnotat klart" : "Læringsnotat kommer"}
                {unit.supporting && " · Støttelitteratur"}
              </span>
            </Link>
          </li>;
        })}</ol>
      </section>)}
  </CurriculumPage>;
}
