import "./YearCard.css"

type YearCardProps = {
  year: number;
};

export const YearCard = ({ year }: YearCardProps) => {
  return (
    <div className="year-card">
      <h3>{year}.</h3>
      <p>år</p>
    </div>
  );
};