import "./SubjectCard.css";
import { Link } from "react-router-dom";
import {
  Binary,
  Blocks,
  BookOpen,
  Braces,
  ChartNoAxesColumnIncreasing,
  CircuitBoard,
  Code2,
  Cpu,
  Database,
  FunctionSquare,
  MousePointer2,
  Network,
  Sigma,
  Terminal,
  Wifi,
} from "lucide-react";

type SubjectCardProps = {
  id: string;
  code: string;
  name: string;
  year?: number;
  color?: string;
  icon?: string;
};

const getSubjectIcon = (icon: string | undefined) => {
  switch (icon) {
    case "code":
      return Code2;
    case "sigma":
      return Sigma;
    case "binary":
      return Binary;
    case "book-open":
      return BookOpen;
    case "braces":
      return Braces;
    case "mouse-pointer":
      return MousePointer2;
    case "function-square":
      return FunctionSquare;
    case "circuit-board":
      return CircuitBoard;
    case "network":
      return Network;
    case "cpu":
      return Cpu;
    case "chart":
      return ChartNoAxesColumnIncreasing;
    case "blocks":
      return Blocks;
    case "database":
      return Database;
    case "terminal":
      return Terminal;
    case "wifi":
      return Wifi;
    default:
      return BookOpen;
  }
};

export const SubjectCard = ({
  id,
  code,
  name,
  year,
  color = "default",
  icon,
}: SubjectCardProps) => {
  const Icon = getSubjectIcon(icon);

  return (
    <Link to={`/fag/${id}`} className={`subject-card subject-card-${color}`}>
      <div className="subject-card-icon">
        <Icon size={22} strokeWidth={2} />
      </div>

      <p className="subject-code">{code}</p>

      <h3>{name}</h3>

      {year && <p className="subject-year">{year}. år</p>}
    </Link>
  );
};
