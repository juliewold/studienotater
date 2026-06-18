import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { SubjectPage } from "./pages/SubjectPage";
import { NotesPage } from "./pages/NotesPage";
import { NotePage } from "./pages/NotePage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/fag/:subjectId" element={<SubjectPage />} />

        <Route path="/fag/:subjectId/notater" element={<NotesPage />} />

        <Route path="/fag/:subjectId/notater/:noteId" element={<NotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
