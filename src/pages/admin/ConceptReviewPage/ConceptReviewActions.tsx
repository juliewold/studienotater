import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import type { Concept } from "../../../data/concepts/types";
import { applyConceptReview, type ConceptEdits } from "../../../services/concepts/conceptReviewActions";

export function ConceptReviewActions({ concept, onChange }: { concept: Concept; onChange: (values: ConceptEdits | null) => void }) {
  const { isAdmin } = useContext(AuthContext);
  const [mode, setMode] = useState<"idle" | "edit" | "delete">("idle");
  const [values, setValues] = useState<ConceptEdits>({ name: concept.name, shortDefinition: concept.shortDefinition ?? "", explanation: concept.explanation ?? "" });
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (!isAdmin) return null;
  async function submit(action: "edit" | "delete") {
    if (busy || (action === "delete" && confirmation !== concept.name)) return;
    setBusy(true); setMessage("");
    try {
      await applyConceptReview(concept, action, values);
      onChange(action === "delete" ? null : { ...values, name: values.name.trim(), shortDefinition: values.shortDefinition.trim() });
      setMode("idle"); setMessage(action === "edit" ? "Endringene er lagret." : "Begrepet er slettet.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Handlingen mislyktes. Prøv igjen."); }
    finally { setBusy(false); }
  }
  return <section className="concept-review-actions" aria-label="Manuell gjennomgang">
    <h2>Din vurdering</h2>
    {mode === "idle" ? <div>
      <button type="button" onClick={() => setMessage("Beholdt uten endringer i denne gjennomgangen. Ingen data er skrevet.")}>Behold</button>{" "}
      <button type="button" onClick={() => { setValues({ name: concept.name, shortDefinition: concept.shortDefinition ?? "", explanation: concept.explanation ?? "" }); setMessage(""); setMode("edit"); }}>Rediger</button>{" "}
      <button type="button" onClick={() => { setConfirmation(""); setMessage(""); setMode("delete"); }}>Slett</button>
    </div> : mode === "edit" ? <form onSubmit={event => { event.preventDefault(); void submit("edit"); }}>
      <label>Navn<input required maxLength={300} disabled={busy} value={values.name} onChange={event => setValues({ ...values, name: event.target.value })} /></label>
      <label>Definisjon<textarea required maxLength={10000} disabled={busy} value={values.shortDefinition} onChange={event => setValues({ ...values, shortDefinition: event.target.value })} /></label>
      <label>Forklaring<textarea maxLength={50000} disabled={busy} value={values.explanation} onChange={event => setValues({ ...values, explanation: event.target.value })} /></label>
      <button disabled={busy || !values.name.trim() || !values.shortDefinition.trim()}>Lagre endringer</button>{" "}<button type="button" disabled={busy} onClick={() => setMode("idle")}>Avbryt</button>
    </form> : <form onSubmit={event => { event.preventDefault(); void submit("delete"); }}>
      <p>Slett «{concept.name}» permanent? Begrepet og dets pensumkoblinger fjernes. Sletting stoppes hvis notater eller andre ressurser fortsatt refererer til begrepet. Notater endres ikke.</p>
      <label>Skriv begrepets navn for å bekrefte<input autoComplete="off" disabled={busy} value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>
      <button disabled={busy || confirmation !== concept.name}>Bekreft sletting</button>{" "}<button type="button" disabled={busy} onClick={() => setMode("idle")}>Avbryt</button>
    </form>}
    {message && <p role="status">{message}</p>}
  </section>;
}
