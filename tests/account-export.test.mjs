// Offline checks for the personal data export; no Supabase or network access.
// Run: node --experimental-vm-modules tests/account-export.test.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile('src/services/account/accountDataExportService.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022,
}}).outputText;

const context = vm.createContext({ Blob, URL, document: undefined });
const module = new vm.SourceTextModule(code, { context });
await module.link(name => {
  assert.equal(name, '../../lib/supabase', `Unexpected dependency: ${name}`);
  return new vm.SyntheticModule(['supabase'], function () {
    this.setExport('supabase', { from() { throw Error('Supabase must not be called in offline tests'); } });
  }, { context });
});
await module.evaluate();
const { buildAccountExport, exportTables } = module.namespace;

const user = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'synthetic@example.test',
  created_at: '2026-01-01T00:00:00.000Z',
  user_metadata: { username: 'synthetic', full_name: 'Synthetic Reader' },
};

// 1. Every personal table is queried with the account's own id, and only those tables.
{
  const calls = [];
  const result = await buildAccountExport(user, async (table, column, userId) => {
    calls.push([table, column, userId]);
    return [{ table, synthetic: true }];
  });
  assert.deepEqual(calls.map(([table]) => table), [
    'profiles', 'favorites', 'progress', 'book_progress', 'book_task_progress', 'exam_task_progress', 'semester_subjects',
  ]);
  assert.ok(calls.every(([, , userId]) => userId === user.id), 'every query must use the caller id');
  assert.ok(!calls.some(([table]) => table === 'calendar_events'), 'shared calendar_events must not be exported');
  assert.deepEqual(calls.find(([table]) => table === 'profiles').slice(0, 2), ['profiles', 'id']);
  assert.equal(result.tables.favorites[0].table, 'favorites');
  assert.equal(exportTables.length, calls.length);
  console.log('PASS: exports exactly the account-keyed personal tables');
}

// 2. Account metadata is included; empty names become null.
{
  const result = await buildAccountExport(
    { ...user, user_metadata: { username: '  ', full_name: 'Ola' } },
    async () => [],
  );
  // Round-trip through JSON: objects built inside the vm context have another prototype realm.
  assert.deepEqual(JSON.parse(JSON.stringify(result.account)), {
    id: user.id, email: user.email, createdAt: user.created_at, username: null, fullName: 'Ola',
  });
  assert.ok(!Number.isNaN(Date.parse(result.exportedAt)));
  console.log('PASS: account block maps metadata and nulls blank values');
}

// 3. A failing table aborts the export; no partial result is returned.
{
  let attempted = [];
  await assert.rejects(buildAccountExport(user, async (table) => {
    attempted.push(table);
    if (table === 'progress') throw new Error('Kunne ikke hente alle opplysningene dine. Prøv igjen senere.');
    return [];
  }), /Kunne ikke hente/);
  assert.deepEqual(attempted, ['profiles', 'favorites', 'progress'], 'stops at the first failure');
  console.log('PASS: a failed table stops the export (no partial file)');
}
