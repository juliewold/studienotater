import io
import json
from contextlib import ExitStack
from unittest.mock import Mock, patch
from urllib.error import HTTPError, URLError

from django.test import SimpleTestCase, override_settings

from .auth import _NoRedirects
from .auth_test_utils import USER_ID


ENDPOINTS = [
    ("extract/", "extract_concept_candidates", {"text": "Note"}, [], {"candidates": []}),
    ("generate-structure/", "generate_subject_structure", {
        "subjectName": "Fag", "notes": [{"id": "n1", "title": "Tittel", "content": "Note"}],
    }, {"topics": []}, {"topics": []}),
    ("generate-flashcards/", "generate_flashcards", {"text": "Note", "subtopics": []}, [], {"flashcards": []}),
    ("summarize-note/", "summarize_note", {"text": "Note"}, "Kort", {"summary": "Kort"}),
    ("explain-selection/", "explain_selected_text", {"text": "Note"}, "Forklaring", {"explanation": "Forklaring"}),
]


@override_settings(SUPABASE_URL="https://project.supabase.co", SUPABASE_ANON_KEY="public-test-key")
class AIAuthenticationTests(SimpleTestCase):
    def setUp(self):
        self.opener = self.enterContext(patch("concepts.auth.build_opener")).return_value
        stack = self.enterContext(ExitStack())
        self.ai = {name: stack.enter_context(patch(f"concepts.views.{name}", return_value=result))
                   for _, name, _, result, _ in ENDPOINTS}

    def replies(self, *payloads):
        responses = []
        for payload in payloads:
            response = Mock()
            response.__enter__ = Mock(return_value=io.StringIO(json.dumps(payload)))
            response.__exit__ = Mock(return_value=False)
            responses.append(response)
        self.opener.open.side_effect = responses

    def post(self, endpoint, body, token="valid-token"):
        headers = {} if token is None else {"HTTP_AUTHORIZATION": f"Bearer {token}"}
        return self.client.post(f"/api/concepts/{endpoint}", body,
                                content_type="application/json", **headers)

    def assert_no_ai(self):
        for ai in self.ai.values():
            ai.assert_not_called()

    def test_missing_and_malformed_authorization_on_every_endpoint(self):
        for endpoint, _, body, _, _ in ENDPOINTS:
            for header in (None, "", "Basic token", "Bearer", "Bearer a b"):
                with self.subTest(endpoint=endpoint, header=header):
                    headers = {} if header is None else {"HTTP_AUTHORIZATION": header}
                    result = self.client.post(f"/api/concepts/{endpoint}", body,
                                              content_type="application/json", **headers)
                    self.assertEqual(result.status_code, 401)
                    self.assertEqual(result.headers["WWW-Authenticate"], "Bearer")
        self.opener.open.assert_not_called()
        self.assert_no_ai()

    def test_invalid_expired_and_foreign_project_tokens_are_rejected_by_auth(self):
        for endpoint, _, body, _, _ in ENDPOINTS:
            for token in ("invalid-signature", "expired-token", "other-project-token"):
                with self.subTest(endpoint=endpoint, token=token):
                    self.opener.open.side_effect = HTTPError("url", 401, "private details", {}, None)
                    self.assertEqual(self.post(endpoint, body, token).status_code, 401)
        self.assert_no_ai()

    def test_admin_can_use_every_endpoint_with_existing_response_format(self):
        for endpoint, name, body, _, expected in ENDPOINTS:
            with self.subTest(endpoint=endpoint):
                self.replies({"id": USER_ID}, [{"id": USER_ID, "role": "admin"}])
                result = self.post(endpoint, body)
                self.assertEqual(result.status_code, 200)
                self.assertEqual(result.json(), expected)
                self.ai[name].assert_called_once()
        requests = [call.args[0] for call in self.opener.open.call_args_list]
        for request in requests:
            self.assertEqual(request.get_header("Authorization"), "Bearer valid-token")
            self.assertEqual(request.get_header("Apikey"), "public-test-key")
            self.assertTrue(request.full_url.startswith("https://project.supabase.co/"))
        self.assertEqual(requests[0].full_url, "https://project.supabase.co/auth/v1/user")
        self.assertIn(f"id=eq.{USER_ID}", requests[1].full_url)

    def test_role_comes_from_verified_users_profile_not_metadata_or_body(self):
        for endpoint, _, body, _, _ in ENDPOINTS:
            for profiles in ([], [{"id": USER_ID, "role": "user"}],
                             [{"id": "another-user", "role": "admin"}]):
                with self.subTest(endpoint=endpoint, profiles=profiles):
                    self.replies({"id": USER_ID, "user_metadata": {"role": "admin"}}, profiles)
                    result = self.post(endpoint, {**body, "role": "admin", "userId": "another-user"})
                    self.assertEqual(result.status_code, 403)
        self.assert_no_ai()

    def test_anonymous_supabase_users_are_forbidden(self):
        self.replies({"id": USER_ID, "is_anonymous": True})
        self.assertEqual(self.post("summarize-note/", {"text": "Note"}).status_code, 403)
        self.assertEqual(self.opener.open.call_count, 1)
        self.assert_no_ai()

    def test_auth_and_role_service_failures_fail_closed_without_details(self):
        for failure in (URLError("secret token"), TimeoutError("private"),
                        HTTPError("url", 500, "private", {}, None)):
            for role_lookup in (False, True):
                with self.subTest(failure=failure, role_lookup=role_lookup):
                    self.replies({"id": USER_ID})
                    responses = list(self.opener.open.side_effect)
                    self.opener.open.side_effect = responses + [failure] if role_lookup else [failure]
                    result = self.post("summarize-note/", {"text": "Note"})
                    self.assertEqual(result.status_code, 503)
                    self.assertNotIn("private", result.content.decode())
                    self.assertNotIn("secret", result.content.decode())
        self.assert_no_ai()

    def test_missing_or_malformed_server_configuration_fails_closed(self):
        for url, key in (("", "key"), ("http://project.supabase.co", "key"),
                         ("https://project.supabase.co", ""),
                         ("https://user:password@project.supabase.co", "key")):
            with self.subTest(url=url), override_settings(SUPABASE_URL=url, SUPABASE_ANON_KEY=key):
                self.assertEqual(self.post("summarize-note/", {"text": "Note"}).status_code, 503)
        self.opener.open.assert_not_called()
        self.assert_no_ai()

    def test_malformed_upstream_identity_and_profiles_fail_closed(self):
        for user, profiles in (({}, []), ({"id": "not-a-uuid"}, []),
                               ({"id": USER_ID}, {"role": "admin"})):
            with self.subTest(user=user, profiles=profiles):
                self.replies(user, profiles)
                self.assertEqual(self.post("summarize-note/", {"text": "Note"}).status_code, 503)
        self.assert_no_ai()

    def test_redirects_cannot_receive_credentials(self):
        self.assertIsNone(_NoRedirects().redirect_request(None, None, 302, "", {}, "https://other.invalid"))
        self.opener.open.side_effect = HTTPError("url", 302, "redirect", {}, None)
        self.assertEqual(self.post("summarize-note/", {"text": "Note"}).status_code, 503)
        self.assert_no_ai()

    def test_invalid_json_from_supabase_fails_closed(self):
        response = Mock()
        response.__enter__ = Mock(return_value=io.StringIO("not JSON: private details"))
        response.__exit__ = Mock(return_value=False)
        self.opener.open.side_effect = [response]
        result = self.post("summarize-note/", {"text": "Note"})
        self.assertEqual(result.status_code, 503)
        self.assertNotIn("private", result.content.decode())
        self.assert_no_ai()

    def test_cookie_session_does_not_replace_bearer_token(self):
        self.client.cookies["sessionid"] = "django-session"
        result = self.post("summarize-note/", {"text": "Note"}, token=None)
        self.assertEqual(result.status_code, 401)
        self.opener.open.assert_not_called()
        self.assert_no_ai()

    def test_cors_preflight_allows_authorization_header(self):
        response = self.client.options("/api/concepts/extract/", HTTP_ORIGIN="http://localhost:5173",
            HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST", HTTP_ACCESS_CONTROL_REQUEST_HEADERS="authorization,content-type")
        self.assertEqual(response.status_code, 200)
        self.assertIn("authorization", response.headers["access-control-allow-headers"])
        self.opener.open.assert_not_called()
