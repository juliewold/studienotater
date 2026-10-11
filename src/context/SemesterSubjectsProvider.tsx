import type { ReactNode } from "react";
import { SemesterSubjectsContext } from "../hooks/useSemesterSubjects";
import { useSemesterSubjectsState } from "../hooks/useSemesterSubjectsState";

export const SemesterSubjectsProvider = ({ children }: { children: ReactNode }) => {
  const value = useSemesterSubjectsState();
  return <SemesterSubjectsContext.Provider value={value}>{children}</SemesterSubjectsContext.Provider>;
};
