import type { NoteContentJson } from "../notes/notesService";

import {
  getConceptsFromDatabase,
  getOrCreateConceptFromCallout,
} from "./conceptService";

import { findConceptsInText } from "./conceptRecognitionService";
import { addConceptSubtopic } from "./conceptSubtopicsService";
import { getConceptCallouts } from "./conceptCalloutService";

export async function autoLinkConceptsToSubtopic(
  content: string,
  contentJson: NoteContentJson | undefined,
  subtopicId: string,
) {
  if (!subtopicId) {
    return;
  }

  const concepts = await getConceptsFromDatabase();

  if (content.trim()) {
    const matches = findConceptsInText(content, concepts);

    const conceptIds = [...new Set(matches.map((match) => match.concept.id))];

    await Promise.all(
      conceptIds.map((conceptId) => addConceptSubtopic(conceptId, subtopicId)),
    );
  }

  const callouts = getConceptCallouts(contentJson);

  for (const callout of callouts) {
    if (!callout.explanation.trim()) {
      continue;
    }

    const concept = await getOrCreateConceptFromCallout(
      callout.name,
      callout.type,
      callout.explanation,
    );

    await addConceptSubtopic(concept.id, subtopicId);
  }
}
