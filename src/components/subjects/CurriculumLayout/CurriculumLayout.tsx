import { useState } from "react";
import { Link, Navigate, Outlet, useOutletContext, useParams } from "react-router-dom";
import { useSubjectStructure } from "../../../hooks/useSubjectStructure";
import { subjects } from "../../../data/subjects";
import "./CurriculumLayout.css";

type Structure = ReturnType<typeof useSubjectStructure>;
export function CurriculumLayout() {
  const { subjectId = "" } = useParams();
  return <SubjectCurriculum key={subjectId} subjectId={subjectId} />;
}
function SubjectCurriculum({ subjectId }: { subjectId: string }) {
  const { topicId, subtopicId } = useParams();
  const structure = useSubjectStructure(subjectId);
  const [mobileOpen, setMobileOpen] = useState(false);
  const subject = subjects.find(item => item.id === subjectId);
  return <div className="curriculum-layout">
    <aside className="curriculum-sidebar">
      <header><Link to={`/fag/${subjectId}`}>{subject?.code ?? subjectId.toUpperCase()}</Link><h2>Pensumoversikt</h2></header>
      <button className="curriculum-toggle" aria-expanded={mobileOpen} aria-controls="curriculum-navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? "Skjul temaer" : "Vis temaer"}</button>
      <nav id="curriculum-navigation" aria-label="Temaer og undertemaer" className={mobileOpen ? "curriculum-navigation is-open" : "curriculum-navigation"}>
        {structure.isLoading ? <p role="status">Laster temaer…</p> : structure.errorMessage ? <p role="alert">{structure.errorMessage}</p> : structure.topics.length === 0 ? <p>Ingen temaer ennå.</p> :
          <ul>{structure.topics.map(topic => <li key={topic.id}>
            <Link className={topic.id === topicId ? "curriculum-topic is-active" : "curriculum-topic"} aria-current={topic.id === topicId && !subtopicId ? "page" : undefined} to={`/fag/${subjectId}/tema/${topic.id}`} onClick={() => setMobileOpen(false)}>{topic.name}</Link>
            {topic.id === topicId && topic.subtopics.length > 0 && <ul className="curriculum-subtopics">{topic.subtopics.map(subtopic => <li key={subtopic.id}><Link aria-current={subtopic.id === subtopicId ? "page" : undefined} to={`/fag/${subjectId}/tema/${topic.id}/undertema/${subtopic.id}`} onClick={() => setMobileOpen(false)}>{subtopic.name}</Link></li>)}</ul>}
          </li>)}</ul>}
      </nav>
    </aside>
    <div className="curriculum-content"><Outlet context={structure} /></div>
  </div>;
}
export function CurriculumIndex() {
  const { subjectId } = useParams();
  const { topics, isLoading, errorMessage } = useOutletContext<Structure>();
  if (isLoading) return <main className="site-container curriculum-index"><p>Laster pensumoversikt…</p></main>;
  if (errorMessage || !topics.length) return <main className="site-container curriculum-index"><h1>Pensumoversikt</h1><p>{errorMessage || "Det er ikke lagt til temaer i dette faget ennå."}</p></main>;
  return <Navigate replace to={`/fag/${subjectId}/tema/${topics[0].id}`} />;
}
