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

        <button type="button" className="admin-card">
          <h2>Eksamener</h2>
          <p>Legg til eksamensdatoer og eksamensfiler.</p>
        </button>

        <button type="button" className="admin-card">
          <h2>Fag</h2>
          <p>Legg til og rediger fag.</p>
        </button>

        <button type="button" className="admin-card">
          <h2>Notater</h2>
          <p>Legg til og administrer notater.</p>
        </button>

        <button type="button" className="admin-card">
          <h2>Videoer</h2>
          <p>Legg til og administrer videoer.</p>
        </button>

        <button type="button" className="admin-card">
          <h2>Flashcards</h2>
          <p>Legg til og administrer flashcards.</p>
        </button>
      </div>
    </main>
  );
};
