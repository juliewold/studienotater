import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
let calls=[],fail=null,bytes=0;
const rows={note_subtopics:[{note_id:'n',subtopic_id:'sub'}],subtopics:[{id:'sub',topic_id:'t',name:'Sub',sort_order:1}],topics:[{id:'t',subject_id:'s',name:'Topic',sort_order:1}],concept_suggestions:[{id:'suggestion',note_id:'n',status:'pending'}]};
globalThis.__editorClient={from(table){
 const call={table,filters:[],select:''};calls.push(call);
 const query=new Proxy({}, {get:(_,key)=>key==='then'?(resolve,reject)=>Promise.resolve().then(()=>{ const data=rows[table].filter(row=>call.filters.every(([op,key,value])=>op==='in'?value.includes(row[key]):row[key]===value)).map(row=>Object.fromEntries(call.select.split(',').map(k=>k.trim()).map(k=>[k,row[k]])));bytes+=Buffer.byteLength(JSON.stringify(data));return {data,error:fail===table?new Error('offline'):null};}).then(resolve,reject):(...args)=>{if(key==='select')call.select=args[0];if(['eq','in'].includes(key))call.filters.push([key,...args]);return query;}});return query;
}};
registerHooks({resolve(specifier,context,next){
 if(specifier.endsWith('/lib/supabase'))return {url:'test:editor-client',shortCircuit:true};
 if(specifier.startsWith('.')){const url=new URL(`${specifier}.ts`,context.parentURL);if(existsSync(url))return next(url.href,context);}
 return next(specifier,context);
},load(url,context,next){if(url==='test:editor-client')return {format:'module',source:'export const supabase = globalThis.__editorClient;',shortCircuit:true};return next(url,context);}});
const {createNoteEditorData}=await import('../src/services/notes/noteEditorDataService.ts');
function reset(){calls=[];fail=null;bytes=0;}
test('construction fetches no editing or suggestion data',()=>{reset();createNoteEditorData('n','s');assert.equal(calls.length,0);});
test('reading classification fetches linked IDs and only matching subtopics/topics',async()=>{
 reset();const data=createNoteEditorData('n','s');const result=await data.reading();assert.equal(calls.length,3);
 assert.deepEqual(result.ids,['sub']);assert.equal(result.topics[0].name,'Topic');assert.equal(result.subtopics[0].name,'Sub');
 assert.ok(calls[1].filters.some(([op,key,ids])=>op==='in'&&key==='id'&&ids[0]==='sub'));
 assert.ok(calls[2].filters.some(([op,key,id])=>op==='eq'&&key==='subject_id'&&id==='s'));
 await data.reading();assert.equal(calls.length,3);assert.ok(!calls.some(call=>call.table==='concept_suggestions'));
});
test('empty classification avoids structure queries',async()=>{reset();const old=rows.note_subtopics;rows.note_subtopics=[];try{const result=await createNoteEditorData('n','s').reading();assert.deepEqual(result.ids,[]);assert.equal(calls.length,1);}finally{rows.note_subtopics=old;}});
test('editing reuses links and shares concurrent requests and completed structure',async()=>{
 reset();const data=createNoteEditorData('n','s');await data.reading();calls=[];
 const first=data.editing();assert.equal(data.editing(),first);const result=await first;assert.deepEqual(result.ids,['sub']);
 assert.equal(calls.length,3);assert.ok(!calls.some(call=>call.table==='note_subtopics'));
 await data.editing();assert.equal(calls.length,3);
});
test('suggestions are lazy and explicit refresh fetches updates',async()=>{
 reset();const data=createNoteEditorData('n','s');const first=data.suggestions();assert.equal(data.suggestions(),first);await first;assert.equal(calls.length,1);
 await data.suggestions();assert.equal(calls.length,1);await data.suggestions(true);assert.equal(calls.length,2);
});
test('failed classification/editor reads retry without treating links as empty',async()=>{
 reset();const data=createNoteEditorData('n','s');fail='note_subtopics';await assert.rejects(data.editing(),/offline/);fail=null;
 assert.deepEqual((await data.editing()).ids,['sub']);
});
test('different note instances never reuse another note links',async()=>{
 reset();await createNoteEditorData('a','s').reading();await createNoteEditorData('b','s').reading();
 assert.deepEqual(calls.filter(c=>c.table==='note_subtopics').map(c=>c.filters[0][2]),['a','b']);
});

test('synthetic reading comparison excludes whole-subject structures and admin suggestions',async()=>{
 reset();const originalTopics=rows.topics,originalSubtopics=rows.subtopics;
 rows.topics=[...originalTopics,...Array.from({length:99},(_,i)=>({id:`t${i}`,subject_id:'s',name:'Topic '+i,sort_order:i+2}))];
 rows.subtopics=[...originalSubtopics,...Array.from({length:99},(_,i)=>({id:`sub${i}`,topic_id:`t${i}`,name:'Subtopic '+i,sort_order:i+2}))];
 try {
  const {getTopicsBySubject,getAllSubtopicsBySubject}=await import('../src/services/subjects/subjectStructureService.ts');
  const {getSubtopicIdsByNote}=await import('../src/services/notes/noteSubtopicsService.ts');
  const {getConceptSuggestionsByNote}=await import('../src/services/concepts/conceptSuggestionsService.ts');
  await Promise.all([getTopicsBySubject('s'),getAllSubtopicsBySubject('s'),getSubtopicIdsByNote('n'),getConceptSuggestionsByNote('n')]);
  const before={calls:calls.length,bytes};reset();await createNoteEditorData('n','s').reading();const after={calls:calls.length,bytes};
  assert.equal(before.calls,5);assert.equal(after.calls,3);assert.ok(after.bytes<before.bytes);
  console.log('Synthetic admin reading classification/suggestions:',JSON.stringify({before,after}));
 }finally{rows.topics=originalTopics;rows.subtopics=originalSubtopics;}
});
