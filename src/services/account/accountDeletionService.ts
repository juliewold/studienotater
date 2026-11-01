import { supabase } from "../../lib/supabase";

const messages: Record<string, string> = {
  UNAUTHENTICATED: "Økten er utløpt. Logg inn igjen før du sletter kontoen.",
  REAUTHENTICATION_REQUIRED: "Bekreft passordet på nytt før du sletter kontoen.",
  MFA_REQUIRED: "Kontoen krever tofaktorbekreftelse. Kontakt ansvarlig for hjelp med kontosletting.",
  STORAGE_REVIEW_REQUIRED: "Kontoen eier opplastede filer. Kontakt ansvarlig for å avklare eierskapet før sletting, slik at fellesmateriale bevares. Kontoen er ikke slettet.",
  SCHEMA_REVIEW_REQUIRED: "Kontosletting krever en kontroll av datalagringen. Kontakt ansvarlig. Kontoen er ikke slettet.",
};
const uncertainOutcome = "Slettingen kunne ikke bekreftes. Kontoen kan være slettet hvis forbindelsen ble brutt. Prøv å logge inn på nytt, eller kontakt ansvarlig.";

/** No target user ID or privileged key is ever sent by this client. */
export async function deleteOwnAccount(password: string, expectedUserId: string): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
    .catch(() => { throw new Error(messages.UNAUTHENTICATED); });
  if (userError || !user?.email || user.is_anonymous || user.id !== expectedUserId) throw new Error(messages.UNAUTHENTICATED);
  if (!password) throw new Error("Skriv inn passordet ditt for å bekrefte slettingen.");
  // Password goes directly to Supabase Auth, never to the deletion function.
  const { data, error } = await supabase.auth.signInWithPassword({ email: user.email, password })
    .catch(() => { throw new Error("Passordet kunne ikke bekreftes. Kontoen er ikke slettet."); });
  if (error || !data.session || data.user?.id !== user.id) throw new Error("Passordet kunne ikke bekreftes. Kontoen er ikke slettet.");
  const { data: result, error: deletionError } = await supabase.functions.invoke("delete-account", {
    body: { confirmation: "DELETE" },
    headers: { Authorization: `Bearer ${data.session.access_token}` },
  }).catch(() => { throw new Error(uncertainOutcome); });
  if (deletionError) {
    let code: string | undefined;
    try {
      const context = deletionError.context;
      if (context instanceof Response) code = (await context.json()).code;
    } catch { /* Never display raw provider messages or personal data. */ }
    throw new Error((code && messages[code]) || uncertainOutcome);
  }
  if (result?.code !== "ACCOUNT_DELETED") throw new Error("Slettingen kunne ikke bekreftes. Kontakt ansvarlig før du prøver igjen.");
}

export async function finishDeletedAccountSession(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    return !error;
  } catch { return false; }
}
