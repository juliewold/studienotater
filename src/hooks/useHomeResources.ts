import { useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { useSemesterSubjects } from "./useSemesterSubjects";
import { createHomeResourcesStore, getHomeWeekStart } from "../services/home/homeResourcesService";

export const useHomeResources = () => {
  const { user, role } = useContext(AuthContext);
  const { semesterSubjects } = useSemesterSubjects();
  // Names, array identity and display order do not affect the database selection.
  const scopeKey = JSON.stringify({
    userId: user?.id ?? null, role,
    subjectIds: [...new Set(semesterSubjects.map(subject => subject.subjectId))].sort(),
  });
  const weekStart = getHomeWeekStart();
  const store = useMemo(() => {
    const { userId, subjectIds } = JSON.parse(scopeKey) as { userId: string | null; subjectIds: string[] };
    return createHomeResourcesStore(userId ? subjectIds : [], weekStart);
  }, [scopeKey, weekStart]);
  const resources = useSyncExternalStore(store.subscribe, store.getSnapshot);
  useEffect(() => { void store.ensureLoaded(); }, [store]);
  return resources;
};
