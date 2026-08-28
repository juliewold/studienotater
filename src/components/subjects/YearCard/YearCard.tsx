import "./YearCard.css";
import { Link } from "react-router-dom";

type YearCardProps = {
  year: number;
};

export const YearCard = ({ year }: YearCardProps) => {
  return (
    <Link to={`/klassetrinn/${year}`} className="year-card">
      <h3>{year}.</h3>
      <p>år</p>
    </Link>
  );
};