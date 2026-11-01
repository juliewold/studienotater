# Book task progress: missing Auth ownership FK

Manual-review migration:
`migrations/20261101_book_task_progress_auth_user_fk.sql`.

The project owner reports production has one `book_task_progress` row, zero rows
without an Auth user, and no `user_id` FK to `auth.users(id)`. This report does not
verify column types, nullability, incoming dependencies, indexes or trigger bodies.
The client treats the table as personal task progress (`user_id`, `task_id`,
`completed`, `updated_at`), not shared task content. A UUID ownership FK with
`ON DELETE CASCADE` fits that model, subject to the schema checks below.

## Behavior and safeguards

- Requires ordinary tables, UUID `book_task_progress.user_id`, UUID
  `auth.users.id` and the latter's single-column primary key. No type conversions
  or changes to primary/unique keys, nullability, task references, RLS, policies,
  grants, Storage or shared content are performed.
- Rejects existing NULL/unowned or orphan progress. It never repairs or deletes
  such rows. Nullability itself is preserved: if the column is nullable, the FK
  alone does not prohibit future NULL values. Review that separately if needed.
- Rejects conflicting, composite, duplicate, deferred or otherwise incompatible
  FKs involving `user_id`, and collisions with the proposed constraint name.
  A single equivalent existing FK is reused regardless of its name; if not yet
  validated it is validated. Repeating the migration does not add duplicate FKs.
- Rejects incoming FKs referencing progress and active custom DELETE triggers on
  progress, rather than permitting unreviewed cascading/trigger side effects.
  Review unexpected dependencies; do not disable safeguards just to apply it.
- Creates `book_task_progress_user_id_auth_users_fkey` as NOT VALID, then validates
  it in the same transaction. Any failure rolls everything back. A child-table
  lock stabilizes the rows/schema; lock timeout is five seconds and statement
  timeout thirty seconds. If busy/large, stop and review scheduling/timeouts.
- Installing does not delete existing rows. **Future Auth hard deletions**, even
  Dashboard/admin deletions before the self-service feature is enabled, will
  delete that user's progress. The referenced shared task is not deleted: FK
  cascades run from the Auth parent to its progress children, not toward the
  task referenced by those children.

## SELECT-only preflight for manual review

```sql
SELECT table_schema, table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE (table_schema='public' AND table_name='book_task_progress')
   OR (table_schema='auth' AND table_name='users' AND column_name='id')
ORDER BY table_schema, table_name, ordinal_position;

SELECT c.conrelid::regclass AS referencing_table,
       c.confrelid::regclass AS referenced_table, c.conname,
       pg_get_constraintdef(c.oid) AS definition, c.convalidated
FROM pg_constraint c
WHERE c.contype IN ('p','u','f')
  AND (c.conrelid IN ('public.book_task_progress'::regclass,'auth.users'::regclass)
       OR c.confrelid='public.book_task_progress'::regclass)
ORDER BY c.conrelid::regclass::text, c.conname;

SELECT count(*) AS total_rows,
       count(*) FILTER (WHERE p.user_id IS NULL) AS null_user_ids,
       count(*) FILTER (
         WHERE p.user_id IS NOT NULL AND u.id IS NULL
       ) AS orphan_user_ids
FROM public.book_task_progress p
LEFT JOIN auth.users u ON u.id=p.user_id;

SELECT tgname, tgenabled, pg_get_triggerdef(oid) AS definition,
       tgfoid::regprocedure AS trigger_function
FROM pg_trigger
WHERE tgrelid='public.book_task_progress'::regclass AND NOT tgisinternal;

SELECT indexname, indexdef FROM pg_indexes
WHERE schemaname='public' AND tablename='book_task_progress';
```

Inspect function bodies privately if any DELETE triggers exist. Share no user
rows, keys or tokens. The ownership join assumes UUID types: check the first
query before running it. Keep the existing task FK and any leading `user_id`
index/composite key; this migration does not create an extra index.

After review, apply this **separate** migration manually before enabling account
deletion, independently of `20261101_account_deletion.sql`. This directory is
manually managed: do not rely on alphabetical filename order. Recheck the FK is
validated and cascades to Auth afterward; do not test Auth deletion on production
users. No production application has been performed by this change.

## Synthetic-only tests

`tests/book-task-progress-auth-fk.sql` requires a new, empty local database named
`book_task_progress_fk_test`. It loads the real migration and verifies preserved
data, RLS/grants/policies, repeat application, existing-FK reuse/validation, denied
orphan inserts/updates, user-isolated cascade, shared task preservation and safe
refusal of invalid rows/schema/dependencies/triggers. Expected negative-case SQL
errors are followed by assertions that no partial constraint/data repair occurred.

`tests/account-deletion.sql` now starts with the reported missing FK, applies
this prerequisite, and then runs the complete synthetic account-deletion
regression suite. Neither test may run on a production database.
