import json
import logging

from .concept_extraction_service import NTNU_LLM_MODEL, get_client


logger = logging.getLogger(__name__)


def _generate_flashcards_once(
    text,
    subtopics,
    validation_hint="",
):
    client = get_client()

    subtopic_text = "\n".join(
        f"- ID: {subtopic['id']} | NAVN: {subtopic['name']}"
        for subtopic in subtopics
    )

    response = client.chat.completions.create(
        model=NTNU_LLM_MODEL,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "Du lager flashcards for en universitetsstudent basert på "
                    "studentens egne studienotater. "

                    "Lag flashcards som tester sentral kunnskap studenten bør "
                    "kunne hente frem aktivt fra hukommelsen. "

                    "Prioriter viktige definisjoner, sammenhenger, metoder, "
                    "formler, algoritmer og faglige forskjeller. "

                    "Ikke lag spørsmål om trivielle detaljer. "
                    "Ikke lag flere kort som tester nøyaktig samme kunnskap. "

                    "Spørsmålene skal være tydelige og kunne forstås uten å "
                    "måtte se selve notatet. "

                    "Svarene skal være korte, presise og pedagogiske. "
                    "Ta med nødvendige formler eller fagbegreper når det er relevant. "

                    "Alt faglig innhold i spørsmål og svar skal være støttet "
                    "av studienotatet. Ikke finn på informasjon som ikke finnes der. "

                    "Du får også en liste over undertemaer som allerede finnes "
                    "i faget. For hvert flashcard skal du velge det ene "
                    "undertemaet kortet passer best til. "

                    "Bruk bare undertema-ID-er fra listen. "
                    "Ikke opprett nye undertemaer. "

                    "Lag normalt mellom 5 og 15 flashcards, avhengig av hvor "
                    "mye viktig faglig innhold notatet inneholder. "
                    "Et kort notat kan gi færre enn 5 dersom det er riktig. "

                    f"{validation_hint}"

                    "Returner kun gyldig JSON. "
                    "Ingen markdown og ingen tekst før eller etter JSON. "

                    "Formatet skal være "
                    '{"flashcards": ['
                    '{"question": "Spørsmål", '
                    '"answer": "Svar", '
                    '"subtopicId": "subtopic-id"}'
                    "]}"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"UNDERTEMAER:\n"
                    f"{subtopic_text}\n\n"
                    f"STUDIENOTAT:\n{text}"
                ),
            },
        ],
    )

    if not response.choices:
        raise ValueError("LLM returned no choices.")

    if response.choices[0].finish_reason == "length":
        raise ValueError("LLM response was truncated.")

    content = response.choices[0].message.content

    if not content:
        raise ValueError("LLM returned an empty response.")

    try:
        result = json.loads(content)
    except json.JSONDecodeError as error:
        raise ValueError("LLM returned invalid JSON.") from error

    if not isinstance(result, dict) or not isinstance(
        result.get("flashcards"), list
    ):
        raise ValueError(
            "LLM response does not contain a valid flashcards list."
        )

    valid_subtopic_ids = {
        subtopic["id"]
        for subtopic in subtopics
    }

    validated = []

    for index, flashcard in enumerate(result["flashcards"]):
        if not isinstance(flashcard, dict):
            raise ValueError(
                f"Flashcard {index} must be an object."
            )

        question = flashcard.get("question")
        answer = flashcard.get("answer")
        subtopic_id = flashcard.get("subtopicId")

        if not isinstance(question, str) or not question.strip():
            raise ValueError(
                f"Flashcard {index} has an invalid question."
            )

        if not isinstance(answer, str) or not answer.strip():
            raise ValueError(
                f"Flashcard {index} has an invalid answer."
            )

        if (
            not isinstance(subtopic_id, str)
            or subtopic_id not in valid_subtopic_ids
        ):
            raise ValueError(
                f"Flashcard {index} has an invalid subtopicId."
            )

        validated.append(
            {
                "question": question.strip(),
                "answer": answer.strip(),
                "subtopicId": subtopic_id,
            }
        )

    return validated


def generate_flashcards(text, subtopics):
    """Generate and validate flashcards, retrying invalid AI output once."""

    validation_hint = ""

    for attempt in range(1, 3):
        try:
            return _generate_flashcards_once(
                text,
                subtopics,
                validation_hint,
            )
        except ValueError as error:
            logger.warning(
                "Flashcard generation validation failed "
                "(attempt %s/2): %s",
                attempt,
                error,
            )

            if attempt == 2:
                raise

            validation_hint = (
                "Forrige forsøk bestod ikke valideringen: "
                + str(error)
                + " "
                "Lag et nytt komplett svar fra studienotatet. "
                "Alle flashcards må ha question og answer som "
                "ikke-tomme strenger og subtopicId må være en "
                "gyldig ID fra undertemalisten. "
            )