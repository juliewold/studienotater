import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Mathematics } from '@tiptap/extension-mathematics';
import { Callout, type CalloutType } from '../src/components/notes/NoteEditor/Callout';
import { NoteEditor } from '../src/components/notes/NoteEditor/NoteEditor';
const results: string[] = [];
function check(value: unknown, name: string) { if (!value) throw Error(name); results.push(name); }
const types: CalloutType[] = ['definition', 'tip', 'theorem', 'example', 'exam'];
const source = '<p>Før <strong>viktig</strong> <em>tekst</em> <span data-type="inline-math" data-latex="\\mu_r=E[X^r]"></span></p><ul><li><p>Ett</p></li><li><p>To</p></li></ul><div data-type="block-math" data-latex="\\sum_{i=1}^n i"></div><p>Etter</p>';
const editor = new Editor({ extensions: [StarterKit, Mathematics, Callout.extend({ addNodeView() { return null; } })], content: source });
for (const type of types) {
  editor.commands.setContent(source);
  const original = editor.state.doc;
  editor.commands.selectAll();
  let changes = 0;
  const countChanges = ({ transaction }: { transaction: import('@tiptap/pm/state').Transaction }) => { if (transaction.docChanged) changes++; };
  editor.on('transaction', countChanges);
  editor.commands.insertCallout(type);
  editor.off('transaction', countChanges);
  check(changes === 1, `${type}: én dokumenttransaksjon`);
  check(editor.state.doc.firstChild?.attrs.type === type && editor.state.doc.firstChild.content.eq(original.content), `${type}: avsnitt, liste, marks og inline-LaTeX bevares nøyaktig`);
  check(editor.state.doc.childCount === 1 || (editor.state.doc.childCount === 2 && editor.state.doc.lastChild?.textContent === ''), `${type}: ingen kopi utenfor boksen`);
  editor.commands.undo();
  check(editor.state.doc.eq(original), `${type}: undo gjenoppretter original struktur`);
}
editor.commands.setContent('<p>Før valgt etter</p>');
editor.commands.setTextSelection({ from: 5, to: 10 });
editor.commands.insertCallout('definition');
check(editor.state.doc.child(0).textContent === 'Før ' && editor.state.doc.child(1).textContent === 'valgt' && editor.state.doc.child(2).textContent === ' etter', 'Delvis avsnitt: bare markert tekst flyttes');
editor.commands.setContent('<p>Behold</p>');
editor.commands.setTextSelection(7);
editor.commands.insertCallout('tip');
check(editor.state.doc.textContent === 'Behold' && editor.state.doc.child(1).type.name === 'callout' && editor.state.doc.child(1).textContent === '', 'Tomt utvalg beholder innsetting av tom boks');
editor.commands.setContent('<p>Unik definisjon 7284</p>');
editor.commands.setTextSelection({ from: 1, to: 20 });
const selectedContent = editor.state.selection.content().content;
editor.commands.insertCallout('definition');
check(editor.state.doc.firstChild?.content.eq(selectedContent), 'Vanlig tekstutvalg: boksen inneholder den faktiske slicen');
editor.commands.undo();
check(editor.state.doc.textContent === 'Unik definisjon 7284', 'Vanlig tekstutvalg: undo beholder unik tekst');
editor.destroy();
export function Fixture() {
  const [value, setValue] = useState(source);
  return <MemoryRouter><NoteEditor value={value} onChange={html => setValue(html)} /></MemoryRouter>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
document.getElementById('results')!.textContent = `${results.length} tester bestått\n${results.join('\n')}`;
async function until(test: () => unknown) { for(let i=0;i<200;i++){if(test())return; await new Promise(r=>setTimeout(r,10));} throw Error('Timeout'); }
async function click(el: HTMLElement) {
  if(el.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true}))) el.focus();
  el.dispatchEvent(new MouseEvent('mouseup',{bubbles:true})); el.click();
  await new Promise(r=>setTimeout(r,30));
}
if (!new URLSearchParams(location.search).has('manual')) {
  await until(()=>document.querySelector('.tiptap p'));
  await new Promise(r=>setTimeout(r,100)); // Let mount/trailing-node transactions settle before selecting.
  for (const name of ['Definisjon','Tips','Teorem','Eksempel','Eksamen']) {
    const editable = document.querySelector<HTMLElement>('.tiptap')!;
    const original = editable.textContent;
    editable.focus();
    const range = document.createRange(); range.selectNodeContents(editable);
    window.getSelection()!.removeAllRanges(); window.getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
    await new Promise(r=>setTimeout(r,30));
    const menu = [...document.querySelectorAll('details')].find(el=>el.querySelector('summary')?.textContent === 'Innholdsbokser')!;
    if (!menu.open) await click(menu.querySelector('summary')!);
    await click([...menu.querySelectorAll('button')].find(el=>el.textContent === name)!);
    check(editable.querySelectorAll('.note-callout').length === 1 && editable.querySelector('.note-callout-body')?.textContent === original, `${name}: faktisk toolbar flytter valgt innhold én gang`);
    check(!!editable.querySelector('.note-callout-body strong') && !!editable.querySelector('.note-callout-body ul') && !!editable.querySelector('.note-callout-body [data-type="inline-math"]'), `${name}: toolbar bevarer formatering, lister og matte`);
    await click(document.querySelector('button[aria-label="Angre"]')!);
    check(!editable.querySelector('.note-callout') && editable.textContent === original, `${name}: toolbar-undo gjenoppretter`);
  }
  document.getElementById('results')!.textContent = `${results.length} tester bestått\n${results.join('\n')}`;
}
else document.getElementById('results')!.textContent = 'Manuell test: marker innhold → Innholdsbokser → velg type → Cmd+Z';
