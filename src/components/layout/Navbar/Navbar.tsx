import "./Navbar.css";
import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { supabase } from "../../../lib/supabase";
import { GlobalSearch } from "../../search/GlobalSearch/GlobalSearch";

export const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [username, setUsername] = useState("");

  const { user, isLoading, signOut } = useContext(AuthContext);

  useEffect(() => {
    const loadUsername = async () => {
      if (!user) {
        setUsername("");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Kunne ikke hente brukernavn:", error);
        setUsername("");
        return;
      }

      setUsername(data.username ?? "");
    };

    loadUsername();
  }, [user]);

  const displayName = username || user?.email?.split("@")[0] || "Profil";

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
          to="/fagplan"
          className={({ isActive }) =>
            isActive ? "nav-link active-nav-link" : "nav-link"
          }
        >
          Fagplan
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
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
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
            <GlobalSearch onNavigate={() => setMenuOpen(false)} />
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
                to="/fagplan"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                Fagplan
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
                Forelesningsnotater
              </NavLink>

              <NavLink
                to="/programmering"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
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
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                Semesterstart
              </NavLink>

              <NavLink
                to="/klassetrinn"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
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
                to="/kalender"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "menu-link active-menu-link" : "menu-link"
                }
              >
                Kalender
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
                    to="/registrer"
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
