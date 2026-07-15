import "./YearsPage.css";
import { Link } from "react-router-dom";

const years = [1, 2, 3, 4, 5];

export const YearsPage = () => {
  return (
    <main className="page-container">
      <h1>Klassetrinn</h1>

      <p className="page-description">
        Velg et klassetrinn for å se fagene som tilhører studieåret.
      </p>

      <div className="years-grid">
        {years.map((year) => (
          <Link key={year} to={`/klassetrinn/${year}`} className="year-card">
            <h2>{year}. klasse</h2>
          </Link>
        ))}
      </div>
    </main>
  );
};
