import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

// Loads the TypeScript module directly, without a browser.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.')) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return next(url.href, context);
    }
    return next(specifier, context);
  },
});

const { groupExamTasks } = await import('../src/components/exams/examTaskGroups.ts');

test('groups sub-tasks under their main task in order', () => {
  const groups = groupExamTasks(['1a', '1b', '1c', '2a', '2b', '10a']);

  assert.deepEqual(
    groups.map((group) => [group.label, group.tasks]),
    [
      ['Oppgave 1', ['1a', '1b', '1c']],
      ['Oppgave 2', ['2a', '2b']],
      ['Oppgave 10', ['10a']],
    ],
  );
});

test('keeps labels without a leading number as their own group', () => {
  const groups = groupExamTasks(['A', '1a', 'A2']);

  assert.deepEqual(
    groups.map((group) => [group.label, group.tasks]),
    [
      ['A', ['A']],
      ['Oppgave 1', ['1a']],
      ['A2', ['A2']],
    ],
  );
});

test('returns no groups for an exam without tasks', () => {
  assert.deepEqual(groupExamTasks([]), []);
});
