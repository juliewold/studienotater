import "./Hero.css";

export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-card">

        <h1>Studienotater for datateknologi</h1>

        <p className="hero-text">
          Samle notater, øv med flashcards, se videoer og følg pensum gjennom
          hele studiet.
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
