import { CodeBlock } from "../../../components/CodeBlock/CodeBlock";
import "./LessonCode.css";

type LessonCodeProps = {
  language: string;
  code: string;
};

export function LessonCode({
  language,
  code,
}: LessonCodeProps) {
  return (
    <div className="lesson-code">
      <CodeBlock
        language={language}
        code={code}
      />
    </div>
  );
}