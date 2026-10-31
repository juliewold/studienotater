import { supabase } from '../src/lib/supabase';

// Isolated AI fixtures use a fake session; never authenticate against Supabase.
supabase.auth.getSession = async () => ({
  data: { session: { access_token: 'fixture-access-token' } }, error: null,
}) as Awaited<ReturnType<typeof supabase.auth.getSession>>;
