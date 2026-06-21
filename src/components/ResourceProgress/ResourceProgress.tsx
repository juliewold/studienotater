import "./ResourceProgress.css";
import { useEffect, useState } from "react";

type ResourceProgressProps = {
  resourceId: string;
  resourceType?: "lest" | "sett";
};

export const ResourceProgress = ({
  resourceId,
  resourceType = "lest",
}: ResourceProgressProps) => {
  const storageKey = `resource-progress-${resourceId}`;

  const [completed, setCompleted] = useState(() => {
    return localStorage.getItem(`${storageKey}-completed`) === "true";
  });

  const [rating, setRating] = useState(() => {
    return Number(localStorage.getItem(`${storageKey}-rating`)) || 0;
  });

  useEffect(() => {
    localStorage.setItem(`${storageKey}-completed`, String(completed));
  }, [completed, storageKey]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}-rating`, String(rating));
  }, [rating, storageKey]);

  return (
    <section className="resource-progress">
      <label className="resource-completed">
        <input
          type="checkbox"
          checked={completed}
          onChange={(event) => setCompleted(event.target.checked)}
        />
        <span>Marker som {resourceType === "sett" ? "sett" : "lest"}</span>
      </label>

      <div className="resource-rating">
        <p>Hvor godt skjønte du dette?</p>

        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(rating === star ? 0 : star)}
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
