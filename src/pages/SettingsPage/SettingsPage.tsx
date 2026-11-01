import "./SettingsPage.css";
import { useTheme } from "../../hooks/useTheme";
import { useContext, useRef, useState, type SyntheticEvent } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { deleteOwnAccount, finishDeletedAccountSession } from "../../services/account/accountDeletionService";

export const SettingsPage = () => {
  const { dark, toggleTheme } = useTheme();
  const { user } = useContext(AuthContext);
  const [confirming, setConfirming] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(false);
  const inFlight = useRef(false);

  const handleDelete = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current || !user || confirmation !== "SLETT" || !password) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    // Remove the password from component state as soon as it has been submitted.
    const submittedPassword = password;
    setPassword("");
    try {
      await deleteOwnAccount(submittedPassword, user.id);
      setDeleted(true);
      const cleared = await finishDeletedAccountSession();
      if (cleared) {
        // Unmount authenticated views and clear in-memory personal state.
        window.location.replace(`${import.meta.env.BASE_URL}#/logg-inn?accountDeleted=1`);
      } else {
        setError("Kontoen er slettet, men nettleserdata kunne ikke tømmes helt. Lukk alle Studienotater-faner og slett nettsteddata i nettleseren.");
      }
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Slettingen kunne ikke bekreftes. Kontakt ansvarlig.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  return (
    <main className="page-container">
      <p className="page-label">Konto</p>

      <h1>Innstillinger</h1>

      <p className="page-description">
        Tilpass nettsiden og administrer kontoinnstillingene dine.
      </p>

      <div className="settings-sections">
        <section className="settings-card">
          <h2>Utseende</h2>

          <div className="setting-row">
            <div>
              <h3>Mørk modus</h3>
              <p>Bytt mellom lyst og mørkt tema.</p>
            </div>

            <button type="button" className="setting-button" onClick={toggleTheme} aria-pressed={dark}>
              {dark ? "Bruk lyst tema" : "Bruk mørkt tema"}
            </button>
          </div>
        </section>

        <section className="settings-card">
          <h2>Profil</h2>

          <div className="setting-row">
            <div>
              <h3>Profilinformasjon</h3>
              <p>Endre brukernavn og annen profilinformasjon.</p>
            </div>

            <a href="#/profil" className="setting-link">
              Gå til profil
            </a>
          </div>
        </section>

        <section className="settings-card">
          <h2>Konto</h2>

          <div className="setting-row">
            <div>
              <h3>Passord</h3>
              <p>Oppdater passordet til kontoen din.</p>
            </div>

            <a href="#/oppdater-passord" className="setting-link">
              Endre passord
            </a>
          </div>
        </section>

        {import.meta.env.VITE_ACCOUNT_DELETION_ENABLED === "true" && <section className="settings-card account-deletion" aria-labelledby="delete-account-title">
          <h2 id="delete-account-title">Slett konto</h2>
          <p>Kontoen, profilen, favorittene, fagvalgene og den personlige fremdriften slettes permanent. Felles notater, PDF-er, bilder og eksamensfiler bevares.</p>
          <p>Sikkerhetskopier og sikkerhetslogger kan beholdes i en begrenset periode. Nedlastede filer og data i andre nettlesere slettes ikke automatisk.</p>
          <p>Øvingshistorikk og påbegynte økter er lagret per nettleser, ikke per konto. De slettes ikke automatisk, siden de også kan tilhøre andre brukere av nettleseren. Du kan tømme historikken på øvingssiden.</p>
          {deleted ? <p role="status">Kontoen er slettet.</p> : !user ? <a href="#/logg-inn">Logg inn for å administrere kontoen</a> : !confirming ? (
            <button className="delete-account-button" type="button" onClick={() => setConfirming(true)}>Slett konto</button>
          ) : (
            <form onSubmit={handleDelete} aria-label="Bekreft kontosletting">
              <p>Dette kan ikke angres. Skriv <strong>SLETT</strong> og bekreft passordet ditt. Hvis kontoen eier filer, må eierskapet avklares før kontoen kan slettes.</p>
              <label htmlFor="delete-confirmation">Skriv SLETT</label>
              <input id="delete-confirmation" value={confirmation} onChange={event => setConfirmation(event.target.value)} required autoComplete="off" disabled={busy} />
              <label htmlFor="delete-password">Passord</label>
              <input id="delete-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required disabled={busy} />
              <div className="account-deletion-actions">
                <button className="delete-account-button" type="submit" disabled={busy || confirmation !== "SLETT" || !password}>{busy ? "Sletter konto…" : "Slett kontoen permanent"}</button>
                <button type="button" disabled={busy} onClick={() => { setConfirming(false); setConfirmation(""); setPassword(""); setError(""); }}>Avbryt</button>
              </div>
            </form>
          )}
          {error && <p role="alert">{error}</p>}
        </section>}
      </div>
    </main>
  );
};
