type SubjectCardProps = {
  code: string;
  name: string;
  year: number;
};

export const SubjectCard = ({ code, name, year }: SubjectCardProps) => {
  return (
    <a href={`/fag/${code.toLowerCase()}`} className="subject-card">
      <p className="subject-code">{code}</p>
      <h3>{name}</h3>
      <p className="subject-year">{year}. år</p>
    </a>
  );
};
