import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

process.env.TZ = 'Europe/Oslo';
let calls = [], payloadBytes = 0, failedTable = null, gate = Promise.resolve();
const start = '2026-10-25T23:00:00.000Z'; // Monday 00:00 after the Oslo DST transition.
const tables = Object.fromEntries(['notes', 'pdfs', 'videos', 'flashcards'].map(table => [table, []]));
for (const subject of ['s', 't']) {
  for (const [index, created_at] of ['2026-10-01T10:00:00Z', start].entries()) {
    tables.notes.push({ id: `${subject}-n${index}`, subject_id: subject, folder_id: null, subtopic_id: null,
      slug: `n${index}`, title: 'Note', description: 'Description', created_at, sort_order: index, subtopics: null });
    tables.pdfs.push({ id: `${subject}-p${index}`, subject_id: subject, title: 'PDF', category: 'Lecture',
      file_path: 'file.pdf', created_at, subtopic_id: null, summary_note_id: null, subtopics: null });
  }
  tables.videos.push({ id: `${subject}-v`, subject_id: subject, title: 'Video', youtube_id: `${subject}-youtube`, sort_order: 0,
    subtopic_id: 'sub', subtopics: { id: 'sub', name: 'Subtopic', sort_order: 0, topic_id: 'topic',
      topics: { id: 'topic', subject_id: subject, name: 'Topic', sort_order: 0 } } });
  for (let i = 0; i < 250; i++) tables.flashcards.push({ id: `${subject}-f${i}`, subject_id: subject, slug: `f${i}`,
    question: 'Q'.repeat(100), answer: 'A'.repeat(500), created_at: i < 10 ? start : '2026-01-01T00:00:00Z', subtopics: null });
}
// Project top-level columns, retaining complete relations for the existing service mappers.
function project(row, select) {
  if (select.includes('*')) return row;
  const parts = []; let depth = 0, begin = 0;
  for (let i = 0; i < select.length; i++) {
    if (select[i] === '(') depth++;
    if (select[i] === ')') depth--;
    if (select[i] === ',' && depth === 0) { parts.push(select.slice(begin, i)); begin = i + 1; }
  }
  parts.push(select.slice(begin));
  return Object.fromEntries(parts.map(part => part.trim().split(/[!(\s]/)[0]).filter(Boolean).map(key => [key, row[key]]));
}
globalThis.__homeClient = {
  storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: 'https://example.invalid/file.pdf' } }) }) },
  from(table) {
    const call = { table, filters: [], orders: [], select: '', options: {} }; calls.push(call);
    const query = new Proxy({}, { get: (_, method) => method === 'then'
      ? (resolve, reject) => gate.then(() => {
        if (failedTable === table) return { data: null, count: null, error: new Error('offline') };
        const rows = tables[table].filter(row => call.filters.every(([op, key, value]) => op === 'eq' ? row[key] === value : new Date(row[key]) >= new Date(value)));
        const data = call.options.head ? null : rows.map(row => project(row, call.select));
        payloadBytes += data === null ? 0 : Buffer.byteLength(JSON.stringify(data));
        return { data, count: call.options.count ? rows.length : null, error: null };
      }).then(resolve, reject)
      : (...args) => {
        if (method === 'select') { call.select = args[0]; call.options = args[1] ?? {}; }
        if (['eq', 'gte'].includes(method)) call.filters.push([method, ...args]);
        if (method === 'order') call.orders.push(args);
        return query;
      } });
    return query;
  },
};
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.endsWith('/lib/supabase')) return { url: 'test:home-client', shortCircuit: true };
    if (context.parentURL?.endsWith('/useHomeProgress.ts')) {
      const mocks = { react: 'memo', '../data/subjects': 'subjects', './useProgress': 'progress', './useSemesterSubjects': 'semester' };
      if (mocks[specifier]) return { url: `test:${mocks[specifier]}`, shortCircuit: true };
    }
    if (specifier.startsWith('.')) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return next(url.href, context);
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    const sources = {
      'test:home-client': 'export const supabase = globalThis.__homeClient;',
      'test:memo': 'export const useMemo = calculate => calculate();',
      'test:subjects': 'export const subjects = [{ id: "s", code: "S", name: "Subject", color: "purple" }];',
      'test:progress': 'export const useProgress = () => globalThis.__homeProgress;',
      'test:semester': 'export const useSemesterSubjects = () => globalThis.__homeSemester;',
    };
    if (sources[url]) return { format: 'module', source: sources[url], shortCircuit: true };
    return next(url, context);
  },
});
const home = await import('../src/services/home/homeResourcesService.ts');
const { useHomeProgress } = await import('../src/hooks/useHomeProgress.ts');
const notes = await import('../src/services/notes/notesService.ts');
const pdfs = await import('../src/services/media/pdfsService.ts');
const videos = await import('../src/services/media/videosService.ts');
const flashcards = await import('../src/services/study/flashcardsService.ts');
function reset() { calls = []; payloadBytes = 0; failedTable = null; gate = Promise.resolve(); }

test('home uses four reads per subject, shared minimal metadata, and a filtered HEAD count', async () => {
  reset();
  const data = await home.loadHomeResources(['s', 't', 's'], start);
  assert.equal(calls.length, 8);
  for (const subject of ['s', 't']) {
    const subjectCalls = calls.filter(call => call.filters.some(filter => filter[1] === 'subject_id' && filter[2] === subject));
    assert.deepEqual(subjectCalls.map(call => call.table).sort(), ['flashcards', 'notes', 'pdfs', 'videos']);
  }
  const count = calls.find(call => call.table === 'flashcards');
  assert.deepEqual(count.options, { count: 'exact', head: true });
  assert.deepEqual(count.filters[1], ['gte', 'created_at', start]);
  assert.doesNotMatch(count.select, /question|answer|\*/);
  assert.equal(calls.find(call => call.table === 'notes').select, 'id, slug, created_at');
  assert.equal(calls.find(call => call.table === 'pdfs').select, 'id, created_at');
  assert.deepEqual(calls.find(call => call.table === 'notes').orders.map(order => order[0]), ['sort_order', 'id']);
  assert.deepEqual(calls.find(call => call.table === 'pdfs').orders.map(order => order[0]), ['created_at']);
  assert.equal(data.notes.length, 4); assert.equal(data.pdfs.length, 4);
  assert.equal(data.videos.length, 2);
  assert.equal(data.flashcardCounts.s, 10);
  assert.equal(data.notes[0].subjectId, 's');
  assert.equal(data.progressError, false); assert.equal(data.weeklyError, false);
});

test('store deduplicates concurrent loads and later consumers without sharing across scopes', async () => {
  reset(); let release; gate = new Promise(resolve => { release = resolve; });
  const store = home.createHomeResourcesStore(['s'], start);
  let progressSnapshot, weeklySnapshot;
  store.subscribe(() => { progressSnapshot = store.getSnapshot(); });
  const unsubscribe = store.subscribe(() => { weeklySnapshot = store.getSnapshot(); });
  assert.equal(calls.length, 0);
  const first = store.ensureLoaded(); assert.equal(store.ensureLoaded(), first);
  assert.equal(calls.length, 4); assert.equal(store.getSnapshot().loading, true);
  release(); await first;
  assert.equal(progressSnapshot, weeklySnapshot);
  assert.equal(store.getSnapshot().loading, false);
  for (let i = 0; i < 10; i++) await store.ensureLoaded();
  assert.equal(calls.length, 4); unsubscribe();
  const other = home.createHomeResourcesStore(['t'], start);
  assert.deepEqual(other.getSnapshot().notes, []);
  await other.ensureLoaded(); assert.equal(calls.length, 8);
  assert.ok(other.getSnapshot().notes.every(note => note.subjectId === 't'));
});

test('empty selection performs no database calls', async () => {
  reset(); const store = home.createHomeResourcesStore([], start);
  assert.equal(store.getSnapshot().loading, false);
  await store.ensureLoaded(); assert.equal(calls.length, 0);
});

test('local Monday boundary handles Sunday, year changes and the Oslo DST transition', () => {
  assert.equal(home.getHomeWeekStart(new Date('2026-10-30T12:00:00+01:00')), start);
  assert.equal(home.getHomeWeekStart(new Date('2026-10-26T00:00:00+01:00')), start);
  assert.equal(home.getHomeWeekStart(new Date('2026-10-25T23:59:59+01:00')), '2026-10-18T22:00:00.000Z');
  assert.equal(home.getHomeWeekStart(new Date('2027-01-01T12:00:00+01:00')), '2026-12-27T23:00:00.000Z');
});

test('weekly counts reuse metadata, include the boundary, and exclude history and other subjects', async () => {
  reset(); const data = await home.loadHomeResources(['s', 't'], start);
  const reads = calls.length;
  assert.deepEqual(home.getWeeklyResourceCounts(data, 's'), { notes: 1, pdfs: 1, flashcards: 10 });
  assert.deepEqual(home.getWeeklyResourceCounts(data, 'missing'), { notes: 0, pdfs: 0, flashcards: 0 });
  assert.equal(calls.length, reads);
  assert.equal(data.notes.length, 4); // History is still needed for progress denominators.
});

for (const table of ['notes', 'pdfs', 'videos', 'flashcards']) {
  test(`${table} failures affect only dependent dashboard sections`, async () => {
    reset(); failedTable = table;
    const data = await home.loadHomeResources(['s'], start);
    assert.equal(data.progressError, table !== 'flashcards');
    assert.equal(data.weeklyError, table !== 'videos');
    assert.equal(calls.length, 4);
  });
}

test('existing progress IDs, totals, rounding, ratings and custom labels are preserved', async () => {
  reset(); const data = { ...await home.loadHomeResources(['s', 't'], start), loading: false };
  globalThis.__homeSemester = { semesterSubjects: [
    { subjectId: 's', customCode: null, customName: null },
    { subjectId: 't', customCode: 'CUSTOM', customName: 'Custom subject' },
    { subjectId: 'empty', customCode: null, customName: null },
  ], isLoadingSemesterSubjects: false };
  const ids = [];
  globalThis.__homeProgress = { isLoadingProgress: false, getProgress(id, type) {
    assert.equal(type, 'resource'); ids.push(id);
    return { completed: ['pdf-s-database-s-p0', 'note-s-database-n1', 'video-s-database-s-youtube'].includes(id),
      rating: id === 'note-s-database-n1' ? 4 : id === 'pdf-s-database-s-p0' ? 3 : 0 };
  } };
  const result = useHomeProgress(data);
  assert.equal(result.isLoading, false); assert.equal(result.resourcesError, '');
  const [subject, custom, empty] = result.progressSubjects;
  assert.deepEqual({ completed: subject.completed, total: subject.total, progress: subject.progress, averageRating: subject.averageRating },
    { completed: 3, total: 5, progress: 60, averageRating: 4 });
  assert.equal(subject.noteTotal, 2); assert.equal(subject.pdfTotal, 2); assert.equal(subject.videoTotal, 1);
  assert.equal(custom.code, 'CUSTOM'); assert.equal(custom.total, 5);
  assert.equal(empty.total, 0); assert.equal(empty.progress, 0); assert.equal(empty.averageRating, 0);
  assert.ok(ids.includes('note-s-database-n0'));
  assert.ok(ids.includes('pdf-s-database-s-p1'));
  assert.ok(ids.includes('video-s-database-s-youtube'));
  assert.equal(useHomeProgress({ ...data, progressError: true }).resourcesError, 'Kunne ikke hente all fremdrift.');
  assert.equal(useHomeProgress({ ...data, loading: true }).isLoading, true);
});

test('before/after comparison runs the old service calls and measures synthetic response bodies', async () => {
  reset();
  await Promise.all(['s', 't'].map(subject => Promise.all([
    notes.getNoteMetadataBySubject(subject), pdfs.getPdfsBySubject(subject), videos.getVideosBySubject(subject),
    notes.getNoteMetadataBySubject(subject), pdfs.getPdfsBySubject(subject), flashcards.getFlashcardsBySubject(subject),
  ])));
  const before = { calls: calls.length, bytes: payloadBytes };
  reset(); await home.loadHomeResources(['s', 't'], start);
  const after = { calls: calls.length, bytes: payloadBytes };
  assert.equal(before.calls, 12); assert.equal(after.calls, 8);
  assert.ok(after.bytes < before.bytes);
  console.log('Synthetic comparison (2 subjects, 500 flashcards; response bodies only):', JSON.stringify({ before, after }));
});

test('selected subjects with no resources retain zero counts and no error', async () => {
  reset(); const data = await home.loadHomeResources(['empty'], start);
  assert.deepEqual(data.notes, []); assert.deepEqual(data.pdfs, []); assert.deepEqual(data.videos, []);
  assert.deepEqual(home.getWeeklyResourceCounts(data, 'empty'), { notes: 0, pdfs: 0, flashcards: 0 });
  assert.equal(data.weeklyError, false); assert.equal(data.progressError, false);
});

test('exact flashcard counts are not limited to a downloaded page of rows', async () => {
  reset(); const previous = tables.flashcards;
  tables.flashcards = Array.from({ length: 1250 }, (_, i) => ({ id: String(i), subject_id: 's', created_at: start }));
  try {
    const data = await home.loadHomeResources(['s'], start);
    assert.equal(data.flashcardCounts.s, 1250);
    assert.deepEqual(calls.find(call => call.table === 'flashcards').options, { count: 'exact', head: true });
  } finally { tables.flashcards = previous; }
});
