import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

let calls = [], bytes = 0, error = null, gate = Promise.resolve();
const row = { id: 'note1', subject_id: 's', folder_id: null, subtopic_id: null, slug: 'lecture', title: 'Lecture note', description: 'Description',
  created_at: '2026-10-30', sort_order: 0, subtopics: null, content: '<p>' + 'A'.repeat(10000) + '</p>', content_json: { type: 'doc', text: 'A'.repeat(10000) } };
globalThis.__planClient = { from(table) {
  assert.equal(table, 'notes');
  const call = { table, select: '', filters: [], orders: [], single: false }; calls.push(call);
  const query = new Proxy({}, { get: (_, method) => method === 'then'
    ? (resolve, reject) => gate.then(() => {
      if (error) return { data: null, error };
      const selected = { ...row };
      if (!/\bcontent\b/.test(call.select)) delete selected.content;
      if (!/\bcontent_json\b/.test(call.select)) delete selected.content_json;
      const rows = call.filters.some(([key, value]) => key === 'subject_id' && value === 'empty') ? [] : [selected];
      const data = call.single ? rows[0] ?? null : rows;
      bytes += Buffer.byteLength(JSON.stringify(data));
      return { data, error: null };
    }).then(resolve, reject)
    : (...args) => {
      if (method === 'select') call.select = args[0];
      if (method === 'eq') call.filters.push(args);
      if (method === 'order') call.orders.push(args);
      if (method === 'maybeSingle') call.single = true;
      return query;
    } });
  return query;
} };
// Isolate the real hooks' resource/navigation/editing logic from React rendering and unrelated services.
const mocks = {
  react: 'export const useState = (...a) => globalThis.__planHooks.useState(...a); export const useMemo = (...a) => globalThis.__planHooks.useMemo(...a); export const useCallback = (...a) => globalThis.__planHooks.useMemo(() => a[0], a[1]); export const useEffect = (...a) => globalThis.__planHooks.useEffect(...a); export const useContext = () => globalThis.__planAuth;',
  auth: 'export const AuthContext = {};',
  subjects: 'export const subjects = [{id:"s"}];',
  videos: 'export const getVideosBySubject = async () => [{id:"v1", youtubeId:"yt", title:"Video"}];',
  pdfs: 'export const getPdfsBySubject = async () => [{id:"p1", title:"PDF"}];',
  books: 'export const getBooksBySubject = async () => []; export const getBookBySlug = async () => null;',
  bookProgress: 'export const useBookProgress = () => ({checkedPages:[],isLoading:false});',
  progress: 'export const useProgress = () => ({isLoadingProgress:false,getProgress:(id) => ({completed: globalThis.__completedResources.includes(id)})});',
  progressService: 'export const getStudyPlanItems = async () => ["study-topic-plan-item-i"]; export const saveStudyPlanItem = async (...args) => { globalThis.__planOps.push(["saveStudyPlanItem",...args]); };',
  structure: 'export const getTopicsBySubject = async () => [{id:"structure",name:"Topic",sortOrder:0}]; export const getSubtopicsByTopic = async () => [];',
  plans: 'export const getStudyTopicsBySubject = async () => globalThis.__planTopics; export const createStudyTopic = async (...a) => {globalThis.__planOps.push(["create",...a]);return "created";}; export const updateStudyTopic = async (...a) => {globalThis.__planOps.push(["update",...a]);}; export const deleteStudyTopic = async (...a) => {globalThis.__planOps.push(["delete",...a]);}; export const replaceStudyTopicItems = async (...a) => {globalThis.__planOps.push(["items",...a]);}; export const replaceStudyTopicResources = async (...a) => {globalThis.__planOps.push(["resources",...a]);};',
};
registerHooks({
  resolve(specifier, context, next) {
    let mock;
    if (specifier === 'react') mock = 'react';
    if (specifier.endsWith('/lib/supabase')) mock = 'client';
    for (const [suffix, key] of Object.entries({ '/AuthContext/AuthContext':'auth', '/data/subjects':'subjects', '/videosService':'videos', '/pdfsService':'pdfs', '/booksService':'books', '/useBookProgress':'bookProgress', '/useProgress':'progress', '/progressService':'progressService', '/subjectStructureService':'structure', '/studyPlansService':'plans' })) {
      if (specifier.endsWith(suffix)) mock = key;
    }
    if (mock) return {url:`test:plan-${mock}`,shortCircuit:true};
    if (specifier.startsWith('.')) { const url = new URL(`${specifier}.ts`,context.parentURL); if (existsSync(url)) return next(url.href,context); }
    return next(specifier,context);
  },
  load(url, context, next) {
    if (url === 'test:plan-client') return {format:'module',source:'export const supabase = globalThis.__planClient;',shortCircuit:true};
    if (url.startsWith('test:plan-')) return {format:'module',source:mocks[url.slice('test:plan-'.length)],shortCircuit:true};
    return next(url,context);
  },
});
const { createStudyPlanNoteMetadataLoader } = await import('../src/services/study/studyPlanNotesService.ts');
const notesService = await import('../src/services/notes/notesService.ts');
const { useStudyPlan } = await import('../src/hooks/useStudyPlan.ts');
const { useAdminStudyPlans } = await import('../src/hooks/admin/useAdminStudyPlans.ts');
function reset() {
  calls=[];bytes=0;error=null;gate=Promise.resolve();
  globalThis.__planAuth={user:{id:'u'},role:'admin'};
  globalThis.__planOps=[];
  globalThis.__completedResources=['note-s-database-lecture','video-s-database-yt'];
  globalThis.__planTopics=[{id:'plan',subjectId:'s',title:'Plan',sortOrder:0,structureTopicId:'structure',items:[{id:'i',type:'reading',value:'Read'}],resources:[{resourceType:'note',resourceId:'note1'},{resourceType:'pdf',resourceId:'p1'},{resourceType:'video',resourceId:'v1'}]}];
}
function hookHost(render) {
  const slots=[];let cursor=0, effects=[];
  const same=(a,b)=>a && b && a.length===b.length && a.every((v,i)=>Object.is(v,b[i]));
  const hooks={
    useState(initial) { const i=cursor++; if (!(i in slots)) slots[i]={value:typeof initial==='function'?initial():initial}; return [slots[i].value,value=>{slots[i].value=typeof value==='function'?value(slots[i].value):value;}]; },
    useMemo(calculate,deps) { const i=cursor++; if (!slots[i] || !same(slots[i].deps,deps)) slots[i]={value:calculate(),deps}; return slots[i].value; },
    useEffect(effect,deps) { const i=cursor++; if (!slots[i] || !same(slots[i].deps,deps)) { slots[i]?.cleanup?.(); slots[i]={deps}; effects.push(()=>{slots[i].cleanup=effect();}); } },
  };
  return {
    render() { globalThis.__planHooks=hooks;cursor=0;return render(); },
    async flush() { const queued=effects;effects=[];queued.forEach(effect=>effect()); await new Promise(resolve=>setImmediate(resolve)); },
  };
}

test('metadata loader shares overlapping reads and keeps subject filters and ordering', async () => {
  reset(); let release;gate=new Promise(resolve=>{release=resolve;});
  const load=createStudyPlanNoteMetadataLoader('u:admin');
  const first=load('s');assert.equal(load('s'),first);assert.equal(calls.length,1);
  release();const notes=await first;
  assert.doesNotMatch(calls[0].select,/\bcontent(?:_json)?\b|\*/);
  assert.deepEqual(calls[0].filters,[['subject_id','s']]);
  assert.deepEqual(calls[0].orders.map(([key])=>key),['sort_order','id']);
  assert.equal(notes[0].title,row.title);assert.equal(notes[0].slug,row.slug);
  assert.equal('content' in notes[0],false);assert.equal('contentJson' in notes[0],false);
  await load('s');assert.equal(calls.length,2); // Later visits read fresh metadata.
});

test('empty selections, empty results, failed reads and separate scopes', async () => {
  reset();const load=createStudyPlanNoteMetadataLoader('u');
  assert.deepEqual(await load(''),[]);assert.equal(calls.length,0);
  assert.deepEqual(await load('empty'),[]);
  error=new Error('offline');await assert.rejects(load('s'),/offline/);
  error=null;assert.equal((await load('s')).length,1);
  let release;gate=new Promise(resolve=>{release=resolve;});
  const a=load('s'),b=createStudyPlanNoteMetadataLoader('other-user')('s');
  assert.notEqual(a,b);release();await Promise.all([a,b]);
});

test('study plan titles, navigation, progress and toggling work with metadata alone', async () => {
  reset();const host=hookHost(()=>useStudyPlan('s'));
  host.render();await host.flush();const plan=host.render();
  assert.equal(calls.length,1);
  const [note,pdf,video]=globalThis.__planTopics[0].resources;
  assert.equal(plan.getResourceTitle(note),'Lecture note');assert.equal(plan.getResourceUrl(note),'/fag/s/notater/lecture');
  assert.equal(plan.getResourceTitle(pdf),'PDF');assert.equal(plan.getResourceUrl(pdf),'/fag/s/pdfs/p1');
  assert.equal(plan.getResourceTitle(video),'Video');assert.equal(plan.getResourceUrl(video),'/fag/s/videoer');
  assert.equal(plan.isResourceCompleted(note),true);
  assert.deepEqual(plan.progressSummary,{completed:3,total:4,percentage:75});
  assert.deepEqual(plan.getTopicProgress(globalThis.__planTopics[0]),plan.progressSummary);
  const missing={resourceType:'note',resourceId:'missing'};
  assert.equal(plan.getResourceTitle(missing),'Ukjent notat');assert.equal(plan.getResourceUrl(missing),'/fag/s/notater');
  await plan.toggleItem('study-topic-plan-item-i');
  assert.deepEqual(globalThis.__planOps[0],['saveStudyPlanItem','u','s','study-topic-plan-item-i',false]);
  assert.equal(host.render().progressSummary.completed,2);
  await host.flush();assert.equal(calls.length,1);
});

test('admin reuses metadata for selection and same-subject editing, preserving save payloads', async () => {
  reset();const previousWindow=globalThis.window;globalThis.window={scrollTo(){}};
  try {
    const host=hookHost(useAdminStudyPlans);host.render();await host.flush();let admin=host.render();
    assert.equal(calls.length,0);admin.handleSubjectChange('s');host.render();await host.flush();admin=host.render();
    assert.equal(admin.availableNotes[0].title,row.title);assert.equal('content' in admin.availableNotes[0],false);assert.equal(calls.length,1);
    admin.toggleNote('note1');admin=host.render();assert.deepEqual(admin.selectedNoteIds,['note1']);await host.flush();assert.equal(calls.length,1);
    admin.handleEdit(globalThis.__planTopics[0]);host.render();await host.flush();admin=host.render();
    assert.deepEqual(admin.selectedNoteIds,['note1']);assert.equal(admin.reading,'Read');assert.equal(calls.length,1);
    admin.setReading('Revised reading');admin=host.render();
    await admin.handleSubmit({preventDefault(){}});
    assert.deepEqual(globalThis.__planOps.find(([op])=>op==='update'),['update','plan','Plan',0]);
    assert.deepEqual(globalThis.__planOps.find(([op])=>op==='items'),['items','plan',[{type:'reading',value:'Revised reading'}]]);
    assert.deepEqual(globalThis.__planOps.find(([op])=>op==='resources'),['resources','plan',[
      {resourceType:'pdf',resourceId:'p1'},{resourceType:'note',resourceId:'note1'},{resourceType:'video',resourceId:'v1'},
    ]]);
    assert.equal(host.render().successMessage,'Studietemaet ble oppdatert.');
  } finally {globalThis.window=previousWindow;}
});

test('full-content note reads remain available; synthetic payload comparison uses the real projections', async () => {
  reset();await notesService.getNotesBySubject('s');const before={calls:calls.length,bytes};
  calls=[];bytes=0;await createStudyPlanNoteMetadataLoader('u')('s');const after={calls:calls.length,bytes};
  assert.equal(before.calls,1);assert.equal(after.calls,1);assert.ok(after.bytes<before.bytes);
  const full=await notesService.getNoteBySlug('s','lecture');
  assert.equal(full.content,row.content);assert.deepEqual(full.contentJson,row.content_json);
  console.log('Synthetic single-note JSON response bodies:',JSON.stringify({before,after}));
});

test('admin creation, cancellation and deletion preserve study-plan actions', async () => {
  reset();const previousWindow=globalThis.window;globalThis.window={scrollTo(){},confirm:()=>true};
  try {
    const host=hookHost(useAdminStudyPlans);host.render();await host.flush();let admin=host.render();
    admin.handleSubjectChange('s');host.render();await host.flush();admin=host.render();
    admin.setStructureTopicId('structure');admin.setReading('First\nSecond');admin.toggleNote('note1');admin=host.render();
    await admin.handleSubmit({preventDefault(){}});
    assert.deepEqual(globalThis.__planOps.find(([op])=>op==='create'),['create','s','structure',null,'topic','Topic',0]);
    assert.deepEqual(globalThis.__planOps.find(([op])=>op==='items'),['items','created',[{type:'reading',value:'First'},{type:'reading',value:'Second'}]]);
    assert.deepEqual(globalThis.__planOps.find(([op])=>op==='resources'),['resources','created',[{resourceType:'note',resourceId:'note1'}]]);
    admin=host.render();assert.equal(admin.successMessage,'Studietemaet ble opprettet.');assert.equal(admin.subjectId,'');
    admin.handleEdit(globalThis.__planTopics[0]);admin=host.render();admin.cancelEdit();admin=host.render();
    assert.equal(admin.editingTopic,null);assert.deepEqual(admin.selectedNoteIds,[]);
    await admin.handleDelete(globalThis.__planTopics[0]);
    assert.deepEqual(globalThis.__planOps.find(([op])=>op==='delete'),['delete','plan']);
    assert.deepEqual(host.render().studyTopics,[]);
  } finally {globalThis.window=previousWindow;}
});
