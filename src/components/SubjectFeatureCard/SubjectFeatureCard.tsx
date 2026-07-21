import "./SubjectFeatureCard.css";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Brain,
  Video,
  FileText,
  GraduationCap,
  ClipboardList,
  ChevronRight,
} from "lucide-react";

type SubjectFeatureCardProps = {
  title: string;
  description: string;
  link: string;
};

export const SubjectFeatureCard = ({
  title,
  description,
  link,
}: SubjectFeatureCardProps) => {
  const getIcon = () => {
    switch (title) {
      case "Notater":
        return <BookOpen size={24} />;
      case "Flashcards":
        return <Brain size={24} />;
      case "Videoer":
        return <Video size={24} />;
      case "Tidligere eksamener":
        return <GraduationCap size={24} />;
      case "Forelesningsnotater":
        return <FileText size={24} />;
      case "Pensum":
        return <ClipboardList size={24} />;
      default:
        return <BookOpen size={24} />;
    }
  };

  return (
    <Link to={link} className="subject-feature-card">
      <div className="subject-feature-icon">
        {getIcon()}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <span className="subject-feature-link">
        Åpne
        <ChevronRight size={18} />
      </span>
    </Link>
  );
};