import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-mark"></span>
        <span>Studienotater</span>
      </Link>

      <nav className="nav-links">
        <Link className="active-link" to="/">
          Hjem
        </Link>
        <Link to="/notater">Notater</Link>
        <Link to="/">Flashcards</Link>
        <Link to="/">Studieplanlegger</Link>
      </nav>

      <div className="nav-actions">
        <button className="icon-button">☾</button>
        <button className="profile-button">Julie</button>

        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="menu-overlay">
          <div className="menu-top">
            <input type="text" placeholder="Hva leter du etter?" />

            <button
              className="close-menu-button"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="menu-grid">
            <div className="menu-column">
              <h3>SIDER</h3>
              <Link to="/">Hjem</Link>
              <Link to="/">Notater</Link>
              <Link to="/">Flashcards</Link>
              <Link to="/">Videoer</Link>
              <Link to="/">PDF-er</Link>
              <Link to="/">Eksamen</Link>
            </div>

            <div className="menu-column">
              <h3>MINE STUDIER</h3>
              <Link to="/">Semesterstart</Link>
              <Link to="/">Mine fag</Link>
              <Link to="/">Klassetrinn</Link>
              <Link to="/">Favoritter</Link>
              <Link to="/">Dashboard</Link>
            </div>

            <div className="menu-column">
              <h3>PLANLEGGING</h3>
              <Link to="/">Studieplanlegger</Link>
              <Link to="/">Semesterplan / Fagplan</Link>
              <Link to="/">Eksamensnedtelling</Link>
            </div>

            <div className="menu-column">
              <h3>ANNET</h3>
              <Link to="/">Om nettsiden</Link>
              <Link to="/">Innstillinger</Link>
              <Link to="/">Logg inn</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
