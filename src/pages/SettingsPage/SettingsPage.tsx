import "./SettingsPage.css";

export const SettingsPage = () => {
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

            <button type="button" className="setting-button">
              Kommer senere
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
      </div>
    </main>
  );
};