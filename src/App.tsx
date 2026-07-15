import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
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
import { ProgrammingPage } from "./pages/ProgrammingPage/ProgrammingPage";
import { ProgrammingTopicPage } from "./pages/ProgrammingTopicPage/ProgrammingTopicPage";
import { AboutPage } from "./pages/AboutPage/AboutPage";
import { FavoritesPage } from "./pages/FavoritesPage/FavoritesPage";
import { ExamViewerPage } from "./pages/ExamViewerPage/ExamViewerPage";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute/PublicOnlyRoute";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import { UpdatePasswordPage } from "./pages/UpdatePasswordPage/UpdatePasswordPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { YearsPage } from "./pages/YearsPage/YearsPage";
import { SemesterPlanPage } from "./pages/SemesterPlanPage/SemesterPlanPage";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import { AdminRoute } from "./components/AdminRoute/AdminRoute";
import { AdminPdfsPage } from "./pages/AdminPdfsPage/AdminPdfsPage";
import { AdminNotesPage } from "./pages/AdminNotesPage/AdminNotesPage";

function App() {
  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route
          path="/logg-inn"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/registrer"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/glemt-passord"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/oppdater-passord" element={<UpdatePasswordPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/AboutPage" element={<AboutPage />} />

        <Route
          path="/fag/:subjectId"
          element={
            <ProtectedRoute>
              <SubjectPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/notater"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/notater/:noteId"
          element={
            <ProtectedRoute>
              <NotePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/flashcards"
          element={
            <ProtectedRoute>
              <FlashcardsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/videoer"
          element={
            <ProtectedRoute>
              <VideosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/eksamen"
          element={
            <ProtectedRoute>
              <ExamsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notater"
          element={
            <ProtectedRoute>
              <AllNotesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/flashcards"
          element={
            <ProtectedRoute>
              <AllFlashcardsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/videoer"
          element={
            <ProtectedRoute>
              <AllVideosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/pdfs"
          element={
            <ProtectedRoute>
              <PdfsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/pdfs/:pdfId"
          element={
            <ProtectedRoute>
              <PdfViewerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pdfs"
          element={
            <ProtectedRoute>
              <AllPdfsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/semesterstart"
          element={
            <ProtectedRoute>
              <SemesterStartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/klassetrinn"
          element={
            <ProtectedRoute>
              <YearsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/klassetrinn/:year"
          element={
            <ProtectedRoute>
              <YearPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/eksamen"
          element={
            <ProtectedRoute>
              <ExamOverviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/studieplan"
          element={
            <ProtectedRoute>
              <StudyPlanPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/bok/:bookId"
          element={
            <ProtectedRoute>
              <BookProgressPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programmering"
          element={
            <ProtectedRoute>
              <ProgrammingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programmering/:topicId"
          element={
            <ProtectedRoute>
              <ProgrammingTopicPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programmering/:topicId/:lessonId"
          element={
            <ProtectedRoute>
              <ProgrammingTopicPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/FavoritesPage"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fag/:subjectId/eksamen/:examId/:fileId"
          element={
            <ProtectedRoute>
              <ExamViewerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fagplan"
          element={
            <ProtectedRoute>
              <SemesterPlanPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/innstillinger"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        <Route path="/admin/pdfs" element={<AdminPdfsPage />} />
        <Route
          path="/admin/notater"
          element={
            <AdminRoute>
              <AdminNotesPage />
            </AdminRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
