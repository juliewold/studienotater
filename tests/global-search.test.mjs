import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

// Exercise the real services without credentials or database traffic.
let response;
let calls;
const query = new Proxy({}, { get: (_, method) => method === 'then'
  ? (resolve) => Promise.resolve(response).then(resolve)
  : (...args) => { calls.push([method, ...args]); return query; } });
globalThis.__metadataTestClient = { from: (...args) => { calls.push(['from', ...args]); return query; } };
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.endsWith('/lib/supabase')) return { url: 'test:supabase', shortCircuit: true };
    if (specifier.startsWith('.')) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return next(url.href, context);
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url === 'test:supabase') return { format: 'module', source: 'export const supabase = globalThis.__metadataTestClient;', shortCircuit: true };
    return next(url, context);
  },
});
const { createSearchCache } = await import('../src/services/search/searchCache.ts');
const { getAllSearchNotes } = await import('../src/services/notes/notesService.ts');
const { getGlobalSearchItems, searchGlobalItems } = await import('../src/services/search/globalSearchService.ts');

test('cache is lazy, deduplicates in-flight loads and reuses completed results', async () => {
  let loads = 0;
  let resolve;
  const cache = createSearchCache(() => { loads++; return new Promise(done => { resolve = done; }); });
  assert.equal(loads, 0);
  const first = cache.get();
  assert.equal(cache.get(), first);
  assert.equal(loads, 1);
  resolve(['result']);
  assert.deepEqual(await first, ['result']);
  assert.equal(cache.get(), first);
  assert.equal(loads, 1);
});

test('invalidation during a load cannot replace the new cached request', async () => {
  const resolvers = [];
  const cache = createSearchCache(() => new Promise(resolve => resolvers.push(resolve)));
  const old = cache.get();
  cache.invalidate();
  const fresh = cache.get();
  resolvers[1](['updated']);
  assert.deepEqual(await fresh, ['updated']);
  resolvers[0](['old']);
  await old;
  assert.equal(cache.get(), fresh);
});

test('failures can be retried and separate sessions never share results', async () => {
  let loads = 0;
  const cache = createSearchCache(async () => { if (++loads === 1) throw new Error('offline'); return ['a']; });
  await assert.rejects(cache.get(), /offline/);
  assert.deepEqual(await cache.get(), ['a']);
  const otherUser = createSearchCache(async () => ['b']);
  assert.deepEqual(await otherUser.get(), ['b']);
  cache.invalidate();
  await cache.get();
  assert.equal(loads, 3);
});

test('search note projection retains HTML but excludes editor JSON', async () => {
  calls = [];
  response = { data: [{ id: 'n', subject_id: 's', title: 'Title', slug: 'slug', content: '<p>søketekst</p>', subtopics: null }], error: null };
  const notes = await getAllSearchNotes();
  const projection = calls.find(call => call[0] === 'select')[1];
  assert.match(projection, /\bcontent\b/);
  assert.doesNotMatch(projection, /content_json|\*/);
  assert.equal(notes[0].content, '<p>søketekst</p>');
  assert.equal('contentJson' in notes[0], false);
  response = { data: null, error: new Error('denied') };
  await assert.rejects(getAllSearchNotes(), /denied/);
});

test('search service uses the lean note query and still queries all resource types', async () => {
  calls = []; response = { data: [], error: null };
  assert.deepEqual(await getGlobalSearchItems(), []);
  assert.deepEqual(calls.filter(call => call[0] === 'from').map(call => call[1]), ['notes', 'flashcards', 'videos', 'pdfs']);
  assert.doesNotMatch(calls.find(call => call[0] === 'select')[1], /content_json/);
});

test('content search, Norwegian normalization, ranking, snippets and result limit are preserved', () => {
  const item = (id, title, description, searchableText) => ({ id, title, description, searchableText, type: 'note', snippet: '', path: '/note', subjectId: 's' });
  const results = searchGlobalItems([
    item('body', 'Annet', '', '<p>Her finnes &amp; søkeord bare i innholdet.</p>'),
    item('desc', 'Andre', 'søkeord', ''),
    item('contains', 'Et søkeord', '', ''),
    item('prefix', 'Søkeord først', '', ''),
    item('exact', 'Søkeord', '', ''),
  ], 'søkeord');
  assert.deepEqual(results.map(result => result.id), ['exact', 'prefix', 'contains', 'desc', 'body']);
  assert.match(results.at(-1).snippet, /& søkeord bare i innholdet/);
  assert.doesNotMatch(results.at(-1).snippet, /<p>/);
  assert.equal(searchGlobalItems([item('a', 'a', '', '')], 'a').length, 0);
  assert.equal(searchGlobalItems(Array.from({ length: 20 }, (_, i) => item(String(i), 'søkeord', '', '')), 'søkeord').length, 12);
});

test('AI content changes invalidate search only after a successful save', async () => {
  const { updateNoteConceptLinks } = await import('../src/services/notes/notesService.ts');
  const previousWindow = globalThis.window;
  globalThis.window = new EventTarget();
  let changes = 0;
  globalThis.window.addEventListener('studienotater:notes-changed', () => changes++);
  const note = { id: 'n', content: 'before', contentJson: null };
  try {
    calls = []; response = { data: { id: 'n' }, error: null };
    await updateNoteConceptLinks(note, 'after', null);
    assert.equal(changes, 1);
    response = { data: null, error: null };
    await assert.rejects(updateNoteConceptLinks(note, 'after', null), /Notatet ble endret/);
    response = { data: null, error: new Error('offline') };
    await assert.rejects(updateNoteConceptLinks(note, 'after', null), /offline/);
    assert.equal(changes, 1);
  } finally { globalThis.window = previousWindow; }
});

test('an obsolete failed load cannot evict a fresh cache entry', async () => {
  let rejectOld;
  let calls = 0;
  const cache = createSearchCache(() => ++calls === 1
    ? new Promise((_, reject) => { rejectOld = reject; })
    : Promise.resolve(['fresh']));
  const old = cache.get();
  cache.invalidate();
  const fresh = cache.get();
  rejectOld(new Error('old failure'));
  await assert.rejects(old, /old failure/);
  assert.equal(cache.get(), fresh);
  assert.deepEqual(await fresh, ['fresh']);
});
