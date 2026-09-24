import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


@csrf_exempt
@require_POST
def extract_concepts(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    text = body.get("text")

    if not isinstance(text, str) or not text.strip():
        return JsonResponse(
            {"error": "Text is required."},
            status=400,
        )

    return JsonResponse(
        {
            "candidates": [],
        }
    )