import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "../../lib/supabase";
import { AuthContext } from "./AuthContext";
import type { UserRole } from "./types";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserRole = async (currentUser: User | null) => {
    if (!currentUser) {
      setRole(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (error) {
      console.error("Kunne ikke hente brukerrolle:", error);
      setRole("user");
      return;
    }

    setRole(data.role === "admin" ? "admin" : "user");
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;

      setUser(currentUser);
      await loadUserRole(currentUser);
      setIsLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);
      await loadUserRole(currentUser);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
    }
  };

  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
