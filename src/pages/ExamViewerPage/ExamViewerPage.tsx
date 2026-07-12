import "./ExamViewerPage.css";
import { Link, useParams } from "react-router-dom";
import { exams } from "../../data/exams";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

export const ExamViewerPage = () => {
  const { subjectId, examId, fileId } = useParams();

  const subjectExams = exams[subjectId as keyof typeof exams] || [];

  const exam = subjectExams.find((exam) => exam.id === examId);
  const examFile = exam?.files.find((file) => file.id === fileId);

  if (!exam || !examFile) {
    return (
      <main className="page-container">
        <h1>Fant ikke eksamensfilen</h1>
      </main>
    );
  }

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}/eksamen`} className="back-link">
        ← Tilbake til eksamener
      </Link>

      <p className="page-label">{exam.title}</p>
      <h1>{examFile.title}</h1>

      <ResourceProgress
        resourceId={`exam-${subjectId}-${exam.id}-${examFile.id}`}
      />

      <iframe
        className="exam-viewer"
        src={`${import.meta.env.BASE_URL}${examFile.file}`}
        title={`${exam.title} – ${examFile.title}`}
      />
    </main>
  );
};