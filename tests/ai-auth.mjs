// Run: node --experimental-vm-modules tests/ai-auth.mjs
// Load the actual TS services with isolated dependencies; no network or credentials.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

let session = { access_token: 'test-access-token' };
let sessionError = null;
let calls = [];
const supabase = {
  auth: { getSession: async () => ({ data: { session }, error: sessionError }) },
  rpc: async () => ({ data: { notesSkipped: 0 }, error: null }),
};
const stubs = {
  supabase,
  getConceptsFromDatabase: async () => [], addConceptSuggestion: async () => {},
  getNotesBySubject: async () => [{ id: 'n1', title: 'Title', content: 'Source', subtopicId: null }],
  getSubtopicLinksForNotes: async () => [], notifyNotesChanged: () => {},
  getAllSubtopicsBySubject: async () => [], getTopicsBySubject: async () => [],
};
const context = vm.createContext({
  DOMParser: class { parseFromString(text) { return { body: { textContent: text } }; } },
  fetch: async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({
      summary: 'Summary', explanation: 'Explanation', candidates: [], flashcards: [], topics: [],
    }) };
  },
});
const cache = new Map();
async function load(path) {
  if (cache.has(path)) return cache.get(path);
  const source = ts.transpileModule(await readFile(path, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText;
  const module = new vm.SourceTextModule(source, { context, identifier: path,
    initializeImportMeta(meta) { meta.env = { VITE_API_URL: 'https://ai.invalid' }; },
  });
  cache.set(path, module);
  await module.link(async specifier => {
    if (specifier.endsWith('/aiAuth')) return load('src/lib/aiAuth.ts');
    if (specifier === '../concepts/conceptExtractionService') {
      return load('src/services/concepts/conceptExtractionService.ts');
    }
    return new vm.SyntheticModule(Object.keys(stubs), function () {
      for (const [key, value] of Object.entries(stubs)) this.setExport(key, value);
    }, { context });
  });
  return module;
}
const cases = [
  ['notes/noteSummaryService', 'generateNoteSummary', ['Source'], 'summarize-note/'],
  ['notes/selectedTextService', 'explainSelectedText', ['Source'], 'explain-selection/'],
  ['concepts/conceptExtractionService', 'extractConceptCandidates', ['Source'], 'extract/'],
  ['flashcards/flashcardGenerationService', 'generateFlashcards', ['Source', []], 'generate-flashcards/'],
  ['concepts/subjectStructureGenerationService', 'generateAndSaveSubjectStructure', ['subject', 'Subject'], 'generate-structure/'],
];
for (const [path, name, args, endpoint] of cases) {
  const module = await load(`src/services/${path}.ts`);
  if (module.status !== 'evaluated') await module.evaluate();
  calls = [];
  await module.namespace[name](...args);
  assert.equal(calls.length, 1);
  assert.ok(calls[0].url.endsWith(endpoint));
  assert.equal(calls[0].options.headers.Authorization, 'Bearer test-access-token');
  assert.equal(calls[0].options.headers['Content-Type'], 'application/json');
  session = { access_token: 'refreshed-test-access-token' };
  calls = [];
  await module.namespace[name](...args);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.headers.Authorization, 'Bearer refreshed-test-access-token');
  for (const state of ['missing', 'error']) {
    session = state === 'missing' ? null : { access_token: 'test-access-token' };
    sessionError = state === 'error' ? new Error('session unavailable') : null;
    calls = [];
    await assert.rejects(module.namespace[name](...args), /logget inn/);
    assert.equal(calls.length, 0);
  }
  session = { access_token: 'test-access-token' };
  sessionError = null;
  console.log(`PASS ${endpoint}: current/refreshed Bearer token sent; missing/failed sessions do not call AI`);
}
