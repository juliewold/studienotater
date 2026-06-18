import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { SubjectPage } from "./pages/SubjectPage";
import { NotesPage } from "./pages/NotesPage";
import { NotePage } from "./pages/NotePage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { VideosPage } from "./pages/VideosPage";
import { ExamsPage } from "./pages/ExamsPage";
import { AllNotesPage } from "./pages/AllNotesPage";
import { AllFlashcardsPage } from "./pages/AllFlashCardsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/fag/:subjectId" element={<SubjectPage />} />

        <Route path="/fag/:subjectId/notater" element={<NotesPage />} />

        <Route path="/fag/:subjectId/notater/:noteId" element={<NotePage />} />

        <Route path="/fag/:subjectId/flashcards" element={<FlashcardsPage />} />

        <Route path="/fag/:subjectId/videoer" element={<VideosPage />} />

        <Route path="/fag/:subjectId/eksamen" element={<ExamsPage />} />

        <Route path="/notater" element={<AllNotesPage />} />

        <Route path="/flashcards" element={<AllFlashcardsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
