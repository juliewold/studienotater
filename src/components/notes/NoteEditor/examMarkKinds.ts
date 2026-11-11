// Typer markeringer i Notater. Egen fil, så både editor, lesevisning og forklaringsbobla kan bruke den.
export const EXAM_MARK_KINDS = ["data", "model", "method", "requirement", "constraint"] as const;

export type ExamMarkKind = (typeof EXAM_MARK_KINDS)[number];

export const examMarkKindLabels: Record<ExamMarkKind, string> = {
  data: "Opplysning",
  model: "Modell",
  method: "Metode",
  requirement: "Oppgavekrav",
  constraint: "Begrensning",
};
