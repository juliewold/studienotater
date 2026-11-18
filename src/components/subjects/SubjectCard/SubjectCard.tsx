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
  to?: string;
};

const renderSubjectIcon = (icon: string | undefined) => {
  const size = 22;
  const strokeWidth = 2;

  switch (icon) {
    case "code":
      return <Code2 size={size} strokeWidth={strokeWidth} />;
    case "sigma":
      return <Sigma size={size} strokeWidth={strokeWidth} />;
    case "binary":
      return <Binary size={size} strokeWidth={strokeWidth} />;
    case "book-open":
      return <BookOpen size={size} strokeWidth={strokeWidth} />;
    case "braces":
      return <Braces size={size} strokeWidth={strokeWidth} />;
    case "mouse-pointer":
      return <MousePointer2 size={size} strokeWidth={strokeWidth} />;
    case "function-square":
      return <FunctionSquare size={size} strokeWidth={strokeWidth} />;
    case "circuit-board":
      return <CircuitBoard size={size} strokeWidth={strokeWidth} />;
    case "network":
      return <Network size={size} strokeWidth={strokeWidth} />;
    case "cpu":
      return <Cpu size={size} strokeWidth={strokeWidth} />;
    case "chart":
      return <ChartNoAxesColumnIncreasing size={size} strokeWidth={strokeWidth} />;
    case "blocks":
      return <Blocks size={size} strokeWidth={strokeWidth} />;
    case "database":
      return <Database size={size} strokeWidth={strokeWidth} />;
    case "terminal":
      return <Terminal size={size} strokeWidth={strokeWidth} />;
    case "wifi":
      return <Wifi size={size} strokeWidth={strokeWidth} />;
    default:
      return <BookOpen size={size} strokeWidth={strokeWidth} />;
  }
};

export const SubjectCard = ({
  id,
  code,
  name,
  year,
  color = "default",
  icon,
  to,
}: SubjectCardProps) => {
  return (
    <Link
      to={to ?? `/fag/${id}`}
      className={`subject-card subject-card-${color}`}
    >
      <div className="subject-card-icon">
        {renderSubjectIcon(icon)}
      </div>

      <p className="subject-code">{code}</p>

      <h3>{name}</h3>

      {year && <p className="subject-year">{year}. år</p>}
    </Link>
  );
};
