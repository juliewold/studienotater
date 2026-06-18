import { useState } from "react";
import { Link } from "react-router-dom";
import { videos } from "../data/videos";
import { subjects } from "../data/subjects";

export const AllVideosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const videoSubjects = Object.entries(videos)
    .map(([subjectId, subjectVideos]) => {
      const subject = subjects.find((subject) => subject.id === subjectId);

      return {
        id: subjectId,
        code: subject?.code ?? subjectId.toUpperCase(),
        name: subject?.name ?? "",
        count: subjectVideos.length,
      };
    })
    .filter((subject) =>
      `${subject.code} ${subject.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <main className="page-container">
      <p className="page-label">Videoer</p>
      <h1>Videoer</h1>
      <p>Velg et fag for å se videoer og forelesninger.</p>

      <div className="all-videos-grid">
        {videoSubjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/fag/${subject.id}/videoer`}
            className="video-subject-card"
          >
            <p className="subject-code">{subject.code}</p>
            <h3>{subject.name}</h3>
            <p>{subject.count} videoer</p>
          </Link>
        ))}
      </div>
    </main>
  );
};