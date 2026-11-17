import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

// Loads the TypeScript modules directly, without a browser.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.')) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return next(url.href, context);
    }
    return next(specifier, context);
  },
});

const paths = await import('../src/pages/exams/examViewPaths.ts');
const progress = await import('../src/components/exams/examProgress.ts');
const links = await import('../src/components/exams/examTaskLinks.ts');

const base = { subjectId: 'tma4240', source: 'database', examId: 'e1' };

test('opens the exam PDF by default and keeps four views', () => {
  assert.equal(paths.parseExamView(undefined), 'exam');
  assert.equal(paths.parseExamView('ukjent'), 'exam');
  assert.deepEqual([...paths.EXAM_VIEWS], ['exam', 'solution', 'ipad', 'notes']);
});

test('keeps the selected task when switching tab', () => {
  const tasks = ['1a', '1b'];
  const task = paths.resolveSelectedTask('1b', tasks);

  assert.equal(task, '1b');
  assert.equal(paths.buildExamPath(base, 'ipad', task), '/fag/tma4240/eksamen/database/e1/ipad/1b');
  assert.equal(paths.buildExamPath(base, 'notes', task), '/fag/tma4240/eksamen/database/e1/notes/1b');
  assert.equal(paths.buildExamPath(base, 'exam', null), '/fag/tma4240/eksamen/database/e1/exam');
});

test('ignores a task that is not part of the exam', () => {
  assert.equal(paths.resolveSelectedTask('9z', ['1a']), null);
  assert.equal(paths.resolveSelectedTask(undefined, ['1a']), null);
});

test('progress counts only current tasks', () => {
  const done = new Set(['1a', '2a', 'gammel']);
  assert.deepEqual(progress.summarizeExamProgress(['1a', '1b', '2a'], done), { completed: 2, total: 3, percent: 67 });
  assert.deepEqual(progress.summarizeExamProgress([], done), { completed: 0, total: 0, percent: 0 });
});

test('a note links to one task and cannot be picked for another', () => {
  const all = [
    { examId: 'e1', taskLabel: '1a', noteId: 'n1' },
    { examId: 'e1', taskLabel: '1b', noteId: 'n2' },
    { examId: 'e2', taskLabel: '1a', noteId: 'n3' },
  ];

  assert.equal(links.findLinkedNoteId(all, 'e1', '1a'), 'n1');
  assert.equal(links.findLinkedNoteId(all, 'e1', '2a'), null);
  assert.equal(links.findLinkedNoteId(all, 'e1', null), null);

  // Oppgave 1a i e1 ser bare notatene til de andre oppgavene som låst.
  assert.deepEqual([...links.collectLinkedNoteIdsExcept(all, 'e1', '1a')].sort(), ['n2', 'n3']);
  // Oppgave uten notat: alle koblede notater er låst.
  assert.deepEqual([...links.collectLinkedNoteIdsExcept(all, 'e1', '3a')].sort(), ['n1', 'n2', 'n3']);
});

const state = await import('../src/hooks/examTaskProgressState.ts');

test('progress from another exam is never shown or saved for this exam', () => {
  const loadedForE1 = { examId: 'e1', completed: new Set(['1a']) };

  assert.deepEqual([...state.progressForExam(loadedForE1, 'e1')], ['1a']);
  // Bytter til e2 før fremdriften er lastet: ingen status skal brukes.
  assert.equal(state.progressForExam(loadedForE1, 'e2'), null);
  assert.equal(state.progressForExam(null, 'e1'), null);
});

test('checkbox toggle builds a new set and leaves the loaded set untouched', () => {
  const before = new Set(['1a', '1b']);

  const afterUncheck = state.toggleCompletedTask(before, '1a');
  assert.deepEqual([...afterUncheck], ['1b']);
  assert.deepEqual([...before].sort(), ['1a', '1b']);

  const afterCheck = state.toggleCompletedTask(afterUncheck, '2a');
  assert.deepEqual([...afterCheck].sort(), ['1b', '2a']);
});
