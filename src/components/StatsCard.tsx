type StatsCardProps = {
  title: string;
  value: string;
};

export const StatsCard = ({ title, value }: StatsCardProps) => {
  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};