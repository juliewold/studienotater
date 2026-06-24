import "./ProgrammingPage.css";

const programmingSections = [
  {
    title: "Språk",
    description: "Programmeringsspråk og databasespråk.",
    items: ["Python", "Java", "C++", "JavaScript", "TypeScript", "SQL"],
  },
  {
    title: "Frontend",
    description: "Det brukeren ser og samhandler med på nettsiden.",
    items: ["HTML", "CSS", "JavaScript", "React", "Vite"],
  },
  {
    title: "Backend",
    description: "Servere, API-er, databaser og logikken bak applikasjoner.",
    items: ["Django", "Django REST Framework", "API-er", "Databaser", "SQL"],
  },
  {
    title: "Verktøy",
    description: "Verktøy som brukes under utvikling og deployment.",
    items: ["Git", "GitHub", "Terminal", "VS Code", "Docker"],
  },
  {
    title: "Konsepter",
    description: "Grunnleggende konsepter alle utviklere møter.",
    items: [
      "OOP",
      "Datastrukturer",
      "Algoritmer",
      "CRUD",
      "HTTP",
      "REST API",
      "Autentisering",
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
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
