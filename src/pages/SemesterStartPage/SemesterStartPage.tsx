import "./SemesterStartPage.css";
import { useEffect, useState } from "react";
import { subjects } from "../../data/subjects";

type CustomSubject = {
  id: string;
  code: string;
  name: string;
};

export const SemesterStartPage = () => {
  const [selectedYear, setSelectedYear] = useState(1);
  const [customCode, setCustomCode] = useState("");
  const [customName, setCustomName] = useState("");

  const [customSubjects, setCustomSubjects] = useState<CustomSubject[]>(() => {
    const savedCustomSubjects = localStorage.getItem("custom-subjects");

    if (savedCustomSubjects) {
      return JSON.parse(savedCustomSubjects);
    }

    return [];
  });

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() => {
    const savedSubjects = localStorage.getItem("semester-subjects");

    if (savedSubjects) {
      return JSON.parse(savedSubjects);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("semester-subjects", JSON.stringify(selectedSubjects));
  }, [selectedSubjects]);

  useEffect(() => {
    localStorage.setItem("custom-subjects", JSON.stringify(customSubjects));
  }, [customSubjects]);

  const filteredSubjects = subjects.filter(
    (subject) => subject.year === selectedYear,
  );

  const allSubjects = [
    ...subjects.map((subject) => ({
      id: subject.id,
      code: subject.code,
      name: subject.name,
    })),
    ...customSubjects,
  ];

  const toggleSubject = (subjectId: string) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const addCustomSubject = () => {
    if (!customCode.trim() || !customName.trim()) {
      return;
    }

    const newSubject = {
      id: customCode.trim().toLowerCase(),
      code: customCode.trim().toUpperCase(),
      name: customName.trim(),
    };

    setCustomSubjects([...customSubjects, newSubject]);
    setSelectedSubjects([...selectedSubjects, newSubject.id]);

    setCustomCode("");
    setCustomName("");
  };

  const removeCustomSubject = (subjectId: string) => {
    setCustomSubjects(
      customSubjects.filter((subject) => subject.id !== subjectId),
    );

    setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
  };

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
                checked={selectedSubjects.includes(subject.id)}
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

          <button onClick={addCustomSubject}>Legg til fag</button>
        </div>
      </section>

      <section className="semester-card">
        <h2>Mine fag dette semesteret</h2>

        {selectedSubjects.length === 0 ? (
          <p>Ingen fag valgt enda.</p>
        ) : (
          <ul>
            {selectedSubjects.map((subjectId) => {
              const subject = allSubjects.find(
                (subject) => subject.id === subjectId,
              );

              return (
                <li key={subjectId} className="selected-subject-item">
                  <span>
                    {subject?.code} – {subject?.name}
                  </span>

                  {customSubjects.some(
                    (customSubject) => customSubject.id === subjectId,
                  ) && (
                    <button
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
