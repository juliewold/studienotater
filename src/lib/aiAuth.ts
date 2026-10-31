import { supabase } from "./supabase";

export async function getAIAuthHeaders(): Promise<Record<string, string>> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    throw new Error("Du må være logget inn for å bruke AI-verktøyene.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.session.access_token}`,
  };
}
