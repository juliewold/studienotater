"""Authenticate AI requests with the configured Supabase project's Auth server."""
import json
from functools import wraps
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
from uuid import UUID

from django.conf import settings
from django.http import JsonResponse


class _NoRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class AuthenticationUnavailable(Exception):
    pass


class InvalidToken(Exception):
    pass


def _supabase_get(path, token, *, authenticating=False):
    base = settings.SUPABASE_URL.rstrip("/")
    parsed = urlsplit(base)
    if (parsed.scheme != "https" or not parsed.netloc or parsed.username
            or parsed.password or parsed.query or parsed.fragment or parsed.path
            or not settings.SUPABASE_ANON_KEY):
        raise AuthenticationUnavailable
    request = Request(base + path, headers={
        "apikey": settings.SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    })
    try:
        # Never forward credentials to a redirect target. No user-controlled URL.
        with build_opener(_NoRedirects()).open(request, timeout=10) as response:
            return json.load(response)
    except HTTPError as error:
        if authenticating and error.code in (401, 403):
            raise InvalidToken from None
        raise AuthenticationUnavailable from None
    except (URLError, TimeoutError, OSError, ValueError):
        raise AuthenticationUnavailable from None


def require_ai_admin(view):
    """All current AI tools are admin-only in the frontend; enforce that here too.

    Authorize from profiles.role, never editable Auth user_metadata. The existing
    protect_profile_admin_role migration must be installed in Supabase.
    """
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        parts = request.headers.get("Authorization", "").split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return _unauthorized()
        token = parts[1]
        try:
            # Auth verifies signature, expiry and project membership server-side.
            user = _supabase_get("/auth/v1/user", token, authenticating=True)
            if not isinstance(user, dict):
                raise AuthenticationUnavailable
            try:
                user_id = str(UUID(user["id"]))
            except (KeyError, ValueError, TypeError, AttributeError):
                raise AuthenticationUnavailable from None
            if user.get("is_anonymous") is True:
                return _forbidden()
            query = urlencode({"select": "id,role", "id": f"eq.{user_id}"})
            profiles = _supabase_get(f"/rest/v1/profiles?{query}", token)
            if not isinstance(profiles, list):
                raise AuthenticationUnavailable
            if (len(profiles) != 1 or not isinstance(profiles[0], dict)
                    or profiles[0].get("id") != user_id
                    or profiles[0].get("role") != "admin"):
                return _forbidden()
        except InvalidToken:
            return _unauthorized()
        except AuthenticationUnavailable:
            return JsonResponse({"error": "Kunne ikke kontrollere tilgang. Prøv igjen senere."}, status=503)
        return view(request, *args, **kwargs)
    return wrapped


def _unauthorized():
    response = JsonResponse({"error": "Du må være logget inn med en gyldig økt."}, status=401)
    response["WWW-Authenticate"] = "Bearer"
    return response


def _forbidden():
    return JsonResponse({"error": "Denne AI-funksjonen krever administratorrettigheter."}, status=403)
