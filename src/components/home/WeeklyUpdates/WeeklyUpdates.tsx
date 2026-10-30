import "./WeeklyUpdates.css";

import { useMemo } from "react";
import { Link } from "react-router-dom";

import { subjects } from "../../../data/subjects";
import { useSemesterSubjects } from "../../../hooks/useSemesterSubjects";

import { getWeeklyResourceCounts, type HomeResourcesSnapshot } from "../../../services/home/homeResourcesService";

const getWeekNumber = () => {
  const date = new Date();

  const target = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );

  const dayNumber = target.getUTCDay() || 7;

  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);

  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));

  return Math.ceil(
    ((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
};

export const WeeklyUpdates = ({ resources }: { resources: HomeResourcesSnapshot }) => {
  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();

  const displaySubjects = useMemo(() => {
    return semesterSubjects.map((semesterSubject) => {
      const regularSubject = subjects.find(
        (subject) => subject.id === semesterSubject.subjectId,
      );

      return {
        id: semesterSubject.subjectId,
        code:
          semesterSubject.customCode ??
          regularSubject?.code ??
          semesterSubject.subjectId.toUpperCase(),
        name: semesterSubject.customName ?? regularSubject?.name ?? "",
        color: regularSubject?.color ?? "default",
      };
    });
  }, [semesterSubjects]);

  const weeklySubjects = useMemo(() => resources.weeklyError ? [] : displaySubjects
    .map(subject => ({ ...subject, ...getWeeklyResourceCounts(resources, subject.id) }))
    .filter(subject => subject.notes > 0 || subject.pdfs > 0 || subject.flashcards > 0),
  [displaySubjects, resources]);

  if (isLoadingSemesterSubjects || resources.loading) {
    return (
      <section className="weekly-updates site-container">
        <p>Laster ukens innhold...</p>
      </section>
    );
  }

  return (
    <section className="weekly-updates site-container">
      <div className="weekly-updates-header">
        <h2>Denne uken</h2>

        <span className="weekly-updates-week">Uke {getWeekNumber()}</span>
      </div>

      {displaySubjects.length === 0 ? (
        <p className="weekly-updates-empty">
          Velg semesterfag for å se hva som er nytt denne uken.
        </p>
      ) : weeklySubjects.length === 0 ? (
        <p className="weekly-updates-empty">
          Det er ikke lagt til noe nytt i fagene dine denne uken.
        </p>
      ) : (
        <div className="weekly-updates-list">
          {weeklySubjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/fag/${subject.id}`}
              className={`weekly-update-row weekly-update-${subject.color}`}
            >
              <span className="weekly-update-indicator" />

              <div className="weekly-update-subject">
                <span className="weekly-update-code">{subject.code}</span>

                <span className="weekly-update-name">{subject.name}</span>
              </div>

              <div className="weekly-update-details">
                {subject.notes > 0 && (
                  <span>
                    {subject.notes}{" "}
                    {subject.notes === 1 ? "notat" : "notater"}
                  </span>
                )}

                {subject.pdfs > 0 && (
                  <span>
                    {subject.pdfs}{" "}
                    {subject.pdfs === 1
                      ? "forelesning"
                      : "forelesninger"}
                  </span>
                )}

                {subject.flashcards > 0 && (
                  <span>
                    {subject.flashcards}{" "}
                    {subject.flashcards === 1
                      ? "flashcard"
                      : "flashcards"}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
