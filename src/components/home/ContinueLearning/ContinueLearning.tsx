import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ContinueLearning.css";
import { subjects } from "../../../data/subjects";
import { getAllPdfs } from "../../../services/media/pdfsService";
import { getAllExams } from "../../../services/exams/examsService";

type RecentItem = {
  id: string;
  subjectId: string;
  title: string;
  type: "pdf" | "my-solution";
  createdAt: string;
  link: string;
};

export const ContinueLearning = () => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    const loadRecentItems = async () => {
      try {
        const [pdfs, exams] = await Promise.all([getAllPdfs(), getAllExams()]);

        const pdfItems: RecentItem[] = pdfs.map((pdf) => ({
          id: `pdf-${pdf.id}`,
          subjectId: pdf.subjectId,
          title: pdf.title,
          type: "pdf",
          createdAt: pdf.createdAt,
          link: `/fag/${pdf.subjectId}/pdfs/${pdf.id}`,
        }));

        const mySolutionItems: RecentItem[] = exams
          .filter((exam) => exam.mySolutionFilePath !== null)
          .map((exam) => ({
            id: `my-solution-${exam.id}`,
            subjectId: exam.subjectId,
            title: exam.title,
            type: "my-solution",
            createdAt: exam.createdAt,
            link: `/fag/${exam.subjectId}/eksamen/database/${exam.id}/my-solution`,
          }));

        const combinedItems = [...pdfItems, ...mySolutionItems]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 4);

        setRecentItems(combinedItems);
      } catch (error) {
        console.error("Kunne ikke hente nylig innhold:", error);

        setRecentItems([]);
      }
    };

    loadRecentItems();
  }, []);

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <section className="continue-learning">
      <h2>Nylig lagt til</h2>

      <div className="recent-grid">
        {recentItems.map((item) => {
          const subject = subjects.find(
            (subject) => subject.id === item.subjectId,
          );

          return (
            <Link key={item.id} to={item.link} className="recent-card">
              <p className="recent-type">
                {item.type === "my-solution" ? "📝 Min besvarelse" : "📄 PDF"}
              </p>

              <h3>
                {subject?.code} – {item.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
