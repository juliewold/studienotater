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

### Production review update (2026-11-01)

The operator confirmed the required personal tables, the validated
`book_task_progress.user_id` Auth foreign key, and a shared `calendar_events`
table without `user_id`. `notes.created_by` is absent. `auth.scim_users` is empty;
do not modify Supabase-managed Auth tables. Future SCIM use requires a separate
review of retained provisioning data.

The operator inspected all 102 rows in the historical application backup tables:

| Table | Rows | Reviewed content | Account deletion behavior |
| --- | --- | --- | --- |
| `study_topics_backup_20260910` | 14 | Shared academic topics | Preserve |
| `study_topic_items_backup_20260910` | 62 | Shared exercises and syllabus entries | Preserve |
| `study_topic_resources_backup_20260910` | 26 | Shared PDF and video references | Preserve |

No obvious personal information was found in the reviewed fields. The operator
also confirmed no registered foreign keys, obvious user ownership fields or
triggers on these backups. Classify these reviewed copies as shared academic
content, not personal progress or account-owned records. Keep all rows when an
account is deleted; do not add these tables to `account_deletion_targets()` or
the shared-attribution allowlist. This classification is specific to the
reviewed contents, not permission to retain future account-specific data. These
application tables are separate from provider database snapshots and their
retention/restore obligations.

The supplied trigger inventory found no active DELETE triggers on `auth.users`,
`profiles` or the personal progress tables, and no UPDATE triggers on
`auth.users`. The repository's profile role protection runs on INSERT/UPDATE,
not DELETE; shared-note/concept triggers are outside this cleanup's write path.
Storage triggers are not invoked because cleanup neither deletes nor updates
Storage. The final production query for active non-internal DELETE triggers
on Auth child tables returned **No rows returned**, as confirmed by the
operator. All agreed production database checks are complete without new
identified blockers; no further trigger-function review is outstanding from
that inventory. The broader initial
inventory and local-test caveats below describe the original evidence baseline;
this update records subsequent operator-supplied production findings, not an
independent production connection or deployment approval.

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
   requests only: while disabled, POST must return `503 / NOT_AVAILABLE`
   (the flag is checked before token validation). Keep the server flag false.
   No Django deployment is needed.
8. Before publishing, review the recorded isolated end-to-end acceptance
   results. Repeat only checks affected by a concrete implementation change.
   Acceptance coverage includes reader/admin deletion, MFA rejection, owned Storage
   blocking, rollback, unknown SET NULL tables, silent child/profile/Auth trigger
   cancellation (before and after cleanup), deferred COMMIT failure, duplicate
   click, uncertain network/verification outcome and local logout. Confirm the
   deployed Auth admin lookup uses the explicit `user_not_found` error code.
9. After PR approval, merge the reviewed branch into main. This automatically
   triggers GitHub Pages deployment; keep `ACCOUNT_DELETION_ENABLED=false`.
   Verify the deployed commit, Settings rendering, browser console and the
   disabled-backend response without attempting an actual deletion.
10. Only after frontend verification, operational prerequisites and explicit
    activation approval, set `ACCOUNT_DELETION_ENABLED=true`. A missing-token
    POST should then return 401 without deleting anything. A full production
    deletion test requires separate approval and a newly created disposable
    synthetic account, never an existing real user or shared-file owner.

### Frontend availability flag

Settings hides the entire deletion section unless the public build-time flag
`VITE_ACCOUNT_DELETION_ENABLED` is exactly the string `true`. Missing, false or
other values keep it hidden. The Pages workflow reads the repository Actions
variable of that name (`vars`, not secrets), defaulting to `false`. Leave it
unset or false until activation is approved. Never treat the UI flag as
authorization; `ACCOUNT_DELETION_ENABLED` on the server remains the security
control. The client flag cannot enable a disabled backend.

Publish and verify the frontend with the UI flag false and the server flag
false. After approval, enable the server, perform non-destructive checks, then
publish a new frontend build with the UI flag true. Changing a GitHub variable
alone does not rebuild Pages; the workflow now explicitly passes this non-secret
value to Vite, and a new build/deployment is required. Configure it under
GitHub Settings > Secrets and variables > Actions > Variables as a repository
variable. Its initial value must remain false or unset. On an incident disable the
server flag first; old browser bundles can still contain the button. This
implementation introduces no status API or privileged frontend credentials.

### Operator decisions required before activation

- Provide the real operator name/contact and a working support/privacy channel
  for blocked deletion, unsupported reauthentication and uncertain outcomes.
  Do not invent contact details or promise an unagreed response time.
- Record actual provider backup/log retention, access restrictions, expiry and
  the procedure for respecting erasure requests after a restore. Include relevant
  Supabase/Auth/Edge and other provider logs; retention is not established by
  these schema checks. Clarify local browser-history limitations in the notice.
- Assign responsibility and a supported, reviewed procedure for administrator
  accounts owning shared files. Those accounts remain blocked from self-service
  deletion until ownership/dependencies are safely resolved. Preserve shared
  files and access; do not null ownership or delete files to bypass the guard.

### PR completeness review

Before the frontend flag and integration follow-up, the feature diff against
the locally available `origin/main` contained 17 files: application UI/service, Edge Function/configuration, both SQL
migrations, rollout/FK documentation and existing deletion/FK regression tests.
The local `main` ref is older than `origin/main`; do not use its broad historical
diff as this feature's PR scope. This review did not fetch or verify remote
freshness.

The updated `database/ACCOUNT_DELETION.md` and these five reviewed integration
files are included in the local publication changes:

- `tests/account-deletion.integration-schema.sql`
- `tests/account-deletion.integration.html`
- `tests/account-deletion.integration.mjs`
- `tests/account-deletion.integration.tsx`
- `tests/run-account-deletion-integration.py`

These are reusable synthetic-only fixtures, API/browser verification and an
isolated native-stack runner referenced by this document, not production data
or deployment artifacts. No generated credentials, local environment files or
temporary test-stack data belong in the PR. Local commits do not authorize
publication, deployment or activation.

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

### Real local integration verification — 2026-11-01

Verified with Supabase CLI **2.122.0**, the experimental **native runtime** on
macOS Apple silicon, real local PostgreSQL 17.11, Auth, Storage, REST and Edge
Runtime. Docker is not required for this supported native setup. All services
used a fresh `/tmp/studienotater-account-integration-*` project/data directory,
locally generated keys and a stripped environment. No production `.env`, keys,
accounts, schema dump or database connection were used. No remote deployment
was performed. The minimal application schema is synthetic, not proof of
compatibility with the deployed production schema.

Passed against real services:

- Hard deletion through the actual Edge Function and Auth admin API for a
  synthetic reader and administrator; Auth users, identities, sessions, refresh
  tokens, profiles, all six other required personal tables and owned calendar
  rows were erased. The tested accounts had no verified MFA factors.
- Real private Storage bucket and file uploads, including user-owned files.
  File ownership blocked deletion while preserving the account, personal rows,
  all uploaded bytes and Storage metadata.
- Unknown personal `ON DELETE SET NULL` dependency rejected before erasure.
- Silent personal-table DELETE cancellation, late Auth cancellation/deferred
  COMMIT failure and a raised database exception all rolled back. Full snapshots
  of Auth users, identities, sessions, refresh tokens, MFA rows and application
  data were preserved on failure; the internal pending-check table stayed empty.
- Early Auth cancellation did not produce a false success response.
- Another synthetic user's data remained unchanged, shared note content was
  preserved with classified attribution cleared, and all Storage object rows
  were unchanged.
- Missing/invalid bearer tokens and a cross-user target-ID attempt were rejected
  by the real Edge Function without modifying either account.
- Actual `SettingsPage`, `LoginPage`, Auth provider and deletion service against
  local Auth/Edge: incorrect password rejected; real file owner received the
  ownership-block message; successful deletion returned to the actual app login
  page with the deletion confirmation. Direct database/Auth checks confirmed
  both UI outcomes and preservation of another account/shared files. No
  unexpected browser console errors were observed in the checked completion.

There were no implementation fixes required by these real-service tests. The
new files are reusable test infrastructure; no production runtime code changed.
The full local Auth/API suite was also repeated from a clean stack using the
test starter. The isolated services were stopped after verification.

To repeat (requires the official CLI >=2.122.0, `psql`, Node dependencies, network
access for verified native service artifacts, and a supported native platform):

```sh
# Fresh synthetic stack, real API suite, automatic stop afterward.
python3 tests/run-account-deletion-integration.py --supabase /path/to/supabase

# Keep the fresh stack and dedicated local frontend for browser acceptance.
python3 tests/run-account-deletion-integration.py --supabase /path/to/supabase --keep-running
```

The starter prints only PASS messages, the test root and the browser URL, never
keys. CLI startup/status output remains in the private test directory. The
frontend's dedicated `envDir` contains only the locally generated publishable
key; the repository's production `.env` is excluded.

Open the printed integration page and log in with the **synthetic-only**
`account-delete-ui-owner@example.invalid`, password
`Synthetic-Account-Delete-2026!`. Verify wrong-password rejection and then the
file-ownership block with the correct password. Return to that page's login
route, log in as `account-delete-ui-success@example.invalid` with the same
synthetic password, and complete `SLETT` confirmation. This account is disposable
and is supposed to be permanently erased. Do not substitute a real account.
The same `run` suite cannot be repeated against already erased fixtures; create
a fresh stack for each run.

Then run these modes in order, replacing the path with the printed test root:

```sh
node tests/account-deletion.integration.mjs /tmp/studienotater-account-integration-<id> verify-ui
node tests/account-deletion.integration.mjs /tmp/studienotater-account-integration-<id> verify-auth
node tests/account-deletion.integration.mjs /tmp/studienotater-account-integration-<id> verify-rollback-auth
```

`verify-ui` compares against the baseline saved by `run`. `verify-auth` performs
a legitimate survivor login, so run the UI comparison first. No mode reads
production credentials; the runner refuses non-loopback API/database URLs or a
CLI identity that does not belong to the fresh temporary test root. Stop only
this test stack afterward with `SUPABASE_HOME=<test-root>/home`,
`SUPABASE_EXPERIMENTAL_STACK=1` and `supabase --workdir <test-root> stop`. Stop the
test frontend using its recorded `frontend.pid` after checking its command
points to that root's Vite config. Do not stop unrelated development services.

The agreed production schema review is now complete as recorded above.
Production activation is still pending the manual rollout and operator
decisions, not another repetition of passed tests. The integration fixtures
remain synthetic; rerun affected tests only if implementation changes or a
concrete schema incompatibility is identified.

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
[native local runtime](https://supabase.com/docs/guides/local-development/docker-and-native-runtimes),
[signed URL and cache limits](https://supabase.com/kb/troubleshooting/storage-private-bucket-files-still-accessible-after-remove-access-or-logout),
[GDPR Article 17 in Norwegian law](https://lovdata.no/lov/2018-06-15-38/kapiii).

Local flag checks: `node --experimental-vm-modules tests/account-deletion-flag.mjs`.
For isolated enabled UI interaction tests only, start Vite with
`VITE_ACCOUNT_DELETION_ENABLED=true npm run dev` and open
`/studienotater/tests/account-deletion.html`. The local integration runner sets
this flag only in its temporary frontend environment. Neither command changes
GitHub variables or production flags. For a local enabled production build,
use `VITE_ACCOUNT_DELETION_ENABLED=true npm run build`; this does not deploy it.

The frontend-flag follow-up also includes `.github/workflows/deploy.yml`, the
Settings visibility condition, the UI test precondition, the integration
runner's isolated frontend flag, and `tests/account-deletion-flag.mjs`. Include
that new offline flag test in the eventual PR alongside the five integration
files listed above.

The adapted mocked browser UI suite passed all ten checks with the frontend
flag enabled in an isolated temporary environment. Outbound production requests
were blocked; the temporary test server and its configuration were removed.
