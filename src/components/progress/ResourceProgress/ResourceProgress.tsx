import "./ResourceProgress.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import {
  getProgress,
  saveProgress,
} from "../../../services/progress/progressService";

type ResourceProgressProps = {
  resourceId: string;
  resourceType?: "lest" | "sett";
};

export const ResourceProgress = ({
  resourceId,
  resourceType = "lest",
}: ResourceProgressProps) => {
  const { user } = useContext(AuthContext);

  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setCompleted(false);
        setRating(0);
        setIsLoading(false);
        return;
      }

      try {
        const progress = await getProgress(
          user.id,
          resourceId,
          "resource",
        );

        setCompleted(progress.completed);
        setRating(progress.rating);
      } catch (error) {
        console.error("Kunne ikke hente fremdrift:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user, resourceId]);

  const handleCompletedChange = async (checked: boolean) => {
    if (!user) {
      return;
    }

    setCompleted(checked);

    try {
      await saveProgress(
        user.id,
        resourceId,
        "resource",
        checked,
        rating,
      );
    } catch (error) {
      console.error("Kunne ikke lagre fremdrift:", error);
      setCompleted(!checked);
    }
  };

  const handleRatingChange = async (star: number) => {
    if (!user) {
      return;
    }

    const newRating = rating === star ? 0 : star;
    const previousRating = rating;

    setRating(newRating);

    try {
      await saveProgress(
        user.id,
        resourceId,
        "resource",
        completed,
        newRating,
      );
    } catch (error) {
      console.error("Kunne ikke lagre vurdering:", error);
      setRating(previousRating);
    }
  };

  if (isLoading) {
    return (
      <section className="resource-progress">
        <p>Laster fremdrift...</p>
      </section>
    );
  }

  return (
    <section className="resource-progress">
      <label className="resource-completed">
        <input
          type="checkbox"
          checked={completed}
          onChange={(event) =>
            handleCompletedChange(event.target.checked)
          }
        />

        <span>
          Marker som {resourceType === "sett" ? "sett" : "lest"}
        </span>
      </label>

      <div className="resource-rating">
        <p>Hvor godt skjønte du dette?</p>

        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className={star <= rating ? `star-${rating}` : ""}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};