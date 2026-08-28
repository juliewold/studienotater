import "./SemesterSubjects.css";
import { Link } from "react-router-dom";
import { subjects } from "../../data/subjects";
import { useSemesterSubjects } from "../../hooks/useSemesterSubjects";
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

export const SemesterSubjects = () => {
  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();

  const displaySubjects = semesterSubjects.map((semesterSubject) => {
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

  if (isLoadingSemesterSubjects) {
    return (
      <section className="semester-subjects">
        <p>Laster semesterfag...</p>
      </section>
    );
  }

  return (
    <section className="semester-subjects">
      <div className="semester-subjects-header">
        <h2>Mine fag dette semesteret</h2>

        <Link to="/semesterstart">Administrer fag</Link>
      </div>

      {displaySubjects.length === 0 ? (
        <p>
          Du har ikke valgt fag enda. Gå til Semesterstart for å sette opp
          semesteret ditt.
        </p>
      ) : (
        <div className="semester-subjects-grid">
          {displaySubjects.map((subject) => {
            const Icon = getSubjectIcon(subject.icon);

            return (
              <Link
                key={subject.id}
                to={`/fag/${subject.id}`}
                className={`semester-subject-card semester-subject-${subject.color}`}
              >
                <div className="semester-subject-icon">
                  <Icon size={22} strokeWidth={2} />
                </div>

                <p className="subject-code">{subject.code}</p>
                <h3>{subject.name}</h3>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};
