import "../../../components/notes/NoteEditor/NoteEditor.css";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ExternalLink, FileText } from "lucide-react";
import { useCurriculum } from "../../../components/subjects/CurriculumLayout/curriculumContext";
import { ReadOnlyNote } from "../../../components/notes/ReadOnlyNote/ReadOnlyNote";
import { MathText } from "../../../components/common/MathText/MathText";
import { loadNoteSources } from "../../../services/subjects/curriculumWorkspaceService";
import {
  conceptsForUnit, exercisesForUnit, extractLearningBlocks, lectureNotesForUnit, notesForUnit,
  type CurriculumUnit, type LearningBlock, type LearningBlockKind, type NoteSource,
} from "../../../services/subjects/curriculumContent";
import { CurriculumPage, CurriculumStatus } from "./curriculumShared";
import { conceptTypeLabels, unitLabel } from "./curriculumHelpers";

const sections: { id: string; title: string; kind: LearningBlockKind }[] = [
  { id: "teori", title: "Kort teori", kind: "theory" },
  { id: "algoritmer", title: "Algoritmer og pseudokode", kind: "algorithm" },
  { id: "formler", title: "Kjøretider og formler", kind: "formula" },
  { id: "figurer", title: "Figurer", kind: "figure" },
  { id: "eksempler", title: "Eksempler", kind: "example" },
];

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`);

export function CurriculumUnitPage() {
  const { unitId = "" } = useParams();
  const { workspace, errorMessage } = useCurriculum();
  if (errorMessage) return <CurriculumPage label="Pensum" title="Tema"><CurriculumStatus alert>{errorMessage}</CurriculumStatus></CurriculumPage>;
  if (!workspace) return <CurriculumPage label="Pensum" title="Tema"><CurriculumStatus>Laster tema…</CurriculumStatus></CurriculumPage>;
  const unit = workspace.units.find(item => item.id === unitId);
  if (!unit) return <CurriculumPage label="Pensum" title="Fant ikke temaet"><p>Temaet finnes ikke i dette faget.</p></CurriculumPage>;
  return <UnitDetails key={unit.id} unit={unit} />;
}

function UnitDetails({ unit }: { unit: CurriculumUnit }) {
  const { subjectId, workspace, progress } = useCurriculum();
  const data = workspace!;
  const notes = useMemo(() => notesForUnit(unit, data.notes, data.noteLinks), [unit, data]);
  const concepts = useMemo(() => conceptsForUnit(unit, data.concepts), [unit, data]);
  const lectureNotes = lectureNotesForUnit(unit, data.pdfs);
  const exercises = exercisesForUnit(unit, data.pdfs, data.notes);
  const introductions = unit.topics.flatMap(topic => data.introductions[topic.id] ? [{ topic, text: data.introductions[topic.id] }] : []);
  const [sources, setSources] = useState<NoteSource[] | null>(notes.length ? null : []);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!notes.length) return;
    let cancelled = false;
    loadNoteSources(notes).then(result => { if (!cancelled) setSources(result); })
      .catch(error => {
        console.error("Kunne ikke hente notatinnhold:", error);
        if (!cancelled) setLoadError("Kunne ikke hente innholdet fra notatene.");
      });
    return () => { cancelled = true; };
  }, [notes]);

  const blocks = useMemo(() => sources ? extractLearningBlocks(sources) : [], [sources]);
  const visibleSections = sections.filter(section => section.kind === "theory"
    ? introductions.length > 0 || blocks.some(block => block.kind === "theory")
    : blocks.some(block => block.kind === section.kind));
  const done = progress.completed.has(unit.id);
  const navigation = [...visibleSections.map(({ id, title }) => ({ id, title })),
    ...(concepts.length ? [{ id: "begreper", title: "Begreper" }] : []),
    ...(unit.subtopicIds.length ? [{ id: "undertemaer", title: "Undertemaer" }] : []),
    { id: "ressurser", title: "Forelesninger og øvinger" }];

  return <CurriculumPage label={unitLabel(unit, Boolean(data.config))} title={unit.title} className="curriculum-unit-page">
    <div className="curriculum-unit-actions">
      {progress.canSave && <button type="button" className={done ? "curriculum-mark is-done" : "curriculum-mark"} aria-pressed={done}
        disabled={progress.pending.has(unit.id)} onClick={() => void progress.toggle(unit.id)}>
        <Check size={16} aria-hidden="true" />{done ? "Gjennomgått" : "Marker som gjennomgått"}
      </button>}
      {unit.supporting && <span className="curriculum-badge">Støttelitteratur</span>}
    </div>
    {progress.errorMessage && <CurriculumStatus alert>{progress.errorMessage}</CurriculumStatus>}
    {unit.readings && unit.readings.length > 0 && <div className="curriculum-readings">
      <span>Pensum</span><ul>{unit.readings.map(reading => <li key={reading}>{reading}</li>)}</ul>
    </div>}
    {unit.supporting && <p className="curriculum-note">Pensumheftet oppgir stoffet til denne forelesningen som støttelitteratur, ikke som eget eksamenspensum.</p>}

    <nav className="curriculum-on-page" aria-label="På denne siden"><span>På denne siden</span>
      <ul>{navigation.map(item => <li key={item.id}><a href={`#tema-${item.id}`} onClick={event => {
        event.preventDefault();
        document.getElementById(`tema-${item.id}`)?.scrollIntoView({ block: "start" });
      }}>{item.title}</a></li>)}</ul>
    </nav>

    {loadError ? <CurriculumStatus alert>{loadError}</CurriculumStatus>
      : !sources ? <CurriculumStatus>Henter innhold fra notatene…</CurriculumStatus>
      : notes.length === 0 && <p className="curriculum-note">Det finnes ingen notater for dette temaet i Studienotater ennå. Bruk forelesningene og øvingene under.</p>}

    {visibleSections.map(section => <Section key={section.id} id={section.id} title={section.title}>
      {section.kind === "theory" && introductions.map(({ topic, text }) => <p key={topic.id} className="curriculum-introduction"><MathText>{text}</MathText></p>)}
      <BlockGroups blocks={blocks.filter(block => block.kind === section.kind)} collapsible={section.kind === "example"} concepts={concepts} />
    </Section>)}

    {concepts.length > 0 && <Section id="begreper" title="Begreper">
      <ul className="curriculum-concept-grid">{concepts.map(concept => <li key={concept.id}>
        <Link className="curriculum-concept-card" to={`/concepts/${concept.slug}`}>
          <span className="curriculum-concept-type">{conceptTypeLabels[concept.type] ?? concept.type}</span>
          <strong><MathText>{concept.name}</MathText></strong>
          {concept.shortDefinition && <span className="curriculum-concept-definition"><MathText>{concept.shortDefinition}</MathText></span>}
        </Link>
      </li>)}</ul>
    </Section>}

    {unit.subtopicIds.length > 0 && <Section id="undertemaer" title="Undertemaer">
      {unit.topics.map(topic => <div key={topic.id} className="curriculum-subtopic-group">
        {unit.topics.length > 1 && <h3><Link to={`/fag/${subjectId}/tema/${topic.id}`}>{topic.name}</Link></h3>}
        <ul className="curriculum-chip-list">{topic.subtopics.map(subtopic => <li key={subtopic.id}>
          <Link to={`/fag/${subjectId}/tema/${topic.id}/undertema/${subtopic.id}`}>{subtopic.name}</Link>
        </li>)}</ul>
      </div>)}
    </Section>}

    <Section id="ressurser" title="Forelesninger og øvinger">
      <div className="curriculum-resource-grid">
        <ResourceList title="Forelesningsnotater" empty="Ingen forelesningsnotater er koblet til temaet ennå.">
          {lectureNotes.map(pdf => <li key={pdf.id}><Link to={`/fag/${subjectId}/pdfs/${pdf.id}`}><FileText size={16} aria-hidden="true" />{pdf.title}</Link></li>)}
          {unit.lectureSlides && <li><a href={unit.lectureSlides.url} target="_blank" rel="noreferrer"><ExternalLink size={16} aria-hidden="true" />{unit.lectureSlides.label} · Google Drive</a></li>}
        </ResourceList>
        <ResourceList title="Øvinger" empty="Ingen øving er knyttet til temaet.">
          {exercises.map(item => <li key={item.id}><Link to={item.kind === "pdf" ? `/fag/${subjectId}/pdfs/${item.id}` : `/fag/${subjectId}/notater/${item.slug}`}>
            <FileText size={16} aria-hidden="true" />{item.title}</Link></li>)}
          {unit.exercises?.map(exercise => <li key={exercise.url}><a href={exercise.url} target="_blank" rel="noreferrer"><ExternalLink size={16} aria-hidden="true" />{exercise.label} · Google Drive</a></li>)}
        </ResourceList>
        <ResourceList title="Notater" empty="Ingen notater er koblet til temaet ennå.">
          {notes.map(note => <li key={note.id}><Link to={`/fag/${note.subjectId}/notater/${note.slug}`}><FileText size={16} aria-hidden="true" />{note.title}</Link></li>)}
        </ResourceList>
      </div>
      <p className="curriculum-more-links"><Link to={`/fag/${subjectId}/eksamen`}>Øv med tidligere eksamener →</Link></p>
    </Section>
  </CurriculumPage>;
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section className="curriculum-section" id={`tema-${id}`} aria-labelledby={`tema-${id}-title`}>
    <h2 id={`tema-${id}-title`}>{title}</h2>{children}
  </section>;
}

function ResourceList({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const items = (Array.isArray(children) ? children.flat() : [children]).filter(Boolean);
  return <div className="curriculum-resource-card"><h3>{title}</h3>
    {items.length ? <ul>{items}</ul> : <p>{empty}</p>}
  </div>;
}

/** Complete source blocks, one reader per note, with a link back to the note. */
function BlockGroups({ blocks, collapsible, concepts }: { blocks: LearningBlock[]; collapsible: boolean; concepts: ReturnType<typeof conceptsForUnit> }) {
  const groups = new Map<string, LearningBlock[]>();
  for (const block of blocks) groups.set(block.note.id, [...(groups.get(block.note.id) ?? []), block]);
  return <>{Array.from(groups.values(), group => {
    const note = group[0].note;
    const html = group.map(block => block.kind === "algorithm" && block.title
      ? `<p><strong>${escapeHtml(block.title)}</strong></p>${block.html}` : block.html).join("");
    const source = <Link className="curriculum-source-link" to={`/fag/${note.subjectId}/notater/${note.slug}`}>Fra {note.title} →</Link>;
    return collapsible
      ? <details key={note.id} className="curriculum-block-group"><summary>{group.length} {group.length === 1 ? "eksempel" : "eksempler"} fra {note.title}</summary>
        <ReadOnlyNote content={html} concepts={concepts} />{source}</details>
      : <div key={note.id} className="curriculum-block-group"><ReadOnlyNote content={html} concepts={concepts} />{source}</div>;
  })}</>;
}
