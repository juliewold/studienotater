import { supabase } from "../../lib/supabase";

/**
 * Asks the database whether a username is free. Returns null when the answer
 * is unknown (for example if the check function is not deployed yet), so the
 * UI never claims a username is free without confirmation.
 */
export async function isUsernameAvailable(username: string): Promise<boolean | null> {
  const { data, error } = await supabase.rpc("username_available", {
    p_username: username.trim().toLowerCase(),
  });
  if (error || typeof data !== "boolean") return null;
  return data;
}
