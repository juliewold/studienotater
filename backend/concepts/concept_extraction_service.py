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
    )


def extract_concept_candidates(text):
    client = get_client()

    response = client.chat.completions.create(
        model=NTNU_LLM_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Du bygger en kunnskapsbase fra studienotater. "
                    "Finn sentrale fagbegreper som en student bør kunne forstå "
                    "og som egner seg til en egen begrepsside. "
                    "Ikke ta med vanlige ord, overskrifter eller generelle formuleringer. "

                    "Skriv hvert begrep i naturlig grunnform med stor forbokstav. "
                    "Eksempel: 'normalfordelingen' blir 'Normalfordeling', "
                    "'standardavviket' blir 'Standardavvik' og "
                    "'forventningsverdien' blir 'Forventningsverdi'. "
                    "Returner hvert fagbegrep kun én gang. "

                    "Velg type fra: definition, theorem, formula, method. "

                    "For hvert begrep skal du lage: "
                    "1. shortDefinition: én kort og presis definisjon. "
                    "2. explanation: en pedagogisk forklaring som kan vises direkte "
                    "på en begrepsside for en universitetsstudent. "
                    "Forklar hva begrepet betyr, hvordan det brukes og det viktigste "
                    "studenten bør forstå. Bruk gjerne relevante matematiske uttrykk "
                    "fra notatet når det er naturlig. "

                    "Innholdet skal bygge på studienotatet. "
                    "Ikke finn på detaljer som ikke støttes av teksten. "

                    "Returner kun gyldig JSON. Ingen markdown og ingen tekst "
                    "før eller etter JSON. Formatet skal være "
                    '{"candidates": ['
                    '{"name": "Begrep", '
                    '"type": "definition", '
                    '"shortDefinition": "Kort definisjon", '
                    '"explanation": "Pedagogisk forklaring"}'
                    "]}"
                ),
            },
            {
                "role": "user",
                "content": text,
            },
        ],
    )

    content = response.choices[0].message.content

    if not content:
        return []

    result = json.loads(content)

    return result.get("candidates", [])