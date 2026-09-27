from unittest.mock import Mock, patch

from django.test import SimpleTestCase
from openai import APIConnectionError, APIStatusError


class ConceptExtractionFailureTests(SimpleTestCase):
    def request_with_failure(self, error):
        with patch("concepts.views.extract_concept_candidates", side_effect=error):
            return self.client.post(
                "/api/concepts/extract/",
                data={"text": "Et testbegrep", "subtopics": []},
                content_type="application/json",
            )

    def test_connection_failure_returns_safe_retry_message(self):
        response = self.request_with_failure(
            APIConnectionError(request=Mock())
        )
        self.assertEqual(response.status_code, 503)
        self.assertIn("Kunne ikke nå AI-tjenesten", response.json()["error"])

    def test_upstream_failure_does_not_expose_provider_details(self):
        response = self.request_with_failure(APIStatusError(
            "private-provider-details",
            response=Mock(status_code=401, request=Mock()),
            body=None,
        ))
        self.assertEqual(response.status_code, 502)
        self.assertNotContains(response, "private-provider-details", status_code=502)

    def test_invalid_ai_json_returns_controlled_error(self):
        response = self.request_with_failure(ValueError("invalid model response"))
        self.assertEqual(response.status_code, 502)
        self.assertIn("ugyldig svar", response.json()["error"])

    def test_numeric_localhost_origin_is_allowed(self):
        response = self.client.options(
            "/api/concepts/extract/",
            HTTP_ORIGIN="http://127.0.0.1:5173",
            HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST",
        )
        self.assertEqual(response.headers["access-control-allow-origin"], "http://127.0.0.1:5173")


class AIValidationTests(SimpleTestCase):
    def call_service(self, service, payload, raw=False):
        import json
        from .concept_extraction_service import extract_concept_candidates
        from .subject_structure_service import generate_subject_structure

        client = Mock()
        client.chat.completions.create.return_value = Mock(
            choices=[Mock(message=Mock(content=payload if raw else json.dumps(payload)))]
        )
        with patch(f"concepts.{service}.get_client", return_value=client):
            if service == "concept_extraction_service":
                return extract_concept_candidates("Source notes", [
                    {"id": "s1", "name": "Induction"}, {"id": "s2", "name": "Proofs"},
                ])
            return generate_subject_structure("Algorithms", [
                {"id": "n1", "title": "First", "content": "First source"},
                {"id": "n2", "title": "Second", "content": "Second source"},
            ])

    def candidate(self, **changes):
        return dict(name=" Induction ", type="method", shortDefinition=" Definition ",
                    explanation=" Explanation ", subtopicIds=["s1"]) | changes

    def structure(self, **changes):
        return {"topics": [{"name": " Proofs ", "subtopics": [
            {"name": " Induction ", "noteIds": ["n1", "n2"]} | changes,
        ]}]}

    def test_candidate_fields_are_normalized_and_ids_filtered(self):
        result = self.call_service("concept_extraction_service", {"candidates": [
            self.candidate(subtopicIds=["s1", "s2", "unknown", "s1", None, {}, []]),
        ]})
        self.assertEqual(result, [{"name": "Induction", "type": "method",
                                  "shortDefinition": "Definition", "explanation": "Explanation",
                                  "subtopicIds": ["s1", "s2"]}])

    def test_all_supported_candidate_types(self):
        for kind in ("definition", "theorem", "formula", "method"):
            with self.subTest(kind=kind):
                result = self.call_service("concept_extraction_service", {
                    "candidates": [self.candidate(type=kind)]})
                self.assertEqual(result[0]["type"], kind)

    def test_invalid_candidate_fields_reject_whole_response(self):
        for field in ("name", "type", "shortDefinition", "explanation", "subtopicIds"):
            for bad in (None, 7, {}, "" if field == "subtopicIds" else [], "   "):
                with self.subTest(field=field, bad=bad), self.assertRaises(ValueError):
                    self.call_service("concept_extraction_service", {"candidates": [
                        self.candidate(), self.candidate(**{field: bad})]})
            missing = self.candidate()
            del missing[field]
            with self.subTest(missing=field), self.assertRaises(ValueError):
                self.call_service("concept_extraction_service", {"candidates": [missing]})
        with self.assertRaises(ValueError):
            self.call_service("concept_extraction_service", {"candidates": [self.candidate(type="example")]})

    def test_non_object_candidates_and_bad_envelopes(self):
        for payload in ([], None, 3, {}, {"candidates": None}, {"candidates": {}},
                        {"candidates": [None]}, {"candidates": ["word"]}, {"candidates": [[]]}):
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                self.call_service("concept_extraction_service", payload)
        self.assertEqual(self.call_service("concept_extraction_service", {"candidates": []}), [])

    def test_empty_and_invalid_json_responses(self):
        for service in ("concept_extraction_service", "subject_structure_service"):
            for content in (None, "", "not json"):
                with self.subTest(service=service, content=content), self.assertRaises(ValueError):
                    self.call_service(service, content, raw=True)

    def test_structure_filters_unknown_ids_and_assigns_each_note_once(self):
        payload = self.structure(noteIds=["n1", "n1", "unknown", {}, [], None])
        payload["topics"].append({"name": "Other", "subtopics": [
            {"name": "Second", "noteIds": ["n1", "n2", "n2"]},
            {"name": "Supported empty subtopic", "noteIds": []},
        ]})
        result = self.call_service("subject_structure_service", payload)
        self.assertEqual(result["topics"][0]["name"], "Proofs")
        self.assertEqual(result["topics"][0]["subtopics"][0], {"name": "Induction", "noteIds": ["n1"]})
        self.assertEqual(result["topics"][1]["subtopics"][0]["noteIds"], ["n2"])
        self.assertEqual(result["topics"][1]["subtopics"][1]["noteIds"], [])

    def test_missing_notes_reject_structure_without_inventing_content(self):
        for payload in (self.structure(noteIds=["n1"]), self.structure(noteIds=[]), {"topics": []}):
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                self.call_service("subject_structure_service", payload)

    def test_invalid_topic_shapes(self):
        for topic in (None, [], "word", {}, {"name": " "}, {"name": 7},
                      {"name": "Topic", "subtopics": None}, {"name": "Topic", "subtopics": {}},
                      {"name": "Topic", "subtopics": []}):
            with self.subTest(topic=topic), self.assertRaises(ValueError):
                self.call_service("subject_structure_service", {"topics": [topic]})
        for payload in (None, [], {}, {"topics": {}}, {"topics": None}):
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                self.call_service("subject_structure_service", payload)

    def test_invalid_subtopic_shapes(self):
        for subtopic in (None, [], "word", {}, {"name": " ", "noteIds": []},
                         {"name": 7, "noteIds": []}, {"name": "Subtopic"},
                         {"name": "Subtopic", "noteIds": None},
                         {"name": "Subtopic", "noteIds": "n1"},
                         {"name": "Subtopic", "noteIds": {}}):
            with self.subTest(subtopic=subtopic), self.assertRaises(ValueError):
                self.call_service("subject_structure_service", {
                    "topics": [{"name": "Topic", "subtopics": [subtopic]}]})


class StructureEndpointTests(SimpleTestCase):
    payload = {"subjectName": "Algorithms", "notes": [
        {"id": "n1", "title": "A note", "content": "Some source content"}]}

    def test_ai_errors_return_controlled_responses(self):
        errors = [
            (APIConnectionError(request=Mock()), 503),
            (APIStatusError("private details", response=Mock(status_code=429, request=Mock()), body=None), 502),
            (ValueError("missing notes"), 502),
        ]
        for error, status in errors:
            with self.subTest(error=type(error).__name__), patch(
                "concepts.views.generate_subject_structure", side_effect=error
            ):
                response = self.client.post("/api/concepts/generate-structure/", self.payload, content_type="application/json")
                self.assertEqual(response.status_code, status)
                self.assertIsInstance(response.json()["error"], str)
                self.assertNotIn("private details", response.content.decode())

    def test_valid_response_is_passed_through(self):
        structure = {"topics": [{"name": "T", "subtopics": [{"name": "S", "noteIds": ["n1"]}]}]}
        with patch("concepts.views.generate_subject_structure", return_value=structure):
            response = self.client.post("/api/concepts/generate-structure/", self.payload, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), structure)

    def test_invalid_requests_do_not_call_ai(self):
        for body in ([], None, {}, {"subjectName": "F", "notes": [None]},
                     {"subjectName": "F", "notes": [{"id": []}]},
                     {"subjectName": "F", "notes": self.payload["notes"] * 2}):
            import json
            with self.subTest(body=body), patch("concepts.views.generate_subject_structure") as ai:
                response = self.client.post("/api/concepts/generate-structure/", json.dumps(body), content_type="application/json")
                self.assertEqual(response.status_code, 400)
                ai.assert_not_called()

    def test_invalid_extraction_request_does_not_call_ai(self):
        for body in ([], {"text": "Text", "subtopics": [None]},
                     {"text": "Text", "subtopics": [{"id": [], "name": "Name"}]}):
            import json
            with self.subTest(body=body), patch("concepts.views.extract_concept_candidates") as ai:
                response = self.client.post("/api/concepts/extract/", json.dumps(body), content_type="application/json")
                self.assertEqual(response.status_code, 400)
                ai.assert_not_called()


class ConceptRetryTests(SimpleTestCase):
    def response(self, content, finish_reason="stop"):
        return Mock(choices=[Mock(message=Mock(content=content), finish_reason=finish_reason)])

    def test_invalid_candidate_then_valid_response_retries_once(self):
        from .concept_extraction_service import extract_concept_candidates
        client = Mock()
        client.chat.completions.create.side_effect = [
            self.response('{"candidates":[{"name":"secret-note-content"}]}'),
            self.response('{"candidates":[{"name":"Induksjon","type":"method","shortDefinition":"Definisjon","explanation":"Forklaring","subtopicIds":[]}]}'),
        ]
        with patch("concepts.concept_extraction_service.get_client", return_value=client), self.assertLogs(
            "concepts.concept_extraction_service", level="WARNING"
        ) as logs:
            result = extract_concept_candidates("secret-note-content", [])
        self.assertEqual(result[0]["name"], "Induksjon")
        self.assertEqual(client.chat.completions.create.call_count, 2)
        self.assertIn("invalid type", logs.output[0])
        self.assertNotIn("secret-note-content", " ".join(logs.output))
        retry_prompt = client.chat.completions.create.call_args.kwargs["messages"][0]["content"]
        self.assertIn("Forrige forsøk", retry_prompt)

    def test_repeated_invalid_responses_stop_after_two_calls(self):
        from .concept_extraction_service import extract_concept_candidates
        client = Mock()
        client.chat.completions.create.return_value = self.response('not json')
        with patch("concepts.concept_extraction_service.get_client", return_value=client), self.assertLogs(
            "concepts.concept_extraction_service", level="WARNING"
        ), self.assertRaises(ValueError):
            extract_concept_candidates("Note", [])
        self.assertEqual(client.chat.completions.create.call_count, 2)

    def test_valid_empty_candidates_are_not_retried(self):
        from .concept_extraction_service import extract_concept_candidates
        client = Mock()
        client.chat.completions.create.return_value = self.response('{"candidates":[]}')
        with patch("concepts.concept_extraction_service.get_client", return_value=client):
            self.assertEqual(extract_concept_candidates("Note", []), [])
        self.assertEqual(client.chat.completions.create.call_count, 1)

    def test_truncated_and_empty_choices_are_retried(self):
        from .concept_extraction_service import extract_concept_candidates
        for first in (self.response('{"candidates":[]}', "length"), Mock(choices=[])):
            client = Mock()
            client.chat.completions.create.side_effect = [first, self.response('{"candidates":[]}')]
            with self.subTest(first=first), patch("concepts.concept_extraction_service.get_client", return_value=client), self.assertLogs(
                "concepts.concept_extraction_service", level="WARNING"
            ):
                self.assertEqual(extract_concept_candidates("Note", []), [])
            self.assertEqual(client.chat.completions.create.call_count, 2)

    def test_transport_errors_do_not_get_additional_validation_retries(self):
        from .concept_extraction_service import extract_concept_candidates
        for error in (APIConnectionError(request=Mock()), APIStatusError(
            "Provider error", response=Mock(status_code=401, request=Mock()), body=None
        )):
            client = Mock()
            client.chat.completions.create.side_effect = error
            with self.subTest(error=type(error).__name__), patch("concepts.concept_extraction_service.get_client", return_value=client), self.assertRaises(type(error)):
                extract_concept_candidates("Note", [])
            self.assertEqual(client.chat.completions.create.call_count, 1)

    def test_exhausted_validation_has_specific_api_code(self):
        client = Mock()
        client.chat.completions.create.return_value = self.response('{"candidates":[null]}')
        with patch("concepts.concept_extraction_service.get_client", return_value=client), self.assertLogs(
            "concepts.concept_extraction_service", level="WARNING"
        ):
            response = self.client.post('/api/concepts/extract/', {"text": "Note", "subtopics": []}, content_type='application/json')
        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.json()["code"], "invalid_ai_response")
        self.assertEqual(client.chat.completions.create.call_count, 2)
