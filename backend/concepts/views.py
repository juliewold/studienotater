import json
from openai import APIConnectionError, APIStatusError

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .concept_extraction_service import extract_concept_candidates
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
        or any(not isinstance(item.get(key), str) or not item[key].strip() for key in ("id", "name"))
        for item in subtopics
    ):
        return JsonResponse({"error": "Invalid subtopics."}, status=400)

    try:
        candidates = extract_concept_candidates(text, subtopics)
    except APIConnectionError:
        return JsonResponse(
            {"error": "Kunne ikke nå AI-tjenesten. Prøv igjen senere."}, status=503
        )
    except APIStatusError:
        return JsonResponse(
            {"error": "AI-tjenesten avviste forespørselen. Prøv igjen senere."}, status=502
        )
    except ValueError:
        return JsonResponse(
            {"error": "AI-tjenesten returnerte et ugyldig svar. Prøv igjen."}, status=502
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
        or any(not isinstance(note.get(key), str) or not note[key].strip() for key in ("id", "title", "content"))
        for note in notes
    ) or len({note["id"] for note in notes}) != len(notes):
        return JsonResponse({"error": "Notes must have unique IDs and non-empty title/content."}, status=400)

    try:
        structure = generate_subject_structure(subject_name.strip(), notes)
    except APIConnectionError:
        return JsonResponse({"error": "Kunne ikke nå AI-tjenesten. Prøv igjen senere."}, status=503)
    except APIStatusError:
        return JsonResponse({"error": "AI-tjenesten avviste forespørselen. Prøv igjen senere."}, status=502)
    except ValueError:
        return JsonResponse({"error": "AI-tjenesten returnerte en ugyldig eller ufullstendig fagstruktur. Ingen struktur er lagret. Prøv igjen."}, status=502)

    return JsonResponse(structure)
