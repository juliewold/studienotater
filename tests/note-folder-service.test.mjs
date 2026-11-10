import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

// Exercise the real folder services against a recording fake client. No network, no credentials.
let response;
let calls;
const query = new Proxy({}, { get: (_, method) => method === 'then'
  ? (resolve, reject) => Promise.resolve(response).then(resolve, reject)
  : (...args) => { calls.push([method, ...args]); return query; } });
globalThis.__folderServiceTestClient = {
  from: (...args) => { calls.push(['from', ...args]); return query; },
  rpc: (...args) => { calls.push(['rpc', ...args]); return query; },
};
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
    if (url === 'test:supabase') return { format: 'module', source: 'export const supabase = globalThis.__folderServiceTestClient;', shortCircuit: true };
    return next(url, context);
  },
});

// Notification events need a window-like target; keep it local to these tests.
const previousWindow = globalThis.window;
globalThis.window = new EventTarget();
const events = [];
window.addEventListener('studienotater:notes-changed', () => events.push('changed'));

const folders = await import('../src/services/notes/noteFoldersService.ts');
const notes = await import('../src/services/notes/notesService.ts');

const reset = (result = { data: null, error: null }) => { calls = []; response = result; events.length = 0; };
const folderRow = (overrides = {}) => ({
  id: 'f1', subject_id: 'subject', parent_id: null, topic_id: null, name: 'Uke 1',
  created_at: '2026-01-01', sort_order: 0, color_index: 2, topics: null, ...overrides,
});

test('createNoteFolder without a parent keeps a top-level folder', async () => {
  reset({ data: folderRow(), error: null });
  const created = await folders.createNoteFolder('subject', 'Uke 1');
  const insert = calls.find(([method]) => method === 'insert')[1];
  assert.deepEqual(insert, { subject_id: 'subject', topic_id: null, parent_id: null, name: 'Uke 1' });
  assert.equal(created.parentId, null);
  assert.equal(events.length, 1);
});

test('createNoteFolder with a parent stores parent_id and maps it back', async () => {
  reset({ data: folderRow({ id: 'child', parent_id: 'f1', name: 'Øving' }), error: null });
  const created = await folders.createNoteFolder('subject', 'Øving', null, 'f1');
  assert.equal(calls.find(([method]) => method === 'insert')[1].parent_id, 'f1');
  assert.equal(created.parentId, 'f1');
});

test('updateNoteFolderParent updates only parent_id of the given folder', async () => {
  reset();
  await folders.updateNoteFolderParent('child', 'f1');
  assert.deepEqual(calls.filter(([method]) => method === 'update'), [['update', { parent_id: 'f1' }]]);
  assert.deepEqual(calls.filter(([method]) => method === 'eq'), [['eq', 'id', 'child']]);
  assert.equal(events.length, 1);
});

test('updateNoteFolderParent can move a folder to the top level', async () => {
  reset();
  await folders.updateNoteFolderParent('child', null);
  assert.deepEqual(calls.filter(([method]) => method === 'update'), [['update', { parent_id: null }]]);
});

test('deleteNoteFolder uses the delete RPC so subfolders and notes move up instead of being lost', async () => {
  reset();
  await folders.deleteNoteFolder('f1');
  assert.deepEqual(calls, [['rpc', 'delete_note_folder', { p_folder_id: 'f1' }]]);
  assert.ok(!calls.some(([method]) => method === 'delete'), 'must not delete rows directly');
  assert.equal(events.length, 1);
});

test('deleteNoteFolder surfaces database errors to the caller', async () => {
  reset({ data: null, error: new Error('Only admins may delete shared folders') });
  await assert.rejects(() => folders.deleteNoteFolder('f1'), /Only admins/);
  assert.equal(events.length, 0);
});

test('getNoteFoldersBySubject maps parent_id to parentId', async () => {
  reset({ data: [folderRow(), folderRow({ id: 'c', parent_id: 'f1', created_at: '2026-01-02' })], error: null });
  const loaded = await folders.getNoteFoldersBySubject('subject');
  assert.equal(loaded.find(folder => folder.id === 'c').parentId, 'f1');
  assert.equal(loaded.find(folder => folder.id === 'f1').parentId, null);
  assert.ok(calls.some(([method, columns]) => method === 'select' && String(columns).includes('parent_id')));
});

test('getNoteCountsByFolder selects only folder_id and counts direct notes per folder', async () => {
  reset({ data: [{ folder_id: 'a' }, { folder_id: 'a' }, { folder_id: 'b' }], error: null });
  const counts = await notes.getNoteCountsByFolder('subject');
  assert.deepEqual(counts, { a: 2, b: 1 });
  assert.deepEqual(calls.find(([method]) => method === 'select'), ['select', 'folder_id']);
  assert.ok(calls.some(([method, column]) => method === 'not' && column === 'folder_id'));
});

test.after(() => { globalThis.window = previousWindow; });
