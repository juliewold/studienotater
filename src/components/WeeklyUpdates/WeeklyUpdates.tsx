import "./WeeklyUpdates.css";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Binary,
  Blocks,
  BookOpen,
  Braces,
  ChartNoAxesColumnIncreasing,
  CircuitBoard,
  Code2,
  Cpu,
  Database,
  FunctionSquare,
  MousePointer2,
  Network,
  Sigma,
  Terminal,
  Wifi,
} from "lucide-react";

import { subjects } from "../../data/subjects";
import { useSemesterSubjects } from "../../hooks/useSemesterSubjects";

import {
  getNotesBySubject,
  type DatabaseNote,
} from "../../services/notesService";

import { getPdfsBySubject, type DatabasePdf } from "../../services/pdfsService";

import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../services/flashcardsService";

type WeeklySubjectData = {
  id: string;
  code: string;
  name: string;
  color: string;
  icon: string | undefined;
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

const getSubjectIcon = (icon: string | undefined) => {
  switch (icon) {
    case "code":
      return Code2;

    case "sigma":
      return Sigma;

    case "binary":
      return Binary;

    case "book-open":
      return BookOpen;

    case "braces":
      return Braces;

    case "mouse-pointer":
      return MousePointer2;

    case "function-square":
      return FunctionSquare;

    case "circuit-board":
      return CircuitBoard;

    case "network":
      return Network;

    case "cpu":
      return Cpu;

    case "chart":
      return ChartNoAxesColumnIncreasing;

    case "blocks":
      return Blocks;

    case "database":
      return Database;

    case "terminal":
      return Terminal;

    case "wifi":
      return Wifi;

    default:
      return BookOpen;
  }
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
        icon: regularSubject?.icon,
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
        <div>
          <h2>Denne uken</h2>

          <p>Nytt innhold i semesterfagene dine</p>
        </div>

        <span className="weekly-updates-week">Uke {getWeekNumber()}</span>
      </div>

      {displaySubjects.length === 0 ? (
        <p>Velg semesterfag for å se hva som er nytt denne uken.</p>
      ) : weeklySubjects.length === 0 ? (
        <p>Det er ikke lagt til noe nytt i fagene dine denne uken.</p>
      ) : (
        <div className="weekly-updates-grid">
          {weeklySubjects.map((subject) => {
            const total =
              subject.notes.length +
              subject.pdfs.length +
              subject.flashcards.length;

            const Icon = getSubjectIcon(subject.icon);

            return (
              <Link
                key={subject.id}
                to={`/fag/${subject.id}`}
                className={`weekly-update-card weekly-update-${subject.color}`}
              >
                <div className="weekly-update-icon">
                  <Icon size={22} strokeWidth={2} />
                </div>

                <p className="weekly-update-code">{subject.code}</p>
                <h3>{subject.name}</h3>

                <div className="weekly-update-meta">
                  <p className="weekly-update-total">
                    {total} {total === 1 ? "ny ressurs" : "nye ressurser"}
                  </p>

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
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};
