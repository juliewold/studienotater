import { useMemo, type ReactNode } from "react";
import { Search } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "./Curriculum.css";

export function CurriculumPage({ label, title, children, className = "" }: { label: string; title: string; children: ReactNode; className?: string }) {
  return <main className={`curriculum-page site-container ${className}`}>
    <header className="curriculum-page-header"><p className="curriculum-label">{label}</p><h1>{title}</h1></header>
    {children}
  </main>;
}

export function CurriculumStatus({ children, alert = false }: { children: ReactNode; alert?: boolean }) {
  return <p className="curriculum-status" role={alert ? "alert" : "status"}>{children}</p>;
}

export function SearchField({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  return <label className="curriculum-search">
    <Search size={18} aria-hidden="true" />
    <span className="visually-hidden">{label}</span>
    <input type="search" value={value} placeholder={`${label} …`} onChange={event => onChange(event.target.value)} />
  </label>;
}

export function Latex({ latex, display = true }: { latex: string; display?: boolean }) {
  const html = useMemo(() => katex.renderToString(latex, { displayMode: display, throwOnError: false }), [latex, display]);
  return <span className={display ? "curriculum-latex is-display" : "curriculum-latex"} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Inline lesson text: $math$, **bold** and `code`. */
export function RichText({ children }: { children: string }) {
  const parts = children.split(/(\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return <>{parts.map((part, index) => part.startsWith("$") && part.endsWith("$") && part.length > 1
    ? <Latex key={index} latex={part.slice(1, -1)} display={false} />
    : part.startsWith("**") && part.endsWith("**") ? <strong key={index}><RichText>{part.slice(2, -2)}</RichText></strong>
    : part.startsWith("`") && part.endsWith("`") ? <code key={index}>{part.slice(1, -1)}</code>
    : part)}</>;
}

export function NoteFormulaToggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="curriculum-toggle-notes">
    <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />
    Vis også formler fra notater for temaer uten læringsnotat (ikke kvalitetssikret)
  </label>;
}
