import { createRoot } from 'react-dom/client';
import { EditableNote } from '../src/components/notes/EditableNote/EditableNote';
import '../src/index.css';
import '../src/pages/notes/NotePage/NotePage.css';
import '../src/components/layout/Navbar/Navbar.css';
import type { DatabaseNote } from '../src/services/notes/notesService';
// Isolated fixture: no database reads, writes or AI requests.
window.fetch = async () => Response.json([]);
const note = { id: 'preview', subjectId: 'test', slug: 'preview', title: 'Forventning og varians', description: 'Et overblikk over sentrale begreper i sannsynlighetsregning.', content: '<h2>Forventning</h2><p>Forventningen beskriver gjennomsnittet vi får over mange gjentakelser. Bruk definisjonen til å se sammenhengen mellom verdier og sannsynligheter.</p><h3>Diskrete variabler</h3><p>Hver verdi vektes med sannsynligheten sin.</p><div data-type="block-math" data-latex="E(X) = \\sum_x x P(X=x)"></div>' + Array.from({length: 5}, (_, i) => `<h2>${i === 0 ? 'Forventning' : 'Egenskap ' + i}</h2><p>${'Når du studerer, knytt formelen til et konkret eksempel. '.repeat(12)}</p><blockquote><p>Hva forteller resultatet oss?</p></blockquote>`).join('') } as DatabaseNote;
createRoot(document.getElementById('root')!).render(<><nav className="navbar"><a className="logo"><span className="logo-mark"/><span>Studienotater</span></a><span>Fag · Profil</span></nav><main className="note-page"><div className="note-page-topbar">← Tilbake</div><nav className="note-navigation note-navigation-sticky">← Forrige · Neste →</nav><EditableNote note={note} subjectCode="TMA4240" isAdmin resourceId="preview" onNoteUpdated={() => {}} /></main></>);
