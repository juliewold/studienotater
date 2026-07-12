import "./Navbar.css";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext";

export const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { user, isLoading, signOut } = useContext(AuthContext);

  const displayName =
    user?.email?.split("@")[0] ?? "Profil";

  const handleSignOut = async () => {
    await signOut();

    setProfileMenuOpen(false);
    setMenuOpen(false);

    navigate("/logg-inn");
  };

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
        <button className="icon-button" aria-label="Bytt tema">
          ☾
        </button>

        <div className="profile-menu-wrapper">
          {isLoading ? (
            <span className="profile-loading">...</span>
          ) : user ? (
            <>
              <button
                className="profile-button"
                onClick={() =>
                  setProfileMenuOpen(!profileMenuOpen)
                }
              >
                {displayName}
              </button>

              {profileMenuOpen && (
                <div className="profile-menu">
                  <p className="profile-email">{user.email}</p>

                  <NavLink
                    to="/profil"
                    className="profile-menu-link"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Min profil
                  </NavLink>

                  <NavLink
                    to="/FavoritesPage"
                    className="profile-menu-link"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Favoritter
                  </NavLink>

                  <NavLink
                    to="/innstillinger"
                    className="profile-menu-link"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Innstillinger
                  </NavLink>

                  <button
                    className="profile-menu-link profile-sign-out"
                    onClick={handleSignOut}
                  >
                    Logg ut
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/logg-inn" className="profile-button">
              Logg inn
            </Link>
          )}
        </div>

        <button
          className="menu-button"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setProfileMenuOpen(false);
          }}
          aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="menu-overlay">
          <div className="menu-top">
            <input
              type="text"
              placeholder="Hva leter du etter?"
            />
          </div>

          <div className="menu-grid">
            <div className="menu-column">
              <h3>SIDER</h3>

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "menu-link active-menu-link"
                    : "menu-link"
                }
              >
                Hjem
              </NavLink>

              <NavLink
                to="/notater"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "menu-link active-menu-link"
                    : "menu-link"
                }
              >
                Notater
              </NavLink>

              <NavLink
                to="/flashcards"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "menu-link active-menu-link"
                    : "menu-link"
                }
              >
                Flashcards
              </NavLink>

              <NavLink
                to="/videoer"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "menu-link active-menu-link"
                    : "menu-link"
                }
              >
                Videoer
              </NavLink>

              <NavLink
                to="/pdfs"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "menu-link active-menu-link"
                    : "menu-link"
                }
              >
                PDF-er
              </NavLink>

              <NavLink
                to="/programmering"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "menu-link active-menu-link"
                    : "menu-link"
                }
              >
                Programmering
              </NavLink>
            </div>

            <div className="menu-column">
              <h3>MINE STUDIER</h3>

              <NavLink
                to="/semesterstart"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "menu-link active-menu-link"
                    : "menu-link"
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

              {user && (
                <NavLink
                  to="/FavoritesPage"
                  onClick={() => setMenuOpen(false)}
                  className="menu-link"
                >
                  Favoritter
                </NavLink>
              )}
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
                  isActive
                    ? "menu-link active-menu-link"
                    : "menu-link"
                }
              >
                Eksamensnedtelling
              </NavLink>
            </div>

            <div className="menu-column">
              <h3>ANNET</h3>

              <NavLink
                to="/AboutPage"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Om nettsiden
              </NavLink>

              <NavLink
                to="/innstillinger"
                onClick={() => setMenuOpen(false)}
                className="menu-link"
              >
                Innstillinger
              </NavLink>

              {user ? (
                <>
                  <NavLink
                    to="/profil"
                    onClick={() => setMenuOpen(false)}
                    className="menu-link"
                  >
                    Min profil
                  </NavLink>

                  <button
                    className="menu-link menu-sign-out"
                    onClick={handleSignOut}
                  >
                    Logg ut
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/logg-inn"
                    onClick={() => setMenuOpen(false)}
                    className="menu-link"
                  >
                    Logg inn
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="menu-link"
                  >
                    Registrer deg
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};