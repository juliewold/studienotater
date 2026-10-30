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
const { createNotesNavigationStore, createPendingNoteLoader } = await import('../src/services/notes/notesNavigationStore.ts');
const service = await import('../src/services/notes/notesService.ts');
const events = await import('../src/services/notes/notesNavigationEvents.ts');
const foldersService = await import('../src/services/notes/noteFoldersService.ts');
const note = (id, folderId = null, sortOrder = 0) => ({ id, subjectId: 's', folderId, sortOrder, slug: id, title: id, description: '', subtopicId: null, subtopicName: null, topicId: null, topicName: null, createdAt: 'today' });
const folder = (id, sortOrder = 0) => ({ id, subjectId: 's', name: id, sortOrder });
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };

test('shared consumers and repeated navigation load the two lists only once', async () => {
  const request = deferred(); let loads = 0;
  const store = createNotesNavigationStore('s', () => { loads++; return request.promise; });
  let sidebar, page;
  const unsubscribe = store.subscribe(() => { sidebar = store.getSnapshot(); });
  store.subscribe(() => { page = store.getSnapshot(); });
  const first = store.ensureLoaded();
  assert.equal(store.ensureLoaded(), first);
  assert.equal(loads, 1);
  request.resolve({ folders: [folder('f')], notes: [note('c'), note('b', 'f', 1), note('a', 'f')] });
  await first;
  assert.equal(sidebar, page);
  assert.deepEqual(page.notes.map(item => item.id), ['a', 'b', 'c']);
  for (let i = 0; i < 10; i++) await store.ensureLoaded();
  assert.equal(loads, 1);
  unsubscribe();
});

test('saved metadata patches title, folder and order without fetching; content changes preserve snapshot', async () => {
  let loads = 0;
  const a = note('a', 'f');
  const store = createNotesNavigationStore('s', async () => { loads++; return { folders: [folder('f')], notes: [a, note('b', 'f', 1)] }; });
  await store.ensureLoaded();
  const before = store.getSnapshot();
  store.applyChange({ note: { ...a } });
  store.applyChange({ navigation: false });
  assert.equal(store.getSnapshot(), before);
  store.applyChange({ note: { ...a, title: 'Renamed', folderId: null } });
  assert.deepEqual(store.getSnapshot().notes.map(item => item.id), ['b', 'a']);
  assert.equal(store.getSnapshot().notes[1].title, 'Renamed');
  assert.equal(loads, 1);
  store.applyChange({ note: { ...a, subjectId: 'other' } });
  assert.equal(store.getSnapshot().notes[1].title, 'Renamed');
});

test('structural changes arriving during a load coalesce into one sequential refresh', async () => {
  const requests = [deferred(), deferred()]; let loads = 0;
  const store = createNotesNavigationStore('s', () => requests[loads++].promise);
  const first = store.ensureLoaded();
  store.applyChange(); store.applyChange(); store.applyChange();
  assert.equal(loads, 1);
  requests[0].resolve({ folders: [], notes: [note('stale')] });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(loads, 2);
  assert.equal(store.getSnapshot().notes.length, 0);
  requests[1].resolve({ folders: [], notes: [note('created')] });
  await first;
  assert.deepEqual(store.getSnapshot().notes.map(item => item.id), ['created']);
});

test('metadata saved during initial loading is not overwritten by the older response', async () => {
  const request = deferred(); let loads = 0;
  const store = createNotesNavigationStore('s', () => { loads++; return request.promise; });
  const first = store.ensureLoaded();
  store.applyChange({ note: { ...note('a'), title: 'Latest title' } });
  request.resolve({ folders: [], notes: [note('a')] });
  await first;
  assert.equal(store.getSnapshot().notes[0].title, 'Latest title');
  assert.equal(loads, 1);
});

test('failed loads can be retried; separate subject/user stores do not share data', async () => {
  let loads = 0;
  const store = createNotesNavigationStore('s', async () => { if (++loads === 1) throw new Error('offline'); return { folders: [], notes: [note('a')] }; });
  await store.ensureLoaded();
  assert.match(store.getSnapshot().error, /Kunne ikke hente/);
  await store.refresh();
  assert.equal(store.getSnapshot().error, '');
  assert.equal(store.getSnapshot().notes[0].id, 'a');
  const other = createNotesNavigationStore('other', async () => ({ folders: [], notes: [] }));
  await other.ensureLoaded();
  assert.deepEqual(other.getSnapshot().notes, []);
});

test('overlapping note reads are shared, while later visits read fresh content', async () => {
  const request = deferred(); let reads = 0;
  const load = createPendingNoteLoader(async () => { reads++; return request.promise; });
  const first = load('a');
  assert.equal(load('a'), first);
  const second = load('b');
  assert.equal(reads, 2);
  request.resolve({ ...note('a'), content: 'latest' });
  await Promise.all([first, second]);
  await load('a');
  assert.equal(reads, 3);
});

test('failed note reads are not cached', async () => {
  let reads = 0;
  const load = createPendingNoteLoader(async () => { if (++reads === 1) throw new Error('offline'); return null; });
  await assert.rejects(load('a'), /offline/);
  assert.equal(await load('a'), null);
  assert.equal(reads, 2);
});

test('real CRUD events refresh structural changes but autosave and AI content do not reload lists', async () => {
  const previousWindow = globalThis.window;
  globalThis.window = new EventTarget();
  let loads = 0, searchInvalidations = 0;
  let rows = [note('a', 'f'), note('b', 'f', 1)];
  const store = createNotesNavigationStore('s', async () => { loads++; return { folders: [folder('f')], notes: rows }; });
  window.addEventListener(events.NOTES_CHANGED, event => { searchInvalidations++; store.applyChange(event.detail); });
  const row = { id: 'a', subject_id: 's', folder_id: 'f', subtopic_id: null, slug: 'a', title: 'a', description: '', created_at: 'today', sort_order: 0, subtopics: null, content: 'new body', content_json: null };
  const input = { title: 'a', description: '', content: 'new body' };
  try {
    await store.ensureLoaded();
    calls = []; response = { data: row, error: null };
    const original = store.getSnapshot();
    await service.updateNote('a', input);
    assert.equal(store.getSnapshot(), original);
    assert.equal(loads, 1);
    // The returned database metadata is authoritative, not the submitted draft.
    response = { data: { ...row, title: 'Renamed' }, error: null };
    await service.updateNote('a', { ...input, title: 'Renamed' });
    assert.equal(store.getSnapshot().notes[0].title, 'Renamed');
    assert.equal(loads, 1);
    response = { data: { id: 'a' }, error: null };
    await service.updateNoteConceptLinks({ id: 'a', content: 'old', contentJson: null }, 'new', null);
    assert.equal(loads, 1);
    assert.equal(searchInvalidations, 3);
    globalThis.__metadataTestClient.rpc = (...args) => { calls.push(['rpc', ...args]); return query; };
    for (const mutate of [
      () => service.createNote({ subjectId: 's', slug: 'a', ...input }),
      () => service.deleteNote('a'),
      () => service.moveNoteToFolder('a', null),
      () => service.updateNoteTitle('a', 'New title'),
      () => service.reorderNotes('s', 'f', ['b', 'a']),
      () => foldersService.reorderNoteFolders('s', ['f']),
    ]) {
      response = { data: row, error: null };
      const before = loads;
      rows = [note('b', 'f'), note('new')];
      await mutate();
      await store.ensureLoaded();
      assert.equal(loads, before + 1);
      assert.deepEqual(store.getSnapshot().notes.map(item => item.id), ['b', 'new']);
    }
    const before = loads;
    response = { data: null, error: new Error('save failed') };
    await assert.rejects(service.updateNote('a', input), /save failed/);
    assert.equal(loads, before);
  } finally { globalThis.window = previousWindow; }
});

test('creation, deletion, folder changes and reordering update the shared navigation sequence', async () => {
  let data = { folders: [folder('f'), folder('g', 1)], notes: [note('a', 'f'), note('b', 'g')] };
  const store = createNotesNavigationStore('s', async () => data);
  await store.ensureLoaded();
  const ids = () => store.getSnapshot().notes.map(item => item.id);
  assert.deepEqual(ids(), ['a', 'b']);
  data = { ...data, notes: [...data.notes, note('new', 'f', 1)] };
  await store.refresh();
  assert.deepEqual(ids(), ['a', 'new', 'b']);
  data = { ...data, notes: data.notes.filter(item => item.id !== 'a') };
  await store.refresh();
  assert.deepEqual(ids(), ['new', 'b']);
  data = { ...data, folders: [folder('f', 1), { ...folder('g'), name: 'Renamed folder' }] };
  await store.refresh();
  assert.deepEqual(ids(), ['b', 'new']);
  assert.equal(store.getSnapshot().folders[1].name, 'Renamed folder');
  store.applyChange({ note: { ...note('new', 'g'), sortOrder: -1 } });
  assert.deepEqual(ids(), ['new', 'b']);
});
