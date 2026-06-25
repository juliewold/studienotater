import type { ProgrammingLesson } from "../../../types/programming";
import { LessonCode } from "../LessonCode/LessonCode";
import { LessonOutput } from "../LessonOutput/LessonOutput";
import { LessonCallout } from "../LessonCallout/LessonCallout";

type LessonRendererProps = {
  lesson: ProgrammingLesson;
  language?: string;
};

export function LessonRenderer({
  lesson,
  language = "python",
}: LessonRendererProps) {
  return (
    <>
      {lesson.sections.map((section) => (
        <section key={section.title} className="lesson-section">
          <h2>{section.title}</h2>

          {section.content && <p>{section.content}</p>}

          {section.code && (
            <LessonCode
              language={language}
              code={section.code}
            />
          )}

          {section.output && (
            <LessonOutput
              output={section.output}
            />
          )}

          {section.tip && (
            <LessonCallout type="tip">
              {section.tip}
            </LessonCallout>
          )}

          {section.warning && (
            <LessonCallout type="warning">
              {section.warning}
            </LessonCallout>
          )}

          {section.note && (
            <LessonCallout type="note">
              {section.note}
            </LessonCallout>
          )}
        </section>
      ))}
    </>
  );
}