import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import '../src/index.css';
import { MathDialog } from '../src/components/notes/NoteEditor/MathDialog/MathDialog';
import { insertMathTemplate, mathSymbolGroups } from '../src/components/notes/NoteEditor/MathDialog/mathTemplates';

const results: string[] = [];
function check(name: string, test: () => void) {
  try { test(); results.push(`PASS: ${name}`); }
  catch (error) { results.push(`FAIL: ${name}: ${String(error)}`); }
}
function assert(condition: boolean) { if (!condition) throw Error('Assertion failed'); }
for (const group of mathSymbolGroups) for (const template of group.symbols) {
  check(`${group.title}: ${template.name}`, () => {
    katex.renderToString(template.latex, { throwOnError: true, trust: false });
    if (template.field) {
      const next = insertMathTemplate('', 0, 0, template);
      assert(next.value.slice(next.selectionStart, next.selectionEnd) === template.field);
    }
  });
}
const fraction = mathSymbolGroups[0].symbols[0];
check('Insert at cursor without losing surrounding text', () => {
  const next = insertMathTemplate('x+y', 2, 2, fraction);
  assert(next.value === String.raw`x+\frac{a}{b}y`);
  assert(next.value.slice(next.selectionStart, next.selectionEnd) === 'a');
});
check('Replace selected range', () => {
  assert(insertMathTemplate('x+old+y', 2, 5, fraction).value === String.raw`x+\frac{a}{b}+y`);
});
check('Greek command does not merge with following letters', () => {
  const alpha = mathSymbolGroups[3].symbols[0];
  const next = insertMathTemplate('x', 0, 0, alpha);
  assert(next.value === String.raw`\alpha x`);
  katex.renderToString(next.value, { throwOnError: true });
});
check('Template can replace another template field', () => {
  const next = insertMathTemplate('', 0, 0, fraction);
  const nested = insertMathTemplate(next.value, next.selectionStart, next.selectionEnd, mathSymbolGroups[0].symbols[3]);
  assert(nested.value === String.raw`\frac{\sqrt{x}}{b}`);
  katex.renderToString(nested.value, { throwOnError: true });
});

export function MathDialogTests() {
  const [open, setOpen] = useState(false);
  const [inserted, setInserted] = useState('');
  const [initialValue, setInitialValue] = useState('');
  return <main style={{ padding: 24 }}>
    <h1>Formula dialog tests</h1>
    <p role="status">{results.filter(result => result.startsWith('PASS')).length}/{results.length} passed</p>
    <button onClick={() => { setInitialValue(''); setOpen(true); }}>Åpne tom formel</button>
    <button onClick={() => { setInitialValue(String.raw`\frac{1}{2}`); setOpen(true); }}>Åpne eksisterende formel</button>
    <output aria-label="Innsatt LaTeX">{inserted}</output>
    <details><summary>Testresultater</summary><ul>{results.map(result => <li key={result}>{result}</li>)}</ul></details>
    <MathDialog open={open} title="Sett inn formel" initialValue={initialValue} onClose={() => setOpen(false)} onInsert={value => { setInserted(value); setOpen(false); }}/>
  </main>;
}
createRoot(document.getElementById('root')!).render(<MathDialogTests/>);
