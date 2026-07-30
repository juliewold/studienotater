import "./FolderNoteCard.css";
import { Check, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import type { DatabaseNote } from "../../services/notesService";
import type { Progress } from "../../services/progressService";
import type { NoteChange } from "../NoteCard/NoteCard";
import { NoteMenu } from "../NoteMenu/NoteMenu";

type FolderNoteCardProps = {
  note: DatabaseNote;
  subjectId: string;
  progress: Progress;
  onNoteChanged?: (change: NoteChange) => void;
};

export const FolderNoteCard = ({
  note,
  subjectId,
  progress,
  onNoteChanged,
}: FolderNoteCardProps) => {
  const noteUrl = `/fag/${subjectId}/notater/${note.slug}`;

  return (
    <article className="folder-note-item">
      <Link to={noteUrl} className="folder-note-link">
        <span className="folder-note-icon" aria-hidden="true">
          <FileText size={20} />
        </span>

        <span className="folder-note-content">
          <span className="folder-note-title">{note.title}</span>

          {note.description && (
            <span className="folder-note-description">{note.description}</span>
          )}

          <span className="folder-note-progress">
            <span
              className={
                progress.completed
                  ? "folder-note-read folder-note-read-completed"
                  : "folder-note-read"
              }
            >
              {progress.completed && <Check size={14} />}

              {progress.completed ? "Lest" : "Ikke lest"}
            </span>

            <span
              className="folder-note-rating"
              aria-label={`${progress.rating} av 5 stjerner`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={
                    index < progress.rating
                      ? "folder-note-star folder-note-star-filled"
                      : "folder-note-star"
                  }
                >
                  ★
                </span>
              ))}
            </span>
          </span>
        </span>
      </Link>

      <div className="folder-note-menu">
        <NoteMenu
          noteId={note.id}
          noteTitle={note.title}
          subjectId={subjectId}
          currentFolderId={note.folderId}
          onNoteChanged={(change) => {
            onNoteChanged?.(change);
          }}
        />
      </div>
    </article>
  );
};
