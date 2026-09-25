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
        return {"topics": []}

    try:
        result = json.loads(content)
    except json.JSONDecodeError as error:
        raise ValueError(
            f"LLM returned invalid JSON: {content}"
        ) from error

    topics = result.get("topics")

    if not isinstance(topics, list):
        raise ValueError("LLM response does not contain a valid topics list.")

    return {
        "topics": topics,
    }