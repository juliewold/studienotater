import { createContext } from "react";
import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isAdmin: false,
  isLoading: true,
  signOut: async () => {},
});