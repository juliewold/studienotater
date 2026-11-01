type Config = { url: string; publicKey: string; secretKey: string; enabled: boolean; origins: string[]; allowLocal?: boolean };
type Fetch = typeof fetch;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Dependency injection keeps all destructive tests offline with synthetic users.
export function createDeleteAccountHandler(config: Config, transport: Fetch = fetch, now = Date.now) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("Origin");
    const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store", Vary: "Origin" });
    if (origin && config.origins.includes(origin)) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Access-Control-Allow-Headers", "authorization, apikey, content-type, x-client-info");
      headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    }
    const reply = (status: number, code: string) => new Response(JSON.stringify({ code }), { status, headers });
    if (origin && !config.origins.includes(origin)) return reply(403, "ORIGIN_DENIED");
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return reply(405, "METHOD_NOT_ALLOWED");
    if (!config.enabled || !config.publicKey || !config.secretKey) return reply(503, "NOT_AVAILABLE");
    let base: URL;
    try {
      base = new URL(config.url);
      const local = config.allowLocal && base.protocol === "http:"
        && ["localhost", "127.0.0.1", "kong", "host.docker.internal"].includes(base.hostname);
      if ((!local && base.protocol !== "https:") || base.username || base.password || base.search || base.hash || base.pathname !== "/") throw Error();
    } catch { return reply(503, "NOT_AVAILABLE"); }
    const bearer = request.headers.get("Authorization")?.match(/^Bearer ([^\s]+)$/i)?.[1];
    if (!bearer) return reply(401, "UNAUTHENTICATED");
    if (new URL(request.url).search || request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") return reply(400, "INVALID_REQUEST");
    try {
      if (Number(request.headers.get("Content-Length")) > 1024) return reply(400, "INVALID_REQUEST");
      const reader = request.body?.getReader();
      if (!reader) return reply(400, "INVALID_REQUEST");
      const chunks: Uint8Array[] = [];
      let length = 0;
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        length += chunk.value.length;
        if (length > 1024) { await reader.cancel(); return reply(400, "INVALID_REQUEST"); }
        chunks.push(chunk.value);
      }
      const bytes = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      const body = JSON.parse(text);
      // No target ID, email, role or arbitrary options may come from the caller.
      if (!body || Object.keys(body).length !== 1 || body.confirmation !== "DELETE") return reply(400, "INVALID_REQUEST");
    } catch { return reply(400, "INVALID_REQUEST"); }
    const call = (path: string, init: RequestInit) => transport(base.origin + path, {
      ...init, redirect: "error", signal: AbortSignal.timeout(10000),
    });
    try {
      const verified = await call("/auth/v1/user", { headers: { apikey: config.publicKey, Authorization: `Bearer ${bearer}` } });
      if (verified.status === 401 || verified.status === 403) return reply(401, "UNAUTHENTICATED");
      if (!verified.ok) return reply(503, "NOT_AVAILABLE");
      const user = await verified.json();
      if (!uuid.test(user?.id ?? "") || user.is_anonymous === true) return reply(403, "REGISTERED_ACCOUNT_REQUIRED");
      // Inspect claims ONLY after Auth has verified this exact token. Refreshing
      // a token changes iat, but not its original authentication-method timestamp.
      let claims;
      try { claims = JSON.parse(atob(bearer.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))); }
      catch { return reply(401, "UNAUTHENTICATED"); }
      if (claims.sub !== user.id) return reply(401, "UNAUTHENTICATED");
      const seconds = now() / 1000;
      if (!Array.isArray(claims.amr) || !claims.amr.some((entry: { method?: string; timestamp?: number }) =>
        entry?.method === "password" && typeof entry.timestamp === "number"
        && entry.timestamp <= seconds + 30 && entry.timestamp >= seconds - 300)) return reply(409, "REAUTHENTICATION_REQUIRED");
      if (user.factors?.some((factor: { status: string }) => factor.status === "verified") && claims.aal !== "aal2") return reply(409, "MFA_REQUIRED");
      const adminHeaders: Record<string, string> = { apikey: config.secretKey, "Content-Type": "application/json" };
      // Modern secret keys are API keys, not JWTs. The gateway maps apikey to
      // service_role; never put an sb_secret value in a Bearer JWT header.
      if (!config.secretKey.startsWith("sb_secret_")) adminHeaders.Authorization = `Bearer ${config.secretKey}`;
      const preflight = await call("/rest/v1/rpc/account_deletion_preflight", {
        method: "POST", headers: adminHeaders, body: JSON.stringify({ p_user_id: user.id }),
      });
      if (!preflight.ok) {
        const problem = await preflight.json().catch(() => null);
        if (problem?.message === "ACCOUNT_STORAGE_OWNERSHIP") return reply(409, "STORAGE_REVIEW_REQUIRED");
        return reply(503, "SCHEMA_REVIEW_REQUIRED");
      }
      // Hard deletion through the supported Auth API. The installed BEFORE DELETE
      // trigger cleans personal rows in this same transaction, or rolls it all back.
      const deleted = await call(`/auth/v1/admin/users/${user.id}`, {
        method: "DELETE", headers: adminHeaders, body: JSON.stringify({ should_soft_delete: false }),
      });
      if (!deleted.ok) return reply(503, "DELETION_NOT_CONFIRMED");
      // An earlier BEFORE DELETE trigger can skip the Auth row before our
      // cleanup trigger runs. A 2xx DELETE alone is not proof of deletion.
      const remaining = await call(`/auth/v1/admin/users/${user.id}`, {
        headers: adminHeaders,
      });
      const missingUser = await remaining.json().catch(() => null);
      if (remaining.status !== 404 || (missingUser?.code !== "user_not_found"
        && missingUser?.error_code !== "user_not_found")) return reply(503, "DELETION_NOT_CONFIRMED");
      return reply(200, "ACCOUNT_DELETED");
    } catch {
      // Never log credentials, provider bodies, passwords or personal data. A
      // timeout after DELETE is an unknown outcome; do not claim a rollback.
      return reply(503, "DELETION_NOT_CONFIRMED");
    }
  };
}
