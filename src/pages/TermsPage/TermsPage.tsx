import "./TermsPage.css";

export const TermsPage = () => {
  return (
    <main className="page-container terms-page">
      <p className="page-label">Juridisk</p>

      <h1>Vilkår for bruk</h1>

      <p className="page-description">
        Disse vilkårene gjelder når du bruker Studienotater. Sist oppdatert: 18. november 2026.
      </p>

      <section className="terms-section">
        <h2>Formålet med tjenesten</h2>
        <p>
          Studienotater er laget for personlig studiebruk. Du får bruke innholdet til egen læring.
        </p>
      </section>

      <section className="terms-section">
        <h2>Innhold og deling</h2>
        <p>
          Pensum, oppgaver, eksamensmateriale og andre delte filer i Studienotater tilhører avsenderen. Du kan ikke dele,
          selge eller publisere dem videre uten avtale med ansvarlig.
        </p>
      </section>

      <section className="terms-section">
        <h2>Din konto</h2>
        <p>
          Du er ansvarlig for innloggingen din og for at opplysningene du oppgir, er riktige. Du kan slette kontoen din
          når som helst under <a href="#/innstillinger">Innstillinger</a>, når slettefunksjonen er tilgjengelig.
        </p>
      </section>

      <section className="terms-section">
        <h2>Endringer i tjenesten</h2>
        <p>
          Tjenesten kan endres eller avsluttes. Vi varsler om vesentlige endringer på nettsiden. Du kan slutte å bruke
          tjenesten når som helst.
        </p>
      </section>

      <section className="terms-section">
        <h2>Personopplysninger</h2>
        <p>
          Hvordan vi behandler personopplysninger, står i <a href="#/personvern">personvernerklæringen</a>.
        </p>
      </section>

      <section className="terms-section">
        <h2>Kontakt</h2>
        <p>
          Spørsmål om vilkårene sendes til <a href="mailto:juliewold2006@gmail.com">juliewold2006@gmail.com</a>.
        </p>
      </section>
    </main>
  );
};
