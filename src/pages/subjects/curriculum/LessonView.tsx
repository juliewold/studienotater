import { Link } from "react-router-dom";
import { AlertTriangle, BookOpen, ExternalLink, Lightbulb, ScrollText } from "lucide-react";
import type { Lesson, LessonBlock } from "../../../data/curriculum/lessons/types";
import { Latex, RichText } from "./curriculumShared";

const boxes = {
  definition: { label: "Definisjon", icon: BookOpen },
  theorem: { label: "Teorem", icon: ScrollText },
  tip: { label: "Tips", icon: Lightbulb },
  pitfall: { label: "Felle", icon: AlertTriangle },
};

export function LessonIntro({ lesson }: { lesson: Lesson }) {
  return <div className="lesson-intro">
    <p className="lesson-summary"><RichText>{lesson.summary}</RichText></p>
    <div className="lesson-goals">
      <h2>Dette skal du kunne</h2>
      <ul>{lesson.goals.map(goal => <li key={goal}><RichText>{goal}</RichText></li>)}</ul>
    </div>
  </div>;
}

export function LessonSections({ lesson }: { lesson: Lesson }) {
  return <>{lesson.sections.map(section => <section key={section.id} className="curriculum-section lesson-section" id={`tema-${section.id}`} aria-labelledby={`tema-${section.id}-title`}>
    <h2 id={`tema-${section.id}-title`}>{section.title}</h2>
    <Blocks blocks={section.blocks} />
  </section>)}</>;
}

export function LessonSources({ lesson }: { lesson: Lesson }) {
  const reviewed = new Date(`${lesson.reviewed}T12:00:00`).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
  return <p className="lesson-sources">
    <span>Kvalitetssikret {reviewed} mot</span>{" "}
    {lesson.sources.map((source, index) => <span key={source.url}>
      {source.kind === "note"
        ? <Link to={`/fag/${lesson.subjectId}/notater/${source.url}`}>{source.label}</Link>
        : <a href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={12} aria-hidden="true" /></a>}
      {index < lesson.sources.length - 1 ? ", " : "."}
    </span>)}
  </p>;
}

function Blocks({ blocks }: { blocks: LessonBlock[] }) {
  return <>{blocks.map((block, index) => <Block key={index} block={block} />)}</>;
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "text":
      return <p className="lesson-text"><RichText>{block.text}</RichText></p>;
    case "list": {
      const items = block.items.map(item => <li key={item}><RichText>{item}</RichText></li>);
      return block.ordered ? <ol className="lesson-list">{items}</ol> : <ul className="lesson-list">{items}</ul>;
    }
    case "box": {
      const { label, icon: Icon } = boxes[block.variant];
      return <aside className={`lesson-box is-${block.variant}`}>
        <p className="lesson-box-label"><Icon size={15} aria-hidden="true" />{label}{block.title && <span><RichText>{block.title}</RichText></span>}</p>
        <Blocks blocks={block.blocks} />
      </aside>;
    }
    case "formula":
      return <div className="lesson-formula">
        <Latex latex={block.latex} />
        {block.caption && <p><RichText>{block.caption}</RichText></p>}
      </div>;
    case "pseudocode":
      return <figure className="lesson-code">
        <figcaption className="lesson-code-title">{block.title}</figcaption>
        <pre><code>{block.lines.map((line, index) => <span key={index} className="lesson-code-line"><span className="lesson-code-number" aria-hidden="true">{index + 1}</span>{line}{"\n"}</span>)}</code></pre>
        {block.caption && <p className="lesson-caption"><RichText>{block.caption}</RichText></p>}
      </figure>;
    case "table":
      return <figure className="lesson-table">
        <div className="lesson-table-scroll"><table>
          <thead><tr>{block.head.map(cell => <th key={cell} scope="col"><RichText>{cell}</RichText></th>)}</tr></thead>
          <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}><RichText>{cell}</RichText></td>)}</tr>)}</tbody>
        </table></div>
        {block.caption && <figcaption className="lesson-caption"><RichText>{block.caption}</RichText></figcaption>}
      </figure>;
    case "figure": {
      const Figure = block.component;
      return <figure className="lesson-figure"><Figure /><figcaption className="lesson-caption"><RichText>{block.caption}</RichText></figcaption></figure>;
    }
    case "example":
      return <details className="lesson-example" open={block.open}>
        <summary><RichText>{block.title}</RichText></summary>
        <div className="lesson-example-body"><Blocks blocks={block.blocks} /></div>
      </details>;
    case "quiz":
      return <ul className="lesson-quiz">{block.items.map(item => <li key={item.question}>
        <details><summary><RichText>{item.question}</RichText></summary><p><RichText>{item.answer}</RichText></p></details>
      </li>)}</ul>;
  }
}
