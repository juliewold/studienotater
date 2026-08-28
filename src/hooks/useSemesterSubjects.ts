import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import {
  addSemesterSubject,
  getSemesterSubjects,
  removeSemesterSubject,
  type SemesterSubject,
} from "../services/subjects/semesterSubjectsService";

export const useSemesterSubjects = () => {
  const { user } = useContext(AuthContext);

  const [semesterSubjects, setSemesterSubjects] = useState<SemesterSubject[]>(
    [],
  );
  const [isLoadingSemesterSubjects, setIsLoadingSemesterSubjects] =
    useState(true);

  useEffect(() => {
    const loadSemesterSubjects = async () => {
      if (!user) {
        setSemesterSubjects([]);
        setIsLoadingSemesterSubjects(false);
        return;
      }

      try {
        const loadedSubjects = await getSemesterSubjects(user.id);
        setSemesterSubjects(loadedSubjects);
      } catch (error) {
        console.error("Kunne ikke hente semesterfag:", error);
      } finally {
        setIsLoadingSemesterSubjects(false);
      }
    };

    loadSemesterSubjects();
  }, [user]);

  const isSelected = (subjectId: string) => {
    return semesterSubjects.some(
      (subject) => subject.subjectId === subjectId,
    );
  };

  const toggleSubject = async (subjectId: string) => {
    if (!user) {
      return;
    }

    const existingSubject = semesterSubjects.find(
      (subject) => subject.subjectId === subjectId,
    );

    try {
      if (existingSubject) {
        await removeSemesterSubject(user.id, subjectId);

        setSemesterSubjects((currentSubjects) =>
          currentSubjects.filter(
            (subject) => subject.subjectId !== subjectId,
          ),
        );

        return;
      }

      await addSemesterSubject(user.id, subjectId);

      const loadedSubjects = await getSemesterSubjects(user.id);
      setSemesterSubjects(loadedSubjects);
    } catch (error) {
      console.error("Kunne ikke oppdatere semesterfag:", error);
    }
  };

  const addCustomSubject = async (
    subjectId: string,
    customCode: string,
    customName: string,
  ) => {
    if (!user) {
      return;
    }

    try {
      await addSemesterSubject(
        user.id,
        subjectId,
        customCode,
        customName,
      );

      const loadedSubjects = await getSemesterSubjects(user.id);
      setSemesterSubjects(loadedSubjects);
    } catch (error) {
      console.error("Kunne ikke legge til eget fag:", error);
    }
  };

  const removeCustomSubject = async (subjectId: string) => {
    if (!user) {
      return;
    }

    try {
      await removeSemesterSubject(user.id, subjectId);

      setSemesterSubjects((currentSubjects) =>
        currentSubjects.filter(
          (subject) => subject.subjectId !== subjectId,
        ),
      );
    } catch (error) {
      console.error("Kunne ikke fjerne eget fag:", error);
    }
  };

  return {
    semesterSubjects,
    isLoadingSemesterSubjects,
    isSelected,
    toggleSubject,
    addCustomSubject,
    removeCustomSubject,
  };
};