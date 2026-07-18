import "./NoteCard.css";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { DatabaseNote } from "../../services/notesService";
import { NoteMenu } from "../NoteMenu/NoteMenu";

type NoteCardProps = {
  note: DatabaseNote;
  subjectId: string;
  descriptionFallback?: string;
  progress?: {
    completed: boolean;
    rating: number;
  };
  actions?: ReactNode;
};

export const NoteCard = ({
  note,
  subjectId,
  descriptionFallback = "",
  progress,
  actions,
}: NoteCardProps) => {
  const noteUrl = `/fag/${subjectId}/notater/${note.slug}`;

  return (
    <article className="note-card-wrapper">
      <Link to={noteUrl} className="note-card">
        <h3>{note.title}</h3>

        <p>{note.description || descriptionFallback}</p>

        {progress && (
          <div className="note-progress-preview">
            <span>{progress.completed ? "✓ Lest" : "Ikke lest"}</span>

            <span className={`rating-${progress.rating}`}>
              {"★".repeat(progress.rating)}
            </span>
          </div>
        )}
      </Link>

      <div className="note-card-actions">
        {actions}

        <NoteMenu
          noteId={note.id}
          noteTitle={note.title}
          subjectId={subjectId}
          currentFolderId={note.folderId}
        />
      </div>
    </article>
  );
};
