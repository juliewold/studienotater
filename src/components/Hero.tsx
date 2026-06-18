export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-card">
        <p className="hero-label">NTNU DATATEKNOLOGI</p>

        <h1>
          Ditt personlige <span>læringsbibliotek</span>
        </h1>

        <p className="hero-text">
          Samle notater, øv med flashcards, se videoer, les PDF-er og planlegg
          uka — alt på ett sted.
        </p>

        <div className="hero-actions">
          <button>Bla i notater</button>
          <button>Start repetisjon</button>
          <button>Studieplanlegger</button>
        </div>

        <input
          className="hero-search"
          type="text"
          placeholder="Søk etter fag, kode eller emne..."
        />
      </div>
    </section>
  );
};