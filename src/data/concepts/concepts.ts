import type { Concept } from "./types";

export const concepts: Concept[] = [
  {
    id: "expected-value",
    name: "Forventningsverdi",
    slug: "forventningsverdi",
    type: "definition",

    shortDefinition:
      "Den gjennomsnittlige verdien vi forventer at en stokastisk variabel vil ha over mange repetisjoner.",

    explanation:
      "Forventningsverdien beskriver den langsiktige gjennomsnittsverdien til en stokastisk variabel.",

    subjectIds: ["tma4240"],
    relatedConceptIds: [],
  },
];
