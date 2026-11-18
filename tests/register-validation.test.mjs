// Offline checks for registration validation rules; no Supabase or network access.
// Run: node tests/register-validation.test.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile('src/pages/auth/RegisterPage/registerValidation.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }}).outputText;
const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
const { usernameRules, usernameIsValid, passwordRules, minUsernameLength, maxUsernameLength, minPasswordLength } = await import(moduleUrl);

assert.equal(minUsernameLength, 3);
assert.equal(maxUsernameLength, 30);
assert.equal(minPasswordLength, 6);

assert.equal(usernameIsValid('ab'), false, 'too short');
assert.equal(usernameIsValid('abc'), true, 'minimum length');
assert.equal(usernameIsValid('a'.repeat(30)), true, 'maximum length');
assert.equal(usernameIsValid('a'.repeat(31)), false, 'too long');
assert.equal(usernameIsValid('Ola_Nordmann-1'), true, 'allowed characters');
assert.equal(usernameIsValid('ola nordmann'), false, 'space not allowed');
assert.equal(usernameIsValid('ola@x'), false, 'symbol not allowed');
assert.equal(usernameIsValid('   '), false, 'blank not allowed');
assert.deepEqual(usernameRules('ab ').length, false, 'trimmed length counted');

assert.equal(passwordRules('12345').length, false, 'five characters is too short');
assert.equal(passwordRules('123456').length, true, 'six characters is enough');
assert.equal(passwordRules('').length, false);
console.log('PASS: username and password rules match the form');
