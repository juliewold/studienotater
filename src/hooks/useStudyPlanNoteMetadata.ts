import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { createStudyPlanNoteMetadataLoader } from "../services/study/studyPlanNotesService";

export const useStudyPlanNoteMetadata = () => {
  const { user, role } = useContext(AuthContext);
  const scope = JSON.stringify([user?.id ?? null, role]);
  return useMemo(() => createStudyPlanNoteMetadataLoader(scope), [scope]);
};
