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
