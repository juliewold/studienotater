import json

from .concept_extraction_service import (
    NTNU_LLM_MODEL,
    get_client,
)


def generate_subject_structure(subject_name, notes):
    client = get_client()

    notes_text = "\n\n".join(
        (
            f"NOTE_ID: {note['id']}\n"
            f"TITTEL: {note['title']}\n"
            f"INNHOLD:\n{note['content']}"
        )
        for note in notes
    )

    response = client.chat.completions.create(
        model=NTNU_LLM_MODEL,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "Du bygger en faglig kunnskapsstruktur for et universitetsfag. "
                    "Du får flere studienotater som kildemateriale. "

                    "Analyser det faglige innholdet på tvers av alle notatene og organiser "
                    "stoffet etter fagområder, ikke etter dokumentene eller forelesningene. "

                    "Strukturen skal være: Tema -> Undertema. "

                    "Et tema er et større faglig hovedområde. "
                    "Et undertema er ett tydelig avgrenset faglig område innenfor temaet. "

                    "Lag så mange temaer og undertemaer som er faglig naturlig. "
                    "Antall temaer og undertemaer skal IKKE bestemmes av antall notater. "
                    "Ett notat kan dekke flere fagområder. "

                    "Bruk samme terminologi som brukes i notatene. "
                    "Ikke oversett etablerte fagbegreper bare for å gjøre dem norske. "
                    "Hvis notatene bruker et etablert engelsk begrep som 'Big O', "
                    "'Insertion Sort' eller 'Merge Sort', behold dette navnet. "
                    "Vanlige beskrivende tema- og undertemanavn kan være på norsk når det er naturlig. "

                    "Et undertemanavn skal være kort og beskrive ett faglig område. "
                    "Ikke lag undertemanavn som er oppramsinger av begreper. "

                    "Ikke organiser etter dokumenttype eller forelesning. "
                    "Temaer eller undertemaer skal derfor ikke hete ting som "
                    "'Forelesning', 'Forelesningsnotater', 'Slides', 'Notater', "
                    "'Oversikt' eller lignende. "

                    "Eksempel på ønsket struktur: "
                    "Tema: Algoritmeanalyse. "
                    "Undertemaer: RAM-modellen, Asymptotisk notasjon, Kjøretidsanalyse. "
                    "Tema: Sorteringsalgoritmer. "
                    "Undertemaer: Insertion Sort, Merge Sort. "

                    "Hvert notat skal fortsatt få ett primært undertema som bestemmer "
                    "hvor selve notatet vises. Velg undertemaet som best representerer "
                    "notatets hovedinnhold. "
                    "Et undertema trenger ikke ha et notat direkte plassert i seg. "

                    "Bruk NOTE_ID nøyaktig slik den er oppgitt. "
                    "Hver NOTE_ID skal forekomme i noteIds for nøyaktig ett undertema. "

                    "Bruk bare fagstoff som støttes av notatene. "
                    "Ikke legg til pensumområder bare fordi de vanligvis finnes i faget. "

                    "Returner et JSON-objekt med denne strukturen: "
                    '{"topics": ['
                    '{"name": "Tema", "subtopics": ['
                    '{"name": "Undertema", "noteIds": ["note-id"]}'
                    "]}"
                    "]}"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"FAG: {subject_name}\n\n"
                    f"NOTATER:\n{notes_text}"
                ),
            },
        ],
    )

    content = response.choices[0].message.content

    if not content:
        raise ValueError("LLM returned an empty structure.")

    try:
        result = json.loads(content)
    except json.JSONDecodeError as error:
        raise ValueError("LLM returned invalid JSON.") from error

    if not isinstance(result, dict) or not isinstance(result.get("topics"), list):
        raise ValueError("LLM response does not contain a valid topics list.")

    valid_note_ids = {note["id"] for note in notes}
    assigned = set()
    validated_topics = []
    for topic in result["topics"]:
        if not isinstance(topic, dict) or not isinstance(topic.get("name"), str) or not topic["name"].strip():
            raise ValueError("Topic must have a non-empty name.")
        if not isinstance(topic.get("subtopics"), list) or not topic["subtopics"]:
            raise ValueError("Topic must have a non-empty subtopics list.")
        validated_subtopics = []
        for subtopic in topic["subtopics"]:
            if not isinstance(subtopic, dict) or not isinstance(subtopic.get("name"), str) or not subtopic["name"].strip():
                raise ValueError("Subtopic must have a non-empty name.")
            if not isinstance(subtopic.get("noteIds"), list):
                raise ValueError("Subtopic noteIds must be a list.")
            note_ids = []
            for note_id in subtopic["noteIds"]:
                if isinstance(note_id, str) and note_id in valid_note_ids and note_id not in assigned:
                    note_ids.append(note_id)
                    assigned.add(note_id)
            validated_subtopics.append({"name": subtopic["name"].strip(), "noteIds": note_ids})
        validated_topics.append({"name": topic["name"].strip(), "subtopics": validated_subtopics})

    # Do not invent a fallback topic or save an incomplete plan. The caller can
    # retry or organize the notes manually; no frontend writes have started yet.
    if assigned != valid_note_ids:
        raise ValueError("The generated structure omitted one or more notes.")
    return {"topics": validated_topics}
