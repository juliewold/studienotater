import { useEffect, useState, type ReactNode } from "react";
import type { DatabaseNote } from "../../../services/notes/notesService";
import { getSubtopicLinksForNotes, type NoteSubtopicLink } from "../../../services/notes/noteSubtopicsService";
import { getTopicsBySubject, getAllSubtopicsBySubject, type DatabaseTopic, type DatabaseSubtopic } from "../../../services/subjects/subjectStructureService";
import { groupNotes } from "./groupNotes";

export function StructuredNotes({ subjectId, notes, query, renderNote }: {
  subjectId: string; notes: DatabaseNote[]; query: string; renderNote: (note: DatabaseNote) => ReactNode;
}) {
  const [structure, setStructure] = useState<{ topics: DatabaseTopic[]; subtopics: DatabaseSubtopic[]; links: NoteSubtopicLink[] } | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  useEffect(() => {
    let active = true;
    Promise.all([getTopicsBySubject(subjectId), getAllSubtopicsBySubject(subjectId), getSubtopicLinksForNotes(notes.map(note => note.id))])
      .then(([topics, subtopics, links]) => { if (active) { setStructure({ topics, subtopics, links }); setError(false); } })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [subjectId, notes, retry]);
  const { groups, unassigned, count } = groupNotes(notes, structure?.topics ?? [], structure?.subtopics ?? [], structure?.links ?? [], query);
  return <section className="structured-notes" aria-label="Notater etter fagstruktur">
    {error ? <p role="alert">Kunne ikke hente fagstrukturen. Notatene vises som en liste. <button type="button" onClick={() => setRetry(value => value + 1)}>Prøv igjen</button></p> : !structure ? <p>Laster fagstruktur …</p> : null}
    <p role="status">{count} {count === 1 ? "notat" : "notater"}{query.trim() ? " funnet" : ""}</p>
    {count === 0 && <p>{query.trim() ? "Ingen notater matcher søket." : "Ingen notater er lagt til ennå."}</p>}
    {error || !structure ? <div className="notes-list">{groupNotes(notes, [], [], [], query).unassigned.map(renderNote)}</div> : <>
      {groups.map(topic => {
        const key = `${query.trim() ? "search" : "browse"}:${topic.id}`;
        const open = expanded[key] ?? Boolean(query.trim());
        const uniqueCount = new Set(topic.subtopics.flatMap(subtopic => subtopic.notes.map(note => note.id))).size;
        return <section className="notes-topic" key={topic.id}>
          <h2><button type="button" aria-expanded={open} aria-controls={`notes-topic-${topic.id}`} onClick={() => setExpanded(value => ({ ...value, [key]: !open }))}>
            <span aria-hidden="true">{open ? "▾" : "▸"}</span> {topic.name} <span className="notes-topic-count">{uniqueCount} {uniqueCount === 1 ? "notat" : "notater"}</span>
          </button></h2>
          <div id={`notes-topic-${topic.id}`} hidden={!open}>
            {topic.subtopics.map(subtopic => <section className="notes-subtopic" key={subtopic.id}>
              <h3>{subtopic.name}</h3><div className="notes-list">{subtopic.notes.map(renderNote)}</div>
            </section>)}
          </div>
        </section>;
      })}
      {unassigned.length > 0 && <section><h2>Uten undertema</h2><div className="notes-list">{unassigned.map(renderNote)}</div></section>}
    </>}
  </section>;
}
