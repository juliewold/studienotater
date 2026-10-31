import { supabase } from '../src/lib/supabase.ts';
import { getAllNotes } from '../src/services/notes/notesService.ts';
import { getConceptsFromDatabase } from '../src/services/concepts/conceptService.ts';
import { createConceptContentSession, getConceptContentFromNote } from '../src/services/concepts/conceptContentService.ts';
import { resolveSourceConcepts } from '../src/services/concepts/sourceConceptResolver.ts';
import { getConceptContentSession } from '../src/services/concepts/conceptContentCache.ts';
import { notifyNotesChanged } from '../src/services/notes/notesNavigationEvents.ts';
import { notifyConceptsChanged } from '../src/services/concepts/conceptContentEvents.ts';
import { buildSourceNoteFilter } from '../src/services/concepts/conceptSourceNotesService.ts';
const output = document.getElementById('results');
const results = [];
const check = (condition, message) => { if (!condition) throw Error(message); };
const equal = (a,b,message) => check(JSON.stringify(a) === JSON.stringify(b),message);
const box = (body,attrs='') => `<div data-type="callout" data-callout-type="definition" ${attrs}><div class="note-callout-body">${body}</div></div>`;
const source = (id,content,subject='s',subtopic=null) => ({id,subject_id:subject,slug:id,title:id,sort_order:0,created_at:'2026-10-30',folder_id:null,subtopic_id:subtopic,subtopics:null,description:'',content,content_json:{text:'J'.repeat(10000)}});
let calls, bytes, failedTable, gate, rows;
const originalNotes = [
  source('a',box('<p>Explicit definition</p>','data-concept-id="target"'),'s','linked'),
  source('b','<h2>Alpha Beta</h2>'+box('<p>Legacy definition</p>'),'other'),
  source('c','<h2>&#65;lpha Beta</h2>'+box('<p>Entity heading</p>'),'other'),
  source('d','<h2>Al<strong>pha</strong> Beta</h2>'+box('<p>Split heading</p>')),
  source('e','<h2>Ａlpha Beta</h2>'+box('<p>Unicode compatibility heading</p>')),
  source('f','<h2>2.1 Alpha Beta — subtitle</h2><p>Formula context</p><div data-type="block-math" data-latex="x^2"></div>'),
  source('g',box('<p>Named box</p>','data-concept-name="Alpha Beta"')),
  source('h',box('<p>Parent</p>'+box('<p>Other child</p>','data-concept-id="other"'),'data-concept-id="target"')),
  source('i',box('<p>Secondary note placement</p>','data-concept-id="target"'),'s'),
  source('j',box('<p>Unrelated</p>','data-concept-id="other"'),'s','linked'),
  ...Array.from({length:20},(_,i)=>source(`unrelated-${i}`,box('<p>Other source</p>','data-concept-id="other"'),'unrelated')),
  source('plain','<p>Plain text without a source box.</p>','unrelated'),
];
function reset() {
  calls=[];bytes=0;failedTable=null;gate=Promise.resolve();
  rows={notes:originalNotes,concepts:[{id:'target',name:'Alpha Beta',slug:'alpha-beta',type:'definition',short_definition:'Fallback definition',explanation:'E'.repeat(5000)},{id:'other',name:'Other',slug:'other',type:'definition',short_definition:'Other',explanation:'Other explanation'}],
    concept_subtopics:[{concept_id:'target',subtopic_id:'linked'}],subtopics:[{id:'linked',topic_id:'topic',name:'Linked'}],topics:[{id:'topic',subject_id:'s',name:'Topic'}],note_subtopics:[{note_id:'i',subtopic_id:'linked'}]};
}
function projection(row, select) {
  if (select.trim()==='*') return row;
  const parts=[];let depth=0,begin=0;
  for(let i=0;i<select.length;i++){if(select[i]==='(')depth++;if(select[i]===')')depth--;if(select[i]===','&&!depth){parts.push(select.slice(begin,i));begin=i+1;}}
  parts.push(select.slice(begin));
  return Object.fromEntries(parts.map(p=>p.trim().split(/[!(\s]/)[0]).filter(Boolean).map(key=>[key,row[key]]));
}
function candidate(note, filter) {
  const regexes=[...filter.matchAll(/content\.imatch\.("(?:\\.|[^"\\])*")/g)].map(match=>JSON.parse(match[1]));
  const matches=regexes.length > 0 && regexes.every(pattern=>new RegExp(pattern.replaceAll('[:space:]','\\s'),'is').test(note.content??''));
  return matches || (note.subtopic_id && filter.includes(JSON.stringify(note.subtopic_id))) || filter.includes(`id.in.(${JSON.stringify(note.id)})`);
}
supabase.from = table => {
  const call={table,select:'',filters:[],range:null,or:null,single:false};calls.push(call);
  const query=new Proxy({}, {get:(_,method)=> method==='then' ? (resolve,reject)=>gate.then(()=>{
    if(failedTable===table)return {data:null,error:new Error('offline')};
    let data=rows[table].filter(row=>call.filters.every(([op,key,value])=>op==='eq'?row[key]===value:value.includes(row[key])));
    if(call.or)data=data.filter(row=>candidate(row,call.or));
    if(call.range)data=data.slice(call.range[0],call.range[1]+1);
    data=data.map(row=>projection(row,call.select));
    if(call.single)data=data[0]??null;
    bytes+=new TextEncoder().encode(JSON.stringify(data)).length;
    return {data,error:null};
  }).then(resolve,reject) : (...args)=>{
    if(['insert','update','delete','upsert'].includes(method))throw Error('Unexpected write');
    if(method==='select')call.select=args[0];
    if(method==='or')call.or=args[0];
    if(['eq','in'].includes(method))call.filters.push([method,...args]);
    if(method==='range')call.range=args;
    if(method==='maybeSingle')call.single=true;
    return query;
  }});
  return query;
};
globalThis.fetch=()=>{throw Error('Unexpected live network request');};
async function baseline() {
  const [notes,concepts]=await Promise.all([getAllNotes(),getConceptsFromDatabase()]);
  return notes.flatMap(note=>getConceptContentFromNote(resolveSourceConcepts(note.content,concepts),'target').map(item=>({...item,noteId:note.id,noteTitle:note.title,subjectId:note.subjectId,noteSlug:note.slug})));
}
async function run(name,test){reset();await test();results.push(`PASS ${name}`);output.textContent=results.join('\n');}
try {
  await run('all source blocks and citations match the old global HTML resolver',async()=>{
    const expected=await baseline();calls=[];bytes=0;
    const session=createConceptContentSession();const actual=await session.getContent('target');
    equal(actual,expected,'Source content/citations changed');
    equal(actual.map(item=>item.noteId),['a','b','c','d','e','f','g','h','i'],'Missing explicit or legacy source');
    const query=calls.find(call=>call.table==='notes');
    check(query.or,'Missing server-side candidate filter');check(!query.select.includes('content_json'),'JSON downloaded');
    check(!actual.find(item=>item.noteId==='h').documentHtml.includes('Other child'),'Nested foreign ownership leaked');
    check(actual.find(item=>item.noteId==='f').latex==='x^2','Formula lost');
    check(actual.find(item=>item.noteId==='f').contextHtml.includes('Formula context'),'Formula context lost');
  });
  await run('source loading reuses the membership lookup with the context view',async()=>{
    const session=createConceptContentSession();const [sources,contexts]=await Promise.all([session.getContent('target'),session.getContexts('target')]);
    check(sources.length===9,'Missing sources');equal(contexts,[{subjectId:'s',topicId:'topic',topicName:'Topic',subtopicId:'linked',subtopicName:'Linked'}],'Context navigation changed');
    check(calls.filter(call=>call.table==='concept_subtopics').length===1,'Duplicate membership requests');
  });
  await run('concurrent and repeated page/popover reads share results',async()=>{
    let release;gate=new Promise(resolve=>{release=resolve;});const session=createConceptContentSession();
    const first=session.getContent('target');check(session.getContent('target')===first,'In-flight not shared');release();await first;
    const reads=calls.length;await session.getContent('target');check(calls.length===reads,'Completed source reread');
    const concept=session.getConcept('alpha-beta');check(session.getConcept('alpha-beta')===concept,'Slug request not shared');
    check((await concept).explanation.length===5000,'Explanation changed');
  });
  await run('missing links preserve unlinked cross-subject legacy sources',async()=>{
    rows.concept_subtopics=[];const expected=await baseline();calls=[];
    equal(await createConceptContentSession().getContent('target'),expected,'Unlinked sources lost');
    check(!calls.some(call=>call.table==='note_subtopics'),'Unnecessary secondary link query');
  });
  await run('duplicate normalized names remain ambiguous',async()=>{
    rows.concepts.push({...rows.concepts[0],id:'duplicate',slug:'duplicate'});
    const expected=await baseline();equal(await createConceptContentSession().getContent('target'),expected,'Ambiguity changed');
    check(expected.every(item=>['a','h','i'].includes(item.noteId)),'Legacy names guessed');
  });
  await run('relationship errors do not hide independently discoverable HTML',async()=>{
    const expected=await baseline();failedTable='concept_subtopics';
    const session=createConceptContentSession();equal(await session.getContent('target'),expected,'Membership failure hid content');
    let rejected=false;try{await session.getContexts('target');}catch{rejected=true;}check(rejected,'Context failure hidden');
  });
  await run('secondary-link failures retain source discovery',async()=>{
    const expected=await baseline();failedTable='note_subtopics';equal(await createConceptContentSession().getContent('target'),expected,'Secondary failure hid sources');
  });
  await run('failed content reads can be retried',async()=>{
    const session=createConceptContentSession();failedTable='notes';let rejected=false;
    try{await session.getContent('target');}catch{rejected=true;}check(rejected,'Missing source error');
    failedTable=null;check((await session.getContent('target')).length===9,'Retry failed');
  });
  await run('source candidates are paginated without duplicates',async()=>{
    rows.notes=Array.from({length:501},(_,i)=>source(`n${i}`,box('<p>Source</p>','data-concept-id="target"')));
    const result=await createConceptContentSession().getContent('target');check(result.length===501,'Pagination truncated sources');
    check(calls.filter(call=>call.table==='notes').length===2,'Expected two pages');
  });
  await run('empty source results preserve fallback behavior',async()=>{
    rows.notes=[];equal(await createConceptContentSession().getContent('target'),[],'Missing empty result');
  });
  await run('cache resets on note/concept changes and user/role switches',async()=>{
    const a=getConceptContentSession('user:reader');check(getConceptContentSession('user:reader')===a,'Scope not reused');
    notifyNotesChanged();const b=getConceptContentSession('user:reader');check(a!==b,'Note change retained cache');
    notifyConceptsChanged();const c=getConceptContentSession('user:reader');check(b!==c,'Concept change retained cache');
    check(getConceptContentSession('user:admin')!==c,'Role shared cache');check(getConceptContentSession('other:admin')!==c,'User shared cache');
  });
  await run('literal regex/filter quoting and Unicode fallback remain conservative',async()=>{
    const filter=buildSourceNoteFilter('id.*(x)"','Alpha Beta',[],[]);
    const patterns=[...filter.matchAll(/content\.imatch\.("(?:\\.|[^"\\])*")/g)].map(match=>JSON.parse(match[1]));
    check(new RegExp(patterns[1].replaceAll('[:space:]','\\s'),'is').test('id.*(x)"'),'Literal ID not matched');
    check(!new RegExp(patterns[1].replaceAll('[:space:]','\\s'),'is').test('idXXXXx'),'ID treated as regex');
  });
  await run('ambiguity after the first name-index page remains unresolved',async()=>{
    rows.concepts.push(...Array.from({length:500},(_,i)=>({id:`filler-${i}`,name:`Filler ${i}`})),{id:'duplicate',name:'Alpha Beta'});
    const result=await createConceptContentSession().getContent('target');
    equal(result.map(item=>item.noteId),['a','h','i'],'Name index truncated');
    check(calls.filter(call=>call.table==='concepts').length===2,'Index pagination missing');
  });
  await run('synthetic before/after requests and response bodies',async()=>{
    await baseline();const before={calls:calls.length,bytes};calls=[];bytes=0;
    const session=createConceptContentSession();await session.getContent('target');const cold={calls:calls.length,bytes};
    calls=[];bytes=0;await session.getContent('target');const warm={calls:calls.length,bytes};
    check(cold.bytes<before.bytes,'No payload saving');check(warm.calls===0,'Warm reads fetched again');
    results.push(JSON.stringify({before,cold,warm}));
  });
  document.body.dataset.status='passed';output.textContent=`${results.filter(result=>result.startsWith('PASS')).length} tests passed\n`+results.join('\n');
} catch(error) {document.body.dataset.status='failed';output.textContent=results.join('\n')+'\nFAIL '+error.stack;}
