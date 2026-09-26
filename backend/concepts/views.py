import json

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

    candidates = extract_concept_candidates(
        text,
        subtopics,
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

    structure = generate_subject_structure(
        subject_name.strip(),
        notes,
    )

    return JsonResponse(structure)