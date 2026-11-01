import { createDeleteAccountHandler } from "./handler.ts";

Deno.serve(createDeleteAccountHandler({
  url: Deno.env.get("SUPABASE_URL") ?? "",
  publicKey: Deno.env.get("ACCOUNT_DELETION_PUBLIC_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  secretKey: Deno.env.get("ACCOUNT_DELETION_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  enabled: Deno.env.get("ACCOUNT_DELETION_ENABLED") === "true",
  allowLocal: Deno.env.get("ACCOUNT_DELETION_ALLOW_LOCAL") === "true",
  origins: (Deno.env.get("ACCOUNT_DELETION_ORIGINS") ?? "https://juliewold.github.io")
    .split(",").map(origin => origin.trim()).filter(Boolean),
}));
