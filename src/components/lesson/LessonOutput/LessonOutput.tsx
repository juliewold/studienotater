import "./LessonOutput.css";

type LessonOutputProps = {
  output: string;
};

export function LessonOutput({ output }: LessonOutputProps) {
  return (
    <div className="lesson-output">
      <div className="lesson-output-header">
        Output
      </div>

      <pre>{output}</pre>
    </div>
  );
}