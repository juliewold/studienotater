import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { SubjectPage } from "./pages/SubjectPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/fag/:subjectId"
          element={<SubjectPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;