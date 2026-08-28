import "./HomeShortcuts.css";
import { Link } from "react-router-dom";

export const HomeShortcuts = () => {
  return (
    <section className="home-shortcuts">
      <h2>Snarveier</h2>

      <div className="home-shortcuts-list">
        <Link to="/notater">Fagnotater</Link>

        <Link to="/pdfs">Forelesningsnotater</Link>

        <Link to="/flashcards">Flashcards</Link>

        <Link to="/eksamen">Eksamen og øving</Link>
      </div>
    </section>
  );
};
