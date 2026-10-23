import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const baseline = JSON.parse(readFileSync(new URL('./theme-light-baseline.json', import.meta.url)));
const theme=readFileSync('src/styles/theme.css','utf8');
for(const [file,hash] of Object.entries(baseline)) {
  const css=readFileSync(file,'utf8');
  for(const [,token] of css.matchAll(/var\((--theme-[\w-]+),/g)) assert.ok(theme.includes(`${token}:`),`Undefined ${token}`);
  const restored=css.replace(/var\(--theme-[\w-]+, ([^()]*(?:\([^()]*\)[^()]*)?)\)/g,'$1');
  assert.equal(createHash('sha256').update(restored).digest('hex'),hash,`${file}: light/layout changed`);
}
console.log(`${Object.keys(baseline).length} stylesheets: original light colors and geometry preserved; tokens defined`);
