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

        <Link to="/admin/videoer" className="admin-card">
          <h2>Videoer</h2>
          <p>Legg til og administrer videoer.</p>
        </Link>

        <Link to="/admin/subject-struktur" className="admin-card">
          <h2>Fagstruktur</h2>
          <p>Administrer temaer og undertemaer.</p>
        </Link>

        <Link to="/admin/concepts" className="admin-card">
          <h2>Konsepter</h2>
          <p>Koble konsepter til temaer og undertemaer.</p>
        </Link>

        <Link to="/admin/flashcards" className="admin-card">
          <h2>Flashcards</h2>
          <p>Legg til og administrer flashcards.</p>
        </Link>

        <Link to="/admin/studieplaner" className="admin-card">
          <h2>Studieplaner</h2>
          <p>Opprett og administrer temaer, oppgaver og ressurser.</p>
        </Link>

        <Link to="/admin/boker" className="admin-card">
          <h2>Bøker</h2>
          <p>Administrer bøker, kapitler og oppgaver.</p>
        </Link>
      </div>
    </main>
  );
};
