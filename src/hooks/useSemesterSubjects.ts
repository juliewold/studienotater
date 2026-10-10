import { createContext, useContext } from "react";
import type { useSemesterSubjectsState } from "./useSemesterSubjectsState";

export const SemesterSubjectsContext = createContext<ReturnType<typeof useSemesterSubjectsState> | null>(null);

export const useSemesterSubjects = () => {
  const value = useContext(SemesterSubjectsContext);
  if (!value) throw new Error("SemesterSubjectsProvider is missing");
  return value;
};
