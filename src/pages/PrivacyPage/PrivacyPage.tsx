import "./PrivacyPage.css";

// The deletion sentence follows the same build flag as the Settings section,
// so the notice never claims a deletion option that is not active.
const deletionEnabled = import.meta.env.VITE_ACCOUNT_DELETION_ENABLED === "true";

export const PrivacyPage = () => {
  return (
    <main className="page-container privacy-page">
      <p className="page-label">Juridisk</p>

      <h1>Personvernerklæring</h1>

      <p className="page-description">
        Her forklarer vi hvilke personopplysninger Studienotater behandler, hvorfor, og hvilke rettigheter du har.
        Sist oppdatert: 18. november 2026.
      </p>

      <section className="privacy-section">
        <h2>Hvem er ansvarlig?</h2>
        <p>
          Studienotater er et personlig studieprosjekt drevet av Julie Wold. Ansvarlig for behandlingen av
          personopplysninger er Julie Wold.
        </p>
        <p>
          Kontakt for personvernspørsmål: <strong><a href="mailto:juliewold2006@gmail.com">juliewold2006@gmail.com</a></strong>
        </p>
      </section>

      <section className="privacy-section">
        <h2>Hvilke opplysninger behandler vi?</h2>
        <ul>
          <li>
            <strong>Kontoopplysninger:</strong> e-postadresse, brukernavn, fullt navn og passord. Passordet lagres
            kryptert av innloggingstjenesten og er ikke synlig for oss.
          </li>
          <li>
            <strong>Personlig bruk:</strong> favoritter, fagvalg, og fremdrift i pensum, oppgaver og eksamensoppgaver
            knyttet til kontoen din. Øvingsøkter, svarene dine på øvingsoppgaver og påbegynte øvinger lagres også
            knyttet til kontoen din, slik at de følger deg mellom enheter.
          </li>
          <li>
            <strong>Tekst du sender til KI-funksjoner:</strong> når du bruker KI-funksjoner i appen, sendes teksten
            du velger, for eksempel innholdet i et notat, til språkmodelltjenesten til NTNU for å generere resultatet.
          </li>
          <li>
            <strong>Lokal lagring i nettleseren:</strong> innloggingen din og enkelte innstillinger, som tema og
            innstillinger i forelesningsspilleren, lagres i nettleseren din. Innloggingen er nødvendig for at tjenesten
            skal fungere. Innstillingene er valg du gjør selv, og de inneholder ingen personopplysninger om deg. Disse
            opplysningene slettes ikke automatisk når du sletter kontoen.
          </li>
          <li>
            <strong>Tekniske logger:</strong> tjenestene som driver nettsiden (hosting og database) registrerer
            tekniske opplysninger som IP-adresse og tidspunkt for forespørsler, for drift og sikkerhet.
          </li>
        </ul>
        <p>
          Appen bruker ikke analyseverktøy eller sporingscookies.
        </p>
        <p>
          Videoer fra YouTube vises på sidene våre først når du har godtatt det én gang. Før det lastes ingenting fra
          YouTube. Når du spiller av videoene, setter YouTube informasjonskapsler og kan behandle IP-adressen din, etter
          YouTubes egne regler. Valget ditt lagres i nettleseren din (nøkkelen <code>youtube-consent</code>) til du
          trekker det tilbake under Innstillinger. Du kan også åpne videoene direkte på YouTube.
        </p>
      </section>

      <section className="privacy-section">
        <h2>Formål og rettslig grunnlag</h2>
        <ul>
          <li>
            <strong>Levere tjenesten</strong> (kontoen, lagring av fremdrift og favoritter, innlogging): nødvendig for
            å oppfylle avtalen om bruk av Studienotater (GDPR art. 6 nr. 1 bokstav b).
          </li>
          <li>
            <strong>Drift og sikkerhet</strong> (tekniske logger, beskyttelse mot misbruk): berettiget interesse i å
            drive tjenesten trygt (GDPR art. 6 nr. 1 bokstav f).
          </li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>Hvem deler vi opplysninger med?</h2>
        <p>Vi bruker disse tjenestene til å drive nettsiden. De behandler opplysninger på våre vegne:</p>
        <ul>
          <li><strong>Supabase:</strong> database, innlogging og lagring av filer. Databasen ligger i EU (region Stockholm). Supabase behandler opplysningene etter en databehandleravtale (DPA) som er en del av vilkårene deres.</li>
          <li><strong>GitHub Pages:</strong> hosting av selve nettsiden.</li>
          <li><strong>NTNU:</strong> språkmodelltjenesten som brukes til KI-funksjoner. Bare tekst du selv sender inn, sendes dit.</li>
        </ul>
        <p>Vi selger ikke opplysningene dine og deler dem ikke med andre.</p>
      </section>

      <section className="privacy-section">
        <h2>Hvor lenge lagrer vi opplysningene?</h2>
        <p>
          Kontoopplysninger og personlig bruk lagres så lenge kontoen finnes. Når kontoen slettes, fjernes de fra den
          aktive databasen. Sikkerhetskopier og tekniske logger hos tjenesteleverandørene kan beholdes i en begrenset
          periode: Supabase tar daglige sikkerhetskopier og beholder dem i 7 dager.
        </p>
      </section>

      <section className="privacy-section">
        <h2>Dine rettigheter</h2>
        <ul>
          <li>
            <strong>Innsyn og kopi:</strong> du kan laste ned opplysningene dine som en JSON-fil under{" "}
            <a href="#/innstillinger">Innstillinger</a>.
          </li>
          <li>
            <strong>Retting:</strong> du kan endre profilopplysninger under <a href="#/profil">profil</a>.
          </li>
          <li>
            <strong>Sletting:</strong>{" "}
            {deletionEnabled ? (
              <>du kan slette kontoen din selv under <a href="#/innstillinger">Innstillinger</a>.</>
            ) : (
              <>send en henvendelse til kontaktadressen over, så slettes kontoen din.</>
            )}
          </li>
          <li>
            <strong>Begrensning og innvendinger:</strong> du kan be oss begrense behandlingen eller protestere mot den,
            ved å kontakte oss.
          </li>
          <li>
            <strong>Klage:</strong> du kan klage til Datatilsynet dersom du mener vi behandler opplysningene dine i
            strid med regelverket (datatilsynet.no).
          </li>
        </ul>
      </section>

    </main>
  );
};
