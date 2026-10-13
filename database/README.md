# Database

The application currently uses Supabase for persistent data storage.

Database changes that are required by application features are documented here
until database migrations are introduced.

## Concept suggestions

Automatic concept extraction uses the `concept_suggestions` table to store
concepts suggested from note content.

Each suggestion contains:

- `id` – unique identifier
- `note_id` – note the suggestion belongs to
- `name` – suggested concept name
- `type` – suggested concept type
- `short_definition` – suggested short definition
- `status` – `pending`, `accepted`, or `rejected`
- `created_at` – creation timestamp

The `type` value is either:

- `definition`
- `theorem`
- `formula`
- `method`

The following columns were added for automatic concept extraction:

```sql
alter table concept_suggestions
add column type text,
add column short_definition text;

alter table concept_suggestions
add constraint concept_suggestions_type_check
check (
  type is null
  or type in ('definition', 'theorem', 'formula', 'method')
);

```

The columns are nullable so existing concept suggestions remain valid.


## AI structure completion

Apply `migrations/20261012_complete_subject_structure.sql` in Supabase **before**
deploying the updated frontend. It adds one SECURITY INVOKER RPC and does not
change existing tables, rows or RLS policies. Verify the deployed schema has the
existing `topics`, `subtopics`, `notes`, `note_subtopics` columns/FKs and default
IDs used by the REST services. The authenticated admin must already have the
appropriate SELECT/INSERT/UPDATE rights through RLS; this migration does not
grant those rights or bypass RLS. Do not weaken policies to make generation work.

Django receives existing topic/subtopic IDs and names, plus all nonempty notes
as context. Only notes with neither a primary subtopic nor a note_subtopics link
are eligible for placement. Protected notes still provide content for completing
missing academic structure. Folders are preserved and do not determine academic
subtopic placement. Unknown IDs, wrong parents and omitted eligible notes reject
the plan. The LLM is instructed to reuse semantically matching structure; exact
normalized names are also reused deterministically at save time. Semantic
synonym matching remains a model judgment.

`complete_subject_structure` saves the plan in one PostgreSQL transaction. It
serializes AI completions per subject, reuses current IDs/names, appends new rows
without renaming/reordering old rows, and locks eligible notes before checking
primary/manual links again. Notes placed during the AI request are skipped.
New placements update notes.subtopic_id and insert note_subtopics together.
Existing manual placements, including legacy inconsistencies, are left untouched.
Repeated plans reuse the same structure. No rollback via destructive REST deletes
is used. A database error rolls back the entire structure step. If a network
response is lost, the outcome is unknown; the UI says so rather than claiming
nothing was saved. There is no non-atomic fallback when the RPC is unavailable.

The existing concept extraction/save step is separate. Its failure reports the
confirmed structure result; it does not roll that result back. Concept generation
continues to preserve existing content and manual links.

Tests use a disposable local PostgreSQL schema, not the deployed Supabase schema.
`tests/subject-structure.sql` validates reuse, retries, both note linkage fields,
manual placements, RLS, scope checks and transaction rollback. The deployment
migration has not been applied automatically to a live database.

### Placement quality

The structure call now proposes only the topic tree. Its noteIds are ignored.
Before returning any plan, Django classifies each eligible note independently
against the proposed paths and all existing paths, including existing subtopics
omitted from the proposal. The server attaches the note ID; the classifier never
chooses or copies one. Title and full cleaned content travel together; there is
no excerpt truncation. HTML layout is removed while paragraph/headings, code,
LaTeX attributes and image alternative text are retained.

Each choice requires an exact source quote and a reason. An unknown/uncertain
choice, evidence belonging to another note, or a truncated response rejects the
request before any structure RPC. This guards identity and grounding, but a
valid quote is not a proof of semantic correctness. The model still makes the
academic judgment. The added calls cost time proportional to eligible notes.
Existing protected placements are not reclassified or changed, and the database
transaction/permission behavior is unchanged.

## Flashcard source notes

Apply `migrations/20261012_flashcard_source_note.sql` in Supabase before deploying
note-generated flashcard saving. It adds nullable `flashcards.note_id` with a
foreign key and index. Existing rows are not backfilled or reclassified; deleting
a note preserves its cards and clears their source reference. Existing RLS is
unchanged. This migration is not automatically applied to the live database.

Generation uses the full note content (including LaTeX) before a separate call
classifies the resulting cards against all subject topic/subtopic paths. Existing
note placements do not enter either prompt. Users can correct the proposed path
in the preview; uncertain classifications require a choice before saving. Source
quotes and duplicate checks are safeguards, not proof of academic correctness.

## Folder order and colors

Apply `migrations/20261013_note_folder_order.sql` in Supabase before deploying
this frontend. It adds nullable `sort_order` and `color_index`, preserving the
sidebar's existing five-color sequence by creation order. New folders append
after explicitly ordered folders and get a color from the same palette.
Renaming, deleting or moving another folder does not change a folder's color.
The invoker RPC saves one complete subject order atomically, validates IDs and
honors existing RLS. No grants on tables or policies are changed. Sorting controls
use the same admin permission as existing folder editing. Existing notes and
folder membership are untouched. This migration was tested locally, not applied
to the live Supabase database.

## Shared folder administration

Apply `migrations/20261013_note_folder_admin.sql` after the folder-order migration.
The role source matches the app: `profiles.role = 'admin'` for `auth.uid()`.
Restrictive INSERT/UPDATE/DELETE policies deny normal/anonymous clients even if
legacy permissive policies exist. The reorder RPC explicitly checks admin status.
SELECT policies, table grants, note contents, membership, colors and order remain
unchanged. Service-role/database-owner maintenance retains its normal RLS bypass.

Because profile roles authorize these operations, a trigger prevents API clients
from assigning themselves admin privileges or reassigning profile IDs; normal
profile fields remain editable under existing policies. Trusted database/service
provisioning and existing admins can still manage roles. No existing profile rows
are modified. Tests run on a disposable local database; the migration has **not**
been applied automatically in Supabase. Until it is applied, UI hiding alone does
not protect the deployed database.
