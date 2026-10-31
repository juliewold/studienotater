import './ai-test-session';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { generateFlashcards } from '../src/services/flashcards/flashcardGenerationService';
import { createFlashcard, getFlashcardsBySubject } from '../src/services/study/flashcardsService';
import { FlashcardGenerator } from '../src/components/flashcards/FlashcardGenerator/FlashcardGenerator';

const assert = (value: unknown, message: string) => { if (!value) throw Error(message); };
const report = (text: string) => { document.querySelector('#results')!.textContent += text + '\n'; };
const tests: [string, () => Promise<void>][] = [
  ['Full HTML/math is sent, unlinked notes allowed', async () => {
    window.fetch = async (_url, options) => {
      assert(JSON.parse(String(options?.body)).text === '<span data-latex="n^2"></span>', 'Lost LaTeX');
      return Response.json({ flashcards: [{ question: 'q', answer: 'a', subtopicId: null }] });
    };
    assert((await generateFlashcards('<span data-latex="n^2"></span>', [])).length === 1, 'Missing card');
  }],
  ['Malformed or foreign taxonomy responses rejected', async () => {
    for (const data of [null, {}, { flashcards: [null] }, { flashcards: [{ question: 'q', answer: 'a', subtopicId: 'foreign' }] }]) {
      window.fetch = async () => Response.json(data);
      let rejected = false;
      try { await generateFlashcards('note', []); } catch { rejected = true; }
      assert(rejected, 'Accepted invalid result');
    }
  }],
  ['Saving and reading preserve source; manual creation still works', async () => {
    const writes: Record<string, unknown>[] = [];
    window.fetch = async (_url, options) => {
      if (options?.method === 'POST') {
        writes.push(JSON.parse(String(options.body)));
        return new Response(null, { status: 201 });
      }
      return Response.json([{ id: 'card', subject_id: 'subject', note_id: 'note', subtopics: { id: 'sub', topics: { id: 'topic' } } }]);
    };
    await createFlashcard('subject', 'sub', 'slug', 'q', 'a', 'note');
    await createFlashcard('subject', 'sub', 'manual', 'q', 'a');
    assert(writes[0].note_id === 'note' && writes[0].subtopic_id === 'sub', 'Missing association');
    assert(!('note_id' in writes[1]), 'Manual save changed');
    assert((await getFlashcardsBySubject('subject'))[0].noteId === 'note', 'Lost source on read');
  }],
];
for (const [name, test] of tests) {
  try { await test(); report('PASS: ' + name); } catch (error) { report('FAIL: ' + name + ': ' + String(error)); }
}
// Every request is intercepted: this fixture never reads/writes real data.
window.fetch = async (input, options) => {
  const url = new URL(String(input));
  if (url.pathname.endsWith('/topics')) return Response.json([{ id: 'topic', subject_id: 'subject', name: 'Datastrukturer' }]);
  if (url.pathname.endsWith('/subtopics')) return Response.json([
    { id: 'stack', topic_id: 'topic', name: 'Stack' }, { id: 'queue', topic_id: 'topic', name: 'Kø' },
  ]);
  if (url.pathname.endsWith('/generate-flashcards/')) {
    const body = JSON.parse(String(options?.body));
    assert(body.subtopics.length === 2 && body.subtopics[0].topicName === 'Datastrukturer', 'Missing full subject taxonomy');
    report('PASS: Full subject paths sent without reading note placements');
    return Response.json({ flashcards: [
      { question: 'Hvilket prinsipp bruker en stack?', answer: 'LIFO.', subtopicId: 'stack' },
      { question: 'Hvilket prinsipp bruker en kø?', answer: 'FIFO.', subtopicId: null },
    ] });
  }
  if (url.pathname.endsWith('/flashcards') && options?.method === 'POST') {
    report('SAVED (mock): ' + String(options.body));
    return new Response(null, { status: 201 });
  }
  throw Error('Unexpected request: ' + url.pathname);
};
export function Preview() {
  const [noteId, setNoteId] = useState('source-note');
  return <><button onClick={() => setNoteId('other-note')}>Bytt testnotat</button>
    <FlashcardGenerator noteId={noteId} subjectId="subject" content="<p>En stack bruker LIFO. En kø bruker FIFO.</p>" /></>;
}
createRoot(document.getElementById('root')!).render(<Preview />);
