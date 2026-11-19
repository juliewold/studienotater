import "./FlashcardExplanation.css";

import { MathText } from "../../common/MathText/MathText";

type ExplanationPart = { kind: "text" | "code"; content: string };

/**
 * Splits an explanation into text and code. Code is written between lines with three
 * backticks, for example ```python on the first line and ``` on the last line.
 */
const splitExplanation = (text: string): ExplanationPart[] => {
  const parts: ExplanationPart[] = [];
  const fence = /```[^\n]*\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fence.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: "text", content: text.slice(lastIndex, match.index) });
    }

    parts.push({ kind: "code", content: match[1].replace(/\n$/, "") });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ kind: "text", content: text.slice(lastIndex) });
  }

  return parts.filter((part) => part.kind === "code" || part.content.trim() !== "");
};

/** Explanation text with formulas, and code blocks that keep their indentation. */
export const FlashcardExplanation = ({ text }: { text: string }) => (
  <>
    {splitExplanation(text).map((part, index) =>
      part.kind === "code" ? (
        <pre key={index} className="flashcard-code">
          <code>{part.content}</code>
        </pre>
      ) : (
        <div key={index} className="flashcard-explanation-text">
          <MathText>{part.content.trim()}</MathText>
        </div>
      ),
    )}
  </>
);
