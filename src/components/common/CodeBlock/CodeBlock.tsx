import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./CodeBlock.css";

type CodeBlockProps = {
  language: string;
  code: string;
};

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{language}</span>

        <button type="button" onClick={copyCode}>
          {copied ? "Kopiert!" : "Kopier"}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          padding: "20px",
          background: "#282c34",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}