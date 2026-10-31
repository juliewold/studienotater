# AI endpoint authentication

All five AI endpoints require `Authorization: Bearer <Supabase access token>`.
This preserves the current frontend permission model: AI tools are admin-only.
Ordinary users retain access to existing study content, but cannot invoke AI.
Request bodies and successful response formats are unchanged.

Configure these variables in the Django server environment (or `backend/.env`):

- `SUPABASE_URL`: HTTPS project origin, matching the frontend project, without a path.
- `SUPABASE_ANON_KEY`: the project's public anon/publishable API key. Do not use a service-role key.
- `NTNU_LLM_API_KEY`: unchanged, server-only.

Each POST verifies the access token with the configured project's `/auth/v1/user`.
It then reads only that verified user's `profiles.id,role` using the same token
and RLS. Client-supplied roles, user IDs and Auth user metadata are not trusted.
There is no role cache. Missing/invalid tokens return JSON `error` with HTTP 401;
non-admin/missing profiles return 403. Configuration, network and unexpected
Supabase errors return 503 and do not call the AI provider. Tokens and upstream
error bodies are not logged or returned. Redirects are rejected.

## Database prerequisite

Verify that the existing `database/migrations/20261013_note_folder_admin.sql`
and its prerequisites have been applied. Its `protect_profile_admin_role` trigger
prevents API users from assigning themselves an admin role. The caller must also
have SELECT access to their own `profiles.id,role` through existing RLS policies.
No database migration or live database modification is performed by this change.

The endpoints use only explicit Bearer authentication, not Django session cookies;
their existing CSRF exemption remains. CORS preflights remain supported by
django-cors-headers. Deploy only to an HTTPS backend with its intended CORS origins.

## Verification

Run `backend/.venv/bin/python backend/manage.py test concepts ai --noinput`
and `npm run build` from the repository root. Run the five frontend token flows
with `node --experimental-vm-modules tests/ai-auth.mjs`. Auth tests mock the Supabase HTTP
boundary; existing AI tests mock authenticated admin requests and the AI provider.
No live Supabase or NTNU calls are made by these tests.

Before deployment, use a test Supabase project to confirm: missing/expired tokens
give 401; a normal account gives 403 on all five routes; an administrator can use
each tool; changing a user's own role through the Data API is rejected. Verify
the frontend and backend point at the same project. Never commit test credentials.
