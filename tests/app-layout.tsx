import { useState } from "react";
import { createRoot } from "react-dom/client";
import type { User } from "@supabase/supabase-js";
import App from "../src/App";
import { AuthContext } from "../src/context/AuthContext/AuthContext";
import "../src/index.css";
import "../src/styles/global.css";
import "../src/styles/containers.css";
import "../src/styles/theme.css";

// All requests are intercepted. Subject edits and sign-out affect this fixture only.
let selected = [{ id: "selected-statistics", subject_id: "tma4240", custom_code: null, custom_name: null }];
window.fetch = async (input, init) => {
  const url = new URL(String(input));
  const table = url.pathname.split("/").pop();
  if (table === "semester_subjects") {
    if (init?.method === "DELETE") selected = selected.filter(item => `eq.${item.subject_id}` !== url.searchParams.get("subject_id"));
    if (init?.method === "POST") selected.push({ id: "selected-test", ...JSON.parse(String(init.body)) });
    return Response.json(selected);
  }
  if (table === "profiles") return Response.json({ username: "Teststudent" });
  return Response.json([]);
};
const fixtureUser = { id: "layout-test", email: "student@example.test", user_metadata: { full_name: "Teststudent" } } as User;
export function Preview() {
  const [user, setUser] = useState<User | null>(fixtureUser);
  return <AuthContext.Provider value={{ user, role: "admin", isAdmin: !!user, isLoading: false, signOut: async () => setUser(null) }}><App /></AuthContext.Provider>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
