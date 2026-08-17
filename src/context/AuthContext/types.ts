import type { User } from "@supabase/supabase-js";

export type UserRole = "user" | "admin";

export type AuthContextType = {
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
};