import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import {
  getAllProgress,
  type ProgressItem,
} from "../services/progress/progressService";

export const useProgress = () => {
  const { user } = useContext(AuthContext);

  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setProgressItems([]);
        setIsLoadingProgress(false);
        return;
      }

      try {
        const loadedProgress = await getAllProgress(user.id);
        setProgressItems(loadedProgress);
      } catch (error) {
        console.error("Kunne ikke hente fremdrift:", error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user]);

  const getProgress = (
    itemId: string,
    itemType = "resource",
  ) => {
    return (
      progressItems.find(
        (progress) =>
          progress.itemId === itemId &&
          progress.itemType === itemType,
      ) ?? {
        completed: false,
        rating: 0,
      }
    );
  };

  return {
    progressItems,
    isLoadingProgress,
    getProgress,
  };
};