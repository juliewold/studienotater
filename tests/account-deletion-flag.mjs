// Offline rendering of the actual Settings page; no Supabase or network access.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import * as React from 'react';
import * as jsx from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';

const source = await readFile('src/pages/SettingsPage/SettingsPage.tsx', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: {
 module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
}}).outputText;
for (const value of [undefined, 'false', '', 'TRUE', '1', 'true']) {
 const context = vm.createContext({});
 const auth = React.createContext({ user: { id: 'synthetic-only' } });
 const dependencies = {
  'react': React, 'react/jsx-runtime': jsx, './SettingsPage.css': {},
  '../../hooks/useTheme': { useTheme: () => ({ dark: false, toggleTheme() {} }) },
  '../../context/AuthContext/AuthContext': { AuthContext: auth },
  '../../services/account/accountDeletionService': {
   deleteOwnAccount() { throw Error('Deletion forbidden in flag tests'); },
   finishDeletedAccountSession() { throw Error('Deletion forbidden in flag tests'); },
  },
 };
 const page = new vm.SourceTextModule(code, { context, initializeImportMeta(meta) {
  meta.env = value === undefined ? {} : { VITE_ACCOUNT_DELETION_ENABLED: value };
 }});
 await page.link(name => {
  const exports = dependencies[name];
  assert.ok(exports, `Unexpected dependency: ${name}`);
  return new vm.SyntheticModule(Object.keys(exports), function () {
   for (const [key, item] of Object.entries(exports)) this.setExport(key, item);
  }, { context });
 });
 await page.evaluate();
 const html = renderToStaticMarkup(React.createElement(page.namespace.SettingsPage));
 assert.equal(html.includes('account-deletion'), value === 'true');
 assert.equal(html.includes('delete-account-button'), value === 'true');
 assert.ok(html.includes('Innstillinger') && html.includes('Gå til profil'));
 console.log(`PASS: ${String(value)} renders deletion section only when exactly true`);
}
