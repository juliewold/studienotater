import { noteImageReference } from "../src/services/media/privateStorage";
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Mathematics } from '@tiptap/extension-mathematics';
import { TableKit } from '@tiptap/extension-table';
import { prepareNoteImport, readImportFile, importIntoEditor } from '../src/components/notes/NoteEditor/noteImport';
import { NoteEditor } from '../src/components/notes/NoteEditor/NoteEditor';
import { supabase } from '../src/lib/supabase';
const results: string[] = [];
const check = (ok: unknown, name: string) => { if (!ok) throw Error(name); results.push(name); };
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const html = `<h2>Studienotat</h2><p>Før <strong>viktig</strong> \\(\\mu_r=E[X^r]\\)</p><img src="${png}"><ul><li>Mellom</li></ul><img src="${png}"><p>Etter</p><table><tr><td>Celle</td></tr></table><pre><code>const x = 1;</code></pre><div class="katex-display"><span class="katex"><math><annotation encoding="application/x-tex">\\sum_{i=1}^n i</annotation></math><span>GJENTATT</span></span></div>`;
const extensions = () => [StarterKit, Image, Mathematics, TableKit];
const editor = new Editor({ extensions: extensions(), content: '<p>Original</p>' });
let count = 0;
const upload = async () => ({url: `https://example.com/permanent/${++count}.png`, path: `test/${count}`});
await importIntoEditor(editor, async () => html, [], upload);
const saved = editor.getHTML();
const json = JSON.stringify(editor.getJSON());
check(count === 2 && saved.includes('/1.png') && saved.includes('/2.png'), 'Flere bilder lagres permanent');
check(saved.indexOf('/1.png') < saved.indexOf('Mellom') && saved.indexOf('Mellom') < saved.indexOf('/2.png'), 'Bilder beholder plassering');
check(saved.includes('<h2>') && saved.includes('<table') && saved.includes('<ul>') && saved.includes('<pre>') && saved.includes('<strong>'), 'Dokumentstruktur bevares');
check(json.includes('inlineMath') && json.includes('blockMath') && json.includes('\\\\mu_r=E[X^r]') && !saved.includes('GJENTATT'), 'Original LaTeX bevares uten rendret duplikat');
const reopened = new Editor({extensions: extensions(), content: saved});
check(JSON.stringify(reopened.getJSON()) === json, 'HTML lagres og åpnes igjen uten innholdstap');
editor.commands.undo(); check(editor.getText() === 'Original', 'Én undo gjenoppretter originalen');
const original = editor.getHTML();
try { await importIntoEditor(editor, async () => '<img src="https://private/image">', [], upload); throw Error('Forventet feil'); }
catch (e) { check(String(e).includes('Bildedata mangler') && editor.getHTML() === original && editor.isEditable, 'Manglende bildedata avbryter uten notatendring'); }
try { await importIntoEditor(editor, async () => html, [], async () => {throw Error('Upload failed');}); }
catch { check(editor.getHTML() === original && editor.isEditable, 'Opplastingsfeil bevarer dokumentet'); }
const docx = new File([await (await fetch('./fixtures/import-note.docx')).arrayBuffer()], 'notat.docx');
const converted = await readImportFile(docx);
const imported = await prepareNoteImport(converted, [], async () => (await upload()).url);
check((imported.match(/<img/g) ?? []).length === 2 && imported.indexOf('Etter bilde 1') < imported.lastIndexOf('<img'), 'Ekte DOCX med to innebygde bilder beholder rekkefølgen');
const permanent = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/note-images/test/existing.png`;
const copied = await prepareNoteImport(`<p>Eksisterende</p><img src="${permanent}">`, [], async () => { throw Error('Skal ikke laste opp på nytt'); });
check(copied.includes(noteImageReference('test/existing.png')), 'Kopiering av eksisterende permanent notatbilde bevares');
const safe = await prepareNoteImport('<script>bad()</script><p onclick="bad()">Trygt</p><a href="javascript:bad()">Lenke</a>', [], async () => '');
check(!safe.includes('script') && !safe.includes('onclick'), 'Aktivt HTML-innhold fjernes');
editor.destroy(); reopened.destroy();

// Actual NoteEditor paste handler, with storage boundary mocked: no real user data.
const originalFetch = window.fetch;
const originalUser = supabase.auth.getUser;
const originalSession = supabase.auth.getSession;
const originalStorageFrom = supabase.storage.from;
supabase.auth.getSession = async () => ({data:{session:{user:{id:'test-user'},access_token:'isolated'}},error:null}) as Awaited<ReturnType<typeof originalSession>>;

supabase.auth.getUser = async () => ({data:{user:{id:'test-user'}}, error:null}) as Awaited<ReturnType<typeof originalUser>>;
let uploads = 0;
supabase.storage.from = (() => ({
  upload: async () => {uploads++;return {data:{path:'test'},error:null};},
  remove: async () => ({data:[],error:null}),
  createSignedUrl: async () => ({data:{signedUrl:png},error:null}),
})) as typeof originalStorageFrom;

window.fetch = async (url, init) => {
  if (String(url).includes('/storage/v1/object/') && init?.method === 'POST') { uploads++; return Response.json({Key:'test'}); }
  return originalFetch(url, init);
};
let latest = '';
export function Fixture() { const [value,setValue] = useState('<p>Start</p>'); return <MemoryRouter><NoteEditor value={value} onChange={html => {latest=html;setValue(html);}} /></MemoryRouter>; }
createRoot(document.querySelector('#root')!).render(<Fixture/>);
async function until(test:()=>unknown) { for(let i=0;i<300;i++){if(test()) return; await new Promise(r=>setTimeout(r,20));}throw Error('Timeout'); }
await until(()=>document.querySelector('.tiptap'));
const editable = document.querySelector<HTMLElement>('.tiptap')!;
editable.focus();
const clipboard = new DataTransfer(); clipboard.setData('text/html',html);
editable.dispatchEvent(new ClipboardEvent('paste',{clipboardData:clipboard,bubbles:true,cancelable:true}));
await until(()=>uploads === 2 && latest.includes('data-latex') && editable.getAttribute('contenteditable') === 'true');
check(editable.querySelectorAll('img[src]').length === 2 && latest.includes('supabase-storage://note-images/test-user/'), 'Faktisk NoteEditor-innliming laster opp og setter inn begge bilder');
// The same file input used by the Importer toolbar control.
const input = document.querySelector<HTMLInputElement>('input[accept=".html,.htm,.docx"]')!;
const fileTransfer = new DataTransfer(); fileTransfer.items.add(docx); input.files=fileTransfer.files;
input.dispatchEvent(new Event('change',{bubbles:true}));
await until(()=>uploads === 4 && latest.includes('Etter bilde 2') && editable.getAttribute('contenteditable') === 'true');
check(editable.querySelectorAll('img[src]').length === 4, 'NoteEditor filimport legger til DOCX uten å erstatte eksisterende innhold');
const binary = new DataTransfer(); binary.items.add(new File([await (await originalFetch(png)).blob()], 'clipboard.png', {type:'image/png'}));
editable.dispatchEvent(new ClipboardEvent('paste',{clipboardData:binary,bubbles:true,cancelable:true}));
await until(()=>uploads === 5 && editable.getAttribute('contenteditable') === 'true');
check(editable.querySelectorAll('img[src]').length === 5, 'Binært bilde fra utklippstavlen bruker samme lagring');
window.fetch=originalFetch; supabase.auth.getUser=originalUser; supabase.auth.getSession=originalSession; supabase.storage.from=originalStorageFrom;
document.querySelector('#results')!.textContent=`${results.length} tester bestått\n${results.join('\n')}`;
