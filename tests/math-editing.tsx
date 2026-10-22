import { StrictMode } from "react";
import { flushSync } from "react-dom";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import { FormulaConceptLink } from "../src/components/concepts/FormulaConceptLink/FormulaConceptLink";
import { applyMathEdit, getMathTarget } from "../src/components/notes/NoteEditor/mathEditing";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { NoteEditor } from "../src/components/notes/NoteEditor/NoteEditor";
const results: string[] = [];
function check(ok: unknown, label: string) { if (!ok) throw Error(label); results.push(label); }
const latex = "  \\frac{a_1}{b^2} + \\sqrt{x}\n ";
const editor = new Editor({ extensions: [StarterKit, Mathematics, FormulaConceptLink], content: { type: "doc", content: [{ type: "codeBlock", content: [{ type: "text", text: latex }] }] } });
editor.commands.setTextSelection(3);
const target = getMathTarget(editor);
check(target.latex === latex && target.from === 0, "Kodeblokk bruker hele originale LaTeX-kilden");
check(applyMathEdit(editor, target, "block", target.latex) && editor.state.doc.firstChild?.type.name === "blockMath" && editor.state.doc.firstChild.attrs.latex === latex, "Kodeblokk → formelblokk erstatter uten endring i LaTeX");
check(editor.state.doc.content.content.filter(node => node.type.name === "blockMath").length === 1 && !editor.state.doc.content.content.some(node => node.type.name === "codeBlock"), "Ingen ekstra kopi ved konvertering");
editor.commands.undo(); check(editor.state.doc.firstChild?.type.name === "codeBlock" && editor.state.doc.textContent === latex, "Undo gjenoppretter original kodeblokk");
editor.commands.redo(); check(editor.state.doc.firstChild?.attrs.latex === latex, "Redo bevarer kilden");
applyMathEdit(editor, getMathTarget(editor, 0), "inline", latex);
check(editor.state.doc.firstChild?.firstChild?.type.name === "inlineMath" && editor.state.doc.firstChild.firstChild.attrs.latex === latex, "Formelblokk → inline bevarer eksakt kilde");
applyMathEdit(editor, getMathTarget(editor, 1), "block", latex);
check(editor.state.doc.firstChild?.type.name === "blockMath" && editor.state.doc.firstChild.attrs.latex === latex, "Inline → formelblokk bevarer eksakt kilde");
applyMathEdit(editor, getMathTarget(editor, 0), "block", "\\alpha + 2");
check(editor.state.doc.firstChild?.attrs.latex === "\\alpha + 2" && editor.state.doc.content.content.filter(node => node.type.name === "blockMath").length === 1, "Rediger eksisterende formel uten kopi");
editor.commands.setContent({ type: "doc", content: [{ type: "codeBlock", content: [{ type: "text", text: latex }] }] });
editor.commands.setTextSelection({ from: 2, to: 5 });
applyMathEdit(editor, getMathTarget(editor), "inline", latex);
check(editor.state.doc.firstChild?.firstChild?.attrs.latex === latex, "Utvalg i kodeblokk → inline erstatter hele kodeblokken");
editor.commands.setContent({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Før " }, { type: "inlineMath", attrs: { latex, conceptId: "c" } }, { type: "text", text: " etter" }] }] });
applyMathEdit(editor, getMathTarget(editor, 5), "block", latex);
check(editor.state.doc.childCount === 3 && editor.state.doc.child(1).attrs.latex === latex && editor.state.doc.textContent === "Før  etter", "Inline midt i tekst splitter avsnitt uten teksttap");
check(editor.state.doc.child(1).attrs.conceptId === "c", "Eksisterende begrepskobling beholdes");
applyMathEdit(editor, getMathTarget(editor, editor.state.doc.child(0).nodeSize), "inline", latex);
const saved = editor.getHTML();
editor.commands.setContent(saved);
check(JSON.stringify(editor.getJSON()).includes(JSON.stringify(latex).slice(1,-1)), "HTML-lagring og lasting beholder LaTeX");
const stale = getMathTarget(editor, 1); editor.commands.insertContent("endring");
check(!applyMathEdit(editor, stale, "block", latex), "Utdatert dialog overskriver ikke endret dokument");
editor.destroy();
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;
let savedJson = "";
createRoot(document.getElementById("root")!).render(<StrictMode><MemoryRouter><NoteEditor value={'<pre><code>\\mu_r=E[X^r]</code></pre><p>Tekst <span data-type="inline-math" data-latex="x^2"></span>.</p><div data-type="block-math" data-latex="y=2"></div>'} onChange={(_html, json) => { savedJson = JSON.stringify(json); }} /></MemoryRouter></StrictMode>);

async function until(predicate: () => unknown) {
  for (let i = 0; i < 200; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 10)); }
  throw Error("Timed out waiting for math UI");
}
if (!new URLSearchParams(location.search).has('manual')) {
await until(() => document.querySelector('.tiptap [data-type="inline-math"]'));
(document.querySelector('.tiptap [data-type="inline-math"]') as HTMLElement).click();
await until(() => document.querySelector('[role="dialog"]'));
check(document.querySelector<HTMLTextAreaElement>('#math-dialog-latex')?.value === 'x^2', "Klikk på eksisterende inline åpner original LaTeX");
const input = document.querySelector<HTMLTextAreaElement>('#math-dialog-latex')!;
const edited = "  x^3\n ";
Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(input, edited);
flushSync(() => input.dispatchEvent(new Event('input', { bubbles: true })));
(document.querySelector('.math-dialog-insert-button') as HTMLButtonElement).click();
await until(() => !document.querySelector('[role="dialog"]'));
check(savedJson.includes(JSON.stringify(edited)), "Dialogredigering bevarer mellomrom og linjeskift eksakt");
(document.querySelector('.tiptap [data-type="block-math"]') as HTMLElement).click();
await until(() => document.querySelector('[role="dialog"]'));
check(document.querySelector<HTMLTextAreaElement>('#math-dialog-latex')?.value === 'y=2', "Klikk på eksisterende formelblokk åpner original LaTeX");
(document.querySelector('.math-dialog-close-button') as HTMLButtonElement).click();
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;
await until(() => !document.querySelector('[role="dialog"]'));
([...document.querySelectorAll('button')].find(button => button.textContent === 'Formel i tekst') as HTMLButtonElement).click();
await until(() => document.querySelector('[role="dialog"]'));
check(document.querySelector<HTMLTextAreaElement>('#math-dialog-latex')?.value === 'y=2', "Matteknapp bruker valgt eksisterende formel etter lukket dialog");
(document.querySelector('.math-dialog-insert-button') as HTMLButtonElement).click();
await until(() => !document.querySelector('[role="dialog"]'));
check(!document.querySelector('.tiptap [data-type="block-math"]') && document.querySelectorAll('.tiptap [data-type="inline-math"]').length === 2, "Verktøylinjen erstatter valgt blokk med inline uten kopi");
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;

// Exercise the browser selection and the complete menu/button mouse sequence,
// rather than setting a TipTap selection or calling applyMathEdit directly.
async function mouseClick(element: HTMLElement) {
  const keepsFocus = !element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }));
  if (!keepsFocus) element.focus(); // Native mousedown's default focus action.
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0 }));
  element.click();
  await new Promise(resolve => setTimeout(resolve, 20));
}
for (const [label, nodeType] of [['Formelblokk', 'block-math'], ['Formel i tekst', 'inline-math']]) {
  const code = document.querySelector<HTMLElement>('.tiptap pre code')!;
  const original = code.textContent!;
  const editable = document.querySelector<HTMLElement>('.tiptap')!;
  editable.focus();
  const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
  const text = walker.nextNode()!;
  const range = document.createRange();
  range.setStart(text, Math.min(2, text.textContent!.length)); range.collapse(true);
  window.getSelection()!.removeAllRanges(); window.getSelection()!.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));
  await new Promise(resolve => setTimeout(resolve, 30));
  const menu = document.querySelector<HTMLDetailsElement>('.note-toolbar-menu')!;
  if (!menu.open) await mouseClick(menu.querySelector('summary')!);
  check(document.activeElement === editable, 'Innsettingsmenyen bevarer editorfokus');
  await mouseClick([...menu.querySelectorAll('button')].find(button => button.textContent === label)!);
  await until(() => document.querySelector('[role="dialog"]'));
  check(document.querySelector<HTMLTextAreaElement>('#math-dialog-latex')!.value === original, `${label}: faktisk toolbar bruker hele kodeblokkens kilde`);
  const before = document.querySelectorAll(`.tiptap [data-type="${nodeType}"]`).length;
  await mouseClick(document.querySelector('.math-dialog-insert-button')!);
  await until(() => !document.querySelector('[role="dialog"]'));
  check(!document.querySelector('.tiptap pre') && document.querySelectorAll(`.tiptap [data-type="${nodeType}"]`).length === before + 1, `${label}: erstatter hele kodeblokken uten rest eller kopi`);
  const first = JSON.parse(savedJson).content[0];
  check((nodeType === 'inline-math' ? first.content[0].attrs.latex : first.attrs.latex) === original, `${label}: lagret LaTeX er identisk`);
  await mouseClick(document.querySelector('button[aria-label="Angre"]')!);
  check(document.querySelector('.tiptap pre code')?.textContent === original, `${label}: toolbar-undo gjenoppretter kodeblokken`);
}
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;

} else {
 document.getElementById("results")!.textContent = "Manuell NoteEditor-test (StrictMode): LaTeX-kodeblokk, inline og blokkformel";
}
