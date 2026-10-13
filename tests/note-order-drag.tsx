import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { AuthContext } from '../src/context/AuthContext/AuthContext';
import { SortableNotes } from '../src/components/notes/SortableNotes/SortableNotes';
import type { DatabaseNote } from '../src/services/notes/notesService';
const notes = ['a','b'].map((id,sortOrder) => ({id,title:id,subjectId:'subject',folderId:null,sortOrder}) as DatabaseNote);
const host = document.createElement('div');document.body.append(host);
const root = createRoot(host);
let writes = 0;
window.fetch = async (input, options) => {
  const body = JSON.parse(String(options?.body));
  if (!String(input).endsWith('/rpc/reorder_notes') || body.p_folder_id !== null || body.p_subject_id !== 'subject' || body.p_note_ids.join(',') !== 'b,a') throw Error('Wrong drag save');
  writes++;
  return new Response(null, {status:204});
};
try {
  let done!: (ids: string) => void;
  const saved = new Promise<string>(resolve => { done = resolve; });
  flushSync(() => root.render(<AuthContext.Provider value={{user:null,role:'admin',isAdmin:true,isLoading:false,signOut:async()=>{}}}>
    <SortableNotes subjectId="subject" folderId={null} notes={notes} enabled className="test-notes" onReordered={items=>done(items.map(n=>n.id).join(','))}>
      {note=><div style={{height:60,paddingLeft:40}}>{note.title}</div>}
    </SortableNotes>
  </AuthContext.Provider>));
  const handles = host.querySelectorAll<HTMLButtonElement>('.note-drag-handle');
  // Synthetic pointers do not register with the native capture API. The event
  // path, hit testing, drop target, save service and resulting order are real.
  handles[1].setPointerCapture = () => {};
  const target = host.querySelector<HTMLElement>('[data-note-id="a"]')!.getBoundingClientRect();
  const fire = (type: string) => flushSync(() => handles[1].dispatchEvent(new PointerEvent(type, {
    bubbles:true,button:0,pointerId:1,clientX:target.x+60,clientY:target.y+25,
  })));
  fire('pointerdown'); fire('pointermove'); fire('pointerup');
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<string>((_, reject) => { timer = setTimeout(()=>reject(Error('Drag did not save')),3000); });
  const ids = await Promise.race([saved, timeout]);clearTimeout(timer!);
  if (ids !== 'b,a' || writes !== 1) throw Error('Incorrect or duplicate drag save');
  document.querySelector('#results')!.textContent = 'PASS: pointer drag hits target and saves the complete unfiled order once';
} catch (error) {
  document.querySelector('#results')!.textContent = 'FAIL: ' + String(error);
} finally { root.unmount(); host.remove(); }
