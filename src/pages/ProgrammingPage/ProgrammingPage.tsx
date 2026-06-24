import "./ProgrammingPage.css";
import { Link } from "react-router-dom";
import "./ProgrammingPage.css";

const programmingSections = [
  {
    title: "Språk",
    description: "Programmeringsspråk og databasespråk.",
    items: [
      { name: "Python", id: "python" },
      { name: "Java", id: "java" },
      { name: "C++", id: "cpp" },
      { name: "JavaScript", id: "javascript" },
      { name: "TypeScript", id: "typescript" },
      { name: "SQL", id: "sql" },
    ],
  },
  {
    title: "Frontend",
    description: "Det brukeren ser og samhandler med på nettsiden.",
    items: [
      { name: "HTML", id: "html" },
      { name: "CSS", id: "css" },
      { name: "JavaScript", id: "javascript" },
      { name: "React", id: "react" },
      { name: "Vite", id: "vite" },
    ],
  },
  {
    title: "Backend",
    description: "Servere, API-er, databaser og logikken bak applikasjoner.",
    items: [
      { name: "Django", id: "django" },
      { name: "Django REST Framework", id: "django-rest-framework" },
      { name: "API-er", id: "api" },
      { name: "Databaser", id: "databaser" },
      { name: "SQL", id: "sql" },
    ],
  },
  {
    title: "Verktøy",
    description: "Verktøy som brukes under utvikling og deployment.",
    items: [
      { name: "Git", id: "git" },
      { name: "GitHub", id: "github" },
      { name: "Terminal", id: "terminal" },
      { name: "VS Code", id: "vs-code" },
      { name: "Docker", id: "docker" },
    ],
  },
  {
    title: "Konsepter",
    description: "Grunnleggende konsepter alle utviklere møter.",
    items: [
      { name: "OOP", id: "oop" },
      { name: "Datastrukturer", id: "datastrukturer" },
      { name: "Algoritmer", id: "algoritmer" },
      { name: "CRUD", id: "crud" },
      { name: "HTTP", id: "http" },
      { name: "REST API", id: "rest-api" },
      { name: "Autentisering", id: "autentisering" },
    ],
  },
];

export function ProgrammingPage() {
  return (
    <main className="programming-page">
      <section className="programming-hero">
        <p className="eyebrow">Programmering</p>
        <h1>Programmeringsbibliotek</h1>
        <p>
          En samlet oversikt over språk, frontend, backend og verktøy jeg lærer
          og bruker i prosjekter.
        </p>
      </section>

      <section className="programming-grid">
        {programmingSections.map((section) => (
          <article className="programming-card" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.description}</p>

            <div className="programming-tags">
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/programmering/${item.id}`}
                  className="programming-tag"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
