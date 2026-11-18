import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import "./ExamViewerPage.css";
import { useCallback, useContext, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { subjects } from "../../../data/subjects";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import {
  getExamsBySubject,
  removeExamMySolutionPdf,
  replaceExamMySolutionPdf,
  type DatabaseExam,
} from "../../../services/exams/examsService";
import {
  getExamTaskNoteLinks,
  type ExamTaskNoteLink,
} from "../../../services/exams/examTaskNotesService";
import { useExamPdfUrl } from "../../../hooks/useExamPdfUrl";
import { useExamTaskProgress } from "../../../hooks/useExamTaskProgress";
import { ExamTaskTracker } from "../../../components/exams/ExamTaskTracker/ExamTaskTracker";
import { ExamNotesPanel } from "../../../components/exams/ExamNotesPanel/ExamNotesPanel";
import { summarizeExamProgress } from "../../../components/exams/examProgress";
import {
  collectLinkedNoteIdsExcept,
  findLinkedNoteId,
} from "../../../components/exams/examTaskLinks";
import {
  buildExamPath,
  EXAM_VIEW_LABELS,
  EXAM_VIEWS,
  parseExamView,
  resolveSelectedTask,
} from "../examViewPaths";


// Én PDF-visning i den eksisterende PDF-viseren. Egen komponent, så tilgangslenken bare hentes
// for PDF-en som vises.
const PdfPanel = ({
  filePath,
  title,
  emptyText,
}: {
  filePath: string | null;
  title: string;
  emptyText: string;
}) => {
  const fileAccess = useExamPdfUrl(filePath);
  const fileUrl = fileAccess.url;

  if (!filePath) {
    return <p className="exam-pane-message">{emptyText}</p>;
  }

  if (!fileUrl) {
    return (
      <p className="exam-pane-message" role="status">
        {fileAccess.loading ? "Laster filtilgang…" : fileAccess.error}
      </p>
    );
  }

  return (
    <div className="exam-pdf-panel">
      <div className="exam-pdf-toolbar">
        <a className="exam-open-pdf-link" href={fileUrl} target="_blank" rel="noreferrer">
          Åpne PDF i ny fane
        </a>
      </div>

      <iframe className="exam-viewer" src={`${fileUrl}#view=FitH`} title={title} />

      <a className="exam-mobile-pdf-link" href={fileUrl} target="_blank" rel="noreferrer">
        Åpne PDF i fullskjerm
      </a>
    </div>
  );
};

// iPad-løsningene: viser PDF-en og lar administrator laste opp eller erstatte den.
const IpadPanel = ({
  exam,
  isAdmin,
  onUploaded,
  onRemoved,
}: {
  exam: DatabaseExam;
  isAdmin: boolean;
  onUploaded: (filePath: string) => void;
  onRemoved: () => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [notice, setNotice] = useState("");

  const hasFile = Boolean(exam.mySolutionFilePath);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Velg en PDF-fil.");
      return;
    }

    if (hasFile) {
      const shouldReplace = window.confirm(
        "Erstatte PDF-en med iPad-løsningen? Den gamle filen beholdes i lagring.",
      );

      if (!shouldReplace) return;
    }

    setIsUploading(true);
    setUploadError("");
    setNotice("");

    try {
      const filePath = await replaceExamMySolutionPdf(exam, file);
      onUploaded(filePath);
    } catch (error) {
      console.error("Kunne ikke laste opp iPad-løsning:", error);
      setUploadError("Kunne ikke laste opp PDF-en. Prøv igjen.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!exam.mySolutionFilePath) return;

    const shouldDelete = window.confirm(
      "Slette iPad-løsningen fra denne eksamenen? Oppgavesettet, løsningsforslaget, de skrevne løsningene og fremdriften påvirkes ikke.",
    );

    if (!shouldDelete) return;

    setIsDeleting(true);
    setUploadError("");
    setNotice("");

    try {
      const result = await removeExamMySolutionPdf({
        id: exam.id,
        mySolutionFilePath: exam.mySolutionFilePath,
      });

      onRemoved();

      if (result.warning) {
        setNotice(result.warning);
      }
    } catch (error) {
      console.error("Kunne ikke slette iPad-løsning:", error);
      setUploadError(
        error instanceof Error ? error.message : "Kunne ikke slette PDF-en. Prøv igjen.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="exam-ipad-panel">
      {isAdmin && (
        <div className="exam-ipad-upload">
          <label className="exam-notes-primary exam-upload-button">
            {isUploading ? "Laster opp…" : hasFile ? "Erstatt PDF" : "Last opp iPad-løsning (PDF)"}
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="exam-upload-input"
            />
          </label>
          {hasFile && (
            <button
              type="button"
              className="exam-notes-action"
              onClick={handleDelete}
              disabled={isUploading || isDeleting}
            >
              {isDeleting ? "Sletter…" : "Slett PDF"}
            </button>
          )}
          {uploadError && (
            <p className="exam-pane-message exam-pane-error" role="alert">
              {uploadError}
            </p>
          )}
          {notice && (
            <p className="exam-pane-message" role="status">
              {notice}
            </p>
          )}
        </div>
      )}

      <PdfPanel
        filePath={exam.mySolutionFilePath}
        title={`${exam.title} – Mine iPad-løsninger`}
        emptyText="Det er ikke lagt inn en iPad-løsning for denne eksamenen ennå."
      />
    </div>
  );
};

export const ExamViewerPage = () => {
  const { subjectId, source, examId, view: rawView, task: rawTask } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  const subject = subjects.find((currentSubject) => currentSubject.id === subjectId);

  const [exam, setExam] = useState<DatabaseExam | null>(null);
  const [isLoadingExam, setIsLoadingExam] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [links, setLinks] = useState<ExamTaskNoteLink[]>([]);
  const [linksError, setLinksError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadExam = async () => {
      if (!subjectId || !examId) {
        setExam(null);
        setIsLoadingExam(false);
        return;
      }

      setIsLoadingExam(true);
      setErrorMessage("");

      try {
        const loadedExams = await getExamsBySubject(subjectId);

        if (cancelled) return;

        const selectedExam = loadedExams.find((currentExam) => currentExam.id === examId);

        if (!selectedExam) {
          setExam(null);
          setErrorMessage("Fant ikke eksamenen.");
          return;
        }

        setExam(selectedExam);
      } catch (error) {
        if (cancelled) return;
        console.error("Kunne ikke hente eksamen:", error);
        setErrorMessage("Kunne ikke hente eksamenen.");
      } finally {
        if (!cancelled) setIsLoadingExam(false);
      }
    };

    loadExam();

    return () => {
      cancelled = true;
    };
  }, [examId, subjectId]);

  // Brukes når notatpanelet endrer en kobling. Ved første innlasting brukes effekten under.
  const loadLinks = useCallback(async () => {
    try {
      setLinks(await getExamTaskNoteLinks());
      setLinksError("");
    } catch (error) {
      console.error("Kunne ikke hente koblinger til skrevne løsninger:", error);
      setLinksError("Kunne ikke hente koblingene til skrevne løsninger.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getExamTaskNoteLinks()
      .then((loadedLinks) => {
        if (cancelled) return;
        setLinks(loadedLinks);
        setLinksError("");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("Kunne ikke hente koblinger til skrevne løsninger:", error);
        setLinksError("Kunne ikke hente koblingene til skrevne løsninger.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const tasks = useMemo(() => exam?.relevantTasks ?? [], [exam]);
  const progress = useExamTaskProgress(exam?.id ?? "");

  const selectedTask = resolveSelectedTask(rawTask, tasks);
  const view = parseExamView(rawView);

  const linkedNoteId = useMemo(
    () => (exam ? findLinkedNoteId(links, exam.id, selectedTask) : null),
    [exam, links, selectedTask],
  );

  // Notater koblet til andre oppgaver vises i valglisten, men kan ikke velges på nytt.
  const noteIdsLinkedElsewhere = useMemo(
    () => (exam ? collectLinkedNoteIdsExcept(links, exam.id, selectedTask) : new Set<string>()),
    [exam, links, selectedTask],
  );

  if (isLoadingExam) {
    return (
      <main className="page-container">
        <LoadingPlaceholder label="Laster eksamen..." />
      </main>
    );
  }

  if (errorMessage || !exam || !subjectId || !source) {
    return (
      <main className="page-container">
        <Link to={`/fag/${subjectId}/eksamen`} className="back-link">
          ← Tilbake til eksamener
        </Link>

        <h1>Fant ikke eksamenen</h1>

        {errorMessage && <p>{errorMessage}</p>}
      </main>
    );
  }

  const buildPath = (nextView: (typeof EXAM_VIEWS)[number], task: string | null) =>
    buildExamPath({ subjectId, source, examId: exam.id }, nextView, task);

  // Gamle lenker til «Min besvarelse» er samme PDF som iPad-fanen.
  if (rawView === "my-solution") {
    return <Navigate to={buildPath("ipad", selectedTask)} replace />;
  }

  const selectTask = (task: string) => {
    // Å velge en deloppgave åpner den skrevne løsningen. Valget beholdes når man bytter fane.
    navigate(buildPath("notes", task));
  };

  const { completed: completedCount, percent: progressPercent } = summarizeExamProgress(
    tasks,
    progress.completedTasks,
  );

  const subjectCode = subject?.code ?? subjectId.toUpperCase();

  return (
    <main className="page-container exam-viewer-page">
      <Link to={`/fag/${subjectId}/eksamen`} className="back-link exam-back-link">
        ← Tilbake til eksamener
      </Link>

      <header className="exam-page-header">
        <div className="exam-page-heading">
          <p className="page-label">{subjectCode} · Eksamen</p>
          <h1>{exam.title}</h1>
          <p className="exam-meta">
            {exam.semester} {exam.year}
          </p>
        </div>

        <div className="exam-page-progress" aria-label="Fremgang for denne eksamenen">
          <span className="exam-page-progress-label">
            Fremgang: {completedCount} / {tasks.length} oppgaver ({progressPercent} %)
          </span>
          <div className="exam-page-progress-bar">
            <div className="exam-page-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </header>

      {progress.errorMessage && (
        <p className="exam-pane-message exam-pane-error" role="alert">
          {progress.errorMessage}
        </p>
      )}

      <nav className="exam-tabs" aria-label="Velg visning">
        {EXAM_VIEWS.map((tab) => (
          <Link
            key={tab}
            to={buildPath(tab, selectedTask)}
            className={`exam-tab${view === tab ? " is-active" : ""}`}
            aria-current={view === tab ? "page" : undefined}
          >
            {EXAM_VIEW_LABELS[tab]}
          </Link>
        ))}
      </nav>

      <div className={`exam-workspace${view === "notes" ? " is-notes" : " is-pdf"}`}>
        <aside className="exam-workspace-sidebar">
          <ExamTaskTracker
            tasks={tasks}
            completedTasks={progress.completedTasks}
            selectedTask={selectedTask}
            onSelectTask={selectTask}
            onToggleTask={(task) => void progress.toggleTask(task)}
          />
        </aside>

        <div className="exam-workspace-main">
          {view === "exam" && (
            <PdfPanel
              filePath={exam.examFilePath}
              title={`${exam.title} – Oppgavesett`}
              emptyText="Det er ikke lagt inn et oppgavesett for denne eksamenen."
            />
          )}

          {view === "solution" && (
            <PdfPanel
              filePath={exam.solutionFilePath}
              title={`${exam.title} – NTNU løsningsforslag`}
              emptyText="Det er ikke lagt inn et løsningsforslag for denne eksamenen."
            />
          )}

          {view === "ipad" && (
            <IpadPanel
              key={exam.id}
              exam={exam}
              isAdmin={isAdmin}
              onUploaded={(filePath) => setExam({ ...exam, mySolutionFilePath: filePath })}
              onRemoved={() => setExam({ ...exam, mySolutionFilePath: null })}
            />
          )}

          {view === "notes" && (
            <ExamNotesPanel
              subjectId={subjectId}
              subjectCode={subjectCode}
              exam={exam}
              taskLabel={selectedTask}
              linkedNoteId={linkedNoteId}
              noteIdsLinkedElsewhere={noteIdsLinkedElsewhere}
              linksError={linksError}
              isAdmin={isAdmin}
              onLinksChanged={loadLinks}
            />
          )}
        </div>
      </div>
    </main>
  );
};
