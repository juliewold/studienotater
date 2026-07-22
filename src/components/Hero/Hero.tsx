import "./Hero.css";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-card">
        <h1>Studienotater for datateknologi</h1>

        <p className="hero-text">
          Les fagnotater, se forelesningsnotater, øv med flashcards og forbered
          deg til eksamen gjennom hele studiet.
        </p>

        <div className="hero-actions">
          <Link to="/pdfs" className="hero-button">
            Se forelesningsnotater
          </Link>

          <Link to="/notater" className="hero-button secondary">
            Se notater
          </Link>
        </div>
      </div>
    </section>
  );
};
