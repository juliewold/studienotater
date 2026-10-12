import { renderToStaticMarkup } from 'react-dom/server';
import { MathText } from '../src/components/common/MathText/MathText';

const assert = (condition: unknown, message: string) => { if (!condition) throw Error(message); };
const render = (text: string) => {
  const element = document.createElement('div');
  element.innerHTML = renderToStaticMarkup(<MathText>{text}</MathText>);
  return element;
};
const tests: [string, () => void][] = [
  ['Question: inline LaTeX with surrounding text', () => {
    const element = render(String.raw`Hva betyr \(f(n)=\Omega(g(n))\)?`);
    assert(element.querySelectorAll('.math-text-inline .katex').length === 1, 'Missing inline math');
    assert(element.textContent?.startsWith('Hva betyr ') && element.textContent.endsWith('?'), 'Changed prose');
    assert(element.querySelector('annotation')?.textContent === String.raw`f(n)=\Omega(g(n))`, 'Changed formula');
  }],
  ['Answer: mixed inline and multiline block LaTeX', () => {
    const element = render(String.raw`For \(c>0\): \[
f(n) \ge c g(n)
\] for store n.`);
    assert(element.querySelectorAll('.math-text-inline .katex').length === 1, 'Missing inline math');
    assert(element.querySelectorAll('.math-text-block .katex-display').length === 1, 'Missing block math');
    assert(element.textContent?.endsWith(' for store n.'), 'Changed trailing text');
  }],
  ['Existing dollar delimiters still work', () => {
    const element = render('Inline $x^2$ og blokk $$y^2$$.');
    assert(element.querySelectorAll('.math-text-inline .katex').length === 1, 'Dollar inline regression');
    assert(element.querySelectorAll('.math-text-block .katex-display').length === 1, 'Dollar block regression');
  }],
  ['Plain text and incomplete delimiters stay unchanged and escaped', () => {
    for (const text of ['Vanlig tekst\nmed linjeskift.', '<img src=x onerror=alert(1)>', String.raw`Uferdig \(x + 1`, 'Pris: 50 kr.']) {
      const element = render(text);
      assert(element.textContent === text && !element.querySelector('img, .katex'), 'Changed or interpreted plain text');
    }
  }],
  ['Invalid LaTeX does not crash the card', () => {
    const element = render(String.raw`Svar: \[\frac{\] ferdig.`);
    assert(element.textContent?.startsWith('Svar: ') && element.textContent.endsWith(' ferdig.'), 'Card lost after invalid formula');
  }],
];
let passed = 0;
for (const [name, test] of tests) {
  try { test(); passed++; document.querySelector('#results')!.textContent += `PASS: ${name}\n`; }
  catch (error) { document.querySelector('#results')!.textContent += `FAIL: ${name}: ${String(error)}\n`; }
}
document.querySelector('#results')!.textContent += `${passed}/${tests.length} passed`;
