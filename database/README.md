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


## AI validation and partial structure saves

AI candidates are validated before being returned to the frontend. Invalid
required fields reject the entire response; unknown subtopic IDs are removed
and repeated IDs are deduplicated. An empty valid candidates list is allowed.
Classification is deliberately conservative but remains a model judgment; it
does not remove existing concept links, including overly broad older links.

Generated structures must have valid topic/subtopic names and lists. Only input
note IDs are accepted, and the first occurrence of each ID wins. Missing notes
reject the complete plan before frontend writes; no fallback curriculum is
invented. Empty noteIds lists are allowed for subtopics supported by the notes.

The current frontend uses separate Supabase REST requests for each topic,
subtopic and note placement. These requests cannot share a transaction. The
structure service checks for existing topics both before requesting AI output
and immediately before saving. It does not regenerate existing structure.
If saving fails, it reports confirmed counts and asks the administrator to
inspect the partial structure. Counts cannot include writes whose response was
lost. No automatic rollback/deletion is attempted, since created rows might
already be referenced or manually edited. Before retrying, inspect the existing
structure and finish it manually; automatic generation refuses an existing one.

These checks reduce risk but do not prevent two concurrent clients from both
passing the final check, nor do they make saves atomic. A future bounded fix is
a Supabase Postgres function invoked through RPC: validate the subject and note
ownership, serialize generation per subject, reject existing structure, and
insert the entire validated plan in one database transaction. Its authorization,
RLS behavior and migrations need verification against the deployed schema first.
No RPC, schema migration, database redesign or many-to-many change is included
in this update. Existing concepts, callout links and Concept ↔ Subtopic links
are preserved; preserveExisting continues to retain existing concept content.
