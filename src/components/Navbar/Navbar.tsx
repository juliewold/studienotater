import "./Navbar.css";
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
          to="/videoer"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav-link" : "nav-link"
          }
        >
          Videoer
        </NavLink>
      </nav>

      <div className="nav-actions">
        <button className="icon-button">☾</button>
        <button className="profile-button">Julie</button>

        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="menu-overlay">
          <div className="menu-top">
            <input type="text" placeholder="Hva leter du etter?" />
          </div>

          <div className="menu-grid">
            <div className="menu-column">
              <h3>SIDER</h3>
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                Hjem
              </NavLink>

              <NavLink
                to="/notater"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                Notater
              </NavLink>

              <NavLink
                to="/flashcards"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                Flashcards
              </NavLink>

              <NavLink
                to="/videoer"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                Videoer
              </NavLink>

              <NavLink
                to="/pdfs"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                PDF-er
              </NavLink>
            </div>

            <div className="menu-column">
              <h3>MINE STUDIER</h3>

              <NavLink
                to="/semesterstart"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                Semesterstart
              </NavLink>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Mine fag
              </NavLink>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Klassetrinn
              </NavLink>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Favoritter
              </NavLink>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Dashboard
              </NavLink>
            </div>

            <div className="menu-column">
              <h3>PLANLEGGING</h3>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Studieplanlegger
              </NavLink>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Semesterplan / Fagplan
              </NavLink>

              <NavLink
                to="/eksamen"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                Eksamensnedtelling
              </NavLink>
            </div>

            <div className="menu-column">
              <h3>ANNET</h3>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Om nettsiden
              </NavLink>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Innstillinger
              </NavLink>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Logg inn
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
