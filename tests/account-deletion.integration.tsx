// Real components against ONLY the separate local Supabase integration stack.
// Vite must run with a dedicated envDir containing locally generated keys.
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

const url = new URL(import.meta.env.VITE_SUPABASE_URL);
if (url.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(url.hostname)) {
  throw Error("Only isolated local Supabase is allowed on this integration page");
}
// Validate BEFORE importing anything that initializes a Supabase client.
const { AuthProvider } = await import("../src/context/AuthContext/AuthProvider");
const { SettingsPage } = await import("../src/pages/SettingsPage/SettingsPage");
const { LoginPage } = await import("../src/pages/auth/LoginPage/LoginPage");
createRoot(document.getElementById("root")!).render(
  <AuthProvider><HashRouter><Routes>
    <Route path="/logg-inn" element={<LoginPage />} />
    <Route path="*" element={<SettingsPage />} />
  </Routes></HashRouter></AuthProvider>,
);
