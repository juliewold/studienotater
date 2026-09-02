import "./WeeklyUpdates.css";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { subjects } from "../../../data/subjects";
import { useSemesterSubjects } from "../../../hooks/useSemesterSubjects";

import {
  getNotesBySubject,
  type DatabaseNote,
} from "../../../services/notes/notesService";

import {
  getPdfsBySubject,
  type DatabasePdf,
} from "../../../services/media/pdfsService";

import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../../services/study/flashcardsService";

type WeeklySubjectData = {
  id: string;
  code: string;
  name: string;
  color: string;
  notes: DatabaseNote[];
  pdfs: DatabasePdf[];
  flashcards: DatabaseFlashcard[];
};

const getStartOfWeek = () => {
  const now = new Date();

  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);

  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  return monday;
};

const isFromThisWeek = (createdAt: string) => {
  const createdDate = new Date(createdAt);
  const startOfWeek = getStartOfWeek();

  return createdDate >= startOfWeek;
};

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

export const WeeklyUpdates = () => {
  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();

  const [weeklySubjects, setWeeklySubjects] = useState<WeeklySubjectData[]>([]);
  const [isLoadingWeeklyUpdates, setIsLoadingWeeklyUpdates] = useState(true);

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

  useEffect(() => {
    if (isLoadingSemesterSubjects) {
      return;
    }

    const loadWeeklyUpdates = async () => {
      setIsLoadingWeeklyUpdates(true);

      try {
        const loadedSubjects = await Promise.all(
          displaySubjects.map(async (subject) => {
            const [notes, pdfs, flashcards] = await Promise.all([
              getNotesBySubject(subject.id),
              getPdfsBySubject(subject.id),
              getFlashcardsBySubject(subject.id),
            ]);

            return {
              ...subject,
              notes: notes.filter((note) => isFromThisWeek(note.createdAt)),
              pdfs: pdfs.filter((pdf) => isFromThisWeek(pdf.createdAt)),
              flashcards: flashcards.filter((flashcard) =>
                isFromThisWeek(flashcard.createdAt),
              ),
            };
          }),
        );

        setWeeklySubjects(
          loadedSubjects.filter(
            (subject) =>
              subject.notes.length > 0 ||
              subject.pdfs.length > 0 ||
              subject.flashcards.length > 0,
          ),
        );
      } catch (error) {
        console.error("Kunne ikke hente ukens innhold:", error);
        setWeeklySubjects([]);
      } finally {
        setIsLoadingWeeklyUpdates(false);
      }
    };

    loadWeeklyUpdates();
  }, [displaySubjects, isLoadingSemesterSubjects]);

  if (isLoadingSemesterSubjects || isLoadingWeeklyUpdates) {
    return (
      <section className="weekly-updates">
        <p>Laster ukens innhold...</p>
      </section>
    );
  }

  return (
    <section className="weekly-updates">
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
                {subject.notes.length > 0 && (
                  <span>
                    {subject.notes.length}{" "}
                    {subject.notes.length === 1 ? "notat" : "notater"}
                  </span>
                )}

                {subject.pdfs.length > 0 && (
                  <span>
                    {subject.pdfs.length}{" "}
                    {subject.pdfs.length === 1
                      ? "forelesning"
                      : "forelesninger"}
                  </span>
                )}

                {subject.flashcards.length > 0 && (
                  <span>
                    {subject.flashcards.length}{" "}
                    {subject.flashcards.length === 1
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
