import assert from 'node:assert/strict';
import { test, beforeEach } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

// Tester bare logikken for å slette iPad-PDF. Supabase er erstattet av en stub, så ingen data berøres.
const stubUrl = new URL('./fixtures/supabase-stub.mjs', import.meta.url).href;

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.endsWith('lib/supabase')) return next(stubUrl, context);
    if (specifier.startsWith('.')) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return next(url.href, context);
    }
    return next(specifier, context);
  },
});

const { removeExamMySolutionPdf } = await import('../src/services/exams/examsService.ts');

const EXAM = { id: 'e1', mySolutionFilePath: 'tma4240/eksamener/2025-var/min-besvarelse-1-ipad.pdf' };

beforeEach(() => {
  globalThis.__supabaseStub = {
    updates: [],
    removed: [],
    updateResult: { data: [{ id: 'e1' }], error: null },
    examReferences: { data: [], error: null },
    pdfReferences: { data: [], error: null },
    removeResult: { data: [], error: null },
  };
});

test('removes only the iPad path and deletes an unreferenced file', async () => {
  const result = await removeExamMySolutionPdf(EXAM);
  const s = globalThis.__supabaseStub;

  assert.deepEqual(result, { storageRemoved: true, warning: null });
  assert.equal(s.updates.length, 1);
  const names = s.updates[0].map(([name]) => name);
  assert.deepEqual(names, ['update', 'eq', 'eq', 'select']);
  assert.deepEqual(s.updates[0][0][1], [{ my_solution_file_path: null }]);
  assert.deepEqual(s.updates[0][1][1], ['id', 'e1']);
  assert.deepEqual(s.updates[0][2][1], ['my_solution_file_path', EXAM.mySolutionFilePath]);
  assert.deepEqual(s.removed, [{ bucket: 'pdfs', paths: [EXAM.mySolutionFilePath] }]);
});

test('keeps the file when another exam still uses the path', async () => {
  globalThis.__supabaseStub.examReferences = { data: [{ id: 'other' }], error: null };
  const result = await removeExamMySolutionPdf(EXAM);

  assert.equal(result.storageRemoved, false);
  assert.match(result.warning, /brukes andre steder/);
  assert.equal(globalThis.__supabaseStub.removed.length, 0);
});

test('keeps the file when a pdfs row still uses the path', async () => {
  globalThis.__supabaseStub.pdfReferences = { data: [{ id: 'p1' }], error: null };
  const result = await removeExamMySolutionPdf(EXAM);

  assert.equal(result.storageRemoved, false);
  assert.equal(globalThis.__supabaseStub.removed.length, 0);
});

test('throws without touching storage when no row matched (no access or path changed)', async () => {
  globalThis.__supabaseStub.updateResult = { data: [], error: null };

  await assert.rejects(removeExamMySolutionPdf(EXAM), /Kunne ikke slette PDF-en/);
  assert.equal(globalThis.__supabaseStub.removed.length, 0);
});

test('throws on database error and leaves storage untouched', async () => {
  globalThis.__supabaseStub.updateResult = { data: null, error: new Error('permission denied') };

  await assert.rejects(removeExamMySolutionPdf(EXAM), /permission denied/);
  assert.equal(globalThis.__supabaseStub.removed.length, 0);
});

test('reports a warning when the storage delete fails after the row is cleared', async () => {
  globalThis.__supabaseStub.removeResult = { data: null, error: new Error('storage down') };
  const result = await removeExamMySolutionPdf(EXAM);

  assert.equal(result.storageRemoved, false);
  assert.match(result.warning, /kunne ikke slettes/);
});

test('does not check references or delete for a path that cannot be filtered safely', async () => {
  const result = await removeExamMySolutionPdf({ id: 'e1', mySolutionFilePath: 'x/evil,y.pdf' });

  assert.equal(result.storageRemoved, false);
  assert.match(result.warning, /kunne kontrolleres|stien ikke kunne/);
  assert.equal(globalThis.__supabaseStub.removed.length, 0);
});
