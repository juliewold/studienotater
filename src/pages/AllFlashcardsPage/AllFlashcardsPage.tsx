import "./AllFlashcardsPage.css"
import { useState } from "react";
import { flashcards } from "../../data/flashcards";
import { subjects } from "../../data/subjects";
import { Link } from "react-router-dom";

export const AllFlashcardsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const flashcardSubjects = Object.entries(flashcards)
    .map(([subjectId, subjectFlashcards]) => {
      const subject = subjects.find(
        (subject) => subject.id === subjectId
      );

      return {
        id: subjectId,
        code: subject?.code ?? subjectId.toUpperCase(),
        name: subject?.name ?? "",
        count: subjectFlashcards.length,
      };
    })
    .filter((subject) =>
      `${subject.code} ${subject.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <main className="page-container">
      <p className="page-label">Flashcards</p>

      <h1>Flashcards</h1>

      <p>Velg et fag for å starte repetisjon.</p>

      <input
        className="notes-search"
        type="text"
        placeholder="Søk etter fag..."
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
      />

      <div className="all-flashcards-grid">
        {flashcardSubjects.map((subject) => (
          <div
            key={subject.id}
            className="flashcard-deck-card"
          >
            <p className="subject-code">
              {subject.code}
            </p>

            <h3>{subject.name}</h3>

            <p>
              {subject.count} flashcards
            </p>

            <Link
              to={`/fag/${subject.id}/flashcards`}
              className="deck-button"
            >
              Start
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};