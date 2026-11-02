import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { BookOpen, Check, ChevronLeft, LayoutGrid, Pi, Sigma } from "lucide-react";
import { subjects } from "../../../data/subjects";
import { useCurriculumProgress } from "../../../hooks/useCurriculumProgress";
import { loadCurriculumWorkspace, type CurriculumWorkspace } from "../../../services/subjects/curriculumWorkspaceService";
import { findUnitForTopic } from "../../../services/subjects/curriculumContent";
import { groupUnitsByPart, type CurriculumContext } from "./curriculumContext";
import "./CurriculumLayout.css";

export function CurriculumLayout() {
  const { subjectId = "" } = useParams();
  return <SubjectCurriculum key={subjectId} subjectId={subjectId} />;
}

function SubjectCurriculum({ subjectId }: { subjectId: string }) {
  const { topicId, subtopicId, unitId } = useParams();
  const [workspace, setWorkspace] = useState<CurriculumWorkspace | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useCurriculumProgress(subjectId);
  const subject = subjects.find(item => item.id === subjectId);

  useEffect(() => {
    let cancelled = false;
    loadCurriculumWorkspace(subjectId).then(result => { if (!cancelled) setWorkspace(result); })
      .catch(error => {
        console.error("Kunne ikke hente pensumoversikten:", error);
        if (!cancelled) setErrorMessage("Kunne ikke hente pensumstrukturen.");
      });
    return () => { cancelled = true; };
  }, [subjectId]);

  const units = workspace?.units ?? [];
  const activeUnit = unitId ? units.find(unit => unit.id === unitId) : findUnitForTopic(units, topicId, subtopicId);
  const completedCount = units.filter(unit => progress.completed.has(unit.id)).length;
  const close = () => setMobileOpen(false);
  const base = `/fag/${subjectId}/tema`;
  const context: CurriculumContext = { subjectId, workspace, isLoading: !workspace && !errorMessage, errorMessage, progress };

  return <div className="curriculum-layout">
    <aside className="curriculum-sidebar">
      <header className="curriculum-sidebar-header">
        <Link className="curriculum-back" to={`/fag/${subjectId}`}><ChevronLeft size={15} aria-hidden="true" />{subject?.code ?? subjectId.toUpperCase()}</Link>
        <h2>{subject?.name ?? "Pensum"}</h2>
        {units.length > 0 && <div className="curriculum-progress" aria-label={`${completedCount} av ${units.length} temaer gjennomgått`}>
          <span>Gjennomgått</span>
          <span className="curriculum-progress-bar" aria-hidden="true"><span style={{ width: `${(completedCount / units.length) * 100}%` }} /></span>
          <span className="curriculum-progress-count">{completedCount}/{units.length}</span>
        </div>}
      </header>
      <button className="curriculum-toggle" aria-expanded={mobileOpen} aria-controls="curriculum-navigation" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? "Skjul pensummeny" : "Vis pensummeny"}
      </button>
      <nav id="curriculum-navigation" aria-label="Pensum" className={mobileOpen ? "curriculum-navigation is-open" : "curriculum-navigation"}>
        <ul>
          <li><NavLink end to={base} onClick={close} className="curriculum-tool"><LayoutGrid size={17} aria-hidden="true" />Oversikt</NavLink></li>
        </ul>
        <p className="curriculum-nav-heading">Verktøy</p>
        <ul>
          <li><NavLink to={`${base}/formler`} onClick={close} className="curriculum-tool"><Sigma size={17} aria-hidden="true" />Formelsamling</NavLink></li>
          <li><NavLink to={`${base}/symboler`} onClick={close} className="curriculum-tool"><Pi size={17} aria-hidden="true" />Symboler</NavLink></li>
          <li><NavLink to={`${base}/begreper`} onClick={close} className="curriculum-tool"><BookOpen size={17} aria-hidden="true" />Begreper</NavLink></li>
        </ul>
        {errorMessage ? <p role="alert" className="curriculum-nav-message">{errorMessage}</p>
          : !workspace ? <p role="status" className="curriculum-nav-message">Laster temaer…</p>
          : units.length === 0 ? <p className="curriculum-nav-message">Ingen temaer ennå.</p>
          : groupUnitsByPart(units).map((part, index) => <div key={part.name ?? index} className="curriculum-part">
            {part.name && <p className="curriculum-nav-heading">{part.name}</p>}
            <ul>{part.units.map(unit => {
              const active = unit.id === activeUnit?.id;
              const done = progress.completed.has(unit.id);
              return <li key={unit.id}>
                <NavLink to={`${base}/pensum/${unit.id}`} onClick={close}
                  className={`curriculum-unit-link${active ? " is-active" : ""}${done ? " is-done" : ""}`}>
                  {unit.number && <span className="curriculum-unit-number">{unit.number}</span>}
                  <span className="curriculum-unit-title">{unit.title}</span>
                  {done && <Check className="curriculum-unit-check" size={15} aria-label="Gjennomgått" />}
                </NavLink>
                {active && unit.subtopicIds.length > 0 && <ul className="curriculum-subtopics">
                  {unit.topics.flatMap(topic => topic.subtopics.map(subtopic => <li key={subtopic.id}>
                    <NavLink to={`${base}/${topic.id}/undertema/${subtopic.id}`} onClick={close}>{subtopic.name}</NavLink>
                  </li>))}
                </ul>}
              </li>;
            })}</ul>
          </div>)}
      </nav>
    </aside>
    <div className="curriculum-content"><Outlet context={context} /></div>
  </div>;
}
