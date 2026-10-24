import json
from unittest.mock import Mock, patch

from django.test import SimpleTestCase

from ai.llm import NTNU_LLM_BASE_URL, NTNU_LLM_MODEL, get_client


class LLMClientTests(SimpleTestCase):
    @patch.dict("os.environ", {"NTNU_LLM_API_KEY": "test-key"}, clear=True)
    @patch("ai.llm.OpenAI")
    def test_configuration_and_fresh_client_are_preserved(self, constructor):
        constructor.side_effect = [Mock(), Mock()]
        first, second = get_client(), get_client()
        self.assertIsNot(first, second)
        self.assertEqual(constructor.call_count, 2)
        constructor.assert_called_with(
            api_key="test-key",
            base_url="https://llm.hpc.ntnu.no/v1",
            timeout=120.0,
            max_retries=2,
        )
        self.assertEqual(NTNU_LLM_BASE_URL, "https://llm.hpc.ntnu.no/v1")
        self.assertEqual(NTNU_LLM_MODEL, "openai/gpt-oss-120b")

    @patch("ai.llm.OpenAI")
    def test_missing_or_empty_key_keeps_existing_error(self, constructor):
        for environment in ({}, {"NTNU_LLM_API_KEY": ""}):
            with self.subTest(environment=environment), patch.dict(
                "os.environ", environment, clear=True
            ), self.assertRaisesRegex(
                RuntimeError, "NTNU_LLM_API_KEY is not configured."
            ):
                get_client()
        constructor.assert_not_called()

    @patch("ai.llm.OpenAI")
    def test_key_is_read_at_call_time(self, constructor):
        for key in ("first-test-key", "second-test-key"):
            with patch.dict("os.environ", {"NTNU_LLM_API_KEY": key}, clear=True):
                get_client()
                self.assertEqual(constructor.call_args.kwargs["api_key"], key)

    @patch.dict("os.environ", {"NTNU_LLM_API_KEY": "test-key"}, clear=True)
    def test_services_use_shared_client_and_keep_response_contracts(self):
        from concepts.concept_extraction_service import extract_concept_candidates
        from concepts.flashcard_generation_service import generate_flashcards
        from concepts.note_summary_service import summarize_note
        from concepts.selected_text_service import explain_selected_text
        from concepts.subject_structure_service import generate_subject_structure
        from concepts.structure_note_assignment import select_note_subtopic

        cases = [
            (summarize_note, ("Kildetekst",), {"summary": "Kort oppsummering"}, "Kort oppsummering"),
            (explain_selected_text, ("Utdrag",), {"explanation": "Enkel forklaring"}, "Enkel forklaring"),
            (extract_concept_candidates, ("Kildetekst",), {"candidates": []}, []),
            (generate_flashcards, ("<p>Kildetekst</p>", []), {"flashcards": []}, []),
            (generate_subject_structure, ("Fag", []), {"topics": []}, {"topics": []}),
        ]
        for function, args, output, expected in cases:
            with self.subTest(service=function.__name__), patch("ai.llm.OpenAI") as constructor:
                client = constructor.return_value
                client.chat.completions.create.return_value = Mock(choices=[Mock(
                    finish_reason="stop", message=Mock(content=json.dumps(output))
                )])
                self.assertEqual(function(*args), expected)
                constructor.assert_called_once_with(
                    api_key="test-key", base_url=NTNU_LLM_BASE_URL,
                    timeout=120.0, max_retries=2,
                )
                client.chat.completions.create.assert_called_once()
                request = client.chat.completions.create.call_args.kwargs
                self.assertEqual(request["model"], NTNU_LLM_MODEL)
                self.assertEqual(request["response_format"], {"type": "json_object"})

        # The placement phase receives the same client rather than creating one.
        client = Mock()
        client.chat.completions.create.return_value = Mock(choices=[Mock(
            finish_reason="stop", message=Mock(content=json.dumps({
                "choice": "s0", "evidence": "Dette er kildeteksten", "reason": "Hovedinnhold"
            }))
        )])
        self.assertEqual(select_note_subtopic(
            client, {"title": "Notat", "content": "Dette er kildeteksten"},
            [({"name": "Tema"}, {"name": "Undertema"})],
        ), 0)
        self.assertEqual(client.chat.completions.create.call_args.kwargs["model"], NTNU_LLM_MODEL)
