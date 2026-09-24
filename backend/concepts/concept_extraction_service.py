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

def test_connection():
    client = get_client()

    response = client.chat.completions.create(
        model=NTNU_LLM_MODEL,
        messages=[
            {
                "role": "user",
                "content": "Svar kun med ordet OK.",
            }
        ],
    )

    return response.choices[0].message.content