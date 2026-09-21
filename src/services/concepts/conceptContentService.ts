import { getAllNotes } from "../notes/notesService";

export type ConceptContent =
  | {
      type: "definition" | "theorem";
      html: string;
    }
  | {
      type: "formula";
      latex: string;
    };

export function getConceptContentFromNote(
  noteContent: string,
  conceptId: string,
): ConceptContent[] {
  if (!noteContent) {
    return [];
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(noteContent, "text/html");

  const conceptContent: ConceptContent[] = [];

  const callouts = document.querySelectorAll<HTMLElement>(
    "[data-type='callout'][data-concept-id]",
  );

  callouts.forEach((callout) => {
    const calloutConceptId = callout.dataset.conceptId;
    const calloutType = callout.dataset.calloutType;

    if (calloutConceptId !== conceptId) {
      return;
    }

    if (calloutType !== "definition" && calloutType !== "theorem") {
      return;
    }

    const body = callout.querySelector<HTMLElement>(".note-callout-body");

    if (!body) {
      return;
    }

    conceptContent.push({
      type: calloutType,
      html: body.innerHTML,
    });
  });

  const formulas = document.querySelectorAll<HTMLElement>(
    "[data-type='block-math'][data-formula-concept-id]",
  );

  formulas.forEach((formula) => {
    const formulaConceptId = formula.dataset.formulaConceptId;
    const latex = formula.dataset.latex;

    if (formulaConceptId !== conceptId || !latex) {
      return;
    }

    conceptContent.push({
      type: "formula",
      latex,
    });
  });

  return conceptContent;
}

export type ConceptContentSource = ConceptContent & {
  noteId: string;
  noteTitle: string;
  subjectId: string;
  noteSlug: string;
};

export async function getConceptContent(
  conceptId: string,
): Promise<ConceptContentSource[]> {
  const notes = await getAllNotes();

  return notes.flatMap((note) => {
    const content = getConceptContentFromNote(note.content, conceptId);

    return content.map((item) => ({
      ...item,
      noteId: note.id,
      noteTitle: note.title,
      subjectId: note.subjectId,
      noteSlug: note.slug,
    }));
  });
}
