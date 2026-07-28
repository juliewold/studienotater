import "./AdminPage.css";
import { Link } from "react-router-dom";

export const AdminPage = () => {
  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Adminpanel</h1>

      <p className="page-description">Administrer innholdet på nettsiden.</p>

      <div className="admin-grid">
        <Link to="/admin/pdfs" className="admin-card">
          <h2>PDF-er</h2>
          <p>Legg til og administrer PDF-filer.</p>
        </Link>

        <Link to="/admin/eksamener" className="admin-card">
          <h2>Eksamener</h2>
          <p>Legg til og administrer eksamener.</p>
        </Link>

        <button type="button" className="admin-card">
          <h2>Fag</h2>
          <p>Legg til og rediger fag.</p>
        </button>

        <Link to="/admin/notater" className="admin-card">
          <h2>Notater</h2>
          <p>Legg til og administrer notater.</p>
        </Link>

        <Link to="/admin/videoer" className="admin-card">
          <h2>Videoer</h2>
          <p>Legg til og administrer videoer.</p>
        </Link>

        <Link to="/admin/video-struktur" className="admin-card">
          <h2>Videostruktur</h2>

          <p>Administrer temaer og undertemaer for videoer.</p>
        </Link>

        <Link to="/admin/flashcards" className="admin-card">
          <h2>Flashcards</h2>
          <p>Legg til og administrer flashcards.</p>
        </Link>

        <Link to="/admin/studieplaner" className="admin-card">
          <h2>Studieplaner</h2>
          <p>Opprett og administrer temaer, oppgaver og ressurser.</p>
        </Link>
      </div>
    </main>
  );
};
