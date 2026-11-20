import "./FolderProgressSummary.css";
import { RatingStars } from "../../common/RatingStars/RatingStars";
import type { FolderProgress } from "../../../services/notes/folderProgress";

type FolderProgressSummaryProps = {
  progress: FolderProgress;
};

// Read count, a bar and the average star rating. Spans only, so it can sit inside links.
export const FolderProgressSummary = ({ progress }: FolderProgressSummaryProps) => {
  if (progress.noteCount === 0) {
    return null;
  }

  const readPercent = Math.round((progress.readCount / progress.noteCount) * 100);
  const averageText = progress.averageRating.toFixed(1).replace(".", ",");

  return (
    <span className="folder-progress">
      <span
        className="folder-progress-bar"
        role="progressbar"
        aria-label={`${progress.readCount} av ${progress.noteCount} notater lest`}
        aria-valuemin={0}
        aria-valuemax={progress.noteCount}
        aria-valuenow={progress.readCount}
      >
        <span className="folder-progress-fill" style={{ width: `${readPercent}%` }} />
      </span>

      <span className="folder-progress-meta">
        <span>
          {progress.readCount} av {progress.noteCount} lest
        </span>

        <span className="folder-progress-stars">
          <RatingStars value={Math.round(progress.averageRating)} total={5} />

          {progress.ratedCount > 0 && <span>{averageText}</span>}
        </span>
      </span>
    </span>
  );
};
