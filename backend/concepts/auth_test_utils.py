from unittest.mock import patch

from django.test import SimpleTestCase


USER_ID = "12345678-1234-4234-8234-123456789abc"


class AuthenticatedAITestCase(SimpleTestCase):
    """Existing AI behavior tests run as an authenticated administrator."""
    def setUp(self):
        super().setUp()
        self.client.defaults["HTTP_AUTHORIZATION"] = "Bearer test-access-token"
        mock = self.enterContext(patch("concepts.auth._supabase_get"))
        mock.side_effect = lambda path, *args, **kwargs: (
            {"id": USER_ID} if path == "/auth/v1/user"
            else [{"id": USER_ID, "role": "admin"}]
        )
