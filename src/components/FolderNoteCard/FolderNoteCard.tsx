import "./FolderNoteCard.css";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

import type { DatabaseNote } from "../../services/notesService";
import type { NoteChange } from "../NoteCard/NoteCard";
import { NoteMenu } from "../NoteMenu/NoteMenu";

type FolderNoteCardProps = {
  note: DatabaseNote;
  subjectId: string;
  onNoteChanged?: (change: NoteChange) => void;
};

export const FolderNoteCard = ({
  note,
  subjectId,
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
