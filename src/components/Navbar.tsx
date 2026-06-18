import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-mark"></span>
        <span>Studienotater</span>
      </Link>

      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav-link" : "nav-link"
          }
        >
          Hjem
        </NavLink>

        <NavLink
          to="/notater"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav-link" : "nav-link"
          }
        >
          Notater
        </NavLink>

        <NavLink
          to="/flashcards"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav-link" : "nav-link"
          }
        >
          Flashcards
        </NavLink>

        <NavLink
          to="/studieplanlegger"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav-link" : "nav-link"
          }
        >
          Studieplanlegger
        </NavLink>
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
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Hjem
              </Link>
              <Link to="/notater" onClick={() => setMenuOpen(false)}>
                Notater
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Flashcards
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Videoer
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                PDF-er
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Eksamen
              </Link>
            </div>

            <div className="menu-column">
              <h3>MINE STUDIER</h3>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Semesterstart
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Mine fag
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Klassetrinn
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Favoritter
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </div>

            <div className="menu-column">
              <h3>PLANLEGGING</h3>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Studieplanlegger
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Semesterplan / Fagplan
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Eksamensnedtelling
              </Link>
            </div>

            <div className="menu-column">
              <h3>ANNET</h3>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Om nettsiden
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Innstillinger
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Logg inn
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
