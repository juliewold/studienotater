import "./MathText.css";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = {
  children: string;
  className?: string;
};

type TextPart = {
  type: "text" | "inline-math" | "block-math";
  content: string;
};

const splitTextAndMath = (text: string): TextPart[] => {
  const parts: TextPart[] = [];

  const mathPattern = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;

  let lastIndex = 0;

  for (const match of text.matchAll(mathPattern)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex, matchIndex),
      });
    }

    const matchedText = match[0];

    if (matchedText.startsWith("$$")) {
      parts.push({
        type: "block-math",
        content: matchedText.slice(2, -2),
      });
    } else {
      parts.push({
        type: "inline-math",
        content: matchedText.slice(1, -1),
      });
    }

    lastIndex = matchIndex + matchedText.length;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return parts;
};

export const MathText = ({
  children,
  className,
}: Props) => {
  const parts = splitTextAndMath(children);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <span key={`${part.type}-${index}`}>
              {part.content}
            </span>
          );
        }

        try {
          const html = katex.renderToString(part.content, {
            throwOnError: false,
            displayMode: part.type === "block-math",
          });

          if (part.type === "block-math") {
            return (
              <span
                key={`${part.type}-${index}`}
                className="math-text-block"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }

          return (
            <span
              key={`${part.type}-${index}`}
              className="math-text-inline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={`${part.type}-${index}`}>
              {part.content}
            </span>
          );
        }
      })}
    </span>
  );
};