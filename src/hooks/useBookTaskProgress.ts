import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext/AuthContext";
import {
  getCompletedBookTaskIds,
  setBookTaskCompleted,
} from "../services/study/booksService";

export function useBookTaskProgress() {
  const { user } = useContext(AuthContext);

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTaskProgress = async () => {
      if (!user) {
        setCompletedTaskIds([]);
        setIsLoading(false);
        return;
      }

      try {
        const taskIds = await getCompletedBookTaskIds(user.id);
        setCompletedTaskIds(taskIds);
      } catch (error) {
        console.error("Kunne ikke hente bokoppgavefremdrift:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTaskProgress();
  }, [user]);

  const toggleTask = async (taskId: string) => {
    if (!user) {
      return;
    }

    const isCompleted = completedTaskIds.includes(taskId);

    const updatedTaskIds = isCompleted
      ? completedTaskIds.filter((id) => id !== taskId)
      : [...completedTaskIds, taskId];

    setCompletedTaskIds(updatedTaskIds);

    try {
      await setBookTaskCompleted(user.id, taskId, !isCompleted);
    } catch (error) {
      console.error("Kunne ikke lagre bokoppgavefremdrift:", error);
      setCompletedTaskIds(completedTaskIds);
    }
  };

  return {
    completedTaskIds,
    toggleTask,
    isLoading,
  };
}
