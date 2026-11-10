import { Link } from "react-router-dom";
import type { NoteFolder } from "../../../services/notes/noteFoldersService";
import "./FolderBreadcrumbs.css";

type FolderBreadcrumbsProps = {
  subjectId: string;
  ancestors: NoteFolder[];
  current: NoteFolder;
};

export const FolderBreadcrumbs = ({ subjectId, ancestors, current }: FolderBreadcrumbsProps) => (
  <nav className="folder-breadcrumbs" aria-label="Brødsmulesti">
    <ol>
      <li>
        <Link to={`/fag/${subjectId}/notater`}>Notater</Link>
      </li>

      {ancestors.map((ancestor) => (
        <li key={ancestor.id}>
          <Link to={`/fag/${subjectId}/notater/mappe/${ancestor.id}`}>{ancestor.name}</Link>
        </li>
      ))}

      <li aria-current="page">{current.name}</li>
    </ol>
  </nav>
);
