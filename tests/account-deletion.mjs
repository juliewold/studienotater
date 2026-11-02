// Offline only: node --experimental-vm-modules tests/account-deletion.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const id='00000000-0000-0000-0000-000000000001';
const other='00000000-0000-0000-0000-000000000002';
const seconds=1800000000;
const token=(claims={})=>'test.'+Buffer.from(JSON.stringify({sub:id,amr:[{method:'password',timestamp:seconds}],...claims})).toString('base64url')+'.verified-by-mock-auth';
async function load(path, globals={}, dependencies={}) {
 const context=vm.createContext({URL,Headers,Request,Response,AbortSignal,atob,Date,TextDecoder,...globals});
 const output=ts.transpileModule(await readFile(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
 const mod=new vm.SourceTextModule(output,{context});
 await mod.link(name=>new vm.SyntheticModule(Object.keys(dependencies[name]),function(){for(const [key,value] of Object.entries(dependencies[name]))this.setExport(key,value);},{context}));
 await mod.evaluate();return mod.namespace;
}
const {createDeleteAccountHandler}=await load('supabase/functions/delete-account/handler.ts');
const config={url:'https://project.invalid',publicKey:'public-test-key',secretKey:'server-only-test-secret',enabled:true,origins:['https://juliewold.github.io']};
let calls=[];let authStatus=200;let user={id,is_anonymous:false};let rpcStatus=204;let rpcMessage='unknown';let deleteStatus=200;let throwDelete=false;let absenceStatus=404;let absenceBody={code:'user_not_found'};let throwAbsence=false;
const transport=async(url,init)=>{
 calls.push({url,init});assert.equal(init.redirect,'error');assert.ok(init.signal);
 if(url.endsWith('/auth/v1/user'))return Response.json(user,{status:authStatus});
 if(url.endsWith('/rpc/account_deletion_preflight'))return rpcStatus===204?new Response(null,{status:204}):Response.json({message:rpcMessage},{status:rpcStatus});
 assert.equal(url,'https://project.invalid/auth/v1/admin/users/'+id);
 if(init.method!=='DELETE'){
  if(throwAbsence)throw Error('verification unavailable');
  return Response.json(absenceBody,{status:absenceStatus});
 }
 assert.ok([config.secretKey,'sb_secret_synthetic'].includes(init.headers.apikey));assert.equal(init.method,'DELETE');
 assert.deepEqual(JSON.parse(init.body),{should_soft_delete:false});
 if(throwDelete)throw Error('network lost with private provider details');
 return Response.json({}, {status:deleteStatus});
};
const handler=createDeleteAccountHandler(config,transport,()=>seconds*1000);
const request=(jwt=token(),body={confirmation:'DELETE'},extra={})=>new Request('https://edge.invalid/delete-account',{
 method:'POST',headers:{'Content-Type':'application/json',Origin:config.origins[0],...(jwt?{Authorization:'Bearer '+jwt}:{})},body:JSON.stringify(body),...extra,
});
async function check(req,status,code,destructive=false){calls=[];const r=await handler(req);assert.equal(r.status,status);const body=await r.json();assert.equal(body.code,code);assert.equal(calls.some(c=>c.init.method==='DELETE'),destructive);assert.ok(!JSON.stringify(body).includes(config.secretKey));assert.equal(r.headers.get('Cache-Control'),'no-store');}
await check(request(null),401,'UNAUTHENTICATED');
authStatus=401;await check(request('bad'),401,'UNAUTHENTICATED');authStatus=200;
authStatus=401;await check(request(token({exp:seconds-1})),401,'UNAUTHENTICATED');authStatus=200;
await check(request('malformed'),401,'UNAUTHENTICATED');
await check(request(token({sub:other})),401,'UNAUTHENTICATED');
await check(request(token(),{confirmation:'DELETE',user_id:other}),400,'INVALID_REQUEST');
await check(request(token(),{confirmation:'no'}),400,'INVALID_REQUEST');
await check(request(token(),{confirmation:'DELETE',padding:'x'.repeat(1100)}),400,'INVALID_REQUEST');
await check(request(token(),{}, {headers:{Origin:'https://attacker.invalid'}}),403,'ORIGIN_DENIED');
await check(request(token({iat:seconds,amr:[{method:'password',timestamp:seconds-301}]})),409,'REAUTHENTICATION_REQUIRED');
await check(request(token({amr:[]})),409,'REAUTHENTICATION_REQUIRED');
await check(request(token({amr:[{method:'password',timestamp:seconds+1000}]})),409,'REAUTHENTICATION_REQUIRED');
user={id,is_anonymous:true};await check(request(),403,'REGISTERED_ACCOUNT_REQUIRED');
user={id,is_anonymous:false,factors:[{status:'verified'}]};await check(request(),409,'MFA_REQUIRED');user={id,is_anonymous:false};
rpcStatus=400;rpcMessage='ACCOUNT_STORAGE_OWNERSHIP';await check(request(),409,'STORAGE_REVIEW_REQUIRED');
rpcMessage='unknown schema with private details';await check(request(),503,'SCHEMA_REVIEW_REQUIRED');rpcStatus=204;
deleteStatus=500;await check(request(),503,'DELETION_NOT_CONFIRMED',true);deleteStatus=200;
throwDelete=true;await check(request(),503,'DELETION_NOT_CONFIRMED',true);throwDelete=false;
absenceStatus=200;absenceBody={id};await check(request(),503,'DELETION_NOT_CONFIRMED',true);
absenceStatus=404;absenceBody={message:'route not found'};await check(request(),503,'DELETION_NOT_CONFIRMED',true);
throwAbsence=true;await check(request(),503,'DELETION_NOT_CONFIRMED',true);throwAbsence=false;
absenceBody={error_code:'user_not_found'};await check(request(),200,'ACCOUNT_DELETED',true);
absenceBody={code:'user_not_found'};
await check(request(),200,'ACCOUNT_DELETED',true);
assert.equal(calls[0].init.headers.apikey,config.publicKey);
assert.deepEqual(JSON.parse(calls[1].init.body),{p_user_id:id});
assert.equal((await createDeleteAccountHandler({...config,enabled:false},transport)(request())).status,503);
assert.equal((await handler(new Request('https://edge.invalid',{method:'OPTIONS',headers:{Origin:config.origins[0]}}))).status,204);
assert.equal((await handler(new Request('https://edge.invalid'))).status,405);
calls=[];assert.equal((await createDeleteAccountHandler({...config,secretKey:'sb_secret_synthetic'},transport,()=>seconds*1000)(request())).status,200);
assert.equal(calls[1].init.headers.apikey,'sb_secret_synthetic');assert.equal(calls[1].init.headers.Authorization,undefined);
console.log('PASS: Edge Function authentication, authorization, confirmation, reauthentication, failure, CORS, key formats and deletion checks');

let expectedUser={id,email:'synthetic@example.invalid',is_anonymous:false};let signedInId=id;let passwordError=false;let invokeError=null;let invokeThrows=false;let invokeResult={code:'ACCOUNT_DELETED'};let invokeCalls=[];let authCalls=[];const removed=[];
const supabase={auth:{
 getUser:async()=>({data:{user:expectedUser},error:null}),
 signInWithPassword:async args=>{authCalls.push(args);return {data:{user:{id:signedInId},session:{access_token:'fresh-test-token'}},error:passwordError?{}:null};},
 signOut:async args=>{authCalls.push(args);return {error:null};},
},functions:{invoke:async(name,args)=>{invokeCalls.push({name,args});if(invokeThrows)throw Error('sensitive provider details');return {data:invokeResult,error:invokeError};}}};
const client=await load('src/services/account/accountDeletionService.ts',{localStorage:{removeItem:key=>removed.push(key)}},{'../../lib/supabase':{supabase}});
await assert.rejects(client.deleteOwnAccount('password',other),/Økten/);assert.equal(invokeCalls.length,0);
await assert.rejects(client.deleteOwnAccount('',id),/passord/);
passwordError=true;await assert.rejects(client.deleteOwnAccount('bad-password',id),/Passordet/);assert.equal(invokeCalls.length,0);passwordError=false;
signedInId=other;await assert.rejects(client.deleteOwnAccount('password',id),/Passordet/);signedInId=id;
invokeError={context:Response.json({code:'STORAGE_REVIEW_REQUIRED'})};await assert.rejects(client.deleteOwnAccount('password',id),/eier opplastede filer/);assert.equal(removed.length,0);
invokeError={context:Response.json({code:'DELETION_NOT_CONFIRMED'})};await assert.rejects(client.deleteOwnAccount('password',id),/kan være slettet/);assert.equal(removed.length,0);
invokeError=null;invokeResult={code:'not-success'};await assert.rejects(client.deleteOwnAccount('password',id),/ikke bekreftes/);
invokeThrows=true;await assert.rejects(client.deleteOwnAccount('password',id),error=>error.message.includes('kan være slettet')&&!error.message.includes('sensitive'));invokeThrows=false;
invokeResult={code:'ACCOUNT_DELETED'};await client.deleteOwnAccount('password',id);
const invocation=invokeCalls.at(-1);assert.equal(invocation.name,'delete-account');assert.deepEqual(JSON.parse(JSON.stringify(invocation.args.body)),{confirmation:'DELETE'});assert.equal(invocation.args.headers.Authorization,'Bearer fresh-test-token');assert.ok(!JSON.stringify(invocation.args).includes('password'));
assert.equal(await client.finishDeletedAccountSession(),true);assert.deepEqual(removed,[]);assert.deepEqual(JSON.parse(JSON.stringify(authCalls.at(-1))),{scope:'local'});
console.log('PASS: client identity races, password verification, token forwarding, safe failures, narrow browser cleanup and local sign-out');
