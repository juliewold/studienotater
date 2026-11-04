import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ExternalLink, FileText, PlayCircle } from "lucide-react";
import { useCurriculum } from "../../../components/subjects/CurriculumLayout/curriculumContext";
import { MathText } from "../../../components/common/MathText/MathText";
import { hasLesson, loadLesson } from "../../../data/curriculum/lessons";
import type { Lesson } from "../../../data/curriculum/lessons/types";
import { currentNotesForUnit, exercisesForUnit, lectureNotesForUnit, type CurriculumUnit } from "../../../services/subjects/curriculumContent";
import { CurriculumPage, CurriculumStatus } from "./curriculumShared";
import { unitLabel } from "./curriculumHelpers";
import { LessonIntro, LessonSections, LessonSources } from "./LessonView";

// The player is its own chunk, loaded the first time someone starts a lecture.
const LecturePlayer = lazy(() => import("./lecture/LecturePlayer"));

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
  const linkedNotes = useMemo(() => currentNotesForUnit(unit, data.notes, data.noteLinks), [unit, data]);
  const lectureNotes = lectureNotesForUnit(unit, data.pdfs);
  const exercises = exercisesForUnit(unit, data.pdfs, data.notes);
  const introductions = unit.topics.flatMap(topic => data.introductions[topic.id] ? [{ topic, text: data.introductions[topic.id] }] : []);
  // Only reviewed lessons are shown as learning content; raw note content is linked, never inlined.
  const expectsLesson = hasLesson(subjectId, unit.id);
  // The result is kept with the unit it was loaded for, so a lesson or an error from another unit never shows.
  const [loaded, setLoaded] = useState<{ key: string; lesson?: Lesson; error?: string }>();
  const lessonKey = `${subjectId}/${unit.id}`;
  const lesson = loaded?.key === lessonKey ? loaded.lesson : undefined;
  const lessonError = loaded?.key === lessonKey ? loaded.error ?? "" : "";
  const [lectureOpen, setLectureOpen] = useState(false);
  const playButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!expectsLesson) return;
    let cancelled = false;
    loadLesson(subjectId, unit.id).then(result => { if (!cancelled) setLoaded({ key: lessonKey, lesson: result }); })
      .catch(error => {
        console.error("Kunne ikke laste læringsnotatet:", error);
        // A failed lesson import is remembered by the browser until the page reloads, so a reload is the retry.
        if (!cancelled) setLoaded({ key: lessonKey, error: "Kunne ikke laste læringsnotatet. Prøv igjen for å laste siden på nytt." });
      });
    return () => { cancelled = true; };
  }, [expectsLesson, subjectId, unit.id, lessonKey]);

  // A lesson names its own concepts and current notes; the knowledge base links concepts too broadly.
  const concepts = lesson ? lesson.concepts.flatMap(slug => data.concepts.find(concept => concept.slug === slug) ?? []) : [];
  const notes = lesson ? lesson.notes.map(note => data.notes.find(item => item.slug === note.slug) ?? { id: note.slug, slug: note.slug, title: note.label, subjectId })
    : linkedNotes;
  const done = progress.completed.has(unit.id);
  const navigation = [...(lesson?.sections.map(({ id, title }) => ({ id, title })) ?? []),
    ...(!lesson && introductions.length ? [{ id: "introduksjon", title: "Introduksjon" }] : []),
    { id: "begreper", title: "Begreper" },
    { id: "ressurser", title: "Forelesninger og øvinger" }];

  return <CurriculumPage label={unitLabel(unit, Boolean(data.config))} title={unit.title} className="curriculum-unit-page">
    <div className="curriculum-unit-actions">
      {progress.canSave && <button type="button" className={done ? "curriculum-mark is-done" : "curriculum-mark"} aria-pressed={done}
        disabled={progress.pending.has(unit.id)} onClick={() => void progress.toggle(unit.id)}>
        <Check size={16} aria-hidden="true" />{done ? "Gjennomgått" : "Marker som gjennomgått"}
      </button>}
      {lesson && <button ref={playButton} type="button" className="curriculum-play" onClick={() => setLectureOpen(true)}>
        <PlayCircle size={16} aria-hidden="true" />Spill av forelesning
      </button>}
      {unit.supporting && <span className="curriculum-badge">Støttelitteratur</span>}
    </div>
    {lesson && lectureOpen && <Suspense fallback={null}>
      <LecturePlayer lesson={lesson} title={unit.title} label={unitLabel(unit, Boolean(data.config))} onClose={() => { setLectureOpen(false); playButton.current?.focus(); }} />
    </Suspense>}
    {progress.errorMessage && <CurriculumStatus alert>{progress.errorMessage}</CurriculumStatus>}
    {unit.readings && unit.readings.length > 0 && <div className="curriculum-readings">
      <span>Pensum</span><ul>{unit.readings.map(reading => <li key={reading}>{reading}</li>)}</ul>
    </div>}
    {unit.supporting && <p className="curriculum-note">Pensumheftet oppgir stoffet til denne forelesningen som støttelitteratur, ikke som eget eksamenspensum.</p>}

    {expectsLesson && !lesson ? <>
      <CurriculumStatus alert={Boolean(lessonError)}>{lessonError || "Laster læringsnotat…"}</CurriculumStatus>
      {lessonError && <button type="button" className="curriculum-retry" onClick={() => window.location.reload()}>Prøv igjen</button>}
    </>
      : lesson ? <LessonIntro lesson={lesson} />
      : <p className="curriculum-note lesson-missing">Læringsnotatet for dette temaet er ikke skrevet ennå. Bruk forelesningene, øvingene og notatene under for fullstendige forklaringer.</p>}

    {(lesson || !expectsLesson) && <nav className="curriculum-on-page" aria-label="På denne siden"><span>På denne siden</span>
      <ul>{navigation.map(item => <li key={item.id}><a href={`#tema-${item.id}`} onClick={event => {
        event.preventDefault();
        const target = document.getElementById(`tema-${item.id}`);
        if (target instanceof HTMLDetailsElement) target.open = true;
        target?.scrollIntoView({ block: "start" });
      }}>{item.title}</a></li>)}</ul>
    </nav>}

    {lesson && <LessonSections lesson={lesson} />}
    {!lesson && !expectsLesson && introductions.length > 0 && <Section id="introduksjon" title="Introduksjon">
      {introductions.map(({ topic, text }) => <p key={topic.id} className="curriculum-introduction"><MathText>{text}</MathText></p>)}
    </Section>}

    <Section id="begreper" title={"Begreper"}>
      {concepts.length > 0
        ? <>
          <p className="curriculum-section-intro">Begrepene i denne forelesningen. Alle begreper finner du under <Link to={`/fag/${subjectId}/tema/begreper`}>Begreper</Link>.</p>
          <ul className="curriculum-chip-list">{concepts.map(concept => <li key={concept.id}><Link to={`/concepts/${concept.slug}`}><MathText>{concept.name}</MathText></Link></li>)}</ul>
        </>
        : <p className="curriculum-section-intro">Begrepene for dette temaet velges ut når læringsnotatet skrives. Til da finner du alle begreper under <Link to={`/fag/${subjectId}/tema/begreper`}>Begreper</Link>.</p>}
    </Section>

    <Section id="ressurser" title="Forelesninger og øvinger">
      <p className="curriculum-section-intro">Åpne fullstendige forklaringer, lysark og løsningsforslag.</p>
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
      {lesson && <LessonSources lesson={lesson} />}
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
