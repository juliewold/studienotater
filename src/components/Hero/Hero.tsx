import "./Hero.css";
import { Link } from "react-router-dom";

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
          <Link to="/notater" className="hero-button">
            Se notater
          </Link>

          <Link to="/pdfs" className="hero-button secondary">
            Utforsk PDF-er
          </Link>
        </div>
      </div>
    </section>
  );
};