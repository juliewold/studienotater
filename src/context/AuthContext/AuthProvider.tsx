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

  useEffect(() => {
    let active = true;
    let version = 0;
    let currentUserId: string | null | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        const requestVersion = ++version;
        clearTimeout(timer);
        setUser(currentUser);
        // Refreshing the same session must not unmount an open note editor.
        if (currentUserId !== (currentUser?.id ?? null)) {
          setRole(null);
          setIsLoading(Boolean(currentUser));
        }
        currentUserId = currentUser?.id ?? null;
        if (!currentUser) return;

        // Supabase holds its auth lock while notifying listeners. Query the
        // profile in a later task so token refresh cannot deadlock this client.
        timer = setTimeout(() => {
          const loadRole = async () => {
            let nextRole: UserRole = "user";
            try {
              const { data, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", currentUser.id)
                .single();
              if (error) throw error;
              nextRole = data.role === "admin" ? "admin" : "user";
            } catch (error) {
              console.error("Kunne ikke hente brukerrolle:", error);
            }
            if (active && requestVersion === version) {
              setRole(nextRole);
              setIsLoading(false);
            }
          };
          void loadRole();
        }, 0);
      },
    );

    return () => {
      active = false;
      clearTimeout(timer);
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
