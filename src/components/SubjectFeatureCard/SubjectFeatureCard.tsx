import "./SubjectFeatureCard.css"
import { Link } from "react-router-dom";

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
  return (
    <Link to={link} className="subject-feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
};