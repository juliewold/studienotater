import json
import os

from openai import OpenAI


NTNU_LLM_BASE_URL = "https://llm.hpc.ntnu.no/v1"
NTNU_LLM_MODEL = "openai/gpt-oss-120b"


def get_client():
    api_key = os.getenv("NTNU_LLM_API_KEY")

    if not api_key:
        raise RuntimeError("NTNU_LLM_API_KEY is not configured.")

    return OpenAI(
        api_key=api_key,
        base_url=NTNU_LLM_BASE_URL,
        timeout=120.0,
        max_retries=2,
    )


def extract_concept_candidates(text, subtopics=None):
    client = get_client()

    subtopics = subtopics or []

    subtopic_text = "\n".join(
        f"- ID: {subtopic['id']} | NAVN: {subtopic['name']}"
        for subtopic in subtopics
    )

    if subtopics:
        subtopic_instructions = (
            "Du får en liste over undertemaer som allerede finnes i faget. "
            "For hvert begrep skal du velge hvilket eller hvilke undertemaer "
            "begrepet faglig hører hjemme under. "
            "Bruk bare undertema-ID-er fra listen. "
            "Et begrep kan høre til flere undertemaer dersom det er faglig naturlig. "
            "Ikke velg undertema basert bare på hvor selve notatet er plassert. "
            "Koble bare når begrepet er sentralt for kunnskapen studenten skal lære "
            "i akkurat dette undertemaet. At begrepet nevnes i et notat, brukes som "
            "bakgrunn eller har en indirekte faglig forbindelse er IKKE tilstrekkelig. "
            "Velg heller for få enn for mange undertemaer. Ved tvil, utelat koblingen. "
            "En tom subtopicIds-liste er riktig når ingen undertemaer passer direkte. "
            "Flere undertemaer er bare riktig når begrepet er sentralt i hvert av dem. "
        )
    else:
        subtopic_instructions = (
            "Ingen undertemaer er oppgitt. "
            "Returner derfor en tom subtopicIds-liste for hvert begrep. "
        )

    response = client.chat.completions.create(
        model=NTNU_LLM_MODEL,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "Du bygger en kunnskapsbase fra studienotater. "

                    "Finn sentrale fagbegreper som en student bør kunne forstå "
                    "og som egner seg til en egen begrepsside. "
                    "Ikke ta med vanlige ord, overskrifter eller generelle formuleringer. "

                    "Skriv hvert begrep i naturlig grunnform med stor forbokstav. "
                    "Bruk samme fagterminologi som brukes i notatet. "
                    "Ikke oversett etablerte fagbegreper bare for å gjøre dem norske. "
                    "Hvis notatet bruker et etablert engelsk begrep som 'Big O', "
                    "'Insertion Sort' eller 'Merge Sort', behold dette navnet. "
                    "Returner hvert fagbegrep kun én gang. "

                    "Velg type fra: definition, theorem, formula, method. "

                    "For hvert begrep skal du lage: "
                    "1. shortDefinition: én kort og presis definisjon. "
                    "2. explanation: en pedagogisk forklaring som kan vises direkte "
                    "på en begrepsside for en universitetsstudent. "
                    "Forklar hva begrepet betyr, hvordan det brukes og det viktigste "
                    "studenten bør forstå. "
                    "Bruk gjerne relevante matematiske uttrykk fra notatet "
                    "når det er naturlig. "
                    "3. subtopicIds: en liste med ID-ene til undertemaene "
                    "begrepet faglig hører til. "

                    "Innholdet skal bygge på studienotatet. "
                    "Ikke finn på detaljer som ikke støttes av teksten. "

                    f"{subtopic_instructions}"

                    "Returner kun gyldig JSON. "
                    "Ingen markdown og ingen tekst før eller etter JSON. "

                    "Formatet skal være "
                    '{"candidates": ['
                    '{"name": "Begrep", '
                    '"type": "definition", '
                    '"shortDefinition": "Kort definisjon", '
                    '"explanation": "Pedagogisk forklaring", '
                    '"subtopicIds": ["subtopic-id"]}'
                    "]}"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"UNDERTEMAER:\n"
                    f"{subtopic_text or 'Ingen undertemaer'}\n\n"
                    f"STUDIENOTAT:\n{text}"
                ),
            },
        ],
    )

    content = response.choices[0].message.content

    if not content:
        raise ValueError("LLM returned an empty response.")

    try:
        result = json.loads(content)
    except json.JSONDecodeError as error:
        raise ValueError("LLM returned invalid JSON.") from error

    if not isinstance(result, dict) or not isinstance(result.get("candidates"), list):
        raise ValueError("LLM response does not contain a valid candidates list.")

    valid_subtopic_ids = {subtopic["id"] for subtopic in subtopics}
    validated = []
    for candidate in result["candidates"]:
        if not isinstance(candidate, dict):
            raise ValueError("Each candidate must be an object.")
        for field in ("name", "type", "shortDefinition", "explanation"):
            if not isinstance(candidate.get(field), str) or not candidate[field].strip():
                raise ValueError(f"Candidate has an invalid {field}.")
        candidate_type = candidate["type"].strip()
        if candidate_type not in {"definition", "theorem", "formula", "method"}:
            raise ValueError("Candidate has an invalid type.")
        if not isinstance(candidate.get("subtopicIds"), list):
            raise ValueError("Candidate subtopicIds must be a list.")
        validated.append({
            "name": candidate["name"].strip(),
            "type": candidate_type,
            "shortDefinition": candidate["shortDefinition"].strip(),
            "explanation": candidate["explanation"].strip(),
            "subtopicIds": list(dict.fromkeys(
                value for value in candidate["subtopicIds"]
                if isinstance(value, str) and value in valid_subtopic_ids
            )),
        })
    return validated
