import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { PrivateImage } from '../src/components/notes/NoteEditor/PrivateImage';
import { PrivateNoteHtml } from '../src/components/notes/PrivateNoteHtml';
import { ReadOnlyNote } from '../src/components/notes/ReadOnlyNote/ReadOnlyNote';
import { PrivateFileLink } from '../src/components/media/PrivateFileLink';
import { PdfViewerPage } from '../src/pages/pdfs/PdfViewerPage/PdfViewerPage';
import { ExamViewerPage } from '../src/pages/exams/ExamViewerPage/ExamViewerPage';
import { getNoteImagePath, noteImageReference } from '../src/services/media/privateStorage';
import { storeNoteImage, prepareNoteImport } from '../src/components/notes/NoteEditor/noteImport';
import { supabase } from '../src/lib/supabase';

const results: string[] = [];
const check = (value: unknown, name: string) => { if (!value) throw Error(name); results.push(name); };
const until = async (test: () => unknown) => { for(let i=0;i<200;i++){ if(test())return;await new Promise(r=>setTimeout(r,20)); }throw Error('Timeout'); };
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const pdf=URL.createObjectURL(new Blob(['%PDF-1.4\n%%EOF'],{type:'application/pdf'}));
const user={id:'test-admin',is_anonymous:false};
let loggedIn=true;
const listeners=new Set<(event: string)=>void>();
supabase.auth.getSession=async()=>({ data:{session:loggedIn?{user,access_token:'isolated'}:null},error:null }) as Awaited<ReturnType<typeof supabase.auth.getSession>>;
supabase.auth.getUser=async()=>({data:{user:loggedIn?user:null},error:null}) as Awaited<ReturnType<typeof supabase.auth.getUser>>;
supabase.auth.onAuthStateChange=((listener: (event: string)=>void)=>{listeners.add(listener);return {data:{subscription:{unsubscribe:()=>listeners.delete(listener)}}};}) as typeof supabase.auth.onAuthStateChange;
let uploads=0;let signatures=0;
supabase.storage.from=((bucket: string)=>({
  upload:async()=>{uploads++;return {data:{path:'stored'},error:null};},
  remove:async()=>({data:[],error:null}),
  createSignedUrl:async()=>{signatures++;return {data:loggedIn?{signedUrl:bucket==='note-images'?png:pdf}:null,error:loggedIn?null:{message:'denied'}};},
})) as typeof supabase.storage.from;
// No real Data API or LLM calls. Only synthetic rows, never production content.
window.fetch=async(input)=>{
 const table=new URL(String(input)).pathname.split('/').at(-1);
 if(table==='pdfs')return Response.json([{id:'pdf',subject_id:'tma4412',title:'Private PDF',file_path:'shared/test.pdf',summary_note_id:null}]);
 if(table==='exams')return Response.json([{id:'exam',subject_id:'tma4412',title:'Private exam',semester:'Vår',year:2026,relevant_tasks:[],exam_file_path:'shared/exam.pdf',solution_file_path:null,my_solution_file_path:null}]);
 return Response.json([]);
};
try {
 const old=`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/note-images/admin/old.png`;
 const content=`<p>Old note</p><img src="${old}" alt="Legacy"><img src="${noteImageReference('admin/new.png')}" alt="New">`;
 const root=createRoot(document.querySelector('#root')!);
 root.render(<><ReadOnlyNote content={content}/><PrivateNoteHtml html={content} className="legacy-popover"/><PrivateFileLink path="shared/test.pdf">Private PDF link</PrivateFileLink></>);
 await until(()=>document.querySelectorAll('#root img[src]').length===4&&document.querySelector('#root a[href^="blob:"]'));
 check([...document.querySelectorAll<HTMLImageElement>('#root img')].every(img=>img.src===png),'Old/new images in notes and concept snippets use authorized URLs');
 const editor=new Editor({element:document.querySelector('#editor')!,extensions:[StarterKit,PrivateImage.configure({resize:{enabled:true}})],content});
 await until(()=>document.querySelectorAll('#editor img[src]').length===2);
 check(editor.getHTML().includes(old)&&!editor.getHTML().includes(png)&&!JSON.stringify(editor.getJSON()).includes('token='),'Reading never rewrites document HTML/JSON or saves access credentials');
 const imageNode=editor.state.doc.content.content.find(n=>n.type.name==='image')!;
 check(!!imageNode&&!!document.querySelector('#editor [data-resize-container]'),'Editable images retain native resize view');
 editor.commands.setTextSelection(1);editor.commands.insertContent('<p>Edited</p>');
 check(editor.getHTML().includes(old)&&editor.getHTML().includes('supabase-storage:'),'Editing preserves stable image references');
 const copied=await prepareNoteImport(`<img src="${old}">`,[],async()=>{throw Error('duplicate upload');});
 check(copied.includes('supabase-storage://note-images/admin/old.png')&&uploads===0,'Copying legacy images reuses objects without uploading');
 const stored=await storeNoteImage(new File(['image'],'new.png',{type:'image/png'}));
 check(uploads===1&&getNoteImagePath(stored.url)===stored.path&&!stored.url.includes('token='),'Uploads return permanent references, not signed URLs');
 const pdfRoot=createRoot(document.querySelector('#pdf')!);
 pdfRoot.render(<MemoryRouter initialEntries={['/fag/tma4412/pdfs/pdf']}><Routes><Route path="/fag/:subjectId/pdfs/:pdfId" element={<PdfViewerPage/>}/></Routes></MemoryRouter>);
 const examRoot=createRoot(document.querySelector('#exam')!);
 examRoot.render(<MemoryRouter initialEntries={['/fag/tma4412/eksamen/exam/exam']}><Routes><Route path="/fag/:subjectId/eksamen/:examId/:fileId" element={<ExamViewerPage/>}/></Routes></MemoryRouter>);
 await until(()=>document.querySelector('#pdf object[data^="blob:"]')&&document.querySelector('#exam iframe[src^="blob:"]'));
 check(true,'PDF and exam viewers load authorized files');
 loggedIn=false;listeners.forEach(listener=>listener('SIGNED_OUT'));
 await until(()=>!document.querySelector('#root img[src]')&&!document.querySelector('#editor img[src]')&&!document.querySelector('#pdf object')&&!document.querySelector('#exam iframe'));
 const before=signatures;
 const anon=await import('../src/services/media/privateStorage');
 try{await anon.createPrivateStorageUrl('pdfs','shared/test.pdf');throw Error('anonymous accepted');}catch(error){check(String(error).includes('Logg inn'),'Anonymous users cannot request a signed URL');}
 check(signatures===before,'Anonymous request never reaches signing endpoint');
 check(!document.querySelector('#root a[href^="blob:"]'),'Sign-out clears images, PDF viewers and links');
 editor.destroy();pdfRoot.unmount();examRoot.unmount();root.unmount();URL.revokeObjectURL(pdf);
 document.querySelector('#results')!.textContent=`${results.length}/${results.length} passed\n${results.map(r=>'PASS: '+r).join('\n')}`;
}catch(error){document.querySelector('#results')!.textContent=`FAIL: ${String(error)}\n${results.join('\n')}`;throw error;}
