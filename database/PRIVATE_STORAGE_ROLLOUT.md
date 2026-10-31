# Private study files: manual rollout

Nothing in this branch has been run against production. No objects are moved,
deleted, renamed or overwritten. The policy migration does **not** change bucket
visibility. Do not make buckets private before compatible frontend deployment.

## Access model

The current app has shared subject notes/PDFs/exams, not private notebooks or
per-user document permissions. Registered, non-anonymous users may read all
files in `pdfs` and `note-images`; only the existing protected administrator role
may upload, replace, rename or delete them. Semester subject choices are display
preferences, not file entitlements. `my_solution_file_path` is also existing
shared exam material, not a private per-user submission.

If some files must be private to a specific user/group, stop and define that
ownership/entitlement model first. These policies intentionally do not provide
per-document isolation. Do not place private personal files in the shared buckets.

Supabase anonymous sign-in accounts are also excluded. Service-role maintenance
retains its usual RLS bypass; service-role keys must never be sent to frontend.

## Existing image URLs

Existing HTML and `content_json` may contain this project's
`/storage/v1/object/public/note-images/<path>` URLs. The new image renderer resolves
the same object path through authorized Storage signing, without changing the
stored document. This also works in editable notes, read-only notes, PDF summaries
and concept snippets. No bulk content migration is necessary.

New uploads store a permanent `supabase-storage://note-images/<encoded-path>`
reference. Copy/import of existing public/signed Storage images normalizes the
reference without uploading the object again. Signing happens only when rendered;
the editor's HTML/JSON never receives the temporary viewing URL. Existing external
non-Storage HTTP images retain their behavior. Foreign/malformed Storage URLs are
not signed or used as a public fallback.

PDF/exam rows keep their existing paths. Only mounted viewers/links request URLs,
not the entire PDF listing. URLs last five minutes and are renewed after four;
failures remove the expired view and retry. Sign-out disposes displayed URLs and
in-flight responses are ignored. Already issued URLs are bearer capabilities
until expiry; a recipient can share one during that window. Already downloaded
content cannot be recalled. This is access control, not copy protection.

## Order of operations

1. Review/export current `storage.objects` policies, bucket settings and grants.
   Confirm RLS is enabled, both bucket IDs exist, and the existing protected
   `profiles.role`/`can_manage_note_folders()` migration is installed. Inventory
   whether other clients use these buckets or require anonymous listing.
2. **Manually** run `migrations/20261031_private_study_storage_policies.sql`.
   It preserves object rows, bucket visibility, grants and other buckets.
   Restrictive guards prevent older permissive/ALL policies from authorizing
   anonymous reads/listing or non-admin writes. While buckets are still public,
   existing public URLs remain public; RLS alone cannot close that route.
3. Test this frontend locally with existing registered reader/admin sessions.
   Confirm signing succeeds for both roles, and anonymous signing/listing is
   denied. Test upload/edit/delete only in a disposable test environment. Check
   PDF viewers, all three exam file types, admin links, old note images, concept
   snippets, copy/paste, DOCX import, resizing and sign-out. No LLM calls needed.
4. Merge/release the compatible frontend. This repository's main push triggers
   GitHub Pages deployment. Verify the actual published version and hard-refresh
   clients. Do not reverse this order: old frontend versions cannot render
   private buckets, and cannot understand new permanent image references.
5. Only after that deployment is verified, **manually** make both existing
   buckets private in the Supabase Dashboard, or run the reviewed SQL below.
   No file migration, copying, deletion or content rewrite is required.

```sql
BEGIN;
DO $$ BEGIN
  IF (SELECT count(*) FROM storage.buckets WHERE id IN ('pdfs','note-images')) <> 2 THEN
    RAISE EXCEPTION 'Expected exactly both study buckets';
  END IF;
END $$;
UPDATE storage.buckets SET public = false WHERE id IN ('pdfs','note-images');
COMMIT;
```

6. In a clean unauthenticated client confirm anonymous listing, new signed URL
   creation and **old public file URLs** are denied. In authenticated clients,
   verify old/new images, PDFs and exams still render. Verify URL renewal and
   sign-out. Browser/CDN caches and prior downloads may still contain public
   copies; check cache behavior and the provider's cache invalidation options.
   Making a bucket private cannot undo prior exposure.

## Recovery

Keep buckets private and fix/roll forward the compatible frontend or policy
configuration. Do not blindly roll back to the old public-URL frontend: it cannot
resolve new image references or private files. Making buckets public again is a
separate security decision requiring explicit approval, not an automatic fallback.
Retain the exported policies to diagnose/review any policy rollback. No destructive
cleanup or rollback is included in this change.

## Local tests (no production data)

- `node --experimental-vm-modules tests/private-storage.mjs`: signing, old/new
  references, anonymous accounts, renewal, revocation events and async races.
- `tests/private-storage.sql`: run only in an empty disposable PostgreSQL cluster;
  uses synthetic Storage/auth tables and deliberately permissive legacy policies.
  Tests reader/admin/anonymous rights, moving into a protected bucket, preserving
  unrelated buckets, idempotency and unchanged bucket visibility/object rows.
- Start Vite and open `/studienotater/tests/private-storage.html` (mocked Storage
  and Data API) and `/studienotater/tests/note-import.html`.
- `npm run build`; existing backend and frontend AI regressions.

Real Supabase signing/upload behavior with these policies and the final private
bucket switch still requires manual verification. These have not been applied
or tested in production as part of implementation.
