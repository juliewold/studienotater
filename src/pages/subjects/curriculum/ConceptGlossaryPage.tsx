import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ConceptType } from "../../../data/concepts/types";
import { useCurriculum } from "../../../components/subjects/CurriculumLayout/curriculumContext";
import { MathText } from "../../../components/common/MathText/MathText";
import { matchesSearch, type CurriculumUnit, type WorkspaceConcept } from "../../../services/subjects/curriculumContent";
import { CurriculumPage, CurriculumStatus, SearchField } from "./curriculumShared";
import { conceptTypeLabels } from "./curriculumHelpers";
import { loadSubjectLessons } from "../../../data/curriculum/lessons";

type Filter = "all" | ConceptType;

export function ConceptGlossaryPage() {
  const { subjectId, workspace, errorMessage } = useCurriculum();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Filter>("all");
  const [order, setOrder] = useState<"unit" | "alphabet">("alphabet");
  // Placement comes from the concept lists in reviewed lessons; the stored
  // subtopic links are too broad to say which lecture a concept belongs to.
  const [lessonConcepts, setLessonConcepts] = useState<Map<string, string[]>>(new Map());
  useEffect(() => {
    let cancelled = false;
    loadSubjectLessons(subjectId).then(lessons => {
      if (!cancelled) setLessonConcepts(new Map(lessons.map(lesson => [lesson.unitId, lesson.concepts])));
    }).catch(error => console.error("Kunne ikke laste læringsnotatene:", error));
    return () => { cancelled = true; };
  }, [subjectId]);
  const unitsByConcept = useMemo(() => {
    const result = new Map<string, CurriculumUnit[]>();
    for (const concept of workspace?.concepts ?? []) {
      result.set(concept.id, (workspace?.units ?? []).filter(unit => lessonConcepts.get(unit.id)?.includes(concept.slug)));
    }
    return result;
  }, [workspace, lessonConcepts]);
  if (errorMessage) return <CurriculumPage label="Verktøy" title="Begreper"><CurriculumStatus alert>{errorMessage}</CurriculumStatus></CurriculumPage>;
  if (!workspace) return <CurriculumPage label="Verktøy" title="Begreper"><CurriculumStatus>Laster begreper…</CurriculumStatus></CurriculumPage>;

  const types = (Object.keys(conceptTypeLabels) as ConceptType[]).filter(item => workspace.concepts.some(concept => concept.type === item));
  const visible = workspace.concepts.filter(concept => (type === "all" || concept.type === type) &&
    matchesSearch(query, concept.name, concept.shortDefinition, ...(unitsByConcept.get(concept.id) ?? []).map(unit => unit.title)));
  const groups: { key: string; unit?: CurriculumUnit; concepts: WorkspaceConcept[] }[] = order === "alphabet"
    ? [{ key: "alle", concepts: visible }]
    : [...workspace.units.map(unit => ({ key: unit.id, unit,
      concepts: visible.filter(concept => unitsByConcept.get(concept.id)?.[0]?.id === unit.id) })),
      { key: "uplassert", concepts: visible.filter(concept => !unitsByConcept.get(concept.id)?.length) }];
  const card = (concept: WorkspaceConcept) => {
    const units = unitsByConcept.get(concept.id) ?? [];
    return <li key={concept.id}><Link className="curriculum-concept-card" to={`/concepts/${concept.slug}`}>
      <span className="curriculum-concept-type">{conceptTypeLabels[concept.type] ?? concept.type}</span>
      <strong><MathText>{concept.name}</MathText></strong>
      {concept.shortDefinition && <span className="curriculum-concept-definition"><MathText>{concept.shortDefinition}</MathText></span>}
      {order === "alphabet" && units.length > 0 && <span className="curriculum-concept-units">{units.map(unit => unit.number ?? unit.title).join(" · ")}</span>}
    </Link></li>;
  };

  return <CurriculumPage label="Verktøy" title="Begreper" className="curriculum-glossary">
    <p className="curriculum-lead">{workspace.concepts.length} begreper fra kunnskapsbasen. Forelesningsnummeret viser hvor et begrep hører hjemme i pensum.</p>
    <SearchField value={query} onChange={setQuery} label="Søk i begreper" />
    <div className="curriculum-filters">
      <div role="group" aria-label="Type">
        {(["all", ...types] as Filter[]).map(item => <button key={item} type="button" aria-pressed={type === item} onClick={() => setType(item)}>
          {item === "all" ? "Alle" : conceptTypeLabels[item]}
        </button>)}
      </div>
      <div role="group" aria-label="Sortering">
        <button type="button" aria-pressed={order === "alphabet"} onClick={() => setOrder("alphabet")}>A–Å</button>
        <button type="button" aria-pressed={order === "unit"} onClick={() => setOrder("unit")}>Etter forelesning</button>
      </div>
    </div>
    {workspace.concepts.length === 0 ? <p className="curriculum-note">Ingen begreper er koblet til undertemaene i dette faget ennå.</p>
      : visible.length === 0 ? <p className="curriculum-note">Ingen begreper passer søket.</p>
      : groups.filter(group => group.concepts.length > 0).map(group => <section key={group.key} className="curriculum-section">
        {group.unit ? <h2 className="curriculum-numbered-heading">
          {group.unit.number && <span className="curriculum-number">{group.unit.number}</span>}
          <Link to={`/fag/${subjectId}/tema/pensum/${group.unit.id}`}>{group.unit.title}</Link>
        </h2> : order === "unit" && <><h2>Ikke plassert ennå</h2>
          <p className="curriculum-section-intro">Begreper plasseres når læringsnotatet for forelesningen skrives.</p></>}
        <ul className="curriculum-concept-grid">{group.concepts.map(card)}</ul>
      </section>)}
  </CurriculumPage>;
}
