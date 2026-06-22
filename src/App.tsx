import { HashRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import { HomePage } from "./pages/HomePage/HomePage";
import { SubjectPage } from "./pages/SubjectPage/SubjectPage";
import { NotesPage } from "./pages/NotesPage/NotesPage";
import { NotePage } from "./pages/NotePage/NotePage";
import { FlashcardsPage } from "./pages/FlashcardsPage/FlashcardsPage";
import { VideosPage } from "./pages/VideosPage/VideosPage";
import { ExamsPage } from "./pages/ExamsPage/ExamsPage";
import { AllNotesPage } from "./pages/AllNotesPage/AllNotesPage";
import { AllFlashcardsPage } from "./pages/AllFlashcardsPage/AllFlashcardsPage";
import { AllVideosPage } from "./pages/AllVideosPage/AllVideosPage";
import { PdfsPage } from "./pages/PdfsPage/PdfsPage";
import { PdfViewerPage } from "./pages/PdfViewerPage/PdfViewerPage";
import { AllPdfsPage } from "./pages/AllPdfsPage/AllPdfsPage";
import { SemesterStartPage } from "./pages/SemesterStartPage/SemesterStartPage";
import { YearPage } from "./pages/YearPage/YearPage";
import { ExamOverviewPage } from "./pages/ExamOverviewPage/ExamOverviewPage";
import { StudyPlanPage } from "./pages/StudyPlanPage/StudyPlanPage";
import { BookProgressPage } from "./pages/BookProgressPage/BookProgressPage";

function App() {
  return (
    <HashRouter>
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

        <Route path="/videoer" element={<AllVideosPage />} />

        <Route path="/fag/:subjectId/pdfs" element={<PdfsPage />} />

        <Route path="/fag/:subjectId/pdfs/:pdfId" element={<PdfViewerPage />} />

        <Route path="/pdfs" element={<AllPdfsPage />} />

        <Route path="/semesterstart" element={<SemesterStartPage />} />

        <Route path="/klassetrinn/:year" element={<YearPage />} />

        <Route path="/eksamen" element={<ExamOverviewPage />} />

        <Route path="/fag/:subjectId/studieplan" element={<StudyPlanPage />} />

        <Route
          path="/fag/:subjectId/bok/:bookId"
          element={<BookProgressPage />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
