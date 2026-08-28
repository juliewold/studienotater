import "./SemesterStartPage.css";
import { useState } from "react";
import { subjects } from "../../../data/subjects";
import { useSemesterSubjects } from "../../../hooks/useSemesterSubjects";

export const SemesterStartPage = () => {
  const [selectedYear, setSelectedYear] = useState(1);
  const [customCode, setCustomCode] = useState("");
  const [customName, setCustomName] = useState("");

  const {
    semesterSubjects,
    isLoadingSemesterSubjects,
    isSelected,
    toggleSubject,
    addCustomSubject,
    removeCustomSubject,
  } = useSemesterSubjects();

  const filteredSubjects = subjects.filter(
    (subject) => subject.year === selectedYear,
  );

  const allSubjects = [
    ...subjects.map((subject) => ({
      id: subject.id,
      code: subject.code,
      name: subject.name,
    })),
    ...semesterSubjects
      .filter(
        (subject) =>
          subject.customCode !== null &&
          subject.customName !== null,
      )
      .map((subject) => ({
        id: subject.subjectId,
        code: subject.customCode ?? "",
        name: subject.customName ?? "",
      })),
  ];

  const selectedSubjectIds = semesterSubjects.map(
    (subject) => subject.subjectId,
  );

  const handleAddCustomSubject = async () => {
    const trimmedCode = customCode.trim();
    const trimmedName = customName.trim();

    if (!trimmedCode || !trimmedName) {
      return;
    }

    const subjectId = trimmedCode
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (isSelected(subjectId)) {
      return;
    }

    await addCustomSubject(
      subjectId,
      trimmedCode.toUpperCase(),
      trimmedName,
    );

    setCustomCode("");
    setCustomName("");
  };

  if (isLoadingSemesterSubjects) {
    return (
      <main className="page-container">
        <p>Laster semesterfag...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <p className="page-label">Semesterstart</p>

      <h1>Sett opp semesteret ditt</h1>

      <p>
        Velg klassetrinn og fagene du tar dette semesteret. Du kan også legge
        til egne fag som ikke ligger i listen.
      </p>

      <section className="semester-card">
        <h2>Velg klassetrinn</h2>

        <div className="year-buttons">
          {[1, 2, 3, 4, 5].map((year) => (
            <button
              key={year}
              type="button"
              className={selectedYear === year ? "active-year" : ""}
              onClick={() => setSelectedYear(year)}
            >
              {year}. år
            </button>
          ))}
        </div>
      </section>

      <section className="semester-card">
        <h2>Velg fag</h2>

        <div className="semester-subject-list">
          {filteredSubjects.map((subject) => (
            <label key={subject.id} className="semester-subject-item">
              <input
                type="checkbox"
                checked={isSelected(subject.id)}
                onChange={() => toggleSubject(subject.id)}
              />

              <span>
                <strong>{subject.code}</strong> {subject.name}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="semester-card">
        <h2>Legg til eget fag</h2>

        <div className="custom-subject-form">
          <input
            type="text"
            placeholder="Fagkode, f.eks. TDT4120"
            value={customCode}
            onChange={(event) => setCustomCode(event.target.value)}
          />

          <input
            type="text"
            placeholder="Fagnavn"
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
          />

          <button type="button" onClick={handleAddCustomSubject}>
            Legg til fag
          </button>
        </div>
      </section>

      <section className="semester-card">
        <h2>Mine fag dette semesteret</h2>

        {selectedSubjectIds.length === 0 ? (
          <p>Ingen fag valgt enda.</p>
        ) : (
          <ul>
            {selectedSubjectIds.map((subjectId) => {
              const subject = allSubjects.find(
                (item) => item.id === subjectId,
              );

              const semesterSubject = semesterSubjects.find(
                (item) => item.subjectId === subjectId,
              );

              const isCustom =
                semesterSubject?.customCode !== null &&
                semesterSubject?.customName !== null;

              return (
                <li key={subjectId} className="selected-subject-item">
                  <span>
                    {subject?.code} – {subject?.name}
                  </span>

                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => removeCustomSubject(subjectId)}
                      className="remove-subject-button"
                    >
                      Fjern
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
};