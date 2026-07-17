import "./FolderCard.css";
import { Link } from "react-router-dom";
import type { NoteFolder } from "../../services/noteFoldersService";

type FolderCardProps = {
  folder: NoteFolder;
  subjectId: string;
};

export const FolderCard = ({
  folder,
  subjectId,
}: FolderCardProps) => {
  return (
    <Link
      to={`/fag/${subjectId}/notater/mappe/${folder.id}`}
      className="folder-card"
    >
      <span
        className="folder-card-icon"
        aria-hidden="true"
      >
        📁
      </span>

      <span className="folder-card-name">
        {folder.name}
      </span>
    </Link>
  );
};