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
                    "Du analyserer studienotater og finner faglige begreper. "
                    "Finn sentrale fagbegreper som en student kan ha nytte av "
                    "å ha en egen definisjon eller forklaring på. "
                    "Ikke ta med vanlige ord eller generelle formuleringer. "
                    "Skriv hvert begrep i naturlig grunnform, ikke i den bøyde formen "
                    "Returner hvert fagbegrep kun én gang. "
                    "Hvis samme begrep forekommer i flere bøyningsformer, skal de behandles "
                    "som samme begrep og bare grunnformen skal returneres. "
                    "som brukes i teksten. Bruk stor forbokstav i begrepsnavnet. "
                    "Eksempel: 'normalfordelingen' skal bli 'Normalfordeling', "
                    "'standardavviket' skal bli 'Standardavvik' og "
                    "'forventningsverdien' skal bli 'Forventningsverdi'. "
                    "Returner kun gyldig JSON på formatet "
                    '{"candidates": [{"name": "Begrep"}]}.'
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