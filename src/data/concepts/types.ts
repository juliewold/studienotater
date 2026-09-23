export type ConceptType = "definition" | "theorem" | "formula" | "method";

export type Concept = {
  id: string;
  name: string;
  slug: string;
  type: ConceptType;

  shortDefinition: string;
  explanation?: string;

  subjectIds: string[];
  subtopicIds: string[];
  relatedConceptIds: string[];
};
