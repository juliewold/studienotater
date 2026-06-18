import "./PdfsPage.css";
import { Link, useParams } from "react-router-dom";
import { pdfs } from "../../data/pdfs";

const categories = [
  {
    id: "forelesninger",
    title: "Forelesningsnotater",
    icon: "📚",
  },
  {
    id: "presentasjoner",
    title: "Presentasjonsnotater",
    icon: "🖥️",
  },
  {
    id: "eksamener",
    title: "Eksamener",
    icon: "📝",
  },
];

export const PdfsPage = () => {
  const { subjectId } = useParams();

  const subjectPdfs = pdfs[subjectId as keyof typeof pdfs] || [];

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">PDF-er</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {categories.map((category) => {
        const categoryPdfs = subjectPdfs.filter(
          (pdf) => pdf.category === category.id,
        );

        if (categoryPdfs.length === 0) {
          return null;
        }

        return (
          <section key={category.id} className="pdf-category-section">
            <h2>
              {category.icon} {category.title}
            </h2>

            <div className="pdf-grid">
              {categoryPdfs.map((pdf) => (
                <Link
                  key={pdf.id}
                  to={`/fag/${subjectId}/pdfs/${pdf.id}`}
                  className="pdf-card"
                >
                  <span className="pdf-icon">📄</span>

                  <h3>{pdf.title}</h3>

                  <span className="pdf-arrow">→</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
};