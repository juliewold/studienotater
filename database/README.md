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

````sql
alter table concept_suggestions
add column type text,
add column short_definition text;

alter table concept_suggestions
add constraint concept_suggestions_type_check
check (
  type is null
  or type in ('definition', 'theorem', 'formula', 'method')
);

The columns are nullable so existing concept suggestions remain valid.
