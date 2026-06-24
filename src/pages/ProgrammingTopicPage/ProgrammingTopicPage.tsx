import { Link, useParams } from "react-router-dom";

const programmingTopics = {
  python: {
    title: "Python",
    description: "Et enkelt og populært programmeringsspråk.",
  },
  java: {
    title: "Java",
    description: "Et objektorientert språk som brukes mye i større systemer.",
  },
  cpp: {
    title: "C++",
    description: "Et kraftig språk som brukes mye i systemprogrammering.",
  },
  javascript: {
    title: "JavaScript",
    description: "Språket som gjør nettsider interaktive.",
  },
  typescript: {
    title: "TypeScript",
    description: "JavaScript med typer.",
  },
  sql: {
    title: "SQL",
    description: "Språk for å hente og endre data i databaser.",
  },
  react: {
    title: "React",
    description: "Et JavaScript-bibliotek for å bygge brukergrensesnitt.",
  },
  django: {
    title: "Django",
    description: "Et Python-rammeverk for backend og webapplikasjoner.",
  },
  git: {
    title: "Git",
    description: "Versjonskontroll for kode.",
  },
  html: {
    title: "HTML",
    description: "Strukturen på en nettside.",
  },
  css: {
    title: "CSS",
    description: "Styling og layout på nettsider.",
  },
  vite: {
    title: "Vite",
    description: "Et raskt utviklingsverktøy for moderne frontend-prosjekter.",
  },
  "django-rest-framework": {
    title: "Django REST Framework",
    description: "Brukes til å bygge API-er med Django.",
  },
  api: {
    title: "API-er",
    description: "Måten frontend og backend kommuniserer på.",
  },
  databaser: {
    title: "Databaser",
    description: "Brukes til å lagre og hente data.",
  },
  github: {
    title: "GitHub",
    description: "Plattform for å lagre og dele Git-repositories.",
  },
  terminal: {
    title: "Terminal",
    description: "Et tekstbasert verktøy for å kjøre kommandoer.",
  },
  "vs-code": {
    title: "VS Code",
    description: "En populær kodeeditor for utviklere.",
  },
  docker: {
    title: "Docker",
    description: "Brukes til å kjøre applikasjoner i containere.",
  },
  oop: {
    title: "OOP",
    description: "Objektorientert programmering med klasser og objekter.",
  },
  datastrukturer: {
    title: "Datastrukturer",
    description: "Måter å organisere data på.",
  },
  algoritmer: {
    title: "Algoritmer",
    description: "Steg-for-steg-løsninger på problemer.",
  },
  crud: {
    title: "CRUD",
    description: "Create, Read, Update og Delete.",
  },
  http: {
    title: "HTTP",
    description: "Protokollen som brukes mellom klient og server.",
  },
  "rest-api": {
    title: "REST API",
    description: "En vanlig måte å bygge API-er på.",
  },
  autentisering: {
    title: "Autentisering",
    description: "Innlogging og identifisering av brukere.",
  },
};

export function ProgrammingTopicPage() {
  const { topicId } = useParams();

  const topic = topicId
    ? programmingTopics[topicId as keyof typeof programmingTopics]
    : undefined;

  if (!topic) {
    return (
      <main>
        <Link to="/programmering">← Tilbake til programmering</Link>
        <h1>Fant ikke temaet</h1>
      </main>
    );
  }

  return (
    <main>
      <Link to="/programmering">← Tilbake til programmering</Link>

      <h1>{topic.title}</h1>
      <p>{topic.description}</p>

      <section>
        <h2>Hva er det?</h2>
        <p>Forklaring kommer her.</p>

        <h2>Grunnleggende konsepter</h2>
        <p>Notater kommer her.</p>

        <h2>Vanlige kommandoer</h2>
        <p>Kommandoer kommer her.</p>

        <h2>Kodeeksempler</h2>
        <p>Eksempler kommer her.</p>

        <h2>Ressurser</h2>
        <p>Lenker og videoer kommer her.</p>
      </section>
    </main>
  );
}
