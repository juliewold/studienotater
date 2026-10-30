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
const service = await import('../src/services/notes/notesService.ts');
const { orderNotesForNavigation, moveNoteInOrder } = await import('../src/services/notes/noteOrder.ts');
const row = { id: 'b', subject_id: 's', folder_id: 'f', subtopic_id: 'sub', slug: 'slug', title: 'Title', description: 'Description', created_at: '2026-10-30', sort_order: 2,
  subtopics: [{ id: 'sub', name: 'Subtopic', topics: [{ id: 'topic', name: 'Topic' }] }], content: '<p>Full text</p>', content_json: { type: 'doc' } };
function reset(data, error = null) { calls = []; response = { data, error }; }
for (const [name, args, filter] of [
  ['getNoteMetadataBySubject', ['s'], ['eq', 'subject_id', 's']],
  ['getNoteMetadataByFolder', ['s', 'f'], ['eq', 'folder_id', 'f']],
  ['getNoteMetadataWithoutFolder', ['s'], ['is', 'folder_id', null]],
]) {
  test(`${name}: projection, filters, mapping, ordering and errors`, async () => {
    reset([row, { ...row, id: 'a', sort_order: 1, subtopics: null }]);
    const notes = await service[name](...args);
    const projection = calls.find(call => call[0] === 'select')[1];
    assert.doesNotMatch(projection, /\bcontent(?:_json)?\b|\*/);
    assert.ok(calls.some(call => JSON.stringify(call) === JSON.stringify(filter)));
    assert.deepEqual(calls.filter(call => call[0] === 'order').map(call => call[1]), ['sort_order', 'id']);
    assert.deepEqual(notes.map(note => note.id), ['a', 'b']);
    assert.equal(notes[1].topicName, 'Topic');
    assert.equal(notes[0].topicName, null);
    assert.equal(notes[1].slug, 'slug');
    assert.equal('content' in notes[1], false);
    assert.equal('contentJson' in notes[1], false);
    reset(null); assert.deepEqual(await service[name](...args), []);
    const error = new Error('read failed'); reset(null, error);
    await assert.rejects(service[name](...args), error);
  });
}
for (const [name, args, single] of [
  ['getAllNotes', [], false], ['getNotesBySubject', ['s'], false],
  ['getNotesByFolder', ['s', 'f'], false], ['getNotesWithoutFolder', ['s'], false],
  ['getNoteById', ['b'], true], ['getNoteBySlug', ['s', 'slug'], true],
]) {
  test(`${name}: existing full-content contract preserved`, async () => {
    reset(single ? row : [row]);
    const result = await service[name](...args);
    const note = single ? result : result[0];
    const projection = calls.find(call => call[0] === 'select')[1];
    assert.match(projection, /\bcontent\b/); assert.match(projection, /\bcontent_json\b/);
    assert.equal(note.content, row.content); assert.deepEqual(note.contentJson, row.content_json);
  });
}
test('metadata navigation and reordering preserve folder and note ordering', async () => {
  reset([row, { ...row, id: 'a', folder_id: null, sort_order: 1 }]);
  const notes = await service.getNoteMetadataBySubject('s');
  assert.deepEqual(orderNotesForNavigation(notes, [{ id: 'f', name: 'Folder', sortOrder: 0 }]).map(note => note.id), ['b', 'a']);
  assert.deepEqual(moveNoteInOrder(notes, 'a', 'b').map(note => note.id), ['b', 'a']);
  assert.deepEqual(notes.map(note => note.id), ['a', 'b']);
});
for (const name of ['createNote', 'updateNote']) {
  test(`${name}: editing still returns full content and invalidates navigation`, async () => {
    const previousWindow = globalThis.window;
    globalThis.window = new EventTarget();
    let invalidations = 0;
    globalThis.window.addEventListener('studienotater:notes-changed', () => invalidations++);
    try {
      reset(row);
      const input = { subjectId: 's', slug: 'slug', title: 'Title', description: 'Description', content: row.content, contentJson: row.content_json };
      const note = await (name === 'createNote' ? service.createNote(input) : service.updateNote('b', input));
      assert.equal(note.content, row.content);
      assert.deepEqual(note.contentJson, row.content_json);
      const payload = calls.find(call => call[0] === (name === 'createNote' ? 'insert' : 'update'))[1];
      assert.equal(payload.content, row.content);
      assert.deepEqual(payload.content_json, row.content_json);
      assert.equal(invalidations, 1);
    } finally { globalThis.window = previousWindow; }
  });
}
test('single-note reads retain missing-note and null-content behavior', async () => {
  reset(null); assert.equal(await service.getNoteById('missing'), null);
  reset({ ...row, content: null, content_json: null, subtopics: { id: 'sub', name: 'Subtopic', topics: { id: 'topic', name: 'Topic' } } });
  const note = await service.getNoteBySlug('s', 'slug');
  assert.equal(note.content, ''); assert.equal(note.contentJson, null); assert.equal(note.topicName, 'Topic');
});

test('main pagination contract survives Egress integration', async () => {
  reset([row]);
  const notes = await service.getAllNotes({ from: 20, to: 39 });
  assert.deepEqual(calls.find(call => call[0] === 'range'), ['range', 20, 39]);
  assert.equal(notes[0].content, row.content);
  assert.deepEqual(notes[0].contentJson, row.content_json);
  reset([row]);
  await service.getAllNotes();
  assert.equal(calls.some(call => call[0] === 'range'), false);
});
