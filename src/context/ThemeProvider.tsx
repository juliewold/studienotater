import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "../hooks/useTheme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("studienotater-theme") === "dark"; } catch { return false; }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try { localStorage.setItem("studienotater-theme", dark ? "dark" : "light"); } catch { /* Theme works without storage. */ }
  }, [dark]);
  return <ThemeContext.Provider value={{ dark, toggleTheme: () => setDark(value => !value) }}>{children}</ThemeContext.Provider>;
};
