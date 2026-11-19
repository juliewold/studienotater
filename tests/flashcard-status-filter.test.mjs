// Offline checks for the flashcard status filter; no Supabase or network access.
// Run: node --experimental-vm-modules tests/flashcard-status-filter.test.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile('src/services/study/flashcardProgressStats.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022,
}}).outputText;

const context = vm.createContext({});
const module = new vm.SourceTextModule(code, { context });
await module.link(name => {
  assert.fail(`Unexpected dependency: ${name}`);
});
await module.evaluate();
const { filterFlashcardsByStatus, countFlashcardLevels } = module.namespace;

const cards = ['a', 'b', 'c', 'd', 'e'].map(id => ({ id }));
const progress = new Map([
  ['a', { level: 'red', previousLevel: 'none' }],
  ['b', { level: 'yellow', previousLevel: 'none' }],
  ['c', { level: 'green', previousLevel: 'none' }],
  // 'd' and 'e' have no rating.
]);

const ids = (list) => list.map(card => card.id);

assert.deepEqual(ids(filterFlashcardsByStatus(cards, progress, 'all')), ['a', 'b', 'c', 'd', 'e']);
assert.deepEqual(ids(filterFlashcardsByStatus(cards, progress, 'unrated')), ['d', 'e']);
assert.deepEqual(ids(filterFlashcardsByStatus(cards, progress, 'red')), ['a']);
assert.deepEqual(ids(filterFlashcardsByStatus(cards, progress, 'yellow')), ['b']);
assert.deepEqual(ids(filterFlashcardsByStatus(cards, progress, 'green')), ['c']);
// «Trenger øving» is everything that is not green, including unrated cards.
assert.deepEqual(ids(filterFlashcardsByStatus(cards, progress, 'needsPractice')), ['a', 'b', 'd', 'e']);

// The filter must not change the counts shown for the whole subject.
assert.equal(JSON.stringify(countFlashcardLevels(cards, progress)), JSON.stringify({ total: 5, red: 1, yellow: 1, green: 1, unrated: 2 }));

console.log('flashcard status filter: all checks passed');
