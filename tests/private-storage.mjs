// node --experimental-vm-modules tests/private-storage.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

let session = { user: { id: 'reader', is_anonymous: false }, access_token: 'test' };
let signCalls = [];
let signer = async (_bucket, path) => ({ data: { signedUrl: `https://files.invalid/${path}?token=runtime-only` }, error: null });
let authListener;
let unsubscribed = 0;
const timers = new Map();
let nextTimer = 0;
const supabase = {
  auth: {
    getSession: async () => ({ data: { session }, error: null }),
    onAuthStateChange: listener => { authListener = listener; return { data: { subscription: { unsubscribe: () => { unsubscribed++; } } } }; },
  },
  storage: { from: bucket => ({ createSignedUrl: async (path, ttl) => { signCalls.push({ bucket, path, ttl }); return signer(bucket, path); } }) },
};
const context = vm.createContext({ URL, setTimeout: (fn, ms) => { const id=++nextTimer;timers.set(id,{ fn, ms });return id; }, clearTimeout: id => timers.delete(id) });
const output = ts.transpileModule(await readFile('src/services/media/privateStorage.ts','utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const mod = new vm.SourceTextModule(output, { context, initializeImportMeta(meta) { meta.env = { VITE_SUPABASE_URL: 'https://project.supabase.co' }; } });
await mod.link(() => new vm.SyntheticModule(['supabase'], function () { this.setExport('supabase', supabase); }, { context }));
await mod.evaluate();
const api = mod.namespace;
const flush = async () => { for(let i=0;i<12;i++) await Promise.resolve(); };
const path = 'owner/image with space.png';
assert.equal(api.getNoteImagePath(api.noteImageReference(path)), path);
assert.equal(api.getNoteImagePath('https://project.supabase.co/storage/v1/object/public/note-images/owner/image%20with%20space.png'), path);
assert.equal(api.getNoteImagePath('https://project.supabase.co/storage/v1/object/sign/note-images/owner/image.png?token=old'), 'owner/image.png');
for(const bad of ['https://other.invalid/storage/v1/object/public/note-images/x.png', 'supabase-storage://pdfs/x', 'supabase-storage://note-images/a/%2e%2e%2fx', 'supabase-storage://note-images/a?token=secret']) assert.equal(api.getNoteImagePath(bad), null);
console.log('PASS permanent/legacy references, encoding and project/bucket boundaries');

for(const bucket of ['pdfs','note-images']) {
  signCalls=[];
  assert.match(await api.createPrivateStorageUrl(bucket,'owner/test.pdf'), /runtime-only/);
  assert.equal(signCalls[0].ttl,300);
  session=null;
  await assert.rejects(api.createPrivateStorageUrl(bucket,'owner/test.pdf'), /Logg inn/);
  session={ user:{ id:'guest',is_anonymous:true } };
  await assert.rejects(api.createPrivateStorageUrl(bucket,'owner/test.pdf'), /Logg inn/);
  assert.equal(signCalls.length,1);
  session={ user:{ id:'reader',is_anonymous:false } };
}
console.log('PASS registered readers can request URLs; unauthenticated/anonymous users cannot');
signer=async()=>({ data:null,error:{ message:'private provider details' } });
await assert.rejects(api.createPrivateStorageUrl('pdfs','file.pdf'), /Kontroller at du har tilgang/);
signer=async(_bucket,path)=>({ data:{ signedUrl:`https://files.invalid/${path}` },error:null });
const states=[];
const release=api.watchPrivateStorageUrl('pdfs','file.pdf',state=>states.push(state));
await flush();
assert.ok(states.at(-1).url);
const renewal=[...timers.values()].find(t=>t.ms===240000);
assert.ok(renewal);
renewal.fn();await flush();assert.ok(states.at(-1).url);
session=null;authListener('SIGNED_OUT');
assert.equal(states.at(-1).url,null);
[...timers.values()].find(t=>t.ms===0).fn();await flush();
assert.equal(states.at(-1).url,null);
release();assert.equal(unsubscribed,1);
console.log('PASS renewal, sign-out clearing, safe denial and unsubscribe');

session={ user:{ id:'reader' } };
let resolve;
signer=()=>new Promise(r=>{ resolve=r; });
const late=[];
const stop=api.watchPrivateStorageUrl('note-images','image.png',state=>late.push(state));
await flush();
session=null;authListener('SIGNED_OUT');
resolve({ data:{ signedUrl:'https://files.invalid/stale' },error:null });await flush();
assert.equal(late.at(-1).url,null);
stop();
console.log('PASS in-flight URLs cannot reappear after sign-out/disposal');
