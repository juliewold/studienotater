import type { DatabaseNote } from "../../../services/notes/notesService";
import type { NoteSubtopicLink } from "../../../services/notes/noteSubtopicsService";
import type { DatabaseTopic, DatabaseSubtopic } from "../../../services/subjects/subjectStructureService";

export function groupNotes(notes: DatabaseNote[], topics: DatabaseTopic[], subtopics: DatabaseSubtopic[], links: NoteSubtopicLink[], query: string) {
  const normalize = (value: string) => value.normalize("NFC").trim().toLocaleLowerCase("nb");
  const filtered = [...new Map(notes.map(note => [note.id, note])).values()]
    .filter(note => normalize(note.title).includes(normalize(query)))
    .sort((a, b) => a.title.localeCompare(b.title, "nb"));
  const linked = new Map<string, Set<string>>();
  for (const link of links) {
    if (!linked.has(link.noteId)) linked.set(link.noteId, new Set());
    linked.get(link.noteId)!.add(link.subtopicId);
  }
  const assigned = new Set<string>();
  const order = (a: DatabaseTopic | DatabaseSubtopic, b: DatabaseTopic | DatabaseSubtopic) =>
    a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "nb");
  const groups = [...topics].sort(order).map(topic => ({
    ...topic,
    subtopics: subtopics.filter(subtopic => subtopic.topicId === topic.id).sort(order).map(subtopic => ({
      ...subtopic,
      notes: filtered.filter(note => {
        // The junction table is authoritative; retain legacy placement only when no links exist.
        const ids = linked.get(note.id) ?? new Set(note.subtopicId ? [note.subtopicId] : []);
        if (!ids.has(subtopic.id)) return false;
        assigned.add(note.id);
        return true;
      }),
    })).filter(subtopic => subtopic.notes.length > 0),
  })).filter(topic => topic.subtopics.length > 0);
  return { groups, unassigned: filtered.filter(note => !assigned.has(note.id)), count: filtered.length };
}
