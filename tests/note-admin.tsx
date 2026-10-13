import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../src/context/AuthContext/AuthContext';
import { NoteCard } from '../src/components/notes/NoteCard/NoteCard';
import type { DatabaseNote } from '../src/services/notes/notesService';
const note = { id:'note',subjectId:'subject',folderId:'folder',slug:'shared',title:'Shared note',description:'Read this' } as DatabaseNote;
for (const isAdmin of [false, true]) {
  const element = document.createElement('div');
  document.body.append(element);
  const root = createRoot(element);
  flushSync(() => root.render(<AuthContext.Provider value={{user:null,role:isAdmin?'admin':'user',isAdmin,isLoading:false,signOut:async()=>{}}}>
    <MemoryRouter><NoteCard note={note} subjectId="subject" progress={{completed:true,rating:3}}
      actions={<button>Legg til i favoritter</button>} /></MemoryRouter>
  </AuthContext.Provider>));
  const valid = element.querySelectorAll('.note-menu-button').length === (isAdmin ? 1 : 0) &&
    element.querySelector('a')?.getAttribute('href') === '/fag/subject/notater/shared' &&
    element.textContent?.includes('Lest') && element.textContent.includes('Legg til i favoritter');
  root.unmount();
  element.remove();
  document.querySelector('#results')!.textContent += `${valid?'PASS':'FAIL'}: ${isAdmin?'Admin menu':'Reader without edit menu'}, note link, favorites and read status\n`;
}
