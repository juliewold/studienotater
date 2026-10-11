import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../src/context/ThemeProvider";
import { useTheme } from "../src/hooks/useTheme";
import { NoteCard } from "../src/components/notes/NoteCard/NoteCard";
import { SubjectCard } from "../src/components/subjects/SubjectCard/SubjectCard";
import type { DatabaseNote } from "../src/services/notes/notesService";
import "../src/App";
import "../src/index.css";
import "../src/styles/global.css";
import "../src/styles/containers.css";
import "../src/styles/theme.css";

// Isolated visual fixture; never reads or changes study data.
window.fetch = async () => Response.json([]);
const note = { id: "test", slug: "test", title: "Forventning og varians", description: "Et notat med forklaring og eksempler.", subjectId: "tma4240", folderId: null } as DatabaseNote;
export function SurfacePreview() {
  const { dark, toggleTheme } = useTheme();
  return <main className="page-container">
    <h1>Flater og kontrast</h1><button onClick={toggleTheme}>{dark ? "Lyst tema" : "Mørkt tema"}</button>
    <div className="notes-search"><label htmlFor="search">Søk i notater</label><input id="search" placeholder="Søk etter tema…" /></div>
    <section className="notes-topic"><h2><button>Stokastiske variabler</button></h2><div className="notes-subtopic"><h3>Forventning</h3><NoteCard note={note} subjectId="tma4240" progress={{ completed: true, rating: 4 }} /></div></section>
    <section className="topic-page-section"><a className="topic-page-subtopic" href="#test"><span className="topic-page-subtopic-number">1</span><span className="topic-page-subtopic-name">Diskrete fordelinger</span></a></section>
    <section className="subtopic-page-section"><a className="subtopic-page-concept" href="#test"><div><span className="subtopic-page-concept-type">Definisjon</span><h3>Forventningsverdi</h3><p>Gjennomsnittet over mange forsøk.</p></div></a></section>
    <section className="subject-topic-progress"><h2>Progresjon</h2><div className="subject-topic-progress-item"><p className="subject-topic-progress-name">Diskrete fordelinger</p><p className="subject-topic-progress-meta">2 av 4 fullført</p><div className="subject-topic-progress-bar"><div className="subject-progress-fill" style={{ width: "50%" }} /></div></div></section>
    <section className="resource-progress"><label className="resource-completed"><input type="checkbox" defaultChecked/>Marker som lest</label><div className="resource-rating"><p>Forståelse</p></div></section>
    <SubjectCard id="tma4240" code="TMA4240" name="Statistikk" color="pink" />
  </main>;
}
createRoot(document.getElementById("root")!).render(<MemoryRouter><ThemeProvider><SurfacePreview /></ThemeProvider></MemoryRouter>);
