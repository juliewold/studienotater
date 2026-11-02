import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import type { User } from "@supabase/supabase-js";
// Block all outbound fetches before initializing the real modules. No Auth,
// Data API, Edge Function or LLM requests can reach a real service in this test.
let calls = 0;
let resolveDeletion: ((value: Response) => void) | undefined;
window.fetch = async (input) => {
 const url = new URL(input instanceof Request ? input.url : String(input));
 if (url.pathname === "/functions/v1/delete-account") {
  calls++;
  return await new Promise<Response>(resolve => { resolveDeletion = resolve; });
 }
 throw Error("Outbound network forbidden in isolated UI tests");
};
const { supabase } = await import("../src/lib/supabase");
const { SettingsPage } = await import("../src/pages/SettingsPage/SettingsPage");
const { AuthContext } = await import("../src/context/AuthContext/AuthContext");
const user = { id: "00000000-0000-0000-0000-000000000001", email: "synthetic@example.invalid", is_anonymous: false } as User;
const root = createRoot(document.querySelector("#root")!);
const checks: string[] = [];
const check = (condition: unknown, label: string) => { if (!condition) throw Error(label); checks.push(label); };
const until = async (test: () => unknown) => { for (let n = 0; n < 100; n++) { if (test()) return; await new Promise(resolve => setTimeout(resolve, 20)); } throw Error("UI timeout"); };
const input = (id: string, value: string) => {
 const element = document.getElementById(id) as HTMLInputElement;
 Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(element, value);
 element.dispatchEvent(new Event("input", { bubbles: true }));
};
supabase.auth.getUser = async () => ({ data: { user }, error: null });
supabase.auth.signInWithPassword = (async () => ({ data: { user, session: { access_token: "isolated-token" } }, error: null })) as typeof supabase.auth.signInWithPassword;
supabase.auth.signOut = async () => ({ error: { message: "Simulated browser cleanup failure" } }) as Awaited<ReturnType<typeof supabase.auth.signOut>>;
const render = (role: "admin" | "user", signedIn = true) => {
 flushSync(() => root.render(<AuthContext.Provider value={{ user: signedIn ? user : null, role, isAdmin: role === "admin", isLoading: false, signOut: async () => {} }}><SettingsPage key={`${role}-${signedIn}`} /></AuthContext.Provider>));
};
try {
 check(import.meta.env.VITE_ACCOUNT_DELETION_ENABLED === "true", "UI interaction suite requires the isolated enabled build");
 render("user", false);
 check(!document.querySelector(".delete-account-button"), "Anonymous users are asked to log in");
 for (const role of ["user", "admin"] as const) {
  render(role);
  check(!!document.querySelector(".delete-account-button"), `${role} can start self-deletion`);
 }
 render("user");
 (document.querySelector(".delete-account-button") as HTMLButtonElement).click();
 await until(() => document.querySelector("#delete-confirmation"));
 check((document.querySelector("button[type=submit]") as HTMLButtonElement).disabled, "Deletion requires confirmation and password");
 input("delete-confirmation", "SLETT"); input("delete-password", "synthetic-password");
 await until(() => !(document.querySelector("button[type=submit]") as HTMLButtonElement).disabled);
 (document.querySelector(".account-deletion-actions button[type=button]") as HTMLButtonElement).click();
 await until(() => !document.querySelector("#delete-password"));
 check(calls === 0, "Cancel makes no deletion request and removes the password input");
 (document.querySelector(".delete-account-button") as HTMLButtonElement).click();
 await until(() => document.querySelector("#delete-password"));
 check((document.querySelector("#delete-password") as HTMLInputElement).value === "", "Reopened confirmation has no retained password");
 input("delete-confirmation", "SLETT"); input("delete-password", "synthetic-password");
 await until(() => !(document.querySelector("button[type=submit]") as HTMLButtonElement).disabled);
 const form = document.querySelector(".account-deletion form")!;
 form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
 form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
 await until(() => calls === 1);
 check((document.querySelector("button[type=submit]") as HTMLButtonElement).disabled, "Duplicate submissions are blocked");
 resolveDeletion!(Response.json({ code: "STORAGE_REVIEW_REQUIRED" }, { status: 409 }));
 await until(() => document.querySelector("[role=alert]")?.textContent?.includes("eier opplastede filer"));
 check(true, "Storage ownership failure is shown without claiming deletion");
 input("delete-password", "synthetic-password");
 await until(() => !(document.querySelector("button[type=submit]") as HTMLButtonElement).disabled);
 form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
 await until(() => calls === 2);
 resolveDeletion!(Response.json({ code: "ACCOUNT_DELETED" }));
 await until(() => document.querySelector("[role=alert]")?.textContent?.includes("Kontoen er slettet"));
 check(!document.querySelector("button[type=submit]"), "Confirmed deletion is not retried when local cleanup fails");
 document.querySelector("#results")!.textContent = checks.map(label => `PASS: ${label}`).join("\n");
} catch (error) {
 document.querySelector("#results")!.textContent = checks.map(label => `PASS: ${label}`).join("\n") + `\nFAIL: ${String(error)}`;
}
