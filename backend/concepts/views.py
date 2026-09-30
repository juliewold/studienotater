import json

from openai import APIConnectionError, APIStatusError

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .concept_extraction_service import extract_concept_candidates
from .flashcard_generation_service import generate_flashcards
from .note_summary_service import summarize_note
from .selected_text_service import explain_selected_text
from .subject_structure_service import generate_subject_structure


@csrf_exempt
@require_POST
def extract_concepts(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    if not isinstance(body, dict):
        return JsonResponse({"error": "Body must be an object."}, status=400)

    text = body.get("text")
    subtopics = body.get("subtopics", [])

    if not isinstance(text, str) or not text.strip():
        return JsonResponse(
            {"error": "Text is required."},
            status=400,
        )

    if not isinstance(subtopics, list):
        return JsonResponse(
            {"error": "Subtopics must be a list."},
            status=400,
        )

    if any(
        not isinstance(item, dict)
        or any(
            not isinstance(item.get(key), str) or not item[key].strip()
            for key in ("id", "name")
        )
        for item in subtopics
    ):
        return JsonResponse({"error": "Invalid subtopics."}, status=400)

    existing_concepts = body.get("existingConcepts", [])

    if not isinstance(existing_concepts, list) or any(
        not isinstance(item, dict)
        or any(
            not isinstance(item.get(key), str) or not item[key].strip()
            for key in ("name", "type", "shortDefinition")
        )
        or item.get("type")
        not in {"definition", "theorem", "formula", "method"}
        for item in existing_concepts
    ):
        return JsonResponse(
            {"error": "Invalid existing concepts."},
            status=400,
        )

    try:
        candidates = extract_concept_candidates(
            text,
            subtopics,
            existing_concepts,
        )
    except APIConnectionError:
        return JsonResponse(
            {"error": "Kunne ikke nå AI-tjenesten. Prøv igjen senere."},
            status=503,
        )
    except APIStatusError:
        return JsonResponse(
            {
                "error": (
                    "AI-tjenesten avviste forespørselen. "
                    "Prøv igjen senere."
                )
            },
            status=502,
        )
    except ValueError:
        return JsonResponse(
            {
                "error": (
                    "AI-tjenesten returnerte et ugyldig svar "
                    "etter to forsøk."
                ),
                "code": "invalid_ai_response",
            },
            status=502,
        )

    return JsonResponse(
        {
            "candidates": candidates,
        }
    )


@csrf_exempt
@require_POST
def generate_structure(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    if not isinstance(body, dict):
        return JsonResponse({"error": "Body must be an object."}, status=400)

    subject_name = body.get("subjectName")
    notes = body.get("notes")

    if not isinstance(subject_name, str) or not subject_name.strip():
        return JsonResponse(
            {"error": "Subject name is required."},
            status=400,
        )

    if not isinstance(notes, list) or not notes:
        return JsonResponse(
            {"error": "Notes are required."},
            status=400,
        )

    if any(
        not isinstance(note, dict)
        or any(
            not isinstance(note.get(key), str) or not note[key].strip()
            for key in ("id", "title", "content")
        )
        for note in notes
    ) or len({note["id"] for note in notes}) != len(notes):
        return JsonResponse(
            {
                "error": (
                    "Notes must have unique IDs and "
                    "non-empty title/content."
                )
            },
            status=400,
        )

    try:
        structure = generate_subject_structure(
            subject_name.strip(),
            notes,
        )
    except APIConnectionError:
        return JsonResponse(
            {"error": "Kunne ikke nå AI-tjenesten. Prøv igjen senere."},
            status=503,
        )
    except APIStatusError:
        return JsonResponse(
            {
                "error": (
                    "AI-tjenesten avviste forespørselen. "
                    "Prøv igjen senere."
                )
            },
            status=502,
        )
    except ValueError:
        return JsonResponse(
            {
                "error": (
                    "AI-tjenesten returnerte en ugyldig eller "
                    "ufullstendig fagstruktur. Ingen struktur er "
                    "lagret. Prøv igjen."
                )
            },
            status=502,
        )

    return JsonResponse(structure)


@csrf_exempt
@require_POST
def generate_flashcard_suggestions(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    if not isinstance(body, dict):
        return JsonResponse({"error": "Body must be an object."}, status=400)

    text = body.get("text")
    subtopics = body.get("subtopics")

    if not isinstance(text, str) or not text.strip():
        return JsonResponse(
            {"error": "Text is required."},
            status=400,
        )

    if not isinstance(subtopics, list) or not subtopics:
        return JsonResponse(
            {"error": "At least one subtopic is required."},
            status=400,
        )

    if any(
        not isinstance(item, dict)
        or not isinstance(item.get("id"), str)
        or not item["id"].strip()
        or not isinstance(item.get("name"), str)
        or not item["name"].strip()
        for item in subtopics
    ):
        return JsonResponse(
            {"error": "Invalid subtopics."},
            status=400,
        )

    try:
        flashcards = generate_flashcards(
            text.strip(),
            subtopics,
        )
    except APIConnectionError:
        return JsonResponse(
            {"error": "Kunne ikke nå AI-tjenesten. Prøv igjen senere."},
            status=503,
        )
    except APIStatusError:
        return JsonResponse(
            {
                "error": (
                    "AI-tjenesten avviste forespørselen. "
                    "Prøv igjen senere."
                )
            },
            status=502,
        )
    except ValueError:
        return JsonResponse(
            {
                "error": (
                    "AI-tjenesten returnerte ugyldige flashcards "
                    "etter to forsøk."
                ),
                "code": "invalid_ai_response",
            },
            status=502,
        )

    return JsonResponse(
        {
            "flashcards": flashcards,
        }
    )

@csrf_exempt
@require_POST
def generate_note_summary(request):
    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON."}, status=400)
    if not isinstance(body, dict) or not isinstance(body.get("text"), str) or not body["text"].strip():
        return JsonResponse({"error": "Notatet inneholder ingen tekst."}, status=400)
    try:
        summary = summarize_note(body["text"].strip())
    except APIConnectionError:
        return JsonResponse({"error": "Kunne ikke nå AI-tjenesten. Prøv igjen senere."}, status=503)
    except APIStatusError:
        return JsonResponse({"error": "AI-tjenesten avviste forespørselen. Prøv igjen senere."}, status=502)
    except ValueError:
        return JsonResponse({"error": "AI-tjenesten returnerte en ugyldig oppsummering etter to forsøk.", "code": "invalid_ai_response"}, status=502)
    return JsonResponse({"summary": summary})


@csrf_exempt
@require_POST
def explain_note_selection(request):
    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON."}, status=400)
    if not isinstance(body, dict) or not isinstance(body.get("text"), str) or not body["text"].strip():
        return JsonResponse({"error": "Marker tekst i notatet først."}, status=400)
    if len(body["text"].strip()) > 10000:
        return JsonResponse({"error": "Velg et kortere utdrag (maks. 10 000 tegn)."}, status=400)
    try:
        explanation = explain_selected_text(body["text"].strip())
    except APIConnectionError:
        return JsonResponse({"error": "Kunne ikke nå AI-tjenesten. Prøv igjen senere."}, status=503)
    except APIStatusError:
        return JsonResponse({"error": "AI-tjenesten avviste forespørselen. Prøv igjen senere."}, status=502)
    except ValueError:
        return JsonResponse({"error": "AI-tjenesten returnerte en ugyldig forklaring etter to forsøk.", "code": "invalid_ai_response"}, status=502)
    return JsonResponse({"explanation": explanation})
