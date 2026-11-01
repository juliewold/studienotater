# Self-service account deletion: inventory and manual rollout

Status: implemented on a feature branch, **not deployed**. No production users,
rows, objects, ownership metadata or bucket settings have been changed. Do not
test DELETE against a real account, including your own administrator account.

## Evidence and data inventory

This inventory is derived from the repository. An attempted read-only production
OpenAPI schema request returned HTTP 401. Production column definitions, foreign
keys, triggers, log retention and backup settings have **not** been verified for
this feature. Complete the metadata-only SQL review below before enabling it.
Do not infer production cascades from TypeScript types or previous Storage tests.

| Location | Personal data evidenced by code/provider | Deletion behavior |
| --- | --- | --- |
| Supabase Auth | User UUID, email, password hash, username/full name in signup metadata; provider identities, confirmation/recovery data, sessions/refresh tokens, sign-in timestamps, potential phone/MFA records | Supported Auth admin **hard-delete** API; never a frontend admin call |
| `profiles` (`id`) | Username, full name, protected role; additional deployed columns require inspection | Delete this user's row in the Auth deletion transaction |
| `favorites` (`user_id`) | Selected resources and timestamps | Delete only this user's rows |
| `progress` (`user_id`) | Read/completion state, understanding ratings and resource IDs | Delete only this user's rows |
| `book_progress` (`user_id`) | Book reading progress | Delete only this user's rows |
| `book_task_progress` (`user_id`) | Completed book tasks | Delete only this user's rows |
| `exam_task_progress` (`user_id`) | Completed exam tasks and task labels | Delete only this user's rows |
| `semester_subjects` (`user_id`) | Selected subjects | Delete only this user's rows |
| `calendar_events` | Titles/descriptions, dates, location and recurrence can be personal. Client does not specify an owner | If the deployed table has `user_id`, require a valid owner FK and delete only matching rows. Without it, preserve as shared; **confirm classification manually** |
| Shared subject tables | `subjects`, `topics`, `subtopics`, `topic_introductions`, `notes`, `note_folders`, `note_subtopics`, `concepts`, `concept_suggestions`, `concept_subtopics`, `flashcards`, `pdfs`, `exams`, `videos`, `books`, `book_chapters`, `book_chapter_tasks`, `study_topics`, `study_topic_items`, `study_topic_resources`, `upcoming_exams` contain shared academic material | Preserve rows/content. Only explicitly classified attribution fields may use a validated nullable `ON DELETE SET NULL` FK. The initial allowlist contains only `public.notes.created_by`, if present. Other fields/tables block deletion until reviewed |
| Storage `pdfs`, `note-images` | Shared PDFs, all exam file variants (including `my_solution_file_path`), images; object/bucket owner UUIDs, paths, metadata; document contents can themselves contain names or personal information | **Never delete files or edit Storage metadata automatically.** If any bucket/object is owned by the caller, stop before deletion and require reviewed reassignment/manual handling |
| Local Supabase Auth storage | Access/refresh tokens, cached user metadata; SDK may also keep auth-flow verifier data | SDK local sign-out, auth events and a full navigation clear the current session and in-memory views |
| `practice-sessions`, `active-practice-sessions` | Answers, scores, topics, dates, active question state | Legacy browser-wide data has **no account owner**. Preserve to avoid deleting another person's history. Explain this before confirmation; users can reset it through existing practice controls |
| `studienotater-theme` | Browser theme preference, not tied to an account | Preserve |
| Other browsers/devices, downloaded files, browser/CDN caches | Previously downloaded content and issued signed URLs | Cannot remotely erase copies; users must clear their own devices |
| Supabase/GitHub/CDN/email/provider logs and backups | Possible IPs, user IDs, access times, email delivery, audit events, prior database snapshots | Not erased by the application transaction. Establish provider-specific retention, access restrictions, expiry and restore procedures |
| Django / NTNU LLM | Django uses a separate SQLite database for framework/admin data; no mapping to Supabase users is implemented. AI prompts contain note text, potentially personal free text, but frontend does not send user profiles as prompts | No blanket deletion of framework accounts or shared notes. Clarify NTNU processing/log retention and handle personal content or legal erasure requests separately |

Shared free-text content, filenames and image/PDF contents cannot safely be
classified or scrubbed by a user-UUID delete. Provide a real operator contact in
the published privacy notice for ownership blocks, free-text erasure requests,
MFA/unsupported login methods, and exceptional failures. A generic message in
Settings is not a substitute for that contact or for a privacy notice.

## Architecture and security boundary

GitHub Pages is static and already talks directly to Supabase. Its workflow does
not deploy Django or configure `VITE_API_URL`. Use `delete-account`, a Supabase
Edge Function, rather than introducing a dependency on an undeployed Django API.

1. Settings requires `SLETT` and the current password. Reauthenticate directly
   with Supabase Auth. The password never goes to the Edge Function.
2. Send only `{ "confirmation": "DELETE" }` and the fresh access token. An account
   switch is checked locally; the server never accepts a target ID/email/role.
3. The Edge Function calls this project's `/auth/v1/user` to verify the exact
   token. Only after verification does it inspect the signed `sub` and password
   AMR timestamp (within five minutes). A refreshed `iat` is insufficient.
   Anonymous accounts are rejected. Verified MFA factors require AAL2; the current
   password-only UI cannot complete that flow and instead requires operator help.
4. A server-only service-role credential calls the preflight RPC and Auth
   `DELETE /admin/users/<verified user id>` with `should_soft_delete: false`.
   No privileged credential is included in the Vite bundle, request body or logs.
5. A `BEFORE DELETE` trigger on `auth.users` repeats the preflight and deletes
   the allowlisted personal rows, profiles last, in **the same transaction** as
   Auth deletion. It locks/counts matching rows, checks each DELETE's affected
   row count and checks for remaining personal rows. A silent `RETURN NULL` in
   a personal-table trigger raises `ACCOUNT_DELETION_INCOMPLETE`, not success.
   A private pending-check row schedules a deferred constraint trigger that
   verifies the Auth account and all targeted personal rows are absent before
   COMMIT. A later Auth trigger cancelling deletion rolls back the entire
   cleanup. Even accounts without profiles/personal rows receive this guard.
   Successful checks remove the pending row; rollback removes its insertion.
   No earlier destructive cleanup requests are made.
   The Edge Function additionally requires an admin lookup returning the explicit
   `user_not_found` code after DELETE: an earlier Auth trigger may skip deletion
   before our row trigger runs, so a DELETE 2xx alone is never accepted as proof.
6. Success clears the current local SDK session and reloads into the login page.
   Failure never reports success. A timeout after DELETE has an **unknown outcome**;
   check whether login remains possible/contact the operator instead of assuming
   nothing was deleted. Successful deletion + local cleanup failure is reported
   separately and cannot be submitted for deletion again in that view.

The migration checks incoming foreign keys, UUID ownership FKs and common
unclassified owner fields. `SET NULL` is **not** a classification: unknown
referencing tables/fields block deletion regardless of their FK delete action.
`account_deletion_shared_attribution()` is the explicit schema/table/column
allowlist; entries still need a validated, nullable single-column SET NULL FK to
`auth.users(id)` or `profiles(id)`. A newly added field in an otherwise classified
table is not automatically approved. Review content/ownership and add matching
regression tests before changing this allowlist.

Unknown cascades, missing tables/FKs, changed cleanup/deferred-guard trigger
registration and Storage ownership block deletion. It does not prove the absence
of arbitrary trigger side effects, differently named ownership columns or PII in
free text. Review every custom trigger and the complete deployed schema first.
The trigger applies to **all hard Auth deletions**, including Dashboard/admin
maintenance, and may intentionally block those until dependencies are reviewed.

The internal `account_deletion_internal` schema/table and guard function have no
client/service-role grants; only definer triggers use them. Do not expose this
schema through the Data API, disable its constraint trigger or alter transaction
constraint modes to bypass it. Forcing the guard IMMEDIATE before the Auth row
has been deleted fails safely rather than accepting partial cleanup. Review all
custom triggers, including deferred triggers and triggers with external side
effects: a database rollback cannot recall an external HTTP request or email.
Arbitrary trusted trigger code that mutates unrelated rows remains subject to
that review, not a guarantee provided by row-count checks.

No RLS policies or grants on existing tables/Storage are broadened. Personal
ownership FKs are required, so stale JWTs cannot recreate rows for a deleted
Auth/profile ID. Existing JWTs are stateless and can still authorize shared
resource access until expiry where RLS only checks JWT claims. Signed URLs and
cached/downloaded content are not immediately revoked by deletion or logout.
Immediate global revocation would require a separately reviewed live-session/
active-user check across the application's policies and clients.

## Metadata-only production review (SELECT only)

Run in the SQL Editor, inspect privately, and redact any sensitive defaults.
Do not include user rows, API keys, tokens or raw note contents in the output.

```sql
-- Inventory ALL application columns, including columns absent from client types.
SELECT table_schema, table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema IN ('public', 'storage', 'auth', 'account_deletion_internal')
ORDER BY table_schema, table_name, ordinal_position;

-- Review every FK, including ON DELETE actions and references outside public.
SELECT n.nspname AS schema_name, r.relname AS table_name, c.conname,
       pg_get_constraintdef(c.oid) AS definition, c.convalidated
FROM pg_constraint c JOIN pg_class r ON r.oid = c.conrelid
JOIN pg_namespace n ON n.oid = r.relnamespace
WHERE c.contype = 'f' AND n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schema_name, table_name, c.conname;

-- Review all custom trigger functions privately for side effects before rollout.
SELECT n.nspname AS schema_name, r.relname AS table_name,
       t.tgname, t.tgenabled, t.tgdeferrable, t.tginitdeferred,
       pg_get_triggerdef(t.oid) AS definition,
       t.tgfoid::regprocedure AS function_name
FROM pg_trigger t JOIN pg_class r ON r.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = r.relnamespace
WHERE NOT t.tgisinternal AND n.nspname IN ('public','auth','storage','account_deletion_internal')
ORDER BY schema_name, table_name, t.tgname;

-- Aggregate only: identify whether ownership requires an operational procedure.
SELECT bucket_id, count(*) AS objects,
       count(*) FILTER (WHERE coalesce(to_jsonb(o)->>'owner_id',
                                      to_jsonb(o)->>'owner') IS NOT NULL) AS owned_objects
FROM storage.objects o GROUP BY bucket_id;
```

All seven required personal tables must have validated UUID ownership FKs to
`auth.users(id)` or, for non-profile tables, `profiles(id)`. Review orphaned rows
before proposing any missing FK. Do not add guessed cascades or alter arbitrary
tables just to make preflight pass. Resolve calendar classification, unknown
ownership fields and shared attribution FKs deliberately, then update the
manifest/tests if the reviewed production schema differs. The migration itself
does not add FKs or reclassify existing rows.

## Manual deployment order

1. Complete the schema/trigger inventory and Storage ownership procedure. Review
   the privacy notice, operator contact, backup retention and local-history
   limitation. Do not enable deletion until these are understood.
2. Test against a **disposable local Supabase stack**, with synthetic reader/admin
   accounts and files only. Apply the migration there, then deploy/serve the
   function there with deletion enabled. Confirm the real Auth hard-delete API
   runs the trigger and removes identities/sessions/personal rows, preserves
   another account/shared files, and fails atomically for an owned file. Never
   use a production credential or linked production project for these tests.
3. After review, manually install
   `migrations/20261101_account_deletion.sql` in production. Installing it does
   not delete users/data, but affects future Dashboard/API hard deletions.
   A metadata/ownership readiness check with a sentinel UUID is non-destructive:
   `SELECT public.account_deletion_preflight('00000000-0000-0000-0000-000000000000'::uuid);`
   It verifies schema readiness, not ownership for every real user. Never call
   the Auth DELETE endpoint as a production configuration check.
4. Deploy the Edge Function `delete-account` to the explicitly selected project.
   Keep `ACCOUNT_DELETION_ENABLED` unset/false initially. The platform normally
   injects `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`; verify
   these are available and active **server-side only**. Never add the service key
   to `.env` variables beginning with `VITE_` or to GitHub Pages build secrets.
   If legacy keys are disabled, configure `ACCOUNT_DELETION_PUBLIC_KEY` with an
   active publishable key and `ACCOUNT_DELETION_SECRET_KEY` with an active secret
   key instead. These override the injected legacy defaults; store the secret
   only in the Edge Function secrets manager. The handler sends modern secret
   keys in `apikey`, not as Bearer JWTs.
5. Configure `ACCOUNT_DELETION_ORIGINS=https://juliewold.github.io` (origins only,
   no `/studienotater/` path). For local isolated testing use
   `http://localhost:5173`; `ACCOUNT_DELETION_ALLOW_LOCAL=true` permits HTTP only
   to local Supabase hosts (`localhost`, `127.0.0.1`, `kong`,
   `host.docker.internal`). **Do not enable this local flag in production.**
6. The checked-in `supabase/config.toml` sets `verify_jwt=false` for this function
   because authorization is performed with Auth inside the handler and supports
   current signing/API-key formats. Never deploy a version without that handler
   validation. Configure platform abuse/rate limits and monitor failure counts
   without logging passwords/tokens/request bodies. CORS is not authentication.
7. Verify preflight with a reviewed synthetic account in the isolated stack;
   verify production function configuration with non-destructive missing-token
   requests only. Set `ACCOUNT_DELETION_ENABLED=true` only after approval, then
   publish the compatible frontend. No Django deployment is needed.
8. Before publishing, get a reviewer to run the isolated end-to-end acceptance
   checklist, including reader/admin deletion, MFA rejection, owned Storage
   blocking, rollback, unknown SET NULL tables, silent child/profile/Auth trigger
   cancellation (before and after cleanup), deferred COMMIT failure, duplicate
   click, uncertain network/verification outcome and local logout. Confirm the
   deployed Auth admin lookup uses the explicit `user_not_found` error code.

Example deployment command after review (do not run during implementation):

```sh
supabase functions deploy delete-account --project-ref <reviewed-project-ref>
```

Set the non-secret feature flag/origin and any key overrides in that project's
Edge Function configuration. Never paste real secrets into a shell history or PR.

Disabling the feature flag stops new requests. Removing the UI alone does not
disable the endpoint. Do not roll back by recreating deleted users or restoring
old personal rows without evaluating the deletion request.

## Retention and legal/operational limits

- A hard-delete transaction concerns the active database, not immutable backups,
  provider audit/security logs, email systems, NTNU logs or user devices. Record
  actual retention periods from the project plan/configuration; do not promise
  instant universal erasure or invent a fixed retention period.
- Restrict backup/log access and let copies expire under a documented, justified
  retention policy. Keep a restricted operational erasure record if needed to
  reapply deletions after restoration; minimize identifiers and define expiry.
  Such a record is itself personal data. No persistent erasure-history table is
  added here. The private pending-check table holds a UUID only within deletion
  transactions, removing it on success or rollback; normal WAL/backup retention
  still applies to database activity.
- Browser-wide practice history cannot be attributed to an account. Automatic
  erasure would risk another user's data. Account-scoped practice storage and a
  deliberate legacy-history migration are a separate unresolved privacy task.
- Storage ownership blocks are a safe failure, not completed erasure. Never
  delete shared objects or merely null ownership in unmanaged Storage SQL to
  force the Auth API through. Review reassignment with Supabase's supported
  ownership procedure and resolve any personal content separately.
- Existing passwords-only login is supported. OAuth-only/MFA deletion needs a
  matching strong reauthentication flow or an operator-assisted identity check.
- This implements a deletion mechanism, not a conclusion that the entire site
  complies with GDPR. Confirm lawful basis, notices, processors/NTNU terms,
  retention and handling of exceptional Article 17 requests separately.

## Tests and references

- `node --experimental-vm-modules tests/account-deletion.mjs`: offline Edge
  handler and client service security/error tests; no live deletion calls.
- `tests/account-deletion.sql`: **only** an empty local database named
  `account_deletion_test`; synthetic Auth/Storage schema, isolation, rollback,
  explicit SET NULL classification, silent trigger cancellation, actual COMMIT
  rejection, disabled guard, no-profile account, schema drift, owned-file
  blocking, preservation and migration idempotency. Failed cases assert that
  both users, shared note content and Storage are unchanged and no pending guard
  rows remain. The successful case verifies classified note attribution is
  cleared while note content and the other user's data remain intact.
- Vite `/studienotater/tests/account-deletion.html`: mocked UI tests. Outbound
  fetches are blocked; no real accounts or files are modified.
- `npm run build`, scoped ESLint, existing private Storage and AI token regressions.

Sources: [Supabase user data/deletion](https://supabase.com/docs/guides/auth/managing-user-data),
[server-only hard deletion](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser),
[Storage ownership](https://supabase.com/docs/guides/storage/security/ownership),
[Edge authorization headers](https://supabase.com/docs/guides/functions/auth-headers),
[signed URL and cache limits](https://supabase.com/kb/troubleshooting/storage-private-bucket-files-still-accessible-after-remove-access-or-logout),
[GDPR Article 17 in Norwegian law](https://lovdata.no/lov/2018-06-15-38/kapiii).
