from .auth_test_utils import AuthenticatedAITestCase


class InvalidRequestBodyTests(AuthenticatedAITestCase):
    """Bodies that are not valid UTF-8 JSON must get a 400, not a server error."""

    def test_invalid_utf8_body_is_a_bad_request_on_json_endpoints(self):
        body = b'\xff{"text": "Note", "subtopics": [], "notes": []}'
        for endpoint in ("extract/", "generate-structure/", "generate-flashcards/",
                         "summarize-note/", "explain-selection/"):
            with self.subTest(endpoint=endpoint):
                response = self.client.post(
                    f"/api/concepts/{endpoint}", body, content_type="application/json",
                )
                self.assertEqual(response.status_code, 400)
