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
    relatedConceptIds: ["variance"],
  },

  {
    id: "variance",
    name: "Varians",
    slug: "varians",
    type: "formula",

    shortDefinition:
      "Et mål på hvor mye verdiene til en stokastisk variabel varierer rundt forventningsverdien.",

    explanation:
      "Variansen beskriver spredningen rundt forventningsverdien og er definert som forventningsverdien av det kvadrerte avviket fra forventningsverdien.",

    subjectIds: ["tma4240"],
    relatedConceptIds: ["expected-value"],
  },
];
