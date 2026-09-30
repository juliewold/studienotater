from django.urls import path

from . import views


urlpatterns = [
    path("explain-selection/", views.explain_note_selection, name="explain-selection"),
    path("summarize-note/", views.generate_note_summary, name="summarize-note"),
    path(
        "extract/",
        views.extract_concepts,
        name="extract-concepts",
    ),
    path(
        "generate-structure/",
        views.generate_structure,
        name="generate-structure",
    ),
    path(
        "generate-flashcards/",
        views.generate_flashcard_suggestions,
        name="generate-flashcards",
    ),
]