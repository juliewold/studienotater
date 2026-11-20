import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

// Pure reading-progress rules for folders. These tests need no database or browser.
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

const { getFolderProgressById } = await import('../src/services/notes/folderProgress.ts');

const subjectId = 'subject';

const folders = [
  { id: 'root', subjectId, name: 'Root', parentId: null, createdAt: '2026-01-01', colorIndex: 0 },
  { id: 'child', subjectId, name: 'Child', parentId: 'root', createdAt: '2026-01-02', colorIndex: 0 },
  { id: 'other', subjectId, name: 'Other', parentId: null, createdAt: '2026-01-03', colorIndex: 1 },
];

const note = (id, slug, folderId) => ({ id, subjectId, folderId, slug, title: slug, description: '' });

const notes = [
  note('n1', 'a', 'root'),
  note('n2', 'b', 'child'),
  note('n3', 'c', 'child'),
  note('n4', 'd', 'other'),
  note('n5', 'e', null),
];

const resource = (slug, completed, rating) => ({
  itemId: `note-${subjectId}-database-${slug}`,
  itemType: 'resource',
  completed,
  rating,
});

test('a parent folder counts notes in its subfolders', () => {
  const progress = getFolderProgressById(folders, notes, [], subjectId);

  assert.equal(progress.root.noteCount, 3);
  assert.equal(progress.child.noteCount, 2);
  assert.equal(progress.other.noteCount, 1);
});

test('notes without a folder are not counted in any folder', () => {
  const progress = getFolderProgressById(folders, notes, [], subjectId);

  // Top-level folders hold every note in their subtree, so only they are summed.
  const total = progress.root.noteCount + progress.other.noteCount;
  assert.equal(total, 4);
});

test('read notes are counted, and unread notes count as not read', () => {
  const progress = getFolderProgressById(
    folders,
    notes,
    [resource('a', true, 0), resource('b', true, 0), resource('c', false, 0)],
    subjectId,
  );

  assert.equal(progress.root.readCount, 2);
  assert.equal(progress.child.readCount, 1);
  assert.equal(progress.other.readCount, 0);
});

test('average rating uses only rated notes, including subfolders', () => {
  const progress = getFolderProgressById(
    folders,
    notes,
    [resource('a', true, 5), resource('b', false, 3), resource('c', false, 0)],
    subjectId,
  );

  assert.equal(progress.root.ratedCount, 2);
  assert.equal(progress.root.averageRating, 4);
  assert.equal(progress.child.ratedCount, 1);
  assert.equal(progress.child.averageRating, 3);
  assert.equal(progress.other.ratedCount, 0);
  assert.equal(progress.other.averageRating, 0);
});

test('progress for other subjects or other item types is ignored', () => {
  const progress = getFolderProgressById(
    folders,
    notes,
    [
      { itemId: 'note-other-database-a', itemType: 'resource', completed: true, rating: 5 },
      { itemId: `note-${subjectId}-database-a`, itemType: 'video', completed: true, rating: 5 },
    ],
    subjectId,
  );

  assert.equal(progress.root.readCount, 0);
  assert.equal(progress.root.ratedCount, 0);
});
