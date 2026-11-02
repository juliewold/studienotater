// Real local services only. Never reads .env, connects to a linked project or
// accepts a remote URL. CLI status must belong to a fresh /tmp integration root.
// node tests/account-deletion.integration.mjs /tmp/studienotater-account-integration-... setup|run|verify-ui
import assert from 'node:assert/strict';
import { readFile, writeFile, realpath } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

process.on('uncaughtException',error=>{
 const message=String(error.message).replace(/postgres(?:ql)?:\/\/\S+|eyJ[\w-]+\.[\w-]+\.[\w-]+|sb_(?:secret|publishable)_[\w-]+/g,'[redacted]');
 console.error('FAIL:',message);process.exit(1);
});

const root=await realpath(process.argv[2] ?? '');
assert.match(root,/^\/(?:private\/)?tmp\/studienotater-account-integration-[^/]+$/);
const status=JSON.parse(await readFile(path.join(root,'connection.json'),'utf8'));
assert.equal(await realpath(status.identity.project_root),root);
assert.equal(status.runtime,'native');
const env=status.env;
const api=new URL(env.API_URL);const db=new URL(env.DB_URL);
for(const endpoint of [api,db]) assert.ok(['127.0.0.1','localhost'].includes(endpoint.hostname),'Remote endpoint forbidden');
assert.equal(api.protocol,'http:');assert.equal(db.pathname,'/postgres');
const admin=createClient(api.origin,env.SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const tables=['favorites','progress','book_progress','book_task_progress','exam_task_progress','semester_subjects'];
const password='Synthetic-Account-Delete-2026!';
const sql=query=>execFileSync('psql',['-X','-q','-A','-t','-v','ON_ERROR_STOP=1','--dbname',env.DB_URL,'--command',query],{
 encoding:'utf8',stdio:['ignore','pipe','pipe'],env:{PATH:process.env.PATH,LANG:'en_US.UTF-8'},
}).trim();
const scalar=query=>JSON.parse(sql(query));
const uuid=id=>{assert.match(id,/^[0-9a-f-]{36}$/);return `'${id}'::uuid`;};
const marker=()=>assert.equal(sql("SELECT name FROM public.account_deletion_integration_marker"),'synthetic-only');
async function createUser(label,role='user'){
 const email=`account-delete-${label}@example.invalid`;
 const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true});
 assert.equal(error,null,`create synthetic ${label}`);const id=data.user.id;
 sql(`INSERT INTO profiles(id,role,username,full_name) VALUES (${uuid(id)},'${role}','synthetic-${label}','Synthetic account');`+
  tables.map(t=>`INSERT INTO ${t}(user_id,value) VALUES (${uuid(id)},'synthetic-${label}');`).join('')+
  `INSERT INTO calendar_events(user_id,title) VALUES (${uuid(id)},'synthetic calendar');`);
 return {id,email,role};
}
async function session(user){
 const client=createClient(api.origin,env.PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.auth.signInWithPassword({email:user.email,password});
 assert.equal(error,null,'Synthetic password login must succeed');
 return {client,token:data.session.access_token};
}
async function remove(user,body={confirmation:'DELETE'}){
 const {token}=await session(user);
 const r=await fetch(api.origin+'/functions/v1/delete-account',{method:'POST',headers:{apikey:env.PUBLISHABLE_KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
 return {status:r.status,...await r.json()};
}
function snapshot(user){
 return scalar(`SELECT json_build_object('auth',(SELECT to_jsonb(u) FROM auth.users u WHERE id=${uuid(user.id)}),`+
 `'identities',(SELECT coalesce(jsonb_agg(to_jsonb(i) ORDER BY id),'[]') FROM auth.identities i WHERE user_id=${uuid(user.id)}),`+
 `'sessions',(SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY id),'[]') FROM auth.sessions s WHERE user_id=${uuid(user.id)}),`+
 `'refresh_tokens',(SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY id),'[]') FROM auth.refresh_tokens t WHERE user_id::text=${uuid(user.id)}::text),`+
 `'mfa_factors',(SELECT coalesce(jsonb_agg(to_jsonb(f) ORDER BY id),'[]') FROM auth.mfa_factors f WHERE user_id=${uuid(user.id)}),`+
 `'profile',(SELECT to_jsonb(p) FROM profiles p WHERE id=${uuid(user.id)}),`+
 tables.map(t=>`'${t}',(SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY id),'[]') FROM ${t} x WHERE user_id=${uuid(user.id)})`).join(',')+
 `,'calendar',(SELECT coalesce(jsonb_agg(to_jsonb(c) ORDER BY id),'[]') FROM calendar_events c WHERE user_id=${uuid(user.id)}))`);
}
function personalState(user){
 return scalar(`SELECT json_build_object('profile',(SELECT to_jsonb(p) FROM profiles p WHERE id=${uuid(user.id)}),`+
 tables.map(t=>`'${t}',(SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY id),'[]') FROM ${t} x WHERE user_id=${uuid(user.id)})`).join(',')+
 `,'calendar',(SELECT coalesce(jsonb_agg(to_jsonb(c) ORDER BY id),'[]') FROM calendar_events c WHERE user_id=${uuid(user.id)}))`);
}
function erased(user){
 assert.equal(sql(`SELECT count(*) FROM auth.users WHERE id=${uuid(user.id)}`),'0','Auth account retained');
 assert.equal(sql(`SELECT count(*) FROM auth.identities WHERE user_id=${uuid(user.id)}`),'0','Auth identity retained');
 assert.equal(sql(`SELECT count(*) FROM auth.sessions WHERE user_id=${uuid(user.id)}`),'0','Auth session retained');
 assert.equal(sql(`SELECT count(*) FROM auth.mfa_factors WHERE user_id=${uuid(user.id)}`),'0','MFA factor retained');
 assert.equal(sql(`SELECT count(*) FROM auth.refresh_tokens WHERE user_id::text=${uuid(user.id)}::text`),'0','Refresh token retained');
 assert.equal(personalState(user).profile,null);
 for(const rows of Object.values(personalState(user)).filter(Array.isArray)) assert.equal(rows.length,0,'Personal data retained');
 assert.equal(sql('SELECT count(*) FROM account_deletion_internal.pending_checks'),'0','Pending guard retained');
}
async function assertBlocked(user,expected,expectedStatus=503){
 // Establish the sign-in before the snapshot: reauthentication legitimately
 // creates a session and changes Auth sign-in timestamps, unlike partial erasure.
 const {token}=await session(user);const before=snapshot(user);
 const r=await fetch(api.origin+'/functions/v1/delete-account',{method:'POST',headers:{apikey:env.PUBLISHABLE_KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({confirmation:'DELETE'}),signal:AbortSignal.timeout(30000)});
 assert.equal(r.status,expectedStatus);assert.equal((await r.json()).code,expected);
 assert.ok(isDeepStrictEqual(snapshot(user),before),'Blocked deletion changed Auth, identities, sessions, tokens, MFA or personal rows');
 assert.equal(sql('SELECT count(*) FROM account_deletion_internal.pending_checks'),'0');
}
async function assertFileBytes(users){
 for(const [name,expected]of [['shared.pdf','%PDF-1.4\nsynthetic shared file'],
  ...['storage-owner','ui-owner'].map(label=>[users[label].id+'/owned.pdf','%PDF-1.4\nsynthetic owned file'])]){
  const {data,error}=await admin.storage.from('account-integration-files').download(name);
  assert.equal(error,null,'Stored file unavailable');assert.equal(await data.text(),expected,'Stored bytes changed');
 }
}

if(process.argv[3]==='setup'){
 // Refuse to overwrite an existing application schema or repeat setup.
 assert.equal(sql("SELECT to_regclass('public.profiles') IS NULL"),'t');
 const schema=await readFile('tests/account-deletion.integration-schema.sql','utf8');
 sql("SET app.account_deletion.integration='synthetic-only';"+schema);
 sql(await readFile('database/migrations/20261101_account_deletion.sql','utf8'));
 const names=['survivor','reader-success','admin-success','storage-owner','unknown-dependency','silent-child','silent-parent','raised-error','early-parent','ui-success','ui-owner'];
 const users={};for(const label of names)users[label]=await createUser(label,label==='admin-success'?'admin':'user');
 sql(`INSERT INTO notes(content,created_by) VALUES ('synthetic shared note',${uuid(users['reader-success'].id)});`);
 const {error}=await admin.storage.createBucket('account-integration-files',{public:false});assert.equal(error,null);
 const upload=await admin.storage.from('account-integration-files').upload('shared.pdf',new Blob(['%PDF-1.4\nsynthetic shared file'],{type:'application/pdf'}));assert.equal(upload.error,null);
 for(const label of ['storage-owner','ui-owner']){
  const {client}=await session(users[label]);
  const r=await client.storage.from('account-integration-files').upload(users[label].id+'/owned.pdf',new Blob(['%PDF-1.4\nsynthetic owned file'],{type:'application/pdf'}));assert.equal(r.error,null,'Real owner upload failed');
 }
 await writeFile(path.join(root,'users.json'),JSON.stringify(users),{mode:0o600});
 console.log('PASS: isolated real Supabase schema, migration, 11 synthetic accounts, private bucket and real shared/owned uploads');
}else{
 marker();const users=JSON.parse(await readFile(path.join(root,'users.json'),'utf8'));
 if(process.argv[3]==='verify-ui'){
  erased(users['ui-success']);
  assert.equal(sql(`SELECT count(*) FROM auth.users WHERE id=${uuid(users['ui-owner'].id)}`),'1');
  for(const rows of Object.values(personalState(users['ui-owner'])).filter(Array.isArray))assert.equal(rows.length,1);
  const baseline=JSON.parse(await readFile(path.join(root,'verification-baseline.json'),'utf8'));
  assert.ok(isDeepStrictEqual(snapshot(users.survivor),baseline.survivor),'Frontend changed another user');
  assert.equal(sql('SELECT jsonb_agg(to_jsonb(o) ORDER BY id) FROM storage.objects o'),baseline.storage,'Frontend changed shared/owned files');
  assert.equal(sql("SELECT count(*) FROM notes WHERE content='synthetic shared note' AND created_by IS NULL"),'1');
  await assertFileBytes(users);
  console.log('PASS: frontend success erased Auth/personal data; frontend blocked owner retained Auth/personal data');
 }else if(process.argv[3]==='verify-auth'){
  const {token}=await session(users.survivor);const before=snapshot(users.survivor);const ownerBefore=snapshot(users['ui-owner']);
  for(const [credential,body,expected]of [[null,{confirmation:'DELETE'},401],['synthetic-invalid-token',{confirmation:'DELETE'},401],[token,{confirmation:'DELETE',user_id:users['ui-owner'].id},400]]){
   const r=await fetch(api.origin+'/functions/v1/delete-account',{method:'POST',headers:{apikey:env.PUBLISHABLE_KEY,...(credential?{Authorization:'Bearer '+credential}:{}),'Content-Type':'application/json'},body:JSON.stringify(body)});
   assert.equal(r.status,expected);
  }
  assert.ok(isDeepStrictEqual(snapshot(users.survivor),before));assert.ok(isDeepStrictEqual(snapshot(users['ui-owner']),ownerBefore));
  console.log('PASS: real missing/invalid tokens and cross-user target attempt rejected without account changes');
 }else if(process.argv[3]==='verify-rollback-auth'){
  await assertBlocked(users['storage-owner'],'STORAGE_REVIEW_REQUIRED',409);
  sql('CREATE TRIGGER skip_child BEFORE DELETE ON favorites FOR EACH ROW EXECUTE FUNCTION integration_skip_delete();');
  await assertBlocked(users['silent-child'],'DELETION_NOT_CONFIRMED');sql('DROP TRIGGER skip_child ON favorites;');
  sql('CREATE TRIGGER zz_skip_parent BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION integration_skip_delete();');
  await assertBlocked(users['silent-parent'],'DELETION_NOT_CONFIRMED');sql('DROP TRIGGER zz_skip_parent ON auth.users;');
  sql('CREATE TRIGGER aa_skip_parent BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION integration_skip_delete();');
  await assertBlocked(users['early-parent'],'DELETION_NOT_CONFIRMED');sql('DROP TRIGGER aa_skip_parent ON auth.users;');
  sql('CREATE TRIGGER fail_delete BEFORE DELETE ON progress FOR EACH ROW EXECUTE FUNCTION integration_fail_delete();');
  await assertBlocked(users['raised-error'],'DELETION_NOT_CONFIRMED');sql('DROP TRIGGER fail_delete ON progress;');
  console.log('PASS: rollback preserves complete Auth/identity/session/refresh-token/MFA snapshots, not only application rows');
 }else{
  const untouched=snapshot(users.survivor);
  const files=sql('SELECT jsonb_agg(to_jsonb(o) ORDER BY id) FROM storage.objects o');
  for(const label of ['reader-success','admin-success']){
   const r=await remove(users[label]);assert.deepEqual(r,{status:200,code:'ACCOUNT_DELETED'},label+' deletion failed');erased(users[label]);
   console.log('PASS: real Auth/identity/session/token and all personal rows erased for '+label);
  }
  await assertBlocked(users['storage-owner'],'STORAGE_REVIEW_REQUIRED',409);
  console.log('PASS: real Storage ownership blocks deletion without changing account/data/files');
  sql('CREATE TABLE extra_personal_data(id int,user_id uuid REFERENCES auth.users ON DELETE SET NULL,private_text text);'+`INSERT INTO extra_personal_data VALUES (1,${uuid(users['unknown-dependency'].id)},'synthetic private text');`);
  await assertBlocked(users['unknown-dependency'],'SCHEMA_REVIEW_REQUIRED');
  assert.equal(sql('SELECT count(*) FROM extra_personal_data WHERE user_id IS NOT NULL'),'1');sql('DROP TABLE extra_personal_data;');
  console.log('PASS: unknown SET NULL dependency blocks deletion without detaching personal data');
  sql('CREATE FUNCTION public.integration_skip_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NULL; END $$;');
  sql('CREATE TRIGGER skip_child BEFORE DELETE ON favorites FOR EACH ROW EXECUTE FUNCTION integration_skip_delete();');
  await assertBlocked(users['silent-child'],'DELETION_NOT_CONFIRMED');sql('DROP TRIGGER skip_child ON favorites;');
  console.log('PASS: silent child DELETE cancellation rolls back real Auth deletion');
  sql('CREATE TRIGGER zz_skip_parent BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION integration_skip_delete();');
  await assertBlocked(users['silent-parent'],'DELETION_NOT_CONFIRMED');sql('DROP TRIGGER zz_skip_parent ON auth.users;');
  console.log('PASS: deferred COMMIT guard rolls back real Auth/personal cleanup after late parent cancellation');
  sql('CREATE TRIGGER aa_skip_parent BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION integration_skip_delete();');
  await assertBlocked(users['early-parent'],'DELETION_NOT_CONFIRMED');sql('DROP TRIGGER aa_skip_parent ON auth.users;');
  console.log('PASS: early Auth cancellation is not falsely reported as deletion');
  sql('CREATE FUNCTION public.integration_fail_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION \'synthetic failure\'; END $$; CREATE TRIGGER fail_delete BEFORE DELETE ON progress FOR EACH ROW EXECUTE FUNCTION integration_fail_delete();');
  await assertBlocked(users['raised-error'],'DELETION_NOT_CONFIRMED');sql('DROP TRIGGER fail_delete ON progress;');
  console.log('PASS: injected database exception rolls back real Auth and personal cleanup');
  assert.ok(isDeepStrictEqual(snapshot(users.survivor),untouched),'Other user changed');
  assert.equal(sql('SELECT jsonb_agg(to_jsonb(o) ORDER BY id) FROM storage.objects o'),files,'Storage files/metadata changed');
  assert.equal(sql("SELECT count(*) FROM notes WHERE content='synthetic shared note' AND created_by IS NULL"),'1');
  await assertFileBytes(users);
  await writeFile(path.join(root,'verification-baseline.json'),JSON.stringify({survivor:untouched,storage:files}),{mode:0o600});
  console.log('PASS: other user unchanged, shared note preserved/de-attributed and every Storage object unchanged');
 }
}
