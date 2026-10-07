import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { EditableNote } from '../src/components/notes/EditableNote/EditableNote';
import type { DatabaseNote } from '../src/services/notes/notesService';
import '../src/index.css';
import '../src/pages/notes/NotePage/NotePage.css';
import '../src/components/layout/Navbar/Navbar.css';

const initialNote: DatabaseNote = {
  id: 'preview', subjectId: 'test', slug: 'preview', title: 'Forventning og varians',
  description: 'Et overblikk over sentrale begreper i sannsynlighetsregning.',
  content: '<h2>Forventning</h2><p>Forventningen beskriver gjennomsnittet over mange gjentakelser.</p><h2>Varians</h2><p>Variansen beskriver spredningen rundt forventningen.</p>',
  folderId: null, subtopicId: null, subtopicName: null, topicId: null, topicName: null,
  contentJson: null, createdAt: '',
};
let savedRow = { id: 'preview', subject_id: 'test', slug: 'preview', title: initialNote.title, description: initialNote.description, content: initialNote.content, content_json: null };
let links: { subtopic_id: string }[] = [];
let failSave = false;
// Every request is intercepted. No database, upload or AI request leaves this fixture.
window.fetch = async (input, options) => {
  const request = input instanceof Request ? input : new Request(String(input), options);
  const url = new URL(request.url);
  const method = options?.method ?? request.method;
  const body = options?.body ? String(options.body) : method !== 'GET' ? await request.text() : '';
  if (url.pathname.endsWith('/notes') && method === 'PATCH') {
    if (failSave) return Response.json({ message: 'Simulert lagringsfeil' }, { status: 500 });
    savedRow = { ...savedRow, ...JSON.parse(body) };
    return Response.json(savedRow);
  }
  if (url.pathname.endsWith('/topics')) return Response.json([{ id: 'topic', subject_id: 'test', name: 'Sannsynlighet', sort_order: 1 }]);
  if (url.pathname.endsWith('/subtopics')) return Response.json([
    { id: 'expectation', topic_id: 'topic', name: 'Forventning', sort_order: 1 },
    { id: 'variance', topic_id: 'topic', name: 'Varians', sort_order: 2 },
  ]);
  if (url.pathname.endsWith('/note_subtopics')) {
    if (method === 'DELETE') links = [];
    if (method === 'POST') links = JSON.parse(body);
    return Response.json(links);
  }
  if (url.pathname.endsWith('/notes')) return Response.json(savedRow);
  return Response.json([]);
};
export function Preview() {
  const [note, setNote] = useState(initialNote);
  return <>
    <nav className="navbar"><a className="logo"><span className="logo-mark"/><span>Studienotater</span></a><span>Fag · Profil</span></nav>
    <main className="note-page">
      <label><input type="checkbox" onChange={event => { failSave = event.target.checked; }}/> Simuler lagringsfeil</label>
      <EditableNote note={note} subjectCode="TMA4240" isAdmin onNoteUpdated={setNote}/>
      <output aria-label="Lagret tittel">{note.title}</output>
    </main>
  </>;
}
createRoot(document.getElementById('root')!).render(<Preview/>);
