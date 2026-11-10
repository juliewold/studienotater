import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

// Pure tree rules for nested folders. These tests need no database or browser.
// The app imports extensionless TypeScript paths, so resolve them to .ts files here.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.')) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return next(url.href, context);
    }
    return next(specifier, context);
  },
});
const tree = await import('../src/services/notes/folderTree.ts');

const folder = (id, parentId = null, name = id, sortOrder = null) => ({
  id, subjectId: 's', parentId, topicId: null, topicName: null, name,
  createdAt: '2026-01-01', sortOrder, colorIndex: 0,
});

// A > A1 > A1a, A > A2, B, C > C1 (C1 is below C), D is a sibling that is not part of A.
const folders = [
  folder('A', null, 'A', 0),
  folder('A1', 'A', 'A1', 0),
  folder('A1a', 'A1', 'A1a', 0),
  folder('A2', 'A', 'A2', 1),
  folder('B', null, 'B', 1),
  folder('C', null, 'C', 2),
  folder('C1', 'C', 'C1', 0),
  folder('D', null, 'D', 3),
];

test('getChildFolders returns the direct children of a folder in display order', () => {
  assert.deepEqual(tree.getChildFolders(folders, null).map(f => f.id), ['A', 'B', 'C', 'D']);
  assert.deepEqual(tree.getChildFolders(folders, 'A').map(f => f.id), ['A1', 'A2']);
  assert.deepEqual(tree.getChildFolders(folders, 'A1a').map(f => f.id), []);
});

test('getFolderAncestors returns the breadcrumb path from the top level down to the parent', () => {
  assert.deepEqual(tree.getFolderAncestors(folders, 'A1a').map(f => f.id), ['A', 'A1']);
  assert.deepEqual(tree.getFolderAncestors(folders, 'A').map(f => f.id), []);
  assert.deepEqual(tree.getFolderAncestors(folders, 'missing').map(f => f.id), []);
});

test('getFolderAncestors terminates on corrupt cyclic data instead of looping forever', () => {
  const cyclic = [folder('X', 'Y'), folder('Y', 'X')];
  assert.doesNotThrow(() => tree.getFolderAncestors(cyclic, 'X'));
  assert.ok(tree.getFolderAncestors(cyclic, 'X').length <= 2);
});

test('getFolderDescendantIds includes every nested level and nothing else', () => {
  assert.deepEqual([...tree.getFolderDescendantIds(folders, 'A')].sort(), ['A1', 'A1a', 'A2']);
  assert.deepEqual([...tree.getFolderDescendantIds(folders, 'A1a')], []);
  assert.equal(tree.getFolderDescendantIds(folders, 'B').has('A'), false);
});

test('flattenFolderTree lists folders depth-first with their depth', () => {
  assert.deepEqual(
    tree.flattenFolderTree(folders).map(({ folder: f, depth }) => [f.id, depth]),
    [['A', 0], ['A1', 1], ['A1a', 2], ['A2', 1], ['B', 0], ['C', 0], ['C1', 1], ['D', 0]],
  );
});

test('flattenFolderTree hides excluded folders together with their subtree', () => {
  const excluded = new Set(['A1']);
  assert.deepEqual(
    tree.flattenFolderTree(folders, excluded).map(({ folder: f }) => f.id),
    ['A', 'A2', 'B', 'C', 'C1', 'D'],
  );
});

test('canMoveFolder allows top level and other folders, but never self or own subfolders', () => {
  assert.equal(tree.canMoveFolder(folders, 'A1a', null), true);
  assert.equal(tree.canMoveFolder(folders, 'A1a', 'B'), true);
  assert.equal(tree.canMoveFolder(folders, 'A1', 'A2'), true);

  assert.equal(tree.canMoveFolder(folders, 'A', 'A'), false, 'folder into itself');
  assert.equal(tree.canMoveFolder(folders, 'A', 'A1'), false, 'folder into direct subfolder');
  assert.equal(tree.canMoveFolder(folders, 'A', 'A1a'), false, 'folder into deep subfolder');
  assert.equal(tree.canMoveFolder(folders, 'A', 'missing'), false, 'unknown target');
});

test('getFolderMoveTargets excludes the folder and all of its subfolders', () => {
  const targets = tree.getFolderMoveTargets(folders, 'A').map(({ folder: f }) => f.id);
  assert.deepEqual(targets, ['B', 'C', 'C1', 'D']);
  assert.ok(!targets.includes('A') && !targets.includes('A1') && !targets.includes('A1a') && !targets.includes('A2'));
});
