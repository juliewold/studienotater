import "./SubjectCard.css"
import { Link } from "react-router-dom";

type SubjectCardProps = {
  code: string;
  name: string;
  year: number;
};

export const SubjectCard = ({ code, name, year }: SubjectCardProps) => {
  return (
    <Link to={`/fag/${code.toLowerCase()}`} className="subject-card">
      <p className="subject-code">{code}</p>
      <h3>{name}</h3>
      <p className="subject-year">{year}. år</p>
    </Link>
  );
};
